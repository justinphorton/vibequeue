import React, { useState, useEffect } from "react";
import { spotifyService } from "../services/spotifyService";

function NowPlaying({ onPlayPause }) {
  const [playbackState, setPlaybackState] = useState({
    current_track: null,
    next_track: null,
    is_playing: false,
  });

  useEffect(() => {
    fetchPlaybackState();
    const interval = setInterval(fetchPlaybackState, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPlaybackState = async () => {
    try {
      const res = await spotifyService.getCurrentPlayback();
      setPlaybackState(res.data);
    } catch (e) {
      console.error("Failed to fetch playback state", e);
    }
  };

  const handlePlayPause = async () => {
    await onPlayPause();
    // Wait a bit then refresh to get updated state
    setTimeout(fetchPlaybackState, 800);
  };

  const { current_track, next_track, is_playing } = playbackState;

  if (!current_track) {
    return (
      <div className="now-playing no-playback">
        <div className="now-playing-info">
          <div className="track-status">No song playing</div>
        </div>
      </div>
    );
  }

  return (
    <div className="now-playing">
      <div className="now-playing-content">
        {current_track.image && (
          <img src={current_track.image} alt="" className="now-playing-image" />
        )}

        <div className="now-playing-info">
          <div className="now-playing-current">
            <div className="track-status">Now Playing</div>
            <div className="track-name-large">{current_track.name}</div>
            <div className="track-artist">{current_track.artist}</div>
          </div>

          {next_track && (
            <div className="now-playing-next">
              <div className="next-label">Up next</div>
              <div className="next-track">
                {next_track.name} • {next_track.artist}
              </div>
            </div>
          )}
        </div>

        <button
          className="btn-play-pause"
          onClick={handlePlayPause}
          title={is_playing ? "Pause" : "Play"}
        >
          {is_playing ? "Pause" : "Play"}
        </button>
      </div>
    </div>
  );
}

export default NowPlaying;
