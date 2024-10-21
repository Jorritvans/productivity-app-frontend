// src/components/Register.js

import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setSuccess(''); // Clear any previous success messages

    try {
      const response = await api.post('/accounts/register/', { username, email, password }); // Correct endpoint
      setSuccess('Registration successful. You can now log in.');
      setUsername('');
      setEmail('');
      setPassword('');

      // Optionally redirect to login after a delay
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        // If the backend returned validation errors, display them
        const backendError = error.response.data;
        if (backendError.error) {
          setError(backendError.error);
        } else if (backendError.password) {
          setError(backendError.password.join(' ')); // Password validation error
        } else {
          setError('Username already exists. Please check your inputs.');
        }
      } else if (error.request) {
        // No response from the server
        setError('No response from server. Please try again later.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
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

        <Form.Group controlId="formEmail" className="mt-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
