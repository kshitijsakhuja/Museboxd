from dotenv import load_dotenv
import os
import base64
from requests import post, get

# Load environment variables
load_dotenv()

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")


def get_token():
    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = base64.b64encode(auth_bytes).decode("utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}

    response = post(url, headers=headers, data=data)
    response.raise_for_status()
    return response.json().get("access_token")


def get_auth_header(token):
    return {"Authorization": f"Bearer {token}"}


def search_all_types(token, search_query):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    search_types = "artist,album,track,playlist,show"
    query = f"q={search_query}&type={search_types}&limit=1"

    response = get(f"{url}?{query}", headers=headers)
    response.raise_for_status()

    data = response.json()

    results = {}
    for search_type in ["artist", "album", "track", "playlist", "show"]:
        items = data.get(f"{search_type}s", {}).get("items", [])
        if items:
            results[search_type] = items[0]

    return results


def display_results(results, search_query):
    if not results:
        print(f"\n❌ No result found for '{search_query}'.")
        return

    print(f"\nResults for '{search_query}':\n{'='*40}")

    for search_type, item in results.items():
        print(f"\n🎵 {search_type.capitalize()} Details\n{'-'*30}")
        print(f"🔹 Name: {item.get('name', 'N/A')}")
        print(f"🔹 ID: {item.get('id', 'N/A')}")
        print(f"🔹 URL: {item.get('external_urls', {}).get('spotify', 'N/A')}")

        if search_type == "track":
            artist_names = ", ".join([artist['name'] for artist in item.get('artists', [])])
            print(f"🔹 Artist(s): {artist_names}")
            print(f"🔹 Album: {item.get('album', {}).get('name', 'N/A')}")

        elif search_type == "album":
            artist_names = ", ".join([artist['name'] for artist in item.get('artists', [])])
            print(f"🔹 Artist(s): {artist_names}")
            print(f"🔹 Total Tracks: {item.get('total_tracks', 'N/A')}")

        elif search_type == "playlist":
            print(f"🔹 Owner: {item.get('owner', {}).get('display_name', 'N/A')}")
            print(f"🔹 Total Tracks: {item.get('tracks', {}).get('total', 'N/A')}")

        elif search_type == "artist":
            print(f"🔹 Genres: {', '.join(item.get('genres', ['N/A']))}")
            print(f"🔹 Followers: {item.get('followers', {}).get('total', 'N/A')}")
            print(f"🔹 Popularity: {item.get('popularity', 'N/A')}")

        elif search_type == "show":
            print(f"🔹 Publisher: {item.get('publisher', 'N/A')}")
            print(f"🔹 Total Episodes: {item.get('total_episodes', 'N/A')}")


# Usage
token = get_token()
search_query = input("Enter the name to search: ").strip()

results = search_all_types(token, search_query)
display_results(results, search_query)
