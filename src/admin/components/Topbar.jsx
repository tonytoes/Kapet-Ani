import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LINK_PATH } from "../data/LinkPath.jsx";

const ADMIN_PAGES = [
  { value: "dashboard", label: "Dashboard" },
  { value: "inventory", label: "Inventory" },
  { value: "inventoryalert", label: "Inventory Alert" },
  { value: "users", label: "Users" },
  { value: "transactions", label: "Transactions" },
  { value: "websitecontent", label: "Website Content" },
];

export default function Topbar({ title, onToggle, currentPage, onNavigate }) {
  const [userData,     setUserData]     = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [imageUrl,     setImageUrl]     = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("account");
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");
  const [settingsErr, setSettingsErr] = useState("");
  const [accountForm, setAccountForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [prefsForm, setPrefsForm] = useState({
    defaultPage: localStorage.getItem("admin.defaultPage") || "dashboard",
  });
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();

  const fullName = userData ? `${userData.first_name} ${userData.last_name}` : "Administrator";
  const initial  = fullName.charAt(0).toUpperCase();

  const fetchMe = useCallback(() => {
    const raw  = localStorage.getItem("user");
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

  useEffect(() => {
    if (!userData) return;
    setAccountForm({
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      email: userData.email || "",
    });
  }, [userData]);

  // Close dropdown on outside click
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

  function handleBackToHomepage() {
    navigate("/");
  }

  function openSettings() {
    setDropdownOpen(false);
    setSettingsOpen(true);
    setSettingsTab("account");
    setSettingsMsg("");
    setSettingsErr("");
  }

  async function handleSaveAccount() {
    if (!userData?.id) return;
    setSavingAccount(true);
    setSettingsMsg("");
    setSettingsErr("");
    try {
      const token = localStorage.getItem("token");
      const role = String(userData.role || userData.status || "user").toLowerCase();
      const res = await fetch(`${LINK_PATH}usersController.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: userData.id,
          first_name: accountForm.first_name.trim(),
          last_name: accountForm.last_name.trim(),
          email: accountForm.email.trim(),
          status: role,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to update account");
      const updated = {
        ...userData,
        first_name: accountForm.first_name.trim(),
        last_name: accountForm.last_name.trim(),
        email: accountForm.email.trim(),
      };
      localStorage.setItem("user", JSON.stringify(updated));
      setUserData(updated);
      window.dispatchEvent(new Event("userUpdated"));
      setSettingsMsg("Account details updated.");
    } catch (err) {
      setSettingsErr(err.message || "Unable to update account.");
    } finally {
      setSavingAccount(false);
    }
  }

  async function handleSavePassword() {
    if (!userData?.id) return;
    setSavingPassword(true);
    setSettingsMsg("");
    setSettingsErr("");
    try {
      if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
        throw new Error("Please complete all password fields.");
      }
      if (passwordForm.new_password.length < 8) {
        throw new Error("New password must be at least 8 characters.");
      }
      if (passwordForm.new_password !== passwordForm.confirm_password) {
        throw new Error("New password and confirm password do not match.");
      }
      const token = localStorage.getItem("token");
      const role = String(userData.role || userData.status || "user").toLowerCase();
      const res = await fetch(`${LINK_PATH}usersController.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: userData.id,
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          status: role,
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to change password");
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      setSettingsMsg("Password updated successfully.");
    } catch (err) {
      setSettingsErr(err.message || "Unable to change password.");
    } finally {
      setSavingPassword(false);
    }
  }

  function handleSavePreferences() {
    setSavingPrefs(true);
    setSettingsMsg("");
    setSettingsErr("");
    try {
      localStorage.setItem("admin.defaultPage", prefsForm.defaultPage);
      setSettingsMsg("Preferences saved.");
      if (typeof onNavigate === "function" && prefsForm.defaultPage && prefsForm.defaultPage !== currentPage) {
        onNavigate(prefsForm.defaultPage);
      }
    } catch {
      setSettingsErr("Unable to save preferences.");
    } finally {
      setSavingPrefs(false);
    }
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
                  {userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : ""}
                </div>
              </div>

              <button
                onClick={openSettings}
                onMouseEnter={e => e.currentTarget.style.background = "#F5F7FA"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
                style={{
                  width: "100%", padding: "10px 16px",
                  border: "none", outline: "none", background: "none",
                  display: "flex", alignItems: "center", gap: 9,
                  cursor: "pointer", fontSize: "0.83rem", fontWeight: 600,
                  color: "var(--text-primary)", fontFamily: "var(--font-body)", transition: "background 0.14s",
                }}
              >
                <i className="bi bi-gear"></i>
                Settings
              </button>

              <button
                onClick={handleBackToHomepage}
                onMouseEnter={e => e.currentTarget.style.background = "#F5F7FA"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
                style={{
                  width: "100%", padding: "10px 16px",
                  border: "none", outline: "none", background: "none",
                  display: "flex", alignItems: "center", gap: 9,
                  cursor: "pointer", fontSize: "0.83rem", fontWeight: 600,
                  color: "var(--text-primary)", fontFamily: "var(--font-body)", transition: "background 0.14s",
                }}
              >
                <i className="bi bi-house-door"></i>
                Back to Homepage
              </button>

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

      {settingsOpen && (
        <div className="kp-settings-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="kp-settings-modal" onClick={e => e.stopPropagation()}>
            <div className="kp-settings-head">
              <div>
                <div className="kp-settings-title">Admin Settings</div>
                <div className="kp-settings-subtitle">Manage account and dashboard preferences.</div>
              </div>
              <button className="kp-settings-close" onClick={() => setSettingsOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="kp-settings-tabs">
              <button
                className={`kp-settings-tab ${settingsTab === "account" ? "active" : ""}`}
                onClick={() => {
                  setSettingsTab("account");
                  setSettingsMsg("");
                  setSettingsErr("");
                }}
              >
                Account
              </button>
              <button
                className={`kp-settings-tab ${settingsTab === "password" ? "active" : ""}`}
                onClick={() => {
                  setSettingsTab("password");
                  setSettingsMsg("");
                  setSettingsErr("");
                }}
              >
                Password
              </button>
              <button
                className={`kp-settings-tab ${settingsTab === "preferences" ? "active" : ""}`}
                onClick={() => {
                  setSettingsTab("preferences");
                  setSettingsMsg("");
                  setSettingsErr("");
                }}
              >
                Preferences
              </button>
            </div>

            <div className="kp-settings-body">
              {settingsErr ? <div className="kp-settings-alert error">{settingsErr}</div> : null}
              {settingsMsg ? <div className="kp-settings-alert success">{settingsMsg}</div> : null}

              {settingsTab === "account" && (
                <div className="kp-settings-form">
                  <label className="form-label">First name</label>
                  <input
                    className="form-control"
                    value={accountForm.first_name}
                    onChange={e => setAccountForm(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="First name"
                  />
                  <label className="form-label">Last name</label>
                  <input
                    className="form-control"
                    value={accountForm.last_name}
                    onChange={e => setAccountForm(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Last name"
                  />
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    value={accountForm.email}
                    onChange={e => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                    type="email"
                  />
                  <button className="btn btn-primary" onClick={handleSaveAccount} disabled={savingAccount}>
                    {savingAccount ? "Saving..." : "Save account"}
                  </button>
                </div>
              )}

              {settingsTab === "password" && (
                <div className="kp-settings-form">
                  <label className="form-label">Current password</label>
                  <input
                    className="form-control"
                    value={passwordForm.current_password}
                    onChange={e => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                    placeholder="Current password"
                    type="password"
                  />
                  <label className="form-label">New password</label>
                  <input
                    className="form-control"
                    value={passwordForm.new_password}
                    onChange={e => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                    placeholder="New password"
                    type="password"
                  />
                  <label className="form-label">Confirm new password</label>
                  <input
                    className="form-control"
                    value={passwordForm.confirm_password}
                    onChange={e => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                    placeholder="Confirm new password"
                    type="password"
                  />
                  <button className="btn btn-primary" onClick={handleSavePassword} disabled={savingPassword}>
                    {savingPassword ? "Updating..." : "Change password"}
                  </button>
                </div>
              )}

              {settingsTab === "preferences" && (
                <div className="kp-settings-form">
                  <label className="form-label">Default admin landing page</label>
                  <select
                    className="form-control"
                    value={prefsForm.defaultPage}
                    onChange={e => setPrefsForm(prev => ({ ...prev, defaultPage: e.target.value }))}
                  >
                    {ADMIN_PAGES.map(p => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <div className="kp-settings-note">
                    This page opens first when you enter the admin dashboard.
                  </div>
                  <button className="btn btn-primary" onClick={handleSavePreferences} disabled={savingPrefs}>
                    {savingPrefs ? "Saving..." : "Save preferences"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}