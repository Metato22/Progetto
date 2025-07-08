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

export default function NewsCard({ news }) {
    return (
        <Item>
            <Card>
                {news.imageUrl && <Card.Img variant="top" src={news.imageUrl} style={{ height: 180, objectFit: 'cover' }} />}
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="mb-2">{news.title}</Card.Title>
                    <Card.Text className="text-muted flex-grow-1">{news.excerpt}</Card.Text>
                    <Button as={Link} to={`/news/${news._id}`} variant="outline-primary" size="sm">
                        Leggi tutto
                    </Button>
                </Card.Body>
            </Card>
        </Item>
    );
}