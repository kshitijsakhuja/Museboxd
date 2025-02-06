import React, { useState } from "react";
import { searchSpotify } from "../services/spotifyService";

const SearchComponent = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (!query) return;
        const data = await searchSpotify(query);
        setResults(data?.tracks || []);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search for a track..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {results.map((track) => (
                    <li key={track.id}>{track.name} by {track.artists[0].name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchComponent;
