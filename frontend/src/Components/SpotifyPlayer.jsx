import React, { useState, useEffect } from "react";
import { spotifyService } from "../services/spotifyService";
import { songService } from "../services/songService";

function SpotifyPlayer({ selectedDevice, onDeviceChange, onSongSaved }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(true);

  useEffect(() => {
    listDevices();
  }, []);

  const listDevices = async () => {
    try {
      const res = await spotifyService.getDevices();
      setDevices(res.data.devices || []);
    } catch (e) {
      console.error(e);
      setDevices([]);
    }
  };

  const searchTracks = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setShowResults(true);

    try {
      const res = await spotifyService.searchTracks(query);
      setSearchResults(res.data.items || []);
    } catch (e) {
      console.error(e);
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const saveManualToDb = async (track) => {
    try {
      await songService.saveManual(track.name, track.artist, track.uri);
      if (onSongSaved) onSongSaved();
    } catch (e) {
      console.error("Failed to save manual song to DB", e);
    }
  };

  const playTrack = async (track) => {
    const device_id = selectedDevice || undefined;

    try {
      await spotifyService.play(track.uri, device_id);
      await saveManualToDb(track);
    } catch (e) {
      console.error(e);
      setError("Could not start playback. Is Spotify open?");
    }
  };

  const queueTrack = async (track) => {
    const device_id = selectedDevice || undefined;

    try {
      await spotifyService.queueTrack(track.uri, device_id);
      await saveManualToDb(track);
    } catch (e) {
      console.error(e);
      setError("Could not add to queue. Is Spotify open/active device?");
    }
  };

  return (
    <div>
      <h2 className="section-title">Manual Search</h2>

      <div className="spotify-controls">
        <div className="device-selector">
          <label className="form-label-small">Playback Device</label>
          <div className="input-group-inline">
            <select
              className="form-select-small"
              value={selectedDevice || ""}
              onChange={(e) => onDeviceChange?.(e.target.value)}
            >
              <option value="">Auto (active device)</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} {d.is_active ? "✓" : ""}
                </option>
              ))}
            </select>
            <button className="btn btn-sm btn-outline-secondary" onClick={listDevices}>
              🔄
            </button>
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            className="form-control"
            placeholder="Search for a song..."
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchTracks()}
          />
          <button className="btn btn-primary" onClick={searchTracks}>
            🔍 Search
          </button>
        </div>
      </div>

      {loading && <p className="status-message">Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {searchResults.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h3 className="results-title">
              🔍 Found {searchResults.length} songs
            </h3>
            <div className="results-actions">
              <button
                className="btn-collapse"
                onClick={() => setShowResults(!showResults)}
              >
                {showResults ? "Hide" : "Show"}
              </button>
              <button
                className="btn-clear-results"
                onClick={() => setSearchResults([])}
              >
                Clear
              </button>
            </div>
          </div>

          {showResults && (
            <div className="search-results">
              {searchResults.map((t) => (
                <div key={t.id} className="track-item">
                  <div className="track-info">
                    {t.image && (
                      <img
                        src={t.image}
                        alt=""
                        className="track-image"
                      />
                    )}
                    <div className="track-details">
                      <div className="track-name">{t.name}</div>
                      <div className="track-meta">
                        {t.artist} • {t.album}
                      </div>
                    </div>
                  </div>

                  <div className="track-actions">
                    <button className="btn btn-success btn-sm" onClick={() => playTrack(t)}>
                      ▶️ Play
                    </button>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => queueTrack(t)}>
                      ➕ Queue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SpotifyPlayer;
