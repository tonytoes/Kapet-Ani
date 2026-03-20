<?php

include "config.php";

/*$res = mysqli_query($conn, "SELECT * FROM $category WHERE product_id = '$product_id'");
if ($row = mysqli_fetch_assoc($res)) {
  $name = $row['name'];
  $description = $row['description'];
  $price = $price['price'];
  $image_name = $image_name['image_name'];
  $image_blob = $image_blob['image_blob'];
  $image_type = $image_type['image_type'];
}*/

?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kape't Ani | Products</title>
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
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" rel="stylesheet">

  <link rel="stylesheet" href="product_admin.css">
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
        <li><a href="product_admin.php" class="active">Products</a></li>
        <li><a href="order_admin.php">Orders</a></li>
        <li><a href="inventory.php">Alerts</a></li>
        <li><a href="logout.php" class="logout">Logout</a></li>
      </ul>
    </div>
  </nav>


  <!-- Product Section -->
  <section class="py-5">
    <div class="container">

      <!-- Coffee -->
      <h4 class="fw-bold mb-4 mt-5" style="color: #442808">Coffee and Matcha</h4>
      <div class="row g-4" id="coffee-products"></div>

      <!-- Add Button -->
      <div class="row g-4 mt-3">
        <div class="col-md-3 col-sm-6">
          <div class="card-body text-center">
            <button type="button" id="Coffee" data-bs-toggle="modal" data-bs-target="#addModal" class="btn btn-sm w-100 h-100 text-light">ADD PRODUCT</button>
          </div>
        </div>
      </div>

      <hr class="my-5" style="border-top: 2px solid #dcb764; opacity: 0.5">

      <!-- Cultural Kits -->
      <h4 class="fw-bold mb-4" style="color: #442808">Cultural Kits</h4>
      <div class="row g-4" id="kit-products"></div>

      <!-- Add Button -->
      <div class="row g-4 mt-3">
        <div class="col-md-3 col-sm-6">
          <div class="card-body text-center">
            <button type="button" id="Cultural" data-bs-toggle="modal" data-bs-target="#addModal" class="btn btn-sm w-100 h-100 text-light">ADD PRODUCT</button>
          </div>
        </div>
      </div>

      <hr class="my-5" style="border-top: 3px dashed #b66d2f; opacity: 0.8">

      <!-- Autumn Specials -->
      <div class="text-center mb-4">
        <h4 class="fw-bold" style="color: #b66d2f">Seasonal Specials</h4>
        <p class="text-muted">
          Limited edition flavors and cultural kits to celebrate the cozy
          season!
        </p>
      </div>
      <div class="row g-4" id="autumn-products"> </div>

      <!-- Add Button -->
      <div class="row g-4 mt-3">
        <div class="col-md-3 col-sm-6">
          <div class="card-body text-center">
            <button type="button" id="Seasonal" data-bs-toggle="modal" data-bs-target="#addModal" class="btn btn-sm w-100 h-100 text-light">ADD PRODUCT</button>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Modal -->
  <!-- Add -->
  <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">

        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Add Product</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="col-12 col-md-10 mx-auto ">
            <form action="product_admin.php" name="addForm" method="POST" enctype="multipart/form-data">


              <input type="hidden" class="form-control" id="product_category" name="product_category">

              <div class=mb-3>
                <label for="product_name" class="form-label">Product Name: </label>
                <input type="text" class="form-control" id="product_name" name="product_name">
              </div>

              <div class=mb-3>
                <label for="product_description" class="form-label">Description </label>
                <input type="text" class="form-control" id="product_description" name="product_description">
              </div>

              <div class=mb-3>
                <label for="product_price" class="form-label">Price: </label>
                <input type="number" class="form-control" id="product_price" name="product_price" required>
              </div>

              <div class=mb-3>
                <label for="product_discount" class="form-label">Discount Percentage: </label>
                <input type="number" class="form-control" id="product_discount" name="product_discount" min="0" max="100" value="0" required>
              </div>

              <div class="mb-3">
                <label for="product_qty" class="form-label">Quantity:</label>
                <input type="number" class="form-control" id="product_qty" name="product_qty" min="0" value="0">
              </div>

              <div class="mb-3">
                <label for="product_image" class="form-label">Image: </label>
                <input type="file" id="product_image" name="product_image" accept="image/*" required>
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
            <form action="product_admin.php" name="addForm" method="POST" enctype="multipart/form-data">

              <div class="mb-3">
                <input type="hidden" id="e_product_id" name="e_product_id">
                <input type="hidden" id="product_category" name="product_category">
                <input type="hidden" id="oldImgType" name="e_oldImgType">
                <input type="hidden" id="oldImgName" name="e_oldImgName">
                <input type="hidden" id="oldImgData" name="e_oldImgData">
              </div>

              <div class=mb-3>
                <label for="e_product_name" class="form-label">Product Name: </label>
                <input type="text" class="form-control" id="e_product_name" name="e_product_name">
              </div>

              <div class=mb-3>
                <label for="e_product_description" class="form-label">Description </label>
                <input type="text" class="form-control" id="e_product_description" name="e_product_description">
              </div>

              <div class=mb-3>
                <label for="e_product_price" class="form-label">Price: </label>
                <input type="number" class="form-control" id="e_product_price" name="e_product_price" required>
              </div>

              <div class=mb-3>
                <label for="e_product_discount" class="form-label">Discount Percentage: </label>
                <input type="number" class="form-control" id="e_product_discount" name="e_product_discount" min="0" max="100" value="0" required>
              </div>

              <div class="mb-3">
                <label for="e_product_qty" class="form-label">Quantity:</label>
                <input type="number" class="form-control" id="e_product_qty" name="e_product_qty" min="0" value="0">
              </div>

              <div class="mb-3">
                <label for="e_product_image" class="form-label">Image: </label>
                <input type="file" id="e_product_image" name="e_product_image" accept="image/*">
                <div id="emailHelp" class="form-text">Old image is saved. Only input an image if you want to change.</div>
              </div>



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
            <form action="product_admin.php" name="addForm" method="POST" enctype="multipart/form-data">

              <div class="mb-3">
                <label>Are you sure you want to delete? </label>
                <input type="hidden" id="d_product_id" name="d_product_id">
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

  if (isset($_POST["insertCoffee"])) {
    // To escape special chars. 

    if ($_POST['product_discount'] != 0) {

      $discount = mysqli_real_escape_string($conn, $_POST['product_discount']);
      $discount_amount = $discount / 100;
      $price = mysqli_real_escape_string($conn, $_POST['product_price']);
      if ($discount == 100) {
        $discounted_price = $price - $price;
      } else {
        $discounted_price = $price - $price * $discount_amount;
      }

      $image = file_get_contents($_FILES['product_image']['tmp_name']);
      $name = mysqli_real_escape_string($conn, $_POST['product_name']);
      $description = mysqli_real_escape_string($conn, $_POST['product_description']);


      $qty = mysqli_real_escape_string($conn, $_POST['product_qty']);
      $imageName = mysqli_real_escape_string($conn, $_FILES['product_image']['name']);
      $imageData = mysqli_real_escape_string($conn, $image);
      $imageType = mysqli_real_escape_string($conn, $_FILES['product_image']['type']);
      //Insert values to table - Reminder: The column should be in order same with the table 
      mysqli_query($conn, "INSERT INTO coffee_products (id, name, description, original_price, price, discount, qty, image_name, image_blob, image_type)
                 VALUES(NULL, '$name', '$description', $price,'$discounted_price', '$discount', '$qty', '$imageName', '$imageData', '$imageType')");
    } else {
      // To escape special chars. 
      $image = file_get_contents($_FILES['product_image']['tmp_name']);

      $name = mysqli_real_escape_string($conn, $_POST['product_name']);
      $description = mysqli_real_escape_string($conn, $_POST['product_description']);
      $price = mysqli_real_escape_string($conn, $_POST['product_price']);
      $discount = mysqli_real_escape_string($conn, $_POST['product_discount']);
      $qty = mysqli_real_escape_string($conn, $_POST['product_qty']);
      $imageName = mysqli_real_escape_string($conn, $_FILES['product_image']['name']);
      $imageData = mysqli_real_escape_string($conn, $image);
      $imageType = mysqli_real_escape_string($conn, $_FILES['product_image']['type']);


      //Insert values to table - Reminder: The column should be in order same with the table 
      mysqli_query($conn, "INSERT INTO coffee_products (id, name, description, original_price, price, discount, qty, image_name, image_blob, image_type)
            VALUES(NULL, '$name', '$description', $price, '$price', '$discount', '$qty', '$imageName', '$imageData', '$imageType')");
    }


  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>
  <?php
  }

  if (isset($_POST["insertCultural"])) {

    if ($_POST['product_discount'] != 0) {

      $discount = mysqli_real_escape_string($conn, $_POST['product_discount']);
      $discount_amount = $discount / 100;
      $price = mysqli_real_escape_string($conn, $_POST['product_price']);
      if ($discount == 100) {
        $discounted_price = $price - $price;
      } else {
        $discounted_price = $price - $price * $discount_amount;;
      }

      $image = file_get_contents($_FILES['product_image']['tmp_name']);
      $name = mysqli_real_escape_string($conn, $_POST['product_name']);
      $description = mysqli_real_escape_string($conn, $_POST['product_description']);


      $qty = mysqli_real_escape_string($conn, $_POST['product_qty']);
      $imageName = mysqli_real_escape_string($conn, $_FILES['product_image']['name']);
      $imageData = mysqli_real_escape_string($conn, $image);
      $imageType = mysqli_real_escape_string($conn, $_FILES['product_image']['type']);
      //Insert values to table - Reminder: The column should be in order same with the table 
      mysqli_query($conn, "INSERT INTO cultural_products (id, name, description, original_price, price, discount, qty, image_name, image_blob, image_type)
          VALUES(NULL, '$name', '$description', $price,'$discounted_price', '$discount', '$qty', '$imageName', '$imageData', '$imageType')");
    } else {
      // To escape special chars. 
      $image = file_get_contents($_FILES['product_image']['tmp_name']);

      $name = mysqli_real_escape_string($conn, $_POST['product_name']);
      $description = mysqli_real_escape_string($conn, $_POST['product_description']);
      $price = mysqli_real_escape_string($conn, $_POST['product_price']);
      $discount = mysqli_real_escape_string($conn, $_POST['product_discount']);
      $qty = mysqli_real_escape_string($conn, $_POST['product_qty']);
      $imageName = mysqli_real_escape_string($conn, $_FILES['product_image']['name']);
      $imageData = mysqli_real_escape_string($conn, $image);
      $imageType = mysqli_real_escape_string($conn, $_FILES['product_image']['type']);


      //Insert values to table - Reminder: The column should be in order same with the table 
      mysqli_query($conn, "INSERT INTO cultural_products (id, name, description, original_price, price, discount, qty, image_name, image_blob, image_type)
            VALUES(NULL, '$name', '$description', $price, '$price', '$discount', '$qty', '$imageName', '$imageData', '$imageType')");
    }
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>
  <?php
  }

  if (isset($_POST["insertSeasonal"])) {
    if ($_POST['product_discount'] != 0) {

      $discount = mysqli_real_escape_string($conn, $_POST['product_discount']);
      $discount_amount = $discount / 100;
      $price = mysqli_real_escape_string($conn, $_POST['product_price']);
      if ($discount == 100) {
        $discounted_price = $price - $price;
      } else {
        $discounted_price = $price - $price * $discount_amount;;
      }

      $image = file_get_contents($_FILES['product_image']['tmp_name']);
      $name = mysqli_real_escape_string($conn, $_POST['product_name']);
      $description = mysqli_real_escape_string($conn, $_POST['product_description']);


      $qty = mysqli_real_escape_string($conn, $_POST['product_qty']);
      $imageName = mysqli_real_escape_string($conn, $_FILES['product_image']['name']);
      $imageData = mysqli_real_escape_string($conn, $image);
      $imageType = mysqli_real_escape_string($conn, $_FILES['product_image']['type']);
      //Insert values to table - Reminder: The column should be in order same with the table 
      mysqli_query($conn, "INSERT INTO seasonal_products (id, name, description, original_price, price, discount, qty, image_name, image_blob, image_type)
          VALUES(NULL, '$name', '$description', $price,'$discounted_price', '$discount', '$qty', '$imageName', '$imageData', '$imageType')");
    } else {
      // To escape special chars. 
      $image = file_get_contents($_FILES['product_image']['tmp_name']);

      $name = mysqli_real_escape_string($conn, $_POST['product_name']);
      $description = mysqli_real_escape_string($conn, $_POST['product_description']);
      $price = mysqli_real_escape_string($conn, $_POST['product_price']);
      $discount = mysqli_real_escape_string($conn, $_POST['product_discount']);
      $qty = mysqli_real_escape_string($conn, $_POST['product_qty']);
      $imageName = mysqli_real_escape_string($conn, $_FILES['product_image']['name']);
      $imageData = mysqli_real_escape_string($conn, $image);
      $imageType = mysqli_real_escape_string($conn, $_FILES['product_image']['type']);


      //Insert values to table - Reminder: The column should be in order same with the table 
      mysqli_query($conn, "INSERT INTO seasonal_products (id, name, description, original_price, price, discount, qty, image_name, image_blob, image_type)
            VALUES(NULL, '$name', '$description', $price, '$price', '$discount', '$qty', '$imageName', '$imageData', '$imageType')");
    }
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>
  <?php
  }




  if (isset($_POST["updateCoffee"])) {
    //Selected new Image
    if (!empty($_FILES['e_product_image']['tmp_name'])) {

      //Has discount
      if ($_POST['e_product_discount'] != 0) {
        $discount = mysqli_real_escape_string($conn, $_POST['e_product_discount']);
        $discount_amount = $discount / 100;

        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);

        if ($discount == 100) {
          $discounted_price = $price - $price;
        } else {
          $discounted_price = $price - $price * $discount_amount;;
        }

        $image = file_get_contents($_FILES['e_product_image']['tmp_name']);

        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);

        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);
        $imageName = mysqli_real_escape_string($conn, $_FILES['e_product_image']['name']);
        $imageData = mysqli_real_escape_string($conn, $image);
        $imageType = mysqli_real_escape_string($conn, $_FILES['e_product_image']['type']);

        mysqli_query($conn, "UPDATE coffee_products SET 

              `name` = '$name', 
              `description` = '$description',  
              `original_price` = '$price',  
              `price` = '$discounted_price',  
              `discount` = '$discount',  
              `qty` = '$qty', 
              `image_name` = '$imageName',
              `image_blob` = '$imageData',
              `image_type` = '$imageType' 
              WHERE id=$_POST[e_product_id]");
      } else { //No discount
        $image = file_get_contents($_FILES['e_product_image']['tmp_name']);

        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);
        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);
        $discount = mysqli_real_escape_string($conn, $_POST['e_product_discount']);
        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);
        $imageName = mysqli_real_escape_string($conn, $_FILES['e_product_image']['name']);
        $imageData = mysqli_real_escape_string($conn, $image);
        $imageType = mysqli_real_escape_string($conn, $_FILES['e_product_image']['type']);

        mysqli_query($conn, "UPDATE coffee_products SET 

              `name` = '$name', 
              `description` = '$description', 
              `original_price` = '$price',   
              `price` = '$price',  
              `discount` = '$discount',  
              `qty` = '$qty', 
              `image_name` = '$imageName',
              `image_blob` = '$imageData',
              `image_type` = '$imageType' 
              WHERE id=$_POST[e_product_id]");
      }
    } else {
      //Old Image
      ///Has discount
      if ($_POST['e_product_discount'] != 0) {

        //Calculate discount
        $discount = mysqli_real_escape_string($conn, $_POST['e_product_discount']);
        $discount_amount = $discount / 100;

        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);
        if ($discount == 100) { //Haven't add to insert
          $discounted_price = $price - $price;
        } else {
          $discounted_price = $price - $price * $discount_amount;;
        }

        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);
        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);

        $oldImgType = mysqli_real_escape_string($conn, $_POST['e_oldImgType']);
        $oldImgName = mysqli_real_escape_string($conn, $_POST['e_oldImgName']);
        $oldImgData = base64_decode($_POST['e_oldImgData']);
        $oldImgData = mysqli_real_escape_string($conn, $oldImgData);

        mysqli_query($conn, "UPDATE coffee_products SET 

              `name` = '$name', 
              `description` = '$description',  
              `original_price` = '$price',  
              `price` = '$discounted_price',  
              `discount` = '$discount',  
              `qty` = '$qty' ,
              `image_name` = '$oldImgName',
              `image_blob` = '$oldImgData',
              `image_type` = '$oldImgType'  
              WHERE id=$_POST[e_product_id]");
      } else {
        ///No discount
        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);
        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);
        $discount = mysqli_real_escape_string($conn, $_POST['e_product_discount']);
        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);

        $oldImgType = mysqli_real_escape_string($conn, $_POST['e_oldImgType']);
        $oldImgName = mysqli_real_escape_string($conn, $_POST['e_oldImgName']);
        $oldImgData = base64_decode($_POST['e_oldImgData']);
        $oldImgData = mysqli_real_escape_string($conn, $oldImgData);

        mysqli_query($conn, "UPDATE coffee_products SET 

              `name` = '$name', 
              `description` = '$description',  
              `original_price` = '$price',  
              `price` = '$price',  
              `discount` = '$discount',  
              `qty` = '$qty' ,
              `image_name` = '$oldImgName',
              `image_blob` = '$oldImgData',
              `image_type` = '$oldImgType'  
              WHERE id=$_POST[e_product_id]");
      }
    }
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>

  <?php
  }

  if (isset($_POST["updateCultural"])) {

    //Selected new Image
    if (!empty($_FILES['e_product_image']['tmp_name'])) {

      //Has discount
      if ($_POST['e_product_discount'] != 0) {
        $discount = mysqli_real_escape_string($conn, $_POST['e_product_discount']);
        $discount_amount = $discount / 100;

        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);

        if ($discount == 100) {
          $discounted_price = $price - $price;
        } else {
          $discounted_price = $price - $price * $discount_amount;;
        }

        $image = file_get_contents($_FILES['e_product_image']['tmp_name']);

        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);

        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);
        $imageName = mysqli_real_escape_string($conn, $_FILES['e_product_image']['name']);
        $imageData = mysqli_real_escape_string($conn, $image);
        $imageType = mysqli_real_escape_string($conn, $_FILES['e_product_image']['type']);

        mysqli_query($conn, "UPDATE cultural_products SET 

              `name` = '$name', 
              `description` = '$description', 
              `original_price` = '$price',   
              `price` = '$discounted_price',  
              `discount` = '$discount',  
              `qty` = '$qty', 
              `image_name` = '$imageName',
              `image_blob` = '$imageData',
              `image_type` = '$imageType' 
              WHERE id=$_POST[e_product_id]");
      } else { //No discount
        $image = file_get_contents($_FILES['e_product_image']['tmp_name']);

        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);
        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);
        $discount = mysqli_real_escape_string($conn, $_POST['e_product_discount']);
        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);
        $imageName = mysqli_real_escape_string($conn, $_FILES['e_product_image']['name']);
        $imageData = mysqli_real_escape_string($conn, $image);
        $imageType = mysqli_real_escape_string($conn, $_FILES['e_product_image']['type']);

        mysqli_query($conn, "UPDATE cultural_products SET 

              `name` = '$name', 
              `description` = '$description',
              `original_price` = '$price',    
              `price` = '$price',  
              `discount` = '$discount',  
              `qty` = '$qty', 
              `image_name` = '$imageName',
              `image_blob` = '$imageData',
              `image_type` = '$imageType' 
              WHERE id=$_POST[e_product_id]");
      }
    } else {
      //Old Image
      ///Has discount
      if ($_POST['e_product_discount'] != 0) {

        //Calculate discount
        $discount = mysqli_real_escape_string($conn, $_POST['e_product_discount']);
        $discount_amount = $discount / 100;

        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);
        if ($discount == 100) { //Haven't add to insert
          $discounted_price = $price - $price;
        } else {
          $discounted_price = $price - $price * $discount_amount;;
        }

        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);
        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);

        $oldImgType = mysqli_real_escape_string($conn, $_POST['e_oldImgType']);
        $oldImgName = mysqli_real_escape_string($conn, $_POST['e_oldImgName']);
        $oldImgData = base64_decode($_POST['e_oldImgData']);
        $oldImgData = mysqli_real_escape_string($conn, $oldImgData);

        mysqli_query($conn, "UPDATE cultural_products SET 

              `name` = '$name', 
              `description` = '$description',  
              `original_price` = '$price',  
              `price` = '$discounted_price',  
              `discount` = '$discount',  
              `qty` = '$qty' ,
              `image_name` = '$oldImgName',
              `image_blob` = '$oldImgData',
              `image_type` = '$oldImgType'  
              WHERE id=$_POST[e_product_id]");
      } else {
        ///No discount
        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);
        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);
        $discount = mysqli_real_escape_string($conn, $_POST['product_discount']);
        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);

        $oldImgType = mysqli_real_escape_string($conn, $_POST['e_oldImgType']);
        $oldImgName = mysqli_real_escape_string($conn, $_POST['e_oldImgName']);
        $oldImgData = base64_decode($_POST['e_oldImgData']);
        $oldImgData = mysqli_real_escape_string($conn, $oldImgData);

        mysqli_query($conn, "UPDATE cultural_products SET 

              `name` = '$name', 
              `description` = '$description',  
              `original_price` = '$price',  
              `price` = '$price',  
              `discount` = '$discount',  
              `qty` = '$qty' ,
              `image_name` = '$oldImgName',
              `image_blob` = '$oldImgData',
              `image_type` = '$oldImgType'  
              WHERE id=$_POST[e_product_id]");
      }
    }
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>

  <?php
  }

  if (isset($_POST["updateSeasonal"])) {

    //Selected new Image
    if (!empty($_FILES['e_product_image']['tmp_name'])) {

      //Has discount
      if ($_POST['e_product_discount'] != 0) {
        $discount = mysqli_real_escape_string($conn, $_POST['e_product_discount']);
        $discount_amount = $discount / 100;

        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);

        if ($discount == 100) {
          $discounted_price = $price - $price;
        } else {
          $discounted_price = $price - $price * $discount_amount;;
        }

        $image = file_get_contents($_FILES['e_product_image']['tmp_name']);

        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);

        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);
        $imageName = mysqli_real_escape_string($conn, $_FILES['e_product_image']['name']);
        $imageData = mysqli_real_escape_string($conn, $image);
        $imageType = mysqli_real_escape_string($conn, $_FILES['e_product_image']['type']);

        mysqli_query($conn, "UPDATE seasonal_products SET 

              `name` = '$name', 
              `description` = '$description', 
              `original_price` = '$price',   
              `price` = '$discounted_price',  
              `discount` = '$discount',  
              `qty` = '$qty', 
              `image_name` = '$imageName',
              `image_blob` = '$imageData',
              `image_type` = '$imageType' 
              WHERE id=$_POST[e_product_id]");
      } else { //No discount
        $image = file_get_contents($_FILES['e_product_image']['tmp_name']);

        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);
        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);
        $discount = mysqli_real_escape_string($conn, $_POST['e_product_discount']);
        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);
        $imageName = mysqli_real_escape_string($conn, $_FILES['e_product_image']['name']);
        $imageData = mysqli_real_escape_string($conn, $image);
        $imageType = mysqli_real_escape_string($conn, $_FILES['e_product_image']['type']);

        mysqli_query($conn, "UPDATE seasonal_products SET 

              `name` = '$name', 
              `description` = '$description',
              `original_price` = '$price',    
              `price` = '$price',  
              `discount` = '$discount',  
              `qty` = '$qty', 
              `image_name` = '$imageName',
              `image_blob` = '$imageData',
              `image_type` = '$imageType' 
              WHERE id=$_POST[e_product_id]");
      }
    } else {
      //Old Image
      ///Has discount
      if ($_POST['e_product_discount'] != 0) {

        //Calculate discount
        $discount = mysqli_real_escape_string($conn, $_POST['e_product_discount']);
        $discount_amount = $discount / 100;

        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);
        if ($discount == 100) { //Haven't add to insert
          $discounted_price = $price - $price;
        } else {
          $discounted_price = $price - $price * $discount_amount;;
        }

        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);
        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);

        $oldImgType = mysqli_real_escape_string($conn, $_POST['e_oldImgType']);
        $oldImgName = mysqli_real_escape_string($conn, $_POST['e_oldImgName']);
        $oldImgData = base64_decode($_POST['e_oldImgData']);
        $oldImgData = mysqli_real_escape_string($conn, $oldImgData);

        mysqli_query($conn, "UPDATE seasonal_products SET 

              `name` = '$name', 
              `description` = '$description',  
              `original_price` = '$price',  
              `price` = '$discounted_price',  
              `discount` = '$discount',  
              `qty` = '$qty' ,
              `image_name` = '$oldImgName',
              `image_blob` = '$oldImgData',
              `image_type` = '$oldImgType'  
              WHERE id=$_POST[e_product_id]");
      } else {
        ///No discount
        $name = mysqli_real_escape_string($conn, $_POST['e_product_name']);
        $description = mysqli_real_escape_string($conn, $_POST['e_product_description']);
        $price = mysqli_real_escape_string($conn, $_POST['e_product_price']);
        $discount = mysqli_real_escape_string($conn, $_POST['product_discount']);
        $qty = mysqli_real_escape_string($conn, $_POST['e_product_qty']);

        $oldImgType = mysqli_real_escape_string($conn, $_POST['e_oldImgType']);
        $oldImgName = mysqli_real_escape_string($conn, $_POST['e_oldImgName']);
        $oldImgData = base64_decode($_POST['e_oldImgData']);
        $oldImgData = mysqli_real_escape_string($conn, $oldImgData);

        mysqli_query($conn, "UPDATE seasonal_products SET 

              `name` = '$name', 
              `description` = '$description',  
              `original_price` = '$price',  
              `price` = '$price',  
              `discount` = '$discount',  
              `qty` = '$qty' ,
              `image_name` = '$oldImgName',
              `image_blob` = '$oldImgData',
              `image_type` = '$oldImgType'  
              WHERE id=$_POST[e_product_id]");
      }
    }
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>

  <?php
  }

  if (isset($_POST["deleteCoffee"])) {

    //Insert values to table
    mysqli_query($conn, "DELETE FROM coffee_products WHERE id=$_POST[d_product_id]");
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>

  <?php
  }

  if (isset($_POST["deleteCultural"])) {

    //Insert values to table
    mysqli_query($conn, "DELETE FROM cultural_products WHERE id=$_POST[d_product_id]");
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>

  <?php
  }

  if (isset($_POST["deleteSeasonal"])) {

    //Insert values to table
    mysqli_query($conn, "DELETE FROM seasonal_products WHERE id=$_POST[d_product_id]");
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>

  <?php
  }


  ?>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
    const coffeeProducts = [
      <?php
      $table = mysqli_query($conn, "SELECT * FROM coffee_products");
      while ($row = mysqli_fetch_array($table)) {
        $imgBase64 = base64_encode($row["image_blob"]);
        $imageType = $row["image_type"];
        $imageName = $row["image_name"];

        echo '[';
        echo '"' . $row["id"] . '",';
        echo '"' . $row["name"] . '",';
        echo '"' . $row["description"] . '",';
        echo '"' . $row["original_price"] . '",';
        echo '"' . $row["price"] . '",';
        echo '"' . $row["discount"] . '",';
        echo '"' . $row["qty"] . '",';
        echo '"' . $imgBase64 . '",';
        echo '"' . $imageType . '",';
        echo '"' . $imageName . '",';
        echo '"Coffee"';
        echo '],';
      }
      ?>
    ];


    const kitProducts = [
      <?php
      $table = mysqli_query($conn, "SELECT * FROM cultural_products");
      while ($row = mysqli_fetch_array($table)) {
        $imgBase64 = base64_encode($row["image_blob"]);
        $imageType = $row["image_type"];

        echo '[';
        echo '"' . $row["id"] . '",';
        echo '"' . $row["name"] . '",';
        echo '"' . $row["description"] . '",';
        echo '"' . $row["original_price"] . '",';
        echo '"' . $row["price"] . '",';
        echo '"' . $row["discount"] . '",';
        echo '"' . $row["qty"] . '",';
        echo '"' . $imgBase64 . '",';
        echo '"' . $imageType . '",';
        echo '"' . $imageName . '",';
        echo '"Cultural"';
        echo '],';
      }
      ?>
    ];

    const autumnProducts = [
      <?php
      $table = mysqli_query($conn, "SELECT * FROM seasonal_products");
      while ($row = mysqli_fetch_array($table)) {
        $imgBase64 = base64_encode($row["image_blob"]);
        $imageType = $row["image_type"];

        echo '[';
        echo '"' . $row["id"] . '",';
        echo '"' . $row["name"] . '",';
        echo '"' . $row["description"] . '",';
        echo '"' . $row["original_price"] . '",';
        echo '"' . $row["price"] . '",';
        echo '"' . $row["discount"] . '",';
        echo '"' . $row["qty"] . '",';
        echo '"' . $imgBase64 . '",';
        echo '"' . $imageType . '",';
        echo '"' . $imageName . '",';
        echo '"Seasonal"';
        echo '],';
      }
      ?>
    ];
  </script>
  <script src="product_admin.js"></script>
  </script>
</body>

</html>