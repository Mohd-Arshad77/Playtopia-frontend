import axios from "axios";

const api = axios.create({
  // Uses VITE_API_URL from .env — localhost in dev, Render URL in production
  baseURL: import.meta.env.VITE_API_URL || "https://playtopia-backend.onrender.com/api",
  withCredentials: true,  // needed to send/receive cookies cross-origin
});

// Attach JWT from localStorage as Bearer token fallback (for cross-origin prod)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor — if 401, clear stale auth and redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear stale auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;