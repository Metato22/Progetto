import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { NewsCard } from '../components/NewsCard';
import SecondNewsCard from '../components/SecondNewsCard';
import '../styles/HomePage.css';
import { Container, Spinner } from 'react-bootstrap';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import * as React from "react";
import Item from '../components/Item';
import io from 'socket.io-client';
import { useAuth } from '../auth/useAuth'; // <-- IMPORTA useAuth

const socket = io(process.env.REACT_APP_API_BASE_URL);

export default function HomePage() {
    const { isAuthenticated } = useAuth(); // <-- USA useAuth

    const [apiNews, setApiNews] = useState([]);
    const [manualNews, setManualNews] = useState([]);
    const [personalizedNews, setPersonalizedNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApiNews = async () => {
        const res = await axios.get('/external-news');
        return res.data;
    };

    const fetchManualNews = async () => {
        const res = await axios.get('/news');
        return res.data;
    };

    const fetchPersonalizedExternalNews = async () => {
        if (!isAuthenticated) return [];
        try {
            const res = await axios.get('/external-news/personalized');
            return res.data;
        } catch (error) {
            console.error('Errore fetch notizie esterne personalizzate:', error);
            return [];
        }
    };

    const fetchPersonalizedManualNews = async () => {
        if (!isAuthenticated) return [];
        try {
            const res = await axios.get('/news/personalized');
            return res.data;
        } catch (error) {
            console.error('Errore fetch notizie manuali personalizzate:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchAllNews = async () => {
            try {
                const [api, manual, externalPersonalized, manualPersonalized] = await Promise.all([
                    fetchApiNews(),
                    fetchManualNews(),
                    fetchPersonalizedExternalNews(),
                    fetchPersonalizedManualNews()
                ]);

                setApiNews(api);
                setManualNews(manual);
                setPersonalizedNews([
                    ...externalPersonalized,
                    ...manualPersonalized
                ]);
            } catch (error) {
                console.error('Errore nel caricamento delle notizie:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllNews();

        socket.on('news-update', (newNews) => {
            setManualNews(prev => {
                if (prev.some(n => n._id === newNews._id)) {
                    return prev;
                }
                return [newNews, ...prev];
            });
        });

        socket.on('news-deleted', ({ id }) => {
            setManualNews(prev => prev.filter(n => n._id !== id));
        });

        return () => {
            socket.disconnect();
        };
    }, [isAuthenticated]);

    const combinedNews = [...manualNews, ...apiNews].filter((news, index, self) =>
            index === self.findIndex(n =>
                (n._id && news._id && n._id === news._id) ||
                (!n._id && !news._id && n.title === news.title)
            )
    );

    const combinedPersonalizedNews = [...personalizedNews].filter((news, index, self) =>
        index === self.findIndex(n => n.title === news.title)
    );

    return (
        <Box sx={{ width: '100%' }}>
            <h1 classname="section-title1">ULTIME NOTIZIE</h1>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid size={8}>
                    <Item>

                        <Box sx={{ width: '100%' }}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid size={12}>
                                    <Item>
                                        <h2 className="section-title">Notizie principali</h2>
                                        {loading ? (
                                            <Spinner animation="border" />
                                        ) : (
                                            <Grid container spacing={2}>
                                                {combinedNews.map((news) => (
                                                    <Grid item xs={12} key={news.id ?? news.title}>
                                                        <NewsCard data={news} />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        )}
                                    </Item>
                                </Grid>
                            </Grid>
                        </Box>





                    </Item>
                </Grid>
                <Grid size={4}>
                    <Item>

                        <Box sx={{ width: '100%' }}>
                            <h1 className="section-title">Scelti per te</h1>
                            {isAuthenticated ? (
                                combinedPersonalizedNews.length > 0 ? (
                                    combinedPersonalizedNews.map((news) => (
                                        <SecondNewsCard key={news._id ?? news.title} news={news} />
                                    ))
                                ) : (
                                    <p className="text-white">Nessuna notizia personalizzata disponibile.</p>
                                )
                            ) : (
                                <p style={{ padding: '10px', color: 'white' }}>
                                    Per vedere contenuti personalizzati, <strong><a href="/login">accedi</a></strong> o <strong><a href="/register">registrati</a></strong>.
                                </p>
                            )}
                        </Box>



                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}