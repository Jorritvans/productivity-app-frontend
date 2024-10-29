// src/components/FollowedTasks.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import { Container, Alert } from 'react-bootstrap';
import TaskItem from './TaskItem';

const FollowedTasks = () => {
  const [tasksByOwner, setTasksByOwner] = useState({});
  const [expandedOwners, setExpandedOwners] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowedTasks = async () => {
      try {
        const response = await api.get('/accounts/followed_tasks/');
        
        // Group tasks by owner
        const groupedTasks = response.data.reduce((acc, task) => {
          const ownerName = task.owner;
          if (!acc[ownerName]) {
            acc[ownerName] = [];
          }
          acc[ownerName].push(task);
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

  const toggleOwnerTasks = (owner) => {
    setExpandedOwners((prevExpanded) => ({
      ...prevExpanded,
      [owner]: !prevExpanded[owner],
    }));
  };

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>Tasks from Users You Follow</h2>
      {Object.keys(tasksByOwner).length > 0 ? (
        Object.keys(tasksByOwner).map((owner, idx) => (
          <div key={idx} className="owner-section mb-3">
            <div 
              className="owner-header"
              onClick={() => toggleOwnerTasks(owner)}
              style={{
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: '#f8f9fa',
                padding: '10px',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '1.2em', transform: expandedOwners[owner] ? 'rotate(0deg)' : 'rotate(90deg)', transition: 'transform 0.2s', marginRight: '8px' }}>
                ➤
              </span>
              {owner}
            </div>
            {expandedOwners[owner] && (
              <ul className="list-group mt-2">
                {tasksByOwner[owner].map((task) => (
                  <TaskItem key={task.id} task={task} canEdit={false} showComments={true} />
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p>You are not following any users or they haven't posted any tasks.</p>
      )}
    </Container>
  );
};

export default FollowedTasks;
