import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Cart.css";

function Cart({ cart, updateQuantity, removeFromCart }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 0; // Digital delivery is free
  const total = subtotal + delivery;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  return (
    <div className="cart page">
      <div className="container">
        <Link to="/dxf-marketplace" className="continue-shopping">
          ← Continue Shopping
        </Link>

        {cart.length === 0 ? (
          <div className="cart-empty card">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any DXF files yet.</p>
            <div className="cart-empty-actions">
              <Link to="/dxf-marketplace" className="btn btn-primary">
                Browse DXF Files
              </Link>
              <Link to="/design-services" className="btn btn-secondary">
                Custom Design Services
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="cart-header">
              <h1 className="section-title">Shopping Cart</h1>
              <p className="section-subtitle">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
            </div>

            <div className="cart-grid">
              <div className="cart-items">
                {cart.map((item) => (
                  <motion.div
                    className="cart-item card"
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className="cart-item-image" style={{
                      backgroundImage: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem'
                    }}>
                      📄
                    </div>

                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.name}</h3>
                      <div className="cart-item-details">
                        <span>Digital Download</span>
                        <span>•</span>
                        <span>DXF Format</span>
                      </div>
                      <div className="cart-item-price">KES {item.price.toLocaleString()}</div>
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1) {
                              handleQuantityChange(item.id, val);
                            }
                          }}
                        />
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="cart-summary card">
                <h2 className="summary-header">Order Summary</h2>
                
                <div className="summary-row">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                  <span>Delivery</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
                </div>

                <div className="summary-total">
                  <span>Total</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>

                <ul className="summary-features">
                  <li>Instant digital download</li>
                  <li>Secure M-Pesa payment</li>
                  <li>Professional quality files</li>
                  <li>Technical support included</li>
                </ul>

                <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Proceed to Checkout
                </Link>

                <p className="summary-note">
                  Secure checkout powered by M-Pesa. Download links sent immediately after payment confirmation.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;