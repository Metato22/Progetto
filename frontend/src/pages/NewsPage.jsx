import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Container, Spinner } from 'react-bootstrap';
import { useSocket } from '../context/SocketContext';
import { Box, Grid, Typography, Button, TextField, Paper } from '@mui/material';

export default function NewsPage() {
    const { id } = useParams();
    const socket = useSocket();

    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsRes, commentsRes] = await Promise.all([
                    axios.get(`/news/item/${id}`),
                    axios.get(`/comments/${id}`)
                ]);
                setNews(newsRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                console.error('Errore nel caricamento iniziale:', err.message);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (!socket) return;

        const handleNewComment = (comment) => {
            if (comment.news === id || comment.news?._id === id) {
                setComments(prev => [...prev, comment]);
            }
        };

        const handleDeletedComment = ({ id: deletedId }) => {
            setComments(prev => prev.filter(c => c._id !== deletedId));
        };

        const handleNewsUpdate = (updatedNews) => {
            if (updatedNews._id === id) {
                setNews(updatedNews);
            }
        };

        socket.on('new-comment', handleNewComment);
        socket.on('comment-deleted', handleDeletedComment);
        socket.on('news-updated', handleNewsUpdate);

        return () => {
            socket.off('new-comment', handleNewComment);
            socket.off('comment-deleted', handleDeletedComment);
            socket.off('news-updated', handleNewsUpdate);
        };
    }, [socket, id]);

    const submitComment = async () => {
        if (!commentText.trim()) return;
        try {
            const res = await axios.post(`/comments/${id}`, { text: commentText });
            setComments(prev => [...prev, res.data]);
            setCommentText('');
        } catch (err) {
            console.error('Errore invio commento:', err.message);
        }
    };

    const handleReaction = async (type) => {
        try {
            const res = await axios.post(`/news/${id}/${type}`);
            setNews(prev => ({
                ...prev,
                likes: type === 'like' ? res.data.likes : prev.likes,
                dislikes: type === 'dislike' ? res.data.dislikes : prev.dislikes
            }));
        } catch (err) {
            console.error('Errore like/dislike:', err.message);
        }
    };

    if (!news) return <Spinner animation="border" />;

    return (
        <Container>
            <Box sx={{ width: '100%', marginTop: '50px', padding: '20px', backgroundColor: 'white', color: 'black' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom>{news.title}</Typography>
                        <img src={news.imageUrl} alt="notizia" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Categoria: {news.category?.name} • Autore: {news.author?.username}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}>{news.content}</Typography>
                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button variant="contained" color="success" onClick={() => handleReaction('like')}>👍 Like</Button>
                            <Button variant="contained" color="error" onClick={() => handleReaction('dislike')}>👎 Dislike</Button>
                            <Typography variant="body1">👍 {news.likes} / 👎 {news.dislikes}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>Commenti</Typography>
                        {comments.map((c) => (
                            <Paper key={c._id} elevation={2} sx={{ p: 2, mb: 1, backgroundColor: 'white', color: 'black' }}>
                                <Typography variant="subtitle2">{c.user.username}</Typography>
                                <Typography variant="body2">{c.text}</Typography>
                            </Paper>
                        ))}
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            placeholder="Scrivi un commento..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            sx={{ mt: 2, backgroundColor: 'white', color: 'black' }}
                        />
                        <Button variant="contained" color="primary" sx={{ mt: 1 }} onClick={submitComment}>
                            Invia
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}