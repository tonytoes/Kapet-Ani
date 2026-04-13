// ─── BADGE CLASS LOOKUP ───────────────────────────────────
export function badgeClass(status) {
  const map = {
    Paid:        "badge-paid",
    confirmed:   "badge-confirmed",
    shipped:     "badge-shipped",
    pending:     "badge-pending",
    Available:   "badge-available",
    Unavailable: "badge-unavailable",
    cancelled: "badge-cancelled",
    Admin:       "badge-admin",
    Customer:    "badge-customer",
    "Low Stock":    "badge-lowstock",
    "Out of Stock": "badge-outofstock",
  };
  return map[status] || "badge-pending";
}

// ─── EMAIL MASKER ─────────────────────────────────────────
export function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return local.slice(0, 2) + "…" + local.slice(-1) + "@" + domain;
}

// ─── NEXT ID GENERATOR ────────────────────────────────────
export function nextId(items) {
  return `#${String(items.length + 1).padStart(4, "0")}`;
}
