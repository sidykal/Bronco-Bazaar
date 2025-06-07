// src/pages/Home.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemList from "../components/ItemList"; // Reusable component to display list of items

export default function Home({ items, onDelete, onWishlist, onOffer }) {
  // State for search input and filter options
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const navigate = useNavigate(); // React Router hook for navigation

  // Filters and sorts the list of items based on user inputs
  const filteredItems = items
    .filter((item) => {
      // Search filtering: name, description, or price matches the search term
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.price.toString().includes(searchTerm);

      // Parse string inputs into numbers for price filtering
      const price = parseFloat(item.price);
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);

      // Check if price is within user-specified range (if set)
      const inRange =
        (!minPrice || price >= min) && (!maxPrice || price <= max);

      return matchesSearch && inRange;
    })
    .sort((a, b) => {
      // Apply sort order based on user selection
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0; // Default: no sorting
    });

  // Navigates to the messaging page, passing the item's owner UID
  const handleMakeOffer = (item) => {
    if (!item.ownerUid) {
      console.warn("No ownerUid on this item:", item); // Failsafe for missing data
      return;
    }
    navigate("/message", { state: { selectedUid: item.ownerUid } }); // Pass UID via location state
  };

  return (
    <div>
      {/* Filter + Sort Inputs */}
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search bar for name, description, or price */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            marginBottom: "1rem",
            borderRadius: "10px",
            border: "1px solid #ccc",
            borderColor: "#283618",
            height: "1.3rem",
            fontSize: "1rem",
          }}
        />

        {/* Minimum price input */}
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "120px",
          }}
        />

        {/* Maximum price input */}
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "120px",
          }}
        />

        {/* Dropdown to select sort order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "160px",
          }}
        >
          <option value="default">Sort by</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Renders the filtered and sorted item list */}
      <ItemList
        items={filteredItems}
        onDelete={onDelete}
        onWishlist={onWishlist}
        onOffer={handleMakeOffer} // Pass custom offer handler
      />
    </div>
  );
}