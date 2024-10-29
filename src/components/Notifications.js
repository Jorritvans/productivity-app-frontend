// src/components/Notifications.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markNotificationAsRead } from '../api';
import { ListGroup, Badge } from 'react-bootstrap';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications.');
      }
    };

    loadNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification.id);
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
      }
      const route = notification.context === "my_tasks" ? `/tasks/${notification.task_id}` : `/followed_tasks/${notification.task_id}`;
      navigate(route, { state: { highlightCommentId: notification.comment_id } });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div>
      <h4>Notifications</h4>
      {error && <p className="text-danger">{error}</p>}
      <ListGroup>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <ListGroup.Item
              key={notification.id}
              action
              onClick={() => handleNotificationClick(notification)}
              className={!notification.read ? 'bg-light' : ''}
            >
              {notification.message}{' '}
              <Badge variant="info">{new Date(notification.created_at).toLocaleString()}</Badge>
            </ListGroup.Item>
          ))
        ) : (
          <p>No new notifications.</p>
        )}
      </ListGroup>
    </div>
  );
};

export default Notifications;
