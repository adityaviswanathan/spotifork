from pydantic import BaseModel
import typing as t


class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False
    first_name: str = None
    last_name: str = None

class UserOut(UserBase):
    pass

class UserCreate(UserBase):
    password: str

    class Config:
        orm_mode = True

class UserEdit(UserBase):
    password: t.Optional[str] = None

    class Config:
        orm_mode = True

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"

# MUSIC

class SpotifyMusicArtist(BaseModel):
    id: str
    name: str
    uri: str

class SpotifyMusicAlbum(BaseModel):
    id: str
    image_url: str
    name: str
    uri: str

class SpotifyMusicSong(BaseModel):
    duration: int
    id: str
    name: str
    uri: str

# PODCASTS

class SpotifyPodcastEpisode(BaseModel):
    duration: int
    id: str
    image_url: str
    name: str
    uri: str

# SPOTIFY SEARCH

class SpotifyPodcastSearchResult(BaseModel):
    episode: SpotifyPodcastEpisode

class SpotifyPodcastSearchResults(BaseModel):
    items: t.List[SpotifyPodcastSearchResult]
    paged_url: str

class SpotifyMusicSearchResult(BaseModel):
    album: SpotifyMusicAlbum
    artists: t.List[SpotifyMusicArtist]
    song: SpotifyMusicSong

class SpotifyMusicSearchResults(BaseModel):
    items: t.List[SpotifyMusicSearchResult]
    paged_url: str

class SpotifySearchRequest(BaseModel):
    query: str = None
    content_type: str = ["episode", "track"]

class SpotifySearchResponse(BaseModel):
    music: SpotifyMusicSearchResults
    podcasts: SpotifyPodcastSearchResults

