import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import NewsCard from '../components/NewsCard';
import '../styles/HomePage.css';
import { Container, Spinner } from 'react-bootstrap';

export default function HomePage() {
    const [news, setNews] = useState(null);

    useEffect(() => {
        axios.get('/news')
            .then(res => setNews(res.data))
            .catch(() => setNews([]));
    }, []);

    return (
        <Container>
            <h2 className="section-title">Ultime Notizie</h2>
            {!news ? (
                <Spinner animation="border" />
            ) : (
                <div className="news-grid">
                    {news.map(n => <NewsCard key={n._id} news={n} />)}
                </div>
            )}
        </Container>
    );
}