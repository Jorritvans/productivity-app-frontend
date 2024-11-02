import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, sessionExpired }) => {
  const token = localStorage.getItem('access_token');

  // If sessionExpired is true, allow rendering the children to show the modal
  if (sessionExpired) {
    return children;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("access_token");
      // Token has expired
      return <Navigate to="/login" />;
    }
  } catch (error) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
