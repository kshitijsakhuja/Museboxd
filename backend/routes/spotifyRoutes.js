const express = require("express");
const { searchSpotify, getTrackInfo } = require("../services/spotifyService");

const router = express.Router();

router.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query parameter 'q' is required" });

    const results = await searchSpotify(query);
    res.json(results);
});

router.get("/track/:id", async (req, res) => {
    const trackId = req.params.id;
    const trackInfo = await getTrackInfo(trackId);
    res.json(trackInfo);
});

module.exports = router;
