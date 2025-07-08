import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import NewsCard from '../components/NewsCard';
import '../styles/HomePage.css';
import {Button, Card, Container, Spinner} from 'react-bootstrap';
import Grid from "@mui/material/Grid";
import {Link} from "react-router-dom";
import Box from "@mui/material/Box";
import * as React from "react";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#424242',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export default function HomePage() {
    const [news, setNews] = useState(null);

    useEffect(() => {
        /*axios.get('/news')
            .then(res => setNews(res.data))
            .catch(() => setNews([]));*/
        setNews([
            {
                _id: 1,
                title: "Titolo Notizia 1",
                imageUrl: "Pierre_kalulu.webp",
                description: "Descrizione della prima card",
                altText: "Immagine 1"
            },
            {
                _id: 1,
                title: "Titolo Notizia 1",
                imageUrl: "Pierre_kalulu.webp",
                description: "Descrizione della prima card",
                altText: "Immagine 1"
            }])
    }, []);

    return (
        <Container>
            <h2 className="section-title">Ultime Notizie</h2>
            {!news ? (
                <Spinner animation="border" />
            ) : (
                <Box sx={{width: '100%', marginTop: '50px', padding: '20px'}}>
                    <Grid container rowSpacing={0.5} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                        <Grid size={8}>
                            <Item>
                                <h1 className="section-title">Notizie principali</h1>
                                <Grid size={12}>

                                    {news.map(n => <NewsCard key={n._id} news={n} />)}

                                </Grid>
                            </Item>
                        </Grid>
                        <Grid size={4}>
                            <Item>
                                <Box sx={{width: '100%', flexGrow: 'column',}}>
                                    <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                                        <h1 className="section-title">Scelti per te</h1>
                                        <Grid size={12}>

                                            {news.map(n => <NewsCard key={n._id} news={n} />)}

                                        </Grid>
                                    </Grid>
                                </Box>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Container>
    );
}