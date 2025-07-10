import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import {NewsCard} from '../components/NewsCard';
import '../styles/HomePage.css';
import { Container, Spinner} from 'react-bootstrap';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import * as React from "react";
import Item from '../components/Item';
import { useParams } from 'react-router-dom';
import '../styles/PagesStyles.css';

export default function CategoryPage() {
    const { slug } = useParams(); // ← ottieni l'id categoria dalla URL
    const [category, setCategory] = useState(null);
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryAndNews = async () => {
            try {
                const categoryRes = await axios.get(`/categories/${slug}`);
                setCategory(categoryRes.data);

                const newsRes = await axios.get(`/news?category=${slug}`);
                setNews(newsRes.data);
            } catch (error) {
                console.error('Errore durante il fetch:', error);
                setCategory(null);
                setNews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryAndNews();
    }, [slug]);

    if (loading) {
        return (
            <Container>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{width: '100%', marginTop: '50px', padding: '20px'}}>
                <Grid container rowSpacing={0.5} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                    <Grid item xs={12}>
                        <Item>
                            <div className="header-container">
                                <h1 className="section-title2">
                                    {category ? category.name : 'Categoria'}
                                </h1>
                                <button type="button" className="btn special-outline-light btn-lg">
                                    Segui
                                </button>
                            </div>
                            <Grid item xs={12}>
                                {news.length > 0 ? (
                                    news.map(n => <NewsCard key={n._id} news={n} />)
                                ) : (
                                    <p>Nessuna notizia per questa categoria.</p>
                                )}
                            </Grid>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}