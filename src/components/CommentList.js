import React, { useEffect, useState } from 'react';
import { fetchComments, updateComment, deleteComment } from '../api';
import { ListGroup, Button, Form, Modal, Alert } from 'react-bootstrap';

const CommentList = ({ taskId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetchComments(taskId);
      setComments(response.data);
    } catch {
      setError('Failed to load comments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      loadComments();
    }

    const handleCommentsUpdated = () => {
      loadComments();
    };

    window.addEventListener('commentsUpdated', handleCommentsUpdated);

    return () => {
      window.removeEventListener('commentsUpdated', handleCommentsUpdated);
    };
  }, [taskId, currentUserId]);

  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await updateComment(editingComment.id, { content: editContent });
      setShowModal(false);
      setEditingComment(null);
      setEditContent('');
      loadComments();
    } catch {
      setError('Failed to update comment.');
    }
  };

  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      await deleteComment(commentId);
      loadComments();
    } catch {
      setError('Failed to delete comment.');
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading ? (
        <p>Loading comments...</p>
      ) : (
        <ListGroup variant="flush">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <ListGroup.Item key={comment.id}>
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{comment.author_username}</strong> commented:
                    <p>{comment.content}</p>
                    <small className="text-muted">
                      {new Date(comment.created_at).toLocaleString()}
                    </small>
                  </div>
                  {comment.author === currentUserId && (
                    <div>
                      <Button variant="link" onClick={() => handleEdit(comment)}>
                        Edit
                      </Button>
                      <Button variant="link" onClick={() => handleDelete(comment.id)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No comments yet.</ListGroup.Item>
          )}
        </ListGroup>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="editCommentContent">
            <Form.Label>Comment:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CommentList;
