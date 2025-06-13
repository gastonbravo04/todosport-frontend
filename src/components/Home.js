import React, { useState, createContext, useContext } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import { FaShoppingCart, FaSearch, FaBars, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductModal from './ProductModal';
import CartModal from './CartModal';

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
    price: "$120.000",
    image: "https://essential.vtexassets.com/arquivos/ids/1515816-1200-auto?v=638821480754000000&width=1200&height=auto&aspect=true"
  },
  {
    name: "Camiseta Titular Argentina 24",
    description: "Camiseta oficial Adidas Selección Argentina 2024, tecnología AEROREADY.",
    price: "$100.000",
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4c8dee7623f4209b76dfd333a68c812_9366/Camiseta_Titular_Argentina_24_Blanco_IP8400_01_laydown.jpg"
  },
  {
    name: "Camiseta Aniversario 50 Años Selección Argentina",
    description: "Camiseta edición especial Adidas por el 50 aniversario de la Selección Argentina.",
    price: "$90.000",
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/cae76a03cc30414289c3c82a238ad6ed_9366/Camiseta_Aniversario_50_Anos_Seleccion_Argentina_Azul_JF0395_01_laydown.jpg"
  },
  {
    name: "Camiseta Retro Argentina Vintage Calidad Premium #10",
    description: "Camiseta retro Argentina, calidad premium, número 10. Diseño vintage ideal para coleccionistas y fanáticos.",
    price: "$95.000",
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_642238-MLA84972378273_052025-F.webp"
  },
  {
    name: "Conjunto Deportivo Nike Hombre",
    description: "Conjunto deportivo Nike para hombre, ideal para entrenamiento y uso diario.",
    price: "$140.000",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVwXnOlaEvFqh4L6GvvCQyGmICAic6t6YTm1oQdcTEogc4g-QitQ0n7NoJHeUv85Wf04A&usqp=CAU"
  },
  {
    name: "Camiseta Titular Boca Juniors 25/26",
    description: "Camiseta oficial Adidas Boca Juniors 2023/2024, tecnología AEROREADY.",
    price: "$110.000",
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3d8da5516ef14b4297b562d673589641_9366/Camiseta_Titular_Boca_Juniors_25-26_Azul_JJ4286_01_laydown.jpg"
  },
  {
    name: "Camiseta Puma Independiente Titular 24/25 de Hombre",
    description: "Camiseta oficial Puma Independiente 2023/2024, tela dryCELL.",
    price: "$95.000",
    image: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw77b9ad27/products/PU693681-01/PU693681-01-1.JPG"
  }
];

