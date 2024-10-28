import React, { useEffect, useState } from 'react';
import { fetchComments, updateComment, deleteComment } from '../api';
import { ListGroup, Button, Form, Modal, Alert } from 'react-bootstrap';

const CommentList = ({ taskId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const loadComments = async () => {
    try {
      const response = await fetchComments(taskId);
      setComments(response.data);
      console.log("Fetched comments:", response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments.');
    }
  };

  useEffect(() => {
    console.log("Current User ID in CommentList:", currentUserId || 'Fallback ID');
    loadComments();

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
    } catch (error) {
      console.error('Error updating comment:', error);
      setError('Failed to update comment.');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment.');
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <ListGroup variant="flush">
        {comments.map((comment) => {
          console.log("Comment author:", comment.author);
          console.log("Should show buttons:", comment.author === currentUserId);

          return (
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
          );
        })}
      </ListGroup>

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
