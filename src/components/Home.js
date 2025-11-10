import React, { useState, createContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Carousel } from 'react-bootstrap';
import { FaShoppingCart, FaSearch, FaBars, FaHeart } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductModal from './ProductModal';
import CartModal from './CartModal';
import { useProducts } from '../context/ProductContext';

// Paleta de colores principal para el estilo e-commerce
const primaryColor = "#232f3e";
const secondaryColor = "#ff9900";
const backgroundColor = "#f5f5f5";
const detailColor = "#232f3e";

// Imagen por defecto cuando no hay imagen en la API/BD
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=Sin+imagen';
// Datos de productos predefinidos (mock)
const productsData = [
  {
    name: "Camiseta Titular Authentic River Plate 24/25",
    description: "Camiseta oficial Adidas River Plate 2024/2025.",
    price: "$89.999",
    image: "https://essential.vtexassets.com/arquivos/ids/1515816-1200-auto?v=638821480754000000&width=1200&height=auto&aspect=true",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "camiseta",
    brand: "Adidas" 
  },
  {
    name: "Camiseta Titular Argentina 24",
    description: "Camiseta oficial Adidas Selección Argentina 2024.",
    price: "$79.999",
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4c8dee7623f4209b76dfd333a68c812_9366/Camiseta_Titular_Argentina_24_Blanco_IP8400_01_laydown.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "camiseta",
    brand: "Adidas"
  },
  {
    name: "Camiseta Aniversario 50 Años Selección Argentina",
    description: "Camiseta edición especial Adidas por el 50 aniversario de la Selección Argentina.",
    price: "$109.999",
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/cae76a03cc30414289c3c82a238ad6ed_9366/Camiseta_Aniversario_50_Anos_Seleccion_Argentina_Azul_JF0395_01_laydown.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "camiseta",
    brand: "Adidas"
  },
  {
    name: "Camiseta Retro Argentina Vintage Calidad Premium #10",
    description: "Camiseta retro Argentina, calidad premium, número 10. Diseño vintage ideal para coleccionistas y fanáticos.",
    price: "$99.999",
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_642238-MLA84972378273_052025-F.webp",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "retro",
    brand: "Retro"
  },
  {
    name: "Camiseta Titular Boca Juniors 25/26",
    description: "Camiseta oficial Adidas Boca Juniors 2023/2024, tecnología AEROREADY.",
    price: "$109.999",
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3d8da5516ef14b4297b562d673589641_9366/Camiseta_Titular_Boca_Juniors_25-26_Azul_JJ4286_01_laydown.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "camiseta",
    brand: "Adidas"
  },
  {
    name: "Camiseta Puma Independiente Titular 24/25 de Hombre",
    description: "Camiseta oficial Puma Independiente 2023/2024, tela dryCELL.",
    price: "$69.999",
    image: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw77b9ad27/products/PU693681-01/PU693681-01-1.JPG",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "camiseta",
    brand: "Puma"
  },
  {
    name: "Botines Adidas Predator League FG",
    description: "Botines Adidas Predator League para césped natural. Parte superior sintética con textura para mayor control del balón.",
    price: "$199.999",
    image: "https://production.cdn.vaypol.com/variants/anwzc7it4acm4w1wnck315nywcih/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4",
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    category: "botines",
    brand: "Adidas"
  },
  {
    name: "Botines Nike Mercurial Vapor 16 Elite",
    description: "Botines Fútbol Nike Mercurial Vapor 16 Elite FG Hombre.",
    price: "$199.999",
    image: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dw4350bb95/products/NIFQ1457-800/NIFQ1457-800-1.JPG",
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    category: "botines",
    brand: "Nike"
  },
  {
    name: "Botines Puma Future 7 Pro FG/AG",
    description: "Botines Puma Future 7 Pro para césped natural y sintético. Ajuste adaptable y excelente tracción.",
    price: "$149.999",
    image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa/global/107715/01/sv01/fnd/ARG/w/1000/h/1000/fmt/png/Botines-FUTURE-7-Pro-FG/AG",
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    category: "botines",
    brand: "Puma"
  },
{
    name: "Botines Adidas F50 Elite - Terreno Firme (Coral)",
    description: "Botines Adidas F50 Elite para césped natural, diseño ligero y máxima velocidad.",
    price: "$299.999", 
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/1eb82bc423a3494fb622aa9791fdeed3_9366/Botines_F50_Elite_para_terreno_firme_Naranja_JH7618_HM1.jpg", 
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    category: "botines",
    brand: "Adidas"
},
{
    name: "Botines Adidas F50 Elite - Terreno Firme (Lila/Verde)",
    description: "Botines Adidas F50 Elite para césped natural, máxima velocidad, colores vibrantes.",
    price: "$299.999", 
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/91f142e473404e57bc06ace8ab1101c5_9366/Botines_F50_Elite_terreno_firme_Violeta_JH7615_HM1.jpg", 
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    category: "botines",
    brand: "Adidas"
},
{
    name: "Botines Nike Phantom 6 Low Elite (Verde/Negro)",
    description: "Botines de Pasto Natural Unisex FG Nike Phantom para precisión y control élite.",
    price: "$399.999", 
    image: "https://nikearprod.vtexassets.com/arquivos/ids/1548257-1200-1200?width=1200&height=1200&aspect=true", 
    sizes: [38, 39, 40, 41, 42, 43, 44, 45, 46],
    category: "botines",
    brand: "Nike"
},
{
    name: "Botines Nike Phantom 6 Low Elite (Blanco/Rojo)",
    description: "Botines de Pasto Natural Unisex FG Nike Phantom para precisión y control élite.",
    price: "$379.999", 
    image: "https://nikearprod.vtexassets.com/arquivos/ids/1548306-1200-1200?width=1200&height=1200&aspect=true",
    category: "botines",
    brand: "Nike"
},
  // Camisetas nuevas 25/26
  {
    name: "Camiseta Titular Real Madrid 24/25",
    description: "Camiseta oficial Adidas Real Madrid temporada 2024/2025.",
    price: "$109.999",
    image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRogaCIKvwRzYHX6Hlj3S7I7miNLTwM6c3OMmZBwGaA3aEH1aSwk8gL-q7g2c2D_9xtdFBA-N2OEWbYxfOmLRDBiuQaPb1_-zppyKNhBhsL67eoggu3eIFrj0GM-pUx1VqFgokuHKClpk8&usqp=CAc",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "camiseta",
    brand: "Adidas"
  },
  {
    name: "Camiseta adidas Suplente River Plate 25/26",
    description: "Camiseta oficial Adidas Suplente River Plate 2025/2026",
    price: "$89.999",
    image: "https://sportline.vtexassets.com/arquivos/ids/1605448-1200-auto?v=638853912797670000&width=1200&height=auto&aspect=true",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "camiseta",
    brand: "Adidas"
  },
  {
    name: "Camiseta adidas Titular River Plate 25/26",
    description: "Camiseta adidas Titular River Plate 25/26 - BLANCO / ROJO",
    price: "$119.999",
    image: "https://production.cdn.vaypol.com/variants/gs29wghpjb9j3lz4apn7aedt2025/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "camiseta",
    brand: "Adidas"
  },

  // Camisetas retro de equipos
  {
    name: "Camiseta Retro Boca Juniors 1981",
    description: "Camiseta retro Boca Juniors 1981, homenaje a la era de Maradona.",
    price: "$89.999",
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_709650-MLA76757391603_052024-F.webp",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "retro",
    brand: "Retro"
  },
  {
    name: "Camiseta Retro AC Milan 1994",
    description: "Camiseta retro AC Milan 1994, campeón de Europa.",
    price: "$79.999",
    image: "https://http2.mlstatic.com/D_970411-MLA84005601119_042025-C.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "retro",
    brand: "Retro"
  },

  // Camisetas de países
  {
    name: "Camiseta Titular Brasil 2024",
    description: "Camiseta oficial Nike Brasil 2024, tecnología Dri-FIT.",
    price: "$79.999",
    image: "https://www.ole.com.ar/images/2023/12/28/sHplKNs1ai_720x0__1.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "camiseta",
    brand: "Nike"
  },
  {
    name: "Camiseta Retro Francia 1998",
    description: "Camiseta retro Francia 1998, campeón del mundo.",
    price: "$89.999",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuxtahL8ESkvUkT6__9hS3FQg3xLaoC-_DBA&s",
    sizes: ["S", "M", "L", "XL", "XXL"],
    category: "camiseta",
    brand: "Retro"
  },

  // Pelotas de fútbol de torneos importantes
  {
    name: "Pelota adidas Fifa Club World Cup Pro 2025",
    description: "Esta Pelota adidas Fifa Club World Cup Pro 2025 rinde homenaje al anfitrión de la competencia con un diseño inspirado en las banderas ondeantes y envuelto en las barras y estrellas.",
    price: "$19.999",
    image: "https://www.dexter.com.ar/on/demandware.static/-/Sites-365-dabra-catalog/default/dwae33f67e/products/ADJE8770/ADJE8770-1.JPG",
    sizes: ["5"],
    category: "pelota",
    brand: "Adidas"
  },
  {
    name: "Pelota adidas Ucl Training - VERDE / BLANCO",
    description: "Pelota oficial Adidas UEFA Champions League 2023/2024, máxima calidad y rendimiento.",
    price: "$39.999",
    image: "https://production.cdn.vaypol.com/variants/3zn4ommy34tdjj7s0qnjts2n9xqw/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4",
    sizes: ["5"],
    category: "pelota",
    brand: "Adidas"
  },
  {
    name: "Pelota Premier League Academy",
    description: "Pelota oficial Nike Flight Premier League 2024, tecnología Aerowsculpt para vuelo preciso.",
    price: "$29.999",
    image: "https://nikearprod.vtexassets.com/arquivos/ids/1066925-1200-1200?width=1200&height=1200&aspect=true",
    sizes: ["5"],
    category: "pelota",
    brand: "Nike"
  },
  {
    name: "Pelota Nike Ordem Copa América 2024",
    description: "Pelota oficial Nike Ordem Copa América 2024, diseño exclusivo para el torneo.",
    price: "$39.999",
    image: "https://acdn-us.mitiendanube.com/stores/003/924/927/products/pelota-copa-americaa-ac8eefef652195eb1c17171891252189-480-0.jpg",
    sizes: ["5"],
    category: "pelota",
    brand: "Nike"
  },
  {
    name: "Pelota Trionda Competition de la Copa Mundial de la FIFA 2026",
    description: "Pelota oficial Adidas Trionda Competition de la Copa Mundial de la FIFA 2026, diseño de alto rendimiento.",
    price: "$99.999",
    image: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3a5965320eeb418bb674cc98e81c7f6a_9366/Pelota_Trionda_Competition_de_la_Copa_Mundial_de_la_FIFA_2026tm_Blanco_JD8031_01_00_standard.jpg",
    sizes: ["5"],
    category: "pelota",
    brand: "Adidas"
  },
];

