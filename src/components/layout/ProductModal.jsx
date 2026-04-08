import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "../../styles/ProductPage.css";
function ProductModal({ product, onClose }) {
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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2400);
  }, []);

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
            <nav className="mm-breadcrumb">Collection / Studio Pieces</nav>
            <h1 className="mm-product-name">{current.name}</h1>
            <p className="mm-product-price">
              ${Number(current.price).toFixed(2)} USD
            </p>
            <p className="mm-product-desc">{current.description}</p>

            <button
              className={`mm-add-btn ${addedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
              disabled={addedToCart}
            >
              {addedToCart ? "Item Added" : "Add to Collection"}
            </button>
          </div>
        </div>

        <div className="mm-details-bar">
          <div className="mm-dim-grid">
            <span>L: {current.dimensions?.length || 0}mm</span>
            <span>H: {current.dimensions?.height || 0}mm</span>
            <span>W: {current.dimensions?.width || 0}mm</span>
            <span>Wt: {current.dimensions?.weight || 0}g</span>
          </div>
          <div className="mm-feat-grid">
            <article className="mm-feat-item"><span>⭐</span> Quality</article>
            <article className="mm-feat-item"><span>🌿</span> Ethical</article>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ProductModal;