import json
import os
import base64
from dotenv import load_dotenv
from requests import post, get

# Load environment variables
load_dotenv()

# Spotify API credentials
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")


def get_token():
    """Get Spotify access token using Client Credentials flow."""
    auth_string = f"{CLIENT_ID}:{CLIENT_SECRET}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}

    result = post(url, headers=headers, data=data)

    if result.status_code != 200:
        print("Error fetching token:", result.content)
        return None

    return result.json().get("access_token")


def get_auth_header(token):
    """Return headers for authentication."""
    return {"Authorization": f"Bearer {token}"}


def get_artist(artist_id, token):
    """Get artist details from Spotify API using their ID."""
    url = f"https://api.spotify.com/v1/artists/{artist_id}"
    headers = get_auth_header(token)

    result = get(url, headers=headers)

    if result.status_code != 200:
        print("Error fetching artist details:", result.content)
        return None

    return result.json()


def get_artist_top_tracks(artist_id, token, country="US"):
    """Get an artist's top tracks from Spotify API."""
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?market={country}"
    headers = get_auth_header(token)

    result = get(url, headers=headers)

    if result.status_code != 200:
        print("Error fetching artist's top tracks:", result.content)
        return None

    return result.json()


def display_artist_info(artist_data):
    """Display artist details in a structured format."""
    if not artist_data:
        print("No artist data available.")
        return

    print("\n" + "=" * 50)
    print(f"🎤 Artist: {artist_data['name']}")
    print("=" * 50)
    print(f"📌 Genre(s): {', '.join(artist_data['genres']) if artist_data['genres'] else 'N/A'}")
    print(f"🌍 Popularity: {artist_data['popularity']} / 100")
    print(f"👥 Followers: {artist_data['followers']['total']:,}")
    print(f"🔗 Spotify URL: {artist_data['external_urls']['spotify']}")
    print("=" * 50)


def display_top_tracks(top_tracks_data, artist_name):
    """Display an artist's top tracks in an organized format."""
    if not top_tracks_data:
        print(f"No top tracks available for {artist_name}.")
        return

    print(f"\n🎶 {artist_name}'s Top Tracks 🎶")
    print("-" * 50)

    for idx, track in enumerate(top_tracks_data.get("tracks", []), start=1):
        duration_ms = track["duration_ms"]
        minutes = duration_ms // 60000
        seconds = (duration_ms // 1000) % 60

        print(f"{idx}. {track['name']} - {minutes}:{seconds:02d} min")
        print(f"   🔗 Spotify URL: {track['external_urls']['spotify']}")
        print("-" * 50)


# Main Execution
token = get_token()

if token:
    # Artist IDs
    artists = [
        {"id": "1Xyo4u8uXC1ZmMpatF05PJ", "name": "The Weeknd"},
        {"id": "57dN52uHvrHOxijzpIgu3E", "name": "Artist 2"}  # Replace with actual name
    ]

    for artist in artists:
        # Fetch and display artist details
        artist_data = get_artist(artist["id"], token)
        if artist_data:
            display_artist_info(artist_data)

        # Fetch and display top tracks
        top_tracks = get_artist_top_tracks(artist["id"], token)
        if top_tracks:
            display_top_tracks(top_tracks, artist["name"])
