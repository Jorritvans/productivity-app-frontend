import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const TaskModal = ({ show, onHide, task, fetchTasks }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: '',
    category: '',
    state: '',
  });
  const navigate = useNavigate();
  const isEditMode = !!task;

  useEffect(() => {
    if (isEditMode && task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date || '',
        priority: task.priority || '',
        category: task.category || '',
        state: task.state || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        priority: '',
        category: '',
        state: '',
      });
    }
  }, [isEditMode, task]);

  const checkToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.dispatchEvent(new Event('sessionExpired'));
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkToken()) return;

    try {
      if (isEditMode) {
        await api.put(`/tasks/tasks/${task.id}/`, formData);
        console.log('Task updated successfully:', formData);
      } else {
        await api.post('/tasks/tasks/', formData);
        console.log('Task created successfully:', formData);
      }
      await fetchTasks(true);
      onHide();
    } catch (error) {
      console.error('Error saving task:', error.response?.data || error.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditMode ? 'Edit Task' : 'Add New Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTaskTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="formTaskDescription" className="mt-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="formTaskDueDate" className="mt-2">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="formTaskPriority" className="mt-2">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              required
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formTaskCategory" className="mt-2">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Others">Others</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formTaskState" className="mt-2">
            <Form.Label>State</Form.Label>
            <Form.Select
              name="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
            >
              <option value="">Select State</option>
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </Form.Select>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            {isEditMode ? 'Update Task' : 'Add Task'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskModal;
