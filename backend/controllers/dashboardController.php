<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/jwt.php';
 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
 
$action = $_GET['action'] ?? '';
 
if ($action === 'stats')   getDashboardStats();
if ($action === 'orders')  getRecentOrders();
if ($action === 'stock')   getLowStock();
if ($action === 'selling') getTopSelling();
 
 
function getDashboardStats()
{
    global $conn;
 
    $stmt = $conn->query("SELECT COALESCE(SUM(total_sales), 0) AS total FROM sales");
    $totalSales = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
 
    $stmt = $conn->query("SELECT COALESCE(SUM(total_sales), 0) AS total FROM sales
        JOIN orders ON sales.order_id = orders.id
        WHERE MONTH(orders.created_at) = MONTH(CURDATE())
          AND YEAR(orders.created_at)  = YEAR(CURDATE())");
    $salesMonth = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
 
    $stmt = $conn->query("SELECT COALESCE(SUM(total_sales), 0) AS total FROM sales
        JOIN orders ON sales.order_id = orders.id
        WHERE DATE(orders.created_at) = CURDATE()");
    $salesToday = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
 
    $stmt = $conn->query("SELECT COUNT(*) AS total FROM users");
    $totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
 
    $stmt = $conn->query("SELECT COUNT(*) AS total FROM users
        WHERE MONTH(created_at) = MONTH(CURDATE())
          AND YEAR(created_at)  = YEAR(CURDATE())");
    $newSignups = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
 
    $stmt = $conn->query("SELECT id, name, status FROM orders
        WHERE status = 'pending' ORDER BY created_at DESC LIMIT 5");
    $complaints = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
    echo json_encode([
        'success'    => true,
        'totalSales' => '₱' . number_format($totalSales, 2),
        'salesMonth' => '₱' . number_format($salesMonth, 2),
        'salesToday' => '₱' . number_format($salesToday, 2),
        'totalUsers' => (int) $totalUsers,
        'newSignups' => (int) $newSignups,
        'complaints' => $complaints,
    ]);
}
 
 
function getRecentOrders()
{
    global $conn;
 
    $stmt = $conn->query("SELECT id, tracking_no, name, created_at, total_price, status
        FROM orders ORDER BY created_at DESC LIMIT 10");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
    $formatted = array_map(fn($o) => [
        'id'     => '#' . $o['tracking_no'],
        'buyer'  => $o['name'],
        'date'   => date('M d, Y', strtotime($o['created_at'])),
        'amount' => '₱' . number_format($o['total_price'], 2),
        'status' => $o['status'],
    ], $orders);
 
    echo json_encode(['success' => true, 'orders' => $formatted]);
}
 
 
function getLowStock()
{
    global $conn;
 
    $stmt = $conn->query("SELECT id, name, qty FROM products WHERE qty <= 10 ORDER BY qty ASC LIMIT 10");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
    $formatted = array_map(fn($p) => [
        'no'        => 'PRD-' . str_pad($p['id'], 3, '0', STR_PAD_LEFT),
        'name'      => $p['name'],
        'remaining' => (int) $p['qty'],
        'status'    => $p['qty'] == 0 ? 'Out of Stock' : 'Low Stock',
    ], $items);
 
    echo json_encode(['success' => true, 'items' => $formatted]);
}
 
 
function getTopSelling()
{
    global $conn;
 
    $stmt = $conn->query("
        SELECT p.name, SUM(oi.qty) AS total_sold
        FROM order_items oi
        JOIN products p ON oi.prod_id = p.id
        GROUP BY oi.prod_id
        ORDER BY total_sold DESC
        LIMIT 5
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
 
    $max = $rows ? max(array_column($rows, 'total_sold')) : 1;
 
    $formatted = array_map(fn($r) => [
        'name' => $r['name'],
        'pct'  => $max > 0 ? round(($r['total_sold'] / $max) * 100) : 0,
    ], $rows);
 
    echo json_encode(['success' => true, 'items' => $formatted]);
}