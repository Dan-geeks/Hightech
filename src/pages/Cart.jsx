import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Cart.css";

function Cart({ cart, updateQuantity, removeFromCart }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (itemId, value) => {
    if (value === "") return;
    const parsed = Number(value);
    if (Number.isNaN(parsed) || !Number.isInteger(parsed)) return;
    updateQuantity(itemId, parsed);
  };

  return (
    <div className="cart page">
      <div className="container">
        <div className="cart-header">
          <h1 className="section-title">Shopping Cart</h1>
          <p className="section-subtitle">Review your selected DXF files before checking out.</p>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty card">
            <p>Your cart is currently empty.</p>
            <div className="cart-empty-actions">
              <Link to="/dxf-marketplace" className="btn btn-primary">
                Browse DXF Files
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {cart.map((item) => (
                <motion.div
                  className="cart-item card"
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">KES {item.price.toLocaleString()}</p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <label htmlFor={`qty-${item.id}`}>Qty</label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) => handleQuantityChange(item.id, event.target.value)}
                      />
                    </div>
                    <button className="link-button" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="cart-summary card">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Digital Delivery</span>
                <span>Instant Download</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="btn btn-primary">
                Proceed to Checkout
              </Link>
              <p className="summary-note">Payments processed securely via M-Pesa.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

