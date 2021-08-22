import React, { Component } from "react";
import "./player.css";

interface Props {
    item: any;
    is_playing: string;
    progress_ms: number;
}

interface State {
    backgroundStyles: {};
    progressBarStyles: {};
}

class Player extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            backgroundStyles: {
                backgroundImage:`url(${
                  props.item.album.images[0].url
                })`,
            },
            progressBarStyles: {
                width: (props.progress_ms * 100 / props.item.duration_ms) + '%'
            },
        };
    }

    render() {
        return (
            <div className="App">
                <h1>Hello from player {this.props.item.name}</h1>
                <div className="main-wrapper">
                    <div className="now-playing__img">
                        <img alt="album cover" src={this.props.item.album.images[0].url} />
                    </div>
                    <div className="now-playing__side">
                        <div className="now-playing__name">{this.props.item.name}</div>
                        <div className="now-playing__artist">
                            {this.props.item.artists[0].name}
                        </div>
                        <div className="now-playing__status">
                            {this.props.is_playing ? "Playing" : "Paused"}
                        </div>
                        <div className="progress">
                            <div className="progress__bar" style={this.state.progressBarStyles} />
                        </div>
                    </div>
                    <div className="background" style={this.state.backgroundStyles} />{" "}
                </div>
            </div>
        );
    }
  
}

export default Player;
