import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Container, Form, Button, Alert } from 'react-bootstrap';

export default function RegisterPage() {
    const nav = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState({ text: '', variant: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', variant: '' });
        try {
            await axios.post('/auth/register', form);
            setMessage({ text: 'Registrazione avvenuta con successo!', variant: 'success' });
            setTimeout(() => nav('/login'), 2000);
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || 'Errore nella registrazione',
                variant: 'danger'
            });
        }
    };

    return (
        <Container className="w-50">
            <h2 className="mb-4">Registrati</h2>
            {message.text && <Alert variant={message.variant}>{message.text}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Button type="submit">Registrati</Button>
            </Form>
        </Container>
    );
}