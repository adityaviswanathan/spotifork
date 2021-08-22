import React, { Component } from 'react';
import SpotifyPlayer from "react-spotify-web-playback";
import { AUTH_ENDPOINT, SPOTIFY_CLIENT_ID, REDIRECT_URI, SCOPES } from "../config";

interface Props {
}

interface Item {
  album: {},
  artists: {}[],
  name: string,
  duration_ms: number
}

interface State {
  is_playing: string;
  item: Item;
  no_data: boolean;
  progress_ms: number;
  token?: string;
}

interface SpotifyAuthPayload {
  access_token?: string
  expires_in?: string
}

export class Player extends Component<Props, State> {
  private interval: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      is_playing: "Paused",
      item: {
      album: {
        images: [{ url: "" }]
      },
      name: "",
      artists: [{ name: "" }],
      duration_ms: 0
      },
      progress_ms: 0,
      no_data: false,
      token: undefined,
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.tick = this.tick.bind(this);
  }
  
  componentDidMount() {
    // Set token
    let _token = this.token().access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getCurrentlyPlaying(_token);
    }
    
    // set interval for polling every 5 seconds
    this.interval = setInterval(() => this.tick(), 5000);
  }
  
  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }
  
  token() {
    const payload: SpotifyAuthPayload =
      window.location.hash
      .substring(1)
      .split("&")
      .reduce(function(acc: SpotifyAuthPayload, curr: string) {
        if (curr) {
          var parts = curr.split("=");
          acc[parts[0] as keyof SpotifyAuthPayload] = decodeURIComponent(parts[1]);
        }
        return acc;
      }, {});
    return payload;
  }
  
  tick() {
    if(this.state.token) {
      this.getCurrentlyPlaying(this.state.token);
    }
  }
  
  getCurrentlyPlaying(token: string) {
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
        return response.json();
      })
      .then(({ item, is_playing, progress_ms }) => {
        console.log(item);
        console.log(is_playing);
        console.log(progress_ms);
        this.setState({
          item: item,
          is_playing: is_playing,
          progress_ms: progress_ms,
          no_data: false
        });
      });
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {!this.state.token && (
            <a className="btn btn--loginApp-link"
               href={`${AUTH_ENDPOINT}?` +
                     `client_id=${SPOTIFY_CLIENT_ID}` +
                     `&redirect_uri=${REDIRECT_URI}` +
                     `&scope=${SCOPES.join("%20")}` +
                     `&response_type=token&show_dialog=true`}>
              Login to Spotify
            </a>
          )}
          {this.state.token && (
            <SpotifyPlayer
              token={this.state.token}
              uris={["spotify:artist:6HQYnRM4OzToCYPpVBInuU"]}
            />
          )}
          {this.state.token && !this.state.no_data && (
            <p>Hello from player {this.state.item.name}</p>
          )}
          {this.state.no_data && (
            <p>
              You need to be playing a song on Spotify, for something to appear here.
            </p>
          )}
        </header>
      </div>
    );
  }
}
