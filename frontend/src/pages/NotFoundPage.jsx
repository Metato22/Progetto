import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Item from '../components/Item';

export default function NotFoundPage() {
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '80vh' }}>
            <Item>
                <h1 className="display-1 text-danger">404</h1>
                <p className="lead text-white">La pagina che cerchi non esiste</p>
                <Button as={Link} to="/" variant="light" className="dark-button">Torna alla Home</Button>
            </Item>
        </Container>
    );
}