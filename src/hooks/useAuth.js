import { useState, useEffect, useCallback } from 'react';
import jwt_decode from 'jwt-decode';
import api from '../api';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          refreshToken();
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      try {
        const response = await api.post('/api/token/refresh/', { refresh });
        localStorage.setItem('access_token', response.data.access);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
    const interval = setInterval(() => {
      checkAuth();
    }, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, [checkAuth]);

  return isAuthenticated;
};

export default useAuth;
