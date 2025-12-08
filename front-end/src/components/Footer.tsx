import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Lowkey Smarter. All rights reserved.</p>
        <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
      </div>
    </footer>
  );
};
