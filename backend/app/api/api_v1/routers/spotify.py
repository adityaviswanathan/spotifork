import requests
import typing as t

from app.core.spotify import (
    clear_token,
    get_token,
    get_url,
    search_library,
    set_token
)
from app.db.schemas import SpotifySearchRequest, SpotifySearchResponse
from fastapi import APIRouter, Request, Depends, Response, encoders
from fastapi.responses import HTMLResponse
from starlette.responses import RedirectResponse

spotify_router = r = APIRouter()

@r.get("/login")
async def login(request: Request):
    """
    Authenticate Spotify client.
    """
    token_data = get_token()
    if request.query_params.get("code") != None:
        set_token(request.query_params.get("code"))
        return RedirectResponse("/player")
    return {"url": get_url()}

@r.get("/logout")
async def logout(request: Request):
    """
    Logout of Spotify client.
    """
    return clear_token()

@r.post("/search",
        response_model=SpotifySearchResponse,
        response_model_exclude_none=True)
async def search(request: Request,
                 payload: SpotifySearchRequest):
    """
    Search Spotify library.
    """
    return search_library(payload)

@r.post("/token")
async def token(request: Request):
    """
    Fetch token for Spotify client persisted to cache.
    """
    return get_token()
