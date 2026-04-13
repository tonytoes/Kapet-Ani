<?php
ob_start();
ini_set('display_errors', 0);
error_reporting(0);

$allowedOrigins = ['http://localhost:5173'];

//website
//https://cornflowerblue-skunk-618358.hostingersite.com/backend/controllers/
//local
//http://localhost/backend/controllers/

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
    $resource = $_GET['resource'] ?? 'alerts';   // ?resource=categories|products

    $data = isMultipart()
        ? $_POST
        : (json_decode(file_get_contents("php://input"), true) ?? []);

    $override = strtoupper($data['_method'] ?? '');
    if ($method === 'POST' && $override === 'PUT') {
        $method = 'PUT';
        unset($data['_method']);
    }

    // ── Route by resource ─────────────────────────────────────────────────
    if ($resource === 'categories') {
        if ($method === 'GET') listCategories();
        sendResponse(405, false, 'Method not allowed');
    }

    if ($resource === 'products') {
        if ($method === 'GET') listProductsByCategory();
        sendResponse(405, false, 'Method not allowed');
    }

    // default: alerts
    if ($method === 'GET')    listAlerts();
    if ($method === 'POST')   addAlert($data);
    if ($method === 'PUT')    updateAlert($data);
    if ($method === 'DELETE') deleteAlert($data);

    sendResponse(405, false, 'Method not allowed');

} catch (Throwable $e) {
    sendResponse(500, false, $e->getMessage());
}


// ─────────────────────────────────────────────────────────
// 🏷️  CATEGORIES  (read-only here — managed via inventoryController)
// ─────────────────────────────────────────────────────────

