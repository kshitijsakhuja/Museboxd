from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json

# Load environment variables
load_dotenv()

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

def get_token():
    """Retrieve access token from Spotify API."""
    auth_string = f"{client_id}:{client_secret}"
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
    return {"Authorization": f"Bearer {token}"}


def get_albums(token):
    """Get a list of new album releases from Spotify API."""
    url = "https://api.spotify.com/v1/browse/new-releases"
    headers = get_auth_header(token)

    result = get(url, headers=headers)

    if result.status_code != 200:
        print("Error fetching albums:", result.content)
        return None

    return result.json()


def get_album_by_ids(album_ids, token):
    """Get album details from Spotify API using multiple album IDs."""
    url = f"https://api.spotify.com/v1/albums?ids={','.join(album_ids)}"
    headers = get_auth_header(token)

    result = get(url, headers=headers)

    if result.status_code != 200:
        print("Error fetching album details:", result.content)
        return None

    return result.json()


def get_album_tracks(album_id, token):
    """Get track details from a specific album using the Spotify API."""
    url = f"https://api.spotify.com/v1/albums/{album_id}/tracks"
    headers = get_auth_header(token)

    result = get(url, headers=headers)

    if result.status_code != 200:
        print("Error fetching album tracks:", result.content)
        return None

    return result.json()


def display_new_releases(albums_data):
    """Display new album releases in an organized format."""
    if not albums_data:
        print("No album data available.")
        return

    print("\n" + "=" * 50)
    print("🎶 NEW ALBUM RELEASES 🎶")
    print("=" * 50)

    for idx, album in enumerate(albums_data.get("albums", {}).get("items", []), start=1):
        print(f"{idx}. {album['name']} - {', '.join(artist['name'] for artist in album['artists'])}")
        print(f"   📅 Release Date: {album['release_date']}")
        print(f"   🔗 Spotify URL: {album['external_urls']['spotify']}")
        print("-" * 50)


def display_album_details(album_data):
    """Display detailed information about multiple albums."""
    if not album_data:
        print("No album details available.")
        return

    print("\n" + "=" * 50)
    print("📀 ALBUM DETAILS 📀")
    print("=" * 50)

    for album in album_data.get("albums", []):
        print(f"🎵 Album: {album['name']} - {', '.join(artist['name'] for artist in album['artists'])}")
        print(f"   📅 Release Date: {album['release_date']}")
        print(f"   🏷️ Label: {album['label']}")
        print(f"   🔗 Spotify URL: {album['external_urls']['spotify']}")
        print(f"   🎼 Total Tracks: {album['total_tracks']}")

        print("   📜 Tracklist:")
        for track in album.get("tracks", {}).get("items", []):
            print(f"      - {track['name']} ({track['duration_ms'] // 60000}:{(track['duration_ms'] // 1000) % 60:02d})")
        print("-" * 50)


def display_album_tracks(tracks_data):
    """Display track details from an album."""
    if not tracks_data:
        print("No track data available.")
        return

    print("\n" + "=" * 50)
    print("🎵 ALBUM TRACKLIST 🎵")
    print("=" * 50)

    for idx, track in enumerate(tracks_data.get("items", []), start=1):
        duration_minutes = track["duration_ms"] // 60000
        duration_seconds = (track["duration_ms"] // 1000) % 60
        print(f"{idx}. {track['name']} ({duration_minutes}:{duration_seconds:02d})")
        print(f"   🔗 Spotify URL: {track['external_urls']['spotify']}")
        print("-" * 50)


# Main Execution
token = get_token()

if token:
    # Fetch new album releases
    albums_data = get_albums(token)
    display_new_releases(albums_data)

    # Fetch specific album details
    album_ids = ["382ObEPsp2rxGrnsizN5TX", "1ATL5GLyefJaxhQzSPVrLX"]  # Example Album IDs
    album_data = get_album_by_ids(album_ids, token)
    display_album_details(album_data)

    # Fetch tracks from a specific album
    album_id = "382ObEPsp2rxGrnsizN5TX"  # Example Album ID
    album_tracks = get_album_tracks(album_id, token)
    display_album_tracks(album_tracks)
