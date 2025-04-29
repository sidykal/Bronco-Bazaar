//script for listing items for sale on main page
import React from 'react';


//function for adding posts to page
//lists the items available with the given structure and elements
//make offer button currently does nothing (this is button to send msg to poster)
export default function ItemList({ items, onDelete }) {
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
          <button style={offerStyle}>
            Make Offer
          </button>
        </li>
      ))}
    </ul>
  );
}
// make offer button currently does nothing

//css styling for elements
const listStyle = {
  padding: 0,
  listStyleType: 'none',
};

const itemStyle = {
  background: '#edebe7',
  border: '1px solid black',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem'
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
    cursor: 'pointer',
    //margin: '0.25rem'
};