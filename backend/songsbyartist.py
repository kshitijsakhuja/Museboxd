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
    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8") 

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    result = post(url, headers=headers, data=data)
    
    if result.status_code != 200:
        print("Error fetching token:", result.content)
        return None
    
    json_result = json.loads(result.content)
    return json_result.get("access_token")

def get_auth_header(token):
    return {"Authorization": "Bearer " + token}

def get_songs_by_artist(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
    headers = get_auth_header(token)
    result = get(url, headers=headers)

    if result.status_code != 200:
        print("Error fetching tracks:", result.content)
        return None

    json_result = json.loads(result.content)
    return json_result.get("tracks", [])

def search_for_item(token, search_query, search_type="artist"):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = f"q={search_query}&type={search_type}&limit=1"

    query_url = f"{url}?{query}"
    result = get(query_url, headers=headers)

    if result.status_code != 200:
        print(f"Error searching for {search_type}:", result.content)
        return None

    json_result = json.loads(result.content).get(search_type + "s", {}).get("items", [])

    if not json_result:
        print(f"No {search_type} found with this name...")
        return None

    return json_result[0]

def display_artist_info(artist, songs):
    print("\n" + "="*50)
    print(f"🎤 Artist: {artist['name']}")
    print(f"🎵 Genres: {', '.join(artist['genres']) if artist['genres'] else 'N/A'}")
    print(f"👥 Followers: {artist['followers']['total']:,}")
    print(f"🔗 Spotify URL: {artist['external_urls']['spotify']}")
    print("="*50 + "\n")

    print("🎶 Top Tracks:")
    for idx, song in enumerate(songs, start=1):
        print(f"{idx}. {song['name']} ({song['album']['name']}, {song['album']['release_date']})")
        print(f"   🔗 Spotify URL: {song['external_urls']['spotify']}")
        print("-" * 50)

def display_search_results(title, item):
    if not item:
        print(f"No results found for {title}.")
        return

    print("\n" + "="*50)
    print(f"🎵 {title}")
    print(f"📌 Name: {item['name']}")
    print(f"🔗 Spotify URL: {item['external_urls']['spotify']}")
    
    if "artists" in item:
        print(f"🎤 Artist: {', '.join([artist['name'] for artist in item['artists']])}")
    
    if "album" in item:
        print(f"💿 Album: {item['album']['name']} ({item['album']['release_date']})")
    
    if "followers" in item:
        print(f"👥 Followers: {item['followers']['total']:,}")
    
    print("="*50 + "\n")

# Main Execution
token = get_token()

if token:
    artist_name = "Slowdive"  # Change this to any artist name
    artist = search_for_item(token, artist_name, "artist")
    
    # Search for a playlist
    playlist = search_for_item(token, "Chill Vibes", "playlist")
    display_search_results("Playlist", playlist)

    # Search for a track
    track = search_for_item(token, "Imagine", "track")
    display_search_results("Track", track)

    # Search for an album
    album = search_for_item(token, "Abbey Road", "album")
    display_search_results("Album", album)

    if artist:
        artist_id = artist["id"]
        songs = get_songs_by_artist(token, artist_id)
        
        if songs:
            display_artist_info(artist, songs)
        else:
            print("No top tracks found for this artist.")
