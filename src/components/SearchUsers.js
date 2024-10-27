import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, Form, InputGroup, Button, Card, ListGroup } from 'react-bootstrap';
import { FiX } from 'react-icons/fi'; // Import the X icon

const SearchUsers = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [searchClicked, setSearchClicked] = useState(false);
    const navigate = useNavigate();

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
                    {/* Added the "Search Again" button here */}
                    <Button variant="secondary" onClick={clearSearch}>
                        🔍 Search Again
                    </Button>
                </div>
            )}

            {results.length > 0 && (
                <Card className="mt-4" style={{ maxWidth: '500px', margin: 'auto' }}>
                    <ListGroup variant="flush">
                        {results.map((user) => (
                            <ListGroup.Item
                                key={user.id}
                                action
                                onClick={() => {
                                    console.log("Navigating with owner ID:", user.id);
                                    navigate(`/users/${user.id}/tasks`);
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
