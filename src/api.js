import axios from 'axios';

// Use environment variable for API base URL, default to a local URL if not set
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials for CORS requests
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.url.endsWith('/token/')) {
      return Promise.reject(error);
    }
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
        localStorage.setItem('access_token', data.access); // Update access token
        api.defaults.headers.Authorization = `Bearer ${data.access}`; // Update default authorization header
        originalRequest.headers.Authorization = `Bearer ${data.access}`; // Retry original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new Event('sessionExpired')); // Handle session expiration
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Add functions for comments and tasks
export const fetchComments = (taskId) => api.get(`/comments/?task=${taskId}`);
export const createComment = (data) => api.post('/comments/', data);
export const updateComment = (commentId, updatedData) => api.patch(`/comments/${commentId}/`, updatedData);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}/`);
export const fetchTask = (taskId) => api.get(`/tasks/${taskId}/`);
export const fetchFollowedTasks = () => api.get('/accounts/followed_tasks/');

export const unfollowUser = (userId) => {
  if (!userId) {
    console.error("User ID is undefined. Cannot proceed with unfollow.");
    return;
  }
  return api.post(`/accounts/unfollow/${userId}/`);
};

// New followUser function
export const followUser = (userId) => {
  if (!userId) {
    console.error("User ID is undefined. Cannot proceed with follow.");
    return;
  }
  return api.post(`/accounts/follow/${userId}/`);
};

export default api;
