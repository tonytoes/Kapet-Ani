<?php
ob_start();
ini_set('display_errors', 0);
error_reporting(0);


require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/config.php';
applyCors(); 

$db   = new Database();
$conn = $db->connect();


function sendResponse(int $code, bool $success, string $message, array $extra = []): void
{
    ob_clean();
    http_response_code($code);
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit();
}

function usersHasPasswordLenColumn(): bool
{
    static $cached = null;
    if ($cached !== null) return $cached;
    global $conn;
    try {
        // Prefer SHOW COLUMNS to avoid INFORMATION_SCHEMA permission issues.
        $stmt = $conn->query("SHOW COLUMNS FROM `users` LIKE 'password_len'");
        $cached = (bool) $stmt->fetch(PDO::FETCH_ASSOC);
        return $cached;
    } catch (Throwable $e) {
        $cached = false;
        return false;
    }
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

function getRequesterRole(): ?string
{
    global $conn;

    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? $_SERVER['Authorization']
        ?? '';
    if (!$header && function_exists('getallheaders')) {
        $all = getallheaders();
        if (is_array($all)) {
            $header = $all['Authorization'] ?? $all['authorization'] ?? '';
        }
    }
    if (!$header || !preg_match('/Bearer\s+(.+)/i', $header, $m)) return null;
    $token = trim($m[1]);
    if ($token === '') return null;

    try {
        $decoded = verifyJWT($token);
        $id = isset($decoded->data->id) ? (int) $decoded->data->id : 0;
        if ($id > 0) {
            $stmt = $conn->prepare("SELECT role FROM users WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($row && isset($row['role'])) {
                return strtolower((string) $row['role']);
            }
        }

        // Fallback to role claim in token if DB lookup fails.
        $role = $decoded->data->role ?? null;
        return is_string($role) ? strtolower($role) : null;
    } catch (Throwable $e) {
        return null;
    }
}

function getRequesterId(): int
{
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? $_SERVER['Authorization']
        ?? '';
    if (!$header && function_exists('getallheaders')) {
        $all = getallheaders();
        if (is_array($all)) {
            $header = $all['Authorization'] ?? $all['authorization'] ?? '';
        }
    }
    if (!$header || !preg_match('/Bearer\s+(.+)/i', $header, $m)) return 0;
    $token = trim($m[1]);
    if ($token === '') return 0;
    try {
        $decoded = verifyJWT($token);
        $id = isset($decoded->data->id) ? (int) $decoded->data->id : 0;
        return $id > 0 ? $id : 0;
    } catch (Throwable $e) {
        return 0;
    }
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
        sendResponse(400, false, 'Image must be under 10 MB');
    }

    // ✅ FIX: reliable MIME detection (works on Hostinger)
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

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

    $archiveEmail = 'deleted.user@system.local';
    $passwordLenSelect = usersHasPasswordLenColumn()
        ? "COALESCE(password_len, 8) AS password_len,"
        : "8 AS password_len,";
    $stmt = $conn->prepare("
        SELECT
            id, first_name, last_name,
            CONCAT(first_name, ' ', last_name) AS username,
            email, role AS status, created_at,
            {$passwordLenSelect}
            image_name,
            (SELECT COALESCE(SUM(total_price), 0)
             FROM orders WHERE user_id = users.id) AS total_spent
        FROM users
        WHERE email <> ?
        ORDER BY created_at DESC
    ");
    $stmt->execute([$archiveEmail]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = array_map(function ($u) {
        $len = (int)($u['password_len'] ?? 8);
        if ($len < 1) $len = 1;
        if ($len > 15) $len = 15;
        $imageUrl = null;
        if (!empty($u['image_name'])) {
            $imageUrl = LINK_PATH . "getImage.php?id=" . $u['id'];
        }
        return [
            'id'         => (int) $u['id'],
            'username'   => $u['username'],
            'first_name' => $u['first_name'],
            'last_name'  => $u['last_name'],
            'email'      => $u['email'],
            'status'     => ucfirst($u['status']),
            'created_at' => $u['created_at'],
            'totalSpent' => '₱' . number_format($u['total_spent'], 2),
            'password'   => str_repeat('•', $len),
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
    $requesterRole = getRequesterRole();

    if (!$first_name || !$last_name || !$email || !$password) {
        sendResponse(400, false, 'All fields are required');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(400, false, 'Invalid email format');
    }

    if (in_array($role, ['admin', 'superadmin'], true) && $requesterRole !== 'superadmin') {
        sendResponse(403, false, 'Only superadmin can assign Admin or SuperAdmin roles');
    }

    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        sendResponse(409, false, 'Email already exists');
    }

    $image  = extractImage();
    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $passwordLen = mb_strlen((string)$password);
    if ($passwordLen < 1) $passwordLen = 1;
    if ($passwordLen > 255) $passwordLen = 255;

    if (usersHasPasswordLenColumn()) {
        $stmt = $conn->prepare("
            INSERT INTO users (first_name, last_name, email, password, password_len, role, image_name, image_blob, image_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bindValue(1, $first_name);
        $stmt->bindValue(2, $last_name);
        $stmt->bindValue(3, $email);
        $stmt->bindValue(4, $hashed);
        $stmt->bindValue(5, $passwordLen, PDO::PARAM_INT);
        $stmt->bindValue(6, $role);
        $stmt->bindValue(7, $image ? $image['name'] : null);
        $stmt->bindValue(8, $image ? $image['blob'] : null, PDO::PARAM_LOB);
        $stmt->bindValue(9, $image ? $image['type'] : null);
    } else {
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
    }
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
    $requesterRole = getRequesterRole();
    $requesterId   = getRequesterId();

    if (!$id) {
        sendResponse(400, false, 'User ID required');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendResponse(400, false, 'Invalid email format');
    }

    $currentUserStmt = $conn->prepare("SELECT role, password FROM users WHERE id = ? LIMIT 1");
    $currentUserStmt->execute([$id]);
    $currentUser = $currentUserStmt->fetch(PDO::FETCH_ASSOC);
    if (!$currentUser) {
        sendResponse(404, false, 'User not found');
    }

    $currentTargetRole = strtolower((string) $currentUser['role']);
    // Block admins from modifying superadmin accounts (server-side enforcement).
    if ($currentTargetRole === 'superadmin' && $requesterRole !== 'superadmin') {
        sendResponse(403, false, 'Only superadmin can edit a SuperAdmin account');
    }
    // Block admins from editing other Admin accounts' info (unless superadmin).
    if ($currentTargetRole === 'admin' && $requesterRole !== 'superadmin' && $requesterId > 0 && $requesterId !== $id) {
        sendResponse(403, false, 'Only superadmin can edit other Admin accounts');
    }
    // Prevent admins from changing the role of other Admin accounts.
    if ($currentTargetRole === 'admin' && $requesterRole !== 'superadmin' && $role !== $currentTargetRole) {
        sendResponse(403, false, 'Only superadmin can change an Admin user role');
    }
    if (
        in_array($role, ['admin', 'superadmin'], true) &&
        $requesterRole !== 'superadmin' &&
        $role !== $currentTargetRole
    ) {
        sendResponse(403, false, 'Only superadmin can assign Admin or SuperAdmin roles');
    }

    $newPasswordRaw = $data['new_password'] ?? $data['password'] ?? '';
    $passwordChange = !empty($newPasswordRaw) && $newPasswordRaw !== '••••••••';
    if ($passwordChange) {
        // If current_password is provided, treat as self-service change:
        // enforce minimum length + verify current password.
        $currentPasswordRaw = $data['current_password'] ?? '';
        if ($currentPasswordRaw !== '') {
            if (strlen($newPasswordRaw) < 8) {
                sendResponse(400, false, 'New password must be at least 8 characters');
            }
            if (!password_verify($currentPasswordRaw, $currentUser['password'])) {
                sendResponse(400, false, 'Current password is incorrect');
            }
        }
    }

    $image          = extractImage();
    $hashedPassword = $passwordChange ? password_hash($newPasswordRaw, PASSWORD_DEFAULT) : null;
    $passwordLen    = $passwordChange ? mb_strlen((string)$newPasswordRaw) : null;
    if ($passwordLen !== null) {
        if ($passwordLen < 1) $passwordLen = 1;
        if ($passwordLen > 255) $passwordLen = 255;
    }
    $hasPasswordLen = usersHasPasswordLenColumn();

    if ($image) {
        // ── New image uploaded ───────────────────────────────────────────
        $sql = "UPDATE users
                SET first_name=?, last_name=?, email=?, role=?,
                    image_name=?, image_type=?, image_blob=?"
             . ($passwordChange ? ($hasPasswordLen ? ", password=?, password_len=?" : ", password=?") : "")
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
            $stmt->bindValue($i++, $hashedPassword);
            if ($hasPasswordLen) {
                $stmt->bindValue($i++, $passwordLen, PDO::PARAM_INT);
            }
        }
        $stmt->bindValue($i, $id, PDO::PARAM_INT);
        $stmt->execute();

    } elseif ($removeImg) {
        // ── Remove existing image ────────────────────────────────────────
        $sql = "UPDATE users
                SET first_name=?, last_name=?, email=?, role=?,
                    image_name=NULL, image_type=NULL, image_blob=NULL"
             . ($passwordChange ? ($hasPasswordLen ? ", password=?, password_len=?" : ", password=?") : "")
             . ", updated_at=NOW() WHERE id=?";

        $stmt   = $conn->prepare($sql);
        $params = [$first_name, $last_name, $email, $role];
        if ($passwordChange) {
            $params[] = $hashedPassword;
            if ($hasPasswordLen) {
                $params[] = $passwordLen;
            }
        }
        $params[] = $id;
        $stmt->execute($params);

    } else {
        // ── Text fields only ─────────────────────────────────────────────
        $sql = "UPDATE users
                SET first_name=?, last_name=?, email=?, role=?"
             . ($passwordChange ? ($hasPasswordLen ? ", password=?, password_len=?" : ", password=?") : "")
             . ", updated_at=NOW() WHERE id=?";

        $stmt   = $conn->prepare($sql);
        $params = [$first_name, $last_name, $email, $role];
        if ($passwordChange) {
            $params[] = $hashedPassword;
            if ($hasPasswordLen) {
                $params[] = $passwordLen;
            }
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
    try {
        $conn->beginTransaction();

        // Archive user receives ownership of historical orders.
        $archiveStmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $archiveStmt->execute(['deleted.user@system.local']);
        $archiveUser = $archiveStmt->fetch(PDO::FETCH_ASSOC);
        if (!$archiveUser) {
            throw new RuntimeException('Archive user not found. Create deleted.user@system.local first.');
        }
        $archiveUserId = (int)($archiveUser['id'] ?? 0);
        if ($archiveUserId <= 0) {
            throw new RuntimeException('Archive user is invalid.');
        }
        if ($id === $archiveUserId) {
            throw new RuntimeException('Archive user cannot be deleted.');
        }

        // Remove dependent cart rows first to satisfy FK constraints.
        $clearCart = $conn->prepare("DELETE FROM cart_items WHERE user_id = ?");
        $clearCart->execute([$id]);

        // Preserve historical orders by reassigning to archive user.
        $moveOrders = $conn->prepare("UPDATE orders SET user_id = ? WHERE user_id = ?");
        $moveOrders->execute([$archiveUserId, $id]);

        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);

        $conn->commit();
        sendResponse(200, true, 'User deleted');
    } catch (Throwable $e) {
        if ($conn->inTransaction()) $conn->rollBack();

        // Keep message user-friendly for known FK blockers.
        if (str_contains($e->getMessage(), 'orders_ibfk_1')) {
            sendResponse(409, false, 'Cannot delete this user yet because they have order records.');
        }

        sendResponse(400, false, $e->getMessage());
    }
}