

<?php
require_once "connection.php";
$category_id = $_GET['category_id'] ?? 0;
try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch data
    $stmt = $conn->prepare("SELECT id, name FROM products WHERE category_id = ?");
    $stmt->execute([$category_id]);
    
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$conn = null;
?>