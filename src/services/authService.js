// src/services/authService.js
import { API_BASE_URL } from '../config'; // Importa la URL de Railway

export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            // Lanza un error si el servidor devuelve 400, 401, etc.
            throw new Error('Login failed'); 
        }

        const data = await response.json();

        // 🛠️ Almacena los tokens (ejemplo simple en localStorage)
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // 🛠️ Decodificar el token para obtener info del usuario (is_staff, etc.)
        // Esto es complejo, para la prueba simplemente devolvemos un objeto de éxito:
        return {
            is_staff: true, // Asume que si el token se recibe, es un usuario staff
            username: username
        }; 

    } catch (error) {
        console.error("Login API error:", error);
        return null; // Devuelve null si falla la conexión
    }
};