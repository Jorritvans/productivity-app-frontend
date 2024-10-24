import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Button, Form, Badge } from 'react-bootstrap';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import TaskModal from './TaskModal';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState({ category: '', priority: '', state: '' });
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const initialize = async () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        await fetchTasks(true);
      } else {
        await fetchTasks(true);
      }
    };

    initialize();
  }, [filter, search]);

  const checkToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.dispatchEvent(new Event('sessionExpired'));
      navigate('/login');
      return false;
    }
    return true;
  };

  const fetchTasks = async (reset = false) => {
    setIsLoading(true);
    try {
      const config = {
        params: {
          page: reset ? 1 : page,
          search: search.trim(),
          ...filter,
        },
      };

      if (!checkToken()) return;

      const response = await api.get('/tasks/tasks/', config);
      if (response.status === 200 && Array.isArray(response.data)) {
        if (reset) {
          setTasks(response.data);
          setPage(2);
          setHasMore(response.data.length > 0);
        } else {
          const uniqueTasks = response.data.filter(
            (newTask) => !tasks.some((task) => task.id === newTask.id)
          );
          setTasks((prevTasks) => [...prevTasks, ...uniqueTasks]);
          setPage((prevPage) => prevPage + 1);
          setHasMore(uniqueTasks.length > 0);
        }
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error.response || error.message);
      if (error.response && error.response.status === 401) {
        window.dispatchEvent(new Event('sessionExpired'));
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => {
      if (prevFilter[name] === value) return prevFilter;
      return { ...prevFilter, [name]: value };
    });
  };

  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSetSearch(e.target.value);
  };

  const handleShow = () => {
    setShowModal(true);
    setEditTask(null);
  };

  const handleEditShow = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleEditClose = () => {
    setShowModal(false);
    setEditTask(null);
  };

  const handleDelete = async (id) => {
    if (!checkToken()) return;

    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await api.delete(`/tasks/tasks/${id}/`);
      if (response.status === 204) {
        setTasks(tasks.filter((task) => task.id !== id));
        console.log(`Task ${id} deleted successfully`);
      } else {
        console.error(`Failed to delete task ${id}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error.response?.data || error.message);
      if (error.response && error.response.status === 401) {
        window.dispatchEvent(new Event('sessionExpired'));
        navigate('/login');
      } else {
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const handleQuickEdit = async (taskId, newState) => {
    if (!checkToken()) return;

    try {
      const updatedTask = { ...tasks.find((task) => task.id === taskId), state: newState };
      const response = await api.put(`/tasks/tasks/${taskId}/`, updatedTask);

      // Update tasks state only if the task meets the current filter
      if (!filter.state || filter.state === newState) {
        setTasks(tasks.map((task) => (task.id === taskId ? response.data : task)));
      } else {
        // Remove the task if it doesn't meet the current filter
        setTasks(tasks.filter((task) => task.id !== taskId));
      }
      console.log('Task updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating task:', error.response || error.message);
      if (error.response && error.response.status === 401) {
        window.dispatchEvent(new Event('sessionExpired'));
        navigate('/login');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2>Task List</h2>
      <Button variant="primary" onClick={handleShow} className="mb-3">
        Add Task
      </Button>

      {/* Filters */}
      <div className="filters mb-3 d-flex flex-wrap">
        <Form.Select
          name="category"
          value={filter.category}
          onChange={handleFilterChange}
          className="me-2 mb-2"
          aria-label="Filter by Category"
        >
          <option value="">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Others">Others</option>
        </Form.Select>
        <Form.Select
          name="priority"
          value={filter.priority}
          onChange={handleFilterChange}
          className="me-2 mb-2"
          aria-label="Filter by Priority"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Form.Select>
        <Form.Select
          name="state"
          value={filter.state}
          onChange={handleFilterChange}
          className="me-2 mb-2"
          aria-label="Filter by State"
        >
          <option value="">All States</option>
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </Form.Select>
      </div>

      {/* Search */}
      <Form.Control
        type="text"
        placeholder="Search tasks"
        defaultValue={search}
        onChange={handleSearchChange}
        className="mb-3"
      />

      {/* Infinite Scroll */}
      <InfiniteScroll
        dataLength={tasks.length}
        next={() => fetchTasks(false)}
        hasMore={hasMore}
        loader={isLoading ? <h4>Loading...</h4> : null}
        endMessage={!isLoading && <p>No more tasks</p>}
      >
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{task.title}</h5>
                <p>
                  Due: {task.due_date} | Priority: 
                  <Badge bg={task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'}>
                    {task.priority}
                  </Badge> | Category: {task.category} | State: 
                  <select 
                    value={task.state} 
                    onChange={(e) => handleQuickEdit(task.id, e.target.value)}
                    style={{ marginLeft: '5px' }}
                  >
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </p>
              </div>
              <div>
                <Button variant="secondary" size="sm" onClick={() => handleEditShow(task)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(task.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </InfiniteScroll>

      {/* Modal for Task Operations */}
      <TaskModal show={showModal} onHide={handleEditClose} task={editTask} fetchTasks={fetchTasks} />
    </Container>
  );
};

export default TaskList;
