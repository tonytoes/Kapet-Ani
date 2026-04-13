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
          <select
            className="categories-btn"
            value={categoryValue}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map(c => (
              <option key={c.value} value={c.value} disabled={c.disabled}>
                {c.label}
              </option>
            ))}
          </select>
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