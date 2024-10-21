// src/api.js

import axios from 'axios';

const API_BASE_URL = 'https://8000-jorritvans-productivity-9zhpc5cokwg.ws.codeinstitute-ide.net/api'; // Updated base URL to include /api

const api = axios.create({
  baseURL: API_BASE_URL, // Updated base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures credentials (cookies/tokens) are sent
});

// Interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh on 401 Unauthorized
api.interceptors.response.use(
  (response) => response, // If the response is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Use full URL for refresh token request to handle CORS
        const { data } = await axios.post(
          `${API_BASE_URL}/token/refresh/`,  // Full URL
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        localStorage.setItem('access_token', data.access);
        api.defaults.headers.Authorization = `Bearer ${data.access}`;
        originalRequest.headers.Authorization = `Bearer ${data.access}`; // Update original request
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new Event('sessionExpired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
