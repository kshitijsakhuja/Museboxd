const axios = require('axios');

const SPOTAPI_SERVER_URL = "http://localhost:3000"; // Update if running on a different port

async function searchSpotify(query) {
    try {
        const response = await axios.get(`${SPOTAPI_SERVER_URL}/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching data from SpotAPI:", error.response?.data || error.message);
        return null;
    }
}

async function getTrackInfo(trackId) {
    try {
        const response = await axios.get(`${SPOTAPI_SERVER_URL}/track/${trackId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching track info:", error.response?.data || error.message);
        return null;
    }
}

module.exports = { searchSpotify, getTrackInfo };
