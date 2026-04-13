<?php 
    require_once "connection.php";
    
    $name = $_POST['ruleName'] ?? null;
    $product_id = $_POST['product_id'] ?? null;
    $category_id = $_POST['category'] ?? null;
    $condition = $_POST['condition'] ?? null;
    $value = $_POST['value'] ?? null;
    $status = $_POST['status'] ?? null;
    $rule_id = $_POST['rule_id'] ?? null;
    $created_at = $_POST['created_at'] ?? null;
    
    try {

    
        // Fetch data
        $stmt = $conn->query("UPDATE  inventory_alert 
                              SET 
                              rule_name = '$name',
                              product_id = '$product_id',
                              stock_condition = '$condition',
                              rule_value = '$value',
                              category_id = '$category_id',
                              enabled = '$status',
                              created_at = '$created_at',   
                              updated_at = null
                              WHERE id = '$rule_id'

                            ");

    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }

$conn = null;
?>