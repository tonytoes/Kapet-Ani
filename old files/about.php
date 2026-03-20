<?php

session_start();
if (!isset($_SESSION['email'])) {
  header("Location: login.php");
  exit();
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About Us | Kape't Ani</title>
  <link rel="icon" href="assets/images/coffee.png" type="image/x-icon" />

  <!-- Bootstrap + Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <!-- Custom CSS -->
  <link rel="stylesheet" href="about.css" />
</head>

<body>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container-fluid position-relative">
      <a class="navbar-brand d-flex align-items-center" href="index.php">
        <img src="assets/images/coffee.png" alt="Logo" height="40" class="me-2" />
        <span class="fw-semibold">Kape't Ani | About</span>
      </a>

      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav gap-3">
          <li class="nav-item"><a class="nav-link" href="index.php">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="product_user.php">Products</a></li>
          <li class="nav-item"><a class="nav-link" href="review.php">Reviews</a></li>
          <li class="nav-item"><a class="nav-link active" href="about.php">About</a></li>
        </ul>
      </div>

      <div class="nav-actions">
        <a href="user.php"><i class="fa-solid fa-user"></i></a>

        <a href="product_user.php" class="position-relative">
          <i class="bi bi-cart2 fs-4"></i>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon" style="filter: invert(1)"></span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Hero/About Header -->
  <section class="hero-section">
    <div class="hero-content text-center text-light">
      <h1 class="fw-bold">About Kape’t Ani</h1>
      <p class="lead">Empowering Local Farmers and Sharing Filipino Coffee Culture with the World</p>
    </div>
  </section>

  <!-- About Description -->
  <section class="py-5">
    <div class="container text-center">
      <h2 class="fw-bold mb-4" style="color: #442808">Our Story</h2>
      <p class="mx-auto" style="max-width: 750px">
        Kape’t Ani was built on the vision of bringing the finest Filipino coffee and cultural crafts to every home. Our
        team is dedicated to supporting local farmers and artisans, combining tradition with modern e-commerce to make
        their creations more accessible globally.
      </p>
    </div>
  </section>

  <!-- Team Section -->
  <section class="pb-5">
    <div class="container text-center">
      <h2 class="fw-bold mb-5" style="color: #442808">Meet the Team</h2>

      <div class="row justify-content-center mb-4 g-4">
        <div class="col-md-4 col-sm-6">
          <div class="team-card p-4 shadow rounded-4 bg-white">
            <img src="assets/images/BalungayMukha.png" class="rounded-circle mb-3" style="width:150px; height:150px; object-fit:cover" alt="" />
            <h5 class="fw-bold">Anthony Miguel G. Balungay</h5>
            <p class="text-muted mb-1">CEO & Founder</p>
          </div>
        </div>
        <div class="col-md-4 col-sm-6">
          <div class="team-card p-4 shadow rounded-4 bg-white">
            <img src="assets/images/BugayongMukha.png" class="rounded-circle mb-3" style="width:150px; height:150px; object-fit:cover" alt="" />
            <h5 class="fw-bold">Elaiza O. Bugayong</h5>
            <p class="text-muted mb-1">Head Barista & Product Curator</p>
          </div>
        </div>
        <div class="col-md-4 col-sm-6">
          <div class="team-card p-4 shadow rounded-4 bg-white">
            <img src="assets/images/CarlosMukha.png" class="rounded-circle mb-3" style="width:150px; height:150px; object-fit:cover" alt="" />
            <h5 class="fw-bold">Reuel L. Carlos</h5>
            <p class="text-muted mb-1">Operations Manager</p>
          </div>
        </div>
      </div>

      <div class="row justify-content-center g-4">
        <div class="col-md-4 col-sm-6">
          <div class="team-card p-4 shadow rounded-4 bg-white">
            <img src="assets/images/ObedienteMukha.png" class="rounded-circle mb-3" style="width:150px; height:150px; object-fit:cover" alt="" />
            <h5 class="fw-bold">Arkynes Obediente</h5>
            <p class="text-muted mb-1">Technical Lead / Website Lead</p>
          </div>
        </div>
        <div class="col-md-4 col-sm-6">
          <div class="team-card p-4 shadow rounded-4 bg-white">
            <img src="assets/images/UayanMukha.png" class="rounded-circle mb-3" style="width:150px; height:150px; object-fit:cover" alt="" />
            <h5 class="fw-bold">John Michael Vincent M. Uayan</h5>
            <p class="text-muted mb-1">Marketing & Community Manager</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer_section text-light pt-5 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-4 text-center">
          <img src="assets/images/kape't_ani_logo_white.png" alt="" style="width: 250px" />
          <div class="d-flex justify-content-center gap-3 my-3">
            <a href="#" class="fs-5"><i class="fab fa-facebook"></i></a>
            <a href="#" class="fs-5"><i class="fab fa-twitter"></i></a>
            <a href="#" class="fs-5"><i class="fab fa-tiktok"></i></a>
            <a href="#" class="fs-5"><i class="fab fa-instagram"></i></a>
          </div>
          <p class="small">&copy; 2025 All rights reserved</p>
        </div>

        <div class="col-md-3 mb-4">
          <h5 class="fw-bold mb-3">About</h5>
          <ul class="list-unstyled">
            <li class="pt-2"><a href="#" class="text-decoration-none">Menu</a></li>
            <li class="pt-2"><a href="#" class="text-decoration-none">Features</a></li>
            <li class="pt-2"><a href="#" class="text-decoration-none">Blogs</a></li>
            <li class="pt-2"><a href="#" class="text-decoration-none">Help & Support</a></li>
          </ul>
        </div>

        <div class="col-md-3 mb-4">
          <h5 class="fw-bold mb-3">Company</h5>
          <ul class="list-unstyled">
            <li class="pt-2"><a href="#" class="text-decoration-none">Terms of Service</a></li>
            <li class="pt-2"><a href="#" class="text-decoration-none">How we work</a></li>
            <li class="pt-2"><a href="#" class="text-decoration-none">Pricing</a></li>
            <li class="pt-2"><a href="#" class="text-decoration-none">FAQs</a></li>
          </ul>
        </div>

        <div class="col-md-3 mb-4">
          <h5 class="fw-bold mb-3">Our Location</h5>
          <p class="mb-1">938 Aurora Boulevard,</p>
          <p class="mb-3">Cubao, Quezon City, Metro Manila</p>
          <ul class="list-unstyled">
            <li class="pt-2"><a href="#" class="text-decoration-none">+1 202-918-2132</a></li>
            <li class="pt-2"><a href="#" class="text-decoration-none">kapetani@gmail.com</a></li>
            <li class="pt-2"><a href="#" class="text-decoration-none">www.kapetani.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>