<?php
ini_set('display_errors', 0);
error_reporting(0);
$allowedOrigins = [
  'http://localhost:5173',
];

require_once __DIR__ . '/../models/user.php';
require_once __DIR__ . '/../helpers/jwt.php';
$userModel = new UserModel();
header('Content-Type: application/json');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
  header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  sendResponse(405, false, 'Method not allowed');
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['action'])) {
  sendResponse(400, false, 'Invalid request body');
}

switch ($data['action']) {
  case 'login':
    login($data, $userModel);
    break;
  case 'register':
    register($data, $userModel);
    break;
  default:
    sendResponse(400, false, 'Invalid action');
}

function sendResponse(int $code, bool $success, string $message, array $extra = []): void
{
  http_response_code($code);
  echo json_encode(array_merge(
    ['success' => $success, 'message' => $message],
    $extra
  ));
  exit();
}

function login(array $data, UserModel $userModel): void
{
  if (empty($data['email']) || empty($data['password'])) {
    sendResponse(400, false, 'Email and password are required');
  }

  $email = trim($data['email']);
  $user  = $userModel->getUserByEmail($email);

  if (!$user || !password_verify($data['password'], $user['password'])) {
    sendResponse(401, false, 'Incorrect email or password');
  }

  $token = generateJWT($user);

  // Build image data URL if the user has an avatar stored
  $imageUrl = null;
  if (!empty($user['image_blob']) && !empty($user['image_type'])) {
    $imageUrl = 'data:' . $user['image_type'] . ';base64,' . base64_encode($user['image_blob']);
  }

  sendResponse(200, true, 'Login successful', [
    'token' => $token,
    'user'  => [
      'id'         => $user['id'],
      'first_name' => $user['first_name'],
      'last_name'  => $user['last_name'],
      'email'      => $user['email'],
      'role'       => $user['role'],
      'image_url'  => $imageUrl,
    ]
  ]);
}

function register(array $data, UserModel $userModel): void
{
  $fields = ['first_name', 'last_name', 'email', 'password'];

  foreach ($fields as $field) {
    if (empty($data[$field])) {
      sendResponse(400, false, 'All fields are required');
    }
  }

  if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    sendResponse(400, false, 'Invalid email format');
  }

  if (strlen($data['password']) < 9) {
    sendResponse(400, false, 'Password must be at least 9 characters');
  }

  $email = trim($data['email']);

  if ($userModel->emailExist($email)) {
    sendResponse(409, false, 'Email already registered');
  }

  $created = $userModel->createUser(
    trim($data['first_name']),
    trim($data['last_name']),
    $email,
    password_hash($data['password'], PASSWORD_DEFAULT),
    'user'
  );

  if (!$created) {
    sendResponse(500, false, 'Registration failed, please try again');
  }

  sendResponse(201, true, 'User registered successfully');
}