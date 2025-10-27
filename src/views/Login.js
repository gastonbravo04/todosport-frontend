import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap'; // Importamos componentes de react-bootstrap si los estás usando en otras partes

const Login = () => (
    // Usamos Container y una altura mínima de pantalla para centrar verticalmente
    // d-flex, justify-content-center y align-items-center son las clases de Bootstrap 5 para centrar
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        
        {/* Usamos Row y Col para definir el ancho máximo de forma responsiva */}
        <Row className="w-100">
            
            {/* Clases de Columna:
                col-12: Ocupa 12 columnas (ancho completo) en móvil.
                col-md-8: Ocupa 8 columnas en pantallas medianas.
                col-lg-4: Ocupa 4 columnas en pantallas grandes (desktop).
                mx-auto: Centra horizontalmente el bloque de columna.
                
                Esto garantiza que el formulario nunca sea demasiado ancho, pero siempre esté centrado.
            */}
            <Col xs={12} md={8} lg={4} className="mx-auto">

                <div className="card p-4 shadow-lg">
                    <h2 className="mb-4 text-center">Iniciar sesión</h2>
                    <form>
                        {/* Se eliminaron las etiquetas <label> innecesarias */}
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Ingresa tu usuario" aria-label="Usuario" required />
                        </div>
                        <div className="mb-3">
                            <input type="password" className="form-control" placeholder="Ingresa tu contraseña" aria-label="Contraseña" required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg w-100">Ingresar</button>
                    </form>
                    <div className="mt-3 text-center">
                        <a href="/register">¿No tienes cuenta? Regístrate</a>
                    </div>
                </div>
            </Col>
        </Row>
    </Container>
);

export default Login;