<?php
$link = mysqli_connect("localhost", "root", "", "kapetani");

if (!$link) {
  die("Connection failed: " . mysqli_connect_error());
}

mysqli_select_db($link, "kapetani") or die(mysqli_error($link));

?>

<?php

session_start();
if (!isset($_SESSION['email'])) {
  header("Location: login.php");
  exit();
}

if (isset($_POST["insert"])) {
  // Escape special characters in user input
  $firstname = mysqli_real_escape_string($link, $_POST['firstname']);
  $lastname = mysqli_real_escape_string($link, $_POST['lastname']);
  $title = mysqli_real_escape_string($link, $_POST['title']);
  $description = mysqli_real_escape_string($link, $_POST['descriptionInPHP']);
  $rating = (int) $_POST['rating'];  // Ensure rating is an integer

  // Perform the query
  $query = "INSERT INTO reviewcard (`id`, `first_name`, `last_name`, `review_rating`, `review_title`, `description`) 
              VALUES (NULL, '$firstname', '$lastname', '$rating', '$title', '$description')";

  mysqli_query($link, $query) or die(mysqli_error($link));
?>
  <script type="text/javascript">
    window.location.href = window.location.href;
  </script>
<?php
}


?>


<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Review | Kape't Ani</title>
  <link rel="icon" href="assets/images/coffee.png" type="image/x-icon" />

  <!-- Bootstrap CSS -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet" />
  <!-- Bootstrap Icons -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
    rel="stylesheet" />
  <!-- Google Font -->
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
    rel="stylesheet" />
  <!-- Font Awesome -->
  <link
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    rel="stylesheet" />
  <!-- Custom CSS -->
  <link rel="stylesheet" href="review.css" />
</head>

