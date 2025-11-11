import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Form, Row, Col, Container, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';

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
    const [form, setForm] = useState({ name: '', description: '', price: 0, stock: 0, image: '', category: '', marca: '' });

    // API base (usa la variable de entorno si está definida, si no usa Railway)
    const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://todosport-production.up.railway.app/api';

    const fetchProducts = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/products/`);
            const data = await res.json().catch(() => []);
            setProducts(Array.isArray(data) ? data : data.results || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [API_BASE]);

    const fetchOrders = React.useCallback(async () => {
        try {
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
    }, [authFetch, API_BASE]);

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
        setForm({ name: '', description: '', price: 0, stock: 0, image: '', category: '', marca: '' });
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
            // Soportar objetos que vengan con 'marca' (local) o 'brand' (backend)
            marca: p.marca || p.brand || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (p) => {
        if (!window.confirm('Eliminar producto?')) return;
        try {
            const r = await authFetch(`${API_BASE}/products/${p.product_id || p.id || p.pk}/`, { method: 'DELETE' });
            if (r.ok) fetchProducts();
            else alert('No autorizado o error al eliminar');
        } catch (e) { console.error(e); alert('Error al eliminar'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Asegurarnos que price tenga solo 2 decimales y que marca/description estén presentes
            const priceNum = Number.isFinite(parseFloat(form.price)) ? parseFloat(parseFloat(form.price).toFixed(2)) : 0;
            const stockNum = parseInt(form.stock || 0, 10) || 0;
            // Asegurarnos de enviar también la propiedad 'brand' que espera el backend
            const payload = { ...form, price: priceNum, stock: stockNum };
            if (!payload.brand && payload.marca) payload.brand = payload.marca;
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

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            {/* Cabecera tipo Home */}
            <div style={{ background: '#232f3e', color: '#fff', padding: '12px 0' }}>
                <Container>
                    <Row className="align-items-center">
                        <Col xs={6} md={6}>
                            <h3 style={{ margin: 0, fontWeight: 700 }}>TodoSport</h3>
                        </Col>
                        <Col xs={6} md={6} className="text-end">
                            <span style={{ marginRight: 12 }}>Bienvenido, <strong>{user?.username || 'admin'}</strong>!</span>
                            <Button variant="outline-light" onClick={handleLogout}>Cerrar sesión</Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container style={{ paddingTop: 12 }}>
                <Row className="mb-3 align-items-center">
                    <Col><h4>Resumen</h4></Col>
                    <Col className="text-end"><Button variant="warning" onClick={handleShowCreate}>Crear producto</Button></Col>
                </Row>

                <Row className="mb-4">
                    <Col md={4} className="mb-2"><Card className="p-3"><div>Órdenes</div><h5 className="mt-2">{orders.length}</h5></Card></Col>
                    <Col md={4} className="mb-2"><Card className="p-3"><div>Productos</div><h5 className="mt-2">{products.length}</h5></Card></Col>
                    <Col md={4} className="mb-2"><Card className="p-3"><div>Ingresos totales</div><h5 className="mt-2">${totalRevenue.toFixed(2)}</h5></Card></Col>
                </Row>

                {/* Tabla completa de productos para administración */}
                <h5>Productos</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr><th>ID</th><th>Nombre</th><th>Categoria</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.product_id || p.id || p.pk}>
                                <td>{p.product_id || p.id || p.pk}</td>
                                <td style={{ maxWidth: 420 }}>{p.name}</td>
                                <td>{p.category}</td>
                                <td>${p.price}</td>
                                <td>{p.stock ?? '-'}</td>
                                <td>
                                    <Button size="sm" variant="secondary" onClick={() => handleEdit(p)}>Editar</Button>{' '}
                                    <Button size="sm" variant="danger" onClick={() => handleDelete(p)}>Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* --- INICIO CAMBIOS EN TABLA DE ÓRDENES --- */}
                <h5 className="mt-4">Órdenes recientes</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
                    </thead>
                    <tbody>
                                {orders.slice(0, 20).map(o => (
                                    <tr key={o.order_id || o.id || o.pk} onClick={() => handleOrderClick(o)} style={{ cursor: 'pointer' }}>
                                        <td>{o.order_id || o.id || o.pk}</td>
                                        <td>{o.customer?.username || `${o.customer?.first_name || ''} ${o.customer?.last_name || ''}` || 'Invitado'}</td>
                                        <td>${o.total}</td>
                                        <td>{o.status}</td>
                                        <td>{o.date || o.created_at || 'N/A'}</td>
                                    </tr>
                                ))}
                    </tbody>
                </Table>
                {/* --- FIN CAMBIOS EN TABLA DE ÓRDENES --- */}

            </Container>

            {selectedOrder && (
                <Modal show={true} onHide={() => setSelectedOrder(null)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Detalle de la Orden #{selectedOrder.order_id || selectedOrder.id || selectedOrder.pk}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <h5>Datos del Cliente</h5>
                                <p><strong>Nombre:</strong> {selectedOrder.customer ? `${selectedOrder.customer.first_name || ''} ${selectedOrder.customer.last_name || ''}` : 'N/A'}</p>
                                <p><strong>Username:</strong> {selectedOrder.customer?.username || 'N/A'}</p>
                                <p><strong>Email:</strong> {selectedOrder.customer?.email || 'N/A'}</p>
                            </Col>
                            <Col md={6}>
                                <h5>Datos del Pago</h5>
                                <p><strong>Total:</strong> ${parseFloat(selectedOrder.total || 0).toFixed(2)}</p>
                                <p><strong>Estado:</strong> {selectedOrder.status}</p>
                                <p><strong>Método:</strong> {selectedOrder.card_marca ? `${selectedOrder.card_marca} (crédito)` : (selectedOrder.payment_method || 'No especificado')}</p>
                                <p><strong>Cuotas:</strong> {selectedOrder.installments || 'N/A'}</p>
                            </Col>
                        </Row>
                        
                        <h5 className="mt-3">Productos Comprados</h5>
                        <Table striped bordered>
                            <thead>
                                <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items?.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {item.product?.image && (
                                                <img src={item.product.image} alt={item.product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                                            )}
                                            {item.product?.name || item.product}
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>${parseFloat(item.unit_price || item.price || 0).toFixed(2)}</td>
                                        <td>${parseFloat(item.subtotal || (item.quantity * (item.unit_price || item.price || 0)) ).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                </Modal>
            )}

            <Modal show={showForm} onHide={() => setShowForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? 'Editar producto' : 'Crear producto'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-2"><Form.Label>Nombre</Form.Label><Form.Control required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Descripción</Form.Label><Form.Control required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Form.Group>
                        <Row>
                            <Col><Form.Group className="mb-2"><Form.Label>Precio</Form.Label><Form.Control type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></Form.Group></Col>
                            <Col><Form.Group className="mb-2"><Form.Label>Stock</Form.Label><Form.Control type="number" step="1" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></Form.Group></Col>
                            <Col><Form.Group className="mb-2"><Form.Label>Categoria</Form.Label><Form.Control value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></Form.Group></Col>
                        </Row>
                        <Form.Group className="mb-2"><Form.Label>Imagen (URL)</Form.Label><Form.Control value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></Form.Group>
                        <Form.Group className="mb-2"><Form.Label>Marca</Form.Label><Form.Control required value={form.marca} onChange={e => setForm({ ...form, marca: e.target.value })} /></Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
                        <Button type="submit" variant="primary">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
