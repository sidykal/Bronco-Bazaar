// src/pages/Wishlist.js
import React from "react";

export default function Wishlist({ wishlist, onRemove }) {
  return (
    <div>
      <h2>Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <ul style={listStyle}>
          {wishlist.map((item) => (
            <li key={item.id} style={itemStyle}>
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
              <strong>{item.name}</strong> – ${item.price}
              <p>{item.description}</p>

              {/* Remove from wishlist button now passes item.id */}
              <button
                onClick={() => onRemove(item.id)}
                style={removeStyle}
              >
                Remove from Wishlist
              </button>

              <button style={offerStyle}>Make Offer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

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

const removeStyle = {
  background: "#bc6c25",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "0.5rem",
};

const offerStyle = {
  background: "#606c38",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "0.5rem",
};

const listStyle = {
  columnCount: 3,
  columnGap: "1rem",
  padding: "1rem",
};
