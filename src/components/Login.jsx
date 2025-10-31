import React, { useState } from 'react';
import { login } from '../services/authService';
import { navigate } from '../services/navigateService';

const LoginPage = () => {
const [form, setForm] = useState({ username: '', password: '' });
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
    const u = await login(form.username, form.password);
    if (!u) return setError('Credenciales inválidas');
      // si es staff, a panel de admin; si no, a la tienda
    navigate(u.is_staff ? '/admin' : '/');
    } finally {
    setLoading(false);
    }
};

return (
    <div>
    <h2>Iniciar sesión</h2>
    <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Usuario" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Iniciar sesión</button>
    </form>
    {error && <p>{error}</p>}
    </div>
);
};

export default LoginPage;