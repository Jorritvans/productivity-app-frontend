// src/components/TaskDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchComments, fetchTask } from '../api'; // Make sure you have a fetchTask function
import CommentForm from './CommentForm';
import { ListGroup, Badge, Container } from 'react-bootstrap';

const TaskDetail = () => {
  const { taskId } = useParams(); // Get the task ID from the URL
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTaskDetails = async () => {
      try {
        const taskResponse = await fetchTask(taskId); // Assuming you have this API endpoint
        setTask(taskResponse.data);

        const commentsResponse = await fetchComments(taskId);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error loading task details:', error);
        setError('Failed to load task details.');
      }
    };

    loadTaskDetails();
  }, [taskId]);

  return (
    <Container>
      {error && <p className="text-danger">{error}</p>}
      {task ? (
        <div>
          <h2>{task.title}</h2>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Due Date:</strong> {task.due_date}</p>
          <p>
            <strong>Priority:</strong>
            <Badge bg={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'}>
              {task.priority}
            </Badge>
          </p>
          <p><strong>Category:</strong> {task.category}</p>
          <p><strong>State:</strong> {task.state}</p>

          <h4>Comments</h4>
          <CommentForm taskId={task.id} />
          <ListGroup>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <ListGroup.Item key={comment.id}>
                  <strong>{comment.author_username}:</strong> {comment.content}
                </ListGroup.Item>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </ListGroup>
        </div>
      ) : (
        <p>Loading task details...</p>
      )}
    </Container>
  );
};

export default TaskDetail;
