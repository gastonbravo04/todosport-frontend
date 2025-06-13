import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(form.username, form.password);
      setLoading(false);
      if (success) {
        navigate('/');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    }, 800); // Simula una espera de red
  };

  return (
    <div style={{
      maxWidth: 380,
      margin: "60px auto",
      background: "#fff",
      padding: 32,
      borderRadius: 16,
      boxShadow: "0 2px 16px #e3e3e3"
    }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: 24,
        fontWeight: 700,
        color: "#232f3e"
      }}>
        Iniciar sesión
      </h2>
      <form onSubmit={handleSubmit}>
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
        {error && <div className="text-danger mb-2 text-center">{error}</div>}
        <button
          type="submit"
          className="btn btn-warning w-100"
          style={{ fontWeight: 600, borderRadius: 8 }}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
      <p className="mt-3 text-center">
        ¿No tenés cuenta? <a href="/register">Registrate</a>
      </p>
    </div>
  );
};

export default Login;