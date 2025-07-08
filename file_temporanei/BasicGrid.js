import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Cards from './Cards'
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';






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
        <Box sx={{ width: '100%', marginTop: '50px', padding: '20px' }}>
            <Grid container rowSpacing={0.5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid size={8}>
                    <Item>
                        <h1 className="section-title">Scelti per te</h1>
                        <Grid size={12}>
                            <Item>1</Item>
                        </Grid>
                        <Grid size={12}>
                            <Item>2</Item>
                        </Grid>
                        <Grid size={12}>
                            <Item>3</Item>
                        </Grid>
                        <Grid size={12}>
                            <Item>1</Item>
                        </Grid>
                        <Grid size={12}>
                            <Item>2</Item>
                        </Grid>
                        <Grid size={12}>
                            <Item>3</Item>
                        </Grid>
                    </Item>
                </Grid>
                <Grid size={4}>
                    <Item>
                        <Box sx={{ width: '100%', flexGrow:'column', }}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <h1 className="section-title">Scelti per te</h1>
                                <Grid size={12}>
                                    <Item>1</Item>
                                </Grid>
                                <Grid size={12}>
                                    <Item>2</Item>
                                </Grid>
                                <Grid size={12}>
                                    <Item>3</Item>
                                </Grid>
                                <Grid size={12}>
                                    <Item>4</Item>
                                </Grid>
                            </Grid>
                        </Box>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}

