// src/pages/Home.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemList from "../components/ItemList";

export default function Home({ items, onDelete, onWishlist, onOffer }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const navigate = useNavigate();

  // Filter & sort logic remains the same
  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.price.toString().includes(searchTerm);

      const price = parseFloat(item.price);
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);

      const inRange =
        (!minPrice || price >= min) && (!maxPrice || price <= max);

      return matchesSearch && inRange;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  // Navigate to /message with the owner’s UID when “Make Offer” is clicked
  const handleMakeOffer = (item) => {
    if (!item.ownerUid) {
      console.warn("No ownerUid on this item:", item);
      return;
    }
    navigate("/message", { state: { selectedUid: item.ownerUid } });
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
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

      <ItemList
        items={filteredItems}
        onDelete={onDelete}
        onWishlist={onWishlist}
        onOffer={handleMakeOffer}
      />
    </div>
  );
}
