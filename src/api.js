// src/api.js

import axios from 'axios';

const API_BASE_URL = 'https://8000-jorritvans-productivity-9zhpc5cokwg.ws.codeinstitute-ide.net/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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

// Handle token refresh on 401 Unauthorized, excluding login requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Bypass refresh for login endpoint
    if (originalRequest.url.endsWith('/token/')) {
      return Promise.reject(error);
    }

    // Handle token refresh on 401 Unauthorized
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post(
          `${API_BASE_URL}/token/refresh/`,
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        localStorage.setItem('access_token', data.access);
        api.defaults.headers.Authorization = `Bearer ${data.access}`;
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
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

// Add functions for comments
export const fetchComments = (taskId) => api.get(`/comments/?task=${taskId}`);
export const createComment = (data) => api.post('/comments/', data);
// Update comment
export const updateComment = (commentId, updatedData) => {
  return api.patch(`/comments/${commentId}/`, updatedData);
};

// Delete comment
export const deleteComment = (commentId) => {
  return api.delete(`/comments/${commentId}/`);
};

export default api;
