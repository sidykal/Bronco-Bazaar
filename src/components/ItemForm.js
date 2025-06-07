// src/components/ItemForm.js

import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Firebase storage instance

export default function ItemForm({ onAdd }) {
  // Local state for form fields and uploaded image file
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    if (!name || !price) return; // Basic validation check

    let imageUrl = null;

    // If an image is selected, upload to Firebase Storage
    if (imageFile) {
      // Create a storage reference with a unique filename
      const imageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
  
      try {
        // Upload image file to Firebase Storage
        await uploadBytes(imageRef, imageFile);
  
        // Retrieve the public URL for the uploaded image
        imageUrl = await getDownloadURL(imageRef);
      } catch (error) {
        // Handle upload errors
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
        return;
      }
    }

    // Pass form data to parent component with trimmed/parsed values
    onAdd({
      name: name.trim(),
      price: parseFloat(price),
      description: description.trim(),
      image: imageUrl,
    });

    // Clear form fields after submission
    setName("");
    setPrice("");
    setDescription("");
    setImageFile(null);
  };

  // Handle image file input change
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]; // Get selected file
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      {/* Main form UI for creating a new offer */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          backgroundColor: "#283618",
          borderRadius: "12px",
          color: "white",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Create Offer</h2>

        <label>Item Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <label>Price ($):</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          placeholder="e.g. This item is very cool and is an item for sale"
          required
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <label>Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ color: "white" }}
        />

        {/* Image preview shown after selection */}
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              marginBottom: "0.5rem",
            }}
          />
        )}

        {/* Submit button with hover effects */}
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            border: "none",
            borderRadius: "999px",
            backgroundColor: "#606c38",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#8d9e54")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#606c38")}
        >
          Post Offer
        </button>
      </form>
    </div>
  );
}
