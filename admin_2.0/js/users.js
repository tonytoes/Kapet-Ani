/* ═══════════════════════════════════════════════════════
   KAPET PAMANA — USERS
   Panel has two modes: "edit" (row click) and "add" (+ button).
   ═══════════════════════════════════════════════════════ */

/* ── DATA VARIABLES ──────────────────────────────────────
   Replace with real API fetch results.
   ──────────────────────────────────────────────────────── */
let usersData = [
  { id: "#0001", username: "Yumi Everrete",   email: "yumiyumidesu@gmail.com", password: "yumi123123",   totalSpent: "$10,030", status: "Customer", image: null },
  { id: "#0002", username: "Coffee_Master67", email: "s....l@gmail.com",        password: "ilovecofee67", totalSpent: "$0",      status: "Admin",    image: null },
];

/* ── HELPERS ─────────────────────────────────────────────── */
function badgeClass(status) {
  const map = {
    Admin: "badge-admin", Customer: "badge-customer",
    Available: "badge-available", Unavailable: "badge-unavailable",
  };
  return map[status] || "badge-pending";
}

function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return local.slice(0, 2) + "…" + local.slice(-1) + "@" + domain;
}

/* ── PANEL MODE SWITCHER ─────────────────────────────────── */
// mode: "edit" | "add"
function setPanelMode(mode) {
  const title      = document.getElementById("usersPanelTitle");
  const footerEdit = document.getElementById("usersPanelFooter-edit");
  const footerAdd  = document.getElementById("usersPanelFooter-add");

  if (mode === "add") {
    title.textContent        = "Add User";
    footerEdit.style.display = "none";
    footerAdd.style.display  = "flex";
  } else {
    title.textContent        = "Edit User";
    footerEdit.style.display = "flex";
    footerAdd.style.display  = "none";
  }
}

/* ── CLEAR FORM FIELDS ───────────────────────────────────── */
function clearUserForm() {
  document.getElementById("uUsername").value = "";
  document.getElementById("uEmail").value    = "";
  document.getElementById("uPassword").value = "";
  document.getElementById("uStatus").value   = "";

  const imgWrap = document.getElementById("userImgWrap");
  imgWrap.innerHTML = `<i class="bi bi-person"></i>`;
  imgWrap.className = "panel-img-placeholder";
}

/* ── RENDER TABLE ────────────────────────────────────────── */
function renderUsers(items) {
  const tbody = document.querySelector("#usersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = items.map(u => `
    <tr data-id="${u.id}">
      <td class="cell-id"     data-field="id"         data-value="${u.id}">${u.id}</td>
      <td class="cell-bold"   data-field="username"   data-value="${u.username}">${u.username}</td>
      <td class="cell-muted"  data-field="email"      data-value="${u.email}">${maskEmail(u.email)}</td>
      <td class="cell-muted"  data-field="password"   data-value="${u.password}">${u.password}</td>
      <td class="cell-amount" data-field="totalSpent" data-value="${u.totalSpent}">${u.totalSpent}</td>
      <td                     data-field="status"     data-value="${u.status}">
        <span class="badge ${badgeClass(u.status)}">${u.status}</span>
      </td>
    </tr>`).join("");

  panel.rebind();
}

/* ── FILL PANEL (edit mode) ──────────────────────────────── */
function fillPanel(rowData) {
  const user = usersData.find(u => u.id === rowData.id) || {};

  document.getElementById("uUsername").value = user.username || "";
  document.getElementById("uEmail").value    = user.email    || "";
  document.getElementById("uPassword").value = user.password || "";
  document.getElementById("uStatus").value   = user.status   || "";

  const imgWrap = document.getElementById("userImgWrap");
  if (user.image) {
    imgWrap.innerHTML = `<img src="${user.image}" class="panel-img" alt="${user.username}">`;
    imgWrap.className = "";
  } else {
    imgWrap.innerHTML = `<i class="bi bi-person"></i>`;
    imgWrap.className = "panel-img-placeholder";
  }
}

/* ── SLIDE PANEL INSTANCE ────────────────────────────────── */
const panel = new SlidePanel({
  panelId:    "usersPanel",
  tableId:    "usersTable",
  pageAreaId: "usersPageArea",
  onOpen: (rowData) => {
    setPanelMode("edit");
    fillPanel(rowData);
  },
});

/* ── EDIT FOOTER BUTTONS ─────────────────────────────────── */
document.getElementById("userUpdateBtn")?.addEventListener("click", () => {
  // TODO: PATCH /api/users/:id
  const updated = {
    username: document.getElementById("uUsername").value,
    email:    document.getElementById("uEmail").value,
    password: document.getElementById("uPassword").value,
    status:   document.getElementById("uStatus").value,
  };
  console.log("Update user:", updated);
  panel.close();
});

document.getElementById("userDeleteBtn")?.addEventListener("click", () => {
  // TODO: DELETE /api/users/:id
  console.log("Delete user");
  panel.close();
});

/* ── ADD FOOTER BUTTONS ──────────────────────────────────── */
document.getElementById("userAddCancelBtn")?.addEventListener("click", () => {
  panel.close();
});

document.getElementById("userAddConfirmBtn")?.addEventListener("click", () => {
  // TODO: POST /api/users
  const newUser = {
    username: document.getElementById("uUsername").value,
    email:    document.getElementById("uEmail").value,
    password: document.getElementById("uPassword").value,
    status:   document.getElementById("uStatus").value,
  };
  console.log("Add user:", newUser);
  panel.close();
});

/* ── ADD BUTTON (top left +) ─────────────────────────────── */
document.getElementById("addUserBtn")?.addEventListener("click", () => {
  clearUserForm();
  setPanelMode("add");
  document.getElementById("usersPanel").classList.add("open");
  document.getElementById("usersPageArea").classList.add("panel-open");
});

/* ── SEARCH ──────────────────────────────────────────────── */
document.getElementById("usersSearch")?.addEventListener("input", function () {
  const q = this.value.toLowerCase();
  const filtered = usersData.filter(u =>
    u.username.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.status.toLowerCase().includes(q)
  );
  renderUsers(filtered);
});

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  renderUsers(usersData);
});
