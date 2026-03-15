/* ═══════════════════════════════════════════════════════
   KAPET PAMANA — COMPLAINTS
   Table view → click row → detail view → back button returns
   ═══════════════════════════════════════════════════════ */

/* ── DATA VARIABLES ──────────────────────────────────────
   Replace with real API fetch results.
   Add a `message` field for the full complaint body.
   ──────────────────────────────────────────────────────── */
let complaintsData = [
  {
    id:       "#0001",
    username: "Yumi Everrete",
    email:    "yumiyumidesu@gmail.com",
    title:    "Wrong Delivery",
    date:     "March 4, 2026 12:30 AM",
    status:   "Pending",
    message:  "I ordered 50 strong bully maguire coffee but instead i received 1 flaccid coffee that is past its expiry date... please fix this, or just refund my money.",
    avatar:   null,
  },
  {
    id:       "#0002",
    username: "jayem",
    email:    "jmiura@gmail.com",
    title:    "Late Shipment",
    date:     "March 2, 2026 12:30 AM",
    status:   "Resolved",
    message:  "My order was supposed to arrive last week but it still hasn't shown up. Please check the status of my shipment.",
    avatar:   null,
  },
  {
    id:       "#0003",
    username: "jayem",
    email:    "jmiura@gmail.com",
    title:    "Late Shipment",
    date:     "March 2, 2026 12:30 AM",
    status:   "Resolved",
    message:  "Same issue as before. Shipment was delayed again with no notification.",
    avatar:   null,
  },
];

/* ── STATE ────────────────────────────────────────────── */
let activeComplaint = null;

/* ── DOM REFS ─────────────────────────────────────────── */
const tableView  = document.getElementById("tableView");
const detailView = document.getElementById("detailView");
const pageTitle  = document.getElementById("pageTitle");

/* ── HELPERS ──────────────────────────────────────────── */
function badgeClass(status) {
  const map = { Resolved: "badge-resolved", Pending: "badge-pending" };
  return map[status] || "badge-pending";
}

function getInitial(name) {
  return (name || "?")[0].toUpperCase();
}

/* ── RENDER TABLE ─────────────────────────────────────── */
function renderComplaints(items) {
  const tbody = document.querySelector("#complaintsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = items.map(c => `
    <tr data-id="${c.id}" style="cursor:pointer">
      <td class="cell-id">${c.id}</td>
      <td class="cell-bold">${c.username}</td>
      <td class="cell-muted">${c.email}</td>
      <td>${c.title}</td>
      <td class="cell-muted">${c.date}</td>
      <td><span class="badge ${badgeClass(c.status)}">${c.status}</span></td>
    </tr>`).join("");

  // Bind row clicks to open detail view
  tbody.querySelectorAll("tr").forEach(row => {
    row.addEventListener("click", () => {
      const complaint = complaintsData.find(c => c.id === row.dataset.id);
      if (complaint) openDetail(complaint);
    });
  });
}

/* ── OPEN DETAIL VIEW ─────────────────────────────────── */
function openDetail(complaint) {
  activeComplaint = complaint;

  // Populate fields
  const avatarEl = document.getElementById("detailAvatar");
  if (complaint.avatar) {
    avatarEl.innerHTML = `<img src="${complaint.avatar}" alt="${complaint.username}">`;
  } else {
    avatarEl.textContent = getInitial(complaint.username);
  }

  document.getElementById("detailUsername").textContent = complaint.username;
  document.getElementById("detailEmail").textContent    = `<${complaint.email}>`;
  document.getElementById("detailTitle").textContent    = complaint.title;
  document.getElementById("detailMessage").textContent  = complaint.message;

  const badge = document.getElementById("detailBadge");
  badge.textContent = complaint.status;
  badge.className   = `badge ${badgeClass(complaint.status)}`;

  // Update resolve button state
  const resolveBtn = document.getElementById("resolveBtn");
  if (complaint.status === "Resolved") {
    resolveBtn.textContent = "Resolved ✓";
    resolveBtn.classList.add("resolved");
  } else {
    resolveBtn.textContent = "Mark as Resolved";
    resolveBtn.classList.remove("resolved");
  }

  // Swap views
  tableView.style.display  = "none";
  detailView.classList.add("visible");
  if (pageTitle) pageTitle.textContent = "Complaint Detail";
}

/* ── CLOSE DETAIL VIEW (back to table) ───────────────── */
function closeDetail() {
  detailView.classList.remove("visible");
  tableView.style.display = "flex";
  if (pageTitle) pageTitle.textContent = "Complaints";
  activeComplaint = null;
}

/* ── BACK BUTTON ──────────────────────────────────────── */
document.getElementById("backBtn")?.addEventListener("click", closeDetail);

/* ── RESOLVE BUTTON ───────────────────────────────────── */
document.getElementById("resolveBtn")?.addEventListener("click", () => {
  if (!activeComplaint) return;

  // Toggle status
  if (activeComplaint.status !== "Resolved") {
    activeComplaint.status = "Resolved";

    // Update badge in detail view
    const badge = document.getElementById("detailBadge");
    badge.textContent = "Resolved";
    badge.className   = "badge badge-resolved";

    // Update resolve button
    const resolveBtn = document.getElementById("resolveBtn");
    resolveBtn.textContent = "Resolved ✓";
    resolveBtn.classList.add("resolved");

    // TODO: send PATCH to backend — mark complaint as resolved
    console.log("Resolved complaint:", activeComplaint.id);
  }
});

/* ── REPLY BUTTON ─────────────────────────────────────── */
document.getElementById("replyBtn")?.addEventListener("click", () => {
  // TODO: open a reply modal or redirect to reply form
  console.log("Reply to complaint:", activeComplaint?.id);
  alert(`Reply to: ${activeComplaint?.email}`);
});

/* ── SEARCH ───────────────────────────────────────────── */
document.getElementById("complaintsSearch")?.addEventListener("input", function () {
  const q = this.value.toLowerCase();
  const filtered = complaintsData.filter(c =>
    c.username.toLowerCase().includes(q) ||
    c.title.toLowerCase().includes(q) ||
    c.status.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q)
  );
  renderComplaints(filtered);
});

/* ── INIT ─────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  renderComplaints(complaintsData);
});
