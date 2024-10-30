import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { followUser, unfollowUser } from '../api'; // Ensure follow/unfollow functions are imported
import { Container, ListGroup, Alert, Button } from 'react-bootstrap';

const UserTasks = () => {
    const { owner_id } = useParams(); // Ensure it’s retrieving owner_id
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false); // New state for follow status
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
                setTasks(response.data.tasks || response.data);
                setIsFollowing(response.data.is_following); // Set initial follow status if available
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

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await unfollowUser(owner_id);
                setIsFollowing(false);
            } else {
                await followUser(owner_id);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Error updating follow status:', error);
            setError('Error updating follow status.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2>User Tasks</h2>
                <div>
                    <Button
                        variant={isFollowing ? 'danger' : 'primary'}
                        onClick={handleFollowToggle}
                        className="me-2"
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/search')}>
                        🔍 Search Again
                    </Button>
                </div>
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
