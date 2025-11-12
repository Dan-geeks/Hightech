import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./HomePage.css";

function HomePage() {
  return (
    <div className="home-page page">
      {/* Hero Section */}
      <section className="hero">
        <div className="tech-lines">
          <div className="tech-line" style={{ top: "20%", animationDelay: "0s" }}></div>
          <div className="tech-line" style={{ top: "50%", animationDelay: "1s" }}></div>
          <div className="tech-line" style={{ top: "80%", animationDelay: "2s" }}></div>
        </div>

        <div className="container hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              PRECISION ENGINEERING
              <br />
              <span className="hero-highlight">DIGITAL SOLUTIONS</span>
            </motion.h1>

            <motion.p
              className="hero-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Premium DXF files, custom design services, and professional 3D printing solutions for engineers, architects,
              and makers.
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <div className="blueprint-container">
              <svg viewBox="0 0 400 400" className="blueprint-svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 212, 255, 0.2)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="400" height="400" fill="url(#grid)" />

                {/* Technical drawing elements */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r="80"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 }}
                />
                <motion.circle
                  cx="200"
                  cy="200"
                  r="60"
                  fill="none"
                  stroke="var(--secondary)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.2 }}
                />
                <motion.line
                  x1="120"
                  y1="200"
                  x2="280"
                  y2="200"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                />
                <motion.line
                  x1="200"
                  y1="120"
                  x2="200"
                  y2="280"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                />

                {/* Corner brackets */}
                <motion.path
                  d="M 50 50 L 50 70 M 50 50 L 70 50"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 2 }}
                />
                <motion.path
                  d="M 350 50 L 350 70 M 350 50 L 330 50"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 2.1 }}
                />
                <motion.path
                  d="M 50 350 L 50 330 M 50 350 L 70 350"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 2.2 }}
                />
                <motion.path
                  d="M 350 350 L 350 330 M 350 350 L 330 350"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 2.3 }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="services-section">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="section-title">OUR SERVICES</h2>
            <p className="section-subtitle">Professional engineering solutions for every project</p>
          </motion.div>

          <div className="grid grid-3">
            <ServiceCard
              icon="📐"
              title="DXF Files Marketplace"
              description="Download ready-to-use DXF files for CNC, laser cutting, and CAD projects. Instant delivery after payment."
              link="/dxf-marketplace"
              delay={0.2}
            />
            <ServiceCard
              icon="✏️"
              title="Custom Design Services"
              description="Professional CAD design, technical drawings, and 3D modeling tailored to your specifications."
              link="/design-services"
              delay={0.4}
            />
            <ServiceCard
              icon="🖨️"
              title="3D Printing"
              description="High-quality 3D printing services with precision and various material options for prototypes and production."
              link="/3d-printing"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* DXF Showcase */}
      <section className="dxf-showcase">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <h2 className="section-title">FEATURED DXF DESIGNS</h2>
            <p className="section-subtitle">Professional laser-cut ready designs from our marketplace</p>
          </motion.div>

          <div className="dxf-grid">
            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 30 }}
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src="/Tattoo 9.jpg" alt="Decorative Panel" />
              <div className="dxf-overlay">
                <h4>Decorative Panel</h4>
                <p>Ornate wall art design</p>
              </div>
            </motion.div>

            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <img src="/036size.jpg" alt="Abstract Pattern" />
              <div className="dxf-overlay">
                <h4>Abstract Pattern</h4>
                <p>Modern geometric design</p>
              </div>
            </motion.div>

            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <img src="/04.jpg" alt="Mandala Design" />
              <div className="dxf-overlay">
                <h4>Mandala Design</h4>
                <p>Circular symmetry pattern</p>
              </div>
            </motion.div>

            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <img src="/3593491.jpg" alt="Floral Design" />
              <div className="dxf-overlay">
                <h4>Floral Design</h4>
                <p>Nature-inspired pattern</p>
              </div>
            </motion.div>

            <motion.div 
              className="dxf-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
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
            transition={{ duration: 0.6, delay: 0.7 }}
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
              delay={0.2}
            />
            <FeatureCard
              number="02"
              title="Professional Quality"
              description="All files and services meet industry standards and are optimized for manufacturing."
              delay={0.3}
            />
            <FeatureCard
              number="03"
              title="Secure Payments"
              description="Safe and convenient M-Pesa payment integration for all transactions."
              delay={0.4}
            />
            <FeatureCard
              number="04"
              title="Expert Support"
              description="Technical support and consultation available for all your engineering needs."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
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
    <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay }}>
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
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <div className="feature-number">{number}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  );
}

export default HomePage;