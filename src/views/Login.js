import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
// Importamos Container, Row, Col y Button de react-bootstrap para el diseño adaptativo
import { Container, Row, Col, Button } from 'react-bootstrap'; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // FUNCIÓN ÚNICA DE ENVÍO: Con lógica de conexión al backend
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        // Lógica de conexión al backend (mantienes esta parte importante)
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: form.username, password: form.password }),
        });

        if (response.ok) {
            // Si la conexión es exitosa, actualiza el estado de Auth
            const data = await response.json();
            localStorage.setItem("token", data.token);
            login(form.username, form.password); 
            navigate('/'); 
        } else {
            // Si la respuesta del servidor indica error (ej: 401 Unauthorized)
            setError('Usuario o contraseña incorrectos');
        }
    } catch (err) {
        // Manejo de errores de red o fallo de servidor
        console.error("Error connecting to backend:", err);
        setError('Error de conexión. Intenta de nuevo.');
    } finally {
        setLoading(false);
    }
  };
    
  return (
        // Usamos Grid System para centrar y asegurar que sea adaptativo
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Row className="w-100 justify-content-center">
                {/* Columna adaptativa: Ocupa 4 de 12 columnas en desktop y se centra */}
                <Col xs={12} sm={8} md={6} lg={4}> 
                    <div className="card p-4 shadow-lg" style={{ borderRadius: 16 }}>
                        <h2 style={{
                            textAlign: "center",
                            marginBottom: 24,
                            fontWeight: 700,
                            color: "#232f3e"
                        }}>
                            Iniciar sesión
                        </h2>
                        
                        <form onSubmit={handleSubmit}>
                            {/* Campo Usuario */}
                            <div className="mb-3">
                                <label style={{ fontWeight: 500 }}>
                                    <FaUser style={{ marginRight: 6, color: "#ff9900" }} />
                                    Usuario
                                </label>
                                <input
                                    className="form-control"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    autoFocus
                                    required
                                    disabled={loading}
                                    placeholder="Tu usuario"
                                    style={{ borderRadius: 8 }}
                                />
                            </div>
                            
                            {/* Campo Contraseña */}
                            <div className="mb-3">
                                <label style={{ fontWeight: 500 }}>
                                    <FaLock style={{ marginRight: 6, color: "#ff9900" }} />
                                    Contraseña
                                </label>
                                <input
                                    className="form-control"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    placeholder="Tu contraseña"
                                    style={{ borderRadius: 8 }}
                                />
                            </div>
                            
                            {error && <div className="text-danger mb-3 text-center">{error}</div>}
                            
                            {/* BOTÓN ÚNICO DE ENVÍO - Solución a la duplicidad */}
                            <Button
                                type="submit"
                                variant="warning"
                                className="w-100"
                                style={{ fontWeight: 600, borderRadius: 8, marginTop: '10px' }} // Agregué un margen para separar del error/campo
                                disabled={loading}
                            >
                                {loading ? "Ingresando..." : "Iniciar sesión"}
                            </Button>
                        </form>
                        
                        <p className="mt-3 text-center">
                            ¿No tenés cuenta? <a href="/register" style={{ fontWeight: 'bold' }}>Registrate</a>
                        </p>
                    </div>
                </Col>
            </Row>
    </Container>
);
};

export default Login;