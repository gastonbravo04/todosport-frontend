import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { FaShoppingCart, FaSearch, FaBars } from 'react-icons/fa';

// Main color palette for e-commerce style
const primaryColor = "#232f3e";
const secondaryColor = "#ff9900";
const backgroundColor = "#f5f5f5";
const detailColor = "#232f3e";

// Hardcoded product data
const productsData = [
  {
    name: "Camiseta Titular Authentic River Plate 24/25",
    description: "Camiseta oficial Adidas River Plate 2024/2025, tecnología HEAT.RDY.",
    price: "$80.000",
    image: "https://essential.vtexassets.com/arquivos/ids/1515816-1200-auto?v=638821480754000000&width=1200&height=auto&aspect=true"
  },
  {
    name: "Camiseta Titular Argentina 24",
    description: "Camiseta oficial Adidas Selección Argentina 2024, tecnología AEROREADY.",
    price: "$79.999",
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4c8dee7623f4209b76dfd333a68c812_9366/Camiseta_Titular_Argentina_24_Blanco_IP8400_01_laydown.jpg"
  }
];

const Home = () => {
  // State for menu, search, and products
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(productsData);

  // Search filter handler
  const handleSearch = () => {
    const filtered = productsData.filter(
      prod =>
        prod.name.toLowerCase().includes(search.toLowerCase()) ||
        prod.description.toLowerCase().includes(search.toLowerCase())
    );
    setProducts(filtered);
  };

  // Filter only "Camisetas"
  const handleFilterCamisetas = () => {
    setProducts(productsData.filter(prod =>
      prod.name.toLowerCase().includes("camiseta")
    ));
    setShowMenu(false);
  };

  // Show all products
  const handleShowAll = () => {
    setProducts(productsData);
    setShowMenu(false);
  };

  // Show empty for categories not loaded
  const handleFilterEmpty = () => {
    setProducts([]);
    setShowMenu(false);
  };

  // Search input change handler
  const handleInputChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") setProducts(productsData);
  };

  // Search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      style={{
        background: backgroundColor,
        minHeight: '100vh',
        color: detailColor,
        borderRadius: '0',
        border: 'none',
        margin: '0',
        padding: '0'
      }}
    >
      {/* Header */}
      <Container fluid>
        <Row className="align-items-center mb-4 position-relative" style={{ background: primaryColor, borderRadius: "0 0 12px 12px", padding: "10px 0" }}>
          <Col xs="auto" style={{ position: "relative" }}>
            {/* Menu button (tres líneas) */}
            <Button
              variant="light"
              style={{
                color: primaryColor,
                background: "#fff",
                border: `2px solid ${primaryColor}`,
                borderRadius: "10px",
                marginRight: "10px"
              }}
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaBars size={28} />
            </Button>
            {/* Side menu */}
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "45px",
                  left: 0,
                  background: "#fff",
                  border: `2px solid ${primaryColor}`,
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
                  style={{ color: primaryColor, fontWeight: "bold" }}
                  onClick={handleShowAll}
                >
                  Todos los productos
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: primaryColor, fontWeight: "bold" }}
                  onClick={handleFilterCamisetas}
                >
                  Camisetas
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: primaryColor, fontWeight: "bold" }}
                  onClick={handleFilterEmpty}
                >
                  Remeras
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: primaryColor, fontWeight: "bold" }}
                  onClick={handleFilterEmpty}
                >
                  Camisetas retro
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: primaryColor, fontWeight: "bold" }}
                  onClick={handleFilterEmpty}
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
            {/* Login/Register button */}
            <Button
              variant="light"
              style={{
                color: primaryColor,
                fontWeight: "bold",
                fontSize: "1.1rem",
                background: "#fff",
                border: `2px solid ${secondaryColor}`,
                borderRadius: "10px",
                marginRight: "10px"
              }}
            >
              iniciar sesion o <br /> registrarse
            </Button>
            {/* Cart button */}
            <Button
              variant="light"
              style={{
                color: secondaryColor,
                background: "#fff",
                border: `2px solid ${secondaryColor}`,
                borderRadius: "10px"
              }}
            >
              <FaShoppingCart size={28} />
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Search bar */}
      <Container className="my-4 d-flex justify-content-center">
        <InputGroup style={{ maxWidth: '500px', boxShadow: "0 2px 8px #ddd", borderRadius: "8px" }}>
          {/* Search button */}
          <Button
            style={{
              background: secondaryColor,
              border: `2px solid ${secondaryColor}`,
              color: "#fff",
              borderRadius: "8px 0 0 8px"
            }}
            onClick={handleSearch}
          >
            <FaSearch />
          </Button>
          <Form.Control
            placeholder="Buscar productos"
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{
              background: "#fff",
              color: detailColor,
              border: `2px solid ${secondaryColor}`,
              borderLeft: 'none',
              borderRadius: "0 8px 8px 0"
            }}
          />
        </InputGroup>
      </Container>

      {/* Products grid */}
      <Container>
        <Row className="justify-content-center">
          {products.map((product, i) => (
            <Col key={i} xs={12} md={4} className="d-flex justify-content-center mb-4">
              {/* Product card */}
              <Button
                variant="light"
                className="p-0 w-100"
                style={{
                  border: `1.5px solid #e3e3e3`,
                  borderRadius: "12px",
                  maxWidth: "20rem",
                  background: "#fff",
                  boxShadow: "0 2px 12px #e3e3e3",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  height: "410px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start"
                }}
              >
                <Card
                  className="w-100 h-100"
                  style={{
                    background: "transparent",
                    color: detailColor,
                    border: "none",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column"
                  }}
                >
                  {/* Product image */}
                  <div style={{ width: "100%", height: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Card.Img
                      variant="top"
                      src={product.image}
                      alt={product.name}
                      style={{
                        maxHeight: "180px",
                        width: "auto",
                        maxWidth: "100%",
                        objectFit: "contain",
                        borderTopLeftRadius: "12px",
                        borderTopRightRadius: "12px"
                      }}
                    />
                  </div>
                  <Card.Body
                    className="d-flex flex-column justify-content-between align-items-center"
                    style={{ flex: 1, width: "100%", padding: "1rem 0.5rem 0.5rem 0.5rem" }}
                  >
                    {/* Product name */}
                    <Card.Title
                      className="text-center"
                      style={{
                        fontSize: "1.2rem",
                        color: primaryColor,
                        fontWeight: "bold"
                      }}
                    >
                      {product.name}
                    </Card.Title>
                    {/* Product description */}
                    <Card.Text
                      className="text-center"
                      style={{
                        fontSize: "1rem",
                        color: "#444"
                      }}
                    >
                      {product.description}
                    </Card.Text>
                    <div style={{ flexGrow: 1 }} />
                    {/* Product price */}
                    <Card.Text
                      className="text-center"
                      style={{
                        fontSize: "1.3rem",
                        color: secondaryColor,
                        fontWeight: "bold",
                        marginTop: "10px"
                      }}
                    >
                      {product.price}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Button>
            </Col>
          ))}
        </Row>
        {products.length === 0 && (
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