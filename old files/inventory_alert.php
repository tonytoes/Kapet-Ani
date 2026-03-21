<!-- Don't Mind This File -->
<?php
include "config.php";
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inventory Alert</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="./inventory.css">
</head>

<body>

  <!-- NAVBAR -->
  <nav class="navbar">
    <div class="logo">
      <img src="assets/images/kape't_ani_logo_white.png" alt="Kape't Ani Logo">
      <h1>Kape’t Ani Admin</h1>
    </div>
    <ul class="nav-links">
      <li><a href="#">Dashboard</a></li>
      <li><a href="user_admin.php">Users</a></li>
      <li><a href="product_admin.php">Products</a></li>
      <li><a href="#">Orders</a></li>
      <li><a href="#">Reports</a></li>
      <li><a href="logout.php" class="logout">Logout</a></li>
    </ul>
  </nav>


  <div class="container my-5">

    <h2 class="fw-bold text-brown mb-4">Inventory Alert</h2>

    <!-- Alert List -->
    <div class="alert-section mb-5">
      <h4 class="section-title">Alert List</h4>
      <div class="d-flex justify-content-end mb-2">
      </div>

      <div class="card p-3 shadow-sm border-0 rounded-4">
        <table class="table align-middle mb-0">
          <thead class="table-header text-white">
            <tr>
              <th>Rule Name</th>
              <th>Product</th>
              <th>Alert Value</th>
              <th> Quantity </th>
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
                echo   '<td>';
                echo $ruleValue;
                echo '</td>';
                echo   '<td> "' . $productDetails['qty'] . '</td>';
                echo '</tr>';
              }
            }
            ?>
          </tbody>
        </table>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
      const enabledButtons = document.querySelectorAll('.enabledButton');
      var isButtonEnabled = true;
      enabledButtons.forEach(button => {

        button.addEventListener('click', function() {
          isButtonEnabled = !isButtonEnabled;
          if (isButtonEnabled) {
            button.innerText = "Yes";
          } else if (!isButtonEnabled) {
            button.innerText = "No";
          }


        });
      });
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