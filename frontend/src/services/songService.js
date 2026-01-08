import api from "./api";

export const songService = {
  getAll: () => api.get("/songs/"),

  clear: () => api.post("/songs/clear/"),

  saveManual: (title, artist, uri) =>
    api.post("/songs/save-manual/", { title, artist, uri }),

  getGPTRecommendations: (prompt) =>
    api.post("/song-recs/", { prompt }),

  queueLatest: () => api.post("/queue-latest/"),

  playFromHistory: (songId, deviceId) =>
    api.post(`/songs/${songId}/play/`, deviceId ? { device_id: deviceId } : {}),

  queueFromHistory: (songId, deviceId) =>
    api.post(`/songs/${songId}/queue/`, deviceId ? { device_id: deviceId } : {}),
};
