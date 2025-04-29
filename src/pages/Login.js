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
      <h1>Login</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}

export default Login;
