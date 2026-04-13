<?php 
    require_once "connection.php";
    

    $rule_id = $_POST['rule_id'] ?? null;
    
    try {
        // Fetch data
        $stmt = $conn->query("DELETE FROM inventory_alert
                              WHERE id = '$rule_id'

                            ");

    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }

$conn = null;
?>