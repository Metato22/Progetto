import { createContext, useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

// Crea il contesto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Al caricamento recupera i dati dell’utente se autenticato
        axios.get('/user/me')
            .then(res => setUser(res.data))
            .catch(() => setUser(null));
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin: user?.role === 'admin',
            isPremium: user?.subscriptionLevel === 'premium'
        }}>
            {children}
        </AuthContext.Provider>
    );
};