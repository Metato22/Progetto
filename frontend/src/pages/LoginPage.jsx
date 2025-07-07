import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function LoginPage() {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [error, setError] = useState('');

    const handle = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', { email, password: pwd });
            axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
            nav('/');
        } catch {
            setError('Credenziali errate');
        }
    };

    return (
        <Container className="w-50">
            <h2 className="mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handle}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={pwd} onChange={e => setPwd(e.target.value)} />
                </Form.Group>
                <Button type="submit">Accedi</Button>
            </Form>
        </Container>
    );
}