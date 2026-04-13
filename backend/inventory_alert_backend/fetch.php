<?php 
require_once "connection.php";

try {

    $stmt = $conn->prepare("
        SELECT i.id AS rule_id, 
               i.rule_name,
               p.name AS product_name, 
               i.product_id,
               i.category_id,
               i.stock_condition, 
               i.rule_value, 
               c.name AS category, 
               i.enabled AS status,
               i.enabled AS alert,
               i.enabled,
               p.qty AS quantity,
               i.created_at,
               i.updated_at
        FROM inventory_alert i 
        JOIN products p ON p.id = i.product_id
        JOIN categories c ON i.category_id = c.id
    ");
    
    $stmt->execute();

    $rules = [];
    $result = false;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        // Customize enabled column
        if ($row['status'] == 1) {
            $row['status'] = "Online";
        } else if ($row['status'] == 2){
            $row['status'] = "Offline";
        } else{
            $row['status'] = "Offline";
        }

        $condition = $row['stock_condition'];
    
        if($condition == ">="){
           $result = $row['quantity'] >= $row['rule_value'];
        }else if($condition == "<="){
            $result = $row['quantity'] <= $row['rule_value'];
        }else if($condition == ">"){
            $result = $row['quantity'] > $row['rule_value'];
        }else if($condition == "<"){
            $result = $row['quantity'] < $row['rule_value'];
        }else if($condition == "="){
            $result = $row['quantity'] == $row['rule_value'];
        }


        if($result && $row['enabled'] == 1){
            $row['alert'] = "Warning";
        }else if(!$result && $row['enabled'] == 1){
            $row['alert'] = "Normal";
        }else{
            $row['alert'] = "Offline";
        }
        $rules[] = $row;
    }

    echo json_encode($rules);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

$conn = null;
?>