import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import Item from '../components/Item';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../auth/useAuth';  // IMPORTA il tuo hook useAuth
import '../styles/LoginPage.css';

export default function LoginPage() {
    const nav = useNavigate();
    const { login } = useAuth();  // prende la funzione login dal context
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [error, setError] = useState('');

    const handle = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('/auth/login', { email, password: pwd });
            // Usa la funzione login per aggiornare il context e salvare il token
            login(res.data.accessToken);
            nav('/');
        } catch (err) {
            console.error("Errore login:", err.response?.data || err.message);
            setError(err.response?.data?.message || 'Credenziali errate');
        }
    };

    return (
        <Container className="w-50">
            <Item>
                <h2 className="login-title">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handle}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={pwd}
                            onChange={e => setPwd(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" variant="light" className="dark-button">
                        Accedi
                    </Button>
                </Form>

                <Button
                    variant="outline-light"
                    className="google-button mt-3"
                    onClick={() => {
                        window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/google`;
                    }}
                >
                    <GoogleIcon style={{ marginRight: 8, color: 'white' }} />
                    Accedi con Google
                </Button>

                <div className="mt-3 login-link-container">
                    <span>Non hai un account? </span>
                    <Link to="/register">Registrati qui</Link>
                </div>
            </Item>
        </Container>
    );
}