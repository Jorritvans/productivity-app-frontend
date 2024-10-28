// src/components/Login.js

import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/token/', { username, password });
      const data = response.data;
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_id', data.user_id); // Store user_id
      localStorage.setItem('username', data.username); // Store username

      navigate('/tasks', { replace: true });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Incorrect username or password.');
      } else if (error.response) {
        setError(`Login failed: ${error.response.data.detail}`);
      } else if (error.request) {
        setError('Login failed: No response from server.');
      } else {
        setError(`Login failed: ${error.message}`);
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-2">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>

      <Button
        variant="link"
        onClick={() => navigate('/register')}
        className="mt-2"
      >
        Don't have an account? Register here
      </Button>
    </Container>
  );
};

export default Login;
