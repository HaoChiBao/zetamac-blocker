import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo">
          <Link to="/" className="logo-text" style={{ textDecoration: 'none', color: 'inherit' }}>Lowkey Smarter</Link>
        </div>
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <a href="/#games">Games</a>
          <a href="/#how-it-works">How it Works</a>
          <a href="/#pricing">Pricing</a>
          <button className="btn nav-cta">Add to Chrome</button>
        </div>
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          Execute Menu
        </button>
      </div>
    </nav>
  );
};
