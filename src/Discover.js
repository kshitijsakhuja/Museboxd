import React, { useEffect, useState } from "react";
import "./Discover.css";

const Discover = () => {
  const [genres, setGenres] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("https://musicbrainz.org/ws/2/genre/all?fmt=json");
        const data = await response.json();
        setGenres(data.genres.slice(0, 5)); // Fetch only a few genres for display
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    const fetchPlaylists = async () => {
      try {
        const response = await fetch("https://musicbrainz.org/ws/2/release-group/?query=tag:playlist&fmt=json&limit=3");
        const data = await response.json();
        setPlaylists(data["release-groups"]);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    Promise.all([fetchGenres(), fetchPlaylists()]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="discover-container">
      <h1 className="discover-title">Discover New Music</h1>
      {loading ? <p>Loading...</p> : (
        <>
          {/* Genre Section */}
          <div className="genre-section">
            <h2>Explore Genres</h2>
            <div className="genre-grid">
              {genres.map((genre, index) => (
                <div key={index} className="genre-card">
                  <p className="genre-name">{genre.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Playlist Section */}
          <div className="playlist-section">
            <h2>Recommended Playlists</h2>
            <div className="playlist-grid">
              {playlists.map((playlist) => (
                <div key={playlist.id} className="playlist-card">
                  <h3 className="playlist-title">{playlist.title}</h3>
                  <p className="playlist-description">{playlist.disambiguation || "A great playlist to explore!"}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Discover;