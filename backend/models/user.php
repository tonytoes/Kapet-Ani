<?php
require_once __DIR__ . '/../config/config.php';

function getUserByEmail($email)
{
  global $conn;
  $stmt = $conn->prepare("SELECT id, first_name, last_name, email, role FROM users WHERE email = ?");
  $stmt->execute([$email]);
  return $stmt->fetch(PDO::FETCH_ASSOC);
}

function emailExist($email)
{
  global $conn;
  $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
  $stmt->execute([$email]);
  return $stmt->fetch() !== false;
}

function createUser($first_name, $last_name, $email, $password, $role)
{
  global $conn;

  try {
    $stmt = $conn->prepare("
      INSERT INTO users (first_name, last_name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    ");

    return $stmt->execute([$first_name, $last_name, $email, $password, $role]);
  } catch (PDOException $e) {
    return false;
  }
}

function getUserById($id)
{
  global $conn;

  $stmt = $conn->prepare("
    SELECT id, first_name, last_name, email, role
    FROM users
    WHERE id = ?
  ");
  $stmt->execute([$id]);

  return $stmt->fetch(PDO::FETCH_ASSOC);
}
