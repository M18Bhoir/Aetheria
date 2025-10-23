// src/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL: API_URL });

// Add the interceptor to attach the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Use the standardized key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;