// src/firebase.js

// Import core Firebase modules needed to initialize the app
import { initializeApp } from "firebase/app";

// Import Firebase Authentication modules
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// Import Firestore (Cloud NoSQL database) and Cloud Storage
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase project configuration object
// These values are specific to your Firebase project and enable connection to its services
const firebaseConfig = {
  apiKey: "AIzaSyCLUo0Vm-Hc1kA3E1_Oku2pL5GKyY2VeOA",
  authDomain: "bronco-bazaar.firebaseapp.com",
  projectId: "bronco-bazaar",
  storageBucket: "bronco-bazaar.firebasestorage.app",
  messagingSenderId: "1096317072060",
  appId: "1:1096317072060:web:02ab23a60821ddd0f796b9",
  measurementId: "G-17N1HYHZSZ",
};

// Initialize the Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and set up Google sign-in
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Restrict sign-in to users with "@scu.edu" Google accounts
provider.setCustomParameters({ hd: "scu.edu" });

// Export authentication and Google provider for use in other modules (e.g., Login.js)
export { auth, provider };

// -------------------------
// Authentication Functions
// -------------------------

/**
 * Initiates the Google sign-in popup.
 * @returns {Promise<UserCredential>} A promise containing the authenticated user's credentials.
 */
export function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}

/**
 * Signs out the currently authenticated user.
 * @returns {Promise<void>} A promise indicating completion of the sign-out process.
 */
export function signOutGoogle() {
  return signOut(auth);
}

/**
 * Sets up a listener for changes to the authentication state.
 * @param {function(Object|null):void} callback - Function called with the user's info when signed in, or null when signed out.
 * @returns {Unsubscribe} A function to unsubscribe the listener.
 */
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const { uid, displayName, email, photoURL } = firebaseUser;
      callback({ uid, displayName, email, photoURL });
    } else {
      callback(null);
    }
  });
}

// -------------------------
// Firestore & Storage
// -------------------------

// Export initialized Firestore database instance
export const db = getFirestore(app);

// Export initialized Firebase Storage instance
export const storage = getStorage(app);