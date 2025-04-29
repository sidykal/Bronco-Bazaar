//script for form to post item for sale
import React, { useState } from 'react';

export default function ItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    onAdd({ name, price, description });
    setName('');
    setPrice('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
      <label>Item Name:</label>
      <input value={name} onChange={(e) => setName(e.target.value)} required />

      <label>Price ($):</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="3"
        placeholder="e.g. This item is very cool and is an item for sale"
        required
        />


      <button type="submit" style={{ marginTop: '1rem' }}>Post Offer</button>
    </form>
  );
}
