import React from 'react';
import './NavBar.css';
import logo from '../assets/icons/website-logo.png';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="App Logo" className="logo" />
      </div>
      <div className="navbar-right">
        <button className="btn sign-in">Sign In</button>
        <button className="btn sign-up">Sign Up</button>
      </div>
    </nav>
  );
}

export default NavBar;
