import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import '../styles/RegisterPage.css';
import Item from '../components/Item';

export default function RegisterPage() {
    const nav = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState({ text: '', variant: '' });
    const [passwordFocused, setPasswordFocused] = useState(false);

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

    // Validazioni password
    const validations = [
        { test: form.password.length >= 8, text: 'Almeno 8 caratteri' },
        { test: /[A-Z]/.test(form.password), text: 'Una lettera maiuscola' },
        { test: /[a-z]/.test(form.password), text: 'Una lettera minuscola' },
        { test: /[0-9]/.test(form.password), text: 'Un numero' },
        { test: /[\W_]/.test(form.password), text: 'Un carattere speciale' },
    ];

    const showValidation = passwordFocused || form.password.length > 0;

    return (
        <Container className="w-50">
            <Item>
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
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            required
                        />
                        {showValidation && (
                            <ul className="password-validation-list">
                                {validations.map(({ test, text }, i) => (
                                    <li
                                        key={i}
                                        className={`password-validation-item ${test ? 'valid' : 'invalid'}`}
                                    >
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Form.Group>
                    <Button type="submit" variant="light"  className="dark-button">
                        Registrati
                    </Button>
                </Form>
                <div className="mt-3 text-center register-link-container">
                    Hai già un account? <Link to="/login">Accedi</Link>
                </div>
            </Item>
        </Container>
    );
}