import React, { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
  // State for storing fetched data
  const [newReleases, setNewReleases] = useState([]);
  const [popularTracks, setPopularTracks] = useState([]);
  const [awardNominees, setAwardNominees] = useState([]);

  // Fetch MusicBrainz data
  const fetchMusicData = async () => {
    try {
      // Example endpoint for fetching new releases (modify as necessary)
      const newReleasesResponse = await axios.get(
        "https://musicbrainz.org/ws/2/release/?query=released:2024&limit=5&fmt=json"
      );
      setNewReleases(newReleasesResponse.data.releases || []);

      // Fetch popular tracks data (adjust for actual MusicBrainz API responses)
      const popularTracksResponse = await axios.get(
        "https://musicbrainz.org/ws/2/recording/?query=type:track&limit=5&fmt=json"
      );
      setPopularTracks(popularTracksResponse.data.recordings || []);

      // Fetch award nominees data (adjust as per your criteria)
      const awardNomineesResponse = await axios.get(
        "https://musicbrainz.org/ws/2/recording/?query=type:track&limit=10&fmt=json"
      );
      setAwardNominees(awardNomineesResponse.data.recordings || []);
    } catch (error) {
      console.error("Error fetching music data from MusicBrainz", error);
    }
  };

  // Call fetchMusicData when the component mounts
  useEffect(() => {
    fetchMusicData();
  }, []);

  return (
    <div className="homepage">
      <div className="banner">
        <h1>2024 Music Year in Review</h1>
      </div>
      <div className="welcome-message">
        <h2>Welcome back, <span className="username">MusicLover12</span>.</h2>
      </div>
      
      {/* New Releases */}
      <div className="music-section">
        <h3>New Releases</h3>
        <div className="music-list">
          {newReleases.map((track, index) => (
            <div key={index} className="music-card">
              <img 
                src={track.cover_art ? track.cover_art : "/images/default_cover.jpg"} 
                alt={track.title || "Album cover"} 
              />
              <p className="title">{track.title}</p>
              <p className="genre">Genre: {track.genre || "Unknown"}</p>
              <div className="details">
                <p className="artist">By: {track.artist || "Unknown Artist"}</p>
                <p className="date">Released: {track.date || "TBD"}</p>
                <p className="rating">Rating: {track.rating || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Tracks */}
      <section className="section">
        <h2>Popular Tracks</h2>
        <div className="music-grid">
          {popularTracks.map((track, index) => (
            <div className="music-card" key={index}>
              <img 
                src={track.cover_art || "/images/default_cover.jpg"} 
                alt={track.title || "Track cover"} 
              />
              <p className="title">{track.title}</p>
              <p className="genre">Genre: {track.genre || "Unknown"}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Award Nominees */}
      <section className="section">
        <h2>And the Award Goes To...</h2>
        <div className="music-grid">
          {awardNominees.map((track, index) => (
            <div className="music-card" key={index}>
              <img 
                src={track.cover_art || "/images/default_cover.jpg"} 
                alt={track.title || "Track cover"} 
              />
              <p className="title">{track.title}</p>
              <p className="genre">Genre: {track.genre || "Unknown"}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
