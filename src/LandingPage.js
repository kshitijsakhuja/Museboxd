import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">
          <span className="logo-dot green"></span>
          <span className="logo-dot orange"></span>
          <span className="logo-dot blue"></span>
          <h1>Museboxd</h1>
        </div>
        <nav className="nav">
          <a href="#">Sign In</a>
          <a href="#">Create Account</a>
          <a href="#">Activity</a>
          <a href="#">Films</a>
          <a href="#">Lists</a>
          <a href="#">Members</a>
          <a href="#">Journal</a>
          <input
            type="text"
            className="search-bar"
            placeholder="Search"
          />
        </nav>
      </header>

      <main className="main">
        <div className="text-section">
          <h2>Track films you’ve watched.</h2>
          <h2>Save those you want to see.</h2>
          <h2>Tell your friends what’s good.</h2>
          <button className="cta-button">Get started — it’s free!</button>
          <p className="footer-text">
            The social network for film lovers. Also available on{" "}
            <span className="platform">Apple</span> and{" "}
            <span className="platform">Android</span>.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
