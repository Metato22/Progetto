import { useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/Article';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PublicIcon from '@mui/icons-material/Public';
import FlagIcon from '@mui/icons-material/Flag';
import { useCategories } from '../context/CategoriesContext';  // <-- importa il context
import '../styles/Navbar.css';

export default function AppNavbar() {
    const { categories, fetchCategories } = useCategories();
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Errore nel logout:', error);
        }
    };

    return (
        <div className="sticky-top bg-white">
            <nav className="navbar navbar-expand-lg px-4 py-3 border-bottom">
                <div className="container-fluid d-flex justify-content-center">
                    <Link to="/" className="navbar-brand mx-auto">
                        <h1 className="brand-title m-0 fw-bold text-center">
                            <ArticleIcon classname='brand-icon'
                                         style={{
                                             fontSize: '3rem',
                                             marginRight: '0.75rem',
                                             transform: 'translateY(-1px)'
                                         }}
                            />
                            ClickNews
                        </h1>
                    </Link>


                    <div className="d-flex">
                        {user ? (
                            <div className="dropdown">
                                <button
                                    className="btn btn-outline-dark rounded-circle d-flex align-items-center justify-content-center"
                                    type="button"
                                    id="userMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{width: '40px', height: '40px'}}
                                >
                                    <AccountCircleIcon/>
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
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-outline-dark">
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

            <div className="container-fluid border-top border-bottom bottom-5 border-dark py-2">
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
                                {(!categories || categories.length === 0) ? (
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
                            Dal mondo
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}