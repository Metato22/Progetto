import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '80vh' }}>
            <h1 className="display-1 text-danger">404</h1>
            <p className="lead">La pagina che cerchi non esiste</p>
            <Button as={Link} to="/" variant="primary">Torna alla Home</Button>
        </Container>
    );
}