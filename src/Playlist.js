import React from "react";
import "./playlist.css";

const Playlist = () => {
  const playlists = [
    {
      thumbnail: "https://static.qobuz.com/images/covers/yc/mg/e6pzio7zmmgyc_600.jpg",
      title: "Relaxing Music",
      description: "A collection of soothing tracks to help you unwind.",
    },
    {
      thumbnail: "https://i.scdn.co/image/ab67616d00001e0295878b826ee2e4ec702a8f92",
      title: "Workout Beats",
      description: "High-energy music to keep you pumped during your workouts.",
    },
    {
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYThRupD15ZrDaoZCv8aUsAB0WPEjLk3agqQ&s",
      title: "Top Hits",
      description: "The latest chart-topping hits from around the world.",
    },
    {
      thumbnail: "https://i.ebayimg.com/images/g/Q3MAAOSwwOdg510G/s-l400.jpg",
      title: "Classical Favorites",
      description: "Timeless classical compositions from the masters.",
    },
    {
      thumbnail: "https://img.freepik.com/free-vector/hand-drawn-indie-music-poster-design_23-2149539887.jpg?w=360",
      title: "Indie Vibes",
      description: "Discover hidden gems from independent artists.",
    },
    {
      thumbnail: "https://ih1.redbubble.net/image.670908309.1890/fposter,small,wall_texture,product,750x1000.jpg",
      title: "Chill Tunes",
      description: "Relax with a mix of chilled-out beats and melodies.",
    },
    {
      thumbnail: "https://m.media-amazon.com/images/I/51-6koG8KoL._UXNaN_FMjpg_QL85_.jpg",
      title: "Sunny Days",
      description: "Uplifting tunes for a bright and sunny day.",
    },
    {
      thumbnail: "https://ih1.redbubble.net/image.1161100863.9776/fposter,small,wall_texture,square_product,600x600.jpg",
      title: "Creative Minds",
      description: "Music to inspire creativity and focus.",
    },
    {
      thumbnail: "https://ih1.redbubble.net/image.2189241033.9805/fposter,small,wall_texture,product,750x1000.jpg",
      title: "Rock Legends",
      description: "Celebrate the best rock tracks of all time.",
    },
    {
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWcMlhBuTgkklbhtVKQVK3CAK-92zpgZl0tw&s",
      title: "Smooth Jazz",
      description: "Unwind with smooth jazz grooves and soulful melodies.",
    },
  ];

  return (
    <div className="playlist-container">
      <h2>Explore Playlists</h2>
      <div className="playlists">
        {playlists.map((playlist, index) => (
          <div className="playlist" key={index}>
            <img
              src={playlist.thumbnail}
              alt={playlist.title}
              className="playlist-thumbnail"
            />
            <div className="playlist-info">
              <h3>{playlist.title}</h3>
              <p>{playlist.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