<body>
  <!-- Navbar (copied from index.html) -->
  <nav class="navbar navbar-expand-lg fixed-top">
    <div class="container-fluid position-relative">
      <a class="navbar-brand d-flex align-items-center" href="index.php">
        <img src="assets/images/coffee.png" alt="Logo" height="40" class="me-2">
        <span class="fw-semibold">Kape't Ani | Review</span>
      </a>

      <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
        <ul class="navbar-nav gap-3">
          <li class="nav-item"><a class="nav-link" href="index.php">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="product_user.php">Products</a></li>
          <li class="nav-item "><a class="nav-link active" href="review.php">Reviews</a></li>
          <li class="nav-item"><a class="nav-link" href="about.php">About</a></li>
        </ul>
      </div>

      <div class="nav-actions">
        <a href="#" data-bs-toggle="modal" data-bs-target="#searchModal">
          <i class="bi bi-search"></i>
        </a>
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
  <section class="hero">
    <div class="hero-content">
      <h1>Product Reviews</h1>
      <p>
        We'd love to hear from you! Reach out for inquiries, orders, or
        collaborations.
      </p>

      <!-- Button trigger modal -->
      <button type="button" class="btn btn custom pb-2 pt-2" data-bs-toggle="modal" data-bs-target="#reviewModal">
        Send Review
      </button>
    </div>
  </section>

  <!-- Modal -->
  <div class="modal fade" id="reviewModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Thank you for the feedback</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <div class="modal-body">
          <div class="col-12 col-md-10 mx-auto ">
            <form action="" name="reviewForm" method="POST">
              <div id="starContainer">
                <i class=" fa-solid fa-star"> </i>
                <i class=" fa-solid fa-star"> </i>
                <i class=" fa-solid fa-star"> </i>
                <i class=" fa-solid fa-star"> </i>
                <i class=" fa-solid fa-star"> </i>
              </div>

              <!-- First name -->
              <div class="mb-3">
                <label for="firstname" class="form-label">First Name </label>
                <input type="text" class="form-control " id="firstname" name="firstname">
              </div>

              <!-- Last Name -->
              <div class="mb-3">
                <label for="lastname" class="form-label">Last Name </label>
                <input type="text" class="form-control" id="lastname" name="lastname">
              </div>

              <!-- Review Title -->
              <div class="mb-3">
                <label for="title" class="form-label">Review Title </label>
                <input type="text" class="form-control" id="title" name="title">
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label for="descriptionInPHP" class="form-label">Review </label>
                <textarea type="text" class="form-control" id="descriptionInPHP" name="descriptionInPHP"> </textarea>
              </div>

              <!-- Review Rating -->
              <div class="mb-3">
                <label for="rating" class="form-label"> </label>
                <input type="hidden" class="form-control" id="rating" name="rating">
              </div>


              <div class="modal-footer">
                <button type="submit" name="insert" class="btn btn submit">Submit</button>
                <button type="button" class="btn btn close" data-bs-dismiss="modal">Close</button>
              </div>

            </form>


          </div>
        </div> <!-- End of Modal Body -->
      </div>
    </div>
  </div>
  <?php
  // Values are from user input, INTO reviewcard are from table in php
  if (isset($_POST["insert"])) {

    mysqli_query($link, "INSERT INTO reviewcard (`id`, `first_name`, `last_name`, `review_rating`, `review_title`, `description`)
                                    VALUES(NULL, '$_POST[firstname]', '$_POST[lastname]', '$_POST[rating]', '$_POST[title]', '$_POST[descriptionInPHP]') ");
  ?>
    <script type="text/javascript">
      window.location.href = window.location.href;
    </script>

  <?php
  }
  ?>

  <!-- Search Modal -->
  <div class="modal fade" id="searchModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <input
          type="text"
          class="form-control"
          placeholder="Search coffee..." />
      </div>
    </div>
  </div>

  <!-- Cart Offcanvas -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="cartOffcanvas">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Your Cart</h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
      <p>No items in cart yet.</p>
      <button class="btn btn-custom w-100" id="addToCartBtn">
        Add Sample Item
      </button>
    </div>
  </div>

  <!-- Review Calculation -->
  <?php

  $freq1 = 0;
  $freq2 = 0;
  $freq3 = 0;
  $freq4 = 0;
  $freq5 = 0;

  $numberOfRating = 0;
  $sum = 0;
  $avgRatingTemp = 0;
  $avgRating = 0;
  $ratingCalculation = mysqli_query($link, "SELECT * FROM reviewcard");
  while ($arrayRow = mysqli_fetch_array($ratingCalculation)) {
    $numberOfRating++;
    $sum += $arrayRow["review_rating"];

    switch ($arrayRow["review_rating"]) {

      case 1:
        $freq1++;
        break;
      case 2:
        $freq2++;
        break;
      case 3:
        $freq3++;
        break;
      case 4:
        $freq4++;
        break;
      case 5:
        $freq5++;
        break;
    }
  }
  try {
    $star1 = ($freq1 / $numberOfRating) * 100;
    $star2 = ($freq2 / $numberOfRating) * 100;
    $star3 = ($freq3 / $numberOfRating) * 100;
    $star4 = ($freq4 / $numberOfRating) * 100;
    $star5 = ($freq5 / $numberOfRating) * 100;

    $avgRatingTemp = $sum / $numberOfRating;
    $avgRating = number_format((float)$avgRatingTemp, 2);
  } catch (DivisionByZeroError $e) {
    echo "";
  }

  ?>

  <!-- Reviews -->
  <section class="py-5 text-section">

    <div class="container">
      <div class="row g-4">

        <div class="col-md-12 text-center">
          <div class="shadow-lg p-3 mb-5 bg-body-tertiary rounded average-rating">
            <div class="row align-items-center">

              <!-- Average Rating on the LEFT -->
              <div class="col-md-4 text-md-start text-center" id="avg-container">
                <h3 class="mb-0">AVERAGE RATING</h3>
                <h2 id="avgRating"><?php echo $avgRating  ?> </h2>
              </div>

              <!-- Star Ratings + Progress Bars on the RIGHT -->
              <div class="col-md-8">
                <!-- 5 Star -->
                <div class="row align-items-center mb-2">
                  <div class="col-2 text-start">
                    <p class="mb-0">5 ★</p>
                  </div>
                  <div class="col-10">
                    <div class="progress" role="progressbar" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar" style="width: <?php echo $star5 ?>%"></div>
                    </div>
                  </div>
                </div>

                <!-- 4 Star -->
                <div class="row align-items-center mb-2">
                  <div class="col-2 text-start">
                    <p class="mb-0">4 ★</p>
                  </div>
                  <div class="col-10">
                    <div class="progress" role="progressbar" aria-valuenow="16" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar" style="width: <?php echo $star4 ?>%"></div>
                    </div>
                  </div>
                </div>
                <!-- 3 Star -->
                <div class="row align-items-center mb-2">
                  <div class="col-2 text-start">
                    <p class="mb-0">3 ★</p>
                  </div>
                  <div class="col-10">
                    <div class="progress" role="progressbar" aria-valuenow="16" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar" style="width: <?php echo $star3 ?>%"></div>
                    </div>
                  </div>
                </div>

                <!-- 2 Star -->
                <div class="row align-items-center mb-2">
                  <div class="col-2 text-start">
                    <p class="mb-0">2 ★</p>
                  </div>
                  <div class="col-10">
                    <div class="progress" role="progressbar" aria-valuenow="16" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar" style="width: <?php echo $star2 ?>%"></div>
                    </div>
                  </div>
                </div>

                <!-- 1 Star -->
                <div class="row align-items-center">
                  <div class="col-2 text-start">
                    <p class="mb-0">1 ★</p>
                  </div>
                  <div class="col-10">
                    <div class="progress" role="progressbar" aria-valuenow="16" aria-valuemin="0" aria-valuemax="100">
                      <div class="progress-bar" style="width: <?php echo $star1 ?>%"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Carousel -->
    <div class="container-lg text-center">


      <?php
      $res = mysqli_query($link, "SELECT * FROM reviewcard");
      $numberOfRows = 0;
      while ($row = mysqli_fetch_array($res)) {
        $numberOfRows++;
      }

      if ($numberOfRows < 7 && $numberOfRows > 0) {
        $numberOfSlides = 1;
      } else if ($numberOfRows > 6) {
        $numberOfSlides = intdiv($numberOfRows, 3);
      }
      $res2 = mysqli_query($link, "SELECT * FROM reviewcard ORDER BY review_rating DESC");

      // Generates number of slides
      $activeIndicator = 0;
      while ($row = mysqli_fetch_array($res2)) {
        echo '<div>';
        echo '<div class="d-flex justify-content-center">';
        echo '<div class="col-md-9 ">';
        // Customer here 
        echo '<div class="shadow-lg p-3 mb-5 bg-body-tertiary rounded text-center">';
        echo '<div class="row">';
        echo '<div class="col">';
        echo '<h5>';
        echo $row["first_name"];
        echo " " . $row["last_name"];
        echo '</h5>';
        echo '</div>';

        echo '<div class="col">';
        echo '<h5 class="h6" id="Rating1">Rating:';
        echo $row["review_rating"];
        echo '</h5>';
        echo '</div>';
        echo '<div class="col">';
        echo '<h6>Date:';
        echo " " . $row["date"];
        echo '</h6>';
        echo '</div>';
        echo '</div>';

        echo '<div class="row">';

        echo '<div class="col">';
        echo "<p class=\"fw-bold\">Review Title:";
        echo " " . $row["review_title"];
        echo "</p>";
        echo '</div>';
        echo '</div>';

        echo '<div class="row">';
        echo '<div class="col">';
        echo '<p>';
        echo $row["description"];
        echo '</p>';
        echo '</div>';
        echo '</div>';
        echo  '</div>';
        echo '</div>';
        echo '</div>';
        echo '</div>';

        $activeIndicator--;
      }
      ?>

      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span class="carousel-control-prev-icon " style="filter: invert(1);" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>

      <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span class="carousel-control-next-icon" style="filter: invert(1);" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>


    </div>
  </section>

  <!-- Footer -->
  <footer class="footer_section text-light pt-5 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-4 text-center">
          <img src="assets/images/kape't_ani_logo_white.png" alt="" style="width: 250px" />
          <div class="d-flex justify-content-center gap-3 my-3">
            <a href="#" class="text-light fs-5"><i class="fab fa-facebook"></i></a>
            <a href="#" class="text-light fs-5"><i class="fab fa-twitter"></i></a>
            <a href="#" class="text-light fs-5"><i class="fab fa-tiktok"></i></a>
            <a href="#" class="text-light fs-5"><i class="fab fa-instagram"></i></a>
          </div>
          <p class="small">&copy; 2025 All rights reserved</p>
        </div>

        <div class="col-md-3 mb-4">
          <h5 class="fw-bold mb-3">About</h5>
          <ul class="list-unstyled">
            <li class="pt-2"><a href="#" class="text-decoration-none">Menu</a></li>
            <li class="pt-2"><a href="room.html" class="text-decoration-none">Features</a></li>
            <li class="pt-2"><a href="room.html" class="text-decoration-none">Blogs</a></li>
            <li class="pt-2"><a href="room.html" class="text-decoration-none">Help & Supports</a></li>
          </ul>
        </div>

        <div class="col-md-3 mb-4">
          <h5 class="fw-bold mb-3">Company</h5>
          <ul class="list-unstyled">
            <li class="pt-2"><a href="#" class="text-decoration-none">Terms of Service</a></li>
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


  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Custom JS -->
  <script src="review.js" defer></script>
</body>

</html>