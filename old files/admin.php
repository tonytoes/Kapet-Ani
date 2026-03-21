<?php
session_start();
date_default_timezone_set('Asia/Manila');

if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}

include 'config.php';

$sales_result = $conn->query("SELECT SUM(total_sales) AS total_sales FROM sales");
$sales_row = $sales_result->fetch_assoc();
$total_sales = $sales_row['total_sales'] ?? 0;

$orders_result = $conn->query("SELECT COUNT(*) AS total_orders FROM orders");
$orders_row = $orders_result->fetch_assoc();
$total_orders = $orders_row['total_orders'] ?? 0;

$users_result = $conn->query("SELECT COUNT(*) AS total_users FROM users");
$users_row = $users_result->fetch_assoc();
$total_users = $users_row['total_users'] ?? 0;

$coffee_result = $conn->query("SELECT COUNT(*) AS total_coffee_products FROM coffee_products");
$coffee_row = $coffee_result->fetch_assoc();
$total_coffee_products = $coffee_row['total_coffee_products'] ?? 0;

$seasonal_result = $conn->query("SELECT COUNT(*) AS total_seasonal_products FROM seasonal_products");
$seasonal_row = $seasonal_result->fetch_assoc();
$total_seasonal_products = $seasonal_row['total_seasonal_products'] ?? 0;

$cultural_result = $conn->query("SELECT COUNT(*) AS total_cultural_products FROM cultural_products");
$cultural_row = $cultural_result->fetch_assoc();
$total_cultural_products = $cultural_row['total_cultural_products'] ?? 0;

$total_products = $total_coffee_products + $total_seasonal_products + $total_cultural_products;


$seven_days_ago = date('Y-m-d H:i:s', strtotime('-7 days'));
$daily_sales_data = [];
$daily_orders_data = [];

