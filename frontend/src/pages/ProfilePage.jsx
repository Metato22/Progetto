import { useAuth } from '../auth/useAuth';
import axios from '../api/axiosInstance';
import { useState } from 'react';
import {Container, Button, Alert} from 'react-bootstrap';
import Item from '../components/Item';
import '../styles/ProfilePage.css'

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const [message, setMessage] = useState('');

    console.log('user in ProfilePage:', user);

    const upgrade = async () => {
        try {
            const res = await axios.post('/user/upgrade', { level: 'premium' });
            setMessage(res.data.message);
            // Aggiorna user con il nuovo planLevel
            setUser(prevUser => ({
                ...prevUser,
                planLevel: res.data.planLevel
            }));
        } catch (err) {
            setMessage('Errore aggiornamento abbonamento');
        }
    };

    if (!user) return <p>Caricamento...</p>;

    return (
        <Container>
            <Item>
                <div className="profile-card">
                    <h2 className="title-contact">Profilo utente</h2>
                    <p><strong>Nome:</strong> {user.name || '—'}</p>
                    <p><strong>Cognome:</strong> {user.surname || '—'}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Abbonamento:</strong> {user.planLevel}</p>

                    {user.planLevel === 'free' && (
                        <Button variant="success" onClick={upgrade}>Passa a Premium</Button>
                    )}

                    {message && <Alert className="mt-3">{message}</Alert>}
                </div>
            </Item>
        </Container>
    );
}