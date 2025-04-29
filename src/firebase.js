// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCLUo0Vm-Hc1kA3E1_Oku2pL5GKyY2VeOA",
    authDomain: "bronco-bazaar.firebaseapp.com",
    projectId: "bronco-bazaar",
    storageBucket: "bronco-bazaar.firebasestorage.app",
    messagingSenderId: "1096317072060",
    appId: "1:1096317072060:web:02ab23a60821ddd0f796b9",
    measurementId: "G-17N1HYHZSZ"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// (Optional) Hint to use university email
provider.setCustomParameters({
  hd: "scu.edu" // replace with your university domain
});

export { auth, provider };