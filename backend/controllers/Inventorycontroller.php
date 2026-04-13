<?php
ob_start();
ini_set('display_errors', 0);
error_reporting(0);

$allowedOrigins = ['http://localhost:5173'];

//website
//https://cornflowerblue-skunk-618358.hostingersite.com/backend/controllers/
//local
//http://localhost/backend/controllers/
define("LINK_PATH", "http://localhost/backend/controllers/");

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/jwt.php';

$db   = new Database();
$conn = $db->connect();

header('Content-Type: application/json');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function sendResponse(int $code, bool $success, string $message, array $extra = []): void
{
    ob_clean();
    http_response_code($code);
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit();
}

function isMultipart(): bool
{
    if (!empty($_FILES)) return true;
    $ct = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
    return str_contains($ct, 'multipart/form-data');
}

try {
    $method   = $_SERVER['REQUEST_METHOD'];
    $resource = $_GET['resource'] ?? 'products';

    $data = isMultipart()
        ? $_POST
        : (json_decode(file_get_contents("php://input"), true) ?? []);

    $override = strtoupper($data['_method'] ?? '');
    if ($method === 'POST' && $override === 'PUT') {
        $method = 'PUT';
        unset($data['_method']);
    }

    if ($resource === 'categories') {
        if ($method === 'GET')    listCategories();
        if ($method === 'POST')   addCategory($data);
        if ($method === 'DELETE') deleteCategory($data);
        sendResponse(405, false, 'Method not allowed');
    }

    if ($method === 'GET')    listProducts();
    if ($method === 'POST')   addProduct($data);
    if ($method === 'PUT')    updateProduct($data);
    if ($method === 'DELETE') deleteProduct($data);

} catch (Throwable $e) {
    sendResponse(500, false, $e->getMessage());
}


// ─────────────────────────────────────────────────────────
// 🏷️  CATEGORIES
// ─────────────────────────────────────────────────────────

function listCategories(): void
{
    global $conn;
    $stmt = $conn->query("SELECT id, name FROM categories ORDER BY name ASC");
    sendResponse(200, true, 'Categories fetched', ['categories' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}

function addCategory(array $data): void
{
    global $conn;
    $name = trim($data['name'] ?? '');
    if (!$name) sendResponse(400, false, 'Category name is required');

    $check = $conn->prepare("SELECT id FROM categories WHERE name = ?");
    $check->execute([$name]);
    if ($check->fetch()) sendResponse(409, false, 'Category already exists');

    $stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
    $stmt->execute([$name]);
    sendResponse(201, true, 'Category added', [
        'category' => ['id' => (int) $conn->lastInsertId(), 'name' => $name]
    ]);
}

function deleteCategory(array $data): void
{
    global $conn;
    $id = (int) ($data['id'] ?? 0);
    if (!$id) sendResponse(400, false, 'Category ID required');

    $conn->prepare("UPDATE products SET category_id = NULL WHERE category_id = ?")->execute([$id]);
    $conn->prepare("DELETE FROM categories WHERE id = ?")->execute([$id]);
    sendResponse(200, true, 'Category deleted');
}


// ─────────────────────────────────────────────────────────
// 🖼️  IMAGE HELPER
// ─────────────────────────────────────────────────────────

function extractImage(): ?array
{
    if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) return null;

    $file     = $_FILES['image'];
    $maxBytes = 10 * 1024 * 1024;
    if ($file['size'] > $maxBytes) sendResponse(400, false, 'Image must be under 10 MB');

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($mime, $allowed)) sendResponse(400, false, 'Only JPG, PNG, GIF, and WEBP images are allowed');

    return [
        'blob' => file_get_contents($file['tmp_name']),
        'type' => $mime,
        'name' => basename($file['name']),
    ];
}


// ─────────────────────────────────────────────────────────
// 📋  LIST PRODUCTS
// ─────────────────────────────────────────────────────────

