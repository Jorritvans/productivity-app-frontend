import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Container, ListGroup, Alert } from 'react-bootstrap';

const UserTasks = () => {
    const { owner_id } = useParams();  // Ensure it’s retrieving owner_id
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            <h2>User Tasks</h2>
            {tasks.length > 0 ? (
                <ListGroup>
                    {tasks.map((task) => (
                        <ListGroup.Item key={task.id}>
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                            <small>Due Date: {task.due_date}</small>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <p>This user hasn't added any tasks yet.</p>
            )}
        </Container>
    );
};

export default UserTasks;
