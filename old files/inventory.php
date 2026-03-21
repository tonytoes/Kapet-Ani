<?php
include "config.php";

$showAlertIcon = false;
$table = mysqli_query($conn, "SELECT * FROM inventory_alert");
while ($row = mysqli_fetch_array($table)) {
  $ruleValue = $row['rule_value'];
  $condition = $row['condition'];
  $category = $row['category'];
  $product = $row['product'];
  $tableName = $category . "_products";

  $productQuery = mysqli_query($conn, "SELECT qty FROM $tableName WHERE name='$product'");
  $productData = mysqli_fetch_array($productQuery);
  $quantity = $productData['qty'];

  $conditionMet = false;
  switch ($condition) {
    case '<=':
      $conditionMet = ($quantity <= $ruleValue);
      break;
    case '>=':
      $conditionMet = ($quantity >= $ruleValue);
      break;
  }

  if ($conditionMet && $row['enabled'] == 1) {
    $showAlertIcon = true;
    break; // stop once we find one true alert
  }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inventory Alert | Products</title>
  <link rel="icon" href="assets/images/coffee.png" type="image/x-icon">
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet">
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
    rel="stylesheet">
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
    rel="stylesheet">
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" rel="stylesheet">
  <link rel="stylesheet" href="inventory.css">
</head>

<body>

  <header class="top-bar d-flex align-items-center">
    <button
      class="btn sidebar-toggle-btn me-3"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#sidebarNav"
      aria-controls="sidebarNav">
      <i class="ri-menu-line"></i>
    </button>
    <h1 class="logo-title">Kape’t Ani Admin</h1>
  </header>

  <nav
    class="sidebar offcanvas offcanvas-start"
    tabindex="-1"
    id="sidebarNav"
    aria-labelledby="sidebarNavLabel">
    <div class="offcanvas-header justify-content-end">
      <button
        type="button"
        class="btn-close text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div class="logo sidebar-logo">
        <img src="assets/images/kape't_ani_logo_white.png" alt="Kape't Ani Logo" />
        <h1 class="h3">Kape’t Ani Admin</h1>
      </div>
      <ul class="nav-links">
        <li><a href="admin.php">Dashboard</a></li>
        <li><a href="user_admin.php">Users</a></li>
        <li><a href="product_admin.php">Products</a></li>
        <li><a href=" order_admin.php">Orders</a></li>
        <li><a href="inventory.php" class="active">Alerts</a></li>
        <li><a href="logout.php" class="logout">Logout</a></li>
      </ul>
    </div>
  </nav>

  <!-- Alert Modal -->
  <div class="modal fade" id="inventory_alert" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">

        <div class="modal-header">
          <h2 class="modal-title fs-5" id="exampleModalLabel">Active Alerts</h2>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body" id="bodyOfModal">
          <div class="col-12 col-md-10 mx-auto ">
            <div class="container my-5">
              <div class="container-lg">
                <div class="card p-4 border-0 rounded-4">
                  <table class="table align-middle mb-0">
                    <thead class="table-header text-white">
                      <tr>
                        <th scope="col">Alert Name</th>
                        <th scope="col">Product</th>
                        <th scope="col">Alert Value</th>
                        <th scope="col">Current Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <?php
                      $table = mysqli_query($conn, "SELECT * FROM inventory_alert");
                      while ($row = mysqli_fetch_array($table)) {
                        $ruleName = $row['rule_name'];
                        $product = $row['product'];
                        $ruleValue = $row['rule_value'];
                        $condtion = $row['condition'];
                        $category = $row['category'];
                        $tableName = $category . "_products";

                        $sql = "SELECT * FROM $tableName WHERE `name` = '$product'";
                        $rowOfTheProduct = mysqli_query($conn, $sql);
                        $productDetails = mysqli_fetch_array($rowOfTheProduct);
                        $quantity = $productDetails['qty'];
                        $showAlert = false;
                        switch ($condtion) {
                          case '<=':
                            $showAlert = ($quantity <= $ruleValue);
                            break;
                          case '>=':
                            $showAlert = ($quantity >= $ruleValue);
                            break;
                        }
                        if ($showAlert && $row['enabled'] == 1) {
                          echo '<tr>';
                          echo   '<td>';
                          echo $ruleName;
                          echo '</td>';
                          echo   '<td>';
                          echo $product;
                          echo '</td>';
                          echo   '<td>'; ?> <span class="badge bg-danger"> <?php echo $ruleValue; ?> </span> <?php echo '</td>';
                                                                                                              echo   '<td> ' . $productDetails['qty'] . ' </td>';
                                                                                                              echo '</tr>';
                                                                                                            }
                                                                                                          }
                                                                                                              ?>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div> <!-- End of Modal Body -->
      </div>
    </div>
  </div>

  <!-- Add -->
  <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Add Rule</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="col-12 col-md-10 mx-auto ">
            <form action="inventory.php" name="addForm" method="POST">

              <input type="hidden" class="form-control" id="category" name="category">

              <div class=mb-3>
                <label for="rule_name" class="form-label">Rule Name: </label>
                <input type="text" class="form-control" id="rule_name" name="rule_name">
              </div>

              <div class=mb-3>
                <label for="rule_value" class="form-label">Value: </label>
                <input type="text" class="form-control" id="rule_value" name="rule_value">
              </div>

              <label for="rule_product" class="form-label">Product: &nbsp; &nbsp;</label>
              <div class="mb-3">
                <select data-category="coffee" class="product_list" name="rule_product" id="rule_product">
                  <?php
                  $table = mysqli_query($conn, "SELECT * FROM coffee_products");
                  while ($row = mysqli_fetch_array($table)) {
                    echo '<option value="' . $row['name'] . '">' . $row['name'] . '</option>';
                  }
                  ?>
                </select>
              </div>

              <div class="mb-3">
                <select data-category="cultural" class="product_list" name="rule_product" id="rule_product">
                  <?php
                  $table = mysqli_query($conn, "SELECT * FROM cultural_products");
                  while ($row = mysqli_fetch_array($table)) {
                    echo '<option value="' . $row['name'] . '">' . $row['name'] . '</option>';
                  }
                  ?>
                </select>
              </div>
              <div class="mb-3">
                <select data-category="seasonal" class="product_list" name="rule_product" id="rule_product">
                  <?php
                  $table = mysqli_query($conn, "SELECT * FROM seasonal_products");
                  while ($row = mysqli_fetch_array($table)) {
                    echo '<option value="' . $row['name'] . '">' . $row['name'] . '</option>';
                  }
                  ?>
                </select>
              </div>
              <div class="mb-3">
                <label for="rule_condtion" class="form-label">Condition:&nbsp;</label>
                <select name="rule_condtion" id="rule_condtion">
                  <option value="<=">Less Than or Equal</option>
                  <option value=">=">More Than or Equal</option>
                </select>
              </div>

              <div class=mb-3>
                <label for="rule_state">Enabled: &nbsp; &nbsp; </label>
                <select name="rule_state" id="rule_state">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>


              <div class="modal-footer">
                <button type="submit" class="btn btn-success" id="insert" name="insert">Submit</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
              </div>

            </form>
          </div>
        </div> <!-- End of Modal Body -->
      </div>
    </div>
  </div>

  <!-- Edit -->
  <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Product</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="col-12 col-md-10 mx-auto ">
            <form action="inventory.php" name="addForm" method="POST" enctype="multipart/form-data">

              <div class=mb-3>
                <label for="rule_name" class="form-label">Rule Name: </label>
                <input type="text" class="form-control" id="rule_name" name="rule_name">
              </div>

              <div class=mb-3>
                <label for="rule_value" class="form-label">Value: </label>
                <input type="text" class="form-control" id="rule_value" name="rule_value">
              </div>

              <label for="rule_product" class="form-label">Product: &nbsp; &nbsp;</label>
              <div class="mb-3">
                <select data-category="coffee" class="product_list" name="rule_product" id="rule_product">
                  <?php
                  $table = mysqli_query($conn, "SELECT * FROM coffee_products");
                  while ($row = mysqli_fetch_array($table)) {
                    echo '<option value="' . $row['name'] . '">' . $row['name'] . '</option>';
                  }
                  ?>
                </select>
              </div>

              <div class="mb-3">
                <select data-category="cultural" class="product_list" name="rule_product" id="rule_product">
                  <?php
                  $table = mysqli_query($conn, "SELECT * FROM cultural_products");
                  while ($row = mysqli_fetch_array($table)) {
                    echo '<option value="' . $row['name'] . '">' . $row['name'] . '</option>';
                  }
                  ?>
                </select>
              </div>

              <div class="mb-3">
                <select data-category="seasonal" class="product_list" name="rule_product" id="rule_product">
                  <?php
                  $table = mysqli_query($conn, "SELECT * FROM seasonal_products");
                  while ($row = mysqli_fetch_array($table)) {
                    echo '<option value="' . $row['name'] . '">' . $row['name'] . '</option>';
                  }
                  ?>
                </select>
              </div>

              <div class="mb-3">
                <label for="rule_condtion" class="form-label">Condition:</label>
                <select name="rule_condtion" id="rule_condtion">
                  <option value="<=">Less Than or Equal</option>
                  <option value=">=">More Than or Equal</option>
                </select>
              </div>


              <div class=mb-3>
                <select name="rule_state" id="rule_state">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>

              <input type="hidden" class="form-control" id="e_category" name="category">
              <input type="hidden" id="ediHiddenId" name="ediHiddenId">



              <div class="modal-footer">
                <button type="submit" class="btn btn-success" id="update" name="update">Submit</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
              </div>

            </form>
          </div>
        </div> <!-- End of Modal Body -->

      </div>
    </div>
  </div>


  <!-- Delete -->

  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Product</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="col-12 col-md-10 mx-auto ">
            <form action="inventory.php" name="addForm" method="POST" enctype="multipart/form-data">

              <div class="mb-3">
                <label for="delHiddenId">Are you sure you want to delete? </label>
                <input type="hidden" id="delHiddenId" name="delHiddenId">
              </div>

              <button type="submit" class="btn btn-success" id="delete" name="delete">Delete</button>
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>

            </form>
          </div>
        </div> <!-- End of Modal Body -->

      </div>
    </div>
  </div>

  <?php

  if (isset($_POST["insert"])) {
    // To escape special chars. 

    $rulename = mysqli_real_escape_string($conn, $_POST['rule_name']);
    $product = mysqli_real_escape_string($conn, $_POST['rule_product']);
    $condition = mysqli_real_escape_string($conn, $_POST['rule_condtion']);
    $value = mysqli_real_escape_string($conn, $_POST['rule_value']);
    $category = mysqli_real_escape_string($conn, $_POST['category']);
    $state = mysqli_real_escape_string($conn, $_POST['rule_state']);

    //Insert values to table 
    mysqli_query($conn, query: "INSERT INTO inventory_alert 
    (id, 
    rule_name, 
    product, 
    `condition`, 
    rule_value, 
    category,
    `enabled`)
          VALUES(NULL, '$rulename', '$product', '$condition', '$value', '$category', '$state')");
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>
  <?php
  }

  if (isset($_POST["update"])) {

    $rulename = mysqli_real_escape_string($conn, $_POST['rule_name']);
    $product = mysqli_real_escape_string($conn, $_POST['rule_product']);
    $condition = mysqli_real_escape_string($conn, $_POST['rule_condtion']);
    $value = mysqli_real_escape_string($conn, $_POST['rule_value']);
    $category = mysqli_real_escape_string($conn, $_POST['category']);
    $state = mysqli_real_escape_string($conn, $_POST['rule_state']);

    mysqli_query($conn, query: "UPDATE inventory_alert SET 

    `rule_name` = '$rulename', 
    `product` = '$product', 
    `condition` = '$condition',
    `rule_value` = '$value',
    `category` = '$category',
    `enabled` = '$state'
    WHERE id = $_POST[ediHiddenId]");
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>
  <?php
  }

  if (isset($_POST["delete"])) {

    mysqli_query($conn, query: "DELETE FROM inventory_alert WHERE id = $_POST[delHiddenId]");
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>
  <?php
  }
  ?>


  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <h2 class="fw-bold text-brown mb-4">Inventory Alert</h2>
      </div>
      <div class="col"> <?php if ($showAlertIcon): ?>
          <a id="alertButton" class="float-end" data-bs-toggle="modal" data-bs-target="#inventory_alert">
            <i class="fa-solid fa-triangle-exclamation text-danger"></i>
          </a>
        <?php endif; ?>
      </div>
    </div>

    <!-- Coffee & Matcha -->
    <div class="alert-section mb-5">
      <h4 class="section-title">Coffee & Matcha</h4>


      <div class="d-flex justify-content-end mb-2">
        <button type="button" class="btn btn-theme btn-add btn-sm" data-bs-toggle="modal" data-bs-target="#addModal" name="coffee">Add Rule</button>
      </div>

      <div class="card p-3 shadow-sm border-0 rounded-4">
        <table class="table align-middle mb-0">
          <thead class="table-header text-white">
            <tr>
              <th>Rule Name</th>
              <th>Product</th>
              <th>Attribute</th>
              <th>Condition</th>
              <th>Value</th>
              <th>Enabled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php
            $table = mysqli_query($conn, "SELECT * FROM inventory_alert WHERE category='coffee'");
            while ($row = mysqli_fetch_array($table)) {

              echo '<tr>';
              echo   '<td>';
              echo $row['rule_name'];
              echo '</td>';
              echo   '<td>';
              echo $row['product'];
              echo '</td>';
              echo   '<td>Quantity</td>';
              echo   '<td>';
              echo $row['condition'];
              echo '</td>';
              echo   '<td>';
              echo $row['rule_value'];
              echo '</td>';
              //enabled button
              if ($row['enabled'] == 0) {
                echo   '<td><span class="badge bg-danger">No</span></td>';
              } else {
                echo   '<td><span class="badge bg-success">Yes</span></td>';
              }
              echo   '<td>';
              echo   '<button id="' . $row['id'] . '" name="coffee" class="btn btn-theme btn-edit btn-sm me-1" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>';
              echo   '<button id="' . $row['id'] . '" class="btn btn-theme btn-delete btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>';
              echo   '</td>';
              echo '</tr>';
            }
            ?>
          </tbody>
        </table>
      </div>
    </div>


    <!-- Cultural Kits -->
    <div class="alert-section mb-5">
      <h4 class="section-title">Cultural Kits</h4>
      <div class="d-flex justify-content-end mb-2">
        <button type="button" class="btn btn-theme btn-add btn-sm" data-bs-toggle="modal" data-bs-target="#addModal" name="cultural">Add Rule</button>
      </div>

      <div class="card p-3 shadow-sm border-0 rounded-4">
        <table class="table align-middle mb-0">
          <thead class="table-header text-white">
            <tr>
              <th>Rule Name</th>
              <th>Product</th>
              <th>Attribute</th>
              <th>Condition</th>
              <th>Value</th>
              <th>Enabled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php
            $table = mysqli_query($conn, "SELECT * FROM inventory_alert WHERE category='cultural'");
            while ($row = mysqli_fetch_array($table)) {

              echo '<tr>';
              echo   '<td>';
              echo $row['rule_name'];
              echo '</td>';
              echo   '<td>';
              echo $row['product'];
              echo '</td>';
              echo   '<td>Quantity</td>';
              echo   '<td>';
              echo $row['condition'];
              echo '</td>';
              echo   '<td>';
              echo $row['rule_value'];
              echo '</td>';
              //enabled button
              if ($row['enabled'] == 0) {
                echo   '<td><span class="badge bg-danger">No</span></td>';
              } else {
                echo   '<td><span class="badge bg-success">Yes</span></td>';
              }
              echo   '<td>';
              echo   '<button id="' . $row['id'] . '" name="cultural" class="btn btn-theme btn-edit btn-sm me-1" 
                    data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>';

              echo   '<button id="' . $row['id'] . '" class="btn btn-theme btn-delete btn-sm" 
                    data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>';
              echo   '</td>';
              echo '</tr>';
            }
            ?>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Seasonal Specials -->
    <div class="alert-section">
      <h4 class="section-title">Seasonal Specials</h4>
      <div class="d-flex justify-content-end mb-2">
        <button type="button" class="btn btn-theme btn-add btn-sm" data-bs-toggle="modal" data-bs-target="#addModal" name="seasonal">Add Rule</button>
      </div>
      <div class="card p-3 shadow-sm border-0 rounded-4">
        <table class="table align-middle mb-0">
          <thead class="table-header text-white">
            <tr>
              <th>Rule Name</th>
              <th>Product</th>
              <th>Attribute</th>
              <th>Condition</th>
              <th>Value</th>
              <th>Enabled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php
            $table = mysqli_query($conn, "SELECT * FROM inventory_alert WHERE category='seasonal'");
            while ($row = mysqli_fetch_array($table)) {

              echo '<tr>';
              echo   '<td>';
              echo $row['rule_name'];
              echo '</td>';
              echo   '<td>';
              echo $row['product'];
              echo '</td>';
              echo   '<td>Quantity</td>';
              echo   '<td>';
              echo $row['condition'];
              echo '</td>';
              echo   '<td>';
              echo $row['rule_value'];
              echo '</td>';
              //enabled button
              if ($row['enabled'] == 0) {
                echo   '<td><span class="badge bg-danger">No</span></td>';
              } else {
                echo   '<td><span class="badge bg-success">Yes</span></td>';
              }
              echo   '<td>';
              echo   '<button id="' . $row['id'] . '" name="seasonal" class="btn btn-theme btn-edit btn-sm me-1" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>';
              echo   '<button id="' . $row['id'] . '" class="btn btn-theme btn-delete btn-sm" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button>';
              echo   '</td>';
              echo '</tr>';
            }
            ?>
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    //Add Modal
    const addModal = document.getElementById("addModal");
    addModal.addEventListener("show.bs.modal", function(event) {

      addButton = event.relatedTarget;


      //Set Category
      categoryInput = document.getElementById("category");
      categoryInput.value = addButton.name;
      categoryInputV = categoryInput.value;

      const productLists = document.querySelectorAll('.product_list');
      productLists.forEach(list => {
        list.hidden = true;
        list.disabled = true;

      });

      switch (categoryInputV) {
        case 'coffee': { //Active coffee list
          const coffeeList = document.querySelectorAll('.product_list[data-category="coffee"]');
          coffeeList.forEach(list => {
            list.hidden = false;
            list.disabled = false;
          });

        }

        break;
        case 'cultural': { //Active cultural list
          const culturalList = document.querySelectorAll('.product_list[data-category="cultural"]');
          culturalList.forEach(list => {
            list.hidden = false;
            list.disabled = false;
          });
        }

        break;
        case 'seasonal': { //Active seasonal list
          const seasonalList = document.querySelectorAll('.product_list[data-category="seasonal"]');
          seasonalList.forEach(list => {
            list.hidden = false;
            list.disabled = false;
          });
        }

        break;
      }
    });


    //Edit Modal 
    const editModal = document.getElementById('editModal');
    editModal.addEventListener('show.bs.modal', function(event) {

      const editButton = event.relatedTarget;


      //Set Category
      categoryInput = document.getElementById("e_category");
      categoryInput.value = editButton.name;
      document.getElementById('ediHiddenId').value = editButton.id; // set hidden input
      categoryInputV = categoryInput.value;

      const productLists = document.querySelectorAll('.product_list');
      productLists.forEach(list => {
        list.hidden = true;
        list.disabled = true;

      });

      switch (categoryInputV) {
        case 'coffee': { //Active coffee list
          const coffeeList = document.querySelectorAll('.product_list[data-category="coffee"]');
          coffeeList.forEach(list => {
            list.hidden = false;
            list.disabled = false;
          });

        }

        break;
        case 'cultural': { //Active cultural list
          const culturalList = document.querySelectorAll('.product_list[data-category="cultural"]');
          culturalList.forEach(list => {
            list.hidden = false;
            list.disabled = false;
          });
        }

        break;
        case 'seasonal': { //Active seasonal list
          const seasonalList = document.querySelectorAll('.product_list[data-category="seasonal"]');
          seasonalList.forEach(list => {
            list.hidden = false;
            list.disabled = false;
          });
        }

        break;
      }
    });

    //Delete Modal
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.addEventListener('show.bs.modal', function(event) {

      const deleteButton = event.relatedTarget;
      document.getElementById('delHiddenId').value = deleteButton.id; // set hidden input

    });
  </script>
</body>

</html>