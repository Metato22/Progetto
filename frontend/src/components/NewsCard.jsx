import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NewsCard({ news }) {
    return (
        <Card className="shadow-sm border-0 h-100">
            {news.imageUrl && <Card.Img variant="top" src={news.imageUrl} style={{ height: 180, objectFit: 'cover' }} />}
            <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-2">{news.title}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">{news.excerpt}</Card.Text>
                <Button as={Link} to={`/news/${news._id}`} variant="outline-primary" size="sm">
                    Leggi tutto
                </Button>
            </Card.Body>
        </Card>
    );
}