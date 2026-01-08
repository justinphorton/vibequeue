import React, { useState } from "react";
import { songService } from "../services/songService";

export default function QueueList({ items, onRefresh, selectedDevice }) {
  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  // Group songs by header:
  // - GPT: use prompt (or "GPT Recommendations" if missing)
  // - manual: "Manual song search"
  const groups = React.useMemo(() => {
    const map = new Map();

    (items || []).forEach((s) => {
      const src = (s.source || "unknown").toLowerCase();
      let label = "Unlabeled";

      if (src === "gpt") label = (s.prompt || "").trim() || "GPT Recommendations";
      else if (src === "manual") label = "Manual song search";
      else label = src;

      if (!map.has(label)) map.set(label, []);
      map.get(label).push(s);
    });

    // sort by timestamp asc within each group
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      map.set(k, arr);
    }

    return Array.from(map.entries());
  }, [items]);

  const toggleGroup = (label) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const clearHistory = async () => {
    try {
      await songService.clear();
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
      alert("Failed to clear history (is /songs/clear/ in urls.py?)");
    }
  };

  const playFromDb = async (songId) => {
    try {
      await songService.playFromHistory(songId, selectedDevice);
    } catch (e) {
      console.error(e);
      alert("Play failed (Spotify open? logged in? active device?)");
    }
  };

  const queueFromDb = async (songId) => {
    try {
      await songService.queueFromHistory(songId, selectedDevice);
    } catch (e) {
      console.error(e);
      alert("Queue failed (Spotify open? logged in? active device?)");
    }
  };

  return (
    <div>
      <div className="queue-header">
        <h2 className="section-title">Song History</h2>
        <button className="btn btn-outline-danger" onClick={clearHistory}>
          🧹 Clear History
        </button>
      </div>

      {groups.length === 0 && <p className="empty-message">No songs yet.</p>}

      {groups.map(([label, songs]) => {
        const isExpanded = expandedGroups.has(label);
        return (
          <div key={label} className="history-group">
            <div
              className="history-group-header"
              onClick={() => toggleGroup(label)}
            >
              <div className="history-group-label">
                <span className="collapse-icon">{isExpanded ? "▼" : "▶"}</span>
                <span className="group-label-text">{label}</span>
                <span className="group-count">({songs.length} song{songs.length !== 1 ? "s" : ""})</span>
              </div>
            </div>

            {isExpanded && (
              <div className="history-group-content">
                {songs.map((song) => (
                  <div key={song.id} className="history-item">
                    <div className="history-item-info">
                      <div className="history-item-title">{song.title}</div>
                      <div className="history-item-artist">{song.artist}</div>
                      <div className="history-item-timestamp">
                        {song.timestamp ? new Date(song.timestamp).toLocaleString() : ""}
                      </div>
                    </div>

                    <div className="history-item-actions">
                      <button className="btn btn-success btn-sm" onClick={() => playFromDb(song.id)}>
                        ▶️ Play
                      </button>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => queueFromDb(song.id)}>
                        ➕ Queue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
