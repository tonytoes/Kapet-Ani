<?php
session_start();
require_once '../models/User.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

function login()
{
  $email    = trim($_POST['email']);
  $password = $_POST['password'];

  $user = getUserByEmail($email);

  if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id']    = $user['id'];
    $_SESSION['first_name'] = $user['first_name'];
    $_SESSION['role']       = $user['role'];

    echo json_encode([
      'success' => true,
      'user'    => [
        'id'         => $user['id'],
        'first_name' => $user['first_name'],
        'last_name'  => $user['last_name'],
        'email'      => $user['email'],
        'role'       => $user['role']
      ]
    ]);
  } else {
    echo json_encode([
      'success' => false,
      'message' => 'Incorrect email or password'
    ]);
  }
}

function register()
{
  $first_name = trim($_POST['first_name']);
  $last_name  = trim($_POST['last_name']);
  $email      = trim($_POST['email']);
  $password   = password_hash($_POST['password'], PASSWORD_DEFAULT);
  $role       = 'user';

  if (emailExist($email)) {
    echo json_encode([
      'success' => false,
      'message' => 'Email already registered'
    ]);
  } else {
    createUser($first_name, $last_name, $email, $password, $role);
    echo json_encode(['success' => true]);
  }
}

if (isset($_POST['login']))    login();
if (isset($_POST['register'])) register();
