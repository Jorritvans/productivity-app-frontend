import React, { useEffect, useState } from 'react';
import api from '../api';
import { Container, Alert } from 'react-bootstrap';
import TaskItem from './TaskItem';

const FollowedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowedTasks = async () => {
      try {
        const response = await api.get('/accounts/followed_tasks/');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching followed tasks:', error);
        setError('Error fetching followed tasks.');
      }
    };
    fetchFollowedTasks();
  }, []);

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>Tasks from Users You Follow</h2>
      {tasks.length > 0 ? (
        <ul className="list-group">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      ) : (
        <p>You are not following any users or they haven't posted any tasks.</p>
      )}
    </Container>
  );
};

export default FollowedTasks;
