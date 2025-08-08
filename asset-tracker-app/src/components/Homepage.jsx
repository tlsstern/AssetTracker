import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
  return (
    <div className="homepage">
      <nav className="homepage-nav">
        <div className="nav-container">
          <div className="logo">
            <h2>AssetTracker</h2>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/login" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Track Your Assets,
            <span className="gradient-text"> Grow Your Wealth</span>
          </h1>
          <p className="hero-subtitle">
            The modern way to manage your financial portfolio. Track investments, 
            monitor expenses, and visualize your net worth in real-time.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn-hero-primary">Start Tracking</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon"></div>
            <h3>$125,430</h3>
            <p>Total Assets</p>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon"></div>
            <h3>+12.5%</h3>
            <p>Monthly Growth</p>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon"></div>
            <h3>8 Assets</h3>
            <p>Tracked</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <h2 className="features-title">Everything You Need to Manage Your Wealth</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Real-Time Tracking</h3>
              <p>Monitor your assets with live price updates for stocks, crypto, and more.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Expense Management</h3>
              <p>Track income and expenses across multiple accounts with detailed categorization.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Visual Analytics</h3>
              <p>Beautiful charts and insights to understand your financial growth patterns.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Secure & Private</h3>
              <p>Bank-level security with encrypted data storage and secure authentication.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Portfolio Insights</h3>
              <p>Get intelligent insights about your portfolio diversification and performance.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Access Anywhere</h3>
              <p>Responsive design works seamlessly on desktop, tablet, and mobile devices.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Take Control of Your Finances?</h2>
          <p>Join thousands of users who are already tracking their wealth with AssetTracker</p>
          <Link to="/login" className="btn-cta">Create Free Account</Link>
        </div>
      </section>

      <footer className="homepage-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>AssetTracker</h3>
              <p>Your personal wealth management platform</p>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Security</a>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-links">
              <h4>Resources</h4>
              <a href="#">Help Center</a>
              <a href="#">API Docs</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;