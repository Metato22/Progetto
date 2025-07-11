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
        <div className="container-fluid">
            {/* Titolo principale */}
            <h1 className="section-title1 mb-4">ULTIME NOTIZIE</h1>

            <div className="row g-3">
                {/* Colonna principale (8/12) */}
                <div className="col-lg-8">
                    <div className="card bg-dark text-white border-0 mb-3">
                        <div className="card-body">
                            <div className="w-100">
                                {/* Sezione Notizie principali */}
                                <h2 className="section-title mb-3">Notizie principali</h2>

                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-light" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row g-2">
                                        {combinedNews.map((news) => (
                                            <div className="col-12" key={news.id ?? news.title}>
                                                <NewsCard data={news} className="mb-3" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (4/12) */}
                <div className="col-lg-4">
                    <div className="card bg-dark text-white border-0">
                        <div className="card-body">
                            <h2 className="section-title mb-3">Scelti per te</h2>

                            {isAuthenticated ? (
                                combinedPersonalizedNews.length > 0 ? (
                                    combinedPersonalizedNews.map((news) => (
                                        <SecondNewsCard
                                            key={news._id ?? news.title}
                                            news={news}
                                            className="mb-3"
                                        />
                                    ))
                                ) : (
                                    <p className="text-white-50">Nessuna notizia personalizzata disponibile.</p>
                                )
                            ) : (
                                <p className="text-white-50 p-2">
                                    Per vedere contenuti personalizzati, {' '}
                                    <a href="/login" className="text-decoration-none fw-bold text-white">accedi</a>{' '}
                                    o {' '}
                                    <a href="/register" className="text-decoration-none fw-bold text-white">registrati</a>.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}