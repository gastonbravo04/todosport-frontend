import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';

const ProductModal = ({ show, onHide, product, onAddToCart }) => {
  // Calcula los talles disponibles
  const availableSizes = product?.sizes || [];

  // Estado para talle y cantidad
  const [size, setSize] = useState(availableSizes.length > 0 ? availableSizes[0] : "");
  const [quantity, setQuantity] = useState(1);

  // Cuando cambia el producto, setea el talle por defecto
  useEffect(() => {
    if (availableSizes.length > 0) {
      setSize(availableSizes[0]);
    } else {
      setSize("");
    }
    setQuantity(1);
    // eslint-disable-next-line
  }, [product]);

  if (!product) return null;

  // Calcula el precio numérico
  const priceNumber = Number(product.price.replace('$', '').replace('.', ''));
  const total = priceNumber * quantity;

  const handleAdd = () => {
    onAddToCart({ ...product, size, quantity, total, price: priceNumber });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span style={{ fontWeight: 600 }}>{product.name}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={5} className="d-flex align-items-center">
            <Image src={product.image} alt={product.name} fluid rounded />
          </Col>
          <Col xs={7}>
            <div style={{ marginBottom: 12, color: "#555" }}>{product.description}</div>
            {/* Selector de talle solo si corresponde */}
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
            <Form.Group className="mb-3">
              <Form.Label><b>Cantidad</b></Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                style={{ width: 80 }}
              />
            </Form.Group>
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
        <Button variant="warning" onClick={handleAdd} disabled={availableSizes.length > 1 && !size}>
          Agregar al carrito
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;