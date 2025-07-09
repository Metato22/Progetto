import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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

export default function SecondNewsCard({ news }) {
    return (
        <Card className="mb-3" style={{border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <Card.Img variant="top" src={news.imageUrl} style={{height: '150px', objectFit: 'cover'}}/>
            <Card.Body>
                <Card.Title style={{fontSize: '1rem'}}>{news.title}</Card.Title>
                <Button variant="outline-primary" size="sm" as={Link} to={`/news/${news._id}`}>
                    Leggi tutto
                </Button>
            </Card.Body>
        </Card>
    );
}