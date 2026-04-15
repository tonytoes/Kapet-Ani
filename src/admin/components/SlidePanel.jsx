export default function SlidePanel({ isOpen, onClose, title, mode, footer, children }) {
  return (
    <aside className={`kp-slide-panel${isOpen ? " open" : ""}`}>
      <div className="panel-scroll">
        <div className="panel-header">
          <div className="panel-title">{title}</div>
          <button className="panel-close-btn" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>
        {children}
      </div>

      <div className={`panel-footer${mode === "add" ? " add-mode" : ""}`}>
        {footer}
      </div>
    </aside>
  );
} //slidepanel
