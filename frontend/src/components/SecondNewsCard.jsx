import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as React from "react";
import '../styles/NewsCard.css';

export default function SecondNewsCard({ news }) {
    return (
        <Card className="mb-3" style={{border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <Card.Img variant="top" src={news.imageUrl} style={{height: '150px', objectFit: 'cover'}}/>
            <Card.Body>
                <Card.Title style={{fontSize: '1rem'}}>{news.title}</Card.Title>
                <p className="card-text">{news.excerpt}</p>
                <Link to={`/news/${news._id}`} className="btn-custom-dark">
                    Leggi tutto
                </Link>
                <p className="card-text">
                    <small className="text-body-secondary">
                        Ultima modifica: {new Date(news.updatedAt).toLocaleString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                    </small>
                </p>
            </Card.Body>
        </Card>
    );
}