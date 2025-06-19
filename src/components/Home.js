import React, { useState, createContext, useContext, useEffect } from 'react';
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
    description: "Camiseta oficial Adidas River Plate 2024/2025.",
    price: "$120.000",
    image: "https://essential.vtexassets.com/arquivos/ids/1515816-1200-auto?v=638821480754000000&width=1200&height=auto&aspect=true",
    sizes: ["S", "M", "L", "XL", "XXL"]

  },
  {
    name: "Camiseta Titular Argentina 24",
    description: "Camiseta oficial Adidas Selección Argentina 2024.",
    price: "$100.000",
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4c8dee7623f4209b76dfd333a68c812_9366/Camiseta_Titular_Argentina_24_Blanco_IP8400_01_laydown.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"]

  },
  {
    name: "Camiseta Aniversario 50 Años Selección Argentina",
    description: "Camiseta edición especial Adidas por el 50 aniversario de la Selección Argentina.",
    price: "$90.000",
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/cae76a03cc30414289c3c82a238ad6ed_9366/Camiseta_Aniversario_50_Anos_Seleccion_Argentina_Azul_JF0395_01_laydown.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"]

  },
  {
    name: "Camiseta Retro Argentina Vintage Calidad Premium #10",
    description: "Camiseta retro Argentina, calidad premium, número 10. Diseño vintage ideal para coleccionistas y fanáticos.",
    price: "$95.000",
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_642238-MLA84972378273_052025-F.webp",
    sizes: ["S", "M", "L", "XL", "XXL"]

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
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3d8da5516ef14b4297b562d673589641_9366/Camiseta_Titular_Boca_Juniors_25-26_Azul_JJ4286_01_laydown.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    name: "Camiseta Puma Independiente Titular 24/25 de Hombre",
    description: "Camiseta oficial Puma Independiente 2023/2024, tela dryCELL.",
    price: "$95.000",
    image: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw77b9ad27/products/PU693681-01/PU693681-01-1.JPG",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    name: "Botines Adidas Predator League FG",
    description: "Botines Adidas Predator League para césped natural. Parte superior sintética con textura para mayor control del balón.",
    price: "$120.000",
    image: "https://production.cdn.vaypol.com/variants/anwzc7it4acm4w1wnck315nywcih/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4",
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46]
  },
  {
    name: "Botines Nike Mercurial Vapor 16 Elite",
    description: "Botines Fútbol Nike Mercurial Vapor 16 Elite FG Hombre.",
    price: "$135.000",
    image: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw4350bb95/products/NIFQ1457-800/NIFQ1457-800-1.JPG",
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46]
  },
  {
    name: "Botines Puma Future 7 Pro FG/AG",
    description: "Botines Puma Future 7 Pro para césped natural y sintético. Ajuste adaptable y excelente tracción.",
    price: "$110.000",
    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/107715/01/sv01/fnd/ARG/w/1000/h/1000/fmt/png/Botines-FUTURE-7-Pro-FG/AG",
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46]
  },

  // Camisetas nuevas 25/26
  {
    name: "Camiseta Titular Real Madrid 24/25",
    description: "Camiseta oficial Adidas Real Madrid temporada 2024/2025.",
    price: "$95.000",
    image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRogaCIKvwRzYHX6Hlj3S7I7miNLTwM6c3OMmZBwGaA3aEH1aSwk8gL-q7g2c2D_9xtdFBA-N2OEWbYxfOmLRDBiuQaPb1_-zppyKNhBhsL67eoggu3eIFrj0GM-pUx1VqFgokuHKClpk8&usqp=CAc",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    name: "Camiseta adidas Suplente River Plate 25/26",
    description: "Camiseta oficial Adidas Suplente River Plate 2025/2026",
    price: "$92.000",
    image: "https://sportline.vtexassets.com/arquivos/ids/1605448-1200-auto?v=638853912797670000&width=1200&height=auto&aspect=true",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
   {
    name: "Camiseta adidas Titular River Plate 25/26",
    description: "Camiseta adidas Titular River Plate 25/26 - BLANCO / ROJO",
    price: "$119.999",
    image: "https://production.cdn.vaypol.com/variants/gs29wghpjb9j3lz4apn7aedt2025/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4",
    sizes: ["S", "M", "L", "XL", "XXL"]
  },

  // Camisetas retro de equipos
  {
    name: "Camiseta Retro Boca Juniors 1981",
    description: "Camiseta retro Boca Juniors 1981, homenaje a la era de Maradona.",
    price: "$80.000",
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_709650-MLA76757391603_052024-F.webp",
    sizes: ["S", "M", "L", "XL, XXL"]
  },
  {
    name: "Camiseta Retro AC Milan 1994",
    description: "Camiseta retro AC Milan 1994, campeón de Europa.",
    price: "$82.000",
    image: "https://http2.mlstatic.com/D_970411-MLA84005601119_042025-C.jpg",
    sizes: ["S", "M", "L", "XL, XXL"]
  },

  // Camisetas de países
  {
    name: "Camiseta Titular Brasil 2024",
    description: "Camiseta oficial Nike Brasil 2024, tecnología Dri-FIT.",
    price: "$88.000",
    image: "https://www.ole.com.ar/images/2023/12/28/sHplKNs1ai_720x0__1.jpg",
    sizes: ["S", "M", "L", "XL, XXL"]
  },
  {
    name: "Camiseta Retro Francia 1998",
    description: "Camiseta retro Francia 1998, campeón del mundo.",
    price: "$85.000",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuxtahL8ESkvUkT6__9hS3FQg3xLaoC-_DBA&s",
    sizes: ["S", "M", "L", "XL, XXL"]
  },

  // Pelotas de fútbol de torneos importantes
  {
    name: "Pelota adidas Fifa Club World Cup Pro 2025",
    description: "Esta Pelota adidas Fifa Club World Cup Pro 2025 rinde homenaje al anfitrión de la competencia con un diseño inspirado en las banderas ondeantes y envuelto en las barras y estrellas.",
    price: "$65.000",
    image: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dwae33f67e/products/ADJE8770/ADJE8770-1.JPG",
    sizes: ["5"]
  },
  {
    name: "Pelota adidas Ucl Training - VERDE / BLANCO",
    description: "Pelota oficial Adidas UEFA Champions League 2023/2024, máxima calidad y rendimiento.",
    price: "$70.000",
    image: "https://production.cdn.vaypol.com/variants/3zn4ommy34tdjj7s0qnjts2n9xqw/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4",
    sizes: ["5"]
  },
  {
    name: "Premier League Academy",
    description: "Pelota oficial Nike Flight Premier League 2024, tecnología Aerowsculpt para vuelo preciso.",
    price: "$72.000",
    image: "https://nikearprod.vtexassets.com/arquivos/ids/1066925-1200-1200?width=1200&height=1200&aspect=true",
    sizes: ["5"]
  },
  {
    name: "Pelota Nike Ordem Copa América 2024",
    description: "Pelota oficial Nike Ordem Copa América 2024, diseño exclusivo para el torneo.",
    price: "$68.000",
    image: "https://acdn-us.mitiendanube.com/stores/003/924/927/products/pelota-copa-americaa-ac8eefef652195eb1c17171891252189-480-0.jpg",
    sizes: ["5"]
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
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [products, setProducts] = useState(productsData);
  const [showMenu, setShowMenu] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavs, setShowFavs] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const sortedProducts = [...productsData].sort((a, b) => a.name.localeCompare(b.name));

  // Función para filtrar productos según la búsqueda
  const filteredProducts = sortedProducts.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

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
    const value = e.target.value;
    setSearchInput(value);
    if (value === "") {
      setProducts(productsData);
      setShowDropdown(false);
    } else {
      const filtered = productsData.filter(
        prod =>
          prod.name.toLowerCase().includes(value.toLowerCase()) ||
          prod.description.toLowerCase().includes(value.toLowerCase())
      );
      setProducts(filtered);
      setShowDropdown(true);
    }
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
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: primaryColor, fontWeight: "bold" }}
                  onClick={() => {
                    setProducts(productsData.filter(prod =>
                      prod.name.toLowerCase().includes("botines")
                    ));
                    setShowMenu(false);
                  }}
                >
                  Botines
                </Button>
                <Button
                  variant="link"
                  className="w-100 text-start"
                  style={{ color: primaryColor, fontWeight: "bold" }}
                  onClick={() => {
                    setProducts(productsData.filter(prod =>
                      prod.name.toLowerCase().includes("pelota")
                    ));
                    setShowMenu(false);
                  }}
                >
                  Pelotas de fútbol
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
        <div style={{ position: "relative", maxWidth: 500, margin: "0 auto" }}>
          <Form className="d-flex" onSubmit={e => { e.preventDefault(); setSearch(searchInput); }}>
            <Form.Control
              type="search"
              placeholder="Buscar productos"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{ width: 250, marginRight: 8 }}
            />
            <Button
              variant="warning"
              onClick={() => setSearch(searchInput)}
            >
              <FaSearch />
            </Button>
          </Form>
        </div>
      </Container>

      {/* Products grid */}
      <Container>
        <Row className="justify-content-center">
          {filteredProducts.map((product, i) => (
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