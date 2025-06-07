// src/App.js

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Firebase imports
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

// Component imports
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import Message from "./pages/Message";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";

function App() {
  // State to hold all public listings (live updates via Firestore onSnapshot)
  const [listings, setListings] = useState([]);

  // User's wishlist, loaded once on login
  const [wishlist, setWishlist] = useState([]);

  // Authentication and loading state flags
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // Listener unsubscribe function for real-time listing updates
  let listingsUnsubscribe = null;

  // -------------------------------
  // 1. Authentication and Firestore sync
  // -------------------------------
  useEffect(() => {
    // Set up listener for auth state change
    const unsubscribeAuth = onAuthStateChange(async (currentUser) => {
      if (currentUser) {
        // Ensure user document exists in /users/{uid}
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

        // Fetch wishlist once
        setLoadingData(true);
        await fetchWishlist(currentUser.uid);

        // Set up real-time listener for /listings
        const listingsRef = collection(db, "listings");
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
        // If user signs out, reset state and unsubscribe from listings
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

    // Cleanup on unmount
    return () => {
      unsubscribeAuth();
      if (listingsUnsubscribe) listingsUnsubscribe();
    };
  }, []);

  // -------------------------------
  // 2a. Fetch wishlist once on login
  // -------------------------------
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

  // -------------------------------
  // 3. Add item to public listings
  // -------------------------------
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
      // Listings state is updated automatically via onSnapshot
    } catch (err) {
      console.error("Error adding public listing:", err);
    }
  };

  // -------------------------------
  // 4. Delete a public listing (if user is the owner)
  // -------------------------------
  const deleteItem = async (listingId) => {
    if (!user) return;
    try {
      const listDocRef = doc(db, "listings", listingId);
      const snap = await getDoc(listDocRef);
      if (snap.exists() && snap.data().ownerUid === user.uid) {
        await deleteDoc(listDocRef);
        // onSnapshot will auto-update state
      } else {
        console.warn("Cannot delete listing: not owner or does not exist.");
      }
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  // -------------------------------
  // 5. Add item to user's wishlist
  // -------------------------------
  const addToWishlist = async (itemData) => {
    if (!user) return;
    if (wishlist.some((w) => w.id === itemData.id)) return; // Prevent duplicates
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

  // -------------------------------
  // 6. Remove item from wishlist
  // -------------------------------
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

  // -------------------------------
  // 7. UI: Show loading screen while auth/data loads
  // -------------------------------
  if (loadingAuth || loadingData) {
    return <div>Loading...</div>;
  }

  // -------------------------------
  // 8. Routing logic and protected pages
  // -------------------------------
  return (
    <Router>
      <Navbar user={user} />
      <div style={{ padding: "2rem" }}>
        <Routes>
          {/* Root route: show login if not signed in, else redirect to home */}
          <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />

          {/* Home page: show all listings, allow delete and wishlist */}
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

          {/* Create listing page */}
          <Route
            path="/create"
            element={user ? <Create onAdd={addItem} /> : <Navigate to="/" />}
          />

          {/* Messages page */}
          <Route
            path="/message"
            element={user ? <Message /> : <Navigate to="/" />}
          />

          {/* Profile page */}
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/" />}
          />

          {/* Wishlist page */}
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