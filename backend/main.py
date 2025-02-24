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
    """Retrieve the Spotify API access token using client credentials."""
    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = base64.b64encode(auth_bytes).decode("utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    
    result = post(url, headers=headers, data=data)
    json_result = result.json()

    return json_result.get("access_token")


def get_auth_header(token):
    """Return the authorization header required for Spotify API requests."""
    return {"Authorization": f"Bearer {token}"}


def search_for_item(token, search_query, search_type="artist"):
    """Search for an item (artist, track, album, playlist) on Spotify."""
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = f"q={search_query}&type={search_type}&limit=1"

    query_url = f"{url}?{query}"
    result = get(query_url, headers=headers)
    json_result = result.json().get(search_type + "s", {}).get("items", [])

    if not json_result:
        return None

    return json_result[0]


def display_result(title, item):
    """Display the search results in a structured format."""
    if item:
        print(f"\n{'=' * 40}\n🎵 {title} Details\n{'=' * 40}")
        print(f"🔹 Name: {item.get('name', 'N/A')}")
        print(f"🔹 ID: {item.get('id', 'N/A')}")
        print(f"🔹 URL: {item.get('external_urls', {}).get('spotify', 'N/A')}")

        if 'artists' in item:
            artist_names = ", ".join([artist['name'] for artist in item['artists']])
            print(f"🔹 Artist(s): {artist_names}")

        if 'tracks' in item:
            print(f"🔹 Total Tracks: {item.get('tracks', {}).get('total', 'N/A')}")

        if 'album' in item:
            print(f"🔹 Album: {item['album'].get('name', 'N/A')}")

        if 'owner' in item:
            print(f"🔹 Owner: {item['owner'].get('display_name', 'N/A')}")
    else:
        print(f"\n❌ No results found for {title}.")


# Get access token
token = get_token()

# Search for a playlist, track, and album
playlist = search_for_item(token, "Chill Vibes", "playlist")
track = search_for_item(token, "Imagine", "track")
album = search_for_item(token, "Abbey Road", "album")

# Display the results
display_result("Playlist", playlist)
display_result("Track", track)
display_result("Album", album)
