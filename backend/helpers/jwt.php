<?php
require  __DIR__ . '../../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "your_secret_key";

function generateJWT($user)
{
  global $secret_key;

  $payload = [
    "iss" => "your-app",
    "iat" => time(),
    "exp" => time() + (60 * 60),
    "data" => [
      "id" => $user['id'],
      "email" => $user['email'],
      "role" => $user['role']
    ]
  ];

  return JWT::encode($payload, $secret_key, 'HS256');
}

function verifyJWT($token)
{
  global $secret_key;

  return JWT::decode($token, new Key($secret_key, 'HS256'));
}
