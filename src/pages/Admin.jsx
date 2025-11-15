// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Admin.css";
import { auth, db, storage } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const emptyFile = {
  name: "",
  price: 0,
  description: "",
  image: "",
  complexity: "Beginner",
  format: "DXF",
  downloads: 0,
  rating: 4.5,
};

const emptyPrintItem = {
  name: "",
  price: 0,
  description: "",
  image: "",
  category: "Figurines",
  material: "PLA",
  printTime: "2-3 days",
  orders: 0,
  rating: 4.5,
  rushAvailable: false,
};

function Admin() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dxf");

  // login form
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  // DXF files
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  // 3D Printing items
  const [printItems, setPrintItems] = useState([]);
  const [loadingPrintItems, setLoadingPrintItems] = useState(true);

  // edit form
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyFile);
  const [saving, setSaving] = useState(false);

  // image upload
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- auth + data listeners ---
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
    });

    // DXF Files listener
    const qFiles = query(collection(db, "dxfFiles"), orderBy("name"));
    const unsubFiles = onSnapshot(
      qFiles,
      (snap) => {
        const docs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setFiles(docs);
        setLoadingFiles(false);
      },
      (err) => {
        console.error("Error loading dxfFiles:", err);
        setLoadingFiles(false);
      }
    );

    // 3D Printing Items listener
    const qPrint = query(collection(db, "printingItems"), orderBy("name"));
    const unsubPrint = onSnapshot(
      qPrint,
      (snap) => {
        const docs = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setPrintItems(docs);
        setLoadingPrintItems(false);
      },
      (err) => {
        console.error("Error loading printingItems:", err);
        setLoadingPrintItems(false);
      }
    );

    return () => {
      unsubAuth();
      unsubFiles();
      unsubPrint();
    };
  }, []);

  // --- login handlers ---
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, login.email, login.password);
    } catch (err) {
      console.error(err);
      setLoginError("Login failed. Check email & password.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setEditingId(null);
    setForm(activeTab === "dxf" ? emptyFile : emptyPrintItem);
  };

  // --- edit handlers ---
  const startNew = () => {
    setEditingId(null);
    setForm(activeTab === "dxf" ? emptyFile : emptyPrintItem);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    if (activeTab === "dxf") {
      setForm({
        name: item.name || "",
        price: item.price || 0,
        description: item.description || "",
        image: item.image || "",
        complexity: item.complexity || "Beginner",
        format: item.format || "DXF",
        downloads: item.downloads || 0,
        rating: item.rating || 4.5,
      });
    } else {
      setForm({
        name: item.name || "",
        price: item.price || 0,
        description: item.description || "",
        image: item.image || "",
        category: item.category || "Figurines",
        material: item.material || "PLA",
        printTime: item.printTime || "2-3 days",
        orders: item.orders || 0,
        rating: item.rating || 4.5,
        rushAvailable: item.rushAvailable || false,
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    let v = value;
    
    if (type === "checkbox") {
      v = checked;
    } else if (["price", "downloads", "orders", "rating"].includes(name)) {
      v = Number(value);
    }
    
    setForm((prev) => ({ ...prev, [name]: v }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const collectionName = activeTab === "dxf" ? "dxfFiles" : "printingItems";

    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), form);
      } else {
        await addDoc(collection(db, collectionName), form);
      }

      setEditingId(null);
      setForm(activeTab === "dxf" ? emptyFile : emptyPrintItem);
    } catch (err) {
      console.error(err);
      alert(`Error saving ${activeTab === "dxf" ? "DXF file" : "printing item"}: ` + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const collectionName = activeTab === "dxf" ? "dxfFiles" : "printingItems";
    const itemType = activeTab === "dxf" ? "DXF file" : "printing item";
    
    if (!window.confirm(`Delete this ${itemType}?`)) return;
    
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (editingId === id) {
        setEditingId(null);
        setForm(activeTab === "dxf" ? emptyFile : emptyPrintItem);
      }
    } catch (err) {
      console.error(err);
      alert(`Error deleting ${itemType}: ` + err.message);
    }
  };

  // --- image upload handler ---
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const folderName = activeTab === "dxf" ? "dxfImages" : "printingImages";
    const storagePath = `${folderName}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploading(true);
    setUploadProgress(0);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error("Image upload error:", error);
        alert("Error uploading image: " + error.message);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setForm((prev) => ({ ...prev, image: downloadURL }));
        setUploading(false);
      }
    );
  };

  // Switch tab handler
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setEditingId(null);
    setForm(tab === "dxf" ? emptyFile : emptyPrintItem);
  };

  // --- LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="admin page">
        <div className="container">
          <motion.div
            className="card admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="eyebrow">ADMIN</p>
            <h1 className="section-title">Admin Login</h1>
            <p className="section-subtitle">
              Log in with the High Tech admin email to manage DXF files and 3D printing items.
            </p>

            {loginError && (
              <div className="alert alert-error">{loginError}</div>
            )}

            <form className="admin-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-email">
                  Email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={login.email}
                  onChange={handleLoginChange}
                  placeholder="hightechengineering609@gmail.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-password">
                  Password
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  className="form-input"
                  value={login.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••••••"
                />
              </div>

              <button className="btn btn-primary" type="submit">
                Log In
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  const currentItems = activeTab === "dxf" ? files : printItems;
  const currentLoading = activeTab === "dxf" ? loadingFiles : loadingPrintItems;

  return (
    <div className="admin page">
      <div className="container">
        <div className="admin-header">
          <div>
            <p className="eyebrow">ADMIN PANEL</p>
            <h1 className="section-title">Product Management</h1>
            <p className="section-subtitle">
              Manage DXF files and 3D printing items. Updates go live instantly.
            </p>
          </div>
          <div className="admin-header-actions">
            <span className="admin-user-email">{user.email}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "dxf" ? "active" : ""}`}
            onClick={() => handleTabSwitch("dxf")}
          >
            📄 DXF Files
          </button>
          <button
            className={`admin-tab ${activeTab === "printing" ? "active" : ""}`}
            onClick={() => handleTabSwitch("printing")}
          >
            🖨️ 3D Printing
          </button>
        </div>

        <div className="admin-layout">
          {/* LEFT: existing items list */}
          <motion.div
            className="card admin-list-card"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            key={activeTab}
          >
            <div className="admin-list-header">
              <h2>{activeTab === "dxf" ? "DXF Files" : "3D Printing Items"}</h2>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={startNew}
              >
                + New {activeTab === "dxf" ? "DXF" : "Print Item"}
              </button>
            </div>

            {currentLoading ? (
              <div className="loading">
                <div className="spinner" />
              </div>
            ) : currentItems.length === 0 ? (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                No items yet. Click "New {activeTab === "dxf" ? "DXF" : "Print Item"}" to add your first one.
              </p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price (KES)</th>
                      <th>{activeTab === "dxf" ? "Downloads" : "Orders"}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr
                        key={item.id}
                        className={editingId === item.id ? "active" : ""}
                      >
                        <td>{item.name}</td>
                        <td>
                          {Number(item.price || 0).toLocaleString("en-KE")}
                        </td>
                        <td>{activeTab === "dxf" ? (item.downloads || 0) : (item.orders || 0)}</td>
                        <td className="admin-table-actions">
                          <button
                            type="button"
                            className="admin-link-button"
                            onClick={() => startEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="admin-link-button danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* RIGHT: edit form */}
          <motion.div
            className="card admin-form-card"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            key={activeTab + editingId}
          >
            <h2>{editingId ? "Edit" : "New"} {activeTab === "dxf" ? "DXF File" : "Print Item"}</h2>
            <p className="section-subtitle" style={{ marginBottom: "1rem" }}>
              {activeTab === "dxf" 
                ? "Manage DXF file details, pricing, and images."
                : "Manage 3D printing item details, materials, and pricing."}
            </p>

            <form className="admin-form" onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label" htmlFor="item-name">
                  Name
                </label>
                <input
                  id="item-name"
                  name="name"
                  className="form-input"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="item-price">
                  Price (KES)
                </label>
                <input
                  id="item-price"
                  name="price"
                  type="number"
                  min="0"
                  className="form-input"
                  value={form.price}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="item-description">
                  Description
                </label>
                <textarea
                  id="item-description"
                  name="description"
                  className="form-textarea"
                  value={form.description}
                  onChange={handleFormChange}
                />
              </div>

              {/* Image upload */}
              <div className="form-group">
                <label className="form-label" htmlFor="item-image-file">
                  Image (upload from device)
                </label>
                <input
                  id="item-image-file"
                  type="file"
                  accept="image/*"
                  className="form-input"
                  onChange={handleImageUpload}
                />
                {uploading && (
                  <div className="upload-progress">
                    Uploading… {uploadProgress}%
                  </div>
                )}
                {form.image && !uploading && (
                  <div className="image-preview">
                    <img src={form.image} alt="Preview" />
                    <p className="image-preview-text">
                      This image is stored in Firebase Storage.
                    </p>
                  </div>
                )}
              </div>

              {activeTab === "dxf" ? (
                // DXF-specific fields
                <>
                  <div className="admin-inline-group">
                    <div className="form-group">
                      <label className="form-label" htmlFor="dxf-complexity">
                        Complexity
                      </label>
                      <select
                        id="dxf-complexity"
                        name="complexity"
                        className="form-select"
                        value={form.complexity}
                        onChange={handleFormChange}
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="dxf-format">
                        Format
                      </label>
                      <input
                        id="dxf-format"
                        name="format"
                        className="form-input"
                        value={form.format}
                        onChange={handleFormChange}
                        placeholder="DXF, DXF + PDF"
                      />
                    </div>
                  </div>

                  <div className="admin-inline-group">
                    <div className="form-group">
                      <label className="form-label" htmlFor="dxf-downloads">
                        Downloads
                      </label>
                      <input
                        id="dxf-downloads"
                        name="downloads"
                        type="number"
                        min="0"
                        className="form-input"
                        value={form.downloads}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="dxf-rating">
                        Rating
                      </label>
                      <input
                        id="dxf-rating"
                        name="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        className="form-input"
                        value={form.rating}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>
                </>
              ) : (
                // 3D Printing-specific fields
                <>
                  <div className="admin-inline-group">
                    <div className="form-group">
                      <label className="form-label" htmlFor="print-category">
                        Category
                      </label>
                      <select
                        id="print-category"
                        name="category"
                        className="form-select"
                        value={form.category}
                        onChange={handleFormChange}
                      >
                        <option>Figurines</option>
                        <option>Functional Parts</option>
                        <option>Decorative</option>
                        <option>Miniatures</option>
                        <option>Tools</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="print-material">
                        Material
                      </label>
                      <select
                        id="print-material"
                        name="material"
                        className="form-select"
                        value={form.material}
                        onChange={handleFormChange}
                      >
                        <option>PLA</option>
                        <option>PETG</option>
                        <option>ABS</option>
                        <option>Resin</option>
                        <option>Nylon</option>
                      </select>
                    </div>
                  </div>

                  <div className="admin-inline-group">
                    <div className="form-group">
                      <label className="form-label" htmlFor="print-time">
                        Print Time
                      </label>
                      <input
                        id="print-time"
                        name="printTime"
                        className="form-input"
                        value={form.printTime}
                        onChange={handleFormChange}
                        placeholder="2-3 days"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="print-orders">
                        Orders
                      </label>
                      <input
                        id="print-orders"
                        name="orders"
                        type="number"
                        min="0"
                        className="form-input"
                        value={form.orders}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="admin-inline-group">
                    <div className="form-group">
                      <label className="form-label" htmlFor="print-rating">
                        Rating
                      </label>
                      <input
                        id="print-rating"
                        name="rating"
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        className="form-input"
                        value={form.rating}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="print-rush">
                        <input
                          id="print-rush"
                          name="rushAvailable"
                          type="checkbox"
                          checked={form.rushAvailable}
                          onChange={handleFormChange}
                          style={{ marginRight: "0.5rem" }}
                        />
                        Rush Available
                      </label>
                    </div>
                  </div>
                </>
              )}

              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : `Save ${activeTab === "dxf" ? "DXF File" : "Print Item"}`}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Admin;