import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axiosInstance'; // assicurati che l'istanza Axios sia corretta
import ArticleIcon from '@mui/icons-material/Article';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import '../styles/Navbar.css';

export default function AppNavbar() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error('Errore nel caricamento categorie', err));
    }, []);



    return (
        <div className="sticky-top bg-white">
            <nav className="navbar navbar-expand-lg px-4 py-3 border-bottom">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        <h1 className="m-0 display-5 fw-bold">
                            <ArticleIcon
                                fontSize="small"
                                className="me-2" /* Più spazio */
                                style={{
                                    transform: 'translateY(-0.8px)', /* Micro-aggiustamento verticale */
                                    fontSize: '1.1rem' /* Dimensione leggermente aumentata */
                                }}
                            />
                            NowTrends
                        </h1>
                    </Link>

                    <div className="mx-auto" style={{ width: '40%' }}>
                        <form className="d-flex">
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                            <button className="btn btn-outline-light ms-2" type="submit">
                                Search
                            </button>
                        </form>
                    </div>
                    <div className="d-flex">
                        <Link to="/contacts" className="btn btn-outline-light">
                            <ContactPageIcon
                                fontSize="small"
                                className="me-2"
                                style={{
                                    transform: 'translateY(-0.8px)',
                                    fontSize: '1.1rem'
                                }}
                            />
                            Contacts
                        </Link>
                    </div>
                    <div className="d-flex">
                        <Link to="/login" className="btn btn-outline-light">
                            <LoginIcon
                                fontSize="small"
                                className="me-2"
                                style={{
                                    transform: 'translateY(-0.8px)',
                                    fontSize: '1.1rem'
                                }}
                            />
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container-fluid border-bottom py-2">
                <div className="row g-0">
                    <div className="col-12 d-flex justify-content-center">
                        <Link to="/" className="category-btn">
                            <HomeIcon
                                fontSize="small"
                                className="me-2" /* Più spazio */
                                style={{
                                    transform: 'translateY(-0.8px)', /* Micro-aggiustamento verticale */
                                    fontSize: '1.1rem' /* Dimensione leggermente aumentata */
                                }}
                            />
                            Homepage
                        </Link>
                        <div className="dropdown">
                            <button className="category-btn dropdown-toggle" data-bs-toggle="dropdown">
                                <CategoryIcon
                                    fontSize="small"
                                    className="me-2"
                                    style={{
                                        transform: 'translateY(-0.8px)',
                                        fontSize: '1.1rem'
                                    }}
                                />
                                Categorie
                            </button>
                           <ul className="dropdown-menu">
                                {categories.length === 0 ? (
                                    <li><Link to="/" className="dropdown-item" disabled>Caricamento...</Link></li>
                                    ) : (
                                    categories.map(c => (
                                    <li>
                                        <Link
                                            key={c._id}
                                            className="dropdown-item"
                                            to={`/category/${c.slug || c.name.toLowerCase()}`}
                                        >
                                            {c.name}
                                        </Link>
                                    </li>
                                    ))
                                )}
                                <li><Link className="dropdown-item" to="/attualita">Attualità</Link></li>
                                <li><Link className="dropdown-item" to="/sport">Sport</Link></li>
                                <li><Link className="dropdown-item" to="/tecnologia">Tecnologia</Link></li>
                                <li><Link className="dropdown-item" to="/salute">Salute</Link></li>
                                <li><Link className="dropdown-item" to="/intrattenimento">Intrattenimento</Link></li>
                            </ul>

                        </div>
                        <Link to="/StaiSeguendo" className="category-btn">
                            <BookmarkIcon
                                fontSize="small"
                                className="me-2"
                                style={{
                                    transform: 'translateY(-0.8px)',
                                    fontSize: '1.1rem'
                                }}
                            />
                            Stai seguendo
                        </Link>
                        <Link to="/Italy" className="category-btn">
                            <FlagIcon
                                fontSize="small"
                                className="me-2"
                                style={{
                                    transform: 'translateY(-0.8px)',
                                    fontSize: '1.1rem'
                                }}
                            />
                            Italia
                        </Link>
                        <Link to="/World" className="category-btn">
                            <PublicIcon
                                fontSize="small"
                                className="me-2"
                                style={{
                                    transform: 'translateY(-0.8px)',
                                    fontSize: '1.1rem'
                                }}
                            />
                            Dal Mondo
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}