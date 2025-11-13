import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./HomePage.css";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

function HomePage({ addToCart }) {
  const [typedText, setTypedText] = useState("");
  const fullText =
    "Download ready-to-use DXF files for CNC, laser cutting, and CAD projects. Plus custom design services and 3D printing solutions.";
  const [hasTyped, setHasTyped] = useState(false);

  const [featuredFiles, setFeaturedFiles] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  // Typing effect
  useEffect(() => {
    if (hasTyped) return;

    let currentIndex = 0;
    const typingSpeed = 30;

    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setHasTyped(true);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [hasTyped]);

  // Featured DXF files from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "dxfFiles"),
      orderBy("downloads", "desc"),
      limit(4)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeaturedFiles(docs);
        setLoadingFeatured(false);
      },
      (error) => {
        console.error("Error loading featured DXF files:", error);
        setFeaturedFiles([]);
        setLoadingFeatured(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="home-page page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title">
              Professional DXF Files & Engineering Solutions
            </h1>
            <p className="hero-text">
              {typedText}
              {!hasTyped && <span className="typing-cursor">|</span>}
            </p>
            <div className="hero-buttons">
              <Link to="/dxf-marketplace" className="btn btn-primary">
                Browse Marketplace
              </Link>
              <Link to="/design-services" className="btn btn-secondary">
                Custom Design Services
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img src="/3593491.jpg" alt="DXF Design" className="hero-image" />
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured DXF Files</h2>
              <p className="section-subtitle">
                Popular downloads from our library
              </p>
            </div>
            <Link to="/dxf-marketplace" className="view-all-link">
              View All →
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="loading">
              <div className="spinner" />
            </div>
          ) : featuredFiles.length === 0 ? (
            <p className="section-subtitle">
              No featured DXF files yet. Add files in the admin panel to see
              them here.
            </p>
          ) : (
            <div className="grid grid-4">
              {featuredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard file={file} addToCart={addToCart} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <div className="feature-content">
                <h3>Instant Download</h3>
                <p>Get your DXF files immediately after payment via M-Pesa</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-content">
                <h3>Professional Quality</h3>
                <p>All files are tested and optimized for manufacturing</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <div className="feature-content">
                <h3>Secure Payment</h3>
                <p>Safe transactions through M-Pesa integration</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <div className="feature-content">
                <h3>Expert Support</h3>
                <p>Technical assistance available for all purchases</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="banner-section">
        <div className="container">
          <motion.div
            className="banner-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="banner-content">
              <h2>Need a Custom Design?</h2>
              <p>
                Our engineering team can create bespoke CAD designs, technical
                drawings, and 3D models tailored to your exact specifications.
              </p>
              <Link
                to="/design-services"
                className="btn btn-primary"
                style={{ marginTop: "1rem" }}
              >
                Get Custom Quote
              </Link>
            </div>
            <img
              src="/9055032.jpg"
              alt="Custom Design"
              className="banner-image"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="cta-title">Start Your Project Today</h2>
            <p className="cta-text">
              Browse professional DXF files or request a custom design.
            </p>
            <div className="cta-buttons">
              <Link to="/dxf-marketplace" className="btn btn-primary">
                Explore Marketplace
              </Link>
              <Link to="/3d-printing" className="btn btn-secondary">
                3D Printing Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ file, addToCart }) {
  return (
    <div className="product-card card">
      <div className="product-image-wrapper">
        <img
          src={file.image || "/3593491.jpg"}
          alt={file.name}
          className="product-image"
        />
        {file.badge && <span className="product-badge">{file.badge}</span>}
      </div>
      <h3 className="product-name">{file.name}</h3>
      <div className="product-rating">
        <span className="stars">★★★★★</span>
        <span className="rating-count">
          ({file.reviews ?? file.downloads ?? 0})
        </span>
      </div>
      <div className="product-price">
        KES {Number(file.price || 0).toLocaleString()}
        {file.originalPrice && (
          <span className="product-original-price">
            KES {Number(file.originalPrice).toLocaleString()}
          </span>
        )}
      </div>
      <p className="product-delivery">✓ Instant Digital Download</p>
      <button
        className="btn btn-primary"
        style={{ marginTop: "0.5rem", width: "100%" }}
        onClick={() =>
          addToCart({ id: file.id, name: file.name, price: file.price || 0 })
        }
      >
        Add to Cart
      </button>
    </div>
  );
}

export default HomePage;
