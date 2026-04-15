<?php
ini_set('display_errors', 0);
error_reporting(0);

require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/config.php';
applyCors();

$db   = new Database();
$conn = $db->connect();

$action = $_GET['action'] ?? '';

if ($action === 'stats')        getDashboardStats();
if ($action === 'orders')       getRecentOrders();
if ($action === 'stock')        getLowStock();
if ($action === 'selling')      getTopSelling();
if ($action === 'sales_trend')  getSalesTrend();
if ($action === 'order_status') getOrderStatusBreakdown();
if ($action === 'category_sales') getCategorySales();
if ($action === 'heatmap')      getTxHeatmap();

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Unknown action']);
exit();


// ─────────────────────────────────────────────────────────
// 📊 DASHBOARD STATS
// ─────────────────────────────────────────────────────────
function getDashboardStats()
{
    global $conn;

    $stmt = $conn->query("
        SELECT
            COALESCE(SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END), 0) AS totalSales,
            COALESCE(SUM(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN total_price ELSE 0 END), 0) AS salesMonth,
            COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN total_price ELSE 0 END), 0) AS salesToday,
            COUNT(*) AS totalOrders,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pendingOrders,
            COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) AS ordersToday
        FROM orders
        WHERE status IN ('confirmed','pending')
    ");
    $salesData = $stmt->fetch(PDO::FETCH_ASSOC);

    // Last month sales for growth comparison
    $stmt = $conn->query("
        SELECT COALESCE(SUM(total_price), 0) AS salesLastMonth
        FROM orders
        WHERE status IN ('confirmed')
          AND MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
          AND YEAR(created_at)  = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
    ");
    $lastMonth = $stmt->fetch(PDO::FETCH_ASSOC)['salesLastMonth'];

    $thisMonth  = (float) $salesData['salesMonth'];
    $growthPct  = $lastMonth > 0 ? round((($thisMonth - $lastMonth) / $lastMonth) * 100, 1) : 0;

    // Users
    $stmt       = $conn->query("SELECT COUNT(*) AS total FROM users");
    $totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $stmt      = $conn->query("SELECT COUNT(*) AS total FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    $newSignups = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Total products & out of stock
    $stmt          = $conn->query("SELECT COUNT(*) AS total FROM products");
    $totalProducts = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    $stmt        = $conn->query("SELECT COUNT(*) AS total FROM products WHERE qty = 0");
    $outOfStock  = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Pending orders preview
    $stmt = $conn->query("SELECT id, name, status FROM orders WHERE status = 'pending' ORDER BY created_at DESC LIMIT 3");
    $complaints = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'       => true,
        'totalSales'    => '₱' . number_format($salesData['totalSales'], 2),
        'salesMonth'    => '₱' . number_format($salesData['salesMonth'], 2),
        'salesToday'    => '₱' . number_format($salesData['salesToday'], 2),
        'totalOrders'   => (int) $salesData['totalOrders'],
        'pendingOrders' => (int) $salesData['pendingOrders'],
        'ordersToday'   => (int) $salesData['ordersToday'],
        'growthPct'     => $growthPct,
        'totalUsers'    => (int) $totalUsers,
        'newSignups'    => (int) $newSignups,
        'totalProducts' => (int) $totalProducts,
        'outOfStock'    => (int) $outOfStock,
        'complaints'    => $complaints,
    ]);
    exit();
}


// ─────────────────────────────────────────────────────────
// 📦 RECENT ORDERS
// ─────────────────────────────────────────────────────────
function getRecentOrders()
{
    global $conn;

    $stmt = $conn->query("
        SELECT id, tracking_no, name, created_at, total_price, status
        FROM orders
        ORDER BY created_at DESC
        LIMIT 7
    ");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $formatted = array_map(fn($o) => [
        'id'     => '#' . $o['tracking_no'],
        'buyer'  => $o['name'],
        'date'   => date('M d, Y', strtotime($o['created_at'])),
        'amount' => '₱' . number_format($o['total_price'], 2),
        'status' => $o['status'],
    ], $orders);

    echo json_encode(['success' => true, 'orders' => $formatted]);
    exit();
}


