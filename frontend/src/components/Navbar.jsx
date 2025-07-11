import { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
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
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error('Errore nel caricamento categorie', err));
    }, []);

    const handleLogout = async () => {
        try {
            await logout();  // usa logout dal context, che dovrebbe chiamare backend e pulire stato + localStorage
            navigate('/login');
        } catch (error) {
            console.error('Errore nel logout:', error);
        }
    };

    return (
        <div className="sticky-top bg-white">
            <nav className="navbar navbar-expand-lg px-4 py-3 border-bottom">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand">
                        <h1 className="m-0 display-5 fw-bold">
                            <ArticleIcon
                                fontSize="small"
                                className="me-2"
                                style={{
                                    transform: 'translateY(-0.8px)',
                                    fontSize: '1.1rem'
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
                        {user ? (
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                                    type="button"
                                    id="userMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <AccountCircleIcon />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
                                    <li>
                                        <Link className="dropdown-item" to="/profile">Profilo</Link>
                                    </li>
                                    {isAdmin && (
                                        <li>
                                            <Link className="dropdown-item" to="/admin">Admin Panel</Link>
                                        </li>
                                    )}
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
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
                        )}
                    </div>
                </div>
            </nav>

            <div className="container-fluid border-bottom py-2">
                <div className="row g-0">
                    <div className="col-12 d-flex justify-content-center">
                        <Link to="/" className="category-btn">
                            <HomeIcon
                                fontSize="small"
                                className="me-2"
                                style={{
                                    transform: 'translateY(-0.8px)',
                                    fontSize: '1.1rem'
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
                                    <li>
                                        <span className="dropdown-item disabled">Caricamento...</span>
                                    </li>
                                ) : (
                                    categories.map(c => (
                                        <li key={c._id}>
                                            <Link
                                                className="dropdown-item"
                                                to={`/category/${c.slug}`}
                                            >
                                                {c.name}
                                            </Link>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                        <Link to="/preferiti" className="category-btn">
                            <BookmarkIcon
                                fontSize="small"
                                className="me-2"
                                style={{
                                    transform: 'translateY(-0.8px)',
                                    fontSize: '1.1rem'
                                }}
                            />
                            Preferiti
                        </Link>
                        <Link to="/italia" className="category-btn">
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
                        <Link to="/mondo" className="category-btn">
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