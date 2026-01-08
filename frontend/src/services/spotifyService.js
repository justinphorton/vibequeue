import api from "./api";

export const spotifyService = {
  getAuthUrl: () => api.get("/get-auth-url/"),

  isAuthenticated: () => api.get("/is-authenticated/"),

  logout: () => api.post("/logout/"),

  getDevices: () => api.get("/devices/"),

  searchTracks: (query) => api.get("/search/", { params: { q: query } }),

  play: (uri, deviceId) =>
    api.put("/play/", {
      uri,
      ...(deviceId && { device_id: deviceId }),
    }),

  pause: (deviceId) => api.put("/pause/", deviceId ? { device_id: deviceId } : {}),

  playPauseToggle: () => api.post("/play-toggle/"),

  queueTrack: (uri, deviceId) =>
    api.post("/queue-uri/", {
      uri,
      ...(deviceId && { device_id: deviceId }),
    }),

  getCurrentPlayback: () => api.get("/current-playback/"),
};
