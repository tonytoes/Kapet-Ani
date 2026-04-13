<?php 
    require_once "connection.php";
    

    $rule_id = $_POST['rule_id'] ?? null;
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        // Fetch data
        $stmt = $conn->query("DELETE FROM inventory_alert
                              WHERE id = '$rule_id'

                            ");

    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }

$conn = null;
?>