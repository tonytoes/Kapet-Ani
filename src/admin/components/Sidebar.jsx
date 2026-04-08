const NAV_ITEMS = [
  { page: "dashboard",       icon: "bi-grid-1x2-fill", label: "Dashboard" },
  { page: "inventory",       icon: "bi-box-seam",       label: "Inventory" },
  { page: "inventoryalert", icon: "bi-box-seam",       label: "Inventory Alert" },
  { page: "users",           icon: "bi-people",         label: "Users" },
  { page: "transactions",   icon: "bi-receipt",        label: "Transactions" },
];

export default function Sidebar({ activePage, onNavigate, collapsed }) {
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
        <div className="profile-avatar">C</div>
        <div>
          <div className="profile-name">Coffee_Master67</div>
          <div className="profile-role">Administrator</div>
        </div>
      </div>
    </nav>
  );
}
