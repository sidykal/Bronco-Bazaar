// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCLUo0Vm-Hc1kA3E1_Oku2pL5GKyY2VeOA",
  authDomain: "bronco-bazaar.firebaseapp.com",
  projectId: "bronco-bazaar",
  storageBucket: "bronco-bazaar.firebasestorage.app",
  messagingSenderId: "1096317072060",
  appId: "1:1096317072060:web:02ab23a60821ddd0f796b9",
  measurementId: "G-17N1HYHZSZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ hd: "scu.edu" });

// Export the provider so Login.js can import it:
export { auth, provider };

// Auth helpers
export function signInWithGoogle() {
  return signInWithPopup(auth, provider);
}
export function signOutGoogle() {
  return signOut(auth);
}
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

// Firestore export
export const db = getFirestore(app);
export const storage = getStorage(app);