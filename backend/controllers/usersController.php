<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/jwt.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$method = $_SERVER['REQUEST_METHOD'];
$data   = json_decode(file_get_contents("php://input"), true) ?? [];

if ($method === 'GET')    listUsers();
if ($method === 'POST')   addUser($data);
if ($method === 'PUT')    updateUser($data);
if ($method === 'DELETE') deleteUser($data);


function listUsers()
{
    global $conn;

    $stmt = $conn->query("
        SELECT
            id,
            first_name,
            last_name,
            CONCAT(first_name, ' ', last_name) AS username,
            email,
            role AS status,
            (SELECT COALESCE(SUM(total_price), 0)
             FROM orders WHERE user_id = users.id) AS total_spent
        FROM users
        ORDER BY created_at DESC
    ");

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = array_map(fn($u) => [
        'id'         => $u['id'],
        'username'   => $u['username'],
        'first_name' => $u['first_name'],
        'last_name'  => $u['last_name'],
        'email'      => $u['email'],
        'status'     => ucfirst($u['status']),
        'totalSpent' => '₱' . number_format($u['total_spent'], 2),
        'password'   => '••••••••',
    ], $users);

    echo json_encode(['success' => true, 'users' => $formatted]);
}


function addUser($data)
{
    global $conn;

    $first_name = trim($data['first_name'] ?? '');
    $last_name  = trim($data['last_name']  ?? '');
    $email      = trim($data['email']      ?? '');
    $password   = $data['password']        ?? '';
    $role       = strtolower($data['status'] ?? 'user');

    if (!$first_name || !$last_name || !$email || !$password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        return;
    }

    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        return;
    }

    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $stmt   = $conn->prepare("INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$first_name, $last_name, $email, $hashed, $role]);

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'User added', 'id' => (int) $conn->lastInsertId()]);
}


function updateUser($data)
{
    global $conn;

    $id         = (int) ($data['id']        ?? 0);
    $first_name = trim($data['first_name']  ?? '');
    $last_name  = trim($data['last_name']   ?? '');
    $email      = trim($data['email']       ?? '');
    $role       = strtolower($data['status'] ?? 'user');

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User ID required']);
        return;
    }

    if (!empty($data['password']) && $data['password'] !== '••••••••') {
        $hashed = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt   = $conn->prepare("UPDATE users SET first_name=?, last_name=?, email=?, password=?, role=?, updated_at=NOW() WHERE id=?");
        $stmt->execute([$first_name, $last_name, $email, $hashed, $role, $id]);
    } else {
        $stmt = $conn->prepare("UPDATE users SET first_name=?, last_name=?, email=?, role=?, updated_at=NOW() WHERE id=?");
        $stmt->execute([$first_name, $last_name, $email, $role, $id]);
    }

    echo json_encode(['success' => true, 'message' => 'User updated']);
}


function deleteUser($data)
{
    global $conn;

    $id = (int) ($data['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User ID required']);
        return;
    }

    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'User deleted']);
}