import React from 'react';
import { Button, Badge } from 'react-bootstrap';

const TaskItem = ({ task, onEdit, onDelete }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
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
          | Category: {task.category} | State: {task.state}
        </p>
      </div>
      <div>
        <Button variant="secondary" size="sm" onClick={() => onEdit(task)} className="me-2">
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </div>
    </li>
  );
};

export default TaskItem;
