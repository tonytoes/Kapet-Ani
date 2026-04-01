export default function PageHeader({ title, onAdd, search, onSearch, showCategories = false }) {
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
        <button className="header-icon-btn" title="Sort">
          <i className="bi bi-sort-down"></i>
        </button>
        {showCategories && (
          <button className="categories-btn">
            <i className="bi bi-funnel-fill"></i>Categories
          </button>
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
