<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/jwt.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://red-lark-276337.hostingersite.com/'); // change this when seting up hostinger
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$data = json_decode(file_get_contents("php://input"), true);

$action = $data['action'] ?? '';

if ($action === 'login') login($data);
if ($action === 'register') register($data);


function login($data)
{
  $email    = trim($data['email']);
  $password = $data['password'];

  $user = getUserByEmail($email);

  if ($user && password_verify($password, $user['password'])) {

    $token = generateJWT($user);

    http_response_code(200);
    echo json_encode([
      'success' => true,
      'token'   => $token,
      'user'    => [
        'id'         => $user['id'],
        'first_name' => $user['first_name'],
        'last_name'  => $user['last_name'],
        'email'      => $user['email'],
        'role'       => $user['role']
      ]
    ]);
  } else {
    http_response_code(401);
    echo json_encode([
      'success' => false,
      'message' => 'Incorrect email or password'
    ]);
  }
}


function register($data)
{
  $first_name = trim($data['first_name']);
  $last_name  = trim($data['last_name']);
  $email      = trim($data['email']);
  $password   = password_hash($data['password'], PASSWORD_DEFAULT);
  $role       = 'user';

  if (emailExist($email)) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'message' => 'Email already registered'
    ]);
  } else {
    createUser($first_name, $last_name, $email, $password, $role);

    http_response_code(201);
    echo json_encode([
      'success' => true,
      'message' => 'User registered successfully'
    ]);
  }
}
