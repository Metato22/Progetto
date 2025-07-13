import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { NewsCard } from '../components/NewsCard';
import '../styles/HomePage.css';
import { Container, Spinner } from 'react-bootstrap';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import * as React from "react";
import Item from '../components/Item';
import { useParams } from 'react-router-dom';
import '../styles/PagesStyles.css';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useAuth } from '../auth/useAuth';  // Assumendo che il hook sia così importato

export default function CategoryPage() {
    const { slug } = useParams();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    const [category, setCategory] = useState(null);
    const [manualNews, setManualNews] = useState([]);
    const [externalNews, setExternalNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowed, setIsFollowed] = useState(false);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ottieni categoria
                const categoryRes = await axios.get(`/categories/${slug}`);
                setCategory(categoryRes.data);

                // Notizie manuali
                const manualRes = await axios.get(`/news?category=${slug}`);
                setManualNews(manualRes.data);

                // Notizie esterne
                const externalRes = await axios.get(`/external-news?gnewsCategory=${categoryRes.data.gnewsCategory}`);
                setExternalNews(externalRes.data);

            } catch (error) {
                console.error('Errore durante il fetch:', error);
                setManualNews([]);
                setExternalNews([]);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [slug, authLoading]);

    // Controlla se l'utente segue la categoria, solo quando category e autenticazione sono pronti
    useEffect(() => {
        const checkSubscription = async () => {
            if (!isAuthenticated || !category) {
                setIsFollowed(false);
                return;
            }

            try {
                const subsRes = await axios.get('/user/subscriptions');
                const isSub = subsRes.data.some(cat => cat._id === category._id);
                setIsFollowed(isSub);
            } catch (err) {
                console.error("Errore nel controllo sottoscrizione:", err);
                setIsFollowed(false);
            }
        };

        checkSubscription();
    }, [category, isAuthenticated]);

    const handleToggleFollow = async () => {

        setToggling(true);

        try {
            if (isFollowed) {
                console.log('Trying to unsubscribe from category', category._id);
                await axios.post('/user/unsubscribe', { categoryId: category._id });
                setIsFollowed(false);
            } else {
                console.log('Trying to subscribe to category', category._id);
                await axios.post('/user/subscribe', { categoryId: category._id });
                setIsFollowed(true);
            }
        } catch (err) {
            console.error('Error toggling follow:', err);
        } finally {
            setToggling(false);
        }
    };


    if (loading) {
        return (
            <Container>
                <Spinner animation="border" />
            </Container>
        );
    }

    // Unisci e rimuovi duplicati per titolo
    const combinedNews = [...manualNews, ...externalNews].filter(
        (news, index, self) =>
            index === self.findIndex(n =>
                (n._id && news._id && n._id === news._id) ||
                (!n._id && !news._id && n.title === news.title)
            )
    );

    return (
        <Container>
            <Box sx={{ width: '100%', marginTop: '50px', padding: '20px' }}>
                <Grid container rowSpacing={0.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12}>
                        <Item sx={{backgroundColor: 'white'}}>
                            <div className="header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <h1 className="section-title" style={{ color: 'white' }}>
                                    {category ? category.name : 'Categoria'}
                                </h1>
                                {isAuthenticated && category && (
                                    <button
                                        className="btn"
                                        onClick={handleToggleFollow}
                                        disabled={toggling}
                                        title={isFollowed ? "Non seguire più" : "Segui questa categoria"}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        {isFollowed ? (
                                            <BookmarkIcon style={{ color: 'gold', fontSize: '2rem' }} />
                                        ) : (
                                            <BookmarkBorderIcon style={{ color: 'black', fontSize: '2rem' }} />
                                        )}
                                    </button>
                                )}
                            </div>
                            <Grid item xs={12}>
                                {combinedNews.length > 0 ? (
                                    combinedNews.map(n => (
                                        <NewsCard key={n._id ?? n.title} data={n} />
                                    ))
                                ) : (
                                    <p className="text-white">Nessuna notizia per questa categoria.</p>
                                )}
                            </Grid>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}