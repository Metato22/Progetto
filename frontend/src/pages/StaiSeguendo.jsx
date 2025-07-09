import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import {NewsCard} from '../components/NewsCard';
import '../styles/HomePage.css';
import {Button, Card, Container, Spinner} from 'react-bootstrap';
import Grid from "@mui/material/Grid";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";
import * as React from "react";
import Item from '../components/Item';
import '../styles/PagesStyles.css'

export default function StaiSeguendo() {
    const [news, setNews] = useState(null);

    useEffect(() => {
        /*axios.get('/news')
            .then(res => setNews(res.data))
            .catch(() => setNews([]));*/
        setNews([
            {
                _id: 1,
                title: "Titolo Notizia 1",
                imageUrl: "logo_nowtrends.png",
                description: "Descrizione della prima card",
                altText: "Immagine 1"
            },
            {
                _id: 1,
                title: "Titolo Notizia 1",
                imageUrl: "logo_nowtrends.png",
                description: "Descrizione della prima card",
                altText: "Immagine 1"
            }])
    }, []);

    return (
        <Container>
            {!news ? (
                <Spinner animation="border"/>
            ) : (
                <Box sx={{width: '100%', marginTop: '50px', padding: '20px', }}>
                    <Grid container rowSpacing={0.5} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                        <Grid size={12}>
                            <Item>
                                <div className="header-container">
                                    <h1 className="section-title2">DA MODIFICARE</h1>
                                </div>
                                <Grid size={12}>
                                    {news.map(n => <NewsCard key={n._id} news={n}/>)}
                                </Grid>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Container>
    );
}