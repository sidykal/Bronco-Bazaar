import React from 'react';

export default function Wishlist({ wishlist, onRemove }) {
  return (
    <div>
      <h2>Your Wishlist</h2>
      
      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <ul style={listStyle}>
          {wishlist.map((item, index) => (
            <li key={index} style={itemStyle}>
              <strong>{item.name}</strong> – ${item.price}
              <p>{item.description}</p>
              
              <button onClick={() => onRemove(item)} style={removeStyle}>
                Remove from Wishlist
              </button>
              <button style={offerStyle}>
                Make Offer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Styles for the list items and remove button

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

const removeStyle = {
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