// ─────────────────────────────────────────────────────────
// ⚠️ LOW STOCK
// ─────────────────────────────────────────────────────────
function getLowStock()
{
    global $conn;

    $ruleStmt = $conn->query("
        SELECT product_id, stock_condition, rule_value
        FROM inventory_alert
        WHERE enabled = 1
    ");
    $rules = $ruleStmt->fetchAll(PDO::FETCH_ASSOC);

    $rulesByProduct = [];
    foreach ($rules as $r) {
        $pid = (int) $r['product_id'];
        if (!isset($rulesByProduct[$pid])) $rulesByProduct[$pid] = [];
        $rulesByProduct[$pid][] = [
            'condition' => $r['stock_condition'],
            'value'     => (int) $r['rule_value'],
        ];
    }

    $prodStmt = $conn->query("SELECT id, name, qty FROM products ORDER BY qty ASC");
    $products = $prodStmt->fetchAll(PDO::FETCH_ASSOC);

    $items = [];
    foreach ($products as $p) {
        $id  = (int) $p['id'];
        $qty = (int) $p['qty'];
        $hasAlertRule = !empty($rulesByProduct[$id]);

        $triggered = $qty === 0;

        if (!$triggered && $hasAlertRule) {
            foreach ($rulesByProduct[$id] as $rule) {
                $val  = $rule['value'];
                $cond = $rule['condition'];
                $match = match ($cond) {
                    '<=' => $qty <= $val,
                    '<'  => $qty <  $val,
                    '>=' => $qty >= $val,
                    '>'  => $qty >  $val,
                    '='  => $qty === $val,
                    default => false,
                };
                if ($match) {
                    $triggered = true;
                    break;
                }
            }
        }

        if (!$triggered && !$hasAlertRule && $qty <= 10) {
            $triggered = true;
        }

        if ($triggered) {
            $items[] = [
                'id'   => $id,
                'name' => $p['name'],
                'qty'  => $qty,
            ];
        }
    }

    $items = array_slice($items, 0, 20);

    $formatted = array_map(fn($p) => [
        'no'        => 'PRD-' . str_pad($p['id'], 3, '0', STR_PAD_LEFT),
        'name'      => $p['name'],
        'remaining' => (int) $p['qty'],
        'status'    => $p['qty'] == 0 ? 'Out of Stock' : 'Low Stock',
    ], $items);

    echo json_encode(['success' => true, 'items' => $formatted]);
    exit();
}


// ─────────────────────────────────────────────────────────
// 🔥 TOP SELLING
// ─────────────────────────────────────────────────────────
function getTopSelling()
{
    global $conn;

    $stmt = $conn->query("
        SELECT p.name, SUM(oi.qty) AS total_sold, SUM(oi.qty * oi.price) AS revenue
        FROM order_items oi
        JOIN products p ON oi.prod_id = p.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status IN ('confirmed')
        GROUP BY oi.prod_id
        ORDER BY total_sold DESC
        LIMIT 5
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $max = $rows ? max(array_column($rows, 'total_sold')) : 1;

    $formatted = array_map(fn($r) => [
        'name'       => $r['name'],
        'total_sold' => (int) $r['total_sold'],
        'revenue'    => '₱' . number_format($r['revenue'], 2),
        'pct'        => $max > 0 ? round(($r['total_sold'] / $max) * 100) : 0,
    ], $rows);

    echo json_encode(['success' => true, 'items' => $formatted]);
    exit();
}


// ─────────────────────────────────────────────────────────
// 📈 SALES TREND (last 7 days)
// ─────────────────────────────────────────────────────────
function getSalesTrend()
{
    global $conn;

    $stmt = $conn->query("
        SELECT
            DATE(created_at) AS day,
            COALESCE(SUM(total_price), 0) AS revenue,
            COUNT(*) AS orders
        FROM orders
        WHERE status IN ('confirmed')
          AND created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(created_at)
        ORDER BY day ASC
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $map = [];
    foreach ($rows as $r) $map[$r['day']] = $r;

    $result = [];
    for ($i = 6; $i >= 0; $i--) {
        $d   = date('Y-m-d', strtotime("-{$i} days"));
        $lbl = date('D', strtotime($d));
        $result[] = [
            'label'   => $lbl,
            'date'    => $d,
            'revenue' => isset($map[$d]) ? (float) $map[$d]['revenue'] : 0,
            'orders'  => isset($map[$d]) ? (int)   $map[$d]['orders']  : 0,
        ];
    }

    echo json_encode(['success' => true, 'trend' => $result]);
    exit();
}


// ─────────────────────────────────────────────────────────
// 🥧 ORDER STATUS BREAKDOWN
// ─────────────────────────────────────────────────────────
function getOrderStatusBreakdown()
{
    global $conn;

    $stmt = $conn->query("
        SELECT status, COUNT(*) AS total
        FROM orders
        GROUP BY status
        ORDER BY total DESC
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $colorMap = [
        'delivered'  => '#22C55E',
        'confirmed'  => '#3B82F6',
        'shipped'    => '#8B5CF6',
        'pending'    => '#F97316',
        'cancelled'  => '#EF4444',
    ];

    $formatted = array_map(fn($r) => [
        'label' => ucfirst($r['status']),
        'value' => (int) $r['total'],
        'color' => $colorMap[strtolower($r['status'])] ?? '#9CA3AF',
    ], $rows);

    echo json_encode(['success' => true, 'breakdown' => $formatted]);
    exit();
}


// ─────────────────────────────────────────────────────────
// 🥧 CATEGORY SALES BREAKDOWN
// ─────────────────────────────────────────────────────────
function getCategorySales()
{
    global $conn;

    $stmt = $conn->query("
        SELECT
            COALESCE(c.name, 'Uncategorized') AS category,
            SUM(oi.qty * oi.price) AS revenue
        FROM order_items oi
        JOIN products p ON oi.prod_id = p.id
        JOIN orders o ON oi.order_id = o.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE o.status IN ('confirmed')
        GROUP BY p.category_id
        ORDER BY revenue DESC
        LIMIT 6
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $palette = ['#C9873A','#8B5A2B','#f0c27c','#3B82F6','#22C55E','#8B5CF6'];

    $formatted = array_map(function ($r, $i) use ($palette) {
        return [
            'label'   => $r['category'],
            'value'   => (float) $r['revenue'],
            'display' => '₱' . number_format($r['revenue'], 0),
            'color'   => $palette[$i % count($palette)],
        ];
    }, $rows, array_keys($rows));

    echo json_encode(['success' => true, 'categories' => $formatted]);
    exit();
}


// ─────────────────────────────────────────────────────────
// 📅 ORDER ACTIVITY HEATMAP (last 365 days)
// ─────────────────────────────────────────────────────────
function getTxHeatmap()
{
    global $conn;

    $conn->exec("SET time_zone = '+08:00'");

    $stmt = $conn->query("
        SELECT DATE(created_at) AS day, COUNT(*) AS total
        FROM orders
        WHERE status IN('confirmed','pending')
          AND created_at >= DATE_SUB(CURDATE(), INTERVAL 364 DAY)
        GROUP BY DATE(created_at)
        ORDER BY day ASC
    ");

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $map = [];
    foreach ($rows as $r) {
        $map[$r['day']] = (int) $r['total'];
    }

    echo json_encode(['success' => true, 'heatmap' => $map]);
    exit();
}