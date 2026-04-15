// ─── BADGE CLASS LOOKUP ───────────────────────────────────
export function badgeClass(status) {
  const map = {
    Paid:        "badge-paid",
    confirmed:   "badge-confirmed",
    shipped:     "badge-shipped",
    pending:     "badge-pending",
    Available:   "badge-available",
    Unavailable: "badge-unavailable",
    Warning:     "badge-unavailable",
    Normal:      "badge-available",
    Online:      "badge-available",
    Offline:     "badge-pending",
    cancelled: "badge-cancelled",
    User:        "badge-user",
    user:        "badge-user",
    Staff:       "badge-staff",
    staff:       "badge-staff",
    Admin:       "badge-admin",
    admin:       "badge-admin",
    Superadmin:  "badge-superadmin",
    superadmin:  "badge-superadmin",
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

export function getCurrentUserRole() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "user";
    const parsed = JSON.parse(raw) || {};
    const role = parsed?.role ?? parsed?.status;
    return typeof role === "string" ? role.toLowerCase() : "user";
  } catch {
    return "user";
  }
}

export function canManageAdminPanels() {
  return getCurrentUserRole() !== "staff";
}

export function canAssignElevatedRoles() {
  return getCurrentUserRole() === "superadmin";
}
