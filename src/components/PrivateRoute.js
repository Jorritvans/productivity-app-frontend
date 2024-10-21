// src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Named import

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
    const decoded = jwtDecode(token); // Use jwtDecode instead of jwt_decode
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Token has expired
      return <Navigate to="/login" />;
    }
  } catch (error) {
    console.error('Token decoding failed:', error);
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
