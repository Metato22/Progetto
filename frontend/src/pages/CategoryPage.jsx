import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { NewsCard } from '../components/NewsCard';
import '../styles/HomePage.css';
import '../styles/PagesStyles.css';

import { Container, Spinner } from 'react-bootstrap';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Item from '../components/Item';

import { useParams } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useAuth } from '../auth/useAuth';
import { useSocket } from '../context/SocketContext'; // ✅ Importa useSocket

export default function CategoryPage() {
    const { slug } = useParams();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const socket = useSocket(); // ✅ Usa il socket dal context

    const [category, setCategory] = useState(null);
    const [manualNews, setManualNews] = useState([]);
    const [externalNews, setExternalNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowed, setIsFollowed] = useState(false);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryRes = await axios.get(`/categories/${slug}`);
                const catData = categoryRes.data;
                setCategory(catData);

                const [manualRes, externalRes] = await Promise.all([
                    axios.get(`/news?category=${slug}`),
                    axios.get(`/external-news?gnewsCategory=${catData.gnewsCategory}`)
                ]);

                setManualNews(manualRes.data);
                setExternalNews(externalRes.data);
            } catch (error) {
                console.error('Errore durante il fetch:', error);
                setManualNews([]);
                setExternalNews([]);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) fetchData();
    }, [slug, authLoading]);

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

    // ✅ Ascolta aggiornamenti real-time tramite il context socket
    useEffect(() => {
        if (!socket || !category) return;

        const handleNewsUpdate = (newNews) => {
            if (newNews.category?.slug === slug) {
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
    }, [socket, category, slug]);

    const handleToggleFollow = async () => {
        if (!category || toggling) return;

        setToggling(true);

        try {
            if (isFollowed) {
                await axios.post('/user/unsubscribe', { categoryId: category._id });
                setIsFollowed(false);
            } else {
                await axios.post('/user/subscribe', { categoryId: category._id });
                setIsFollowed(true);
            }
        } catch (err) {
            console.error('Errore durante il toggle:', err);
        } finally {
            setToggling(false);
        }
    };

    const combinedNews = [...manualNews, ...externalNews].filter(
        (news, index, self) =>
            index === self.findIndex(n =>
                (n._id && news._id && n._id === news._id) ||
                (!n._id && !news._id && n.title === news.title)
            )
    );

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ width: '100%', marginTop: '50px', padding: '20px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Item>
                            <div className="header-container d-flex justify-content-between align-items-center">
                                <h1 className="category-title">
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
                                            <BookmarkBorderIcon style={{ color: 'white', fontSize: '2rem' }} />
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