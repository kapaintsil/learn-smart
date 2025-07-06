import React from 'react';
import './NavBar.css';
import logo from '../assets/icons/website-logo.png';
import { useNavigate } from 'react-router-dom';

function NavBar() {

  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="App Logo" onClick={() => navigate('/')} className="logo" />
      </div>
      <div className="navbar-right">
        <button className="btn sign-in" onClick={() => navigate('/signin')}>
          Sign In
        </button>
        <button className="btn sign-up" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
