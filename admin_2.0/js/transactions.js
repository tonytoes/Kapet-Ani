/* ═══════════════════════════════════════════════════════
   KAPET PAMANA — TRANSACTIONS
   ═══════════════════════════════════════════════════════ */

/* ── DATA VARIABLES ──────────────────────────────────── */
let transactionsData = [
  { id: "#0001", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
  { id: "#0001", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
  { id: "#0001", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
  { id: "#0001", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
  { id: "#0001", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
  { id: "#0001", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
  { id: "#0001", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
  { id: "#0001", username: "Yumi Everrete", product: "Black Coffee", orderAmount: "10 pieces", totalPrice: "$1,000", date: "March 4, 2026 12:30 AM" },
];

function renderTransactions(items) {
  const tbody = document.querySelector("#transactionsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = items.map(t => `
    <tr>
      <td class="cell-id">${t.id}</td>
      <td class="cell-bold">${t.username}</td>
      <td>${t.product}</td>
      <td class="cell-muted">${t.orderAmount}</td>
      <td class="cell-amount">${t.totalPrice}</td>
      <td class="cell-muted">${t.date}</td>
    </tr>`).join("");
}

document.getElementById("txSearch")?.addEventListener("input", function () {
  const q = this.value.toLowerCase();
  const filtered = transactionsData.filter(t =>
    t.username.toLowerCase().includes(q) ||
    t.product.toLowerCase().includes(q) ||
    t.id.toLowerCase().includes(q)
  );
  renderTransactions(filtered);
});

document.addEventListener("DOMContentLoaded", () => {
  renderTransactions(transactionsData);
});
