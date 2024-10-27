import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, ListGroup, Alert, Button } from 'react-bootstrap';

const UserTasks = () => {
    const { owner_id } = useParams();  // Ensure it’s retrieving owner_id
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Fetched owner_id from URL params:", owner_id);

        const fetchUserTasks = async () => {
            if (!owner_id) {
                console.error('owner_id is undefined or null, cannot fetch tasks.');
                setError('User ID is invalid.');
                setLoading(false);
                return;
            }
            try {
                const response = await api.get(`/accounts/${owner_id}/tasks/`);
                setTasks(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching user tasks:', error);
                setError('Error fetching user tasks.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserTasks();
    }, [owner_id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2>User Tasks</h2>
                {/* Button to go back to the search page */}
                <Button variant="secondary" onClick={() => navigate('/search')}>
                    🔍 Search Again
                </Button>
            </div>
            {tasks.length > 0 ? (
                <ListGroup className="mt-3">
                    {tasks.map((task) => (
                        <ListGroup.Item key={task.id}>
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                            <small>Due Date: {task.due_date}</small>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p className="mt-3">This user hasn't added any tasks yet.</p>
            )}
        </Container>
    );
};

export default UserTasks;
