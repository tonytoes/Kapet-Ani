/* ═══════════════════════════════════════════════════════
   KAPET PAMANA — USERS
   ═══════════════════════════════════════════════════════ */

/* ── DATA VARIABLES ────────────────────────────────────
   Replace with real API fetch results.
   ──────────────────────────────────────────────────── */
let usersData = [
  { id: "#0001", username: "Yumi Everrete",  email: "yumiyumidesu@gmail.com",  password: "yumi123123", totalSpent: "$10,030", status: "Customer", image: null },
  { id: "#0002", username: "Coffee_Master67", email: "s....l@gmail.com",        password: "ilovecofee67", totalSpent: "$0",     status: "Admin",    image: null },
];

function badgeClass(status) {
  const map = {
    Admin: "badge-admin", Customer: "badge-customer",
    Available: "badge-available", Unavailable: "badge-unavailable",
  };
  return map[status] || "badge-pending";
}

/* ── MASK EMAIL ──────────────────────────────────────── */
function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return local.slice(0, 2) + "…" + local.slice(-1) + "@" + domain;
}

/* ── RENDER TABLE ─────────────────────────────────────── */
function renderUsers(items) {
  const tbody = document.querySelector("#usersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = items.map(u => `
    <tr data-id="${u.id}">
      <td class="cell-id"    data-field="id"          data-value="${u.id}">${u.id}</td>
      <td class="cell-bold"  data-field="username"    data-value="${u.username}">${u.username}</td>
      <td class="cell-muted" data-field="email"       data-value="${u.email}">${maskEmail(u.email)}</td>
      <td class="cell-muted" data-field="password"    data-value="${u.password}">${u.password}</td>
      <td class="cell-amount" data-field="totalSpent" data-value="${u.totalSpent}">${u.totalSpent}</td>
      <td                    data-field="status"      data-value="${u.status}">
        <span class="badge ${badgeClass(u.status)}">${u.status}</span>
      </td>
    </tr>`).join("");

  panel.rebind();
}

/* ── FILL PANEL ───────────────────────────────────────── */
function fillPanel(rowData) {
  const user = usersData.find(u => u.id === rowData.id) || {};

  document.getElementById("uUsername").value = user.username || "";
  document.getElementById("uEmail").value    = user.email    || "";
  document.getElementById("uPassword").value = user.password || "";
  document.getElementById("uStatus").value   = user.status   || "";

  const imgWrap = document.getElementById("userImgWrap");
  if (user.image) {
    imgWrap.outerHTML = `<img src="${user.image}" class="panel-img" id="userImgWrap" alt="${user.username}">`;
  } else {
    imgWrap.innerHTML = `<i class="bi bi-person"></i>`;
    imgWrap.className = "panel-img-placeholder";
  }
}

/* ── PANEL INIT ───────────────────────────────────────── */
const panel = new SlidePanel({
  panelId:    "usersPanel",
  tableId:    "usersTable",
  pageAreaId: "usersPageArea",
  onOpen:     (rowData) => fillPanel(rowData),
});

/* ── PANEL BUTTONS ────────────────────────────────────── */
// Cancel/close is the × button in panel header — handled by SlidePanel._bindCloseBtn()

document.getElementById("userUpdateBtn")?.addEventListener("click", () => {
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
  console.log("Delete user");
  panel.close();
});

/* ── ADD USER ─────────────────────────────────────────── */
document.getElementById("addUserBtn")?.addEventListener("click", () => {
  document.getElementById("uUsername").value = "";
  document.getElementById("uEmail").value    = "";
  document.getElementById("uPassword").value = "";
  document.getElementById("uStatus").value   = "";
  document.getElementById("usersPanel").classList.add("open");
  document.getElementById("usersPageArea").classList.add("panel-open");
});

/* ── SEARCH ───────────────────────────────────────────── */
document.getElementById("usersSearch")?.addEventListener("input", function () {
  const q = this.value.toLowerCase();
  const filtered = usersData.filter(u =>
    u.username.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.status.toLowerCase().includes(q)
  );
  renderUsers(filtered);
});

/* ── INIT ─────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  renderUsers(usersData);
});
