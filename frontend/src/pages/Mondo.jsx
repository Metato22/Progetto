import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import {NewsCard} from '../components/NewsCard';
import '../styles/HomePage.css';
import { Container, Spinner} from 'react-bootstrap';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import * as React from "react";
import Item from '../components/Item';
import '../styles/PagesStyles.css'

export default function Mondo() {
    const [news, setNews] = useState(null);

    useEffect(() => {
        axios.get('/news?region=Mondo')
            .then(res => setNews(res.data))
            .catch(() => setNews([]));
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
                                    <h1 className="section-title2">Dal Mondo</h1>
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