import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Container, Spinner } from 'react-bootstrap';
import { useSocket } from '../context/SocketContext';
import { Box, Grid, Typography, Button, TextField, Paper, IconButton, Alert } from '@mui/material';
import { useAuth } from '../auth/useAuth';
import DeleteIcon from '@mui/icons-material/Delete';

export default function NewsPage() {
    const { id } = useParams();
    const socket = useSocket();
    const { user } = useAuth();

    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [userLike, setUserLike] = useState(false);
    const [userDislike, setUserDislike] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [newsRes, commentsRes] = await Promise.all([
                    axios.get(`/news/item/${id}`),
                    axios.get(`/comments/${id}`)
                ]);
                setNews(newsRes.data);
                setComments(commentsRes.data);

                if (user && newsRes.data.reactions) {
                    const uid = user._id;
                    setUserLike(newsRes.data.reactions.likes.includes(uid));
                    setUserDislike(newsRes.data.reactions.dislikes.includes(uid));
                }
            } catch (err) {
                console.error('Errore nel caricamento iniziale:', err.message);
            }
        };
        fetchData();
    }, [id, user]);

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

    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`/comments/${commentId}`);
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) {
            console.error('Errore eliminazione commento:', err.message);
        }
    };

    const handleReaction = async (type) => {
        try {
            const res = await axios.post(`/news/${id}/${type}`);
            setNews(prev => ({
                ...prev,
                likes: res.data.likes,
                dislikes: res.data.dislikes,
                reactions: res.data.reactions
            }));

            if (type === 'like') {
                setUserLike(!userLike);
                if (userDislike) setUserDislike(false);
            } else {
                setUserDislike(!userDislike);
                if (userLike) setUserLike(false);
            }
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
                            <Button
                                variant="contained"
                                color={userLike ? 'primary' : 'success'}
                                disabled={!user}
                                onClick={() => handleReaction('like')}
                            >
                                👍 Like
                            </Button>
                            <Button
                                variant="contained"
                                color={userDislike ? 'primary' : 'error'}
                                disabled={!user}
                                onClick={() => handleReaction('dislike')}
                            >
                                👎 Dislike
                            </Button>
                            <Typography variant="body1">👍 {news.likes} / 👎 {news.dislikes}</Typography>
                        </Box>

                        {!user && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Effettua il login per lasciare un commento o votare.
                            </Alert>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>Commenti</Typography>
                        {comments.map((c) => (
                            <Paper key={c._id} elevation={2} sx={{ p: 2, mb: 1, backgroundColor: 'white', color: 'black', position: 'relative' }}>
                                <Typography variant="subtitle2">{c.user.username}</Typography>
                                <Typography variant="body2">{c.text}</Typography>
                                {user && user._id === c.user._id && (
                                    <IconButton
                                        onClick={() => deleteComment(c._id)}
                                        sx={{ position: 'absolute', top: 5, right: 5 }}
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                )}
                            </Paper>
                        ))}
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            placeholder={user ? "Scrivi un commento..." : "Devi essere loggato per commentare"}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={!user}
                            sx={{ mt: 2, backgroundColor: 'white', color: 'black' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={submitComment}
                            disabled={!user}
                        >
                            Invia
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}