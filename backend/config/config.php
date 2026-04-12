<?php

class Database
{
  private $host     = "localhost";
  private $username = "root";
  private $password = "";
  private $dbname   = "kapetpamana";
  private $charset  = "utf8mb4";
  private ?PDO $conn       = null;

  public function connect(): PDO
  {
    if ($this->conn !== null) {
      return $this->conn;
    }

    $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";

    $options = [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
      $this->conn = new PDO($dsn, $this->username, $this->password, $options);
      return $this->conn;
    } catch (PDOException $e) {
      // Don't expose DB details in production
      error_log($e->getMessage());
      http_response_code(500);
      echo json_encode(['success' => false, 'message' => 'Connection Failed']);
      exit();
    }
  }
}
