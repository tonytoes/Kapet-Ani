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
        <div className="topbar-avatar">C</div>
      </div>
    </div>
  );
}
