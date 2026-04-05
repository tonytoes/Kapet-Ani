<?php
require_once '../config/config.php';

function getUserByEmail($email)
{
  global $conn;
  $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
  $stmt->execute([$email]);
  return $stmt->fetch(PDO::FETCH_ASSOC);
}

function emailExist($email)
{
  global $conn;
  $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
  $stmt->execute([$email]);
  return $stmt->fetch();
}

function createUser($first_name, $last_name, $email, $password, $role)
{
  global $conn;
  $stmt = $conn->prepare("
        INSERT INTO users (first_name, last_name, email, password, role)
        VALUES (?, ?, ?, ?, ?)
    ");
  return $stmt->execute([$first_name, $last_name, $email, $password, $role]);
}
