// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVi3eUeQyBVog_CGEvK_OwO41-QxklwZc",
  authDomain: "stkpush-cff51.firebaseapp.com",
  databaseURL: "https://stkpush-cff51-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "stkpush-cff51",
  storageBucket: "stkpush-cff51.firebasestorage.app",
  messagingSenderId: "567137630101",
  appId: "1:567137630101:web:4192be18f4f0d80631289c",
  measurementId: "G-978VDMBYQE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
