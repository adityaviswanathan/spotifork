import requests
import typing as t

from app.core.spotify import get_token, get_url, clear_token, set_token
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

@r.post("/token")
async def token(request: Request):
    """
    Fetch token for Spotify client persisted to cache.
    """
    return get_token()
