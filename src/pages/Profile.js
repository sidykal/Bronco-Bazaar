import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';


export default function Profile() {
  const user = auth.currentUser;

  if (!user) return <p>You must be logged in to see this page.</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>My Profile</h1>
      <img 
        src={user.photoURL} 
        alt="Profile" 
        style={{ borderRadius: '50%', width: '100px', height: '100px' }} 
      />
      <h2>{user.displayName}</h2>
      <p>{user.email}</p>
      <button onClick={() => signOut(auth)}>Sign Out</button>
    </div>
    
  );
}
