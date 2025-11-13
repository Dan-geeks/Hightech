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

function Admin() {
  const [user, setUser] = useState(null);

  // login form
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  // DXF files
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

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

    const q = query(collection(db, "dxfFiles"), orderBy("name"));
    const unsubFiles = onSnapshot(
      q,
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

    return () => {
      unsubAuth();
      unsubFiles();
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
    setForm(emptyFile);
  };

  // --- DXF edit handlers ---
  const startNew = () => {
    setEditingId(null);
    setForm(emptyFile);
  };

  const startEdit = (file) => {
    setEditingId(file.id);
    setForm({
      name: file.name || "",
      price: file.price || 0,
      description: file.description || "",
      image: file.image || "",
      complexity: file.complexity || "Beginner",
      format: file.format || "DXF",
      downloads: file.downloads || 0,
      rating: file.rating || 4.5,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (["price", "downloads", "rating"].includes(name)) {
      v = Number(value);
    }
    setForm((prev) => ({ ...prev, [name]: v }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        await updateDoc(doc(db, "dxfFiles", editingId), form);
      } else {
        await addDoc(collection(db, "dxfFiles"), form);
      }

      setEditingId(null);
      setForm(emptyFile);
    } catch (err) {
      console.error(err);
      alert("Error saving DXF file: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this DXF file?")) return;
    try {
      await deleteDoc(doc(db, "dxfFiles", id));
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyFile);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting DXF file: " + err.message);
    }
  };

  // --- image upload handler ---
  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const storagePath = `dxfImages/${Date.now()}_${file.name}`;
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
              Log in with the High Tech admin email to manage DXF files and
              pricing.
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
  return (
    <div className="admin page">
      <div className="container">
        <div className="admin-header">
          <div>
            <p className="eyebrow">ADMIN PANEL</p>
            <h1 className="section-title">DXF Management</h1>
            <p className="section-subtitle">
              View and edit existing DXF files. Updates go live instantly on
              the marketplace.
            </p>
          </div>
          <div className="admin-header-actions">
            <span className="admin-user-email">{user.email}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>

        <div className="admin-layout">
          {/* LEFT: existing DXF list */}
          <motion.div
            className="card admin-list-card"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="admin-list-header">
              <h2>Existing DXF Files</h2>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={startNew}
              >
                + New DXF File
              </button>
            </div>

            {loadingFiles ? (
              <div className="loading">
                <div className="spinner" />
              </div>
            ) : files.length === 0 ? (
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                }}
              >
                No DXF files yet. Click “New DXF File” to add your first one.
              </p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price (KES)</th>
                      <th>Downloads</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr
                        key={file.id}
                        className={editingId === file.id ? "active" : ""}
                      >
                        <td>{file.name}</td>
                        <td>
                          {Number(file.price || 0).toLocaleString("en-KE")}
                        </td>
                        <td>{file.downloads || 0}</td>
                        <td className="admin-table-actions">
                          <button
                            type="button"
                            className="admin-link-button"
                            onClick={() => startEdit(file)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="admin-link-button danger"
                            onClick={() => handleDelete(file.id)}
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
          >
            <h2>{editingId ? "Edit DXF File" : "New DXF File"}</h2>
            <p className="section-subtitle" style={{ marginBottom: "1rem" }}>
              Change the name, price, description and image for your files.
            </p>

            <form className="admin-form" onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label" htmlFor="dxf-name">
                  Name
                </label>
                <input
                  id="dxf-name"
                  name="name"
                  className="form-input"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dxf-price">
                  Price (KES)
                </label>
                <input
                  id="dxf-price"
                  name="price"
                  type="number"
                  min="0"
                  className="form-input"
                  value={form.price}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="dxf-description">
                  Description
                </label>
                <textarea
                  id="dxf-description"
                  name="description"
                  className="form-textarea"
                  value={form.description}
                  onChange={handleFormChange}
                />
              </div>

              {/* Image upload */}
              <div className="form-group">
                <label className="form-label" htmlFor="dxf-image-file">
                  Image (upload from device)
                </label>
                <input
                  id="dxf-image-file"
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
                      This image URL is stored with the DXF file.
                    </p>
                  </div>
                )}
              </div>

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
                    placeholder="DXF, DXF + PDF, DXF + SVG"
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

              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save DXF File"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
