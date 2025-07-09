import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/authProvider';
import { useAuth } from './auth/useAuth';
import AppNavbar from './components/Navbar';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import LoginPage from './pages/LoginPage';
import Attualita from './pages/Attualita';
import Sport from './pages/Sport';
import Tecnologia from './pages/Tecnologia';
import Salute from './pages/Salute';
import Intrattenimento from './pages/Intrattenimento';
import Italia from './pages/Italia';
import DalMondo from './pages/DalMondo';
import StaiSeguendo from './pages/StaiSeguendo';
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
                            <Route path="/attualita" element={<Attualita />} />
                            <Route path="/sport" element={<Sport />} />
                            <Route path="/tecnologia" element={<Tecnologia />} />
                            <Route path="/salute" element={<Salute />} />
                            <Route path="/intrattenimento" element={<Intrattenimento />} />
                            <Route path="/staiseguendo" element={<StaiSeguendo />} />
                            <Route path="/italia" element={<Italia />} />
                            <Route path="/dalmondo" element={<DalMondo />} />
                        </Routes>
                    </header>
                </div>
            </AuthProvider>
        </Router>
    );
}