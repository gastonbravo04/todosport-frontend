import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { FaShoppingCart, FaSearch, FaBars } from 'react-icons/fa';

const colorPrimario = "#007bff"; // Azul deportivo
const colorSecundario = "#28a745"; // Verde deportivo
const colorFondo = "#101820"; // Fondo oscuro deportivo
const colorDetalle = "#f5f5f5"; // Blanco deportivo

const Home = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${colorFondo} 80%, #1e293b 100%)`,
        minHeight: '100vh',
        color: colorDetalle,
        borderRadius: '16px',
        border: `3px solid ${colorPrimario}`,
        margin: '10px',
        padding: '10px'
      }}
    >
      {/* Header */}
      <Container fluid>
        <Row className="align-items-center mb-4 position-relative">
          <Col xs="auto" style={{ position: "relative" }}>
            {/* Botón menú (tres líneas) */}
            <Button
              variant="light"
              style={{
                color: colorPrimario,
                background: colorDetalle,
                border: `2px solid ${colorPrimario}`,
                borderRadius: "10px",
                marginRight: "10px"
              }}
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaBars size={28} />
            </Button>
            {/* Menú desplegable personalizado */}
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  left: 0,
                  background: colorDetalle,
                  border: `2px solid ${colorPrimario}`,
                  borderRadius: "10px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                  minWidth: "180px"
                }}
              >
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: colorPrimario, textDecoration: "none", fontWeight: "bold" }}
                >
                  Remeras
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: colorPrimario, textDecoration: "none", fontWeight: "bold" }}
                >
                  Camisetas
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: colorPrimario, textDecoration: "none", fontWeight: "bold" }}
                >
                  Camisetas retro
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: colorPrimario, textDecoration: "none", fontWeight: "bold" }}
                >
                  Conjuntos deportivos
                </Button>
              </div>
            )}
          </Col>
          <Col>
            <h1
              className="mb-0"
              style={{
                fontWeight: "bold",
                fontSize: "2.5rem",
                color: colorPrimario,
                letterSpacing: "2px"
              }}
            >
              todosport
            </h1>
          </Col>
          <Col xs="auto" className="text-end">
            {/* Botón iniciar sesión o registrarse */}
            <Button
              variant="light"
              style={{
                color: colorSecundario,
                fontWeight: "bold",
                fontSize: "1.1rem",
                background: colorDetalle,
                border: `2px solid ${colorSecundario}`,
                borderRadius: "10px",
                marginRight: "10px"
              }}
            >
              iniciar sesion o <br /> registrarse
            </Button>
            {/* Botón carrito */}
            <Button
              variant="light"
              style={{
                color: colorPrimario,
                background: colorDetalle,
                border: `2px solid ${colorPrimario}`,
                borderRadius: "10px"
              }}
            >
              <FaShoppingCart size={28} />
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Search */}
      <Container className="my-4 d-flex justify-content-center">
        <InputGroup style={{ maxWidth: '400px' }}>
          {/* Botón lupa */}
          <Button
            style={{
              background: colorSecundario,
              border: `2px solid ${colorSecundario}`,
              color: "#fff",
              borderRadius: "10px 0 0 10px"
            }}
          >
            <FaSearch />
          </Button>
          <Form.Control
            placeholder="Buscar productos"
            style={{
              background: "#222",
              color: colorDetalle,
              border: `2px solid ${colorPrimario}`,
              borderLeft: 'none',
              borderRadius: "0 10px 10px 0"
            }}
          />
        </InputGroup>
      </Container>

      {/* Productos */}
      <Container>
        <Row className="justify-content-center">
          {[1, 2, 3].map((i) => (
            <Col key={i} xs={12} md={4} className="d-flex justify-content-center mb-4">
              {/* Botón producto */}
              <Button
                variant="light"
                className="p-0 w-100"
                style={{
                  border: `3px solid ${colorSecundario}`,
                  borderRadius: "18px",
                  maxWidth: "18rem",
                  background: "linear-gradient(135deg, #181d27 80%, #233 100%)",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  boxShadow: `0 0 18px 0 ${colorSecundario}44`
                }}
              >
                <Card
                  className="w-100"
                  style={{
                    background: "transparent",
                    color: colorDetalle,
                    border: "none",
                    borderRadius: "15px"
                  }}
                >
                  <Card.Body
                    className="d-flex flex-column justify-content-between align-items-center"
                    style={{ height: "180px" }}
                  >
                    <Card.Title
                      className="text-center"
                      style={{
                        fontSize: "1.5rem",
                        color: colorPrimario,
                        fontWeight: "bold"
                      }}
                    >
                      Producto
                    </Card.Title>
                    <Card.Text
                      className="text-start"
                      style={{
                        fontSize: "1.1rem",
                        color: colorSecundario,
                        fontWeight: "bold"
                      }}
                    >
                      Precio
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Button>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;