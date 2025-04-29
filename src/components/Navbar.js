//script for the navbar at top of webpage
//wishlist currently redirects to message page since that component hasnt been added yet
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={navStyle}>
      <div>
        <span style={logoTextStyle}>SCU Bronco Bazaar</span>
      </div>
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/create" style={linkStyle}>Create Offer</Link>
        <Link to="/message" style={linkStyle}>Messages</Link>
        <Link to="/message" style={linkStyle}>Wishlist</Link>
        <Link to="/profile" style={linkStyle}>Profile</Link>
      </div>
    </nav>
  );
}

//css styling
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  background: '#333',
  color: 'white',
};

const logoTextStyle = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.2rem',
};

const linkStyle = {
  marginLeft: '1rem',
  color: 'white',
  textDecoration: 'none',
};
