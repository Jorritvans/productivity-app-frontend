import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Button, Badge } from 'react-bootstrap';
import { BsSearch, BsBell } from 'react-icons/bs';

import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import SearchUsers from './components/SearchUsers';
import UserTasks from './components/UserTasks';
import FollowedTasks from './components/FollowedTasks';
import Notifications from './components/Notifications';
import { fetchNotifications } from './api'; // Import notification fetcher

function App() {
  const [sessionExpired, setSessionExpired] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const loadNotifications = async () => {
      if (isAuthenticated()) {
        try {
          const response = await fetchNotifications();
          setNotifications(response.data);
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      }
    };
    loadNotifications();
  }, [isAuthenticated()]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setSessionExpired(false);
    navigate('/login', { replace: true });
  };

  const handleSessionModalClose = () => {
    handleLogout();
  };

  return (
    <>
      <Navbar className="custom-navbar" expand="lg">
        <Container>
          <Navbar.Brand href="/">ProductivityApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {isAuthenticated() ? (
                <>
                  <Nav.Link href="/tasks">Tasks</Nav.Link>
                  <Nav.Link href="/profile">Profile</Nav.Link>
                  <Nav.Link href="/search">
                    <BsSearch /> Search Users
                  </Nav.Link>
                  <Nav.Link href="/followed_tasks">Followed Tasks</Nav.Link>
                  <Nav.Link href="/notifications">
                    <BsBell />
                    Notifications {notifications.length > 0 && (
                      <Badge bg="danger" pill>
                        {notifications.length}
                      </Badge>
                    )}
                  </Nav.Link>
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
          path="/profile"
          element={
            <PrivateRoute sessionExpired={sessionExpired}>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute sessionExpired={sessionExpired}>
              <SearchUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:owner_id/tasks"
          element={
            <PrivateRoute sessionExpired={sessionExpired}>
              <UserTasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/followed_tasks"
          element={
            <PrivateRoute sessionExpired={sessionExpired}>
              <FollowedTasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute sessionExpired={sessionExpired}>
              <Notifications />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/tasks" /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

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
