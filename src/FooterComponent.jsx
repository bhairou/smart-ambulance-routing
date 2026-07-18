import React from 'react';
import './FooterComponent.css';

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-brand">
          <span className="footer-icon">🚑</span>
          <h3>Smart Ambulance Routing</h3>
          <p>Real-time Emergency Response System</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/emergency">Emergency</a></li>
            <li><a href="/ambulances">Ambulances</a></li>
            <li><a href="/hospitals">Hospitals</a></li>
            <li><a href="/analytics">Analytics</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-support">
          <h4>Support</h4>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>

        {/* Social & Contact */}
        <div className="footer-social">
          <h4>Connect With Us</h4>
          <div className="social-icons">
            <a href="#" className="social-icon" aria-label="Facebook">📘</a>
            <a href="#" className="social-icon" aria-label="Twitter">🐦</a>
            <a href="#" className="social-icon" aria-label="Instagram">📸</a>
            <a href="#" className="social-icon" aria-label="LinkedIn">💼</a>
            <a href="#" className="social-icon" aria-label="YouTube">▶️</a>
          </div>
          <div className="contact-info">
            <p>📞 Emergency: <strong>108</strong></p>
            <p>📧 Email: <a href="mailto:support@smartambulance.com">support@smartambulance.com</a></p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {currentYear} Smart Ambulance Routing System. All rights reserved.</p>
        <p>🚀 Powered by AI & DSA | Made with ❤️</p>
      </div>
    </footer>
  );
};

export default FooterComponent;