import axios from "axios";
import { API_BASE } from "../config";

// create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export default api;
