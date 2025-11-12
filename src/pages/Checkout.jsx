import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Checkout.css";

function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();
  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.16);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    mpesa: "",
  });
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="checkout page">
        <div className="container">
          <div className="card empty-checkout">
            <p>Your cart is empty. Add DXF files before checking out.</p>
            <Link to="/dxf-marketplace" className="btn btn-primary">
              Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.mpesa) {
      setError("Please complete all fields.");
      return;
    }
    setError("");
    setProcessing(true);
    setTimeout(() => {
      const orderId = `HTE-${Date.now().toString().slice(-6)}`;
      clearCart();
      navigate(`/order-confirmation/${orderId}`, {
        replace: true,
        state: { total: totals.total, email: formData.email },
      });
    }, 1200);
  };

  return (
    <div className="checkout page">
      <div className="container checkout-grid">
        <motion.form
          className="checkout-form card"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2>Billing Details</h2>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Jane Engineer"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone (M-Pesa)
            </label>
            <input
              id="phone"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="07xx xxx xxx"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="mpesa">
              M-Pesa Transaction Code
            </label>
            <input
              id="mpesa"
              name="mpesa"
              className="form-input"
              value={formData.mpesa}
              onChange={handleChange}
              placeholder="ABC123XYZ"
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={processing}>
            {processing ? "Processing..." : "Confirm Payment"}
          </button>
        </motion.form>

        <motion.div className="checkout-summary card" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
          <h2>Order Summary</h2>
          <ul className="summary-list">
            {cart.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>KES {(item.price * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>KES {totals.subtotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>16% VAT</span>
            <span>KES {totals.tax.toLocaleString()}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>KES {totals.total.toLocaleString()}</span>
          </div>
          <p className="summary-note">Digital download links will be sent instantly after payment verification.</p>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;

