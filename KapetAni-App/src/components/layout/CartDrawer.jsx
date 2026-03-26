import React from 'react';
import '../../styles/cartdrawer.css';
const CartDrawer = ({ isOpen, onClose }) => {
  return (
    <>

      <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <span className="cart-title">YOUR CART</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-items">
          <div className="cart-item">
            <div className="item-img">
              <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=200" alt="Basket" />
            </div>
            <div className="item-details">
              <h4>craft-10 basket</h4>
              <button className="remove-link">REMOVE</button>
            </div>
            <div className="item-price">
              <input type="number" defaultValue="1" className="qty-input" />
            </div>
          </div>
        </div>

        <div className="cart-footer">
          <div className="subtotal-row">
            <span>Subtotal</span>
            <span>$ 297.00 USD</span>
          </div>
          <button className="checkout-btn">CONTINUE TO CHECKOUT</button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;