import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "../../styles/ProductPage.css";

function MiniIcon({ type }) {
  if (type === "stock-ok") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === "stock-out") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "discount") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12l8 8 8-8-8-8-8 8z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
        <circle cx="9" cy="9" r="1.5" fill="currentColor" />
        <path d="M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" stroke="currentColor" strokeWidth="2.1" />
      <path d="M8 12h8" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

const DEFAULT_LABELS = {
  breadcrumb: "Collection / Studio Pieces",
  outOfStock: "Out of Stock",
  itemAdded: "Item Added",
  addToCart: "Add to Cart",
  stock: "Stock",
  category: "Category",
  status: "Status",
  inStock: "In Stock",
  localProduct: "Local Product",
  activeStatus: "Active",
};

function ProductModal({ product, onClose, onAddToCart, formatCurrency, labels = {} }) {
  const L = { ...DEFAULT_LABELS, ...labels };
  const [addedToCart, setAddedToCart] = useState(false);
  const [current, setCurrent] = useState(null);

  // Handle Body Scroll and Escape Key
  useEffect(() => {
    if (!product) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [product, onClose]);

  // Sync state when product prop changes
  useEffect(() => {
    if (product?.id) {
      setCurrent(product);
      setAddedToCart(false);
    }
  }, [product?.id]);

  const handleAddToCart = useCallback(() => {
    if (!current || current.qty <= 0) return;
    onAddToCart?.(current);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2400);
  }, [current, onAddToCart]);

  if (!current) return null;

  return createPortal(
    <div
      className="mm-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mm-modal">
        {/* Fixed Close Button Structure */}
        <div className="mm-close-wrapper">
          <button 
            className="mm-close-btn" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            aria-label="Close modal"
          />
        </div>

        <div className="mm-main-content">
          <div className="mm-image-side">
            <img 
              className="mm-product-image" 
              src={current.image} 
              alt={current.name} 
              loading="eager" 
            />
          </div>

          <div className="mm-info-side">
            <nav className="mm-breadcrumb">{L.breadcrumb}</nav>
            <h1 className="mm-product-name">{current.name}</h1>
            <p className="mm-product-price">
              {formatCurrency ? formatCurrency(current.price) : `PHP ${Number(current.price).toFixed(2)}`}
            </p>
            {Number(current.discount || 0) > 0 && (
              <p className="mm-product-desc" style={{ marginTop: -18, marginBottom: 16 }}>
                <span style={{ textDecoration: "line-through", color: "#9CA3AF", marginRight: 8 }}>
                  {formatCurrency ? formatCurrency(current.originalPrice) : `PHP ${Number(current.originalPrice || 0).toFixed(2)}`}
                </span>
                <strong>-{current.discount}%</strong>
              </p>
            )}
            <p className="mm-product-desc">{current.description}</p>

            <button
              className={`mm-add-btn ${addedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
              disabled={addedToCart || current.qty <= 0}
            >
              {current.qty <= 0 ? L.outOfStock : addedToCart ? L.itemAdded : L.addToCart}
            </button>
          </div>
        </div>

        <div className="mm-details-bar">
          <div className="mm-dim-grid">
            <span>{L.stock}: {current.qty}</span>
            <span>{L.category}: {current.category}</span>
            <span>{L.status}: {current.status || L.activeStatus}</span>
          </div>
          <div className="mm-feat-grid">
            <article className="mm-feat-item">
              <span><MiniIcon type={current.qty > 0 ? "stock-ok" : "stock-out"} /></span> {current.qty > 0 ? L.inStock : L.outOfStock}
            </article>
            <article className="mm-feat-item">
              <span><MiniIcon type={Number(current.discount || 0) > 0 ? "discount" : "local"} /></span>{" "}
              {Number(current.discount || 0) > 0 ? `${current.discount}% Off` : L.localProduct}
            </article>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ProductModal;