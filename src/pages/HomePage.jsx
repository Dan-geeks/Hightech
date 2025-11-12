import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./HomePage.css";

function HomePage() {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Premium DXF files, custom design services, and professional 3D printing solutions for engineers, architects, and makers.";
  
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        // Hide cursor after a brief pause
        setTimeout(() => setShowCursor(false), 500);
      }
    }, 30); // Speed of typing (30ms per character)
    
    return () => clearInterval(typingInterval);
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
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              PRECISION ENGINEERING
              <br />
              <span className="hero-highlight">DIGITAL SOLUTIONS</span>
            </motion.h1>

            <motion.p
              className="hero-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {typedText}
              {showCursor && <span className="typing-cursor">|</span>}
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link to="/dxf-marketplace" className="btn btn-primary">
                Browse DXF Files
              </Link>
              <Link to="/design-services" className="btn btn-secondary">
                Request Custom Design
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="animation-container">
              {/* Floating geometric shapes */}
              <motion.div
                className="floating-shape shape-1"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="floating-shape shape-2"
                animate={{
                  y: [0, 30, 0],
                  rotate: [0, -180, -360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="floating-shape shape-3"
                animate={{
                  y: [0, -25, 0],
                  x: [0, 15, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="floating-shape shape-4"
                animate={{
                  y: [0, 20, 0],
                  x: [0, -10, 0],
                  rotate: [0, 90, 180, 270, 360],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Central rotating element */}
              <motion.div
                className="central-gear"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="gear-inner"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="services-section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">OUR SERVICES</h2>
            <p className="section-subtitle">Professional engineering solutions for every project</p>
          </motion.div>

          <div className="grid grid-3">
            <ServiceCard
              icon="📐"
              title="DXF Files Marketplace"
              description="Download ready-to-use DXF files for CNC, laser cutting, and CAD projects. Instant delivery after payment."
              link="/dxf-marketplace"
              delay={0.1}
            />
            <ServiceCard
              icon="✏️"
              title="Custom Design Services"
              description="Professional CAD design, technical drawings, and 3D modeling tailored to your specifications."
              link="/design-services"
              delay={0.2}
            />
            <ServiceCard
              icon="🖨️"
              title="3D Printing"
              description="High-quality 3D printing services with precision and various material options for prototypes and production."
              link="/3d-printing"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* DXF Showcase */}
      <section className="dxf-showcase">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">FEATURED DXF DESIGNS</h2>
            <p className="section-subtitle">Professional laser-cut ready designs from our marketplace</p>
          </motion.div>

          <div className="dxf-grid">
            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img src="/Tattoo 3-01.jpg" alt="Tribal Heart Design" />
              <div className="dxf-overlay">
                <h4>Tribal Heart Design</h4>
                <p>Intricate laser-cut pattern</p>
              </div>
            </motion.div>

            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <img src="/Tattoo 9.jpg" alt="Decorative Panel" />
              <div className="dxf-overlay">
                <h4>Decorative Panel</h4>
                <p>Ornate wall art design</p>
              </div>
            </motion.div>

            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src="/036size.jpg" alt="Abstract Pattern" />
              <div className="dxf-overlay">
                <h4>Abstract Pattern</h4>
                <p>Modern geometric design</p>
              </div>
            </motion.div>

            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <img src="/04.jpg" alt="Mandala Design" />
              <div className="dxf-overlay">
                <h4>Mandala Design</h4>
                <p>Circular symmetry pattern</p>
              </div>
            </motion.div>

            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <img src="/3593491.jpg" alt="Floral Design" />
              <div className="dxf-overlay">
                <h4>Floral Design</h4>
                <p>Nature-inspired pattern</p>
              </div>
            </motion.div>

            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <img src="/9055032.jpg" alt="Artistic Panel" />
              <div className="dxf-overlay">
                <h4>Artistic Panel</h4>
                <p>Creative laser-cut art</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="cta-buttons"
            style={{ marginTop: '3rem', justifyContent: 'center' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/dxf-marketplace" className="btn btn-primary">
              View All DXF Files
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="grid grid-2">
            <FeatureCard
              number="01"
              title="Instant Digital Delivery"
              description="Download your DXF files immediately after payment via M-Pesa. No waiting, no hassle."
              delay={0.1}
            />
            <FeatureCard
              number="02"
              title="Professional Quality"
              description="All files and services meet industry standards and are optimized for manufacturing."
              delay={0.15}
            />
            <FeatureCard
              number="03"
              title="Secure Payments"
              description="Safe and convenient M-Pesa payment integration for all transactions."
              delay={0.2}
            />
            <FeatureCard
              number="04"
              title="Expert Support"
              description="Technical support and consultation available for all your engineering needs."
              delay={0.25}
            />
          </div>
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
            <h2 className="cta-title">Ready to Start Your Project?</h2>
            <p className="cta-text">Browse our marketplace or request a custom design today</p>
            <div className="cta-buttons">
              <Link to="/dxf-marketplace" className="btn btn-primary">
                Explore DXF Files
              </Link>
              <Link to="/design-services" className="btn btn-secondary">
                Get Custom Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description, link, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }} 
      transition={{ duration: 0.5, delay }}
    >
      <Link to={link} className="service-card card">
        <div className="service-icon">{icon}</div>
        <h3 className="service-title">{title}</h3>
        <p className="service-description">{description}</p>
        <div className="service-arrow">→</div>
      </Link>
    </motion.div>
  );
}

function FeatureCard({ number, title, description, delay }) {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="feature-number">{number}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  );
}

export default HomePage;