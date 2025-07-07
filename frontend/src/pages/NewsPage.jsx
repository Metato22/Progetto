import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Container, Spinner, Alert } from 'react-bootstrap';

export default function NewsPage() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.get(`/news/${id}`).then(res => setNews(res.data));
        axios.get(`/comments/${id}`).then(res => setComments(res.data));
    }, [id]);

    const submitComment = async () => {
        const text = document.getElementById('commentBox').value;
        const res = await axios.post(`/comments/${id}`, { text });
        setComments([...comments, res.data]);
        document.getElementById('commentBox').value = '';
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
            console.error('Errore like/dislike:', err);
        }
    };

    if (!news) return <Spinner />;

    return (
        <Container>
            <h2>{news.title}</h2>
            <img src={news.imageUrl} alt="notizia" className="img-fluid mb-3" />
            <p className="text-muted">Categoria: {news.category?.name} • Autore: {news.author?.username}</p>
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
            {comments.map((c, i) => (
                <div key={i} className="mb-2 border-bottom pb-1">
                    <strong>{c.user.username}</strong>: {c.text}
                </div>
            ))}
            <textarea className="form-control mt-3" id="commentBox" placeholder="Scrivi un commento..." />
            <button className="btn btn-primary mt-2" onClick={submitComment}>Invia</button>
        </Container>
    );
}