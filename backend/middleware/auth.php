<?php
require 'jwt.php';

function getUserFromToken()
{
  $headers = getallheaders();

  if (!isset($headers['Authorization'])) {
    http_response_code(401);
    exit;
  }

  $token = str_replace("Bearer ", "", $headers['Authorization']);

  try {
    $decoded = verifyJWT($token);
    return $decoded->data;
  } catch (Exception $e) {
    http_response_code(401);
    exit;
  }
}
