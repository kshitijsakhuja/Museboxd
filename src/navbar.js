import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [logDropdownOpen, setLogDropdownOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  // Toggle Search Bar
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setSearchInput("");
  };

  // Toggle Log Dropdown
  const toggleLogDropdown = () => {
    setLogDropdownOpen(!logDropdownOpen);
  };

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <div className="logo-circles">
          <span className="circle orange"></span>
          <span className="circle green"></span>
          <span className="circle blue"></span>
        </div>
        <span className="logo-text">Museboxd</span>
      </div>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li>
          <a href="/login">Login</a> {/* Redirects to the login page */}
        </li>
        <li>
          <a href="/signup">Signup</a>
        </li>
        <li>
          <a href="/activity">Activity</a>
        </li>
        <li>
          <a href="/music">Music</a>
        </li>
        <li>
          <a href="/playlists">Playlists</a>
        </li>
        <li>
          <a href="/discover">Discover</a>
        </li>

        {/* Search Bar */}
        <li className="search-container">
          {searchOpen ? (
            <div className="search-bar">
              <button className="close-btn" onClick={toggleSearch}>
                ✖
              </button>
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="search-btn">🔍</button>
            </div>
          ) : (
            <button className="search-icon" onClick={toggleSearch}>
              🔍
            </button>
          )}
        </li>
      </ul>

      {/* Log Button with Dropdown */}
      <div className="log-button-container">
  <button className="log-button" onClick={toggleLogDropdown}>
    + LOG <span className="dropdown-arrow">▾</span>
  </button>
  {logDropdownOpen && (
    <div className="log-dropdown">
      <input
        type="text"
        placeholder="Start a new list..."
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        className="log-input"
      />
    </div>
  )}
</div>
</nav>
  );
};

export default Navbar;
