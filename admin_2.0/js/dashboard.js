/* ═══════════════════════════════════════════════════════
   KAPET PAMANA — DASHBOARD DATA & RENDER
   Replace the variable values with your backend responses.
   ═══════════════════════════════════════════════════════ */

/* ── DATA VARIABLES ────────────────────────────────────
   Swap these with real API/backend values.
   ──────────────────────────────────────────────────── */
const totalSales   = "$14,900.04";
const salesGrowth  = "↑ 2.1%";
const salesMonth   = "$1,000.04";
const salesToday   = "$1,900.04";
const totalUsers   = 304;
const newSignups   = 10;
const pageViews    = "20.1k";

const complaints = [
  { name: "Wrong Delivery", status: "Pending" },
  { name: "Late Shipment",  status: "Resolved" },
  { name: "Poor Quality",   status: "Resolved" },
];

const topSellingItems = [
  { name: "Black Coffee",    pct: 81 },
  { name: "Green Coffee",    pct: 76 },
  { name: "Monster Cafe",    pct: 73 },
  { name: "Adrenaline Shot", pct: 61 },
  { name: "Tobacoo",         pct: 39 },
  { name: "Banana Coffee",   pct: 19 },
];

const recentOrders = [
  { id: "#1672", buyer: "MasterChief",  date: "March 4, 12:30 AM", amount: "$14,999", status: "Paid" },
  { id: "#1671", buyer: "Jimboy",       date: "March 2, 1:33 PM",  amount: "$19",     status: "Paid" },
  { id: "#1670", buyer: "TonyMalungay", date: "March 1, 5:56 PM",  amount: "$67",     status: "Paid" },
];

const lowStockItems = [
  { no: "#900", name: "Black Coffee",  remaining: 5, status: "Available" },
  { no: "#404", name: "Coffee Drugs",  remaining: 0, status: "Unavailable" },
  { no: "#169", name: "Bisaya Coffee", remaining: 1, status: "Available" },
];

/* ── HELPERS ──────────────────────────────────────────── */
function badgeClass(status) {
  const map = {
    Paid: "badge-paid", Resolved: "badge-resolved",
    Available: "badge-available", Unavailable: "badge-unavailable",
    Pending: "badge-pending", Admin: "badge-admin", Customer: "badge-customer",
  };
  return map[status] || "badge-pending";
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ── RENDERERS ────────────────────────────────────────── */
function renderStats() {
  setEl("totalSales",  totalSales);
  setEl("salesGrowth", salesGrowth);
  setEl("salesMonth",  salesMonth);
  setEl("salesToday",  salesToday);
  setEl("totalUsers",  totalUsers);
  setEl("newSignups",  newSignups);
  setEl("pageViews",   pageViews);
}

function renderComplaints() {
  const icons = ["🚚", "⏱️", "⭐", "📦", "🔄"];
  setEl("complaintsCount", `${complaints.length} Issue${complaints.length !== 1 ? "s" : ""}`);
  const el = document.getElementById("complaintList");
  if (!el) return;
  el.innerHTML = complaints.map((c, i) => `
    <li class="complaint-item">
      <div class="complaint-thumb">${icons[i] || "📋"}</div>
      <div class="complaint-info">${c.name}</div>
      <span class="badge ${badgeClass(c.status)}">${c.status}</span>
    </li>`).join("");
}

function renderTopSelling() {
  const el = document.getElementById("topSellingList");
  if (!el) return;
  el.innerHTML = topSellingItems.map(item => `
    <div>
      <div class="sell-row-label">
        <span class="sell-name">${item.name}</span>
        <span class="sell-pct">${item.pct}%</span>
      </div>
      <div class="sell-track">
        <div class="sell-fill" style="width:${item.pct}%"></div>
      </div>
    </div>`).join("");
}

function renderRecentOrders() {
  const tbody = document.querySelector("#recentOrdersTable tbody");
  if (!tbody) return;
  tbody.innerHTML = recentOrders.map(o => `
    <tr>
      <td class="cell-id">${o.id}</td>
      <td class="cell-bold">${o.buyer}</td>
      <td class="cell-muted">${o.date}</td>
      <td class="cell-amount">${o.amount}</td>
      <td><span class="badge ${badgeClass(o.status)}">${o.status}</span></td>
    </tr>`).join("");
}

function renderLowStock() {
  const tbody = document.querySelector("#lowStockTable tbody");
  if (!tbody) return;
  tbody.innerHTML = lowStockItems.map(s => `
    <tr>
      <td class="cell-id">${s.no}</td>
      <td class="cell-bold">${s.name}</td>
      <td class="${s.remaining === 0 ? "stock-low" : "stock-ok"}">${s.remaining}</td>
      <td><span class="badge ${badgeClass(s.status)}">${s.status}</span></td>
    </tr>`).join("");
}

/* ── INIT ─────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  renderComplaints();
  renderTopSelling();
  renderRecentOrders();
  renderLowStock();
});
