//main script that ties all elements together
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Create from './pages/Create';
import Profile from './pages/Profile';
import Message from './pages/Message'

function App() {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem('marketItems')) || [];
  });

  useEffect(() => {
    localStorage.setItem('marketItems', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => setItems([...items, item]);
  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <Router>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home items={items} onDelete={deleteItem} />} />
          <Route path="/create" element={<Create onAdd={addItem} />} />
          <Route path="/message" element={<Message />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
