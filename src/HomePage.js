import React from "react";
import "./Discover.css"; // Ensure proper styling with a separate CSS file

const Discover = () => {
  // Sample data for genres and playlists
  const genres = [
    { id: 1, name: "Pop", image: "https://storage.googleapis.com/pod_public/1300/175135.jpg" },
    { id: 2, name: "Rock", image: "https://as2.ftcdn.net/jpg/02/58/77/15/1000_F_258771512_vWLuMHhWyBrV8dSWyA31QOuB6r2RMkM7.jpg" },
    { id: 3, name: "Jazz", image: "https://c8.alamy.com/comp/T2KPWD/jazz-day-poster-illustration-for-music-festival-event-or-concert-retro-background-with-mid-century-vintage-style-band-instruments-T2KPWD.jpg" },
    { id: 4, name: "Classical", image: "https://thumbs.dreamstime.com/z/classical-music-faculty-vector-vintage-poster-school-college-grand-piano-violin-bow-notes-treble-clef-engraved-art-211933416.jpg" },
    { id: 5, name: "Hip-Hop", image: "https://img.freepik.com/free-vector/hip-hop-festival-poster-with-gradient-illustration_52683-21747.jpg" },
  ];

  const playlists = [
    {
      id: 1,
      title: "Top Hits 2023",
      description: "The most popular tracks of 2023.",
      image: "https://content.groove3.com/images/site/product/D/ChartHitsof20222023EasyPiano_TsFh_600.jpg",
    },
    {
      id: 2,
      title: "Relax & Unwind",
      description: "Calm tunes for a relaxing evening.",
      image: "https://i.scdn.co/image/ab67706f00000002fc7482f52fd07ec413b38e1a",
    },
    {
      id: 3,
      title: "Party Anthems",
      description: "Get the party started with these tracks.",
      image: "https://i.scdn.co/image/ab67616d00001e02a9b67dfd76675906302a597f",
    },
  ];

  return (
    <div className="discover-container">
      <h1 className="discover-title">Discover New Music</h1>

      {/* Genre Section */}
      <div className="genre-section">
        <h2>Explore Genres</h2>
        <div className="genre-grid">
          {genres.map((genre) => (
            <div key={genre.id} className="genre-card">
              <img src={genre.image} alt={genre.name} className="genre-image" />
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
              <img
                src={playlist.image}
                alt={playlist.title}
                className="playlist-image"
              />
              <div className="playlist-info">
                <h3 className="playlist-title">{playlist.title}</h3>
                <p className="playlist-description">{playlist.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
