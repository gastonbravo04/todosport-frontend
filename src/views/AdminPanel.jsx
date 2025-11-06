import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Row, Col, Container, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';

// 🛠️ CORRECCIÓN 1: Definir la URL de Railway aquí, asegurando HTTPS y /api
const API_BASE = 'https://todosport-production.up.railway.app/api';

export default function AdminPanel() {
    const { authFetch, logout, user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const prodCtx = useProducts();
    const refreshProducts = prodCtx?.refreshProducts || (() => {});
    const [orders, setOrders] = useState([]);
    const [, setLoading] = useState(false);
    
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, image: '', category: '', brand: '' });

    const fetchProducts = React.useCallback(async () => {
        setLoading(true);
        try {
            // 🛠️ CORRECCIÓN 2: Usar API_BASE
            const res = await fetch(`${API_BASE}/products/`);
            const data = await res.json().catch(() => []);
            setProducts(Array.isArray(data) ? data : data.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrders = React.useCallback(async () => {
        try {
            // 🛠️ CORRECCIÓN 3: Usar API_BASE
            const r = await authFetch(`${API_BASE}/orders/`);
            const d = await r.json().catch(() => []);
            // Asegurarnos de mostrar las órdenes más recientes primero (desc por fecha)
            const raw = Array.isArray(d) ? d : d.results || [];
            raw.sort((a, b) => {
                const da = new Date(a.date || a.created_at || a.timestamp || 0).getTime();
                const db = new Date(b.date || b.created_at || b.timestamp || 0).getTime();
                return db - da; // descendente
            });
            setOrders(raw);
        } catch (e) {
            console.error(e);
        }
    }, [authFetch]);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, [fetchProducts, fetchOrders]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleShowCreate = () => {
        setEditing(null);
        setForm({ name: '', description: '', price: 0, stock: 0, image: '', category: '', brand: '' });
        setShowForm(true);
    };

    const handleEdit = (p) => {
        setEditing(p);
        setForm({
            name: p.name || '',
            description: p.description || '',
            price: p.price || 0,
            stock: p.stock || 0,
            image: p.image || '',
            category: p.category || '',
            brand: p.brand || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (p) => {
        if (!window.confirm('Eliminar producto?')) return;
        try {
            // 🛠️ CORRECCIÓN 4: Usar API_BASE
            const r = await authFetch(`${API_BASE}/products/${p.product_id || p.id || p.pk}/`, { method: 'DELETE' });
            if (r.ok) fetchProducts();
            else alert('No autorizado o error al eliminar');
        } catch (e) { console.error(e); alert('Error al eliminar'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Asegurarnos que price tenga solo 2 decimales y que brand/description estén presentes
            const priceNum = Number.isFinite(parseFloat(form.price)) ? parseFloat(parseFloat(form.price).toFixed(2)) : 0;
            const stockNum = parseInt(form.stock || 0, 10) || 0;
            const payload = { ...form, price: priceNum, stock: stockNum };
            
            // 🛠️ CORRECCIÓN 5: Usar API_BASE
            const url = `${API_BASE}/products/${editing ? (editing.product_id || editing.id || editing.pk) + '/' : ''}`;
            
            const method = editing ? 'PATCH' : 'POST';
            const r = await authFetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            
            if (r.ok) {
                setShowForm(false);
                // actualizar la lista local y la global (Home usa ProductContext)
                fetchProducts();
                try { refreshProducts(); } catch (e) { /* no crítico si falla */ }
                window.alert('Guardado con éxito');
            } else {
                // try parse json error
                let errText = '';
                try { const j = await r.json(); errText = JSON.stringify(j); } catch { errText = await r.text().catch(() => 'Error desconocido'); }
                alert('Error al guardar: ' + errText);
            }
        } catch (err) { console.error(err); alert('Error al guardar'); }
    };

    const totalRevenue = orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
    
    // ... (resto del componente return)
}