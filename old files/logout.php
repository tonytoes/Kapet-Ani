<?php
session_start();
session_unset();
session_destroy();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Logging out...</title>
  <script>
    // Clear cart from localStorage before redirecting
    localStorage.removeItem('cart');
    // Redirect after a short delay to ensure cart is cleared
    setTimeout(() => {
      window.location.href = 'login.php';
    }, 100);
  </script>
</head>
<body>
  <p>Logging out...</p>
</body>
</html>
