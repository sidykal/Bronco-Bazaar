// src/pages/Wishlist.js

import React from "react";

/**
 * Wishlist page component that displays all items saved by the user.
 * Allows the user to remove items from the wishlist or initiate an offer.
 *
 * @param {Object[]} wishlist - Array of wishlist item objects
 * @param {function} onRemove - Function to call when an item is removed from the wishlist
 */
export default function Wishlist({ wishlist, onRemove }) {
  return (
    <div>
      <h2>Your Wishlist</h2>

      {/* Conditional rendering: show message if wishlist is empty */}
      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <ul style={listStyle}>
          {wishlist.map((item) => (
            <li key={item.id} style={itemStyle}>
              {/* Display item image if present and valid */}
              {typeof item.image === "string" && item.image.trim() !== "" && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                  }}
                />
              )}

              {/* Item title and price */}
              <strong>{item.name}</strong> – ${item.price}
              <p>{item.description}</p>

              {/* Remove item from wishlist */}
              <button
                onClick={() => onRemove(item.id)}
                style={removeStyle}
              >
                Remove from Wishlist
              </button>

              {/* Placeholder for making an offer */}
              <button style={offerStyle}>Make Offer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --------------------------
// Inline CSS styling objects
// --------------------------

// Style for each wishlist item card
const itemStyle = {
  background: "#283618",
  borderRadius: "8px",
  padding: "1rem",
  marginBottom: "1rem",
  color: "white",
  breakInside: "avoid",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  maxWidth: "100%",
  boxSizing: "border-box",
};

// Style for the "Remove from Wishlist" button
const removeStyle = {
  background: "#bc6c25",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "0.5rem",
};

// Style for the "Make Offer" button
const offerStyle = {
  background: "#606c38",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "0.5rem",
};

// CSS for arranging items into columns
const listStyle = {
  columnCount: 3,
  columnGap: "1rem",
  padding: "1rem",
};