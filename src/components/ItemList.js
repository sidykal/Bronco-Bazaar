// src/components/ItemList.js

import React, { useState, useEffect } from "react";
import { auth } from "../firebase"; // Firebase auth to get current user info

export default function ItemList({ items, onDelete, onWishlist, onOffer }) {
  // Track wishlist status per item using item ID as key
  const [wishlistStatus, setWishlistStatus] = useState({});

  // Get current logged-in user from Firebase Auth
  const currentUser = auth.currentUser;

  // Initialize wishlist status (all false) whenever items change
  useEffect(() => {
    const initialStatus = {};
    items.forEach((item) => {
      initialStatus[item.id] = false;
    });
    setWishlistStatus(initialStatus);
  }, [items]);

  // Toggle wishlist status and trigger parent handler
  const handleWishlistClick = (item) => {
    setWishlistStatus((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }));
    onWishlist(item);
  };

  // Display message when no items are available
  if (items.length === 0) {
    return (
      <div style={noItemsContainerStyle}>
        <p style={noItemsTextStyle}>There are no offers at this time.</p>
      </div>
    );
  }

  // Render the list of items
  return (
    <ul style={listStyle}>
      {items.map((item) => {
        // Determine if the item belongs to the current user
        const isOwnPost = currentUser && item.ownerUid === currentUser.uid;

        return (
          <li key={item.id} style={itemStyle}>
            {/* Conditionally render item image if valid */}
            {typeof item.image === "string" && item.image.trim() !== "" && (
              <img
                src={item.image}
                alt=""
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                }}
              />
            )}

            <strong>{item.name}</strong> – ${item.price}
            <p style={descriptionStyle}>{item.description}</p>

            {/* Show delete button only for user's own posts */}
            {isOwnPost && (
              <button onClick={() => onDelete(item.id)} style={deleteStyle}>
                Delete
              </button>
            )}

            {/* Show “Make Offer” button unless it’s your own post */}
            <button
              onClick={() => onOffer(item)}
              style={
                isOwnPost
                  ? { ...offerStyle, opacity: 0.5, cursor: "not-allowed" }
                  : offerStyle
              }
              disabled={isOwnPost}
            >
              {isOwnPost ? "Your Post" : "Make Offer"}
            </button>

            {/* Show wishlist button only for others’ posts */}
            {!isOwnPost && (
              <button
                onClick={() => handleWishlistClick(item)}
                style={
                  wishlistStatus[item.id]
                    ? { ...wishlistButtonStyle, backgroundColor: "#4CAF50" } // Highlighted if active
                    : wishlistButtonStyle
                }
              >
                {wishlistStatus[item.id] ? "Wishlisted!" : "Add to Wishlist"}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// Style for the unordered list layout using CSS columns
const listStyle = {
  columnCount: 3,
  columnGap: "1rem",
  padding: "1rem",
  listStyle: "none",
};

// Style for individual item cards
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

// Description text style
const descriptionStyle = {
  margin: "0.5rem 0",
  color: "white",
};

// Button styles
const deleteStyle = {
  background: "#bc6c25",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "0.25rem",
};

const offerStyle = {
  background: "#606c38",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "0.25rem",
};

const wishlistButtonStyle = {
  background: "#dda15e",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "0.25rem",
};

// Style for "no items" container
const noItemsContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80px",
  width: "500px",
  backgroundColor: "#283618",
  borderRadius: "12px",
  margin: "5rem auto",
};

// Style for the "no items" message
const noItemsTextStyle = {
  color: "white",
  fontSize: "1.2rem",
  fontWeight: "bold",
  textAlign: "center",
};
