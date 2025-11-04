import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffRoute from "./routes/StaffRoute";
import AdminPanel from "./views/AdminPanel";
import Checkout from "./views/Checkout";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Home en /home y redirección desde / (pública) */}
          <Route path="/home" element={<Home />} />
          {/* Ruta alternativa para mostrar Home con el modal del carrito abierto */}
          <Route path="/carrito" element={<Home />} />
          {/* Redirigir la raíz a /home para que la barra de direcciones muestre /home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Checkout requiere estar autenticado */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

          {/* Rutas administrativas: solo personal/staff */}
          <Route element={<StaffRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