// Hardcoded users for demo
const initialUsers = [
  { username: 'mg.bravo', password: '1234' } // <-- Only this user can login
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState(null);

  // Login function
  const login = (username, password) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setUser({ username });
      return true;
    }
    return false;
  };

  // Register function
  const register = (username, password) => {
    if (users.find(u => u.username === username)) {
      return false; // Username already exists
    }
    setUsers([...users, { username, password }]);
    setUser({ username });
    return true;
  };

  // Logout function
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(productsData);
  const [showMenu, setShowMenu] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavs, setShowFavs] = useState(false);

  const handleSearch = () => {
    const filtered = productsData.filter(
      prod =>
        prod.name.toLowerCase().includes(search.toLowerCase()) ||
        prod.description.toLowerCase().includes(search.toLowerCase())
    );
    setProducts(filtered);
  };

  const handleFilterCamisetas = () => {
    setProducts(productsData.filter(prod =>
      prod.name.toLowerCase().includes("camiseta")
    ));
    setShowMenu(false);
  };

  const handleShowAll = () => setProducts(productsData);

  const handleFilterCamisetasRetros = () => {
    setProducts(productsData.filter(prod =>
      prod.name.toLowerCase().includes("retro")
    ));
    setShowMenu(false);
  };

  const handleFilterConjuntosDeportivos = () => {
    setProducts(productsData.filter(prod =>
      prod.name.toLowerCase().includes("conjunto deportivo")
    ));
    setShowMenu(false);
  };

  const handleFilterEmpty = () => {
    setProducts([]);
    setShowMenu(false);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value === "") setProducts(productsData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleCartClick = () => {
    setShowCart(true);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Eliminar un producto (por nombre y talle)
  const handleRemoveItem = (name, size) => {
    setCart(cart.filter(item => !(item.name === name && item.size === size)));
  };

  // Vaciar todo el carrito
  const handleClearCart = () => {
    setCart([]);
  };

  // Editar producto (por nombre y talle)
  const handleEditItem = (item, newSize, newQty) => {
    setCart(prevCart => {
      // Elimina el producto original
      const filtered = prevCart.filter(
        prod => !(prod.name === item.name && prod.size === item.size)
      );
      // Agrega el producto editado
      const priceNumber = Number(item.price);
      return [
        ...filtered,
        {
          ...item,
          size: newSize,
          quantity: newQty,
          total: priceNumber * newQty,
        },
      ];
    });
  };

  // Agregar o quitar favorito
  const toggleFavorite = (product) => {
    setFavorites(prev =>
      prev.some(fav => fav.name === product.name)
        ? prev.filter(fav => fav.name !== product.name)
        : [...prev, product]
    );
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
      {/* Welcome banner */}
      {user && (
        <div style={{
          width: "100%",
          background: "#fffbe6",
          color: primaryColor,
          padding: "12px 0",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.1rem",
          letterSpacing: "1px"
        }}>
          Welcome, {user.username}!
        </div>
      )}

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
                  All products
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
                  onClick={handleFilterCamisetasRetros}
                >
                  Camisetas retro
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: primaryColor, fontWeight: "bold" }}
                  onClick={handleFilterConjuntosDeportivos}
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
            {user ? (
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
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Cerrar sesión
              </Button>
            ) : (
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
                onClick={() => navigate('/login')}
              >
                iniciar sesion o <br /> registrarse
              </Button>
            )}
            {/* Favorites button */}
            <Button
              variant="light"
              style={{
                color: "#ff3366",
                background: "#fff",
                border: `2px solid #ff3366`,
                borderRadius: "10px",
                marginRight: "10px"
              }}
              onClick={() => setShowFavs(true)}
            >
              <FaHeart size={24} />
              {favorites.length > 0 && (
                <span style={{
                  background: "#ff3366",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 8px",
                  fontSize: 12,
                  marginLeft: 4
                }}>{favorites.length}</span>
              )}
            </Button>
            {/* Cart button */}
            <Button
              variant="light"
              style={{
                color: "#ff9900",
                background: "#fff",
                border: `2px solid #ff9900`,
                borderRadius: "10px"
              }}
              onClick={handleCartClick}
            >
              <FaShoppingCart size={28} />
              {cart.length > 0 && (
                <span style={{
                  background: "#ff9900",
                  color: "#fff",
                  borderRadius: "50%",
                  padding: "2px 8px",
                  fontSize: 12,
                  marginLeft: 4
                }}>{cart.length}</span>
              )}
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
                onClick={() => handleProductClick(product)}
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
                    {/* Product price and favorite icon */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "1.3rem", color: "#ff9900", fontWeight: "bold", marginRight: 8 }}>
                        {product.price}
                      </span>
                      <FaHeart
                        size={20}
                        style={{
                          color: favorites.some(fav => fav.name === product.name) ? "#ff3366" : "#bbb",
                          cursor: "pointer",
                          transition: "color 0.2s"
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          toggleFavorite(product);
                        }}
                        title={favorites.some(fav => fav.name === product.name) ? "Quitar de favoritos" : "Agregar a favoritos"}
                      />
                    </div>
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

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductModal
          show={showModal}
          onHide={() => setShowModal(false)}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart modal */}
      <CartModal
        show={showCart}
        onHide={() => setShowCart(false)}
        cart={cart}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onEditItem={handleEditItem}
      />

      {/* Favorites modal */}
      <Modal show={showFavs} onHide={() => setShowFavs(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Favoritos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {favorites.length === 0 ? (
            <div className="text-center text-muted">No tienes productos favoritos.</div>
          ) : (
            favorites.map((fav, idx) => (
              <div key={idx} className="d-flex align-items-center mb-2">
                <img src={fav.image} alt={fav.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, marginRight: 10 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{fav.name}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>{fav.price}</div>
                </div>
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFavs(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;