import "./App.css";
import { useState, useEffect } from "react";
import QueueList from "./Components/QueueList";
import SpotifyPlayer from "./Components/SpotifyPlayer";
import SpotifyAuth from "./Components/SpotifyAuth";
import GPTRecsForm from "./Components/GPTRecsForm";
import NowPlaying from "./Components/NowPlaying";
import { songService } from "./services/songService";
import { spotifyService } from "./services/spotifyService";

function App() {
  const [details, setDetails] = useState([]);
  const [recPrompt, setRecPrompt] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [lastGPTRecs, setLastGPTRecs] = useState({ prompt: "", songs: [] });

  useEffect(() => {
    refreshSongs();
    checkAuth();
  }, []);

  const refreshSongs = async () => {
    try {
      const res = await songService.getAll();
      setDetails(res.data || []);
    } catch (e) {
      // ignore
    }
  };

  const checkAuth = async () => {
    try {
      setLoadingAuth(true);
      setAuthError("");
      const res = await spotifyService.isAuthenticated();
      const authed = Boolean(res.data?.status);
      setIsAuthed(authed);
    } catch (e) {
      setIsAuthed(false);
      setAuthError("Auth check failed");
    } finally {
      setLoadingAuth(false);
    }
  };

  const startLogin = async () => {
    try {
      const res = await spotifyService.getAuthUrl();
      if (res.data && res.data.url) {
        // Redirect current page to Spotify auth
        window.location.href = res.data.url;
      } else {
        setAuthError("Failed to get Spotify auth URL");
      }
    } catch (e) {
      setAuthError(`Login failed: ${e.message}`);
    }
  };

  const logout = async () => {
    try {
      await spotifyService.logout();
    } catch (e) {
      // ignore
    } finally {
      checkAuth();
      refreshSongs();
    }
  };

  const togglePlayPause = async () => {
    try {
      await spotifyService.playPauseToggle();
    } catch (e) {
      console.error("Failed to toggle play/pause", e);
    }
  };

  const queueLatest = async () => {
    try {
      await songService.queueLatest();
    } catch (e) {
      console.error("Failed to queue latest songs", e);
    }
  };

  const handleSongRecs = () => {
    if (!recPrompt) return;

    const currentPrompt = recPrompt; // Save the prompt before clearing
    setLoadingRecs(true);
    songService
      .getGPTRecommendations(recPrompt)
      .then((res) => {
        const created = res.data || [];
        setDetails((prev) => [...prev, ...created]);
        // Store recommendations with the prompt
        setLastGPTRecs({ prompt: currentPrompt, songs: created });
        setRecPrompt("");
        return queueLatest();
      })
      .catch((err) => console.error("Failed to get GPT song recs", err))
      .finally(() => setLoadingRecs(false));
  };


  return (
    <div className="App">
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">VibeQueue</h1>
          <p className="hero-subtitle">Find music you vibe with</p>
        </div>

        <div className="hero-controls">
          {isAuthed ? (
            <button className="btn-text" onClick={logout}>
              Logout
            </button>
          ) : (
            <button className="btn btn-success" onClick={startLogin}>
              {loadingAuth ? "Checking..." : "Login with Spotify"}
            </button>
          )}
        </div>
      </header>

      {isAuthed && (
        <NowPlaying onPlayPause={togglePlayPause} />
      )}

      {authError && (
        <div className="alert-error">
          {authError}
        </div>
      )}

      <main className="layout">
        <section className="card card-gptRecs central-feature">
          <GPTRecsForm
            recPrompt={recPrompt}
            onPromptChange={(e) => setRecPrompt(e.target.value)}
            onGetRecommendations={handleSongRecs}
            isAuthed={isAuthed}
            loading={loadingRecs}
            lastResults={lastGPTRecs}
            onClearResults={() => setLastGPTRecs({ prompt: "", songs: [] })}
          />
        </section>

        {isAuthed && (
          <section className="card card-spotify">
            <SpotifyPlayer
              selectedDevice={selectedDevice}
              onDeviceChange={setSelectedDevice}
              onSongSaved={refreshSongs}
            />
          </section>
        )}

        <section className="card card-queueList">
          <QueueList
            items={details}
            onRefresh={refreshSongs}
            selectedDevice={selectedDevice}
          />
        </section>
      </main>

      <footer className="footer">VibeQueue</footer>
    </div>
  );
}

export default App;
