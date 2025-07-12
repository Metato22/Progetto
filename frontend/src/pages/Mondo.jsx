import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { NewsCard } from '../components/NewsCard';
import '../styles/HomePage.css';
import { Container, Spinner } from 'react-bootstrap';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import * as React from "react";
import Item from '../components/Item';
import '../styles/PagesStyles.css'
import { useSocket } from '../context/SocketContext'; // Importa useSocket

export default function Mondo() {
    const socket = useSocket();

    const [manualNews, setManualNews] = useState([]);
    const [externalNews, setExternalNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const [manualRes, externalRes] = await Promise.all([
                    axios.get('/news?region=Mondo'),
                    axios.get('/external-news?gnewsCategory=world'),
                ]);
                setManualNews(manualRes.data || []);
                setExternalNews(externalRes.data || []);
            } catch (error) {
                console.error('Errore nel caricamento delle notizie:', error);
                setManualNews([]);
                setExternalNews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    // Gestione aggiornamenti socket in tempo reale (solo news manuali)
    useEffect(() => {
        if (!socket) return;

        const handleNewsUpdate = (newNews) => {
            if (newNews.region === 'Mondo') {
                setManualNews(prev => {
                    if (prev.some(n => n._id === newNews._id)) return prev;
                    return [newNews, ...prev];
                });
            }
        };

        const handleNewsDeleted = ({ id }) => {
            setManualNews(prev => prev.filter(n => n._id !== id));
        };

        socket.on('news-update', handleNewsUpdate);
        socket.on('news-deleted', handleNewsDeleted);

        return () => {
            socket.off('news-update', handleNewsUpdate);
            socket.off('news-deleted', handleNewsDeleted);
        };
    }, [socket]);

    // Unione e deduplicazione (se serve)
    const combinedNews = [...manualNews, ...externalNews].filter(
        (news, index, self) =>
            index === self.findIndex(n =>
                (n._id && news._id && n._id === news._id) ||
                (!n._id && !news._id && n.title === news.title)
            )
    );

    return (
        <Container>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <Box sx={{ width: '100%', marginTop: '50px', padding: '20px' }}>
                    <Grid container rowSpacing={0.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <Item>
                                <div className="header-container">
                                    <h1 className="section-title">Dal Mondo</h1>
                                </div>
                                <Grid container spacing={2}>
                                    {combinedNews.length > 0 ? (
                                        combinedNews.map((n) => (
                                            <Grid item xs={12} key={n._id ?? n.title}>
                                                <NewsCard data={n} />
                                            </Grid>
                                        ))
                                    ) : (
                                        <p className="text-white">Nessuna notizia disponibile.</p>
                                    )}
                                </Grid>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Container>
    );
}