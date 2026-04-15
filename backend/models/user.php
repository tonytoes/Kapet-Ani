<?php
require_once __DIR__ . '/../config/config.php';

class UserModel
{
  private PDO $conn;

  public function __construct()
  {
    $db = new Database();
    $this->conn = $db->connect();
  }

  public function getUserByEmail(string $email): array|false
  {
    $stmt = $this->conn->prepare(
      "SELECT id, first_name, last_name, email, password, role FROM users WHERE email = ?"
    );
    $stmt->execute([$email]);
    return $stmt->fetch();
  }

  public function getUserById(int $id): array|false
  {
    $stmt = $this->conn->prepare(
      "SELECT id, first_name, last_name, email, role FROM users WHERE id = ?"
    );
    $stmt->execute([$id]);
    return $stmt->fetch();
  }

  public function emailExist(string $email): bool
  {
    $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    return $stmt->fetch() !== false;
  }

  public function createUser(string $first_name, string $last_name, string $email, string $password, string $role = 'user'): bool
  {
    try {
      $stmt = $this->conn->prepare("
        INSERT INTO users (first_name, last_name, email, password, role)
        VALUES (?, ?, ?, ?, ?)
      ");
      return $stmt->execute([$first_name, $last_name, $email, $password, $role]);
    } catch (PDOException $e) {
      error_log($e->getMessage());
      return false;
    }
  }
}
