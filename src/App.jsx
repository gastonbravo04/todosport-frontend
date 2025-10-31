import React from 'react';
import { Route, Routes, PrivateRoute } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './routes/PrivateRoute';
import Profile from './components/Profile';
import Home from './components/Home';
import StaffRoute from './routes/StaffRoute';

const App = () => {
return (
    <Routes>
    {/* públicas */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<Home />} />

    {/* solo administradores */}
    <Route element={<StaffRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        {/* rutas para gestionar productos, etc. */}
    </Route>
    </Routes>
);
};

export default App;