import { useAuth } from '../auth/useAuth';
import axios from '../api/axiosInstance';
import { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';

export default function ProfilePage() {
    const { user } = useAuth();
    const [message, setMessage] = useState('');

    const upgrade = async () => {
        try {
            const res = await axios.post('/user/upgrade', { level: 'premium' });
            setMessage(res.data.message);
        } catch (err) {
            setMessage('Errore aggiornamento abbonamento');
        }
    };

    if (!user) return <p>Caricamento...</p>;

    return (
        <Container>
            <h2>Profilo utente</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Abbonamento:</strong> {user.subscriptionLevel}</p>
            {user.subscriptionLevel === 'free' && (
                <Button variant="success" onClick={upgrade}>Passa a Premium</Button>
            )}
            {message && <Alert className="mt-3">{message}</Alert>}
        </Container>
    );
}