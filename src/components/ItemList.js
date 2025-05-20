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

  if (items.length === 0)
  return (
    <div style={noItemsContainerStyle}>
      <p style={noItemsTextStyle}>There are no offers at this time.</p>
    </div>
  );


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
  /*padding: 0,
  listStyleType: 'none',
  //3 per row
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',  // 3 equal columns
  gap: '1rem',                            // space between items
  */
  columnCount: 3,
  columnGap: '1rem',
  padding: '1rem',
};

const itemStyle = {
  //background: '#edebe7',
  background: '#283618',
  //border: '1px solid black',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',
  color: 'white',
  breakInside: 'avoid',
  wordWrap: 'break-word',       
  overflowWrap: 'break-word',   
  maxWidth: '100%',             
  boxSizing: 'border-box',
};

const descriptionStyle = {
  margin: '0.5rem 0',
  color: 'white',
};

const deleteStyle = {
  //background: 'red',
  background: '#bc6c25',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  margin: '0.25rem',
};

const offerStyle = {
  //background: 'green',
  background: '#606c38',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
};

const wishlistButtonStyle = {
  //background: '#f0ad4e',
  background: '#dda15e',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  margin: '0.25rem',
};

const noItemsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80px',
  width: '500px',
  backgroundColor: '#283618',
  borderRadius: '12px',
  margin: '5rem auto',  // This centers horizontally by setting left & right margins to auto
};


const noItemsTextStyle = {
  color: 'white',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  textAlign: 'center',
};
