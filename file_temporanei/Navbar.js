import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import HomeIcon from '@mui/icons-material/Home';


function NavBar() {
    return (
        <div className="sticky-top bg-white">
            <nav className="navbar navbar-expand-lg px-4 py-3 border-bottom">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        <h1 className="m-0 display-5 fw-bold">NOWTRENDS</h1>
                    </Link>

                    <div className="mx-auto" style={{ width: '40%' }}>
                        <form className="d-flex">
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                            <button className="btn btn-outline-primary ms-2" type="submit">
                                Search
                            </button>
                        </form>
                    </div>

                    <div className="d-flex">
                        <Link to="/contacts" className="btn btn-outline-dark">
                            Contacts
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container-fluid border-bottom py-2">
                <div className="row g-0">
                    <div className="col-12 d-flex justify-content-center">
                        <Link to="/Homepage" className="category-btn">Homepage    <HomeIcon
                            fontSize="small"
                            className="me-2" /* Più spazio */
                            style={{
                                transform: 'translateY(-0.8px)', /* Micro-aggiustamento verticale */
                                fontSize: '1.1rem' /* Dimensione leggermente aumentata */
                            }}
                        /></Link>
                        <div className="dropdown">
                            <button className="category-btn dropdown-toggle" data-bs-toggle="dropdown">
                                Categorie
                            </button>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/attualita">Attualità</Link></li>
                                <li><Link className="dropdown-item" to="/sport">Sport</Link></li>
                                <li><Link className="dropdown-item" to="/tecnologia">Tecnologia</Link></li>
                                <li><Link className="dropdown-item" to="/salute">Salute</Link></li>
                                <li><Link className="dropdown-item" to="/intrattenimento">Intrattenimento</Link></li>
                            </ul>
                        </div>
                        <Link to="/StaiSeguendo" className="category-btn">Stai seguendo</Link>
                        <Link to="/Italy" className="category-btn">Italia</Link>
                        <Link to="/World" className="category-btn">Dal Mondo</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;