function listCategories(): void
{
    global $conn;
    $stmt = $conn->query("SELECT id, name FROM categories ORDER BY name ASC");
    sendResponse(200, true, 'Categories fetched', ['categories' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}


// ─────────────────────────────────────────────────────────
// 📦  PRODUCTS BY CATEGORY
// ─────────────────────────────────────────────────────────

function listProductsByCategory(): void
{
    global $conn;
    $category_id = (int) ($_GET['category_id'] ?? 0);

    if ($category_id) {
        $stmt = $conn->prepare("SELECT id, name, qty FROM products WHERE category_id = ? ORDER BY name ASC");
        $stmt->execute([$category_id]);
    } else {
        $stmt = $conn->query("SELECT id, name, qty FROM products ORDER BY name ASC");
    }

    sendResponse(200, true, 'Products fetched', ['products' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
}


// ─────────────────────────────────────────────────────────
// 📋  LIST ALERTS
// ─────────────────────────────────────────────────────────

function listAlerts(): void
{
    global $conn;

    $stmt = $conn->query("
        SELECT
            i.id          AS rule_id,
            i.rule_name,
            i.product_id,
            p.name        AS product_name,
            p.qty         AS quantity,
            i.category_id,
            c.name        AS category_name,
            i.stock_condition,
            i.rule_value,
            i.enabled,
            i.created_at,
            i.updated_at
        FROM inventory_alert i
        JOIN products   p ON p.id = i.product_id
        JOIN categories c ON c.id = i.category_id
        ORDER BY i.id DESC
    ");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = array_map(function ($row) {
        $qty       = (int) $row['quantity'];
        $value     = (int) $row['rule_value'];
        $condition = $row['stock_condition'];
        $enabled   = (int) $row['enabled'];

        // Evaluate whether the alert condition is currently triggered
        $triggered = match ($condition) {
            '>='    => $qty >= $value,
            '<='    => $qty <= $value,
            '>'     => $qty >  $value,
            '<'     => $qty <  $value,
            '='     => $qty === $value,
            default => false,
        };

        $status = $enabled === 1 ? 'Online' : 'Offline';
        $alert  = !$enabled        ? 'Offline'
                : ($triggered      ? 'Warning'
                                   : 'Normal');

        return [
            'rule_id'         => (int) $row['rule_id'],
            'rule_name'       => $row['rule_name'],
            'product_id'      => (int) $row['product_id'],
            'product_name'    => $row['product_name'],
            'quantity'        => $qty,
            'category_id'     => (int) $row['category_id'],
            'category_name'   => $row['category_name'],
            'stock_condition' => $condition,
            'rule_value'      => $value,
            'enabled'         => $enabled,
            'status'          => $status,
            'alert'           => $alert,
            'created_at'      => $row['created_at'],
            'updated_at'      => $row['updated_at'],
        ];
    }, $rows);

    sendResponse(200, true, 'Alerts fetched', ['alerts' => $formatted]);
}


// ─────────────────────────────────────────────────────────
// ➕  ADD ALERT
// ─────────────────────────────────────────────────────────

function addAlert(array $data): void
{
    global $conn;

    $rule_name  = trim($data['rule_name']       ?? '');
    $product_id = (int) ($data['product_id']    ?? 0);
    $category_id= (int) ($data['category_id']   ?? 0);
    $condition  = trim($data['stock_condition'] ?? '');
    $value      = (int) ($data['rule_value']    ?? 0);
    $enabled    = (int) ($data['enabled']       ?? 1);

    $valid_conditions = ['<=', '>=', '=', '<', '>'];

    if (!$rule_name)                          sendResponse(400, false, 'Rule name is required');
    if (!$product_id)                         sendResponse(400, false, 'Product is required');
    if (!$category_id)                        sendResponse(400, false, 'Category is required');
    if (!in_array($condition, $valid_conditions)) sendResponse(400, false, 'Invalid condition');

    $stmt = $conn->prepare("
        INSERT INTO inventory_alert (rule_name, product_id, stock_condition, rule_value, category_id, enabled)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$rule_name, $product_id, $condition, $value, $category_id, $enabled]);

    sendResponse(201, true, 'Alert rule added', ['id' => (int) $conn->lastInsertId()]);
}


// ─────────────────────────────────────────────────────────
// ✏️  UPDATE ALERT
// ─────────────────────────────────────────────────────────

function updateAlert(array $data): void
{
    global $conn;

    $id         = (int) ($data['id']            ?? 0);
    $rule_name  = trim($data['rule_name']       ?? '');
    $product_id = (int) ($data['product_id']    ?? 0);
    $category_id= (int) ($data['category_id']   ?? 0);
    $condition  = trim($data['stock_condition'] ?? '');
    $value      = (int) ($data['rule_value']    ?? 0);
    $enabled    = (int) ($data['enabled']       ?? 1);

    $valid_conditions = ['<=', '>=', '=', '<', '>'];

    if (!$id)                                     sendResponse(400, false, 'Rule ID required');
    if (!$rule_name)                              sendResponse(400, false, 'Rule name is required');
    if (!$product_id)                             sendResponse(400, false, 'Product is required');
    if (!$category_id)                            sendResponse(400, false, 'Category is required');
    if (!in_array($condition, $valid_conditions)) sendResponse(400, false, 'Invalid condition');

    // Verify exists
    $check = $conn->prepare("SELECT id FROM inventory_alert WHERE id = ?");
    $check->execute([$id]);
    if (!$check->fetch()) sendResponse(404, false, 'Alert rule not found');

    $stmt = $conn->prepare("
        UPDATE inventory_alert
        SET rule_name       = ?,
            product_id      = ?,
            stock_condition = ?,
            rule_value      = ?,
            category_id     = ?,
            enabled         = ?
        WHERE id = ?
    ");
    $stmt->execute([$rule_name, $product_id, $condition, $value, $category_id, $enabled, $id]);

    sendResponse(200, true, 'Alert rule updated');
}


// ─────────────────────────────────────────────────────────
// 🗑️  DELETE ALERT
// ─────────────────────────────────────────────────────────

function deleteAlert(array $data): void
{
    global $conn;

    $id = (int) ($data['id'] ?? 0);
    if (!$id) sendResponse(400, false, 'Rule ID required');

    $stmt = $conn->prepare("DELETE FROM inventory_alert WHERE id = ?");
    $stmt->execute([$id]);

    sendResponse(200, true, 'Alert rule deleted');
}