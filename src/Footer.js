import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Footer Links */}
      <div className="footer-links">
        <a href="#">About</a>
        <a href="#">News</a>
        <a href="#">Podcast</a>
        <a href="#">Year in Review</a>
        <a href="#">Help</a>
        <a href="#">Terms</a>
        <a href="#">Contact</a>
      </div>

      {/* Footer Information */}
      <div className="footer-info">
        <p>
          © Museboxd Limited. Made by <a href="#">fans</a>. Music data from{" "}
          <a href="#">TMDb</a>. <a href="#">Mobile site</a>.
        </p>
      </div>

      {/* Social Media Icons */}
      <div className="footer-icons">
        <a href="#" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="#" aria-label="Twitter">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="#" aria-label="Facebook">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="#" aria-label="YouTube">
          <i className="fab fa-youtube"></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
