import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import TaskModal from './TaskModal';
import TaskFilters from './TaskFilters';
import TaskItem from './TaskItem';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState({ category: '', priority: '', state: '' });
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null); // For editing tasks
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const highlightedCommentId = location.state?.highlightCommentId || null;

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
      if (!checkToken()) return;

      const config = {
        params: {
          page: reset ? 1 : page,
          search: search.trim(),
          ...filter,
        },
      };

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
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.dispatchEvent(new Event('sessionExpired'));
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickEdit = async (taskId, newState) => {
    if (!checkToken()) return;

    try {
      const updatedTask = tasks.find((task) => task.id === taskId);
      if (updatedTask) {
        updatedTask.state = newState;
        await api.put(`/tasks/tasks/${taskId}/`, updatedTask);

        if (!filter.state || filter.state === newState) {
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
          );
        } else {
          setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        }
      }
    } catch (error) {
      // Handle task update error silently
    }
  };

  const handleDelete = async (id) => {
    if (!checkToken()) return;

    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await api.delete(`/tasks/tasks/${id}/`);
      if (response.status === 204) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.dispatchEvent(new Event('sessionExpired'));
        navigate('/login');
      } else {
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  // Open modal for adding a task
  const handleAddTask = () => {
    setEditTask(null); // Clear any task currently being edited
    setShowModal(true);
  };

  return (
    <Container className="mt-4">
      <h2>Task List</h2>
      <Button variant="primary" onClick={handleAddTask} className="mb-3 btn-custom">
        Add Task
      </Button>

      <TaskFilters setFilter={setFilter} setSearch={setSearch} />

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
              highlightedCommentId={highlightedCommentId}
              onEdit={(task) => {
                if (checkToken()) {
                  setEditTask(task);
                  setShowModal(true);
                }
              }}
              onDelete={handleDelete}
              onQuickEdit={handleQuickEdit}
              showComments={true} // Display comments by default for each task
            />
          ))}
        </ul>
      </InfiniteScroll>

      <TaskModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditTask(null); // Clear edit task state on modal close
        }}
        task={editTask}
        fetchTasks={fetchTasks}
      />
    </Container>
  );
};

export default TaskList;
