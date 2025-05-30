import React from 'react';

export default function Wishlist({ wishlist, onRemove }) {
  return (
    <div>
      <h2>Your Wishlist</h2>
      {/* Check if wishlist is empty */}
      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <ul style={listStyle}>
          {wishlist.map((item, index) => (
            <li key={index} style={itemStyle}>
              <strong>{item.name}</strong> – ${item.price}
              <p>{item.description}</p>
              {/* Remove from wishlist button */}
              <button onClick={() => onRemove(item)} style={removeStyle}>
                Remove from Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Styles for the list items and remove button
const itemStyle = {
  /*background: '#edebe7',
  border: '1px solid black',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',*/
  background: '#283618',
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

const removeStyle = {
  background: '#bc6c25',
  color: 'white',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '0.5rem',
};

const listStyle = {
    /*padding: 0,
    listStyleType: 'none',*/
    columnCount: 3,
    columnGap: '1rem',
    padding: '1rem',
  };
