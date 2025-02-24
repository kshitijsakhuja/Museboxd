import json
import os
from flask import app, redirect, session, url_for
import requests
import webbrowser
from dotenv import load_dotenv
from urllib.parse import urlencode

# Load environment variables
load_dotenv()

# Spotify API credentials
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = "http://localhost:5000/callback"

# Spotify API URLs
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
SPOTIFY_USER_PROFILE_URL = "https://api.spotify.com/v1/me"

TOKEN_FILE = "tokens.json"  # File to store tokens


def save_tokens(access_token, refresh_token):
    """Save tokens to a JSON file."""
    with open(TOKEN_FILE, "w") as file:
        json.dump({"access_token": access_token, "refresh_token": refresh_token}, file)


def load_tokens():
    """Load tokens from the file."""
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, "r") as file:
            return json.load(file)
    return None


def refresh_access_token(refresh_token):
    """Refresh the access token using the refresh token."""
    data = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }
    response = requests.post(SPOTIFY_TOKEN_URL, data=data)
    if response.status_code == 200:
        new_token_info = response.json()
        access_token = new_token_info.get("access_token")
        save_tokens(access_token, refresh_token)  # Save new access token
        return access_token
    else:
        print("❌ Error refreshing token:", response.json())
        return None


def authenticate_user():
    """Authenticate the user and obtain tokens."""
    tokens = load_tokens()
    
    if tokens:
        return tokens["access_token"]

    print("\n🔹 No stored token found. Starting authentication...")
    
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": "user-read-private user-read-email",
    }
    
    auth_url = f"{SPOTIFY_AUTH_URL}?{urlencode(params)}"
    print("🔗 Open this URL in your browser and authorize the app:", auth_url)
    
    webbrowser.open(auth_url)
    
    auth_code = input("\nPaste the authorization code here: ").strip()
    
    data = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }
    
    response = requests.post(SPOTIFY_TOKEN_URL, data=data)
    
    if response.status_code == 200:
        token_info = response.json()
        access_token = token_info["access_token"]
        refresh_token = token_info["refresh_token"]
        save_tokens(access_token, refresh_token)  # Save tokens for future use
        print("\n✅ Authentication Successful!")
        return access_token
    else:
        print("\n❌ Authentication Failed.")
        exit()


def get_user_data(access_token):
    """Fetch user profile data for the logged-in user."""
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(SPOTIFY_USER_PROFILE_URL, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print("❌ Error fetching user data:", response.json())
        return None


def display_user_profile(user_profile):
    """Display user profile in a structured format."""
    print("\n🎵 User Profile:")
    print(f"   👤 Name: {user_profile.get('display_name', 'N/A')}")
    print(f"   📧 Email: {user_profile.get('email', 'N/A')}")
    print(f"   🌍 Country: {user_profile.get('country', 'N/A')}")
    print(f"   🆔 ID: {user_profile.get('id', 'N/A')}")
    print(f"   🔗 Profile URL: {user_profile.get('external_urls', {}).get('spotify', 'N/A')}")

@app.route('/profile')
def logout():
    session.clear()  # Clears all session data
    return redirect(url_for('index'))


# -------------------- MAIN PROGRAM --------------------
access_token = authenticate_user()

# Refresh token if expired
user_profile = get_user_data(access_token)
if not user_profile:
    print("\n🔄 Access token expired. Refreshing...")
    tokens = load_tokens()
    access_token = refresh_access_token(tokens["refresh_token"])
    user_profile = get_user_data(access_token)

# Display user data
if user_profile:
    display_user_profile(user_profile)
