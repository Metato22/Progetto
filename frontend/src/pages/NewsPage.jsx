import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Container, Spinner } from 'react-bootstrap';
import { useSocket } from '../context/SocketContext';

export default function NewsPage() {
    const { id } = useParams();
    const socket = useSocket();

    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);

    // Fetch iniziale
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

    // Socket.IO listener
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
        const textArea = document.getElementById('commentBox');
        const text = textArea.value.trim();

        if (!text) return;

        try {
            const res = await axios.post(`/comments/${id}`, { text });
            setComments(prev => [...prev, res.data]);
            textArea.value = '';
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
            <h2>{news.title}</h2>
            <img src={news.imageUrl} alt="notizia" className="img-fluid mb-3" />
            <p className="text-muted">
                Categoria: {news.category?.name} • Autore: {news.author?.username}
            </p>
            <p>{news.content}</p>

            <div className="mt-4 flex items-center gap-3">
                <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleReaction('like')}
                >
                    👍 Like
                </button>
                <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleReaction('dislike')}
                >
                    👎 Dislike
                </button>
                <span>👍 {news.likes} / 👎 {news.dislikes}</span>
            </div>

            <hr className="my-4" />

            <h4>Commenti</h4>
            {comments.map((c) => (
                <div key={c._id} className="mb-2 border-bottom pb-1">
                    <strong>{c.user.username}</strong>: {c.text}
                </div>
            ))}

            <textarea className="form-control mt-3" id="commentBox" placeholder="Scrivi un commento..." />
            <button className="btn btn-primary mt-2" onClick={submitComment}>Invia</button>
        </Container>
    );
}