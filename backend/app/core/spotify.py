import json
import os
import spotipy

from app.db.schemas import (
    SpotifyMusicAlbum,
    SpotifyMusicArtist,
    SpotifyMusicSearchResult,
    SpotifyMusicSearchResults,
    SpotifyMusicSong,
    SpotifyPodcastEpisode,
    SpotifyPodcastSearchResult,
    SpotifyPodcastSearchResults,
    SpotifySearchResponse
)
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

def _empty_response():
    return SpotifySearchResponse(
        music=SpotifyMusicSearchResults(
            items = []
        ),
        podcasts=SpotifyPodcastSearchResults(
            items = []
        )
    )

def _music_item_to_schema(req):
    return SpotifyMusicSearchResult(
        album=SpotifyMusicAlbum(
            id=req["album"]["id"],
            image_url=req["album"]["images"][0]["url"] \
                      if len(req["album"]["images"]) > 0 else None,
            name=req["album"]["name"],
            uri=req["album"]["uri"]
        ),
        artists=[SpotifyMusicArtist(
            id=i["id"],
            name=i["name"],
            uri=i["uri"]
        ) for i in req["artists"]],
        song=SpotifyMusicSong(
            duration=req["duration_ms"],
            id=req["id"],
            name=req["name"],
            uri=req["uri"]
        )
    )

def _music_to_schema(req):
    if req is None:
        return SpotifyMusicSearchResults(
            items=[]
        )
    return SpotifyMusicSearchResults(
        items=[_music_item_to_schema(i) for i in req["items"]],
        paged_url=req["href"]
    )

def _podcast_item_to_schema(req):
    return SpotifyPodcastSearchResult(
        episode=SpotifyPodcastEpisode(
            duration=req["duration_ms"],
            id=req["id"],
            image_url=req["images"][0]["url"] if len(req["images"]) > 0 else None,
            name=req["name"],
            uri=req["uri"]
        )
    )

def _podcast_to_schema(req):
    if req is None:
        return SpotifyPodcastSearchResults(
            items=[]
        )
    return SpotifyPodcastSearchResults(
        items=[_podcast_item_to_schema(i) for i in req["items"]],
        paged_url=req["href"]
    )

def _response_to_schema(req):
    return SpotifySearchResponse(
        music=_music_to_schema(req.get("tracks")),
        podcasts=_podcast_to_schema(req.get("episodes"))
    )

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

def search_library(payload):
    if len(payload.query) == 0:
        return _empty_response()
    s = spotipy.Spotify(auth_manager.get_cached_token()["access_token"])
    res = s.search(payload.query, type=",".join(payload.content_type))
    return _response_to_schema(res)

def set_token(token):
    auth_info = auth_manager.get_access_token(token)

def get_url():
    return auth_manager.get_authorize_url()

