import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Form, InputGroup, Button, Card, ListGroup } from 'react-bootstrap';

const SearchUsers = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            if (query.trim() === '') {
                setResults([]);
                return;
            }
            try {
                const response = await api.get(`/accounts/search/?q=${query}`)
                setResults(response.data);
                setError(null);
                console.log("Fetched results:", response.data);
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

    return (
        <Container className="mt-4">
            <h2>Search Users</h2>
            <Form>
                <InputGroup className="mb-3" style={{ maxWidth: '400px', margin: 'auto' }}>
                    <Form.Control
                        type="text"
                        placeholder="Search for users..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ padding: '10px 15px', fontSize: '16px' }}
                    />
                    <Button type="button" variant="primary" onClick={() => setQuery(query)}>
                        Search
                    </Button>
                </InputGroup>
            </Form>
            {error && <p className="text-danger text-center">{error}</p>}
            {results.length > 0 && (
                <Card className="mt-4" style={{ maxWidth: '500px', margin: 'auto' }}>
                    <ListGroup variant="flush">
                        {results.map((user) => (
                            <ListGroup.Item
                                key={user.id} // Ensures unique key to avoid warning
                                action
                                onClick={() => {
                                    if (user.id) {
                                        console.log("Navigating with owner ID:", user.id);
                                        navigate(`/users/${user.id}/tasks`);
                                    } else {
                                        console.error("User ID is undefined for user:", user);
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <strong>{user.username}</strong>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            )}
        </Container>
    );
};

export default SearchUsers;