// Nota: Ya no fijamos WORLD_CUP_BALL desde productsData.
// Lo derivaremos dinámicamente del estado con datos del backend.


// Usuarios predefinidos para demo
const initialUsers = [
    { username: 'mg.bravo', password: '1234' } // <-- Solo este usuario puede iniciar sesión en el demo
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [users, setUsers] = useState(initialUsers);
    const [user, setUser] = useState(null);

    // Función de login (demo local)
    const login = (username, password) => {
        const found = users.find(u => u.username === username && u.password === password);
        if (found) {
            setUser({ username });
            return true;
        }
        return false;
    };

    // Función de registro (demo local)
    const register = (username, password) => {
        if (users.find(u => u.username === username)) {
            return false; // El nombre de usuario ya existe
        }
        setUsers([...users, { username, password }]);
        setUser({ username });
        return true;
    };

    // Función de logout (demo local)
    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

const Home = () => {
    const { user, logout } = useAuth();
    const { allProducts } = useProducts();
    const navigate = useNavigate();
    const location = useLocation();
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    // allProducts: fuente única (backend si está disponible, sino fallback local)
    // allProducts proviene del ProductContext
    const [products, setProducts] = useState([]);
    // Sincroniza productos mostrados con los productos globales del contexto
    useEffect(() => {
        setProducts(allProducts && allProducts.length ? allProducts : productsData);
    }, [allProducts]);
    const [showMenu, setShowMenu] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [showFavs, setShowFavs] = useState(false);
    // ESTADOS NUEVOS PARA LA BÚSQUEDA TIPO DROPDOWN
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    // Si en el futuro se necesita, se puede implementar 'añadir favorito al carrito'.
    // Cargar el carrito una sola vez al montar (intentar rehidratar por usuario guardado)
    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
            const username = (user && user.username) || (storedUser && storedUser.username) || null;
            const key = username ? `cart_${username}` : 'cart_guest';
            const raw = localStorage.getItem(key);
            if (raw) {
                setCart(JSON.parse(raw));
            }
        } catch (e) {
            // Ignorar fallos de parseo
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cuando el usuario cambia (login/logout), cargamos o vaciamos el carrito según corresponda.
    // Objetivo: cada usuario tiene su propio carrito (`cart_<username>`) y al desloguear
    // el carrito visible se vacía (comportamiento para guest).
    useEffect(() => {
        try {
            const username = user && user.username;
            if (username) {
                // Cargar carrito del usuario autenticado (reemplaza el carrito actual)
                const key = `cart_${username}`;
                const raw = localStorage.getItem(key);
                if (raw) setCart(JSON.parse(raw)); else setCart([]);
            } else {
                // Usuario se deslogueó o está como guest -> vaciar carrito en UI
                setCart([]);
                // Opcional: eliminar el carrito guest almacenado para evitar confusiones
                try { localStorage.removeItem('cart_guest'); } catch (e) { /* ignore */ }
            }
        } catch (e) {
            // Ignorar errores de parseo/storage
        }
    }, [user]);

    // Guardar el carrito en localStorage usando una clave por usuario cuando cambie
    useEffect(() => {
        try {
            const username = user && user.username;
            const key = username ? `cart_${username}` : 'cart_guest';
            localStorage.setItem(key, JSON.stringify(cart));
        } catch (e) {
            // Ignorar errores de storage
        }
    }, [cart, user]);

    // Sincronizar apertura del modal del carrito con la ruta /carrito
    useEffect(() => {
        setShowCart(location.pathname === '/carrito');
    }, [location.pathname]);

    // Si el usuario autenticado es staff/administrador, no permitimos
    // que navegue por la Home pública (según requerimiento).
    // Comportamiento: cerramos su sesión y lo redirigimos a /login.
    useEffect(() => {
        if (user && user.is_staff) {
            // Desloguear al admin y forzar pantalla de login
            try {
                logout();
            } catch (e) {
                // si logout no es una función o falla, ignoramos y redirigimos
                // Ignorar error en logout
            }
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    /* ----------------------------------------------------------------------
        FUNCIONES DE FILTRADO Y BÚSQUEDA
    ---------------------------------------------------------------------- */

    // Filtra por marca
    const handleFilterByBrand = (brand) => {
        setProducts((allProducts && allProducts.length ? allProducts : productsData).filter(prod => prod.brand === brand));
        setSearchInput("");
        setShowSuggestions(false);
        setShowMenu(false);
    };

    const handleSelectSuggestion = (product) => {
        setProducts([product]); 
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchInput(product.name);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSuggestions([]);
        setShowSuggestions(false);
        setProducts(allProducts && allProducts.length ? allProducts : productsData); 
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);

        const searchTerm = value.toLowerCase().trim();

        if (searchTerm.length > 1) {
            const baseList = allProducts && allProducts.length ? allProducts : productsData;
            const filteredSuggestions = baseList.filter(
                prod =>
                    prod.name.toLowerCase().includes(searchTerm) ||
                    prod.description.toLowerCase().includes(searchTerm) ||
                    prod.category.toLowerCase().includes(searchTerm) ||
                    prod.brand.toLowerCase().includes(searchTerm) 
            ).slice(0, 8); 

            setSuggestions(filteredSuggestions);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") e.preventDefault(); 
    };
    
    /* ----------------------------------------------------------------------
        FUNCIONES DE FILTRADO DEL MENÚ LATERAL Y CARRITO
    ---------------------------------------------------------------------- */

    const handleFilterCamisetas = () => { setProducts((allProducts && allProducts.length ? allProducts : productsData).filter(prod => prod.category === "camiseta")); setShowMenu(false); };
    const handleShowAll = () => { setProducts(allProducts && allProducts.length ? allProducts : productsData); setShowMenu(false); };
    const handleFilterCamisetasRetros = () => { setProducts((allProducts && allProducts.length ? allProducts : productsData).filter(prod => prod.category === "retro")); setShowMenu(false); };
    const handleFilterBotines = () => { setProducts((allProducts && allProducts.length ? allProducts : productsData).filter(prod => prod.category === "botines")); setShowMenu(false); };
    const handleFilterPelotas = () => { setProducts((allProducts && allProducts.length ? allProducts : productsData).filter(prod => prod.category === "pelota")); setShowMenu(false); };
    
    const handleAddToCart = (item) => {
        // Si el usuario no está logueado, lo mandamos a login (comportamiento tipo e-commerce)
        if (!user) {
            navigate('/login');
            return;
        }
        const cleanedPrice = item.price.toString().replace('$', '').replace(/\./g, '');
        const priceNumber = Number(cleanedPrice);

        setCart(prevCart => [
            ...prevCart,
            {
                ...item,
                price: priceNumber, 
                total: priceNumber * item.quantity 
            }
        ]);
    };

    const handleEditItem = (item, newSize, newQty) => {
        setCart(prevCart => {
            const cleanedPrice = item.price.toString().replace('$', '').replace(/\./g, '');
            const priceNumber = Number(cleanedPrice);

            const filtered = prevCart.filter(
                prod => !(prod.name === item.name && prod.size === item.size)
            );
            return [
                ...filtered,
                {
                    ...item,
                    price: priceNumber,
                    size: newSize,
                    quantity: newQty,
                    total: priceNumber * newQty,
                },
            ];
        });
    };
    
    const handleCartClick = () => { navigate('/carrito'); };
    const handleProductClick = (product) => { setSelectedProduct(product); setShowModal(true); };
    const handleCloseModal = () => { setShowModal(false); setSelectedProduct(null); };
    const handleRemoveItem = (name, size) => { setCart(cart.filter(item => !(item.name === name && item.size === size))); };
    const handleClearCart = () => { setCart([]); };
    const toggleFavorite = (product) => {
        // Requiere login para guardar favoritos estilo e-commerce
        if (!user) {
            navigate('/login');
            return;
        }
        setFavorites(prev =>
            prev.some(fav => fav.name === product.name)
                ? prev.filter(fav => fav.name !== product.name)
                : [...prev, product]
        );
    };


    /* ----------------------------------------------------------------------
        JSX: RENDERIZADO DEL COMPONENTE HOME
    ---------------------------------------------------------------------- */

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
                    width: "100%", background: "#fffbe6", color: primaryColor,
                    padding: "12px 0", textAlign: "center", fontWeight: "bold",
                    fontSize: "1.1rem", letterSpacing: "1px"
                }}>
                    Bienvenido, {user.username}!
                </div>
            )}

            {/* Header (Maneja el Navbar superior) */}
            <Container fluid>
                <Row className="align-items-center mb-4 position-relative" style={{ background: primaryColor, borderRadius: "0 0 12px 12px", padding: "10px 0" }}>
                    <Col xs="auto" style={{ position: "relative" }}>
                        {/* Menu button (tres líneas) */}
                        <Button
                            variant="light"
                            style={{ color: primaryColor, background: "#fff", border: `2px solid ${primaryColor}`, borderRadius: "10px", marginRight: "10px" }}
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <FaBars size={28} />
                        </Button>
                        {/* Side menu */}
                        {showMenu && (
                            <div
                                style={{ position: "absolute", top: "45px", left: 0, background: "#fff", border: `2px solid ${primaryColor}`, borderRadius: "10px", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", zIndex: 1000, minWidth: "200px", display: "flex", flexDirection: "column" }}
                            >
                                <Button variant="link" className="w-100 text-start" style={{ color: primaryColor, fontWeight: "bold" }} onClick={handleShowAll}>Todos los productos</Button>
                                <Button variant="link" className="w-100 text-start" style={{ color: primaryColor, fontWeight: "bold" }} onClick={handleFilterCamisetas}>Camisetas</Button>
                                <Button variant="link" className="w-100 text-start" style={{ color: primaryColor, fontWeight: "bold" }} onClick={handleFilterCamisetasRetros}>Camisetas retro</Button>
                                <Button variant="link" className="w-100 text-start" style={{ color: primaryColor, fontWeight: "bold" }} onClick={handleFilterBotines}>Botines</Button>
                                <Button variant="link" className="w-100 text-start" style={{ color: primaryColor, fontWeight: "bold" }} onClick={handleFilterPelotas}>Pelotas de fútbol</Button>
                            </div>
                        )}
                    </Col>
                    <Col>
                        <h1 className="mb-0" style={{ fontWeight: "bold", fontSize: "2.5rem", color: "#fff", letterSpacing: "2px" }}>TodoSport</h1>
                    </Col>
                    <Col xs="auto" className="text-end">
                        {user ? (
                            <Button variant="light" style={{ color: primaryColor, fontWeight: "bold", fontSize: "1.1rem", background: "#fff", border: `2px solid ${secondaryColor}`, borderRadius: "10px", marginRight: "10px" }} onClick={() => { logout(); navigate('/'); }}>Cerrar sesión</Button>
                        ) : (
                            <Button variant="light" style={{ color: primaryColor, fontWeight: "bold", fontSize: "1.1rem", background: "#fff", border: `2px solid ${secondaryColor}`, borderRadius: "10px", marginRight: "10px" }} onClick={() => navigate('/login')}>iniciar sesión o <br /> registrarse</Button>
                        )}
                        <Button variant="light" style={{ color: "#ff3366", background: "#fff", border: `2px solid #ff3366`, borderRadius: "10px", marginRight: "10px" }} onClick={() => setShowFavs(true)}>
                            <FaHeart size={24} />
                            {favorites.length > 0 && (<span style={{ background: "#ff3366", color: "#fff", borderRadius: "50%", padding: "2px 8px", fontSize: 12, marginLeft: 4 }}>{favorites.length}</span>)}
                        </Button>
                        <Button variant="light" style={{ color: "#ff9900", background: "#fff", border: `2px solid #ff9900`, borderRadius: "10px" }} onClick={handleCartClick}>
                            <FaShoppingCart size={28} />
                            {cart.length > 0 && (<span style={{ background: "#ff9900", color: "#fff", borderRadius: "50%", padding: "2px 8px", fontSize: 12, marginLeft: 4 }}>{cart.length}</span>)}
                        </Button>
                    </Col>
                </Row>
            </Container>

            {/* Search bar y Dropdown de Sugerencias (movido arriba del carousel) */}
            <Container className="my-4 d-flex justify-content-center">
                <div className="w-100" style={{ position: "relative", maxWidth: 500 }}>
                    <Form className="d-flex" onSubmit={e => e.preventDefault()}>
                        <Form.Control
                            type="search"
                            placeholder="Escribe para buscar productos..."
                            value={searchInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="w-100"
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                        />
                        {/* Botón de Limpiar Búsqueda o Lupa */}
                        {searchInput.length > 0 ? (
                            <Button variant="danger" className="ms-2" onClick={handleClearSearch} title="Limpiar búsqueda">X</Button>
                        ) : (
                            <Button variant="warning" className="ms-2" onClick={() => { /* No hace falta lógica aquí */ }}><FaSearch /></Button>
                        )}
                    </Form>

                    {/* DROPDOWN DE SUGERENCIAS */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow" style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
                            {suggestions.map((product, index) => (
                                <div
                                    key={index}
                                    className="p-2 border-bottom d-flex align-items-center"
                                    style={{ cursor: 'pointer', backgroundColor: '#fff' }}
                                    onMouseDown={() => handleSelectSuggestion(product)}
                                >
                                    <FaSearch size={14} className="me-2 text-muted" />
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: primaryColor }}>{product.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>Marca: {product.brand}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>

            {/* 1. BANNER PRINCIPAL CON MOVIMIENTO (Carousel con Productos Destacados) */}
            <Container fluid className="p-0 mb-4">
                <Carousel fade controls={false} interval={5000} className="shadow-lg">
                    
                    {/* SLIDE 1: PROMOCIONAL FIJO (Imagen de fondo del mundial) - CORREGIDO */}
                    <Carousel.Item>
                        <div 
                            className="d-flex align-items-center justify-content-end text-white"
                            style={{ 
                                position: 'relative', // Necesario para el posicionamiento absoluto del botón
                                height: '400px', 
                                background: `url(https://sportingio.vtexassets.com/assets/vtex.file-manager-graphql/images/bb31d247-024f-4517-900f-2295a2fd62a7___7ae90ddfdb04822de8337557a92eedac.jpg) center/cover no-repeat`,
                                borderBottom: `5px solid ${secondaryColor}`
                            }}
                        >
                            {/* ÚNICO BOTÓN INTERACTIVO - Posicionado ABSOLUTAMENTE sobre la imagen */}
                            <Button 
                                variant="light" 
                                size="lg" 
                                style={{ 
                                    position: 'absolute',
                                    bottom: '50px', 
                                    right: '50px',  
                                    color: primaryColor, 
                                    fontWeight: 'bold',
                                    zIndex: 200, 
                                }}
                                onClick={() => {
                                    const wcBall = allProducts.find(p => p.name.includes("Pelota Trionda Competition"));
                                    if (wcBall) handleProductClick(wcBall);
                                }}
                            >
                                COMPRAR AHORA →
                            </Button>
                            
                        </div>
                    </Carousel.Item>

                    {/* SLIDES DINÁMICOS: Productos destacados */}
                    {allProducts.slice(0, 4).map((product, index) => (
                        <Carousel.Item key={index}>
                            <div 
                                className="d-flex align-items-center justify-content-around text-white p-5"
                                style={{ 
                                    height: '400px', 
                                    backgroundColor: primaryColor, 
                                    borderBottom: `5px solid ${secondaryColor}`
                                }}
                            >
                                {/* Contenido Dinámico: Imagen y Detalles */}
                                <div style={{ width: '40%', textAlign: 'center' }}>
                                    <img
                                        src={product.image || PLACEHOLDER_IMAGE}
                                        alt={product.name}
                                        className="img-fluid"
                                        style={{ maxHeight: '350px', objectFit: 'contain' }}
                                        loading="lazy"
                                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                                    />
                                </div>
                                <div style={{ width: '50%', color: '#fff' }}>
                                    <h1 style={{ fontWeight: '900', fontSize: '2.5rem', color: secondaryColor }}>¡OFERTA DEL DÍA!</h1>
                                    <h3 className="mb-2" style={{ fontWeight: '700' }}>{product.name}</h3>
                                    <p className="lead" style={{ fontSize: '1.2rem' }}>{product.description.substring(0, 80)}...</p>
                                    <h2 className="mb-4" style={{ fontWeight: '900', color: '#fff' }}>{product.price}</h2>
                                    <Button 
                                        variant="warning" 
                                        size="lg" 
                                        onClick={() => handleProductClick(product)}
                                    >
                                        VER DETALLES
                                    </Button>
                                </div>
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>

            {/* 2. OFERTAS DE PAGO Y LOGOS DE MARCA (CON BOTONES) */}
            <Container className="mb-5">
                <Row className="justify-content-center g-3 mb-4">
                    {/* Cuotas 1 */}
                    <Col xs={12} sm={6} md={4} lg={3}>
                        <Card className="text-center border-0 shadow-sm" style={{ background: '#f5f5f5' }}>
                            <Card.Body>
                                <h4 className="text-info" style={{ fontWeight: '800' }}>3 o 6 CUOTAS</h4>
                                <p className="mb-0 text-muted">sin interés con bancos seleccionados</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Cuotas 2 */}
                    <Col xs={12} sm={6} md={4} lg={3}>
                        <Card className="text-center border-0 shadow-sm" style={{ background: '#fff3cd' }}>
                            <Card.Body>
                                <h4 style={{ color: secondaryColor, fontWeight: '800' }}>6 CUOTAS FIJAS</h4>
                                <p className="mb-0 text-muted">Con tarjeta Visa y Mastercard</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                
                {/* FILTROS DE MARCA (Botones) */}
                <div className="d-flex justify-content-around p-3 border-top border-bottom" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    <Button variant="link" className="text-dark mx-3 mb-0 p-0" style={{ minWidth: '100px', fontWeight: 'bold' }} onClick={() => handleFilterByBrand("Adidas")}>ADIDAS</Button>
                    <Button variant="link" className="text-dark mx-3 mb-0 p-0" style={{ minWidth: '100px', fontWeight: 'bold' }} onClick={() => handleFilterByBrand("Nike")}>NIKE</Button>
                    <Button variant="link" className="text-dark mx-3 mb-0 p-0" style={{ minWidth: '100px', fontWeight: 'bold' }} onClick={() => handleFilterByBrand("Puma")}>PUMA</Button>
                    <Button variant="link" className="text-dark mx-3 mb-0 p-0" style={{ minWidth: '100px', fontWeight: 'bold' }} onClick={() => handleFilterByBrand("Retro")}>RETRO</Button>
                    <Button variant="link" className="text-dark mx-3 mb-0 p-0" style={{ minWidth: '100px', fontWeight: 'bold' }} onClick={handleShowAll}>VER TODOS</Button>
                </div>
            </Container>


            {/* Search bar moved above; original location removed to avoid duplication */}

            {/* Products grid */}
            <Container>
                <Row className="justify-content-center">
                    {products.map((product, i) => (
                        <Col key={i} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center mb-4">
                            <Card
                                className={`shadow-sm w-100 h-100 ${hoveredIndex === i ? 'shadow-lg' : ''}`}
                                style={{
                                    maxWidth: "20rem", borderRadius: "12px", cursor: "pointer",
                                    transition: "box-shadow 0.3s ease-in-out", border: "none"
                                }}
                                onMouseEnter={() => setHoveredIndex(i)} 
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => handleProductClick(product)}
                            >
                                {/* Product image */}
                                <div style={{ width: "100%", height: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Card.Img
                                        variant="top"
                                        src={product.image || PLACEHOLDER_IMAGE}
                                        alt={product.name}
                                        loading="lazy"
                                        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                                        style={{ maxHeight: "180px", width: "auto", maxWidth: "100%", objectFit: "contain", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}
                                    />
                                </div>
                                <Card.Body
                                    className="d-flex flex-column justify-content-between align-items-center"
                                    style={{ flex: 1, width: "100%", padding: "1rem 0.5rem 0.5rem 0.5rem" }}
                                >
                                    <Card.Title className="text-center" style={{ fontSize: "1.2rem", color: primaryColor, fontWeight: "bold" }}>{product.name}</Card.Title>
                                    <Card.Text className="text-center" style={{ fontSize: "1rem", color: "#444" }}>{product.description}</Card.Text>
                                    <div style={{ flexGrow: 1 }} />
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span style={{ fontSize: "1.3rem", color: secondaryColor, fontWeight: "bold", marginRight: 8 }}>{product.price}</span>
                                        <FaHeart
                                            size={20}
                                            style={{ color: favorites.some(fav => fav.name === product.name) ? "#ff3366" : "#bbb", cursor: "pointer", transition: "color 0.2s" }}
                                            onClick={e => { e.stopPropagation(); toggleFavorite(product); }}
                                            title={favorites.some(fav => fav.name === product.name) ? "Quitar de favoritos" : "Agregar a favoritos"}
                                        />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                {products.length === 0 && (
                    <Row className="justify-content-center">
                        <Col xs={12} className="text-center text-muted mt-4" style={{ fontSize: "1.2rem" }}>No se encontraron productos.</Col>
                    </Row>
                )}
            </Container>

            {/* 3. APARTADO DE BENEFICIOS/SERVICIOS (ENVIOS, PAGOS, CAMBIOS) */}
            <Container fluid className="py-5 mt-5 border-top" style={{ background: '#fff' }}>
                <Row className="justify-content-center text-center">
                    
                    {/* Columna 1: ENVÍOS */}
                    <Col xs={12} md={4} lg={3} className="mb-4">
                        <div className="mx-auto mb-3" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Icono de Camión (simulando Font Awesome o React Icons) */}
                            <span style={{ fontSize: '32px', color: '#68ad68' }}>🚛</span> 
                        </div>
                        <h5 className="mb-2" style={{ fontWeight: '600', color: detailColor }}>ENVÍOS A TODO EL PAÍS</h5>
                        <p className="mb-1">Gratis desde $149.999</p>
                    </Col>

                    {/* Columna 2: PAGOS */}
                    <Col xs={12} md={4} lg={3} className="mb-4">
                        <div className="mx-auto mb-3" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Icono de Tarjeta (simulando Font Awesome o React Icons) */}
                            <span style={{ fontSize: '32px', color: '#999' }}>💳</span> 
                        </div>
                        <h5 className="mb-2" style={{ fontWeight: '600', color: detailColor }}>CUOTAS Y FORMAS DE PAGO</h5>
                        <p className="mb-1">3 y 6 Cuotas sin interés</p>
                    </Col>

                    {/* Columna 3: CAMBIOS Y DEVOLUCIONES */}
                    <Col xs={12} md={4} lg={3} className="mb-4">
                        <div className="mx-auto mb-3" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Icono de Paquete/Cambio (simulando Font Awesome o React Icons) */}
                            <span style={{ fontSize: '32px', color: '#68ad68' }}>📦</span> 
                        </div>
                        <h5 className="mb-2" style={{ fontWeight: '600', color: detailColor }}>CAMBIOS Y DEVOLUCIONES</h5>
                        <p className="mb-1">Primer cambio gratis</p>
                    </Col>

                </Row>
            </Container>

{/* Modals */}
            {selectedProduct && (<ProductModal show={showModal} onHide={handleCloseModal} product={selectedProduct} onAddToCart={handleAddToCart} />)}
            {/* Sincronizamos la apertura del modal con la ruta: /carrito abre el modal */}
            <CartModal
                show={showCart}
                onHide={() => navigate('/home')}
                cart={cart}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                onEditItem={handleEditItem}
            />
            
            {/* MODAL DE FAVORITOS (CORREGIDO: Solo Navegación) */}
            <Modal show={showFavs} onHide={() => setShowFavs(false)} centered>
                <Modal.Header closeButton><Modal.Title>Favoritos</Modal.Title></Modal.Header>
                <Modal.Body>
                    {favorites.length === 0 ? (
                        <div className="text-center text-muted">No tienes productos favoritos.</div>
                    ) : (
                        favorites.map((fav, idx) => (
                            // INICIO: Bloque de un favorito - AHORA TODO ES CLIQUEABLE
                            <div 
                                key={idx} 
                                className="d-flex align-items-center mb-3 p-2 border rounded" 
                                style={{ background: '#f8f8f8', cursor: 'pointer' }}
                                // Conectamos el clic para cerrar Favoritos y abrir Detalles del Producto
                                onClick={() => {
                                    setShowFavs(false); 
                                    handleProductClick(fav); 
                                }}
                            >
                                {/* Contenido del producto */}
                                <div className="d-flex align-items-center" style={{ flexGrow: 1 }}>
                                    <img 
                                        src={fav.image} 
                                        alt={fav.name} 
                                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8, marginRight: 10 }} 
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, color: primaryColor }}>{fav.name}</div>
                                        <div style={{ fontSize: 13, color: "#888" }}>{fav.price}</div>
                                    </div>
                                </div> 
                                {/* ELIMINADO: El Botón Añadir al Carrito */}
                            </div>
                            // FIN: Bloque de un favorito
                        ))
                    )}
                </Modal.Body>
                <Modal.Footer><Button variant="secondary" onClick={() => setShowFavs(false)}>Cerrar</Button></Modal.Footer>
            </Modal>
        </div>
    );
};

export default Home;