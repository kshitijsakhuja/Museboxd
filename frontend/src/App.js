import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [user, setUser] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/profile", { withCredentials: true })
            .then(response => {
                setUser(response.data.user);
                setPlaylists(response.data.playlists);
                setLikedSongs(response.data.liked_songs);
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <div>
            <h1>Spotify Profile</h1>
            {user ? (
                <div>
                    <h2>Welcome, {user.display_name}</h2>
                    <h3>Playlists</h3>
                    <ul>
                        {playlists.map(playlist => (
                            <li key={playlist.id}>{playlist.name}</li>
                        ))}
                    </ul>
                    <h3>Liked Songs</h3>
                    <ul>
                        {likedSongs.map(song => (
                            <li key={song.track.id}>{song.track.name} - {song.track.artists[0].name}</li>
                        ))}
                    </ul>
                    <a href="http://localhost:5000/logout">Logout</a>
                </div>
            ) : (
                <a href="http://localhost:5000/">Login with Spotify</a>
            )}
        </div>
    );
}

export default App;
