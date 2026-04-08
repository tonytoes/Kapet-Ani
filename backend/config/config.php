<?php
$servername = "localhost";
$username = "u557120535_sphinxy"; // change this when seting up hostinger
$password = "";    // change this when seting up hostinger
$dbname = "u557120535_Kapetpamana";   // change this when seting up hostinger

try {
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
