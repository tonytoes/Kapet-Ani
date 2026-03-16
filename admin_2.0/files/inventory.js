/* ═══════════════════════════════════════════════════════
   KAPET PAMANA — INVENTORY
   Panel has two modes: "edit" (row click) and "add" (+ button).
   ═══════════════════════════════════════════════════════ */

/* ── DATA VARIABLES ──────────────────────────────────────
   Replace with real API fetch results.
   ──────────────────────────────────────────────────────── */
let inventoryItems = [
  { id: "#0001", name: "Coffee Latte",    price: 100, discount: 0,  stock: 5,  category: "Local Coffee", status: "Available",   description: "It is best to start your day with a cup of coffee. Discover the best flavours coffee you will ever have.", image: null },
  { id: "#0002", name: "Black Coffee",    price: 100, discount: 0,  stock: 5,  category: "Local Coffee", status: "Available",   description: "", image: null },
  { id: "#0003", name: "Green Coffee",    price: 80,  discount: 5,  stock: 12, category: "Local Coffee", status: "Available",   description: "", image: null },
  { id: "#0004", name: "Monster Cafe",    price: 120, discount: 0,  stock: 3,  category: "Specialty",    status: "Available",   description: "", image: null },
  { id: "#0005", name: "Bisaya Coffee",   price: 90,  discount: 0,  stock: 1,  category: "Local Coffee", status: "Available",   description: "", image: null },
  { id: "#0006", name: "Coffee Drugs",    price: 60,  discount: 0,  stock: 0,  category: "Specialty",    status: "Unavailable", description: "", image: null },
  { id: "#0007", name: "Banana Coffee",   price: 75,  discount: 10, stock: 8,  category: "Flavored",     status: "Available",   description: "", image: null },
  { id: "#0008", name: "Adrenaline Shot", price: 150, discount: 0,  stock: 4,  category: "Specialty",    status: "Available",   description: "", image: null },
];

/* ── HELPERS ─────────────────────────────────────────────── */
function badgeClass(status) {
  const map = {
    Available: "badge-available", Unavailable: "badge-unavailable",
    Paid: "badge-paid", Pending: "badge-pending", Resolved: "badge-resolved",
  };
  return map[status] || "badge-pending";
}

/* ── PANEL MODE SWITCHER ─────────────────────────────────── */
// mode: "edit" | "add"
function setPanelMode(mode) {
  const title      = document.getElementById("inventoryPanelTitle");
  const footerEdit = document.getElementById("inventoryPanelFooter-edit");
  const footerAdd  = document.getElementById("inventoryPanelFooter-add");

  if (mode === "add") {
    title.textContent       = "Add Product";
    footerEdit.style.display = "none";
    footerAdd.style.display  = "flex";
  } else {
    title.textContent       = "Edit Product";
    footerEdit.style.display = "flex";
    footerAdd.style.display  = "none";
  }
}

/* ── CLEAR FORM FIELDS ───────────────────────────────────── */
function clearProductForm() {
  document.getElementById("pName").value     = "";
  document.getElementById("pDesc").value     = "";
  document.getElementById("pPrice").value    = "";
  document.getElementById("pDiscount").value = "";
  document.getElementById("pCategory").value = "";
  document.getElementById("pStock").value    = "";
  document.getElementById("pStatus").value   = "";

  const imgWrap = document.getElementById("panelImgWrap");
  imgWrap.innerHTML  = `<i class="bi bi-image"></i>`;
  imgWrap.className  = "panel-img-placeholder";
}

/* ── OPEN PANEL ──────────────────────────────────────────── */
function openPanel(mode) {
  setPanelMode(mode);
  document.getElementById("inventoryPanel").classList.add("open");
  document.getElementById("inventoryPageArea").classList.add("panel-open");
}

/* ── CLOSE PANEL (also used by SlidePanel internally) ────── */
function closePanel() {
  document.getElementById("inventoryPanel").classList.remove("open");
  document.getElementById("inventoryPageArea").classList.remove("panel-open");
}

