import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap'; // Usamos componentes de react-bootstrap para la grilla
import { Modal, Button } from 'react-bootstrap';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    // 🛠️ CORRECCIÓN: Apuntar a la URL de producción de Railway
const API_BASE = 'https://todosport-production.up.railway.app/api';  
  // Definimos el costo de envío (ejemplo estático) y el umbral para envío gratis
    const SHIPPING_COST = 10000;
    const FREE_SHIPPING_THRESHOLD = 149999; // Gratis a partir de este subtotal
    const [payment, setPayment] = useState("");
    const [cardType, setCardType] = useState('debit'); // 'debit' | 'credit'
    const [cardMarca, setCardMarca] = useState('visa'); // 'visa' | 'mastercard' | 'other'
    const [installments, setInstallments] = useState(1); // número de cuotas (si aplica)
    const [formData, setFormData] = useState({}); // Estado para datos del formulario de envío y pago

    // Simulación de los datos del carrito (asumo que 'total' es el subtotal de los productos)
    // Usamos la misma convención que en Home: almacenar carritos por usuario con la clave
    // `cart_<username>`; para invitados usamos `cart_guest`.
    const { authFetch, token, user, logout } = useAuth();
    const cartKey = (user && user.username) ? `cart_${user.username}` : 'cart_guest';
    const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    // Calcular cargo de envío según umbral
    const shippingCharge = subtotal === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST);
    const finalTotal = subtotal + shippingCharge; // Total incluyendo envío si aplica
    const [showInvoice, setShowInvoice] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const invoiceRef = useRef(null);
    const expiryRef = useRef(null);
    const navigate = useNavigate();
    const [expiryError, setExpiryError] = useState(null);
    const [cardNumberError, setCardNumberError] = useState(null);
    const { refreshProducts, allProducts } = useProducts();
    

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Si un admin (is_staff) intenta acceder al checkout, lo deslogueamos y redirigimos
    // a la pantalla de login — mismo comportamiento que en `Home`.
    React.useEffect(() => {
        if (user && user.is_staff) {
            try {
                logout();
            } catch (e) {
                // ignore
            }
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user && user.username]);

    // Maneja y formatea el input de vencimiento: MM/AA
    const handleExpiryChange = (e) => {
        const input = e.target;
        const raw = input.value || '';
        const prev = formData.cardExpiry || '';

        // Digitos sin formato, max 4 (MMYY)
        const digits = raw.replace(/[^0-9]/g, '').slice(0, 4);

        // Formatear a MM/YY cuando haya al menos 3 dígitos
        const formatted = digits.length >= 3 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits;

        // Calcular nueva posición del cursor para no obligar a hacer click
        const prevHasSlash = prev.includes('/');
        const newHasSlash = formatted.includes('/');
        let cursor = input.selectionStart || formatted.length;

        // Si se insertó la barra y el cursor está después de la posición 2, desplazar 1
        if (!prevHasSlash && newHasSlash) {
            if (cursor > 2) cursor = cursor + 1;
        }
        // Si se eliminó la barra y el cursor estaba después, ajustamos
        if (prevHasSlash && !newHasSlash) {
            if (cursor > 3) cursor = cursor - 1;
        }

        setFormData(prevState => ({ ...prevState, cardExpiry: formatted }));

        // Validación básica de fecha cuando tenemos 4 dígitos
        setExpiryError(null);
        if (digits.length === 4) {
            const mm = Number(digits.slice(0,2));
            const yy = Number(digits.slice(2));
            const now = new Date();
            const currentYear = now.getFullYear() % 100; // dos dígitos
            const currentMonth = now.getMonth() + 1; // 1-12

            if (mm < 1 || mm > 12) {
                setExpiryError('Mes inválido. Debe estar entre 01 y 12.');
            } else if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
                setExpiryError('Tarjeta vencida. Seleccioná una fecha válida.');
            } else {
                setExpiryError(null);
            }
        }

        // Establecer la posición del cursor después del render
        setTimeout(() => {
            try {
                input.setSelectionRange(cursor, cursor);
            } catch (err) {
                // ignore
            }
        }, 0);
    };

    // Formatea número como moneda ARS con 2 decimales
    const formatCurrency = (value) => {
        try {
            return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(value);
        } catch (e) {
            return `$ ${Number(value).toFixed(2)}`;
        }
    };

    // Validación Luhn para número de tarjeta
    const luhnCheck = (digits) => {
        if (!digits) return false;
        let sum = 0;
        let shouldDouble = false;
        for (let i = digits.length - 1; i >= 0; i--) {
            let d = parseInt(digits.charAt(i), 10);
            if (shouldDouble) {
                d = d * 2;
                if (d > 9) d -= 9;
            }
            sum += d;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
    };

    // Detecta marca básica por BIN
    const detectmarca = (digits) => {
        if (/^4/.test(digits)) return 'visa';
        if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
        return 'other';
    };

    // Maneja y formatea número de tarjeta (typing o paste) con preservación de cursor
    const handleCardNumberChange = (e) => {
        const input = e.target;
        const prev = formData.cardNumberDisplay || '';
        const raw = input.value || '';
    const digits = raw.replace(/\D/g, '').slice(0, 19);
        const groups = digits.match(/.{1,4}/g);
        const display = groups ? groups.join(' ') : '';

        // Calcular posición de caret considerando espacios automáticos
        let cursor = input.selectionStart || display.length;
    const plainBefore = (prev.slice(0, cursor).replace(/\s/g, '')).length;
        // Reposicionar según la cantidad de dígitos antes del cursor
        let newCursor = plainBefore;
        // Insertar espacios cada 4
        newCursor += Math.floor((newCursor) / 4);
        if (newCursor > display.length) newCursor = display.length;

        setFormData(prevState => ({ ...prevState, cardNumber: digits, cardNumberDisplay: display }));
        const marca = detectmarca(digits);
        setCardMarca(marca);

        if (digits.length >= 13) {
            const valid = luhnCheck(digits);
            setCardNumberError(valid ? null : 'Número de tarjeta inválido');
        } else {
            setCardNumberError(null);
        }

        setTimeout(() => {
            try { input.setSelectionRange(newCursor, newCursor); } catch {}
        }, 0);

        // Autofocus al vencimiento cuando completan la longitud típica
        try {
            const done = (marca === 'visa' || marca === 'mastercard') ? digits.length === 16 : digits.length === 19;
            if (done && expiryRef.current) expiryRef.current.focus();
        } catch {}
    };

    const handleCardNumberPaste = (e) => {
        const text = (e.clipboardData || window.clipboardData).getData('text');
        const digits = String(text).replace(/\D/g, '').slice(0, 19);
        const groups = digits.match(/.{1,4}/g);
        const display = groups ? groups.join(' ') : '';
        e.preventDefault();
        setFormData(prev => ({ ...prev, cardNumber: digits, cardNumberDisplay: display }));
        setCardMarca(detectmarca(digits));
        setCardNumberError(digits.length >= 13 && !luhnCheck(digits) ? 'Número de tarjeta inválido' : null);
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
                <input
                    type="text"
                    className={`form-control ${cardNumberError ? 'is-invalid' : ''}`}
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="XXXX XXXX XXXX XXXX"
                    maxLength={23}
                    value={formData.cardNumberDisplay || ''}
                    onChange={handleCardNumberChange}
                    onPaste={handleCardNumberPaste}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    required
                />
                {cardNumberError && <div className="invalid-feedback">{cardNumberError}</div>}
            </div>
            <Row>
                <Col xs={6} className="mb-3">
                    <label htmlFor="cardExpiry" className="form-label">Vencimiento</label>
                    <input
                        type="text"
                        className={`form-control ${expiryError ? 'is-invalid' : ''}`}
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM/AA"
                        maxLength="5"
                        value={formData.cardExpiry || ''}
                        onChange={handleExpiryChange}
                        onPaste={(ev) => {
                            const t = (ev.clipboardData || window.clipboardData).getData('text');
                            const d = String(t).replace(/\D/g, '').slice(0,4);
                            if (d) {
                                ev.preventDefault();
                                const formatted = d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
                                setFormData(prev => ({ ...prev, cardExpiry: formatted }));
                                setExpiryError(null);
                                setTimeout(() => {
                                    try { ev.target.setSelectionRange(formatted.length, formatted.length); } catch {}
                                }, 0);
                            }
                        }}
                        onKeyDown={(ev) => {
                            // Facilita borrar la barra con backspace
                            if (ev.key === 'Backspace') {
                                const v = formData.cardExpiry || '';
                                const pos = ev.target.selectionStart || 0;
                                if (pos === 3 && v.includes('/')) {
                                    ev.preventDefault();
                                    const merged = (v.slice(0,1) + v.slice(2)).trim();
                                    ev.target.value = merged;
                                    setFormData(prev => ({ ...prev, cardExpiry: merged }));
                                    setTimeout(() => {
                                        try { ev.target.setSelectionRange(2,2); } catch {}
                                    }, 0);
                                }
                            }
                        }}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        required
                        ref={expiryRef}
                    />
                    {expiryError && <div className="invalid-feedback">{expiryError}</div>}
                </Col>
                <Col xs={6} className="mb-3">
                    <label htmlFor="cardCVV" className="form-label">CVV</label>
                    <input type="password" className="form-control" id="cardCVV" placeholder="123" maxLength="4" required />
                </Col>
            </Row>

            {/* Tipo de tarjeta: Débito o Crédito */}
            <div className="mb-3">
                <label className="form-label">Tipo de tarjeta</label>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="cardType" id="cardDebit" value="debit" checked={cardType === 'debit'} onChange={() => { setCardType('debit'); setInstallments(1); }} />
                    <label className="form-check-label" htmlFor="cardDebit">Débito</label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="cardType" id="cardCredit" value="credit" checked={cardType === 'credit'} onChange={() => setCardType('credit')} />
                    <label className="form-check-label" htmlFor="cardCredit">Crédito</label>
                </div>
            </div>

            {/* Si es crédito, elegir marca y cuotas coherentes con promociones */}
            {cardType === 'credit' ? (
                <>
                    <div className="mb-3">
                        <label className="form-label">Marca de la tarjeta</label>
                        <select className="form-select" value={cardMarca} onChange={(e) => setCardMarca(e.target.value)}>
                            <option value="visa">Visa</option>
                            <option value="mastercard">Mastercard</option>
                            <option value="other">Otra</option>
                        </select>
                        <small className="text-muted">Al seleccionar Visa/Mastercard se habilita la opción de 6 cuotas fijas.</small>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Cuotas</label>
                        <select className="form-select" value={installments} onChange={(e) => setInstallments(Number(e.target.value))}>
                            {/* Siempre permitir 1 cuota */}
                            <option value={1}>1 cuota</option>
                            {/* Promoción: 3 cuotas sin interés (bancos seleccionados) */}
                            <option value={3}>3 cuotas sin interés</option>
                            {/* 6 cuotas: puede ser sin interés o fijas según marca */}
                            <option value={6}>{cardMarca === 'visa' || cardMarca === 'mastercard' ? '6 cuotas fijas' : '6 cuotas (sin interés con bancos seleccionados)'}</option>
                            {/* Oferta extendida: 12 como opción genérica */}
                            <option value={12}>12 cuotas</option>
                        </select>
                        <small className="text-muted d-block mt-1">3 y 6 cuotas pueden aplicarse sin interés con bancos seleccionados. 6 cuotas fijas aplican para Visa/Mastercard según promociones.</small>
                    </div>
                </>
            ) : (
                <div className="mb-3 text-muted">Pago en débito: no aplica cuotas</div>
            )}
        </form>
    );

        const handleConfirm = async () => {
                if (subtotal === 0) {
                        alert('No hay productos en el carrito. No se puede finalizar la compra.');
                        return;
                }
                // 1) Crear la orden en el backend
                // Asegurarnos de enviar `product_id` que el backend espera.
                const parsePrice = (v) => {
                    if (v == null) return 0;
                    if (typeof v === 'number') return v;
                    try {
                        // Colocar el guion sin escape dentro de la clase es válido
                        return Number(String(v).replace(/[^0-9.-]/g, '').replace(/\./g, ''));
                    } catch { return 0; }
                };

                const payload = {
                    total: Number(finalTotal.toFixed(2)),
                    status: 'Paid',
                    shipping: Number(shippingCharge.toFixed(2)),
                    payment_method: payment,
                    card_type: payment === 'Tarjeta' ? cardType : null,
                    card_brand: payment === 'Tarjeta' ? cardMarca : null,
                    installments: payment === 'Tarjeta' ? installments : 1,
                    // datos mínimos para crear/relacionar un Customer invitado si no hay auth
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    address: formData.address,
                    city: formData.city,
                    zip: formData.zip,
                    phone: formData.phone || '',
                    email: formData.email || '',
                    username: formData.username || formData.email || `guest_${Date.now()}`,
                    items: cartItems.map(it => {
                        // Intentar obtener product_id directamente o buscando por nombre en allProducts
                        let product_id = it.product_id || it.product?.product_id || null;
                        if (!product_id && Array.isArray(allProducts)) {
                            const found = allProducts.find(p => p.name === it.name || p.product_id === it.product_id);
                            product_id = found?.product_id || null;
                        }
                        return {
                            product_id,
                            quantity: it.quantity || 1,
                            unit_price: parsePrice(it.price || it.unit_price || it.total || 0)
                        };
                    })
                };

                let created = null;
                try {
                    // Use authFetch when token is present so orders tie to authenticated user
                    const fetchFn = token ? authFetch : fetch;
                    const res = await fetchFn(`${API_BASE}/orders/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const data = await res.json().catch(() => null);
                    if (!res.ok) {
                        // Mostrar detalle provisto por backend si existe
                        const msg = (data && (data.detail || data.error || data.stock || data.items)) || 'No se pudo registrar la compra.';
                        alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
                        return; // no generamos factura local si el backend rechazó
                    } else {
                        created = data; // { order_id, customer, total, status, date }
                        // Refrescamos productos para reflejar la baja de stock
                        try { await refreshProducts(); } catch {}
                    }
                } catch (e) {
                    console.error('Fallo de red creando la orden', e);
                    alert('Fallo de red al intentar crear la orden. Revisá la consola del navegador.');
                    return;
                }

                // 2) Preparar objeto de orden para la factura (mezcla datos de backend si existen)
                const order = {
                    id: created?.order_id || Date.now(),
                    date: created?.date ? new Date(created.date).toLocaleString() : new Date().toLocaleString(),
                    items: cartItems,
                    subtotal,
                    shipping: shippingCharge,
                    total: finalTotal,
                    customer: formData,
                    payment_method: payment,
                    card_type: payment === 'Tarjeta' ? cardType : null,
                    card_brand: payment === 'Tarjeta' ? cardMarca : null,
                    installments: payment === 'Tarjeta' ? installments : 1,
                };

                setLastOrder(order);
                setShowInvoice(true);
                // no limpiamos el carrito hasta que el usuario confirme en la factura
        };

        const handleDownloadPdf = async () => {
                if (!lastOrder) return;
                // Generar PDF desde el contenido del modal usando html2canvas + jsPDF (import dinámico)
                const element = invoiceRef.current;
                if (!element) return;
                try {
                    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
                        import('html2canvas'),
                        import('jspdf')
                    ]);
                    const scale = 2;
                    const canvas = await html2canvas(element, { scale, useCORS: true });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const imgProps = { width: canvas.width, height: canvas.height };
                    const pdfWidth = pageWidth - 40; // margen 20
                    const ratio = imgProps.width / pdfWidth;
                    const pdfHeight = imgProps.height / ratio;
                    pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
                    pdf.save(`factura_${lastOrder.id}.pdf`);
                } catch (err) {
                    console.error('Error generando PDF o importando librerías', err);
                    alert('No está instalada la dependencia html2canvas/jsPDF o ocurrió un error. Ejecutá: npm install html2canvas jspdf y reiniciá el frontend.');
                }
        };

        const handleFinalizeFromInvoice = () => {
            // Simular confirmación final: vaciar carrito y mostrar mensaje de agradecimiento
            // Eliminar el carrito correspondiente al usuario actual (o guest)
            try { localStorage.removeItem(cartKey); } catch (e) { /* ignore */ }
            setShowInvoice(false);
            // Guardamos el lastOrder por si queremos mostrar número en el agradecimiento
            setShowThankYou(true);
        };

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
                                <span className={subtotal === 0 ? "text-muted" : (shippingCharge === 0 ? 'text-success' : 'text-danger')}>
                                    {subtotal === 0 ? 'N/A' : (shippingCharge === 0 ? 'Gratis' : `$${SHIPPING_COST.toLocaleString()}`)}
                                </span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center font-weight-bold h5">
                                Total a pagar:
                                <span className="text-primary">${finalTotal.toLocaleString()}</span>
                            </li>
                        </ul>
                        {/* Mostrar método de pago y cuotas seleccionadas en el resumen (si corresponde) */}
                        {payment && (
                            <div className="mt-3 p-2 border rounded bg-light small">
                                <div><strong>Método de pago:</strong> {payment}{payment === 'Tarjeta' ? ' (Tarjeta)' : ''}</div>
                                {payment === 'Tarjeta' && (
                                    <div style={{ marginTop: 6 }}>
                                        <div>
                                            {cardType === 'credit' ? (
                                                <span>
                                                    Crédito - {installments} {installments === 1 ? 'cuota' : 'cuotas'} {cardMarca ? `(${cardMarca.toUpperCase()})` : ''}
                                                </span>
                                            ) : (
                                                <span>Débito</span>
                                            )}
                                        </div>
                                        {payment === 'Tarjeta' && installments > 1 && (
                                            <div style={{ marginTop: 6, fontSize: 14 }}>
                                                <strong>Cuota:</strong> {formatCurrency(finalTotal / installments)} c/u
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <button
                            className="btn btn-primary btn-lg w-100 mt-2"
                            // Se deshabilita si no hay método de pago O si falta info de envío (ejemplo simple)
                            disabled={!payment || !formData.firstName || !formData.address || subtotal === 0}
                            onClick={handleConfirm}
                        >
                            Confirmar compra
                        </button>
                        <button
                            type="button"
                            className="btn btn-link w-100 mt-1 text-decoration-none"
                            onClick={() => navigate('/home')}
                        >
                            Volver al inicio
                        </button>
                        
                    </div>
                </Col>
            </Row>

            {/* Modal de factura */}
            <Modal show={showInvoice} onHide={() => setShowInvoice(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Factura de la Compra</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {lastOrder && (
                        <div ref={invoiceRef} style={{ padding: 16, fontFamily: 'Helvetica, Arial, sans-serif', color: '#222' }}>
                            {/* Cabecera empresa */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>Todosport</h3>
                                    <div style={{ fontSize: 12, color: '#666' }}>Av. Ejemplo 123, San Rafael, Mendoza</div>
                                    <div style={{ fontSize: 12, color: '#666' }}>CUIT: 30-12345678-9 | Tel: +54 9 260 1234567</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h4 style={{ margin: 0 }}>FACTURA</h4>
                                    <div style={{ fontSize: 12, color: '#666' }}>Nº <strong>{lastOrder.id}</strong></div>
                                    <div style={{ fontSize: 12, color: '#666' }}>{lastOrder.date}</div>
                                </div>
                            </div>

                            {/* Datos cliente */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div>
                                    <div style={{ fontSize: 14 }}><strong>Cliente:</strong> {lastOrder.customer?.firstName || ''} {lastOrder.customer?.lastName || ''}</div>
                                    <div style={{ fontSize: 12, color: '#666' }}><strong>Dirección:</strong> {lastOrder.customer?.address || ''}</div>
                                    <div style={{ fontSize: 12, color: '#666' }}><strong>Ciudad / CP:</strong> {lastOrder.customer?.city || ''} {lastOrder.customer?.zip || ''}</div>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: 12, color: '#666' }}>
                                    <div>
                                        <strong>Método pago:</strong> {lastOrder.payment_method}
                                        {lastOrder.payment_method === 'Tarjeta' && (
                                            <div style={{ marginTop: 4 }}>
                                                {lastOrder.card_type === 'credit' ? (
                                                    <span>
                                                        Crédito - {lastOrder.installments} {lastOrder.installments === 1 ? 'cuota' : 'cuotas'} {lastOrder.card_brand ? `(${lastOrder.card_brand.toUpperCase()})` : ''}
                                                    </span>
                                                ) : (
                                                    <span>Débito</span>
                                                )}
                                                {lastOrder.installments > 1 && (
                                                    <div style={{ marginTop: 6, fontSize: 12, color: '#333' }}>
                                                        <strong>Cuota:</strong> {formatCurrency(lastOrder.total / lastOrder.installments)} c/u
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tabla de productos con imagen */}
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                                <thead>
                                    <tr style={{ background: '#f7f7f7' }}>
                                        <th style={{ padding: 8, border: '1px solid #e1e1e1' }}>Producto</th>
                                        <th style={{ padding: 8, border: '1px solid #e1e1e1' }}>Imagen</th>
                                        <th style={{ padding: 8, border: '1px solid #e1e1e1' }}>Cantidad</th>
                                        <th style={{ padding: 8, border: '1px solid #e1e1e1' }}>Precio unitario</th>
                                        <th style={{ padding: 8, border: '1px solid #e1e1e1' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lastOrder.items.map((it, idx) => (
                                        <tr key={idx}>
                                            <td style={{ padding: 8, border: '1px solid #eee', verticalAlign: 'middle' }}>{it.name}</td>
                                            <td style={{ padding: 8, border: '1px solid #eee', verticalAlign: 'middle', width: 80 }}>
                                                <img src={it.image || ''} alt={it.name} style={{ width: 60, height: 60, objectFit: 'contain' }} />
                                            </td>
                                            <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'center', verticalAlign: 'middle' }}>{it.quantity}</td>
                                            <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'right', verticalAlign: 'middle' }}>$ {Number(it.price).toLocaleString()}</td>
                                            <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'right', verticalAlign: 'middle' }}>$ { (it.price * it.quantity).toLocaleString() }</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totales e impuestos (ejemplo: IVA 21%) */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                                <div style={{ width: 320 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px' }}><div>Subtotal</div><div>$ {lastOrder.subtotal.toLocaleString()}</div></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px' }}><div>Envío</div><div>$ {lastOrder.shipping.toLocaleString()}</div></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', fontWeight: 700, fontSize: 16, borderTop: '1px solid #eaeaea' }}><div>Total</div><div>$ {lastOrder.total.toLocaleString()}</div></div>
                                </div>
                            </div>

                            {/* Pie de factura */}
                            <div style={{ marginTop: 18, fontSize: 12, color: '#666' }}>
                                <div>Gracias por tu compra. Esta factura es un comprobante de la transacción.</div>
                                <div style={{ marginTop: 6 }}>Todosport - Av. Ejemplo 123 - San Rafael - CUIT: 30-12345678-9</div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInvoice(false)}>Cerrar</Button>
                    <Button variant="info" onClick={handleDownloadPdf}>Descargar PDF</Button>
                    <Button variant="primary" onClick={handleFinalizeFromInvoice}>Confirmar y finalizar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de agradecimiento final */}
            <Modal show={showThankYou} onHide={() => setShowThankYou(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>¡Gracias por tu compra!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Hemos recibido tu orden correctamente.</p>
                    {lastOrder && <p><strong>Número de orden:</strong> {lastOrder.id}</p>}
                    <p>En breve recibirás un email con el comprobante y los detalles de envío.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowThankYou(false)}>Cerrar</Button>
                    <Button variant="primary" onClick={() => { window.location.href = '/home'; }}>Volver al inicio</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Checkout;