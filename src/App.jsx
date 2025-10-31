import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './routes/PrivateRoute';
import Profile from './components/Profile';
import Home from './views/Home';
import StaffRoute from './routes/StaffRoute';
import AdminPanel from './views/AdminPanel';
import ProductDetail from './views/ProductDetail';
import Cart from './views/Cart';
import Checkout from './views/Checkout';

const App = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/product/:productId" element={<ProductDetail />} />

      {/* Rutas Privadas (solo para usuarios autenticados) */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      {/* Rutas de Staff (solo para administradores) */}
      <Route element={<StaffRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
};

export default App;