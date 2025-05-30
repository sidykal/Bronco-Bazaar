import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // make sure you have this set up
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Create from './pages/Create';
import Profile from './pages/Profile';
import Message from './pages/Message';
import Login from './pages/Login'; // new Login page
import Wishlist from './pages/Wishlist'; // import Wishlist page

function App() {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem('marketItems')) || [];
  });

  const [wishlist, setWishlist] = useState([]);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading while checking auth

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('marketItems', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => setItems([...items, item]);
  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const addToWishlist = (item) => {
    if (!wishlist.includes(item)) {
      setWishlist([...wishlist, item]);
    }
  };

  const removeFromWishlist = (item) => {
    const updatedWishlist = wishlist.filter((i) => i !== item);
    setWishlist(updatedWishlist);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/home" 
            element={user ? <Home items={items} onDelete={deleteItem} onWishlist={addToWishlist} /> : <Navigate to="/" />} 
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
            element={user ? <Wishlist wishlist={wishlist} onRemove={removeFromWishlist} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