function listProducts(): void
{
    global $conn;

    $stmt = $conn->query("
        SELECT
            p.id, p.name, p.description, p.price, p.qty,
            p.image_name, p.image_type, p.image_blob,
            p.category_id,
            p.discount, p.totalprice,
            c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        ORDER BY p.id DESC
    ");

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = array_map(function ($p) {
        $imageUrl = null;
        if (!empty($p['image_blob']) && !empty($p['image_type'])) {
            $imageUrl = LINK_PATH . "getProductImage.php?id=" . $p['id'];
        }

        $qty    = (int) $p['qty'];
        $status = $qty === 0 ? 'Out of Stock' : ($qty <= 10 ? 'Low Stock' : 'Available');

        $price      = (float) $p['price'];
        $discount   = (int)   $p['discount'];
        $totalprice = (float) $p['totalprice'];

        return [
            'id'          => (int) $p['id'],
            'name'        => $p['name'],
            'description' => $p['description'] ?? '',
            'price'       => $price,
            'qty'         => $qty,
            'category_id' => $p['category_id'] ? (int) $p['category_id'] : null,
            'category'    => $p['category_name'] ?? 'Uncategorized',
            'status'      => $status,
            'image_url'   => $imageUrl,
            'image_name'  => $p['image_name'],
            'discount'    => $discount,
            'totalprice'  => $totalprice,
        ];
    }, $products);

    sendResponse(200, true, 'Products fetched', ['products' => $formatted]);
}


// ─────────────────────────────────────────────────────────
// ➕  ADD PRODUCT
// ─────────────────────────────────────────────────────────

function addProduct(array $data): void
{
    global $conn;

    $name        = trim($data['name']        ?? '');
    $description = trim($data['description'] ?? '');
    $price       = (float) ($data['price']       ?? 0);
    $qty         = (int)   ($data['qty']         ?? 0);
    $category_id = (int)   ($data['category_id'] ?? 0);
    $discount    = max(0, min(100, (int) ($data['discount'] ?? 0)));
    $totalprice  = round($price * (1 - $discount / 100), 2);

    if (!$name)      sendResponse(400, false, 'Product name is required');
    if ($price <= 0) sendResponse(400, false, 'Price must be greater than 0');

    $image = extractImage();

    $stmt = $conn->prepare("
        INSERT INTO products
            (name, description, price, qty, category_id, image_name, image_blob, image_type, discount, totalprice)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bindValue(1,  $name);
    $stmt->bindValue(2,  $description);
    $stmt->bindValue(3,  $price);
    $stmt->bindValue(4,  $qty);
    $stmt->bindValue(5,  $category_id ?: null, PDO::PARAM_INT);
    $stmt->bindValue(6,  $image ? $image['name'] : null);
    $stmt->bindValue(7,  $image ? $image['blob'] : null, PDO::PARAM_LOB);
    $stmt->bindValue(8,  $image ? $image['type'] : null);
    $stmt->bindValue(9,  $discount);
    $stmt->bindValue(10, $totalprice);
    $stmt->execute();

    sendResponse(201, true, 'Product added', ['id' => (int) $conn->lastInsertId()]);
}


// ─────────────────────────────────────────────────────────
// ✏️  UPDATE PRODUCT
// ─────────────────────────────────────────────────────────

function updateProduct(array $data): void
{
    global $conn;

    $id          = (int)   ($data['id']          ?? 0);
    $name        = trim($data['name']            ?? '');
    $description = trim($data['description']     ?? '');
    $price       = (float) ($data['price']       ?? 0);
    $qty         = (int)   ($data['qty']         ?? 0);
    $category_id = (int)   ($data['category_id'] ?? 0);
    $discount    = max(0, min(100, (int) ($data['discount'] ?? 0)));
    $totalprice  = round($price * (1 - $discount / 100), 2);
    $removeImg   = ($data['remove_image']        ?? '') === '1';

    if (!$id)   sendResponse(400, false, 'Product ID required');
    if (!$name) sendResponse(400, false, 'Product name is required');

    $exists = $conn->prepare("SELECT id FROM products WHERE id = ?");
    $exists->execute([$id]);
    if (!$exists->fetch()) sendResponse(404, false, 'Product not found');

    $image = extractImage();

    if ($image) {
        $stmt = $conn->prepare("
            UPDATE products
            SET name=?, description=?, price=?, qty=?, category_id=?,
                image_name=?, image_type=?, image_blob=?,
                discount=?, totalprice=?
            WHERE id=?
        ");
        $stmt->bindValue(1,  $name);
        $stmt->bindValue(2,  $description);
        $stmt->bindValue(3,  $price);
        $stmt->bindValue(4,  $qty);
        $stmt->bindValue(5,  $category_id ?: null, PDO::PARAM_INT);
        $stmt->bindValue(6,  $image['name']);
        $stmt->bindValue(7,  $image['type']);
        $stmt->bindValue(8,  $image['blob'], PDO::PARAM_LOB);
        $stmt->bindValue(9,  $discount);
        $stmt->bindValue(10, $totalprice);
        $stmt->bindValue(11, $id, PDO::PARAM_INT);
        $stmt->execute();
    } elseif ($removeImg) {
        $stmt = $conn->prepare("
            UPDATE products
            SET name=?, description=?, price=?, qty=?, category_id=?,
                image_name=NULL, image_type=NULL, image_blob=NULL,
                discount=?, totalprice=?
            WHERE id=?
        ");
        $stmt->execute([$name, $description, $price, $qty, $category_id ?: null, $discount, $totalprice, $id]);
    } else {
        $stmt = $conn->prepare("
            UPDATE products
            SET name=?, description=?, price=?, qty=?, category_id=?,
                discount=?, totalprice=?
            WHERE id=?
        ");
        $stmt->execute([$name, $description, $price, $qty, $category_id ?: null, $discount, $totalprice, $id]);
    }

    sendResponse(200, true, 'Product updated');
}


// ─────────────────────────────────────────────────────────
// 🗑️  DELETE PRODUCT
// ─────────────────────────────────────────────────────────

function deleteProduct(array $data): void
{
    global $conn;
    $id = (int) ($data['id'] ?? 0);
    if (!$id) sendResponse(400, false, 'Product ID required');

    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);
    sendResponse(200, true, 'Product deleted');
}