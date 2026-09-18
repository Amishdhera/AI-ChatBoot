import axios from "axios";
import { auth } from "../firebase/config";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 30000,
});

// Attach the current user's Firebase ID token on every request. The frontend
// never talks to the AI provider directly — only to this backend.
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.error ||
      (error.code === "ECONNABORTED"
        ? "Request timed out. Please try again."
        : "Network error. Please check your connection.");
    return Promise.reject(new Error(message));
  }
);

export default api;
