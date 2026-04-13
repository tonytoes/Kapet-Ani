import { useState, useEffect, useCallback } from "react";
import { LINK_PATH } from "../data/LinkPath.jsx";

const NAV_ITEMS = [
  { page: "dashboard",      icon: "bi-grid-1x2-fill", label: "Dashboard" },
  { page: "inventory",      icon: "bi-box-seam",       label: "Inventory" },
  { page: "inventoryalert", icon: "bi-graph-down",       label: "Inventory Alert" },
  { page: "users",          icon: "bi-people",         label: "Users" },
  { page: "transactions",   icon: "bi-receipt",        label: "Transactions" },
];

export default function Sidebar({ activePage, onNavigate, collapsed }) {
  const [userData,  setUserData]  = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [imageUrl, setImageUrl] = useState(null);

  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : "Administrator";
  const initial  = fullName.charAt(0).toUpperCase();
  const role     = userData?.role
    ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1)
    : "Administrator";

  const fetchMe = useCallback(() => {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    if (!user?.id) return;

    const token = localStorage.getItem("token");
    fetch(`${LINK_PATH}usersController.php`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const me = data.users.find(u => u.id === user.id);
          if (me) {
            // Update localStorage name in case it changed
            const updated = { ...user, first_name: me.first_name, last_name: me.last_name };
            localStorage.setItem("user", JSON.stringify(updated));
            setUserData(updated);
            setImageUrl(me.image_url
              ? `${me.image_url}&t=${Date.now()}`
              : null
            );
          }
        }
      })
      .catch(() => {});
  }, []);

  // Fetch on mount
  useEffect(() => { fetchMe(); }, [fetchMe]);

  // Re-fetch whenever UsersPage fires "userUpdated"
  useEffect(() => {
    window.addEventListener("userUpdated", fetchMe);
    return () => window.removeEventListener("userUpdated", fetchMe);
  }, [fetchMe]);

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
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <div className="profile-avatar">{initial}</div>
        )}
        <div>
          <div className="profile-name">{fullName}</div>
          <div className="profile-role">{role}</div>
        </div>
      </div>
    </nav>
  );
}