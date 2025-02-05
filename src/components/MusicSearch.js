import React, { useState } from 'react';
import { searchArtists, getAlbumsByArtist, getSongsByAlbum } from '../utils/musicbrainzApi';

const MusicSearch = () => {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  const handleSearch = async () => {
    const results = await searchArtists(query);
    setArtists(results);
  };

  const handleAlbums = async (artistId) => {
    const results = await getAlbumsByArtist(artistId);
    setAlbums(results);
  };

  const handleSongs = async (albumId) => {
    const results = await getSongsByAlbum(albumId);
    setSongs(results);
  };

  return (
    <div>
      <h1>Museboxd - Music Search</h1>
      <input
        type="text"
        placeholder="Search for an artist..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {artists.length > 0 && (
        <div>
          <h2>Artists</h2>
          <ul>
            {artists.map((artist) => (
              <li key={artist.id}>
                {artist.name} ({artist.country})
                <button onClick={() => handleAlbums(artist.id)}>View Albums</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {albums.length > 0 && (
        <div>
          <h2>Albums</h2>
          <ul>
            {albums.map((album) => (
              <li key={album.id}>
                {album.title}
                <button onClick={() => handleSongs(album.id)}>View Songs</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {songs.length > 0 && (
        <div>
          <h2>Songs</h2>
          <ul>
            {songs.map((song) => (
              <li key={song.id}>{song.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MusicSearch;
