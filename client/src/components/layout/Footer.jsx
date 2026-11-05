import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 'var(--fs-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>Pavitra <span style={{ color: 'var(--color-primary)' }}>Milan</span></span>
            </Link>
            <p className="footer-desc">India's most trusted matrimonial platform. Find your perfect life partner with verified profiles and secure matching.</p>
          </div>
          <div>
            <h4 className="footer-title">Quick Links</h4>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </div>
          </div>
          <div>
            <h4 className="footer-title">Contact</h4>
            <div className="footer-links">
              <a href="mailto:support@pavitramilan.com">support@pavitramilan.com</a>
              <a href="tel:+911234567890">+91 8920245794</a>
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-sm)' }}>Delhi, India</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            © {new Date().getFullYear()} Pavitra Milan. All rights reserved. Made with <Heart size={14} fill="var(--color-primary)" color="var(--color-primary)" /> in India.
          </p>
        </div>
      </div>
    </footer>
  );
}
