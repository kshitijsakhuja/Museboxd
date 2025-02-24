import json
import os
import base64
import webbrowser
from dotenv import load_dotenv
from requests import post, get
from urllib.parse import urlencode

# Load environment variables
load_dotenv()

# Spotify API credentials
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

TOKEN_FILE = "tokens.json"  # File to store tokens


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

    json_result = result.json()
    return json_result.get("access_token")


def get_auth_header(token):
    """Return headers for authentication."""
    return {"Authorization": f"Bearer {token}"}


def get_playlist_by_id(token, playlist_id):
    """Get playlist details by ID."""
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}"
    headers = get_auth_header(token)
    result = get(url, headers=headers)

    if result.status_code != 200:
        print("Error fetching playlist:", result.content)
        return None

    return result.json()


def get_playlist_items(token, playlist_id):
    """Get items (tracks) in a playlist."""
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = get_auth_header(token)
    result = get(url, headers=headers)

    if result.status_code != 200:
        print("Error fetching playlist items:", result.content)
        return None

    return result.json()


def get_playlist_cover_image(token, playlist_id):
    """Get the playlist cover image URL."""
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/images"
    headers = get_auth_header(token)
    result = get(url, headers=headers)

    if result.status_code != 200:
        print("Error fetching playlist cover image:", result.content)
        return None

    images = result.json()
    return images[0]["url"] if images else None


def shorten_url(url):
    """Shorten a long URL using TinyURL API."""
    api_url = f"http://tinyurl.com/api-create.php?url={url}"
    response = get(api_url)
    return response.text if response.status_code == 200 else url


def display_playlist_info(playlist_data, playlist_items, cover_image_url):
    """Display playlist details and open/shorten cover image URL."""
    if not playlist_data or not playlist_items:
        print("Error retrieving playlist details.")
        return

    print("\n" + "="*50)
    print(f"🎵 Playlist: {playlist_data['name']}")
    print(f"👤 Created by: {playlist_data['owner']['display_name']}")
    print(f"🎧 Total Tracks: {playlist_data['tracks']['total']}")
    print(f"🔗 Spotify URL: {playlist_data['external_urls']['spotify']}")

    if cover_image_url:
        short_url = shorten_url(cover_image_url)
        print(f"🖼 Cover Image: {short_url} (Opening in browser...)")
        #webbrowser.open(cover_image_url)  # Opens the image automatically

    print("="*50 + "\n")

    print("🎶 Tracks in the Playlist:")
    for idx, item in enumerate(playlist_items.get("items", []), start=1):
        track = item.get("track", {})
        if track:
            print(f"{idx}. {track['name']} - {', '.join(artist['name'] for artist in track['artists'])}")
            print(f"   🔗 Track URL: {track['external_urls']['spotify']}")
            print(f"   📀 Album: {track['album']['name']} ({track['album']['release_date']})")
            print("-" * 50)


# -------------------- MAIN EXECUTION --------------------
token = get_token()

if token:
    playlist_id = "4z5whwZPQuMotubMwwlsLB"  # Update with your playlist ID
    playlist_data = get_playlist_by_id(token, playlist_id)
    playlist_items = get_playlist_items(token, playlist_id)
    cover_image_url = get_playlist_cover_image(token, playlist_id)
    display_playlist_info(playlist_data, playlist_items, cover_image_url)
