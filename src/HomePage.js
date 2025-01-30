import React from "react";
import "./HomePage.css";

const HomePage = () => {
  const newReleases = [
    { 
      title: "Midnight Symphony", 
      artist: "Ethereal Waves", 
      date: "Jan 24", 
      rating: "★★★★½", 
      genre: "Ambient", 
      image: "/images/midnight_symphony.jpg" 
    },
    { 
      title: "Summer Vibes", 
      artist: "Alex Trevi", 
      date: "Jan 24", 
      rating: "★★★½", 
      genre: "Pop", 
      image: "summer_vibes.jpg" 
    },
    { 
      title: "Perfect Harmony", 
      artist: "Laurinha", 
      date: "Jan 25", 
      rating: "★★★★★", 
      genre: "Classical", 
      image: "perfect_harmony.jpg" 
    },
    { 
      title: "Rising Stars", 
      artist: "William Haywood", 
      date: "Jan 25", 
      rating: "★★★½", 
      genre: "Indie", 
      image: "rising_stars.jpg" 
    },
    { 
      title: "Back to Basics", 
      artist: "Retro Beats", 
      date: "Jan 24", 
      rating: "★★★½", 
      genre: "Retro", 
      image: "back_to_basics.jpg" 
    },
    { 
      title: "Robot Dreams", 
      artist: "Digital Future", 
      date: "Jan 24", 
      rating: "★★★★", 
      genre: "Electronic", 
      image: "robot_dreams.jpg" 
    },
  ];

  const popularTracks = [
    { title: "Echoes of Eternity", genre: "Instrumental", image: "echoes_of_eternity.jpg" },
    { title: "Chasing the Horizon", genre: "Rock", image: "chasing_the_horizon.jpg" },
    { title: "Dreamcatcher", genre: "Pop", image: "dreamcatcher.jpg" },
    { title: "Beyond the Stars", genre: "Ambient", image: "beyond_the_stars.jpg" },
    { title: "Soulful Rhythms", genre: "Jazz", image: "soulful_rhythms.jpg" },
    { title: "Golden Hour", genre: "Indie", image: "golden_hour.jpg" },
  ];

  const awardNominees = [
    { title: "Harmonic Bliss", genre: "Classical", image: "harmonic_bliss.jpg" },
    { title: "The Golden Sound", genre: "World", image: "golden_sound.jpg" },
    { title: "Melody Divine", genre: "Ballad", image: "melody_divine.jpg" },
    { title: "Symphony of the Seas", genre: "Orchestral", image: "symphony_seas.jpg" },
    { title: "Resonance", genre: "Electronic", image: "resonance.jpg" },
    { title: "Timeless Tones", genre: "Retro", image: "timeless_tones.jpg" },
    { title: "Luminous Echoes", genre: "Ambient", image: "luminous_echoes.jpg" },
    { title: "Rhythm of the Night", genre: "Dance", image: "rhythm_night.jpg" },
    { title: "Serenade", genre: "Jazz", image: "serenade.jpg" },
    { title: "Waves of Tranquility", genre: "Meditation", image: "waves_tranquility.jpg" },
  ];

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
              <img src={`/images/${track.image}`} alt={track.title} />
              <p className="title">{track.title}</p>
              <p className="genre">Genre: {track.genre}</p>
              <div className="details">
                <p className="artist">By: {track.artist}</p>
                <p className="date">Released: {track.date}</p>
                <p className="rating">Rating: {track.rating}</p>
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
              <img src={track.image} alt={track.title} />
              <p className="title">{track.title}</p>
              <p className="genre">Genre: {track.genre}</p>

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
              <img src={track.image} alt={track.title} />
              <p className="title">{track.title}</p>
              <p className="genre">Genre: {track.genre}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
