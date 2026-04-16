<?php
require_once __DIR__ . '/../config/config.php';

$db   = new Database();
$conn = $db->connect();

$id = (int) ($_GET['id'] ?? 0);

if (!$id) {
    http_response_code(400);
    exit('Invalid ID');
}

$stmt = $conn->prepare("SELECT image_blob, image_type FROM products WHERE id = ?");
$stmt->execute([$id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row || empty($row['image_blob'])) {
    http_response_code(404);
    exit('Image not found');
}

header("Content-Type: " . $row['image_type']);
header("Content-Length: " . strlen($row['image_blob']));
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
echo $row['image_blob'];