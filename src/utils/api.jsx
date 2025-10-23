import axios from 'axios';

// Get the user's token from localStorage
const token = localStorage.getItem('token');

// Create a new Axios instance
const api = axios.create({
  // --- IMPORTANT ---
  // Set your backend's base URL here
  // This is the URL your server.js is running on
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Interceptor for requests
 * * This logic automatically adds the 'Authorization' header to every
 * request before it is sent.
 */
api.interceptors.request.use(
  (config) => {
    // Get the most up-to-date token from localStorage
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      config.headers['Authorization'] = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor for responses
 * * This logic checks for 401 (Unauthorized) errors.
 * This is useful if a token expires. It logs the user out and 
 * redirects them to the login page.
 */
api.interceptors.response.use(
  (res) => {
    // Any status code within 2xx triggers this
    return res;
  },
  (err) => {
    // Any status code outside 2xx triggers this
    if (err.response && err.response.status === 401) {
      // 1. Token is invalid or expired
      console.error('Unauthorized! Logging out.');
      
      // 2. Remove the invalid token
      localStorage.removeItem('token');
      
      // 3. Redirect to the login page
      // (This assumes you are using React Router)
      window.location.href = '/login'; 
    }
    return Promise.reject(err);
  }
);

export default api;