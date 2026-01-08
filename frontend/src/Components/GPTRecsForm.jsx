import React, { useState } from "react";

function GPTRecsForm({ recPrompt, onPromptChange, onGetRecommendations, isAuthed, loading, lastResults, onClearResults }) {
  const [showResults, setShowResults] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recPrompt.trim() && isAuthed && !loading) {
      setShowResults(true); // Show results when new recs come in
      onGetRecommendations();
    }
  };

  const handleClear = () => {
    onClearResults();
    setShowResults(false);
  };

  return (
    <div>
      <h2 className="section-title">Discover Music with AI</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group-custom">
          <input
            type="text"
            className="form-control-large"
            placeholder="Describe your vibe... (e.g., 'upbeat summer road trip music')"
            name="recPrompt"
            value={recPrompt}
            onChange={onPromptChange}
            disabled={!isAuthed || loading}
          />
          <button
            className="btn btn-primary btn-large"
            type="submit"
            disabled={!recPrompt.trim() || !isAuthed || loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Discovering...
              </>
            ) : (
              <>✨ Get Recommendations</>
            )}
          </button>
        </div>

        {loading && (
          <div className="loading-message">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>AI is finding the perfect songs for your vibe...</p>
          </div>
        )}

        {!loading && lastResults.songs.length === 0 && (
          <small className="text-muted help-text">
            {isAuthed
              ? "AI-powered song recommendations will be automatically queued to your Spotify"
              : "Please login with Spotify to get AI recommendations"}
          </small>
        )}
      </form>

      {!loading && lastResults.songs.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <div>
              <h3 className="results-title">
                ✨ Generated {lastResults.songs.length} songs
              </h3>
              <div className="results-prompt">"{lastResults.prompt}"</div>
            </div>
            <div className="results-actions">
              <button
                className="btn-collapse"
                onClick={() => setShowResults(!showResults)}
              >
                {showResults ? "Hide" : "Show"}
              </button>
              <button className="btn-clear-results" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>

          {showResults && (
            <div className="results-list">
              {lastResults.songs.map((song, idx) => (
                <div key={idx} className="result-item">
                  <div className="result-number">{idx + 1}</div>
                  <div className="result-info">
                    <div className="result-name">{song.title}</div>
                    <div className="result-artist">{song.artist}</div>
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

export default GPTRecsForm;
