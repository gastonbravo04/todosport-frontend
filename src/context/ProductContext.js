import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/products/`);
            if (!res.ok) {
                throw new Error(`Error en el fetch: ${res.statusText}`);
            }
            const data = await res.json();
            const items = Array.isArray(data) ? data : (data.results || []);
            const mapped = items.map(p => ({
                product_id: p.product_id,
                name: p.name,
                description: p.description,
                price: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p.price),
                image: p.image || '',
                sizes: p.sizes || ['Único'],
                category: p.category || '',
                brand: p.brand || '',
                stock: Number.isFinite(p.stock) ? p.stock : 0,
            }));
            setAllProducts(mapped);
        } catch (err) {
            console.error('No se pudieron cargar productos desde el backend, usando lista vacía.', err);
            setError(err.message);
            setAllProducts([]); // En caso de error, no mostramos productos para evitar inconsistencias
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);

    const value = {
        allProducts,
        loading,
        error,
        refreshProducts: fetchProducts,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
