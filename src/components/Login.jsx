import React, { useState } from 'react';
// 🛠️ CORRECCIÓN: Importar el hook de autenticación (que tiene la URL de Railway)
import { useAuth } from '../context/AuthContext';
// 🛠️ CORRECCIÓN: Importar el hook de navegación de React Router
import { useNavigate } from 'react-router-dom';

// ❌ Eliminamos imports a servicios que no existen
// import { login } from '../services/authService';
// import { navigate } from '../services/navigateService';

const LoginPage = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    // Mostrar / ocultar contraseña
    const [showPassword, setShowPassword] = useState(false);
    
    // 🛠️ CORRECCIÓN: Obtener 'login' y 'loading' desde el Contexto
    const { login, loading } = useAuth();
    // 🛠️ CORRECCIÓN: Inicializar el hook de navegación
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // setLoading(true); // El AuthContext ya maneja el 'loading'

        try {
            // 🛠️ CORRECCIÓN: Usar la función 'login' del Context
            // Esta función ya llama a la API de Railway y maneja el token.
            const result = await login(form.username, form.password);
            
            if (!result.ok) {
                // Si la API devuelve un error (ej. 401 Credenciales inválidas)
                return setError(result.error || 'Credenciales inválidas');
            }
            
            // 🛠️ CORRECCIÓN: Usar 'navigate' de React Router
            // Redirigir basado en la respuesta del contexto
            navigate(result.user?.is_staff ? '/admin' : '/home');

        } catch (err) {
            // Captura errores de red (ej. si Railway está caído)
            setError(err.message || 'Error de red. Intente de nuevo.');
        } 
        // finally {
        //     setLoading(false); // El AuthContext ya maneja el 'loading'
        // }
    };

    return (
        <div>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Usuario" 
                    value={form.username} 
                    onChange={(e) => setForm({ ...form, username: e.target.value })} 
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        style={{ cursor: 'pointer', background: 'transparent', border: 'none', fontSize: 18 }}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                </div>
                
                {/* Usamos la variable 'loading' del Context para deshabilitar */}
                <button type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar sesión'} 
                </button>

            </form>
            {/* 🛠️ CORRECCIÓN: Muestra el error de la API */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default LoginPage;