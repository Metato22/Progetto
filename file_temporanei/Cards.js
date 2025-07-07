import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Styles from '../frontend/src/styles/HomePage.css';

const Cards = ({title, imageUrl, description, altText}) => {

    return (
        <Card sx={{ maxWidth: 545 }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title || ""}
                </Typography>
                <CardMedia
                    component="img"
                    height="140"
                    imageUrl={imageUrl}
                    alt={altText || ""}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description || ""}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default Cards;
