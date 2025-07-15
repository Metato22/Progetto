import { createContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = () => {
        return axiosInstance.get('/user/me')
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.warn('Errore /user/me:', err.response?.status);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (accessToken) => {
        localStorage.setItem('token', accessToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        await loadUser();
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } catch {
            // Silenzia errori logout
        }
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
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