// import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GameCard } from '../components/GameCard';
import '../App.css';

const LandingPage = () => {
  const games = [
    { title: "Word Hunt", description: "Find hidden words in a grid. Think fast.", badge: "New" },
    { title: "Pairs", description: "Test your memory limit. 3D card flipping.", badge: "Updated" },
    { title: "Cup Shuffle", description: "Follow the ball. Don't blink.", badge: "Popular" },
    { title: "Arithmetic", description: "Rapid-fire mental math problems." },
    { title: "Blackjack", description: "Hit or stand. Beat the dealer." },
    { title: "Code Challenge", description: "Solve real coding problems. Python supported.", badge: "Beta" }
  ];

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <header className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Unlock Your Focus.<br />
              <span className="highlight">Gamify Distraction.</span>
            </h1>
            <p className="hero-subtitle">
              Turn mindlesss scrolling into brain-training micro-sessions. 
              The Chrome extension that blocks sites and forces you to win a game to enter.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary">Get Started Free</button>
              <button className="btn btn-outline">View Demo</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="browser-mockup">
              <div className="browser-header">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
              <div className="browser-content">
                <div className="website-skeleton">
                  <div className="skeleton-hero"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                  <div className="skeleton-media"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
                <div className="overlay-animate">
                  <div className="overlay-content">
                    <div className="overlay-brand">Lowkey Smarter</div>
                    <div className="overlay-message">Complete to unlock</div>
                    <div className="game-animate">
                      <div className="game-keypad">
                        <div className="key"></div><div className="key"></div><div className="key"></div>
                        <div className="key"></div><div className="key"></div><div className="key"></div>
                        <div className="key"></div><div className="key"></div><div className="key"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features / Value Prop */}
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <h3>Your Distractions, Your Rules.</h3>
              <p>Add <strong>any website</strong> to your blocklist—Instagram, Twitter, Reddit. You choose where you need the most help.</p>
            </div>
            <div className="feature-item">
              <h3>Turn Habits into Skills.</h3>
              <p>Transform your most visited sites into micro-learning opportunities. Learn math, vocabulary, or logic before you scroll.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Games Grid */}
      <section id="games" className="section games-section">
        <div className="container">
          <div className="section-header">
            <h2>Train your brain while you wait</h2>
            <p>Master these skills to unlock your entertainment.</p>
          </div>
          <div className="games-grid">
            {games.map((game, idx) => (
              <GameCard key={idx} {...game} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section steps-section">
        <div className="container">
          <div className="section-header">
            <h2>How it Works</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Block Sites</h3>
              <p>Add distracting websites (Instagram, Twitter, etc.) to your blocklist.</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Get Interrupted</h3>
              <p>When you try to visit them, a game overlay appears immediately.</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Win to Unlock</h3>
              <p>Complete a quick brain-teaser to access the site for a set time.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
