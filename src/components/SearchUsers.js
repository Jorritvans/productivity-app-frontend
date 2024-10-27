import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Form, InputGroup, Button, Card, ListGroup } from 'react-bootstrap';
import { FiX } from 'react-icons/fi';

const SearchUsers = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    const navigate = useNavigate();
    const [followingIds, setFollowingIds] = useState([]);

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

    useEffect(() => {
        // Fetch the list of users the current user is following
        const fetchFollowing = async () => {
            try {
                const response = await api.get('/accounts/following/');
                setFollowingIds(response.data.map((user) => user.id));
            } catch (error) {
                console.error('Error fetching following list:', error);
            }
        };
        fetchFollowing();
    }, []);

    const handleSearch = () => {
        if (query.trim() !== '') {
            setSearchClicked(true);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setError(null);
        setSearchClicked(false);
    };

    const handleFollow = async (userId) => {
        try {
            await api.post(`/accounts/follow/${userId}/`);
            setFollowingIds((prev) => [...prev, userId]);
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await api.post(`/accounts/unfollow/${userId}/`);
            setFollowingIds((prev) => prev.filter((id) => id !== userId));
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
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
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            style={{ padding: '10px 15px', fontSize: '16px' }}
                        />
                        {query && (
                            <Button variant="outline-secondary" onClick={clearSearch}>
                                <FiX />
                            </Button>
                        )}
                        <Button type="button" variant="primary" onClick={handleSearch}>
                            Search
                        </Button>
                    </InputGroup>
                </Form>
            ) : null}

            {error && (
                <div className="text-center">
                    <p className="text-danger">{error}</p>
                    <Button variant="secondary" onClick={clearSearch}>
                        🔍 Search Again
                    </Button>
                </div>
            )}

            {results.length > 0 && (
                <Card className="mt-4" style={{ maxWidth: '500px', margin: 'auto' }}>
                    <ListGroup variant="flush">
                        {results.map((user) => {
                            const isFollowing = followingIds.includes(user.id);
                            return (
                                <ListGroup.Item
                                    key={user.id}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div
                                        onClick={() => {
                                            navigate(`/users/${user.id}/tasks`);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <strong>{user.username}</strong>
                                    </div>
                                    {isFollowing ? (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleUnfollow(user.id)}
                                        >
                                            Unfollow
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleFollow(user.id)}
                                        >
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
