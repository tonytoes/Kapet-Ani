import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LINK_PATH } from "../data/LinkPath.jsx";

export default function Topbar({ title, onToggle }) {
  const raw  = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const fullName = user ? `${user.first_name} ${user.last_name}` : "Administrator";
  const initial  = fullName.charAt(0).toUpperCase();

  const [imageUrl,     setImageUrl]     = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();

  // Exact same fetch pattern as Sidebar.jsx
  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem("token");

    fetch(`${LINK_PATH}usersController.php`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const me = data.users.find(u => u.id === user.id);
          if (me?.image_url) setImageUrl(me.image_url);
        }
      })
      .catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="kp-topbar">
      <div className="topbar-left">
        <button className="toggle-btn" onClick={onToggle}>
          <i className="bi bi-list"></i>
        </button>
        <span className="page-title">{title}</span>
      </div>

      <div className="topbar-right">
        <div ref={dropdownRef} style={{ position: "relative", display: "flex", alignItems: "center", gap: 6 }}>

          {/* Arrow */}
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            style={{
              border: "none", outline: "none", boxShadow: "none",
              background: "none", padding: 0, cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem",
              transition: "transform 0.2s",
              transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <i className="bi bi-chevron-down"></i>
          </button>

          {/* Avatar */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              onClick={() => setDropdownOpen(prev => !prev)}
              style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", cursor: "pointer", flexShrink: 0 }}
            />
          ) : (
            <div className="topbar-avatar" onClick={() => setDropdownOpen(prev => !prev)}>
              {initial}
            </div>
          )}

          {/* Dropdown */}
          {dropdownOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 10px)", right: 0,
              background: "#fff", border: "1.5px solid var(--border-light)",
              borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              minWidth: 180, zIndex: 999, overflow: "hidden",
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {fullName}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                </div>
              </div>

              <button
                onClick={handleLogout}
                onMouseEnter={e => e.currentTarget.style.background = "#FEE2E2"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
                style={{
                  width: "100%", padding: "10px 16px",
                  border: "none", outline: "none", background: "none",
                  display: "flex", alignItems: "center", gap: 9,
                  cursor: "pointer", fontSize: "0.83rem", fontWeight: 600,
                  color: "#EF4444", fontFamily: "var(--font-body)", transition: "background 0.14s",
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}