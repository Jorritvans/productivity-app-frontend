// src/components/FollowedTasks.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import { Container, Alert, Button } from 'react-bootstrap';
import TaskItem from './TaskItem';

const FollowedTasks = () => {
  const [tasksByOwner, setTasksByOwner] = useState({});
  const [expandedOwners, setExpandedOwners] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowedTasks = async () => {
      try {
        const response = await api.get('/accounts/followed_tasks/');
        
        console.log('Response data for followed tasks:', response.data);  // Debug log to check response structure

        // Group tasks by owner using owner name and ID
        const groupedTasks = response.data.reduce((acc, task) => {
          // Confirm owner_id is present in each task object
          if (!task.owner_id) {
            console.error('Missing owner_id for task:', task);
            return acc;
          }

          const ownerKey = `${task.owner}-${task.owner_id}`;
          if (!acc[ownerKey]) {
            acc[ownerKey] = [];
          }
          acc[ownerKey].push(task);
          return acc;
        }, {});

        setTasksByOwner(groupedTasks);
      } catch (error) {
        console.error('Error fetching followed tasks:', error);
        setError('Error fetching followed tasks.');
      }
    };
    fetchFollowedTasks();
  }, []);

  const toggleOwnerTasks = (ownerKey) => {
    setExpandedOwners((prevExpanded) => ({
      ...prevExpanded,
      [ownerKey]: !prevExpanded[ownerKey],
    }));
  };

  const handleUnfollow = async (ownerKey) => {
    const userId = ownerKey.split('-')[1];  // Ensure we're extracting a valid userId
    console.log('Attempting to unfollow user with ID:', userId);  // Log user ID for confirmation

    if (!userId || userId === 'undefined') {
      console.error('User ID is undefined or invalid. Cannot proceed with unfollow.');
      setError('Error: Invalid user ID.');
      return;
    }

    try {
      const response = await api.post(`/accounts/unfollow/${userId}/`);
      console.log(`Successfully unfollowed user with ID: ${userId}`, response.data);  // Confirm success

      setTasksByOwner((prev) => {
        const updatedTasks = { ...prev };
        delete updatedTasks[ownerKey];
        return updatedTasks;
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      setError('Error unfollowing user.');
    }
  };

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>Tasks from Users You Follow</h2>
      {Object.keys(tasksByOwner).length > 0 ? (
        Object.keys(tasksByOwner).map((ownerKey, idx) => {
          const [ownerName, ownerId] = ownerKey.split('-');  // Separate name and ID for display
          return (
            <div key={idx} className="owner-section mb-3">
              <div 
                className="owner-header"
                onClick={() => toggleOwnerTasks(ownerKey)}
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>
                  <span style={{ fontSize: '1.2em', transform: expandedOwners[ownerKey] ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.2s', marginRight: '8px' }}>
                    ➤
                  </span>
                  {ownerName}
                </span>
                <Button variant="outline-danger" size="sm" onClick={() => handleUnfollow(ownerKey)}>
                  Unfollow
                </Button>
              </div>
              {expandedOwners[ownerKey] && (
                <ul className="list-group mt-2">
                  {tasksByOwner[ownerKey].map((task) => (
                    <TaskItem key={task.id} task={task} canEdit={false} showComments={true} />
                  ))}
                </ul>
              )}
            </div>
          );
        })
      ) : (
        <p>You are not following any users or they haven't posted any tasks.</p>
      )}
    </Container>
  );
};

export default FollowedTasks;
