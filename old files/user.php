<?php

session_start();
if (!isset($_SESSION['email'])) {
  header("Location: login.php");
  exit();
}

include 'config.php';

$email_session = $_SESSION['email'];

$first_name = "";
$last_name = "";
$email = "";

$res = mysqli_query($conn, "SELECT * FROM users WHERE email = '$email_session'");
if ($row = mysqli_fetch_assoc($res)) {
  $first_name = $row['first_name'];
  $last_name = $row['last_name'];
  $email = $row['email'];
}


?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="assets/images/coffee.png" type="image/x-icon" />
  <title>User | Kape't An</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    rel="stylesheet" />
  <link rel="stylesheet" href="user.css">
</head>

<body>

  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container-fluid position-relative">
      <a class="navbar-brand d-flex align-items-center" href="index.php">
        <img
          src="assets/images/coffee.png"
          alt="Kape't Ani Logo"
          height="40"
          class="me-2" />
        <span class="fw-semibold">Kape't Ani | User</span>
      </a>

      <div
        class="collapse navbar-collapse justify-content-center"
        id="navbarNav">
        <ul class="navbar-nav gap-3">
          <li class="nav-item">
            <a class="nav-link" href="index.php">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="product_user.php">Products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="review.php">Reviews</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="about.php">About</a>
          </li>
        </ul>
      </div>

      <div class="nav-actions">
        <a href="login.php"><i class="fa-solid fa-user"></i></a>
        <a href="#" class="position-relative">
          <i class="bi bi-cart2 fs-4"></i>
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon" style="filter: invert(1)"></span>
        </button>
      </div>
    </div>
  </nav>

  <div class="container" style="margin-top: 120px;">
    <div class="row">
      <div class="col-md-3 mb-4">
        <div class="sidebar text-center shadow-sm">
          <img src="assets/images/userprofile.jpg" alt="Profile Picture">
          <h6 class="mt-2 mb-0">Welcome back <span><?= $_SESSION['first_name']; ?></span> !</h6>
          <a href="#" class="small text-decoration-none"><i class="bi bi-pencil"></i> Edit Profile</a>
          <hr>
          <div class="text-start ps-3">
            <a href="userprofile.php" class="active"><i class="bi bi-person"></i> My Account</a>
            <a href="order_history.php"><i class="bi bi-cart"></i>Order History</a>
            <a href="logout.php"><i class="bi bi-box-arrow-right"></i> Logout</a>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <form method="POST" action="">
          <div class="col-md-9">
            <div class="profile-card shadow-sm">
              <h4 class="fw-bold">My Profile</h4>
              <p>Manage and protect your account</p>
              <hr>

              <div class="mb-3 row">
                <label class="col-sm-3 col-form-label">First Name</label>
                <div class="col-sm-9">
                  <input type="text" name="first_name" class="form-control" value="<?php echo $first_name ?>">
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-3 col-form-label">Last Name</label>
                <div class="col-sm-9">
                  <input type="text" name="last_name" class="form-control" value="<?php echo $last_name ?>">
                </div>
              </div>

              <div class="mb-3 row">
                <label class="col-sm-3 col-form-label">Email</label>
                <div class="col-sm-9">
                  <input type="email" name="email" class="form-control" value="<?php echo $email ?>">
                </div>
              </div>

              <!--  <div class="mb-3 row">
            <label class="col-sm-3 col-form-label">Address</label>
            <div class="col-sm-9">
              <textarea class="form-control" rows="2"></textarea>
            </div>
          </div> -->

              <div class="text-end">
                <button type="submit" name="update" class="btn btn-custom px-4">Save Changes</button>
              </div>
        </form>
      </div>
    </div>
  </div>
  </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>

<?php
if (isset($_POST["update"])) {
  $first_name = $_POST['first_name'];
  $last_name = $_POST['last_name'];
  $email = $_POST['email'];

  $email_session = $_SESSION['email'];

  $query = "UPDATE users SET first_name='$first_name', last_name='$last_name', email='$email' WHERE email='$email_session'";

  mysqli_query($conn, $query) or die(mysqli_error($conn));

  $_SESSION['first_name'] = $first_name;
  $_SESSION['last_name'] = $last_name;
  $_SESSION['email'] = $email;

  echo "<script>window.location.href='user.php';</script>";
}
?>