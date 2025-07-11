import { createContext, useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async (token) => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const res = await axios.get('/user/me');
            setUser(res.data);
            setLoading(false);
            return true;
        } catch (err) {
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
            return false;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post('/logout'); // backend elimina refresh token e cookie
        } catch (error) {
            // Ignora errori logout backend
        }
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'admin',
                isPremium: user?.planLevel === 'premium',
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};