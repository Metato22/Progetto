import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/authProvider';
import { useAuth } from './auth/useAuth';
import { CategoriesProvider } from './context/CategoriesContext'; // import CategoriesProvider

import AppNavbar from './components/Navbar';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import LoginPage from './pages/LoginPage';
import GoogleSuccessPage from './pages/GoogleSuccessPage';
import CategoryPage from './pages/CategoryPage';
import Italia from './pages/Italia';
import Mondo from './pages/Mondo';
import Preferiti from './pages/Preferiti';
import Contacts from './pages/Contacts';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
import NotFoundPage from './pages/NotFoundPage';
import './styles/App.css';

function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
    const { isAdmin } = useAuth();
    return isAdmin ? children : <Navigate to="/" />;
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <CategoriesProvider>
                    <div className="App">
                        <AppNavbar />
                        <header className="App-header">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/news/:id" element={<NewsPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/auth/google/success" element={<GoogleSuccessPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="*" element={<NotFoundPage />} />
                                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                                <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                                <Route path="/category/:slug" element={<CategoryPage />} />
                                <Route path="/preferiti" element={<Preferiti />} />
                                <Route path="/italia" element={<Italia />} />
                                <Route path="/mondo" element={<Mondo />} />
                                <Route path="/contacts" element={<Contacts />} />
                            </Routes>
                        </header>
                    </div>
                </CategoriesProvider>
            </AuthProvider>
        </Router>
    );
}