$chart_data_query = $conn->query("
    SELECT 
        DATE(created_at) AS order_day, 
        SUM(total_price) AS daily_sales, 
        COUNT(*) AS daily_orders
    FROM orders
    WHERE created_at >= '$seven_days_ago'
    GROUP BY order_day
    ORDER BY order_day ASC
");

if ($chart_data_query) {
    while ($row = $chart_data_query->fetch_assoc()) {
        $daily_sales_data[date('M j', strtotime($row['order_day']))] = $row['daily_sales'];
        $daily_orders_data[date('M j', strtotime($row['order_day']))] = $row['daily_orders'];
    }
}

$chart_dates = json_encode(array_keys($daily_sales_data));
$chart_sales = json_encode(array_values($daily_sales_data));
$chart_orders = json_encode(array_values($daily_orders_data));
$product_labels = json_encode(['Coffee', 'Seasonal', 'Cultural']);
$product_counts = json_encode([$total_coffee_products, $total_seasonal_products, $total_cultural_products]);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="assets/images/coffee.png" type="image/x-icon" />
    <title>Kape't Ani Admin | Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="admin.css" />
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
</head>

<body>

    <header class="top-bar d-flex align-items-center">
        <button class="btn sidebar-toggle-btn me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarNav" aria-controls="sidebarNav">
            <i class="ri-menu-line"></i>
        </button>
        <h1 class="logo-title">Kape’t Ani Admin</h1>
    </header>

    <nav class="sidebar offcanvas offcanvas-start" tabindex="-1" id="sidebarNav" aria-labelledby="sidebarNavLabel">
        <div class="offcanvas-header justify-content-end">
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
            <div class="logo sidebar-logo">
                <img src="assets/images/kape't_ani_logo_white.png" alt="Kape't Ani Logo">
                <h1 class="h3">Kape’t Ani Admin</h1>
            </div>
            <ul class="nav-links">
                <li><a href="admin.php" class="active">Dashboard</a></li>
                <li><a href="user_admin.php">Users</a></li>
                <li><a href="product_admin.php">Products</a></li>
                <li><a href="order_admin.php">Orders</a></li>
                <li><a href="inventory.php">Alerts</a></li>
                <li><a href="logout.php" class="logout">Logout</a></li>
            </ul>
        </div>
    </nav>

    <div id="main-content-wrapper">
        <main class="dashboard dashboard-content">
            <h2>Dashboard Overview</h2>
            <p class="last-updated">Last updated: <?= date("F j, Y, g:i a") ?></p>

            <section class="main-metrics-grid mb-5">
                <div class="row g-4">

                    <div class="col-lg-6 col-md-6">
                        <h3 class="metric-title">ORDERS</h3>
                        <div class="chart-box card chart-1">
                            <canvas id="ordersChart"></canvas>
                        </div>
                    </div>

                    <div class="col-lg-6 col-md-6">
                        <h3 class="metric-title">PRODUCTS</h3>
                        <div class="chart-box card chart-2">
                            <canvas id="productsChart"></canvas>
                        </div>
                    </div>

                    <div class="col-lg-6 col-md-6">
                        <h3 class="metric-title">SALES</h3>
                        <div class="chart-box card chart-3">
                            <canvas id="salesChart"></canvas>
                        </div>
                    </div>

                    <div class="col-lg-6 col-md-6">
                        <h3 class="metric-title">USERS</h3>
                        <div class="chart-box card chart-4 d-flex flex-column justify-content-center align-items-center text-center">
                            <i class="ri-user-3-line" style="font-size: 5rem; color: var(--text-light);"></i>
                            <h4 class="mt-3" style="color: var(--text-light);">Total Registered Users</h4>
                            <p style="font-size: 4rem; font-weight: bold; color: var(--text-light);"><?= $total_users ?></p>
                        </div>
                    </div>

                </div>
            </section>

            <hr class="my-4">

        </main>
    </div>

    <script>
        const chartDates = <?= $chart_dates ?>;
        const chartSales = <?= $chart_sales ?>;
        const chartOrders = <?= $chart_orders ?>;
        const productLabels = <?= $product_labels ?>;
        const productCounts = <?= $product_counts ?>;

        const DEEP_ROAST = '#3c2a21';
        const VELVET_CREAM = '#ffbb00ff';
        const GOLDEN_CARAMEL = '#af5800ff';
        const TEXT_LIGHT = '#ffffff';

        Chart.defaults.color = TEXT_LIGHT;
        Chart.defaults.backgroundColor = 'transparent';
        Chart.defaults.font.family = 'Poppins, sans-serif';

        const GRID_COLOR = 'rgba(255, 255, 255, 0.2)';

        new Chart(document.getElementById('salesChart'), {
            type: 'line',
            data: {
                labels: chartDates,
                datasets: [{
                    label: 'Daily Sales (₱)',
                    data: chartSales,
                    borderColor: GOLDEN_CARAMEL,
                    backgroundColor: 'rgba(212, 163, 115, 0.3)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Sales (₱)',
                            color: TEXT_LIGHT
                        },
                        grid: {
                            color: GRID_COLOR
                        },
                        ticks: {
                            color: TEXT_LIGHT
                        }
                    },
                    x: {
                        grid: {
                            color: GRID_COLOR
                        },
                        ticks: {
                            color: TEXT_LIGHT
                        }
                    }
                }
            }
        });

        // === ORDERS CHART ===
        new Chart(document.getElementById('ordersChart'), {
            type: 'line',
            data: {
                labels: chartDates,
                datasets: [{
                    label: 'Orders per Day',
                    data: chartOrders,
                    borderColor: VELVET_CREAM,
                    backgroundColor: 'rgba(148, 126, 93, 0.3)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Orders',
                            color: TEXT_LIGHT
                        },
                        grid: {
                            color: GRID_COLOR
                        },
                        ticks: {
                            color: TEXT_LIGHT
                        }
                    },
                    x: {
                        grid: {
                            color: GRID_COLOR
                        },
                        ticks: {
                            color: TEXT_LIGHT
                        }
                    }
                }
            }
        });

        // === PRODUCTS CHART ===
        new Chart(document.getElementById('productsChart'), {
            type: 'bar',
            data: {
                labels: productLabels,
                datasets: [{
                    label: 'Product Count',
                    data: productCounts,
                    backgroundColor: [DEEP_ROAST, GOLDEN_CARAMEL, VELVET_CREAM],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Count',
                            color: TEXT_LIGHT
                        },
                        grid: {
                            color: GRID_COLOR
                        },
                        ticks: {
                            color: TEXT_LIGHT
                        }
                    },
                    x: {
                        grid: {
                            color: GRID_COLOR
                        },
                        ticks: {
                            color: TEXT_LIGHT
                        }
                    }
                }
            }
        });
    </script>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</body>

</html>