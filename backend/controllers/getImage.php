<?php
require_once __DIR__ . '/../config/config.php';

$db   = new Database();
$conn = $db->connect();

$id = (int) ($_GET['id'] ?? 0);
$size = (int) ($_GET['size'] ?? 0);
if ($size > 128) $size = 128;
if ($size < 0) $size = 0;

if (!$id) {
    http_response_code(400);
    exit('Invalid ID');
}

$stmt = $conn->prepare("SELECT image_blob, image_type, updated_at FROM users WHERE id = ?");
$stmt->execute([$id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row || empty($row['image_blob'])) {
    http_response_code(404);
    exit('Image not found');
}

// Cache aggressively for tiny avatar use-cases.
$updatedAt = isset($row['updated_at']) ? strtotime((string)$row['updated_at']) : time();
if ($updatedAt <= 0) $updatedAt = time();
$lastModified = gmdate('D, d M Y H:i:s', $updatedAt) . ' GMT';
$ifModifiedSince = $_SERVER['HTTP_IF_MODIFIED_SINCE'] ?? '';
if ($ifModifiedSince && strtotime($ifModifiedSince) >= $updatedAt) {
    http_response_code(304);
    exit();
}

header("Cache-Control: public, max-age=2592000, immutable");
header("Last-Modified: " . $lastModified);

if ($size > 0 && function_exists('imagecreatefromstring') && function_exists('imagewebp')) {
    $src = @imagecreatefromstring($row['image_blob']);
    if ($src !== false) {
        $srcW = imagesx($src);
        $srcH = imagesy($src);
        $edge = min($srcW, $srcH);
        $srcX = (int)(($srcW - $edge) / 2);
        $srcY = (int)(($srcH - $edge) / 2);
        $dst = imagecreatetruecolor($size, $size);
        imagecopyresampled($dst, $src, 0, 0, $srcX, $srcY, $size, $size, $edge, $edge);
        header("Content-Type: image/webp");
        imagewebp($dst, null, 68);
        imagedestroy($dst);
        imagedestroy($src);
        exit();
    }
}

header("Content-Type: " . $row['image_type']);
header("Content-Length: " . strlen($row['image_blob']));

// ✅ output image
echo $row['image_blob'];