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
import { useAuth } from '../auth/useAuth';
import { Link } from 'react-router-dom';

export default function Preferiti() {
    const { isAuthenticated } = useAuth();
    const [personalizedNews, setPersonalizedNews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchNews = async () => {
            setLoading(true);
            try {
                const [manualRes, externalRes] = await Promise.all([
                    axios.get('/news/personalized'),
                    axios.get('/external-news/personalized')
                ]);

                const combined = [...manualRes.data, ...externalRes.data];

                // Rimuove duplicati per titolo
                const uniqueNews = combined.filter((item, index, self) =>
                    index === self.findIndex(n => n.title === item.title)
                );

                setPersonalizedNews(uniqueNews);
            } catch (error) {
                console.error("Errore nel caricamento delle notizie personalizzate:", error);
                setPersonalizedNews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <Container style={{ padding: '20px' }}>
                <Item>
                    <h2 className="text-white">Accedi per vedere le tue notizie personalizzate</h2>
                    <p className="text-white">
                        <Link to="/login">Accedi</Link> o <Link to="/register">Registrati</Link> per visualizzare le notizie delle categorie che segui.
                    </p>
                </Item>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container style={{ padding: '20px', textAlign: 'center' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    if (personalizedNews.length === 0) {
        return (
            <Container style={{ padding: '20px' }}>
                <Item>
                    <h2 className="text-white">Nessuna notizia trovata nelle tue categorie preferite.</h2>
                </Item>
            </Container>
        );
    }

    return (
        <Container>
            <Item sx={{backgroundColor: 'white'}}>
                <Box sx={{ width: '100%', marginTop: '50px', padding: '20px'}}>
                    <h1 className="category-title">CATEGORIE PREFERITE</h1>
                    <Grid container spacing={2}>
                        {personalizedNews.map(news => (
                            <Grid item xs={12} sm={6} md={4} key={news._id ?? news.title}>
                                <NewsCard data={news} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Item>
        </Container>
    );
}