import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // Usamos un botón icon-only similar al del login (ojo) — estilo compacto y accesible
    <button
      onClick={handleLogout}
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
      style={{
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        padding: 6,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <FaEye style={{ color: '#000', fontSize: 18 }} />
    </button>
  );
};

export default Logout;