import { useAuth } from '../auth/useAuth';
import axios from '../api/axiosInstance';
import { useState, useEffect } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import Item from '../components/Item';
import { useSocket } from '../context/SocketContext'; // Importa useSocket
import '../styles/ProfilePage.css';

export default function ProfilePage() {
    const { user, setUser } = useAuth();
    const [message, setMessage] = useState('');
    const [subscriptions, setSubscriptions] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const res = await axios.get('/user/subscriptions');
                setSubscriptions(res.data.categories || res.data || []); // fallback se cambia formato
            } catch (err) {
                console.error('Errore nel recupero delle sottoscrizioni:', err);
            }
        };

        fetchSubscriptions();
    }, []);

    // Effetto per ascoltare eventi socket di aggiornamento sottoscrizioni
    useEffect(() => {
        if (!socket) return;

        const handleSubscriptionUpdate = (updatedCategories) => {
            console.log('Aggiornamento sottoscrizioni ricevuto:', updatedCategories);
            setSubscriptions(updatedCategories);
        };

        socket.on('subscription-updated', handleSubscriptionUpdate);

        // Cleanup alla disconnessione o cambio socket
        return () => {
            socket.off('subscription-updated', handleSubscriptionUpdate);
        };
    }, [socket]);

    const upgrade = async () => {
        try {
            const res = await axios.post('/user/upgrade', { level: 'premium' });
            setMessage(res.data.message);
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

                    <p><strong>Categorie iscritte:</strong></p>
                    <ul>
                        {subscriptions.length > 0 ? (
                            subscriptions.map(cat => <li key={cat._id}>{cat.name}</li>)
                        ) : (
                            <li>Nessuna iscrizione</li>
                        )}
                    </ul>

                    {user.planLevel === 'free' && (
                        <Button variant="success" onClick={upgrade}>
                            Passa a Premium
                        </Button>
                    )}

                    {message && <Alert className="mt-3">{message}</Alert>}
                </div>
            </Item>
        </Container>
    );
}