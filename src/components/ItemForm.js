import React, { useState } from 'react';

export default function ItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    onAdd({ name, price, description, image });
    setName('');
    setPrice('');
    setDescription('');
    setImage(null);
    e.target.reset();

  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);  // store the first selected file
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
      //backgroundColor: '#f9f9f9',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          //backgroundColor: 'white',
          backgroundColor: '#283618',
          borderRadius: '12px',
          //boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          color: 'white',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Create Offer</h2>

        <label>Item Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />

        <label>Price ($):</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          placeholder="e.g. This item is very cool and is an item for sale"
          required
          style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
        />

        <label>Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ color: 'white' }}
        />


        <button
          type="submit"
          style={{
            padding: '0.75rem',
            border: 'none',
            borderRadius: '999px',
            //backgroundColor: '#4CAF50',
            backgroundColor: '#606c38',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#8d9e54')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#606c38')}
        >
          Post Offer
        </button>
      </form>
    </div>
  );
}
