import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/firebase.js';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import './NavBar.css';
import logo from '/icons/website-logo.png';

const NavBar = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out: ' + error.message);
    }
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar-left">
        <img
          src={logo}
          alt="Learn Smart Logo"
          onClick={() => navigate('/')}
          className="logo"
          role="button"
          aria-label="Go to homepage"
        />
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span className="user-greeting">Hello, {user.displayName || 'User'}</span>
            <button className="btn sign-out" onClick={handleSignOut} aria-label="Sign out">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              className="btn sign-in"
              onClick={() => navigate('/signin')}
              aria-label="Sign in"
            >
              Sign In
            </button>
            <button
              className="btn sign-up"
              onClick={() => navigate('/signup')}
              aria-label="Sign up"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;