/* Local storage of the item cart */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Render product cards */
function renderProducts(id, products, color = "#442808") {
  document.getElementById(id).innerHTML = products
    .map(([pid, name, desc, price, discount, img, type, stock = 0]) => {
      const outOfStock = stock <= 0;
      return `
        <div class="col-md-3 col-sm-6">
          <div class="card">
            <img src="data:${type};base64,${img}" class="card-img-top" alt="${name}">
            <div class="card-body text-center">
              <h6 class="fw-bold">${name}</h6>
              <p class="small text-muted mb-1">${desc}</p>
              <p class="fw-semibold mb-2" style="color:${color};">${price}</p>
              
              ${
                outOfStock
                  ? `<span class="text-danger">Out of Stock</span>`
                  : `${
                        discount != 0 
                          ? `<p><span class="product-discount">Discount: ${discount}%</span></p>`
                          : '' 
                      }<button class="btn btn-sm w-100 text-light add-to-cart-btn"
                      data-id="${pid}" data-name="${name}"
                      data-price="${price}" data-img="data:${type};base64,${img}"
                      data-stock="${stock}">
                      Add to Cart
                    </button>`
                    
              }
           
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/* Render all product categories */
renderProducts("coffee-products", coffeeProducts);
renderProducts("kit-products", kitProducts);
renderProducts("autumn-products", autumnProducts, "#b66d2f");

/* Add to cart button listener */
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("add-to-cart-btn")) return;

  const product = {
    id: e.target.dataset.id,
    name: e.target.dataset.name,
    price: e.target.dataset.price,
    img: e.target.dataset.img,
    qty: 1, // ✅ starts at 1 (previously bugged as 5)
    stock: parseInt(e.target.dataset.stock),
  };

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    if (existing.qty < existing.stock) {
      existing.qty++;
    } else {
      showToast("You can't add more than the available stock!");
      return;
    }
  } else {
    cart.push(product);
  }

  saveCart();

  // ✅ Show sidecart immediately when an item is added
  const offcanvasElement = document.getElementById("cartOffcanvas");
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
  bsOffcanvas.show();
});

/* Toast alert */
function showToast(message) {
  const toast = new bootstrap.Toast(document.getElementById("stockAlert"));
  const toastBody = document.querySelector("#stockAlert .toast-body");
  toastBody.textContent = message;
  toast.show();
}

/* Remove item from cart */
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
}

/* Quantity change logic */
function changeQuantity(id, qty) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    let newQty = Math.max(1, parseInt(qty) || 1);

    if (newQty > item.stock) {
      alert("You cannot exceed the available stock!");
      newQty = item.stock; // ✅ resets value to max stock
      const input = document.querySelector(
        `input[onchange="changeQuantity('${id}', this.value)"]`
      );
      if (input) input.value = item.stock;
    }

    item.qty = newQty;
  }
  saveCart();
}

/* Update cart sidebar */
function updateCartUI() {
  const cartList = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cart-count");

  cartList.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.qty * parseFloat(item.price.replace("₱", "").replace(",", ""));
    count += item.qty;

    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex align-items-center justify-content-between";
    li.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.img}" alt="${item.name}" width="50" height="50" class="me-2 rounded">
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.price}</small><br>
          <small>Stock: ${item.stock}</small> 
        </div>
      </div>
      <div class="d-flex align-items-center">
        <input type="number" min="1" value="${item.qty}"
          class="form-control form-control-sm me-2" style="width:70px"
          onchange="changeQuantity('${item.id}', this.value)">
        <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
    cartList.appendChild(li);
  });

  totalEl.textContent = "₱" + total.toFixed(2);
  if (countEl) countEl.textContent = count;
}

/* Save cart data */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

/* Initialize cart */
updateCartUI();

if (
  cart.length > 0 &&
  coffeeProducts.length + kitProducts.length + autumnProducts.length === 0
) {
  localStorage.removeItem("cart");
  cart = [];
  updateCartUI();
}
