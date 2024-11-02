import React, { useState } from 'react';
import { createComment } from '../api';
import { Form, Button, Alert } from 'react-bootstrap';

const CommentForm = ({ taskId }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createComment({ task: taskId, content });
      setContent('');
      // Trigger a reload of comments by dispatching a custom event
      window.dispatchEvent(new Event('commentsUpdated'));
    } catch {
      setError('Failed to add comment. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="commentContent">
        <Form.Label>Add a Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your comment here..."
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-2">
        Submit
      </Button>
    </Form>
  );
};

export default CommentForm;
