export async function getSpotifyToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/spotify/token");

    if (!response.ok) {
      console.error("Failed to fetch token:", await response.text());
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    return null;
  }
}

export async function searchSpotify(query: string, types = "artist,album,track,playlist", limit = "20", offset = "0") {
  try {
    if (!query.trim()) {
      return null;
    }

    console.log(`Searching for "${query}" with types: ${types}, limit: ${limit}, offset: ${offset}`);

    const response = await fetch(
      `/api/spotify/search?q=${encodeURIComponent(query)}&types=${types}&limit=${limit}&offset=${offset}`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to search Spotify:", errorText);
      throw new Error(`Search failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Search results:", data);
    return data;
  } catch (error) {
    console.error("Error searching Spotify:", error);
    throw error;
  }
}

export async function getGenres() {
  try {
    const response = await fetch("/api/spotify/genres");

    if (!response.ok) {
      console.error("Failed to fetch genres:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting genres:", error);
    return null;
  }
}

export async function getGenreArtists(genre: string, limit = 20, offset = 0) {
  try {
    const response = await fetch(`/api/spotify/genres/${encodeURIComponent(genre)}?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      console.error("Failed to fetch genre artists:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting genre artists:", error);
    return null;
  }
}

export async function getUserLikedTracks(limit = 20, offset = 0) {
  try {
    const response = await fetch(`/api/spotify/me/tracks?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      console.error("Failed to fetch user liked tracks:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting user liked tracks:", error);
    return null;
  }
}

export async function getUserPlaylists() {
  try {
    const response = await fetch("/api/spotify/me/playlists");

    if (!response.ok) {
      console.error("Failed to fetch user playlists:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting user playlists:", error);
    return null;
  }
}

export async function getRecentlyPlayed() {
  try {
    const response = await fetch("/api/spotify/me/recently-played");

    if (!response.ok) {
      console.error("Failed to fetch recently played tracks:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting recently played tracks:", error);
    return null;
  }
}

export async function getNewReleases() {
  try {
    const response = await fetch("/api/spotify/new-releases");

    if (!response.ok) {
      console.error("Failed to fetch new releases:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting new releases:", error);
    return null;
  }
}

export async function getPlaylist(id: string) {
  try {
    const response = await fetch(`/api/spotify/playlist/${id}`);

    if (!response.ok) {
      console.error("Failed to fetch playlist:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting playlist:", error);
    return null;
  }
}

export async function getPlaylistTracks(id: string) {
  try {
    const response = await fetch(`/api/spotify/playlist/${id}/tracks`);

    if (!response.ok) {
      console.error("Failed to fetch playlist tracks:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting playlist tracks:", error);
    return null;
  }
}

export async function getRecommendations() {
  try {
    const response = await fetch("/api/spotify/recommendations");

    if (!response.ok) {
      console.error("Failed to fetch recommendations:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return null;
  }
}

export async function getAIRecommendations() {
  try {
    const response = await fetch("/api/spotify/ai-recommendations");

    if (!response.ok) {
      const errorText = await response.text(); // Read the error response
      console.error("Failed to fetch AI recommendations:", errorText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    return null;
  }
}

export async function getPersonalizedRecommendations() {
  try {
    const response = await fetch("/api/spotify/personalized-recommendations");

    if (!response.ok) {
      const errorText = await response.text(); // Read the error response
      console.error("Failed to fetch personalized recommendations:", errorText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting personalized recommendations:", error);
    return null;
  }
}