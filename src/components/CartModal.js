import React, { useState } from 'react';
import { Modal, Button, ListGroup, Image, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

// Mapas de talles por tipo de producto
const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45'];
const UNIQUE_SIZE = ['Único'];

const getItemSizes = (item) => {
  // Si el producto trae talles y no es el pseudo "Único", los usamos
  if (Array.isArray(item?.sizes) && item.sizes.length > 0 && !(item.sizes.length === 1 && item.sizes[0] === 'Único')) {
    return item.sizes;
  }
  const base = `${String(item?.category || '')} ${String(item?.name || '')}`.toLowerCase();
  if (base.includes('botin')) return SHOE_SIZES;
  if (base.includes('pelota')) return UNIQUE_SIZE;
  if (base.includes('camiseta') || base.includes('remera') || base.includes('jersey')) return SHIRT_SIZES;
  return UNIQUE_SIZE; // default sin talle
};

// Límite de cantidad igual al stock total (fallback 15 si no hay stock)
const getMaxQty = (item) => {
  const stockNum = Number.isFinite(item?.stock) ? item.stock : 15;
  return Math.max(1, stockNum);
};

const CartModal = ({ show, onHide, cart, onRemoveItem, onEliminarCarrito, onClearCart, onEditItem }) => {
  const [editIdx, setEditIdx] = useState(null);
  const [editSize, setEditSize] = useState('');
  const [editCantidad, setEditCantidad] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Agrupa productos iguales (mismo nombre y talle)
  const grouped = cart.reduce((acc, item, idx) => {
    const key = `${item.name}-${item.size}`;
    if (!acc[key]) {
      acc[key] = { ...item, idxs: [idx] };
    } else {
      acc[key].quantity += item.quantity;
      acc[key].total += item.total;
      acc[key].idxs.push(idx);
    }
    return acc;
  }, {});
  const groupedItems = Object.values(grouped);

  const total = groupedItems.reduce((sum, item) => sum + item.total, 0);

  // Start editing
  const handleEdit = (item, idx) => {
    setEditIdx(idx);
    const available = getItemSizes(item);
    setEditSize(item.size || available[0] || 'Único');
    setEditCantidad(Math.min(item.quantity, getMaxQty(item)));
  };

  // Save edit
  const handleSave = (item) => {
    onEditItem(item, editSize, editCantidad);
    setEditIdx(null);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleClearCartClick = () => {
    const clearFn = onEliminarCarrito || onClearCart;
    if (typeof clearFn === 'function') {
      clearFn();
    }
    if (typeof onHide === 'function') onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header SalirButton>
        <Modal.Title>Su carrito</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {groupedItems.length === 0 ? (
          <div className="text-center text-muted">Su carrito está vacío.</div>
        ) : (
          <ListGroup variant="flush">
            {groupedItems.map((item, idx) => (
              <ListGroup.Item key={idx} className="d-flex align-items-center">
                <Image src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 12 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  {editIdx === idx ? (
                    <>
                      <div style={{ fontSize: 14, color: "#555" }}>
                        {(() => {
                          const available = getItemSizes(item);
                          const unique = available.length <= 1 && (available[0] === 'Único');
                          if (unique) {
                            return (
                              <>
                                Talle: <b>Único</b>
                              </>
                            );
                          }
                          return (
                            <>
                              Talle:{" "}
                              <Form.Select
                                value={editSize}
                                onChange={e => setEditSize(e.target.value)}
                                style={{ display: "inline-block", width: 100 }}
                              >
                                {available.map(s => <option key={s} value={s}>{s}</option>)}
                              </Form.Select>
                            </>
                          );
                        })()}
                        {" | "}Cantidad:{" "}
                        <Form.Control
                          type="number"
                          min={1}
                          max={getMaxQty(item)}
                          value={editCantidad}
                          onChange={e => {
                            const n = Number(e.target.value);
                            if (Number.isNaN(n)) return;
                            const limit = getMaxQty(item);
                            const clamped = Math.max(1, Math.min(limit, n));
                            setEditCantidad(clamped);
                          }}
                          style={{ display: "inline-block", width: 60 }}
                        />
                        {Number.isFinite(item?.stock) && item.stock <= 5 && (
                          <span className="text-warning ms-2">Últimas unidades</span>
                        )}
                      </div>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2 mt-2"
                        onClick={() => handleSave(item)}
                      >
                        Guardar
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="mt-2"
                        onClick={() => setEditIdx(null)}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 14, color: "#555" }}>
                        {(() => {
                          const available = getItemSizes(item);
                          const label = (available.length <= 1 && available[0] === 'Único') ? 'Talle' : 'Talle';
                          return (
                            <>
                              {label}: <b>{item.size || available[0] || 'Único'}</b> | Cantidad: <b>{item.quantity}</b>
                            </>
                          );
                        })()}
                      </div>
                      <div style={{ fontSize: 13, color: "#888" }}>
                        Precio x unidad: ${item.price}
                      </div>
                    </>
                  )}
                </div>
                <div style={{ fontWeight: 600, color: "#ff9900", marginRight: 10 }}>
                  ${item.total.toLocaleString()}
                </div>
                {editIdx !== idx && (
                  <>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(item, idx)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onRemoveItem(item.name, item.size)}
                    >
                      Eliminar
                    </Button>
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div style={{ flex: 1, fontWeight: 600, fontSize: 18 }}>
          Total: ${total.toLocaleString()}
        </div>
          <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            className="btn btn-success"
            onClick={() => {
              // Si tienes una función para cerrar el modal, llámala aquí:
              if (typeof onHide === "function") onHide();
              // Requerir login antes de ir a checkout
              if (!user) {
                navigate('/login');
                return;
              }
              navigate("/checkout");
            }}
          >
            Continuar con el pago
          </button>
          <button className="btn btn-danger" onClick={handleClearCartClick}>
            Eliminar Carrito
          </button>
          <button className="btn btn-secondary" onClick={onHide}>
            Cerrar
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;