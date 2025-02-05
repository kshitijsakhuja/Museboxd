import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import Login from "./LoginPage";
import SignupModal from "./SignupPage";
import MusicGallery from "./MusicGallery";
import Playlist from "./Playlist";
import Discover from "./Discover";
import Activity from "./Activity";
import PopularReviews from "./PopularReviews";
import HomePage from "./HomePage";
import SignIn from "./LoginPage";
import MusicSearch from "./components/MusicSearch";

const App = () => {
  return (
    <Router>
      <Navbar />

      <nav>
        <Link to="/submit">Login</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <div className="hero-section">
                <div className="hero-content">
                  <h1 className="hero-title">
                    That's good! You've taken your first step into a larger world...
                  </h1>
                  <p className="hero-text">
                    Museboxd lets you keep track of every Music you've seen, so
                    you can instantly recommend one the moment someone asks, or
                    check reactions to a Music you've just heard about. We're a
                    global community of Music fans who live to discuss, rate and
                    rank what we watch.
                  </p>
                  <p className="hero-helper">
                    Now to complete your training. Return here any time via the
                    Help link in the footer of each page.
                  </p>
                </div>
                <div className="hero-image">
                  <img
                    src="https://media.istockphoto.com/id/1408489097/vector/music-festival-vector-illustrations-of-musicians-people-and-musical-instruments-drums-cello.jpg?s=612x612&w=0&k=20&c=ZyYPGu4q5KwbtLoAiRlOJ3AoJDWGW1srYXspX0t-96w="
                    alt="Hero Scene"
                    className="hero-bg"
                  />
                </div>
              </div>

              <div className="cta-section">
                <h2>Tell us what you’ve seen</h2>
                <p>
                  Get your Museboxd underway by visiting our Popular section and
                  marking a few Musics you’ve seen. Click the icon on any Music
                  poster.
                </p>
              </div>

              <div className="poster-carousel">
                {["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrwSe19c7sTq0izmSrdGpkjWbTlnLp5ldYew&s",
                  "https://t4.ftcdn.net/jpg/04/82/50/45/360_F_482504529_3NJsfU11Rb2qAr1NVA9OEhxm4Cx1aVK0.jpg",
                  "https://www.shutterstock.com/shutterstock/photos/185875649/display_1500/stock-vector-rock-music-poster-background-template-texture-effects-can-be-turned-off-185875649.jpg",
                  "https://i.pinimg.com/236x/ca/bc/d7/cabcd715c5bcd8b5f56ed376244f1a62.jpg",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4-ixiKXn5yz6EixF_IeROVtpWopnTB_2gMA&s",
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsYZ4q5V6wXN9koEkcn3KQyx5KsDUhHA0MOw&s",
                ].map((src, index) => (
                  <div className="poster" key={index}>
                    <img src={src} alt={`Poster ${index + 1}`} />
                  </div>
                ))}
              </div>

              <div className="playlist-section">
                <Playlist />
              </div>

              <div className="popular-reviews-section">
                <PopularReviews />
              </div>

              <div className="music-search-section">
                <MusicSearch />
              </div>
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupModal />} />
        <Route path="/music" element={<MusicGallery />} />
        <Route path="/playlists" element={<Playlist />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/search" element={<MusicSearch />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
