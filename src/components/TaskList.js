import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TaskModal from './TaskModal';
import TaskFilters from './TaskFilters'; // Import TaskFilters
import TaskItem from './TaskItem'; // Import TaskItem

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

  const handleSearchChange = (value) => {
    setSearch(value);
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

  return (
    <Container className="mt-4">
      <h2>Task List</h2>
      <Button variant="primary" onClick={handleShow} className="mb-3">
        Add Task
      </Button>

      {/* Task Filters */}
      <TaskFilters setFilter={setFilter} setSearch={handleSearchChange} />

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
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleEditShow}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      </InfiniteScroll>

      {/* Modal for Task Operations */}
      <TaskModal show={showModal} onHide={handleEditClose} task={editTask} fetchTasks={fetchTasks} />
    </Container>
  );
};

export default TaskList;
