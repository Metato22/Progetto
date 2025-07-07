import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/authProvider';
import { useAuth } from './auth/useAuth';
import AppNavbar from './components/Navbar';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
//import ProfilePage from './pages/ProfilePage';
//import AdminPanel from './pages/AdminPanel';
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
                <div className="App">
                    <AppNavbar />
                    <header className="App-header">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/news/:id" element={<NewsPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </header>
                </div>
            </AuthProvider>
        </Router>
    );
}