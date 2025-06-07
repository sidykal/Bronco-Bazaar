import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

/**
 * Profile component that displays the authenticated user's information
 * and provides a button to sign out.
 */
export default function Profile() {
  // Get the current authenticated user
  const user = auth.currentUser;

  // If no user is logged in, show a message
  if (!user) return <p>You must be logged in to see this page.</p>;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        maxWidth: '400px',
        padding: '2rem',
        backgroundColor: '#283618',
        borderRadius: '12px',
        color: 'white',
      }}>
        {/* Profile Header */}
        <h2 style={{ textAlign: 'center' }}>My Profile</h2>

        {/* User Profile Image */}
        <img
          src={user.photoURL}
          alt="Profile"
          style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover' }}
        />

        {/* User Display Name and Email */}
        <h3 style={{ marginBottom: '0.25rem' }}>{user.displayName}</h3>
        <p style={{ marginTop: '0' }}>{user.email}</p>

        {/* Sign Out Button */}
        <button
          onClick={() => signOut(auth)}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '999px',
            backgroundColor: '#606c38',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          // Button hover effect
          onMouseOver={(e) => (e.target.style.backgroundColor = '#8d9e54')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#606c38')}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}