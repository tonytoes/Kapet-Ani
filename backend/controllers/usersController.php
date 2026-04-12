<?php
ob_start();
ini_set('display_errors', 0);
error_reporting(0);

$allowedOrigins = ['http://localhost:5173'];

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

// ── Reliable multipart detection ─────────────────────────────────────────
// $_FILES is populated by PHP whenever it parsed a multipart body,
// regardless of which server variable holds the Content-Type header.
function isMultipart(): bool
{
    if (!empty($_FILES)) return true;

    $ct = $_SERVER['CONTENT_TYPE']
       ?? $_SERVER['HTTP_CONTENT_TYPE']
       ?? '';

    return str_contains($ct, 'multipart/form-data');
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $data   = isMultipart()
        ? $_POST
        : (json_decode(file_get_contents("php://input"), true) ?? []);

    // React sends PUT+file as POST with _method=PUT because PHP does not
    // populate $_POST/$_FILES for multipart PUT requests on most servers.
    $override = strtoupper($data['_method'] ?? '');
    if ($method === 'POST' && $override === 'PUT') {
        $method = 'PUT';
        unset($data['_method']);
    }

    if ($method === 'GET')    listUsers();
    if ($method === 'POST')   addUser($data);
    if ($method === 'PUT')    updateUser($data);
    if ($method === 'DELETE') deleteUser($data);

} catch (Throwable $e) {
    sendResponse(500, false, $e->getMessage());
}


// ─────────────────────────────────────────────────────────
// 🖼️  IMAGE HELPER
// ─────────────────────────────────────────────────────────

function extractImage(): ?array
{
    if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $file     = $_FILES['image'];
    $maxBytes = 10 * 1024 * 1024;

    if ($file['size'] > $maxBytes) {
        sendResponse(400, false, 'Image must be under 2 MB');
    }

    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $mime    = mime_content_type($file['tmp_name']);

    if (!in_array($mime, $allowed)) {
        sendResponse(400, false, 'Only JPG, PNG, GIF, and WEBP images are allowed');
    }

    return [
        'blob' => file_get_contents($file['tmp_name']),
        'type' => $mime,
        'name' => basename($file['name']),
    ];
}


// ─────────────────────────────────────────────────────────
// 📋  LIST USERS
// ─────────────────────────────────────────────────────────

