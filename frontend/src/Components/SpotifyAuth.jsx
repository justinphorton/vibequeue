import React from "react";

function SpotifyAuth({ isAuthed, loadingAuth, authError, onLogin, onLogout }) {
  return (
    <div className="card shadow-lg mb-4">
      <div className="card-header">Spotify Login</div>
      <div className="card-body">
        {loadingAuth ? (
          <p>Checking login</p>
        ) : isAuthed ? (
          <div>
            <p>You are logged in to Spotify</p>
            <button className="btn btn-outline-danger" onClick={onLogout}>
              Log out
            </button>
          </div>
        ) : (
          <>
            <p>Not logged in</p>
            <button className="btn btn-success" onClick={onLogin}>
              Log in with Spotify
            </button>
          </>
        )}
        {authError && <p className="text-danger mt-2">{authError}</p>}
      </div>
    </div>
  );
}

export default SpotifyAuth;
