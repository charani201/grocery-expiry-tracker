// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtbllicziOk4cHZgf2f1zTuwOtiVQsRcQ",
  authDomain: "grocery-expiry-reminder.firebaseapp.com",
  projectId: "grocery-expiry-reminder",
  storageBucket: "grocery-expiry-reminder.appspot.com",
  messagingSenderId: "228064263100",
  appId: "1:228064263100:web:9dfbc3441dc28bb70809b9",
  measurementId: "G-B78KF2X4HV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export Firebase modules
export { 
  db, auth, collection, addDoc, getDocs, query, where, serverTimestamp, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
  onAuthStateChanged, updateProfile 
};
