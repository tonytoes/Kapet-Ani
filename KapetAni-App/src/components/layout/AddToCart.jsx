import React, { useState } from 'react';
import '../../styles/addtocart.css';

const AddToCart = ({ price }) => {
  const [status, setStatus] = useState('idle'); // idle, adding, success

  const handleClick = () => {
    setStatus('adding');
    
    // Simulate a quick delay for that "processing" feel
    setTimeout(() => {
      setStatus('success');
      
      // Reset back to normal after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    }, 600);
  };

  return (
    <div className="atc-container">
      <div className="atc-price-display">
        <span className="currency">$</span>
        <span className="price-amount">{price}.00 USD</span>
      </div>
      
      <button 
        className={`atc-button ${status}`} 
        onClick={handleClick}
        disabled={status !== 'idle'}
      >
        <span className="btn-text">
          {status === 'idle' && 'ADD TO CART'}
          {status === 'adding' && 'ADDING...'}
          {status === 'success' && '✓ ADDED'}
        </span>
      </button>
    </div>
  );
};

export default AddToCart;