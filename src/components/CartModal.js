import React, { useState } from 'react';
import { Modal, Button, ListGroup, Image, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

const sizes = ['S', 'M', 'L', 'XL, XXL'];

const CartModal = ({ show, onHide, cart, onRemoveItem, onClearCart, onEditItem }) => {
  const [editIdx, setEditIdx] = useState(null);
  const [editSize, setEditSize] = useState('');
  const [editQty, setEditQty] = useState(1);
  const navigate = useNavigate();

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
    setEditSize(item.size);
    setEditQty(item.quantity);
  };

  // Save edit
  const handleSave = (item) => {
    onEditItem(item, editSize, editQty);
    setEditIdx(null);
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {groupedItems.length === 0 ? (
          <div className="text-center text-muted">Your cart is empty.</div>
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
                        Size:{" "}
                        <Form.Select
                          value={editSize}
                          onChange={e => setEditSize(e.target.value)}
                          style={{ display: "inline-block", width: 80 }}
                        >
                          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </Form.Select>
                        {" | "}Qty:{" "}
                        <Form.Control
                          type="number"
                          min={1}
                          value={editQty}
                          onChange={e => setEditQty(Number(e.target.value))}
                          style={{ display: "inline-block", width: 60 }}
                        />
                      </div>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2 mt-2"
                        onClick={() => handleSave(item)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="mt-2"
                        onClick={() => setEditIdx(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 14, color: "#555" }}>
                        Size: <b>{item.size}</b> | Qty: <b>{item.quantity}</b>
                      </div>
                      <div style={{ fontSize: 13, color: "#888" }}>
                        Unit price: ${item.price}
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
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onRemoveItem(item.name, item.size)}
                    >
                      Remove
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
              navigate("/checkout");
            }}
          >
            Continuar con el pago
          </button>
          <button className="btn btn-danger" onClick={onClearCart}>
            Clear Cart
          </button>
          <button className="btn btn-secondary" onClick={onHide}>
            Close
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;