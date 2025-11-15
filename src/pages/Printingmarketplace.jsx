import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./PrintingMarketplace.css";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

const categories = ["All", "Figurines", "Functional Parts", "Decorative", "Miniatures", "Tools"];
const materials = ["All", "PLA", "PETG", "ABS", "Resin", "Nylon"];

function PrintingMarketplace({ addToCart }) {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [material, setMaterial] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Keep URL query in sync
  useEffect(() => {
    const searchParam = searchParams.get("search");
    const categoryParam = searchParams.get("category");
    if (searchParam) setSearch(searchParam);
    if (categoryParam) setCategory(categoryParam);
  }, [searchParams]);

  // Load 3D printing items from Firestore
  useEffect(() => {
    const q = query(collection(db, "printingItems"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading 3D printing items:", error);
        setItems([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesMaterial = material === "All" || item.material === material;
      const lowerSearch = search.toLowerCase();
      const name = (item.name || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      const matchesSearch = name.includes(lowerSearch) || desc.includes(lowerSearch);
      return matchesCategory && matchesMaterial && matchesSearch;
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
        result.sort((a, b) => (b.orders || 0) - (a.orders || 0));
    }

    return result;
  }, [category, material, search, sortBy, items]);

  const handleAdd = (item) => {
    addToCart({ 
      id: item.id, 
      name: item.name, 
      price: item.price || 0,
      type: '3d-print'
    });
  };

  return (
    <div className="printing-marketplace page">
      <section className="marketplace-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow">3D PRINTING SERVICE</p>
            <h1 className="section-title">3D Printing Marketplace</h1>
            <p className="section-subtitle">
              Browse our collection of ready-to-print 3D models. Upload your own designs or choose from our catalog. Professional quality prints delivered to your door.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="marketplace-content">
        <div className="container">
          <div className="marketplace-controls">
            <div className="form-group">
              <label className="form-label" htmlFor="search">
                Search items
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
              <label className="form-label" htmlFor="material">
                Material
              </label>
              <select
                id="material"
                className="form-select"
                value={material}
                onChange={(event) => setMaterial(event.target.value)}
              >
                {materials.map((item) => (
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

          {!loading && items.length === 0 && (
            <div className="alert alert-warning" style={{ marginTop: "2rem" }}>
              No 3D printing items have been added yet. Log into the admin panel to create your first items.
            </div>
          )}

          {!loading && items.length > 0 && (
            <>
              <div className="results-header">
                <p className="results-count">
                  {filteredItems.length}{" "}
                  {filteredItems.length === 1 ? "result" : "results"} found
                </p>
              </div>

              <div className="grid grid-4 marketplace-grid">
                {filteredItems.map((item, index) => (
                  <motion.div
                    className="marketplace-card card"
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div
                      className="card-image"
                      style={{
                        backgroundImage: `url(${item.image || "/3593491.jpg"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />

                    <div className="card-header">
                      <p className="file-category">{item.category}</p>
                      <span className="material-badge">{item.material}</span>
                    </div>

                    <h3 className="file-name">{item.name}</h3>

                    <div className="rating">
                      <span>★★★★★</span>
                      <span className="rating-count">({item.orders || 0})</span>
                    </div>

                    <p className="file-description">{item.description}</p>

                    <div className="file-meta">
                      <span>🖨️ {item.printTime || "TBD"}</span>
                      <span>📦 {item.orders || 0}+ orders</span>
                    </div>

                    <div className="delivery-badge">
                      {item.rushAvailable ? "⚡ Rush Available" : "📦 Standard Delivery"}
                    </div>

                    <div className="card-footer">
                      <div className="file-price">
                        <span className="file-price-currency">KES</span>{" "}
                        {Number(item.price || 0).toLocaleString()}
                      </div>
                      <button className="btn btn-primary" onClick={() => handleAdd(item)}>
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredItems.length === 0 && items.length > 0 && (
                <div className="alert alert-warning">
                  No items match your search. Try adjusting your filters or search text.
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
                  Have your own design?
                </p>
                <Link to="/design-services" className="btn btn-secondary">
                  Upload Custom STL File
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default PrintingMarketplace;