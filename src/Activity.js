import React from "react";
import "./Activity.css";

const Activity = () => {
  return (
    <div className="activity-container">
      <div className="header">
        <h1 className="username">MusicLover12</h1>
        <p className="welcome-text">Welcome back! Let’s check what’s new today 🎮</p>
      </div>

      <div className="activity-main">
        <div className="activity-content">
          <div className="tabs">
            <span className="tab active">FRIENDS</span>
            <span className="tab">YOU</span>
            <span className="tab">INCOMING</span>
          </div>
          <div className="activity-list">
            <h3>Recent Activities</h3>
            <div className="activity-item">
              <p><strong>JohnDoe</strong> liked your review of <em>"The Last of Us Part II"</em>.</p>
              <span className="timestamp">5 minutes ago</span>
            </div>
            <div className="activity-item">
              <p><strong>GamingQueen99</strong> commented on your list <em>"Top RPGs of 2023"</em>.</p>
              <span className="timestamp">10 minutes ago</span>
            </div>
            <div className="activity-item">
              <p><strong>PlayerOne</strong> started following you.</p>
              <span className="timestamp">1 hour ago</span>
            </div>
            <p className="no-more-activity">No more activity to show.</p>
          </div>
        </div>
        <div className="activity-sidebar">
          <div className="activity-filters">
            <h3>Filter Activities</h3>
            <button className="filter-button">By Friends</button>
            <button className="filter-button">By Games</button>
            <button className="filter-button">By Time</button>
          </div>
          <div className="suggested-friends">
            <h3>Suggested Friends</h3>
            <ul>
              <li>
                <strong>PixelMaster</strong>
                <button className="follow-button">Follow</button>
              </li>
              <li>
                <strong>ArcadeFan</strong>
                <button className="follow-button">Follow</button>
              </li>
              <li>
                <strong>LevelUpGuru</strong>
                <button className="follow-button">Follow</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
