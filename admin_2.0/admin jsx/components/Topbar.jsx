export default function Topbar({ title, onToggle }) {
  return (
    <div className="kp-topbar">
      <div className="topbar-left">
        <button className="toggle-btn" onClick={onToggle}>
          <i className="bi bi-list"></i>
        </button>
        <span className="page-title">{title}</span>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn"><i className="bi bi-search"></i></button>
        <button className="topbar-icon-btn">
          <i className="bi bi-bell"></i>
          <span className="notif-dot"></span>
        </button>
        <div className="topbar-avatar">C</div>
      </div>
    </div>
  );
}
