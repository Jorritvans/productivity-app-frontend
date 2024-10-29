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
export const updateComment = (commentId, updatedData) => api.patch(`/comments/${commentId}/`, updatedData);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}/`);
export const fetchNotifications = () => api.get('/tasks/notifications/');
export const markNotificationAsRead = (notificationId) => api.patch(`/tasks/notifications/${notificationId}/read/`);

export default api;
