const express = require("express");
const axios = require("axios");

const router = express.Router();

// Middleware to include authorization header
const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Fetch user profile
router.get("/user", async (req, res) => {
  const { access_token } = req.query;

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", getAuthHeader(access_token));
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Fetch user playlists
router.get("/playlists", async (req, res) => {
  const { access_token } = req.query;

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/playlists", getAuthHeader(access_token));
    res.json(response.data.items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
});

// Fetch top artists
router.get("/top-artists", async (req, res) => {
  const { access_token } = req.query;

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/top/artists", getAuthHeader(access_token));
    res.json(response.data.items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
});

// Fetch recently played tracks
router.get("/recent-tracks", async (req, res) => {
  const { access_token } = req.query;

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/player/recently-played", getAuthHeader(access_token));
    res.json(response.data.items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent tracks" });
  }
});

module.exports = router;
