import React, { useState } from 'react';
import ItemList from '../components/ItemList';

export default function Home({ items, onDelete, onWishlist }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.price.toString().includes(searchTerm)
  );

  return (
    <div>
      {/*<h2>Active Offers</h2>*/}

      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '0.5rem',
          width: '100%',
          marginBottom: '1rem',
          borderRadius: '10px',
          border: '1px solid #ccc',
          borderColor: "#283618",
        }}
      />

      <ItemList items={filteredItems} onDelete={onDelete} onWishlist={onWishlist} />
    </div>
  );
}
