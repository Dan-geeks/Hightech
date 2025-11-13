import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./DXFMarketplace.css";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

const categories = ["All", "Mechanical", "Architectural", "Decorative", "Automotive"];

function DXFMarketplace({ addToCart }) {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sortBy, setSortBy] = useState("popular");

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Keep URL query in sync
  useEffect(() => {
    const searchParam = searchParams.get("search");
    const categoryParam = searchParams.get("category");
    if (searchParam) setSearch(searchParam);
    if (categoryParam) setCategory(categoryParam);
  }, [searchParams]);

  // 🔥 Load DXF files from Firestore (no local fallback)
  useEffect(() => {
    const q = query(collection(db, "dxfFiles"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFiles(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading DXF files:", error);
        setFiles([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredFiles = useMemo(() => {
    let result = files.filter((file) => {
      const matchesCategory = category === "All" || file.category === category;
      const lowerSearch = search.toLowerCase();
      const name = (file.name || "").toLowerCase();
      const desc = (file.description || "").toLowerCase();
      const matchesSearch = name.includes(lowerSearch) || desc.includes(lowerSearch);
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
      default:
        result.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    }

    return result;
  }, [category, search, sortBy, files]);

  const handleAdd = (file) => {
    addToCart({ id: file.id, name: file.name, price: file.price || 0 });
  };

  return (
    <div className="marketplace page">
      <section className="marketplace-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow">PROFESSIONAL DXF LIBRARY</p>
            <h1 className="section-title">DXF Marketplace</h1>
            <p className="section-subtitle">
              High-quality DXF files optimized for CNC routing, waterjet cutting, and laser
              machining. Instant download after secure M-Pesa checkout.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="marketplace-content">
        <div className="container">
          <div className="marketplace-controls">
            <div className="form-group">
              <label className="form-label" htmlFor="search">
                Search files
              </label>
              <input
                id="search"
                className="form-input"
                placeholder="Search by name or description..."
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

            <div className="form-group">
              <label className="form-label" htmlFor="sort">
                Sort by
              </label>
              <select
                id="sort"
                className="form-select"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner" />
            </div>
          )}

          {!loading && files.length === 0 && (
            <div className="alert alert-warning" style={{ marginTop: "2rem" }}>
              No DXF files have been added yet. Log into the admin panel to create your first items.
            </div>
          )}

          {!loading && files.length > 0 && (
            <>
              <div className="results-header">
                <p className="results-count">
                  {filteredFiles.length}{" "}
                  {filteredFiles.length === 1 ? "result" : "results"} found
                </p>
              </div>

              <div className="grid grid-4 marketplace-grid">
                {filteredFiles.map((file, index) => (
                  <motion.div
                    className="marketplace-card card"
                    key={file.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div
                      className="card-image"
                      style={{
                        backgroundImage: `url(${file.image || "/3593491.jpg"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />

                    <div className="card-header">
                      <p className="file-category">{file.category}</p>
                      <p className="file-complexity">{file.complexity}</p>
                    </div>

                    <h3 className="file-name">{file.name}</h3>

                    <div className="rating">
                      <span>★★★★★</span>
                      <span className="rating-count">({file.downloads || 0})</span>
                    </div>

                    <p className="file-description">{file.description}</p>

                    <div className="file-meta">
                      <span>📄 {file.format}</span>
                      <span>⬇️ {file.downloads || 0}+ downloads</span>
                    </div>

                    <div className="delivery-badge">⚡ Instant Download</div>

                    <div className="card-footer">
                      <div className="file-price">
                        <span className="file-price-currency">KES</span>{" "}
                        {Number(file.price || 0).toLocaleString()}
                      </div>
                      <button className="btn btn-primary" onClick={() => handleAdd(file)}>
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredFiles.length === 0 && files.length > 0 && (
                <div className="alert alert-warning">
                  No files match your search. Try adjusting your filters or search text.
                </div>
              )}

              <motion.div
                style={{ marginTop: "3rem", textAlign: "center" }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "1rem",
                  }}
                >
                  Can't find what you need?
                </p>
                <Link to="/design-services" className="btn btn-secondary">
                  Request Custom Design
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default DXFMarketplace;
