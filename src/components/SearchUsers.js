import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Form, InputGroup, Button, Card, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';

const SearchUsers = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    const [followingIds, setFollowingIds] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    // Fetch current user details on component mount
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await api.get('/accounts/profile/');
                setCurrentUser(response.data.user);
            } catch (error) {}
        };
        fetchCurrentUser();
    }, []);

    // Search users based on query
    useEffect(() => {
        const fetchUsers = async () => {
            if (query.trim() === '') {
                setResults([]);
                return;
            }
            try {
                const response = await api.get(`/accounts/search/?q=${query}`);
                setResults(response.data);
                setError(response.data.length ? null : 'No users found');
            } catch (error) {
                setError('No users found');
                setResults([]);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Fetch the list of followed users
    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await api.get('/accounts/following/');
                setFollowingIds(response.data.map((user) => user.id));
            } catch (error) {}
        };
        fetchFollowing();
    }, []);

    const handleFollow = async (userId) => {
        if (!currentUser || currentUser.id === userId) return; // Prevent self-follow
        try {
            await api.post(`/accounts/follow/${userId}/`);
            setFollowingIds((prev) => [...prev, userId]);
        } catch (error) {}
    };

    const handleUnfollow = async (userId) => {
        try {
            await api.post(`/accounts/unfollow/${userId}/`);
            setFollowingIds((prev) => prev.filter((id) => id !== userId));
        } catch (error) {}
    };

    return (
        <Container className="mt-4">
            <h2>Search Users</h2>
            {!searchClicked ? (
                <Form>
                    <InputGroup className="mb-3" style={{ maxWidth: '400px', margin: 'auto' }}>
                        <Form.Control
                            type="text"
                            placeholder="Search for users..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && setSearchClicked(true)}
                            style={{ padding: '10px 15px', fontSize: '16px' }}
                        />
                        <Button type="button" variant="primary" onClick={() => setSearchClicked(true)}>
                            Search
                        </Button>
                    </InputGroup>
                </Form>
            ) : null}

            {error && <div className="text-center text-danger">{error}</div>}

            {results.length > 0 && (
                <Card className="mt-4" style={{ maxWidth: '500px', margin: 'auto' }}>
                    <ListGroup variant="flush">
                        {results.map((user) => {
                            const isFollowing = followingIds.includes(user.id);
                            const isCurrentUser = currentUser && currentUser.id === user.id;

                            return (
                                <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                                    <div
                                        onClick={() => navigate(`/users/${user.id}/tasks`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <strong>{user.username}</strong>
                                    </div>
                                    {isCurrentUser ? (
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>You cannot follow yourself</Tooltip>}
                                        >
                                            <span className="d-inline-block">
                                                <Button variant="secondary" size="sm" disabled>
                                                    Follow
                                                </Button>
                                            </span>
                                        </OverlayTrigger>
                                    ) : isFollowing ? (
                                        <Button variant="secondary" size="sm" onClick={() => handleUnfollow(user.id)}>
                                            Unfollow
                                        </Button>
                                    ) : (
                                        <Button variant="primary" size="sm" onClick={() => handleFollow(user.id)}>
                                            Follow
                                        </Button>
                                    )}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Card>
            )}
        </Container>
    );
};

export default SearchUsers;
