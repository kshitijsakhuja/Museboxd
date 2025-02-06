const express = require("express");
const cors = require("cors");
const spotifyRoutes = require("./routes/spotifyRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/spotify", spotifyRoutes); // Route prefix for Spotify API

const PORT = 3000;
app.listen(PORT, () => console.log(`Node.js server running on port ${PORT}`));

const API_BASE_URL = "http://localhost:3000"; // Python API
