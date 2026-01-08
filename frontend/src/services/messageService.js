import api from "./api";

export const messageService = {
  getMessage: () => api.get("/message/"),
};
