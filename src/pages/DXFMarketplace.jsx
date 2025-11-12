import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./DXFMarketplace.css";

const files = [
  {
    id: "precision-gearbox",
    name: "Parametric Gearbox Assembly DXF",
    category: "Mechanical",
    price: 3500,
    complexity: "Advanced",
    downloads: 128,
    format: "DXF + PDF",
    description: "Fully constrained gearbox plates, shafts, and spacer set ready for CNC routing.",
  },
  {
    id: "architectural-screen",
    name: "Architectural Facade Screen",
    category: "Architectural",
    price: 2800,
    complexity: "Intermediate",
    downloads: 212,
    format: "DXF",
    description: "Parametric lattice pattern optimized for laser cutting and facade panels.",
  },
  {
    id: "custom-bracket-pack",
    name: "Industrial Bracket Pack",
    category: "Mechanical",
    price: 2200,
    complexity: "Intermediate",
    downloads: 96,
    format: "DXF",
    description: "10 high-strength bracket templates with chamfered edges and drilling guides.",
  },
  {
    id: "automotive-cluster",
    name: "Motorsport Gauge Cluster",
    category: "Automotive",
    price: 3200,
    complexity: "Advanced",
    downloads: 74,
    format: "DXF",
    description: "Dashboard cluster with labeled mounting holes and wiring channels.",
  },
  {
    id: "decor-panel",
    name: "Decorative Wall Panel Set",
    category: "Decorative",
    price: 1800,
    complexity: "Beginner",
    downloads: 340,
    format: "DXF + SVG",
    description: "Three geometric panels sized for CO2 laser beds up to 600mm.",
  },
  {
    id: "drone-frame",
    name: "Carbon Fiber Drone Frame",
    category: "Mechanical",
    price: 4200,
    complexity: "Advanced",
    downloads: 51,
    format: "DXF",
    description: "Lightweight FPV frame plates with integrated cable channels and standoff holes.",
  },
];

const categories = ["All", "Mechanical", "Architectural", "Decorative", "Automotive"];

function DXFMarketplace({ addToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesCategory = category === "All" || file.category === category;
      const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const handleAdd = (file) => {
    addToCart({ id: file.id, name: file.name, price: file.price });
  };

  return (
    <div className="marketplace page">
      <section className="marketplace-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow">CURATED DXF LIBRARY</p>
            <h1 className="section-title">DXF Marketplace</h1>
            <p className="section-subtitle">
              Professionally prepared DXF files optimized for CNC routing, waterjet cutting, and laser machining. Secure
              M-Pesa checkout with instant download links.
            </p>
            <div className="marketplace-cta">
              <Link to="/cart" className="btn btn-secondary">
                Go to Cart
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="marketplace-content">
        <div className="container">
          <div className="marketplace-controls card">
            <div className="form-group">
              <label className="form-label" htmlFor="search">
                Search files
              </label>
              <input
                id="search"
                className="form-input"
                placeholder="Type part name, e.g. gearbox"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-3 marketplace-grid">
            {filteredFiles.map((file) => (
              <motion.div
                className="marketplace-card card"
                key={file.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div className="card-header">
                  <p className="file-category">{file.category}</p>
                  <p className="file-complexity">{file.complexity}</p>
                </div>
                <h3 className="file-name">{file.name}</h3>
                <p className="file-description">{file.description}</p>

                <div className="file-meta">
                  <span>{file.format}</span>
                  <span>{file.downloads}+ downloads</span>
                </div>

                <div className="card-footer">
                  <div className="file-price">KES {file.price.toLocaleString()}</div>
                  <button className="btn btn-primary" onClick={() => handleAdd(file)}>
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="alert alert-warning">No files match your search. Try another keyword or category.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default DXFMarketplace;

