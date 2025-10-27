import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap'; // Usamos componentes de react-bootstrap para la grilla

const Checkout = () => {
    // Definimos el costo de envío (ejemplo estático)
    const SHIPPING_COST = 5000;
    const [payment, setPayment] = useState("");
    const [formData, setFormData] = useState({}); // Estado para datos del formulario de envío y pago

    // Simulación de los datos del carrito (asumo que 'total' es el subtotal de los productos)
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const finalTotal = subtotal + (subtotal > 0 ? SHIPPING_COST : 0); // Solo se cobra envío si hay productos

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Componente Condicional para el Formulario de Tarjeta
    const CardForm = () => (
        <form className="mt-3 p-3 border rounded bg-light">
            <h6 className="mb-3">Datos de la Tarjeta</h6>
            <div className="mb-3">
                <label htmlFor="cardName" className="form-label">Nombre en la tarjeta</label>
                <input type="text" className="form-control" id="cardName" placeholder="Ej: JUAN PEREZ" required />
            </div>
            <div className="mb-3">
                <label htmlFor="cardNumber" className="form-label">Número de tarjeta</label>
                <input type="text" className="form-control" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" maxLength="16" required />
            </div>
            <Row>
                <Col xs={6} className="mb-3">
                    <label htmlFor="cardExpiry" className="form-label">Vencimiento</label>
                    <input type="text" className="form-control" id="cardExpiry" placeholder="MM/AA" maxLength="5" required />
                </Col>
                <Col xs={6} className="mb-3">
                    <label htmlFor="cardCVV" className="form-label">CVV</label>
                    <input type="password" className="form-control" id="cardCVV" placeholder="123" maxLength="4" required />
                </Col>
            </Row>
        </form>
    );

    return (
        <div className="container py-5">
            <h2 className="mb-4">Finalizar Compra</h2>
            
            <Row>
                {/* Columna Izquierda: Envío y Pago */}
                <Col lg={8} className="mb-4">
                    
                    {/* SECCIÓN 1: DATOS DE ENVÍO */}
                    <div className="card p-4 mb-4">
                        <h5 className="mb-4">1. Datos de Envío</h5>
                        <form>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <label htmlFor="firstName" className="form-label">Nombre</label>
                                    <input type="text" className="form-control" id="firstName" name="firstName" onChange={handleInputChange} required />
                                </Col>
                                <Col md={6}>
                                    <label htmlFor="lastName" className="form-label">Apellido</label>
                                    <input type="text" className="form-control" id="lastName" name="lastName" onChange={handleInputChange} required />
                                </Col>
                            </Row>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Dirección (Calle y número)</label>
                                <input type="text" className="form-control" id="address" name="address" placeholder="Ej: Av. Principal 123" onChange={handleInputChange} required />
                            </div>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <label htmlFor="city" className="form-label">Ciudad</label>
                                    <input type="text" className="form-control" id="city" name="city" onChange={handleInputChange} required />
                                </Col>
                                <Col md={6} className="mb-3">
                                    <label htmlFor="zip" className="form-label">Código Postal</label>
                                    <input type="text" className="form-control" id="zip" name="zip" onChange={handleInputChange} required />
                                </Col>
                            </Row>
                        </form>
                    </div>

                    {/* SECCIÓN 2: MÉTODO DE PAGO */}
                    <div className="card p-4 mb-4">
                        <h5 className="mb-3">2. Elegí el Método de Pago</h5>
                        {/* Opciones de pago */}
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="radio" name="pago" id="efectivo" value="Efectivo"
                                checked={payment === "Efectivo"} onChange={e => setPayment(e.target.value)} />
                            <label className="form-check-label" htmlFor="efectivo"><span role="img" aria-label="efectivo">💵</span> Efectivo/Pago al retirar</label>
                        </div>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="radio" name="pago" id="transferencia" value="Transferencia"
                                checked={payment === "Transferencia"} onChange={e => setPayment(e.target.value)} />
                            <label className="form-check-label" htmlFor="transferencia"><span role="img" aria-label="transferencia">🏦</span> Transferencia bancaria (Se confirmará luego)</label>
                        </div>
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="radio" name="pago" id="tarjeta" value="Tarjeta"
                                checked={payment === "Tarjeta"} onChange={e => setPayment(e.target.value)} />
                            <label className="form-check-label" htmlFor="tarjeta"><span role="img" aria-label="tarjeta">💳</span> Tarjeta de crédito/débito</label>
                        </div>
                        
                        {/* Formulario de Tarjeta Condicional */}
                        {payment === "Tarjeta" && <CardForm />}
                    </div>
                </Col>

                {/* Columna Derecha: RESUMEN Y BOTÓN */}
                <Col lg={4}>
                    <div className="card p-4">
                        <h5 className="mb-3">3. Resumen y Total</h5>
                        
                        {/* Lista de productos (mejorada) */}
                        <ul className="list-group list-group-flush mb-3">
                            {cartItems.map((item, idx) => (
                                <li key={idx} className="list-group-item d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        {/* Utilicé la clase utilitaria me-3 para el margen, eliminando el estilo en línea */}
                                        <img src={item.image} alt={item.name} className="me-3" style={{ width: 40, height: 40, objectFit: "contain" }} />
                                        <div className="text-truncate" style={{ maxWidth: 120 }}>{item.name}</div>
                                    </div>
                                    <span className="text-muted" style={{ fontSize: 14 }}>x{item.quantity}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Desglose Financiero */}
                        <ul className="list-group list-group-flush mb-3 small">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Subtotal de productos:
                                <span>${subtotal.toLocaleString()}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Costo de envío:
                                <span className={subtotal === 0 ? "text-muted" : "text-success"}>
                                    {subtotal > 0 ? `$${SHIPPING_COST.toLocaleString()}` : "N/A"}
                                </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center font-weight-bold h5">
                                Total a pagar:
                                <span className="text-primary">${finalTotal.toLocaleString()}</span>
                            </li>
                        </ul>
                        
                        <button
                            className="btn btn-primary btn-lg w-100 mt-2"
                            // Se deshabilita si no hay método de pago O si falta info de envío (ejemplo simple)
                            disabled={!payment || !formData.firstName || !formData.address}
                            onClick={() => alert(`¡Compra confirmada! Total: $${finalTotal.toLocaleString()} con ${payment}.`)}
                        >
                            Confirmar compra
                        </button>
                        
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Checkout;