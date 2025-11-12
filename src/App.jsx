import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

// Pages
import HomePage from "./pages/HomePage";
import DXFMarketplace from "./pages/DXFMarketplace";
import DesignServices from "./pages/DesignServices";
import PrintingServices from "./pages/PrintingServices";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Router>
      <div className="App">
        <Header cartCount={cartCount} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dxf-marketplace" element={<DXFMarketplace addToCart={addToCart} />} />
            <Route path="/design-services" element={<DesignServices />} />
            <Route path="/3d-printing" element={<PrintingServices />} />
            <Route
              path="/cart"
              element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />}
            />
            <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

function Header({ cartCount, menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location, setMenuOpen]);

  return (
    <motion.header
      className={`header ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-container">
        <Link to="/" className="logo">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <span className="logo-text">HIGH TEC</span>
            <span className="logo-subtext">ENGINEERING</span>
          </motion.div>
        </Link>

        <button className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/dxf-marketplace" className="nav-link">
            DXF Files
          </Link>
          <Link to="/design-services" className="nav-link">
            Design Services
          </Link>
          <Link to="/3d-printing" className="nav-link">
            3D Printing
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}

export default App;

