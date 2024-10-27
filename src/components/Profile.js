import React, { useEffect, useState } from 'react';
import api from '../api';
import { Container, Card, ListGroup } from 'react-bootstrap';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/accounts/profile/');
                const profileData = response.data;
                
                // Format the date for display
                const formattedDateJoined = new Date(profileData.user.date_joined).toLocaleDateString("en-GB", {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
                
                setProfile({ ...profileData, user: { ...profileData.user, date_joined: formattedDateJoined } });
            } catch (error) {
                setError('Error fetching profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container className="mt-4">
            <h2>User Profile</h2>
            <Card>
                <Card.Body>
                    <Card.Title>{profile.user.username}</Card.Title>
                    <Card.Text>Joined on: {profile.user.date_joined}</Card.Text>
                </Card.Body>
            </Card>
            <h3 className="mt-4">Your Tasks</h3>
            <ListGroup>
                {profile.tasks.map(task => (
                    <ListGroup.Item key={task.id}>
                        <h5>{task.title}</h5>
                        <p>{task.description}</p>
                        <small>Due Date: {task.due_date}</small>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default Profile;
