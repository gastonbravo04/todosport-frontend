import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Talles por tipo de producto (fallback cuando el producto no trae sizes)
const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45'];
const UNIQUE_SIZE = ['Único'];

// Obtiene talles disponibles a partir del propio producto o, si faltan,
// infiere por categoría/nombre (camisetas/botines/pelotas)
const getAvailableSizes = (product) => {
    if (!product) return UNIQUE_SIZE;
    // Si trae talles reales (no solo ['Único']), se respetan
    if (Array.isArray(product.sizes) && product.sizes.length > 0 && !(product.sizes.length === 1 && product.sizes[0] === 'Único')) {
        return product.sizes;
    }
    const base = `${product.category || ''} ${product.name || ''}`.toLowerCase();
    if (base.includes('botin')) return SHOE_SIZES;
    if (base.includes('camiseta') || base.includes('remera') || base.includes('jersey')) return SHIRT_SIZES;
    if (base.includes('pelota')) {
        // Algunas pelotas pueden tener talles 3/4/5; si no vinieron, dejamos único
        return product.sizes && product.sizes.length ? product.sizes : UNIQUE_SIZE;
    }
    return UNIQUE_SIZE;
};

const ProductModal = ({ show, onHide, product, onAddToCart }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    // Cantidad máxima: todo el stock (si viene); si no viene, dejamos 15 como fallback
    const STOCK_VALUE = Number.isFinite(product?.stock) ? product.stock : undefined;
    const MAX_QUANTITY = Math.max(0, STOCK_VALUE ?? 15);

    // Calcula los talles disponibles (con inferencia por categoría si faltan)
    const availableSizes = getAvailableSizes(product);

    // Limpieza de precio para asegurar que se puede calcular (Elimina $ y puntos)
    const priceString = product?.price || "$0";
    // Nota: La expresión regular es importante para manejar precios como "$120.000"
    const priceNumber = Number(priceString.toString().replace('$', '').replace(/\./g, ''));

    // Estado para talle y cantidad
    const [size, setSize] = useState(availableSizes.length > 0 ? availableSizes[0] : "");
    const [quantity, setQuantity] = useState(MAX_QUANTITY > 0 ? 1 : 0);

    // Cuando cambia el producto, setea el talle por defecto
    useEffect(() => {
        const fresh = getAvailableSizes(product);
        setSize(fresh[0] || "");
        const nextMax = Math.max(0, Number.isFinite(product?.stock) ? product.stock : 15);
        setQuantity(nextMax > 0 ? 1 : 0);
        // eslint-disable-next-line
    }, [product]);

    if (!product) return null;

    // Cálculo del total
    const total = priceNumber * quantity;

    const handleQuantityChange = (e) => {
        let newQty = Number(e.target.value);
        // Lógica para no exceder el máximo si se escribe manualmente
        if (newQty > MAX_QUANTITY) newQty = MAX_QUANTITY;
        // Lógica para no ir por debajo de 1
        if (newQty < 1) newQty = MAX_QUANTITY > 0 ? 1 : 0;
        setQuantity(newQty);
    };

    const handleAdd = () => {
        if (!user) {
            navigate('/login');
            onHide();
            return;
        }
        // Aseguramos que el item agregado conserve el arreglo de talles inferido
        onAddToCart({ ...product, sizes: availableSizes, size, quantity, total, price: priceNumber, stock: product?.stock });
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {/* Alineación del Título: se queda centrado o a la izquierda */}
                    <span style={{ fontWeight: 600 }}>{product.name}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="g-3"> 
                    
                    {/* Columna 1: IMAGEN (Siempre a la izquierda en xs/sm) */}
                    <Col xs={12} md={5} className="d-flex justify-content-center align-items-start"> 
                        <Image 
                            src={product.image} 
                            alt={product.name} 
                            fluid 
                            rounded 
                            // Aseguramos que la imagen no sea más grande que el contenedor.
                            style={{ maxHeight: '250px', objectFit: 'contain' }}
                        />
                    </Col>
                    
                    {/* Columna 2: CONTROLES Y DETALLES */}
                    <Col xs={12} md={7}>
                        {/* Descripción (Alineada a la izquierda) */}
                        <div className="mb-3" style={{ color: "#555" }}>
                            {product.description}
                        </div>
                        
                        {/* Selector de Talle */}
                        {availableSizes.length > 1 && (
                            <Form.Group className="mb-3">
                                <Form.Label><b>Talle</b></Form.Label>
                                <Form.Select value={size} onChange={e => setSize(e.target.value)}>
                                    {availableSizes.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}
                        
                        {/* Control de Cantidad con Límite Máximo */}
                        <Form.Group className="mb-3">
                            <Form.Label><b>Cantidad</b></Form.Label>
                            <Form.Control
                                type="number"
                                min={MAX_QUANTITY > 0 ? 1 : 0}
                                max={MAX_QUANTITY} // <-- LÍMITE APLICADO: stock total
                                value={quantity}
                                onChange={handleQuantityChange} 
                                style={{ width: 100 }}
                            />
                            {/* Mensajes contextuales sin mostrar el stock bruto */}
                            {MAX_QUANTITY > 0 && Number.isFinite(product?.stock) && product.stock <= 5 && (
                                <small className="text-warning ms-2">Últimas unidades</small>
                            )}
                            {MAX_QUANTITY > 0 && quantity >= MAX_QUANTITY && (
                                <small className="text-danger d-block">Máximo {MAX_QUANTITY} unidades.</small>
                            )}
                        </Form.Group>
                        
                        {/* Total */}
                        <div style={{ fontWeight: 600, fontSize: 18, color: "#ff9900" }}>
                            Total: ${total.toLocaleString()}
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="warning" onClick={handleAdd} disabled={(availableSizes.length > 1 && !size) || MAX_QUANTITY === 0}>
                    Agregar al carrito
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductModal;