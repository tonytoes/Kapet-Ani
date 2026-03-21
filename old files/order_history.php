<?php
session_start();
if (!isset($_SESSION['email'])) {
  header("Location: login.php");
  exit();
}

include 'config.php';
$currency_symbol = "₱";
$currency_code = "PHP";
$email = $_SESSION['email'];
$orders_result = $conn->query("SELECT * FROM orders WHERE email = '$email' ORDER BY created_at DESC");

$orders = [];

while ($order = $orders_result->fetch_assoc()) {
  $order_id = $order['id'];

  $items_result = $conn->query("
        SELECT oi.qty, oi.price, 
              COALESCE(cp.name, 'Unknown Product') AS product_name
        FROM order_items oi
        LEFT JOIN coffee_products cp ON oi.prod_id = cp.id
        WHERE oi.order_id = $order_id
    ");

  $items = [];
  while ($item = $items_result->fetch_assoc()) {
    $items[] = $item;
  }
  $order['items'] = $items;
  $orders[] = $order;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order History | Kape’t Ani Coffee</title>
  <link rel="icon" href="assets/images/coffee.png" type="image/x-icon" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="order_history.css" />
</head>

<body>
  <header class="brand-header">
    <img src="assets/images/KA LOGO.png" alt="Kape’t Ani Logo" class="brand-logo" onclick="window.location.href='index.php'">
  </header>

  <div class="return-bar">
    <button class="btn-return" onclick="window.location.href='product_user.php'">← Return to Shop</button>
  </div>

  <section class="history-container">
    <div class="history-card">
      <h2 class="history-title mb-4">Your Order History</h2>

      <?php if (empty($orders)): ?>
        <p class="text-center">You have no orders yet.</p>
      <?php else: ?>
        <div class="table-responsive">
          <table class="table table-hover align-middle table-custom">
            <thead>
              <tr>
                <th>Tracking No</th>
                <th>Date Ordered</th>
                <th>Products</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($orders as $order): ?>
                <tr>
                  <td><?= htmlspecialchars($order['tracking_no']) ?></td>
                  <td><?= date("M d, Y H:i", strtotime($order['created_at'])) ?></td>
                  <td>
                    <ul class="mb-0">
                      <?php foreach ($order['items'] as $item): ?>
                        <li><?= htmlspecialchars($item['product_name']) ?> x <?= $item['qty'] ?> (<?= $currency_symbol . number_format($item['price'], 2) ?>)</li>
                      <?php endforeach; ?>
                    </ul>
                  </td>
                  <td><?= $currency_symbol . number_format($order['total_price'], 2) ?></td>
                  <td>
                    <?php
                    if ($order['status'] == 0) {
                      echo '<span class="status-pending">Pending</span>';
                    } elseif ($order['status'] == 1) {
                      echo '<span class="status-completed">Completed</span>';
                    } elseif ($order['status'] == 2) {
                      echo '<span class="status-cancelled">Cancelled</span>';
                    } else {
                      echo '<span class="status-unknown">Unknown</span>';
                    }
                    ?>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      <?php endif; ?>
    </div>
  </section>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>