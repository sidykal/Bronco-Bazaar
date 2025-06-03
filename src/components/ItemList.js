// src/components/ItemList.js

import React, { useState, useEffect } from "react";
import { auth } from "../firebase";

export default function ItemList({ items, onDelete, onWishlist, onOffer }) {
  // Track wishlist status by Firestore document ID
  const [wishlistStatus, setWishlistStatus] = useState({});
  const currentUser = auth.currentUser;

  useEffect(() => {
    const initialStatus = {};
    items.forEach((item) => {
      initialStatus[item.id] = false;
    });
    setWishlistStatus(initialStatus);
  }, [items]);

  const handleWishlistClick = (item) => {
    setWishlistStatus((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }));
    onWishlist(item);
  };

  if (items.length === 0) {
    return (
      <div style={noItemsContainerStyle}>
        <p style={noItemsTextStyle}>There are no offers at this time.</p>
      </div>
    );
  }

  return (
    <ul style={listStyle}>
      {items.map((item) => {
        const isOwnPost = currentUser && item.ownerUid === currentUser.uid;

        return (
          <li key={item.id} style={itemStyle}>
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

            {/* Delete now passes item.id */}
            {isOwnPost && (
            <button onClick={() => onDelete(item.id)} style={deleteStyle}>
              Delete
            </button>
          )}

            {/* “Make Offer”: disabled on your own posts */}
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

            {!isOwnPost && (
            <button
              onClick={() => handleWishlistClick(item)}
              style={
                wishlistStatus[item.id]
                  ? { ...wishlistButtonStyle, backgroundColor: "#4CAF50" }
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

const listStyle = {
  columnCount: 3,
  columnGap: "1rem",
  padding: "1rem",
  listStyle: "none",
};

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

const descriptionStyle = {
  margin: "0.5rem 0",
  color: "white",
};

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

const noItemsTextStyle = {
  color: "white",
  fontSize: "1.2rem",
  fontWeight: "bold",
  textAlign: "center",
};