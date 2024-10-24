import React from 'react';
import { Button, Badge } from 'react-bootstrap';

const TaskItem = ({ task, onEdit, onDelete, onQuickEdit }) => {
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
          | Category: {task.category} | State: 
          <select 
            value={task.state} 
            onChange={(e) => onQuickEdit(task.id, e.target.value)}
            style={{ marginLeft: '5px' }}
          >
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </p>
      </div>
      <div>
        <Button variant="custom-blue" size="sm" onClick={() => onEdit(task)} className="me-2 btn-custom-blue">
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