function listUsers(): void
{
    global $conn;

    $stmt = $conn->query("
        SELECT
            id, first_name, last_name,
            CONCAT(first_name, ' ', last_name) AS username,
            email, role AS status,
            image_name, image_type, image_blob,
            (SELECT COALESCE(SUM(total_price), 0)
             FROM orders WHERE user_id = users.id) AS total_spent
        FROM users
        ORDER BY created_at DESC
    ");

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = array_map(function ($u) {
        $imageUrl = null;
        if (!empty($u['image_blob']) && !empty($u['image_type'])) {
            $imageUrl = 'data:' . $u['image_type'] . ';base64,' . base64_encode($u['image_blob']);
        }

        return [
            'id'         => (int) $u['id'],
            'username'   => $u['username'],
            'first_name' => $u['first_name'],
            'last_name'  => $u['last_name'],
            'email'      => $u['email'],
            'status'     => ucfirst($u['status']),
            'totalSpent' => '₱' . number_format($u['total_spent'], 2),
            'password'   => '••••••••',
            'image_name' => $u['image_name'],
            'image_url'  => $imageUrl,
        ];
    }, $users);

    sendResponse(200, true, 'Users fetched', ['users' => $formatted]);
}


// ─────────────────────────────────────────────────────────
// ➕  ADD USER
// ─────────────────────────────────────────────────────────

function addUser(array $data): void
{
    global $conn;

    $first_name = trim($data['first_name'] ?? '');
    $last_name  = trim($data['last_name']  ?? '');
    $email      = trim($data['email']      ?? '');
    $password   = $data['password']        ?? '';
    $role       = strtolower($data['status'] ?? 'user');

    if (!$first_name || !$last_name || !$email || !$password) {
        sendResponse(400, false, 'All fields are required');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(400, false, 'Invalid email format');
    }

    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        sendResponse(409, false, 'Email already exists');
    }

    $image  = extractImage();
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("
        INSERT INTO users (first_name, last_name, email, password, role, image_name, image_blob, image_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bindValue(1, $first_name);
    $stmt->bindValue(2, $last_name);
    $stmt->bindValue(3, $email);
    $stmt->bindValue(4, $hashed);
    $stmt->bindValue(5, $role);
    $stmt->bindValue(6, $image ? $image['name'] : null);
    $stmt->bindValue(7, $image ? $image['blob'] : null, PDO::PARAM_LOB);
    $stmt->bindValue(8, $image ? $image['type'] : null);
    $stmt->execute();

    sendResponse(201, true, 'User added', ['id' => (int) $conn->lastInsertId()]);
}


// ─────────────────────────────────────────────────────────
// ✏️  UPDATE USER
// ─────────────────────────────────────────────────────────

function updateUser(array $data): void
{
    global $conn;

    $id         = (int) ($data['id']         ?? 0);
    $first_name = trim($data['first_name']   ?? '');
    $last_name  = trim($data['last_name']    ?? '');
    $email      = trim($data['email']        ?? '');
    $role       = strtolower($data['status'] ?? 'user');
    $removeImg  = ($data['remove_image']     ?? '') === '1';

    if (!$id) {
        sendResponse(400, false, 'User ID required');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(400, false, 'Invalid email format');
    }

    $image          = extractImage();
    $passwordChange = !empty($data['password']) && $data['password'] !== '••••••••';

    if ($image) {
        // ── New image uploaded ───────────────────────────────────────────
        $sql = "UPDATE users
                SET first_name=?, last_name=?, email=?, role=?,
                    image_name=?, image_type=?, image_blob=?"
             . ($passwordChange ? ", password=?" : "")
             . ", updated_at=NOW() WHERE id=?";

        $stmt = $conn->prepare($sql);
        $i    = 1;
        $stmt->bindValue($i++, $first_name);
        $stmt->bindValue($i++, $last_name);
        $stmt->bindValue($i++, $email);
        $stmt->bindValue($i++, $role);
        $stmt->bindValue($i++, $image['name']);
        $stmt->bindValue($i++, $image['type']);
        $stmt->bindValue($i++, $image['blob'], PDO::PARAM_LOB);
        if ($passwordChange) {
            $stmt->bindValue($i++, password_hash($data['password'], PASSWORD_DEFAULT));
        }
        $stmt->bindValue($i, $id, PDO::PARAM_INT);
        $stmt->execute();

    } elseif ($removeImg) {
        // ── Remove existing image ────────────────────────────────────────
        $sql = "UPDATE users
                SET first_name=?, last_name=?, email=?, role=?,
                    image_name=NULL, image_type=NULL, image_blob=NULL"
             . ($passwordChange ? ", password=?" : "")
             . ", updated_at=NOW() WHERE id=?";

        $stmt   = $conn->prepare($sql);
        $params = [$first_name, $last_name, $email, $role];
        if ($passwordChange) {
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        $params[] = $id;
        $stmt->execute($params);

    } else {
        // ── Text fields only ─────────────────────────────────────────────
        $sql = "UPDATE users
                SET first_name=?, last_name=?, email=?, role=?"
             . ($passwordChange ? ", password=?" : "")
             . ", updated_at=NOW() WHERE id=?";

        $stmt   = $conn->prepare($sql);
        $params = [$first_name, $last_name, $email, $role];
        if ($passwordChange) {
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        $params[] = $id;
        $stmt->execute($params);
    }

    sendResponse(200, true, 'User updated');
}


// ─────────────────────────────────────────────────────────
// 🗑️  DELETE USER
// ─────────────────────────────────────────────────────────

function deleteUser(array $data): void
{
    global $conn;

    $id = (int) ($data['id'] ?? 0);
    if (!$id) sendResponse(400, false, 'User ID required');

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    sendResponse(200, true, 'User deleted');
}