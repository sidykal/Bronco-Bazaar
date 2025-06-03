// src/App.js

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChange, auth, db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,      
  query,           
  orderBy,
  getDocs         
} from "firebase/firestore";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import Message from "./pages/Message";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";

function App() {
  // “listings” holds all public offers (real-time)
  const [listings, setListings] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Auth and loading states
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // Keep a reference to the unsubscribe function for listings listener
  let listingsUnsubscribe = null;

  // 1) Listen for Firebase Auth state, create /users/{uid} if needed,
  //    then set up real-time listener for public listings and fetch wishlist
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChange(async (currentUser) => {
      if (currentUser) {
        // Ensure the user's profile document exists
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            createdAt: new Date(),
          });
        }

        setUser(currentUser);

        // 2a) Fetch this user's wishlist once
        setLoadingData(true);
        await fetchWishlist(currentUser.uid);

        // 2b) Set up real-time listener for all public listings
        const listingsRef = collection(db, "listings");
        // (Optional) you could order by createdAt: 
        // const q = query(listingsRef, orderBy("createdAt", "desc"));
        // But here we’ll listen to the collection as-is:
        listingsUnsubscribe = onSnapshot(
          listingsRef,
          (snapshot) => {
            const fetched = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setListings(fetched);
            setLoadingData(false);
          },
          (error) => {
            console.error("Error listening to listings:", error);
            setLoadingData(false);
          }
        );
      } else {
        // No user signed in → clear state & tear down listener
        setUser(null);
        setWishlist([]);
        setListings([]);
        if (listingsUnsubscribe) {
          listingsUnsubscribe();
          listingsUnsubscribe = null;
        }
      }
      setLoadingAuth(false);
    });

    return () => {
      unsubscribeAuth();
      if (listingsUnsubscribe) listingsUnsubscribe();
    };
  }, []);

  // 2a) Fetch wishlist under /users/{uid}/wishlist (one-time)
  const fetchWishlist = async (uid) => {
    try {
      const wishlistRef = collection(db, "users", uid, "wishlist");
      const snap = await getDocs(wishlistRef);
      const fetchedWishlist = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlist(fetchedWishlist);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  // 3) Create a new public listing
  const addItem = async (itemData) => {
    if (!user) return;
    try {
      const listingsRef = collection(db, "listings");
      const docRef = await addDoc(listingsRef, {
        ownerUid: user.uid,
        ownerName: user.displayName || "",
        ...itemData,
        createdAt: new Date(),
      });
      // Because we have onSnapshot listening, setListings will be updated automatically.
    } catch (err) {
      console.error("Error adding public listing:", err);
    }
  };

  // 4) Delete a public listing (only if the current user is the owner)
  const deleteItem = async (listingId) => {
    if (!user) return;
    try {
      const listDocRef = doc(db, "listings", listingId);
      const snap = await getDoc(listDocRef);
      if (snap.exists() && snap.data().ownerUid === user.uid) {
        await deleteDoc(listDocRef);
        // onSnapshot listener will automatically remove it from state
      } else {
        console.warn("Cannot delete listing: not owner or does not exist.");
      }
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  // 5) Add an item to the user's wishlist under /users/{uid}/wishlist
  const addToWishlist = async (itemData) => {
    if (!user) return;
    if (wishlist.some((w) => w.id === itemData.id)) return;
    try {
      const wishlistRef = collection(db, "users", user.uid, "wishlist");
      const docRef = await addDoc(wishlistRef, {
        ...itemData,
        addedAt: new Date(),
      });
      setWishlist((prev) => [
        ...prev,
        { id: docRef.id, ...itemData, addedAt: new Date() },
      ]);
    } catch (err) {
      console.error("Error adding to wishlist:", err);
    }
  };

  // 6) Remove an item from the user's wishlist
  const removeFromWishlist = async (wishId) => {
    if (!user) return;
    try {
      const wishDocRef = doc(db, "users", user.uid, "wishlist", wishId);
      await deleteDoc(wishDocRef);
      setWishlist((prev) => prev.filter((w) => w.id !== wishId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  // Show a loading screen until auth + data have loaded
  if (loadingAuth || loadingData) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} />
      <div style={{ padding: "2rem" }}>
        <Routes>
          {/* If user is signed in, redirect “/” → “/home”; otherwise render Login */}
          <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />

          <Route
            path="/home"
            element={
              user ? (
                <Home
                  items={listings}
                  onDelete={deleteItem}
                  onWishlist={addToWishlist}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/create"
            element={user ? <Create onAdd={addItem} /> : <Navigate to="/" />}
          />

          <Route
            path="/message"
            element={user ? <Message /> : <Navigate to="/" />}
          />

          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/" />}
          />

          <Route
            path="/wishlist"
            element={
              user ? (
                <Wishlist wishlist={wishlist} onRemove={removeFromWishlist} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
