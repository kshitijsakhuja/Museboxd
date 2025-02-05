import axios from 'axios';

const BASE_URL = 'https://musicbrainz.org/ws/2/';
const HEADERS = {
  'User-Agent': 'Museboxd/1.0 (your@email.com)',
};

// Search for artists by name
export const searchArtists = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}artist`, {
      params: { query, fmt: 'json' },
      headers: HEADERS,
    });
    return response.data.artists || [];
  } catch (error) {
    console.error('Error fetching artists:', error);
    return [];
  }
};

// Get albums by artist ID
export const getAlbumsByArtist = async (artistId) => {
  try {
    const response = await axios.get(`${BASE_URL}release-group`, {
      params: { artist: artistId, fmt: 'json', type: 'album' },
      headers: HEADERS,
    });
    return response.data['release-groups'] || [];
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
};

// Get songs (recordings) by album ID
export const getSongsByAlbum = async (releaseGroupId) => {
  try {
    const response = await axios.get(`${BASE_URL}recording`, {
      params: { release: releaseGroupId, fmt: 'json' },
      headers: HEADERS,
    });
    return response.data.recordings || [];
  } catch (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
};
