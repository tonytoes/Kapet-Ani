<?php 

    require_once "connection.php";
    $name = $_POST['ruleName'] ?? null;
    $product_id = $_POST['product_id'] ?? null;
    $category_id = $_POST['category'] ?? null;
    $attribute = $_POST['attribute'] ?? null;
    $condition = $_POST['condition'] ?? null;
    $value = $_POST['value'] ?? null;
    $status = $_POST['status'] ?? null;
    
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        // Fetch data
        $stmt = $conn->query("INSERT INTO inventory_alert 
                              VALUES (null, '$name', '$product_id', '$condition', '$value', '$category_id', '$status', null, null )
                            ");

    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }

$conn = null;
?>