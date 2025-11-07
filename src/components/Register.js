import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(form.username, form.password);
      if (res?.ok) {
        // Intentar login automático después de registrarse
        const u = await login(form.username, form.password);
        if (u?.ok) {
          navigate('/');
        } else {
          // si no logra loguear, redirige a la página de login y muestra error
          setError(u?.error || 'Registro correcto pero no se pudo iniciar sesión.');
          navigate('/login');
        }
      } else {
        // Mapear errores de red a un mensaje más claro en español
        const err = res?.error || 'No se pudo registrar. Verificá los datos.';
        if (typeof err === 'string' && err.toLowerCase().includes('failed to fetch')) {
          setError('No se pudo conectar con el servidor backend. ¿Está corriendo?');
        } else {
          setError(err);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 350, margin: "60px auto", background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 12px #e3e3e3" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Usuario</label>
          <input
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoFocus
            required
          />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              className="form-control"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 6 }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {error && <div className="text-danger mb-2">{error}</div>}
        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <p className="mt-3 text-center">
        ¿Ya tenés una cuenta? <a href="/login">Iniciar sesión</a>
      </p>
    </div>
  );
};

export default Register;