import { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from '../api/axiosInstance'; // assicurati che l'istanza Axios sia corretta

export default function AppNavbar() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error('Errore nel caricamento categorie', err));
    }, []);

    return (
        <Navbar expand="lg" bg="light" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <h1>MyNews</h1>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        <NavDropdown title="Categorie" id="categories-dropdown">
                            {categories.length === 0 ? (
                                <NavDropdown.Item disabled>Caricamento...</NavDropdown.Item>
                            ) : (
                                categories.map(c => (
                                    <NavDropdown.Item
                                        key={c._id}
                                        as={Link}
                                        to={`/category/${c.slug || c.name.toLowerCase()}`}
                                    >
                                        {c.name}
                                    </NavDropdown.Item>
                                ))
                            )}
                        </NavDropdown>

                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        <Nav.Link as={Link} to="/register">Registrati</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}