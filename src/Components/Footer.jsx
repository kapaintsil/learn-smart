import React from 'react';
import './Footer.css';
import footerLogo from '/icons/LS-logo.png'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src={footerLogo} alt="Footer Logo" className="footer-logo" />
      </div>
      <div className="footer-center">
        <p>Made with 💜 by Hilly & Kwame</p>
        <p>© 2025 LearnSmart. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
