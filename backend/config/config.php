<?php
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "kapetpamana";

try {
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  header('Content-Type: application/json');
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Database connection failed'
  ]);
  exit();
}
