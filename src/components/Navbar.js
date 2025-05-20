//script for the navbar at top of webpage
//wishlist currently redirects to message page since that component hasnt been added yet
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={navStyle}>
      <div>
        <span style={logoTextStyle}>Bronco Bazaar</span>
      </div>
      <div>
        <Link to="/home" style={linkStyle}>Home</Link>
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
  background: '#283618',
  color: 'white',
};

const logoTextStyle = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.5rem',
};

const linkStyle = {
  marginLeft: '1rem',
  color: 'white',
  textDecoration: 'none',
};

/*import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false);

  const handleLinkClick = () => {
    setIsHovered(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <nav style={navStyle}>
        <span style={logoTextStyle}>Bronco Bazaar</span>

        <div
          style={hamburgerContainer}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div style={hamburgerLine}></div>
          <div style={hamburgerLine}></div>
          <div style={hamburgerLine}></div>
        </div>
      </nav>

      {isHovered && (
        <div
          style={overlayStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link to="/home" style={overlayLinkStyle} onClick={handleLinkClick}>Home</Link>
          <Link to="/create" style={overlayLinkStyle} onClick={handleLinkClick}>Create Offer</Link>
          <Link to="/message" style={overlayLinkStyle} onClick={handleLinkClick}>Messages</Link>
          <Link to="/wishlist" style={overlayLinkStyle} onClick={handleLinkClick}>Wishlist</Link>
          <Link to="/profile" style={overlayLinkStyle} onClick={handleLinkClick}>Profile</Link>
        </div>
      )}
    </div>
  );
}


// Styling
const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem',
  background: '#283618',
  color: 'white',
  zIndex: 2,
  position: 'relative',
};

const logoTextStyle = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.2rem',
};

const hamburgerContainer = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '30px',
  height: '20px',
  cursor: 'pointer',
};

const hamburgerLine = {
  height: '4px',
  background: 'white',
  borderRadius: '2px',
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: '100vw',
  backgroundColor: 'rgba(0, 0, 0, 0.95)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
};

const overlayLinkStyle = {
  color: 'white',
  fontSize: '2rem',
  margin: '1rem 0',
  textDecoration: 'none',
};
*/