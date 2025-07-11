// src/context/CategoriesContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axiosInstance';

export const CategoriesContext = createContext();

export function CategoriesProvider({ children }) {
    const [categories, setCategories] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Errore caricamento categorie:', error);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <CategoriesContext.Provider value={{ categories, fetchCategories }}>
            {children}
        </CategoriesContext.Provider>
    );
}

// Hook custom da usare nei componenti per accedere al context
export function useCategories() {
    const context = useContext(CategoriesContext);
    if (!context) {
        throw new Error('useCategories must be used within a CategoriesProvider');
    }
    return context;
}