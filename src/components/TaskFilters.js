import React from 'react';
import { Form } from 'react-bootstrap';

const TaskFilters = ({ setFilter, setSearch }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => {
      if (prevFilter[name] === value) return prevFilter; // No change
      return { ...prevFilter, [name]: value };
    });
  };

  return (
    <div className="filters mb-3 d-flex flex-wrap">
      <Form.Select name="category" onChange={handleFilterChange} className="me-2 mb-2" aria-label="Filter by Category">
        <option value="">All Categories</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Others">Others</option>
      </Form.Select>
      <Form.Select name="priority" onChange={handleFilterChange} className="me-2 mb-2" aria-label="Filter by Priority">
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </Form.Select>
      <Form.Select name="state" onChange={handleFilterChange} className="me-2 mb-2" aria-label="Filter by State">
        <option value="">All States</option>
        <option value="To-Do">To-Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </Form.Select>
      <Form.Control
        type="text"
        placeholder="Search tasks"
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />
    </div>
  );
};

export default TaskFilters;
