import React, { useState, useEffect } from 'react';
import { Button, Badge, Collapse, Card } from 'react-bootstrap';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { fetchComments } from '../api';

const TaskItem = ({ task, onEdit, onDelete, onQuickEdit, canEdit = true, showComments = false }) => {
  const [openComments, setOpenComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  // Retrieve current user's ID from localStorage and parse it as an integer
  const currentUserId = parseInt(localStorage.getItem('user_id'), 10);

  useEffect(() => {
    // Fetch the number of comments when the component loads
    const loadCommentsCount = async () => {
      try {
        const response = await fetchComments(task.id);
        setCommentsCount(response.data.length);
      } catch (error) {
        setCommentsCount(0); // Handle the error by setting commentsCount to 0
      }
    };

    loadCommentsCount();
  }, [task.id]);

  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h5>{task.title}</h5>
          <p>
            Due: {task.due_date} | Priority:{' '}
            <Badge
              bg={
                task.priority === 'High'
                  ? 'danger'
                  : task.priority === 'Medium'
                  ? 'warning'
                  : 'success'
              }
            >
              {task.priority}
            </Badge>{' '}
            | Category: {task.category} | State:{' '}
            {canEdit && onQuickEdit ? (
              <select
                value={task.state}
                onChange={(e) => onQuickEdit(task.id, e.target.value)}
                style={{ marginLeft: '5px' }}
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            ) : (
              <span>{task.state}</span>
            )}
          </p>
          {!canEdit && (
            <p>
              <small className="text-muted">Owner: {task.owner}</small>
            </p>
          )}
        </div>
        {canEdit && (
          <div>
            <Button
              variant="custom-blue"
              size="sm"
              onClick={() => onEdit(task)}
              className="me-2 btn-custom-blue"
            >
              Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(task.id)}>
              Delete
            </Button>
          </div>
        )}
      </div>

      {showComments && (
        <>
          <Button
            variant="link"
            onClick={() => setOpenComments(!openComments)}
            aria-controls={`comments-${task.id}`}
            aria-expanded={openComments}
          >
            {openComments ? 'Hide Comments' : `Show Comments (${commentsCount})`}
          </Button>
          <Collapse in={openComments}>
            <div id={`comments-${task.id}`}>
              <Card body className="mt-2">
                <CommentList taskId={task.id} currentUserId={currentUserId} />
                <CommentForm taskId={task.id} />
              </Card>
            </div>
          </Collapse>
        </>
      )}
    </li>
  );
};

export default TaskItem;
