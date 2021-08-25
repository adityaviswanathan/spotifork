import React, { FC, useState } from 'react';
import SpotifyPlayer from "react-spotify-web-playback";

interface Props {
}

interface Item {
  album: {},
  artists: {}[],
  name: string,
  duration_ms: number
}

export const Player: FC = () => {
  const [isPlaying, setIsPlaying] = useState<string>('Paused');
  const [progressMs, setProgressMs] = useState<number>(0);
  const [item, setItem] = useState<Item>({
    album: {
      images: [{ url: "" }]
    },
    name: "",
    artists: [{ name: "" }],
    duration_ms: 0
  });
  const [noData, setNoData] = useState<boolean>(true);
  const [token, setToken] = useState<string | undefined>(undefined);

  const getCurrentlyPlaying = (token: string) => {
    // Make a call using the token
    const request = new Request('https://api.spotify.com/v1/me/player', {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        if (response.status !== 200) {
          throw new Error("No currently playing tracks discoverable");
        }
        return response.json();
      })
      .then(({ item, is_playing, progress_ms }) => {
        console.log(item);
        console.log(is_playing);
        console.log(progress_ms);
        setItem(item);
        setIsPlaying(is_playing);
        setProgressMs(progress_ms);
        setNoData(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const loginSpotify = async (_: React.MouseEvent) => {
    const request = new Request('/api/spotify/login', {
      method: 'GET'
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.hasOwnProperty('url')) {
          window.location.href = data.url;
        }
      });
  };

  const logoutSpotify = async (_: React.MouseEvent) => {
    const request = new Request('/api/spotify/logout', {
      method: 'GET'
    });
    const response = await fetch(request);
    if (response.status === 500) {
      throw new Error('Internal server error');
    }
    setToken(undefined);
  };

  const getSpotifyToken = async () => {
    const request = new Request('/api/spotify/token', {
      method: 'POST'
    });
    const response = await fetch(request);
    if (response.status === 500) {
      throw new Error('Internal server error');
    }
    const data = await response.json();
    if (data.hasOwnProperty('access_token')) {
      setToken(data.access_token);
    }
  };

  // const tick = () => {
  //   if(token) {
  //     getCurrentlyPlaying(token);
  //   }
  // }
  getSpotifyToken();
  // setInterval(() => tick(), 5000);

  return (
    <div className="App">
      <header className="App-header">
        {!token && (
          <button className="btn"
             onClick={loginSpotify}>
            Login to Spotify
          </button>
        )}
        {token && [
          <SpotifyPlayer
            token={token}
            uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
            key="player"
          />,
          <button className="btn"
                  key="logout"
                  onClick={logoutSpotify}>
            Logout of Spotify
          </button>
        ]}
        {token && !noData && (
          <p>Currently playing: {item.name}</p>
        )}
        {token && noData && (
          <p>
            You need to be playing a song on Spotify for something to appear here.
          </p>
        )}
      </header>
    </div>
  );
};
