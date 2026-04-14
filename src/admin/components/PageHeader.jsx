import { useEffect, useRef, useState } from "react";

function HeaderCategorySelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const selected = options.find(opt => opt.value === value);

  useEffect(() => {
    function onOutsideClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  return (
    <div className={`kp-select header-select${open ? " open" : ""}`} ref={boxRef}>
      <button
        type="button"
        className="kp-select-trigger header-select-trigger"
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected?.label ?? "Select"}</span>
        <i className="bi bi-chevron-down" />
      </button>
      {open && (
        <div className="kp-select-menu header-select-menu" role="listbox">
          {options.map(opt => (
            <button
              type="button"
              key={opt.value}
              className={`kp-select-option${value === opt.value ? " active" : ""}`}
              onClick={() => {
                if (!opt.disabled) onChange(opt.value);
                setOpen(false);
              }}
              disabled={opt.disabled}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PageHeader({
  title,
  onAdd,
  search,
  onSearch,
  showCategories = false,
  categories = [],
  categoryValue,
  onCategoryChange,
  sortOrder,
  onToggleSort,
  extraActions,        // ← NEW
}) {
  return (
    <div className="page-header">
      <div className="page-header-title">
        {onAdd && (
          <button className="add-btn" onClick={onAdd}>
            <i className="bi bi-plus"></i>
          </button>
        )}
        {title}
      </div>

      <div className="page-header-controls">

        {extraActions}   {/* ← renders the Categories button (or anything else) */}

        <button className="header-icon-btn" title="Sort" onClick={onToggleSort}>
          <i className={`bi bi-sort-${sortOrder === "asc" ? "up" : "down"}`}></i>
        </button>

        {showCategories && (
          <HeaderCategorySelect
            value={categoryValue}
            onChange={onCategoryChange}
            options={categories}
          />
        )}

        {onSearch && (
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search…"
            />
          </div>
        )}
      </div>
    </div>
  );
}