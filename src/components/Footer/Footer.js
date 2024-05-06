// Footer.js
import React from 'react';
import '../../styles/Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Services</a>
          <a href="#">Contact</a>
        </div>
      </div>
      <p className="footer-text">&copy;  All rights reserved. Ruchitha Kudumula</p>
    </footer>
  );
};

export default Footer;
