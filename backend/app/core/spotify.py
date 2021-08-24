import os
import spotipy

from spotipy.oauth2 import SpotifyOAuth

AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
CACHE = ".spotifyoauthcache"
REDIRECT_URI = "http://localhost:8000/api/spotify/login"
SCOPES = [
	"streaming",
    "user-top-read",
    "user-read-currently-playing",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
]

auth_manager = SpotifyOAuth(
    cache_path=CACHE,
    client_id=os.environ["SPOTIFY_CLIENT_ID"],
    client_secret=os.environ["SPOTIFY_CLIENT_SECRET"],
    redirect_uri=REDIRECT_URI,
    scope=" ".join(SCOPES))

def clear_token():
    try:
        os.remove(CACHE)
    except:
        pass
    return {"status": "cleared token"}

def get_token():
    if auth_manager.get_cached_token():
        s = spotipy.Spotify(auth_manager.get_cached_token()["access_token"])
        return {
            "access_token" : auth_manager.get_cached_token()["access_token"],
            "refresh_token" : auth_manager.get_cached_token()["refresh_token"],
            "status": "retrieved token"
        }
    return {
        "url": auth_manager.get_authorize_url(),
        "status": "must first authorize via URL before tokens can be granted"
    }

def set_token(token):
    auth_info = auth_manager.get_access_token(token)

def get_url():
    return auth_manager.get_authorize_url()

