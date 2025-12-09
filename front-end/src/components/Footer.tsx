// import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h4>Lowkey Smarter</h4>
          <p>Reclaiming attention spans, one game at a time.</p>
        </div>
        <div className="footer-links">
          <div className="link-col">
            <h5>Product</h5>
            <a href="#">Download</a>
            <a href="#">Changelog</a>
          </div>
          <div className="link-col">
            <h5>Legal</h5>
            <Link to="/privacy-policy">Privacy</Link>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
      <div className="container copyright">
        &copy; {new Date().getFullYear()} Lowkey Smarter. All rights reserved.
      </div>
    </footer>
  );
};
