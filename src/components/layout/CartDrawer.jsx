import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { LINK_PATH } from "../../admin/data/LinkPath.jsx";
import '../../styles/cartdrawer.css';
import { getCartItems, getCartSubtotal, saveCartItems } from "../../utils/cart";
const API_PRODUCTS = `${LINK_PATH}Inventorycontroller.php`;
const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => getCartItems());

  useEffect(() => {
    setItems(getCartItems());
    const sync = () => setItems(getCartItems());
    window.addEventListener("cart:updated", sync);
    return () => window.removeEventListener("cart:updated", sync);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const hydrateStock = async () => {
      try {
        const current = getCartItems();
        if (current.length === 0) return;
        const res = await fetch(API_PRODUCTS);
        const data = await res.json();
        const products = data?.products || [];
        const byId = new Map(products.map((p) => [Number(p.id), Number(p.qty || 0)]));
        const next = current.map((it) => ({
          ...it,
          stock: byId.has(Number(it.id)) ? byId.get(Number(it.id)) : Number(it.stock || 0),
        }));
        setItems(next);
        saveCartItems(next);
      } catch {
        // keep current cart state on fetch failure
      }
    };
    hydrateStock();
  }, [isOpen]);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);

  const updateQty = (id, qty) => {
    const next = items.map((it) => {
      if (it.id !== id) return it;
      const requested = Math.max(1, Number(qty || 1));
      const stockCap = Number(it.stock || 0);
      const nextQty = stockCap > 0 ? Math.min(requested, stockCap) : requested;
      return { ...it, qty: nextQty };
    });
    setItems(next);
    saveCartItems(next);
  };

  const removeItem = (id) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    saveCartItems(next);
  };

  return (
    <>

      <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <span className="cart-title">YOUR CART</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div style={{ color: "#8b8b8b", fontSize: 14 }}>Your cart is empty.</div>
          ) : items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-img">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h4>{item.name}</h4>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
                  <span style={{ marginRight: 10 }}>
                    Price: {Number(item.price || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                  </span>
                  {Number(item.discount || 0) > 0 && (
                    <>
                      <span style={{ textDecoration: "line-through", marginRight: 6 }}>
                        {Number(item.originalPrice || item.price || 0).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                      </span>
                      <span style={{ color: "#b45309", fontWeight: 700 }}>-{item.discount}%</span>
                    </>
                  )}
                </div>
                <div style={{ fontSize: 12, color: Number(item.stock || 0) > 0 ? "#15803d" : "#b91c1c", marginBottom: 6 }}>
                  Stock: {item.stock == null ? "Checking..." : Number(item.stock || 0) > 0 ? item.stock : "Out of stock"}
                </div>
                <button className="remove-link" onClick={() => removeItem(item.id)}>REMOVE</button>
              </div>
              <div className="item-price">
                <input
                  type="number"
                  value={item.qty}
                  min={1}
                  max={Number(item.stock || 0) > 0 ? Number(item.stock) : undefined}
                  className="qty-input"
                  onChange={(e) => updateQty(item.id, e.target.value)}
                />
                <div style={{ fontSize: 12, marginTop: 6, textAlign: "right", color: "#374151" }}>
                  {(Number(item.price || 0) * Number(item.qty || 0)).toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="subtotal-row">
            <span>Subtotal</span>
            <span>{subtotal.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}</span>
          </div>
          <button
            className="checkout-btn"
            disabled={items.length === 0}
            onClick={() => { onClose?.(); navigate("/checkout"); }}
          >
            CONTINUE TO CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;