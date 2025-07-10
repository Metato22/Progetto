import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import {NewsCard} from '../components/NewsCard';
import SecondNewsCard from '../components/SecondNewsCard';
import '../styles/HomePage.css';
import {Container, Spinner} from 'react-bootstrap';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import * as React from "react";
import Item from '../components/Item';

export default function HomePage() {
    const [news, setNews] = useState([]);
    const getNews = ()=>{
        fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=a05726aa40f745b1b9e5f4f5bef74324')
        .then(res => res.json())
        .then(json => setNews(json.articles))
    }

    useEffect(()=>{
        getNews()
        },[])


    return (
        <Container>
            <h2 className="section-title0">ULTIME NOTIZIE</h2>
                <Spinner animation="border" />
                <Box sx={{width: '100%', marginTop: '50px', padding: '20px'}}>
                    <Grid container rowSpacing={0.5} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                        <Grid size={8}>
                            <Item>
                                <h1 className="section-title">Notizie principali</h1>
                                <Grid size={12}>
                                    {news.map((data) => {
                                        return <NewsCard data={data}/>
                                    })}
                                </Grid>
                            </Item>
                        </Grid>
                        <Grid size={4}>
                            <Item>
                                <Box sx={{width: '100%', flexGrow: 'column',}}>
                                    <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                                        <h1 className="section-title">Scelti per te</h1>
                                        <Grid size={12}>
                                            {news.map(n => <SecondNewsCard key={n._id} news={n} />)}
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