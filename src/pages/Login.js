import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("User object:", user);

      if (user.email.endsWith("@scu.edu")) {
        console.log("Authorized user:", user.email);
        navigate("/home");
      } else {
        console.log("Unauthorized email:", user.email);
        await signOut(auth);
        alert("You must sign in with your university email address.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login error. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "40px" }}>Bronco Bazaar</h1>
      <button
        onClick={handleLogin}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#9E1B32", // Pantone 201 red
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#7A1528")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#9E1B32")}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
