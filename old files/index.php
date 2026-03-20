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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kape't Ani</title>
  <link rel="icon" href="assets/images/coffee.png" type="image/x-icon" />

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <!-- Bootstrap Icons -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">

  <!-- Custom CSS -->
  <link rel="stylesheet" href="main.css">

  <!-- Custom Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

  <!-- JQUERY -->
  <link rel="stylesheet" href="https://code.jquery.com/ui/1.14.1/themes/base/jquery-ui.css">
  <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
  <script src="https://code.jquery.com/ui/1.14.1/jquery-ui.js"></script>
</head>

<body>

  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container-fluid position-relative">
      <a class="navbar-brand d-flex align-items-center" href="index.php">
        <img src="assets/images/coffee.png" alt="Kape't Ani Logo" height="40" class="me-2">
        <span class="fw-semibold">Kape't Ani</span>
      </a>

      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav gap-3">
          <li class="nav-item"><a class="nav-link active" href="index.php">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="product_user.php">Products</a></li>
          <li class="nav-item"><a class="nav-link" href="review.php">Reviews</a></li>
          <li class="nav-item"><a class="nav-link" href="about.php">About</a></li>
        </ul>
      </div>

      <div class="nav-actions">
        <a href="user.php"><i class="fa-solid fa-user"></i></a>
        <a href="product_user.php" class="position-relative">
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

  <!-- Hero Section -->
  <section class="hero-section hero" id="home">
    <div class="container h-100 d-flex align-items-center justify-content-between">
      <!-- LEFT: Hero Content -->
      <div class="hero-content">
        <h1>Savor Filipino coffee. Celebrate Filipino heritage.</h1>
        <p>Bringing the richness of Filipino coffee and heritage crafts to every home, while empowering local farmers and artisans.</p>
        <a href="product.html" class="btn btn-custom" style="color: black;">ORDER NOW</a>
      </div>

      <!-- Scroll Prompt -->
      <div class="scroll-prompt position-absolute bottom-3 start-50 translate-middle-x text-center" style="z-index: 3;">
        <span>Scroll to explore</span><br>
        <i class="bi bi-chevron-double-down"></i>
      </div>
  </section>

  <!-- Search Modal -->
  <div class="modal fade" id="searchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <input type="text" class="form-control" placeholder="Search coffee...">
      </div>
    </div>
  </div>


  <!-- Discover Section -->
  <section class="discover_section py-5">
    <div class="container">
      <div class="row align-items-center">
        <!-- TEXT LEFT -->
        <div class="col-lg-6">
          <h1 class="mb-4">Discover the best coffee and cultural products</h1>
          <p>Kape’t Ani was founded to promote and sell curated kits that combine Filipino coffee with cultural harvest products such as handmade baskets and native mugs.</p>
          <a href="about.html" class="btn btn-custom" style="color: black;">Learn More</a>
        </div>

        <!-- IMAGE RIGHT -->
        <div class="col-lg-6 text-center">
          <div class="position-relative">
            <img src="assets/images/stylized-cup-coffee-out-coffee-beans-flat-lay_1__2_-removebg-preview.png" class="img-fluid" alt="">
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Products Carousel Section -->
  <section class="product_section py-5">
    <div class="container">
      <h2 class="text-center mb-4 fw-bold">Our Filipino Coffee and Traditional Crafts</h2>
      <p class="text-center mb-4">Rooted in Tradition, Inspired by Passion</p>
      <div id="coffeeCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active">
            <div class="d-flex justify-content-center gap-4">
              <img src="assets/images/coffee1.png" class="d-block rounded" alt="Product 1" style="width:280px;">
              <img src="assets/images/basket1.png" class="d-block rounded" alt="Product 2" style="width:280px;">
              <img src="assets/images/coffee2.png" class="d-block rounded" alt="Product 3" style="width:280px;">
            </div>
          </div>
          <div class="carousel-item">
            <div class="d-flex justify-content-center gap-4">
              <img src="assets/images/basket2.png" class="d-block rounded" alt="Product 4" style="width:280px;">
              <img src="assets/images/coffee3.png" class="d-block rounded" alt="Product 5" style="width:280px;">
              <img src="assets/images/basket3.png" class="d-block rounded" alt="Product 6" style="width:280px;">
            </div>
          </div>
        </div>

        <!-- Controls -->
        <button class="carousel-control-prev" type="button" data-bs-target="#coffeeCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" style="filter: invert(1);"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#coffeeCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" style="filter: invert(1);"></span>
        </button>
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
            <li class="pt-2"><a href="#" class="text-light text-decoration-none">Menu</a></li>
            <li class="pt-2"><a href="room.html" class="text-decoration-none">Features</a></li>
            <li class="pt-2"><a href="room.html" class="text-decoration-none">Blogs</a></li>
            <li class="pt-2"><a href="room.html" class="text-decoration-none">Help & Supports</a></li>
          </ul>
        </div>

        <div class="col-md-3 mb-4">
          <h5 class="fw-bold mb-3">Company</h5>
          <ul class="list-unstyled">
            <li class="pt-2"><a href="#" class="link text-light text-decoration-none">Terms of Service</a></li>
            <li class="pt-2"><a href="room.html" class="text-decoration-none">How we work</a></li>
            <li class="pt-2"><a href="room.html" class="text-decoration-none">Pricing</a></li>
            <li class="pt-2"><a href="room.html" class="text-decoration-none">FAQS</a></li>
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

  <!-- Bootstrap JS --><!-- Promo Logic (simplified, no backend) -->
  <!-- Promo Logic (simplified, with redirect) -->
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const voucherBtn = document.getElementById("voucherBtn");
      const promoMessage = document.getElementById("promoMessage");

      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();

      const isTuesday = day === 2;
      const isPromoTime = hour >= 20 && hour < 24;

      if (isTuesday && isPromoTime) {
        // Show voucher during promo hour
        promoMessage.textContent = "Use ChoosDay Voucher!";
        voucherBtn.style.display = "inline-block";
        voucherBtn.textContent = "Use Voucher";

        voucherBtn.addEventListener("click", () => {
          // Redirect user to product_user.php with voucher info (optional query)
          window.location.href = "product_user.php?voucher=CHOOSDAY10";
        });
      } else {
        // Default message when not in promo period
        promoMessage.textContent =
          "Tune in for the next ChoosDay Promo (Tuesdays 8–9 PM)!";
        voucherBtn.style.display = "none";
      }
    });
  </script>


</body>

</html>