import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container text-center py-3 d-flex flex-column flex-md-row justify-content-between align-items-center">
                <small>&copy; {new Date().getFullYear()} ClikNews. Tutti i diritti riservati.</small>
                <Link to="/contacts" className="footer-link">Contatti</Link>
            </div>
        </footer>
    );
}