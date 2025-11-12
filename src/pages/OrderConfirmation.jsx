import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const total = location.state?.total ?? 0;
  const email = location.state?.email ?? "your email";

  return (
    <div className="order-confirmation page">
      <div className="container">
        <motion.div className="confirmation-card card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <p className="eyebrow">PAYMENT RECEIVED</p>
          <h1 className="section-title">Thank You!</h1>
          <p className="section-subtitle">
            Order <span className="order-id">{orderId}</span> has been confirmed.
          </p>

          <div className="confirmation-details">
            <div>
              <p className="label">Total Paid</p>
              <p className="value">KES {total.toLocaleString()}</p>
            </div>
            <div>
              <p className="label">Delivery</p>
              <p className="value">Instant Digital Download</p>
            </div>
            <div>
              <p className="label">Email</p>
              <p className="value">{email}</p>
            </div>
          </div>

          <p className="confirmation-note">
            Download links and invoice were sent to {email}. If you need adjustments or custom work, reply to that email and our
            engineers will help you within 24 hours.
          </p>

          <div className="confirmation-actions">
            <Link to="/dxf-marketplace" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link to="/design-services" className="btn btn-secondary">
              Request Custom Design
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderConfirmation;

