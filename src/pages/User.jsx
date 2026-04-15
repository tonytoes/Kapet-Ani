import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/user.css';
import Navbar2 from "../components/layout/Navbar2.jsx";
import Newsletter from "../components/layout/Newsletter";
import Footer from "../components/layout/Footer.jsx";
import { LINK_PATH } from "../admin/data/LinkPath.jsx";

const API = `${LINK_PATH}usersController.php`;
const ORDERS_API = `${LINK_PATH}Transactionscontroller.php`;
const AVATAR_CACHE_PREFIX = "avatarCache:";

function EyeIcon({ open }) {
  return open ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 12C3.8 8.2 7.5 6 12 6C16.5 6 20.2 8.2 22 12C20.2 15.8 16.5 18 12 18C7.5 18 3.8 15.8 2 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.6 6.2C11.1 6.07 11.55 6 12 6C16.5 6 20.2 8.2 22 12C21.15 13.79 19.85 15.28 18.23 16.37"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.1 7.9C4.39 8.99 3.01 10.43 2 12C3.8 15.8 7.5 18 12 18C13.81 18 15.48 17.64 16.94 16.99"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 9.9C9.36 10.44 9 11.18 9 12C9 13.66 10.34 15 12 15C12.82 15 13.56 14.64 14.1 14.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStoredAvatarByUserId(userId) {
  try {
    if (!userId) return null;
    const raw = sessionStorage.getItem(`${AVATAR_CACHE_PREFIX}${userId}`) || localStorage.getItem(`${AVATAR_CACHE_PREFIX}${userId}`);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.dataUrl || null;
  } catch {
    return null;
  }
}

function User() {
  const [user, setUser] = useState(() => getStoredUser());
  const [form, setForm] = useState(() => {
    const u = getStoredUser();
    return { first_name: u?.first_name || "", last_name: u?.last_name || "", email: u?.email || "" };
  });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [imagePreview, setImagePreview] = useState(() => {
    const u = getStoredUser();
    return getStoredAvatarByUserId(u?.id) || u?.image_url || null;
  });
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [activeView, setActiveView] = useState("edit");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  function readAvatarCache(userId) {
    try {
      const raw = localStorage.getItem(`${AVATAR_CACHE_PREFIX}${userId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeAvatarCache(userId, imageName, dataUrl) {
    try {
      const payload = JSON.stringify({ imageName: imageName || "", dataUrl: dataUrl || "" });
      sessionStorage.setItem(`${AVATAR_CACHE_PREFIX}${userId}`, payload);
      localStorage.setItem(`${AVATAR_CACHE_PREFIX}${userId}`, payload);
    } catch {
      // ignore localStorage quota errors gracefully
    }
  }

  function buildAvatarDataUrl(firstName, lastName) {
    const initials = `${(firstName || "U").trim().charAt(0)}${(lastName || "").trim().charAt(0)}`.toUpperCase();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><rect width='100%' height='100%' fill='#EADBC8'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-family='DM Sans, Arial, sans-serif' font-size='62' font-weight='700' fill='#8B5A2B'>${initials || "U"}</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  useEffect(() => {
    const parsed = getStoredUser();
    if (!parsed) {
      navigate("/login"); // 👈 redirect guests away
    } else {
      setUser(parsed);
      setForm({
        first_name: parsed.first_name || "",
        last_name: parsed.last_name || "",
        email: parsed.email || "",
      });
      const cachedAvatar = getStoredAvatarByUserId(parsed.id);
      if (cachedAvatar) setImagePreview(cachedAvatar);
      fetchProfile(parsed);
    }
  }, [navigate]);

  async function fetchProfile(currentUser) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!data.success) return;
      const me = data.users.find(u => Number(u.id) === Number(currentUser.id));
      if (!me) return;
      if (!me.image_url) {
        setImagePreview(null);
        setImageLoading(false);
      } else {
        const cachedAvatar = readAvatarCache(currentUser.id);
        if (cachedAvatar?.dataUrl && cachedAvatar.imageName === (me.image_name || "")) {
          // Keep cached avatar immediately visible with zero loading delay.
          setImagePreview(cachedAvatar.dataUrl);
          setImageLoading(false);
        } else {
          // Show loader only for first uncached load.
          setImageLoading(true);
          // Show direct image URL (browser HTTP cache handles repeat loads).
          setImagePreview(me.image_url);
          writeAvatarCache(currentUser.id, me.image_name || "", me.image_url);
          localStorage.setItem("user", JSON.stringify({ ...currentUser, image_url: me.image_url }));
        }
      }
      const updated = {
        ...currentUser,
        first_name: me.first_name,
        last_name: me.last_name,
        email: me.email,
        created_at: me.created_at ?? currentUser.created_at,
      };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
      setForm({
        first_name: me.first_name || "",
        last_name: me.last_name || "",
        email: me.email || "",
      });
    } catch {
      // silent, page still works with local data
    }
  }

  async function fetchOrders(currentUser) {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(ORDERS_API, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!data.success) return;
      const myId = Number(currentUser?.id || 0);
      const mine = (data.transactions || []).filter((t) => {
        const txUserId = Number(t?.userId || 0);
        if (myId > 0 && txUserId > 0) return txUserId === myId;
        // Fallback for legacy rows without user_id linkage.
        return String(t?.email || "").toLowerCase() === String(currentUser?.email || "").toLowerCase();
      });
      setOrders(mine);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }

  function onChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }
  function onPasswordChange(key, value) {
    setPasswordForm(prev => ({ ...prev, [key]: value }));
  }

  function togglePasswordVisibility(key) {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
    setImageLoading(true);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setRemoveImage(true);
    setImagePreview(null);
    setImageLoading(false);
    if (user?.id) {
      try {
        localStorage.removeItem(`${AVATAR_CACHE_PREFIX}${user.id}`);
        sessionStorage.removeItem(`${AVATAR_CACHE_PREFIX}${user.id}`);
      } catch {}
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    setMessage("");
    setMessageType("success");
    try {
      if (passwordForm.next || passwordForm.confirm || passwordForm.current) {
        if (!passwordForm.current) throw new Error("Current password is required.");
        if (!passwordForm.next) throw new Error("New password is required.");
        if (passwordForm.next.length < 8) throw new Error("New password must be at least 8 characters.");
        if (passwordForm.next !== passwordForm.confirm) throw new Error("New password and confirm password do not match.");
      }

      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("id", String(user.id));
      fd.append("_method", "PUT");
      fd.append("first_name", form.first_name.trim());
      fd.append("last_name", form.last_name.trim());
      fd.append("email", form.email.trim());
      fd.append("status", (user.role || "user").toLowerCase());
      if (passwordForm.next) {
        fd.append("current_password", passwordForm.current);
        fd.append("new_password", passwordForm.next);
      }
      if (imageFile) fd.append("image", imageFile);
      if (removeImage) fd.append("remove_image", "1");

      const res = await fetch(API, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to save profile");

      const updatedUser = {
        ...user,
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage("Profile updated successfully.");
      setMessageType("success");
      setPasswordForm({ current: "", next: "", confirm: "" });
      window.dispatchEvent(new Event("userUpdated"));
      fetchProfile(updatedUser);
    } catch (err) {
      setMessage(err.message || "Failed to save profile");
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  }

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;
  const initials = `${(form.first_name || user.first_name || "U").trim().charAt(0)}${(form.last_name || user.last_name || "").trim().charAt(0)}`.toUpperCase() || "U";
  const rawDate = user.created_at || user.createdAt;
  const joinedDate = (() => {
    if (!rawDate) return "—";
    const d = new Date(rawDate);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });
  })();

  function openOrders() {
    setActiveView("orders");
    fetchOrders(user);
  }

  return (
    <>
      <Navbar2/>
      <main className="profile-container">
        <aside className="glass-card sidebar">
          <div className="profile-pic">
            {imagePreview ? (
              <>
                {imageLoading && (
                  <div className="avatar-loader-wrap">
                    <span className="avatar-loader" />
                  </div>
                )}
                <img
                  src={imagePreview}
                  alt="Profile"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImagePreview(null);
                    setImageLoading(false);
                  }}
                  style={{ display: imageLoading ? "none" : "block" }}
                />
              </>
            ) : (
              <div className="profile-initials-avatar">{initials}</div>
            )}
          </div>
          <div className="profile-photo-actions">
            <button type="button" className="save-btn photo-btn" onClick={() => fileRef.current?.click()}>
              Change Photo
            </button>
            <button type="button" className="save-btn photo-btn photo-btn-muted" onClick={handleRemoveImage}>
              Remove
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <h3>Welcome Back, {user.first_name}!</h3> {/* 👈 show name */}
          <ul className="side-links">
            <li className={activeView === "edit" ? "active" : ""} onClick={() => setActiveView("edit")}><i className="ri-edit-box-line" /> Edit Profile</li>
            <li className={activeView === "account" ? "active" : ""} onClick={() => setActiveView("account")}><i className="ri-user-line" /> My Account</li>
            <li className={activeView === "orders" ? "active" : ""} onClick={openOrders}><i className="ri-shopping-cart-line" /> Order History</li>
            <li onClick={handleLogout} style={{ cursor: "pointer" }}>
              <i className="ri-logout-box-r-line" /> Logout {/* 👈 works now */}
            </li>
          </ul>
        </aside>
        <section className="glass-card profile-form">
          {activeView === "edit" && (
            <>
              <h2>Edit Profile</h2>
              <p>Update your personal details and password.</p>
              <form id="profileForm" onSubmit={handleSave}>
                <div className="input-group">
                  <label>First Name</label>
                  <input type="text" value={form.first_name} onChange={e => onChange("first_name", e.target.value)} placeholder="First Name" />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input type="text" value={form.last_name} onChange={e => onChange("last_name", e.target.value)} placeholder="Last Name" />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => onChange("email", e.target.value)} placeholder="Email" />
                </div>
                <div className="password-block">
                  <h4>Change Password</h4>
                  <div className="input-group">
                    <label>Current</label>
                    <div className="profile-password-wrap">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        className="profile-password-input"
                        value={passwordForm.current}
                        onChange={e => onPasswordChange("current", e.target.value)}
                        placeholder="Current password"
                      />
                      <button
                        type="button"
                        className="profile-password-toggle"
                        onClick={() => togglePasswordVisibility("current")}
                        aria-label={showPasswords.current ? "Hide password" : "Show password"}
                        title={showPasswords.current ? "Hide password" : "Show password"}
                      >
                        <EyeIcon open={showPasswords.current} />
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>New</label>
                    <div className="profile-password-wrap">
                      <input
                        type={showPasswords.next ? "text" : "password"}
                        className="profile-password-input"
                        value={passwordForm.next}
                        onChange={e => onPasswordChange("next", e.target.value)}
                        placeholder="New password (min 8 chars)"
                      />
                      <button
                        type="button"
                        className="profile-password-toggle"
                        onClick={() => togglePasswordVisibility("next")}
                        aria-label={showPasswords.next ? "Hide password" : "Show password"}
                        title={showPasswords.next ? "Hide password" : "Show password"}
                      >
                        <EyeIcon open={showPasswords.next} />
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Confirm</label>
                    <div className="profile-password-wrap">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        className="profile-password-input"
                        value={passwordForm.confirm}
                        onChange={e => onPasswordChange("confirm", e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        className="profile-password-toggle"
                        onClick={() => togglePasswordVisibility("confirm")}
                        aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
                        title={showPasswords.confirm ? "Hide password" : "Show password"}
                      >
                        <EyeIcon open={showPasswords.confirm} />
                      </button>
                    </div>
                  </div>
                </div>
                {message && <p className={`profile-msg ${messageType === "error" ? "error" : "success"}`}>{message}</p>}
                <button type="submit" className="save-btn" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
              </form>
            </>
          )}

          {activeView === "account" && (
            <div className="account-overview">
              <h2>My Account</h2>
              <p>Account details linked to your current session.</p>
              <div className="account-grid">
                <div className="account-item"><span>Full Name</span><strong>{`${form.first_name} ${form.last_name}`.trim() || "—"}</strong></div>
                <div className="account-item"><span>Email</span><strong>{form.email || "—"}</strong></div>
                <div className="account-item"><span>Role</span><strong>{String(user.role || "user").toUpperCase()}</strong></div>
                <div className="account-item"><span>Account Creation Date</span><strong>{joinedDate}</strong></div>
              </div>
            </div>
          )}

          {activeView === "orders" && (
            <div className="account-overview">
              <h2>Order History</h2>
              <p>Your recent purchases and statuses.</p>
              {ordersLoading ? (
                <div className="orders-empty">Loading your orders...</div>
              ) : orders.length === 0 ? (
                <div className="orders-empty">No orders found for your account yet.</div>
              ) : (
                <div className="orders-list">
                  {orders.map(o => (
                    <div key={`${o.dbId}-${o.trackingId}`} className="order-row">
                      <div><span>Order</span><strong>{o.trackingId}</strong></div>
                      <div><span>Date</span><strong>{o.date}</strong></div>
                      <div><span>Items</span><strong>{o.orderAmount}</strong></div>
                      <div><span>Total</span><strong>{o.totalPrice}</strong></div>
                      <div><span>Status</span><strong className={`order-status ${String(o.status || "").toLowerCase()}`}>{o.status}</strong></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Newsletter/>
      <Footer/>
      </>
        
  );
}

export default User;