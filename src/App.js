import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffRoute from "./routes/StaffRoute";
import NonStaffRoute from "./routes/NonStaffRoute";
import AdminPanel from "./views/AdminPanel";
import Checkout from "./views/Checkout";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Home en /home y redirección desde / */}
          <Route path="/home" element={<NonStaffRoute><Home /></NonStaffRoute>} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />

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
