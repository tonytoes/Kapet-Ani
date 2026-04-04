/* ═══════════════════════════════════════════════════════
   KAPET PAMANA — INVENTORY
   Panel has two modes: "edit" (row click) and "add" (+ button).
   ═══════════════════════════════════════════════════════ */

/* ── DATA VARIABLES ──────────────────────────────────────
   Replace with real API fetch results.
   ──────────────────────────────────────────────────────── */
let inventoryItems = [
  { ruleName: "Stock of coffee latte", name: "Coffee Latte",    attribute: "Quantity", condition: "GT",  category: 5,  category: "CP_Mug", value: 5, status: "Available"  },
  { ruleName: "Stock of black coffee", name: "Black Coffee",    attribute: "Quantity", condition: "GTE",  category: 5,  category: "HM_Baskets", value: 5, status: "Available"},
  { ruleName: "Stock of green coffee", name: "Green Coffee",    attribute: "Quantity", condition: "LTE",  stock: 12, category: "CnS_Drinks", value: 12, status: "Available"}
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
  document.getElementById("pruleName").value     = "";
  document.getElementById("pName").value    = "";
  document.getElementById("pAttribute").value = "";
  document.getElementById("pCondition").value    = "";
  document.getElementById("pCategory").value = "";
  document.getElementById("pValue").value    = "";
  document.getElementById("pStatus").value   = "";

  // const imgWrap = document.getElementById("panelImgWrap");
  // imgWrap.innerHTML  = `<i class="bi bi-image"></i>`;
  // imgWrap.className  = "panel-img-placeholder";
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
    <tr data-id="${item.ruleName}">
      <td class="cell-id"    data-field="ruleName"       data-value="${item.ruleName}">${item.ruleName}</td>
      <td class="cell-bold"  data-field="name"      data-value="${item.name}">${item.name}</td>
      <td                    data-field="attribute" data-value="${item.attribute}">${item.attribute}</td>
      <td                    data-field="condition"  data-value="${item.condition}">${item.condition}</td>
      <td                    data-field="value"     data-value="${item.value}">${item.value}</td>
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

  document.getElementById("pruleName").value = rowData.ruleName     ||"";
  document.getElementById("pName").value    =  rowData.name     || "";
  document.getElementById("pAttribute").value =rowData.attribute     || "";
  document.getElementById("pCondition").value =rowData.condition     || "";
  document.getElementById("pCategory").value = rowData.category     ||"";
  document.getElementById("pValue").value    = rowData.value     ||"";
  document.getElementById("pStatus").value   = rowData.status     ||"";

  // const imgWrap = document.getElementById("panelImgWrap");
  // if (item.image) {
  //   imgWrap.innerHTML = `<img src="${item.image}" class="panel-img" alt="${item.name}">`;
  //   imgWrap.className = "";
  // } else {
  //   imgWrap.innerHTML = `<i class="bi bi-image"></i>`;
  //   imgWrap.className = "panel-img-placeholder";
  // }
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
    ruleName: document.getElementById("pruleName").value,
    name:     document.getElementById("pName").value,
    attribute:     document.getElementById("pAttribute").value,
    condition:    document.getElementById("pCondition").value,
    category: document.getElementById("pCategory").value,
    value:    document.getElementById("pValue").value,
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
    ruleName: document.getElementById("pruleName").value,
    name:     document.getElementById("pName").value,
    attribute:     document.getElementById("pAttribute").value,
    condition:    document.getElementById("pCondition").value,
    category: document.getElementById("pCategory").value,
    value:    document.getElementById("pValue").value,
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
