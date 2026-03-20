function renderProducts(id, products) {
  const container = document.getElementById(id);
  if (!container) return;

  container.innerHTML = products
    .map(
      ([pid, name, desc, ogPrice, price,discount, qty, img, type, imgName, category]) => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div class="product-card">
            <img src="data:${type};base64,${img}" alt="${name}" class="product-img">
            <div class="product-info">
              <h5 class="product-title">${name}</h5>
              <p class="product-desc">${desc}</p>
              <span class="product-price">₱${price}</span> 
              ${
                
                discount != 0 
                  ? `<p><span class="product-discount">Discount: ${discount}%</span></p>`
                  : '' 
              }
               
              <p class="product-qty">Stock: <strong>${qty}</strong></p>
              <div class="product-actions">
                <button id="${pid}" name="${category}" 
                        data-name="${name}" data-desc="${desc}" 
                        data-price="${ogPrice}" data-discount="${discount}" 
                        data-qty="${qty}" data-type="${type}" 
                        data-img="${img}" data-imgName="${imgName}"
                data-bs-toggle="modal" data-bs-target="#editModal" class="edit-btn">
                  <i class="bi bi-pencil-square me-1"></i>Edit
                </button>
                <button id="${pid}" name="${category}" data-bs-toggle="modal" data-bs-target="#deleteModal" class="delete-btn">
                  <i class="bi bi-trash me-1"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts("coffee-products", coffeeProducts);
  renderProducts("kit-products", kitProducts);
  renderProducts("autumn-products", autumnProducts, "#b66d2f");
});

document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cart-count");
  const navbar = document.querySelector(".navbar");
  let cartItems = 0;

  document.body.addEventListener("click", (e) => {
    if (e.target && e.target.id === "addToCartBtn") {
      cartItems++;
      if (cartCount) cartCount.textContent = cartItems;
    }
  });

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("shrink", window.scrollY > 50);
  });
});



//Add Modal
const addModal = document.getElementById('addModal');
addModal.addEventListener('show.bs.modal', function (event) {

  const addButton = event.relatedTarget; 
  const submit = document.getElementById("insert");

  const updatedButton = "insert" + addButton.id;	
  submit.name = updatedButton;

});

//Edit Modal 
const editModal = document.getElementById('editModal');
editModal.addEventListener('show.bs.modal', function (event){ 

  const editButton = event.relatedTarget; 
  const submit = document.getElementById("update");
  submit.name = "update" + editButton.name;
  
  document.getElementById('e_product_id').value = editButton.id; 
  document.getElementById('e_product_name').value = editButton.getAttribute('data-name');
  document.getElementById('e_product_description').value = editButton.getAttribute('data-desc');
  document.getElementById('e_product_price').value = editButton.getAttribute('data-price');
  document.getElementById('e_product_discount').value = editButton.getAttribute('data-discount');
  document.getElementById('e_product_qty').value = editButton.getAttribute('data-qty');
  document.getElementById('oldImgType').value = editButton.getAttribute('data-type');
  document.getElementById('oldImgName').value = editButton.getAttribute('data-imgName');
  document.getElementById('oldImgData').value = editButton.getAttribute('data-img');

  
  
});

//Delete Modal
const deleteModal= document.getElementById('deleteModal');
deleteModal.addEventListener('show.bs.modal', function (event){ 

  const deleteButton = event.relatedTarget; 
  const submit = document.getElementById("delete");
  submit.name = "delete" + deleteButton.name;

  document.getElementById('d_product_id').value = deleteButton.id; 
  
});


