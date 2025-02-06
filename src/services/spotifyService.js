import axios from "axios";

const API_BASE_URL = "http://localhost:3000/spotify"; // Node.js backend

export const searchSpotify = async (query) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error("Error searching Spotify:", error.response?.data || error.message);
        return null;
    }
};

export const getTrackInfo = async (trackId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/track/${trackId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching track info:", error.response?.data || error.message);
        return null;
    }
};
