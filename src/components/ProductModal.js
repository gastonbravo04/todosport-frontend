import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';

const sizes = ['S', 'M', 'L', 'XL'];

const ProductModal = ({ show, onHide, product, onAddToCart }) => {
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

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
            <Form.Group className="mb-3">
              <Form.Label><b>Size</b></Form.Label>
              <Form.Select value={size} onChange={e => setSize(e.target.value)}>
                {sizes.map(s => <option key={s} value={s}>{s}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label><b>Quantity</b></Form.Label>
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
          Cancel
        </Button>
        <Button variant="warning" onClick={handleAdd}>
          Add to cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;