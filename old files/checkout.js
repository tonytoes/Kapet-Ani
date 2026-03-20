document.addEventListener("DOMContentLoaded", () => {
  const subtotalElement = document.getElementById("subtotal");
  const shippingElement = document.getElementById("shipping");
  const totalElement = document.getElementById("total");
  const totalAmountButton = document.getElementById("totalAmount");
  const orderItemsEl = document.getElementById("orderItems");

  const shippingFee = 50.00;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;
  let discount = 0;

  if (window.isPromoActive && window.isPromoActive()) {
    discount = 50; 
  }

  orderItemsEl.innerHTML = cart.map(item => {
    const priceNumber = parseFloat(item.price.replace("₱", ""));
    const totalItem = priceNumber * item.qty;
    subtotal += totalItem;

    return `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center">
          <img src="${item.img}" alt="${item.name}" width="65" height="65" class="me-2 rounded">
          <div>
            <strong>${item.name}</strong><br>
            <small>₱${priceNumber.toFixed(2)} x ${item.qty}</small>
          </div>
        </div>
        <div>₱${totalItem.toFixed(2)}</div>
      </div>
    `;
  }).join('');

  const total = subtotal + shippingFee - discount;

  subtotalElement.textContent = `₱${subtotal.toFixed(2)} Php`;
  shippingElement.textContent = `₱${shippingFee.toFixed(2)} Php`;
  totalElement.textContent = `₱${total.toFixed(2)} Php`;
  totalAmountButton.textContent = `₱${total.toFixed(2)} Php`;

  // ======== PAYMENT FORM ========
  const paymentForm = document.getElementById("paymentForm");
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const cardName = document.getElementById("cardName").value.trim();
    const cardNumber = document.getElementById("cardNumber").value.trim();
    const validThrough = document.getElementById("validThrough").value.trim();
    const cvcCode = document.getElementById("cvcCode").value.trim();

    if (!cardName || !cardNumber || !validThrough || !cvcCode) {
      alert("Please fill in all payment details.");
      return;
    }

    alert("Payment successful! Thank you for your purchase.");
    paymentForm.reset();
    updateTotal();
  });

  // ======== RETURN BUTTON ========
  const returnBtn = document.querySelector(".btn-return");
  returnBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "product_user.php";
    }
  });

  function updateTotal() {
    let updatedSubtotal = 0;

    cart.forEach((item) => {
      const price = parseFloat(item.price.replace("₱", ""));
      updatedSubtotal += price * item.qty;
    });

    const updatedTotal = updatedSubtotal + shippingFee - discount;
    subtotalElement.textContent = `₱${updatedSubtotal.toFixed(2)} Php`;
    shippingElement.textContent = `₱${shippingFee.toFixed(2)} Php`;
    totalElement.textContent = `₱${updatedTotal.toFixed(2)} Php`;
    totalAmountButton.textContent = `₱${updatedTotal.toFixed(2)} Php`;
  }
});
