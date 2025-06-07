import React from "react";
import { auth, provider } from "../firebase"; // Import Firebase auth and provider (Google in this case)
import { signInWithPopup, signOut } from "firebase/auth"; // Firebase auth methods
import { useNavigate } from "react-router-dom"; // React Router hook for navigation

function Login() {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // Handles login with Google using Firebase authentication
  const handleLogin = async () => {
    try {
      // Initiate popup login flow
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("User object:", user); // Log full user object for debugging

      // Check if the signed-in email is from SCU
      if (user.email.endsWith("@scu.edu")) {
        console.log("Authorized user:", user.email);
        navigate("/home"); // Redirect to home page upon successful login
      } else {
        console.log("Unauthorized email:", user.email);
        await signOut(auth); // Sign the user out if the domain doesn't match
        alert("You must sign in with your university email address.");
      }
    } catch (error) {
      // Handle and log authentication errors
      console.error("Login failed:", error);
      alert("Login error. Please try again.");
    }
  };

  // Renders the login screen with a styled sign-in button
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "40px" }}>Bronco Bazaar</h1>
      <button
        onClick={handleLogin} // Trigger login on click
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#9E1B32", // Santa Clara University red
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        // Change background color on hover
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#7A1528")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#9E1B32")}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login; // Export the component for use in other files
