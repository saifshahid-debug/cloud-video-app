// src/api.js
import axios from "axios";

const BASE_URL = "http://localhost:8080"; // backend URL
const getToken = () => localStorage.getItem("token");

const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const api = {
  me: async () => {
    const res = await apiInstance.get("/api/auth/me");
    return res.data;
  },

  login: async ({ email, password }) => {
    const res = await apiInstance.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    return res.data;
  },

  signup: async ({ name, email, password, role }) => {
    const res = await apiInstance.post("/api/auth/signup", { name, email, password, role });
    localStorage.setItem("token", res.data.token);
    return res.data;
  },

  logout: async () => {
    localStorage.removeItem("token");
    return { ok: true };
  },

  // --- FIXED FEED ---
  feed: async ({ cursor = 0, size = 5 } = {}) => {
    const res = await apiInstance.get(`/api/videos/feed?cursor=${cursor}&size=${size}`);
    // prepend full URL to video src
    res.data.items.forEach(v => {
      v.src = BASE_URL + v.src;
    });
    return res.data; // { items: [...], next: cursor+size }
  },

  latest: async () => {
    const res = await apiInstance.get("/api/videos/latest");
    res.data.forEach(v => v.src = BASE_URL + v.src);
    return res.data;
  },

  like: async (vidId) => {
    const res = await apiInstance.post(`/api/videos/${vidId}/like`);
    return res.data;
  },

  comments: async (vidId) => {
    const res = await apiInstance.get(`/api/videos/${vidId}/comments`);
    return res.data;
  },

  addComment: async (vidId, text) => {
    const res = await apiInstance.post(`/api/videos/${vidId}/comments`, { text });
    return res.data;
  },

  upload: async ({ title, genre, file, publisher, producer, ageRating, tags }) => {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    if (publisher) formData.append("publisher", publisher);
    if (producer) formData.append("producer", producer);
    if (genre) formData.append("genre", genre);
    if (ageRating) formData.append("ageRating", ageRating);
    if (tags) formData.append("tags", tags);

    const res = await apiInstance.post("/api/videos/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // return src with full URL
    res.data.src = BASE_URL + res.data.src;
    return res.data;
  },

  search: async (q) => {
    const res = await apiInstance.get(`/api/videos/latest?q=${encodeURIComponent(q)}`);
    res.data.forEach(v => v.src = BASE_URL + v.src);
    return res.data;
  },
};
