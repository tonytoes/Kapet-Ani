import { useState, useEffect } from "react";
 
export default function Topbar({ title, onToggle }) {
  const raw  = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
 
  const fullName = user ? `${user.first_name} ${user.last_name}` : "Administrator";
  const initial  = fullName.charAt(0).toUpperCase();
 
  const [imageUrl, setImageUrl] = useState(null);
 
  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem("token");
 
    fetch(`http://localhost/backend/controllers/usersController.php`, {
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
 
  return (
    <div className="kp-topbar">
      <div className="topbar-left">
        <button className="toggle-btn" onClick={onToggle}>
          <i className="bi bi-list"></i>
        </button>
        <span className="page-title">{title}</span>
      </div>
 
      <div className="topbar-right">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div className="topbar-avatar">{initial}</div>
        )}
      </div>
    </div>
  );
}
 