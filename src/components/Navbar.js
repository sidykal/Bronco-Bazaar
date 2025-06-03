// src/components/Navbar.js

import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={navStyle}>
      <div>
        <span style={logoTextStyle}>Bronco Bazaar</span>
      </div>
      <div style={rightContainer}>
        <Link to="/home" style={linkStyle}>
          Home
        </Link>
        <Link to="/create" style={linkStyle}>
          Create Offer
        </Link>
        <Link to="/message" style={linkStyle}>
          Messages
        </Link>
        <Link to="/wishlist" style={linkStyle}>
          Wishlist
        </Link>
        <Link to="/profile" style={linkStyle}>
          Profile
        </Link>
      </div>
    </nav>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem",
  background: "#283618",
  color: "white",
};

const logoTextStyle = {
  color: "white",
  fontWeight: "bold",
  fontSize: "1.5rem",
};

const rightContainer = {
  display: "flex",
  alignItems: "center",
};

const linkStyle = {
  marginLeft: "1rem",
  color: "white",
  textDecoration: "none",
};
