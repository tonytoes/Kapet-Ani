<?php
session_start();
include 'config.php';

if (!isset($_SESSION['email'])) {
  header("Location: login.php");
  exit();
}

$tracking_no = 'ANI' . rand(100000, 999999);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $user_email = $_SESSION['email'];
  $name = $_POST['first_name'];
  $address = $_POST['address'];
  $phone = $_POST['phone'];
  $postalcode = $_POST['postalcode'];
  $cart_data = json_decode($_POST['cart_data'], true);

  $total_amount = 0;
  foreach ($cart_data as $item) {
    $price = floatval(str_replace("₱", "", $item['price']));
    $total_amount += $price * $item['qty'];
  }

  $shipping = 50;
  $total_amount += $shipping;

  $stmt = $conn->prepare("INSERT INTO orders (tracking_no, user_id, name, email, address, phone, postalcode, total_price, status, created_at) VALUES (?, 0, ?, ?, ?, ?, ?, ?, 0, NOW())");
  $stmt->bind_param("ssssssd", $tracking_no, $name, $user_email, $address, $phone, $postalcode, $total_amount);
  $stmt->execute();
  $order_id = $stmt->insert_id;
  $stmt->close();

  foreach ($cart_data as $item) {
    $prod_id = $item['id'];
    $qty = $item['qty'];
    $price = floatval(str_replace("₱", "", $item['price']));
    $category = strtolower($item['category']);

    $stmt = $conn->prepare("INSERT INTO order_items (order_id, prod_id, qty, price, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("iiid", $order_id, $prod_id, $qty, $price);
    $stmt->execute();
    $stmt->close();

    $tableName = null;
    switch ($category) {
      case 'coffee':
        $tableName = 'coffee_products';
        break;
      case 'cultural':
        $tableName = 'cultural_products';
        break;
      case 'seasonal':
        $tableName = 'seasonal_products';
        break;
    }

    if ($tableName) {
      $updateStmt = $conn->prepare("UPDATE $tableName SET qty = GREATEST(qty - ?, 0) WHERE id = ?");
      $updateStmt->bind_param("ii", $qty, $prod_id);
      $updateStmt->execute();
      $updateStmt->close();
    }
  }

  $_SESSION['order_details'] = [
    'tracking_no' => $tracking_no,
    'total_amount' => $total_amount,
    'cart_data' => $cart_data,
    'created_at' => date("Y-m-d H:i:s")
  ];

  header("Location: order_confirmation.php");
  exit();
}