/* ── RENDER TABLE ────────────────────────────────────────── */
function renderInventory(items) {
  const tbody = document.querySelector("#inventoryTable tbody");
  if (!tbody) return;

  tbody.innerHTML = items.map(item => `
    <tr data-id="${item.id}">
      <td class="cell-id"    data-field="id"       data-value="${item.id}">${item.id}</td>
      <td class="cell-bold"  data-field="name"      data-value="${item.name}">${item.name}</td>
      <td                    data-field="price"     data-value="${item.price}">$${item.price}</td>
      <td                    data-field="discount"  data-value="${item.discount}">${item.discount}%</td>
      <td                    data-field="stock"     data-value="${item.stock}">${item.stock}</td>
      <td class="cell-muted" data-field="category"  data-value="${item.category}">${item.category}</td>
      <td                    data-field="status"    data-value="${item.status}">
        <span class="badge ${badgeClass(item.status)}">${item.status}</span>
      </td>
    </tr>`).join("");

  panel.rebind();
}

/* ── FILL PANEL (edit mode) ──────────────────────────────── */
function fillPanel(rowData) {
  const item = inventoryItems.find(i => i.id === rowData.id) || {};

  document.getElementById("pName").value     = rowData.name     || "";
  document.getElementById("pDesc").value     = item.description || "";
  document.getElementById("pPrice").value    = rowData.price    || "";
  document.getElementById("pDiscount").value = rowData.discount || "";
  document.getElementById("pCategory").value = rowData.category || "";
  document.getElementById("pStock").value    = rowData.stock    || "";
  document.getElementById("pStatus").value   = rowData.status   || "";

  const imgWrap = document.getElementById("panelImgWrap");
  if (item.image) {
    imgWrap.innerHTML = `<img src="${item.image}" class="panel-img" alt="${item.name}">`;
    imgWrap.className = "";
  } else {
    imgWrap.innerHTML = `<i class="bi bi-image"></i>`;
    imgWrap.className = "panel-img-placeholder";
  }
}

/* ── SLIDE PANEL INSTANCE ────────────────────────────────── */
const panel = new SlidePanel({
  panelId:    "inventoryPanel",
  tableId:    "inventoryTable",
  pageAreaId: "inventoryPageArea",
  onOpen: (rowData) => {
    setPanelMode("edit");
    fillPanel(rowData);
  },
  onClose: () => {},
});

// Override SlidePanel's internal close so it also removes panel-open from pageArea
// (SlidePanel.close() already does this via pageAreaId — no extra wiring needed)

/* ── EDIT FOOTER BUTTONS ─────────────────────────────────── */
document.getElementById("panelUpdateBtn")?.addEventListener("click", () => {
  // TODO: PATCH /api/products/:id
  const updated = {
    name:     document.getElementById("pName").value,
    desc:     document.getElementById("pDesc").value,
    price:    document.getElementById("pPrice").value,
    discount: document.getElementById("pDiscount").value,
    category: document.getElementById("pCategory").value,
    stock:    document.getElementById("pStock").value,
    status:   document.getElementById("pStatus").value,
  };
  console.log("Update product:", updated);
  panel.close();
});

document.getElementById("panelDeleteBtn")?.addEventListener("click", () => {
  // TODO: DELETE /api/products/:id
  console.log("Delete product");
  panel.close();
});

/* ── ADD FOOTER BUTTONS ──────────────────────────────────── */
document.getElementById("panelAddCancelBtn")?.addEventListener("click", () => {
  panel.close();
});

document.getElementById("panelAddConfirmBtn")?.addEventListener("click", () => {
  // TODO: POST /api/products with new product data
  const newProduct = {
    name:     document.getElementById("pName").value,
    desc:     document.getElementById("pDesc").value,
    price:    document.getElementById("pPrice").value,
    discount: document.getElementById("pDiscount").value,
    category: document.getElementById("pCategory").value,
    stock:    document.getElementById("pStock").value,
    status:   document.getElementById("pStatus").value,
  };
  console.log("Add product:", newProduct);
  panel.close();
});

/* ── × CLOSE BUTTON ──────────────────────────────────────── */
// Handled by SlidePanel._bindCloseBtn() via .panel-close-btn class

/* ── ADD BUTTON (top left +) ─────────────────────────────── */
document.getElementById("addProductBtn")?.addEventListener("click", () => {
  clearProductForm();
  openPanel("add");
});

/* ── SEARCH ──────────────────────────────────────────────── */
document.getElementById("inventorySearch")?.addEventListener("input", function () {
  const q = this.value.toLowerCase();
  const filtered = inventoryItems.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.category.toLowerCase().includes(q) ||
    i.id.toLowerCase().includes(q)
  );
  renderInventory(filtered);
});

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  renderInventory(inventoryItems);
});
