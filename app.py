import os
import requests
from flask import Flask, render_template, redirect, request, session
from dotenv import load_dotenv
from urllib.parse import urlencode

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = "super_secret_key"  # Change this in production

# Spotify API credentials
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = "http://localhost:5000/callback"

# Spotify API URLs
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_USER_PROFILE_URL = "https://api.spotify.com/v1/me"
SPOTIFY_PLAYLISTS_URL = "https://api.spotify.com/v1/me/playlists"
SPOTIFY_SAVED_TRACKS_URL = "https://api.spotify.com/v1/me/tracks"

SCOPES = "user-read-private user-read-email user-library-read playlist-read-private"

@app.route("/")
def index():
    if "access_token" in session:
        return redirect("/profile")
    auth_params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": SCOPES,
    }
    auth_url = f"{SPOTIFY_AUTH_URL}?{urlencode(auth_params)}"
    return render_template("index.html", auth_url=auth_url)

@app.route("/callback")
def callback():
    code = request.args.get("code")
    if not code:
        return "Error: No authorization code received."

    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }
    response = requests.post(SPOTIFY_TOKEN_URL, data=token_data)
    if response.status_code == 200:
        token_info = response.json()
        session["access_token"] = token_info["access_token"]
        return redirect("/profile")
    return "Error: Authentication failed."

def get_spotify_data(url):
    """Helper function to fetch data from Spotify API."""
    if "access_token" not in session:
        return None
    headers = {"Authorization": f"Bearer {session['access_token']}"}
    response = requests.get(url, headers=headers)
    return response.json() if response.status_code == 200 else None

@app.route("/profile")
def profile():
    user_profile = get_spotify_data(SPOTIFY_USER_PROFILE_URL)
    playlists = get_spotify_data(SPOTIFY_PLAYLISTS_URL)
    liked_songs = get_spotify_data(SPOTIFY_SAVED_TRACKS_URL)

    if not user_profile:
        return redirect("/")
    
    return render_template(
        "profile.html", 
        user=user_profile, 
        playlists=playlists.get("items", []) if playlists else [], 
        liked_songs=liked_songs.get("items", []) if liked_songs else []
    )

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
