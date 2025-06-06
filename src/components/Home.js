import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { FaShoppingCart, FaSearch, FaBars } from 'react-icons/fa';

// Colores más realistas y modernos tipo e-commerce
const colorPrimario = "#232f3e"; // Azul oscuro Amazon
const colorSecundario = "#ff9900"; // Naranja Amazon
const colorFondo = "#f5f5f5"; // Gris claro de fondo
const colorDetalle = "#232f3e"; // Texto oscuro

const productosData = [
  {
    nombre: "Camiseta Titular Authentic River Plate 24/25",
    descripcion: "Camiseta oficial Adidas River Plate 2024/2025, tecnología HEAT.RDY.",
    precio: "$80.000",
    imagen: "https://essential.vtexassets.com/arquivos/ids/1515816-1200-auto?v=638821480754000000&width=1200&height=auto&aspect=true" },
  {
    nombre: "Camiseta Titular Argentina 24",
    descripcion: "Camiseta oficial Adidas Selección Argentina 2024, tecnología AEROREADY.",
    precio: "$79.999",
    imagen: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4c8dee7623f4209b76dfd333a68c812_9366/Camiseta_Titular_Argentina_24_Blanco_IP8400_01_laydown.jpg"
  }
];

const Home = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState(productosData);

  // Filtrar por búsqueda
  const handleBuscar = () => {
    const filtro = productosData.filter(
      prod =>
        prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        prod.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );
    setProductos(filtro);
  };

  // Filtrar por categoría "Camisetas"
  const handleFiltrarCamisetas = () => {
    setProductos(productosData.filter(prod =>
      prod.nombre.toLowerCase().includes("camiseta")
    ));
    setShowMenu(false);
  };

  // Mostrar todos los productos
  const handleMostrarTodos = () => {
    setProductos(productosData);
    setShowMenu(false);
  };

  // Filtrar por categorías vacías
  const handleFiltrarVacio = () => {
    setProductos([]);
    setShowMenu(false);
  };

  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
    if (e.target.value === "") setProductos(productosData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBuscar();
  };

  return (
    <div
      style={{
        background: colorFondo,
        minHeight: '100vh',
        color: colorDetalle,
        borderRadius: '0',
        border: 'none',
        margin: '0',
        padding: '0'
      }}
    >
      {/* Header */}
      <Container fluid>
        <Row className="align-items-center mb-4 position-relative" style={{ background: colorPrimario, borderRadius: "0 0 12px 12px", padding: "10px 0" }}>
          <Col xs="auto" style={{ position: "relative" }}>
            {/* Botón menú (tres líneas) */}
            <Button
              variant="light"
              style={{
                color: colorPrimario,
                background: "#fff",
                border: `2px solid ${colorPrimario}`,
                borderRadius: "10px",
                marginRight: "10px"
              }}
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaBars size={28} />
            </Button>
            {/* Menú lateral */}
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  left: 0,
                  background: "#fff",
                  border: `2px solid ${colorPrimario}`,
                  borderRadius: "10px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                  minWidth: "200px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: colorPrimario, fontWeight: "bold" }}
                  onClick={handleMostrarTodos}
                >
                  Todos los productos
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: colorPrimario, fontWeight: "bold" }}
                  onClick={handleFiltrarCamisetas}
                >
                  Camisetas
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: colorPrimario, fontWeight: "bold" }}
                  onClick={handleFiltrarVacio}
                >
                  Remeras
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: colorPrimario, fontWeight: "bold" }}
                  onClick={handleFiltrarVacio}
                >
                  Camisetas retro
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: colorPrimario, fontWeight: "bold" }}
                  onClick={handleFiltrarVacio}
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
                color: "#fff",
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
                color: colorPrimario,
                fontWeight: "bold",
                fontSize: "1.1rem",
                background: "#fff",
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
                color: colorSecundario,
                background: "#fff",
                border: `2px solid ${colorSecundario}`,
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
        <InputGroup style={{ maxWidth: '500px', boxShadow: "0 2px 8px #ddd", borderRadius: "8px" }}>
          {/* Botón lupa */}
          <Button
            style={{
              background: colorSecundario,
              border: `2px solid ${colorSecundario}`,
              color: "#fff",
              borderRadius: "8px 0 0 8px"
            }}
            onClick={handleBuscar}
          >
            <FaSearch />
          </Button>
          <Form.Control
            placeholder="Buscar productos"
            value={busqueda}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{
              background: "#fff",
              color: colorDetalle,
              border: `2px solid ${colorSecundario}`,
              borderLeft: 'none',
              borderRadius: "0 8px 8px 0"
            }}
          />
        </InputGroup>
      </Container>

      {/* Productos */}
      <Container>
        <Row className="justify-content-center">
          {productos.map((producto, i) => (
            <Col key={i} xs={12} md={4} className="d-flex justify-content-center mb-4">
              {/* Botón producto */}
              <Button
                variant="light"
                className="p-0 w-100"
                style={{
                  border: `1.5px solid #e3e3e3`,
                  borderRadius: "12px",
                  maxWidth: "20rem",
                  background: "#fff",
                  boxShadow: "0 2px 12px #e3e3e3",
                  transition: "box-shadow 0.2s, border-color 0.2s"
                }}
              >
                <Card
                  className="w-100"
                  style={{
                    background: "transparent",
                    color: colorDetalle,
                    border: "none",
                    borderRadius: "12px"
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px"
                    }}
                  />
                  <Card.Body
                    className="d-flex flex-column justify-content-between align-items-center"
                    style={{ minHeight: "170px" }}
                  >
                    <Card.Title
                      className="text-center"
                      style={{
                        fontSize: "1.2rem",
                        color: colorPrimario,
                        fontWeight: "bold"
                      }}
                    >
                      {producto.nombre}
                    </Card.Title>
                    <Card.Text
                      className="text-center"
                      style={{
                        fontSize: "1rem",
                        color: "#444"
                      }}
                    >
                      {producto.descripcion}
                    </Card.Text>
                    <Card.Text
                      className="text-center"
                      style={{
                        fontSize: "1.3rem",
                        color: colorSecundario,
                        fontWeight: "bold",
                        marginTop: "10px"
                      }}
                    >
                      {producto.precio}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Button>
            </Col>
          ))}
        </Row>
        {productos.length === 0 && (
          <Row className="justify-content-center">
            <Col xs={12} className="text-center text-muted mt-4" style={{ fontSize: "1.2rem" }}>
              No se encontraron productos.
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Home;