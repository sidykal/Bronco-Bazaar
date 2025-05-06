import React, { useState } from 'react';

export default function ItemList({ items, onDelete, onWishlist }) {
  // Track wishlist status for each item
  const [wishlistStatus, setWishlistStatus] = useState(
    items.reduce((status, item) => {
      status[item.name] = false; // Default to not in wishlist
      return status;
    }, {})
  );

  const handleWishlistClick = (item) => {
    const updatedStatus = { ...wishlistStatus, [item.name]: !wishlistStatus[item.name] };
    setWishlistStatus(updatedStatus);
    onWishlist(item); // Call onWishlist to add to global wishlist
  };

  if (items.length === 0) return <p>There are no offers at this time.</p>;

  return (
    <ul style={listStyle}>
      {items.map((item, index) => (
        <li key={index} style={itemStyle}>
          <strong>{item.name}</strong> – ${item.price}
          <p style={descriptionStyle}>{item.description}</p>
          <button onClick={() => onDelete(index)} style={deleteStyle}>
            Delete
          </button>
          <button style={offerStyle}>Make Offer</button>

          
          <button
            onClick={() => handleWishlistClick(item)}
            style={wishlistStatus[item.name] ? { ...wishlistButtonStyle, backgroundColor: '#4CAF50' } : wishlistButtonStyle}
          >
            {wishlistStatus[item.name] ? 'Wishlisted!' : 'Add to Wishlist'}
          </button>
        </li>
      ))}
    </ul>
  );
}

const listStyle = {
  padding: 0,
  listStyleType: 'none',
};

const itemStyle = {
  background: '#edebe7',
  border: '1px solid black',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',
};

const descriptionStyle = {
  margin: '0.5rem 0',
};

const deleteStyle = {
  background: 'red',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  margin: '0.25rem',
};

const offerStyle = {
  background: 'green',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
};

const wishlistButtonStyle = {
  background: '#f0ad4e',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  margin: '0.25rem',
};
