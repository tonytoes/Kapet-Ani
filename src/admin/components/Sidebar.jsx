const NAV_ITEMS = [
  { page: "dashboard",      icon: "bi-grid-1x2-fill", label: "Dashboard" },
  { page: "inventory",      icon: "bi-box-seam",       label: "Inventory" },
  { page: "inventoryalert", icon: "bi-box-seam",       label: "Inventory Alert" },
  { page: "users",          icon: "bi-people",         label: "Users" },
  { page: "transactions",   icon: "bi-receipt",        label: "Transactions" },
];

export default function Sidebar({ activePage, onNavigate, collapsed }) {
  const raw  = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const fullName = user
    ? `${user.first_name} ${user.last_name}`
    : "Administrator";

  const initial = fullName.charAt(0).toUpperCase();

  const role = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Administrator";

  return (
    <nav className={`kp-sidebar${collapsed ? " collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-img"><img src="/logo.png" alt="logo" /></div>
        <h4>Kapet Pamana</h4>
      </div>

      <ul className="kp-sidebar-nav">
        {NAV_ITEMS.map(item => (
          <li key={item.page}>
            <a
              className={activePage === item.page ? "active" : ""}
              href="#"
              onClick={e => { e.preventDefault(); onNavigate(item.page); }}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="sidebar-profile">
        <div className="profile-avatar">{initial}</div>
        <div>
          <div className="profile-name">{fullName}</div>
          <div className="profile-role">{role}</div>
        </div>
      </div>
    </nav>
  );
}
