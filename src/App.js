import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';

import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [sessionExpired, setSessionExpired] = useState(false);

  const isAuthenticated = () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      setSessionExpired(true);
    };

    window.addEventListener('sessionExpired', handleSessionExpired);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setSessionExpired(false);
    window.location.href = '/login'; // Redirect to login on logout
  };

  const handleSessionModalClose = () => {
    handleLogout(); // Logout and redirect to login page when the user clicks "OK"
  };

  return (
    <>
      <Router>
        <Navbar className="custom-navbar" expand="lg"
        >
          <Container>
            <Navbar.Brand href="/">ProductivityApp</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                {isAuthenticated() ? (
                  <>
                    <Nav.Link href="/tasks">Tasks</Nav.Link>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link href="/login">Login</Nav.Link>
                    <Nav.Link href="/register">Register</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route
            path="/login"
            element={isAuthenticated() ? <Navigate to="/tasks" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated() ? <Navigate to="/tasks" /> : <Register />}
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute sessionExpired={sessionExpired}>
                <TaskList />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/tasks" /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>

      {/* Session Expired Modal */}
      {sessionExpired && (
        <Modal show={true} onHide={() => setSessionExpired(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Session Expired</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your session has expired. Please log in again.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleSessionModalClose}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default App;