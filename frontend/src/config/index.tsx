export const BASE_URL: string = 'http://localhost:8000';
export const BACKEND_URL: string =
  'http://localhost:8000/api/v1';
export const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
export const SPOTIFY_CLIENT_ID = "bb1e2a967eb84e79add514a375bc2b39";
export const REDIRECT_URI = "http://localhost:8000/player";
export const SCOPES = [
	"streaming",
    "user-top-read",
    "user-read-currently-playing",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
];
