import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Cards from './Cards'
import Typography from "@mui/material/Typography";






const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export default function BasicGrid() {
    const newsData = [
        {
            id: 1,
            title: "Titolo Notizia 1",
            imageUrl: "Pierre_kalulu.webp",
            description: "Descrizione della prima card",
            altText: "Immagine 1"
        },
        {
            id: 2,
            title: "Titolo Notizia 2",
            imageUrl: "https://via.placeholder.com/545x140",
            description: "Descrizione della seconda card",
            altText: "Immagine 2"
        },
        {
            id: 3,
            title: "Titolo Notizia 3",
            imageUrl: "https://via.placeholder.com/545x140",
            description: "Descrizione della terza card",
            altText: "Immagine 3"
        },
        {
            id: 4,
            title: "Titolo Notizia 4",
            imageUrl: "https://via.placeholder.com/545x140",
            description: "Descrizione della quarta card",
            altText: "Immagine 4"
        }
    ];
    return (
        <Container maxWidth="md" className="news-container">
            <h1 className="section-title">Scelti per te</h1>

            <div className="news-grid">
                {newsData.map((item) => (
                    <Cards
                        key={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl}
                        description={
                            <>
                                <span className="card-source">{item.source}</span>
                                <span className="card-meta">{item.meta}</span>
                            </>
                        }
                        altText={item.source}
                    />
                ))}
            </div>
        </Container>
    );
}

