import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
// 🛠️ CORRECCIÓN: Importar la URL centralizada
import { API_BASE_URL } from '../config';

// 🛠️ CORRECCIÓN: Eliminar la URL local
// const API = 'https://todosport-production.up.railway.app/api';

export default function Profile() {
const { authFetch } = useAuth();
// ... (resto del componente)
useEffect(() => {
    (async () => {
    try {
        // 🛠️ CORRECCIÓN: Usar la URL importada
        const res = await authFetch(`${API_BASE_URL}/user/profile/`);
        if (!res.ok) throw new Error((await res.json()).detail || `Error ${res.status}`);
        setData(await res.json());
    } catch (e) { setErr(e.message); }
    })();
}, [authFetch]);

if (err) return <div>Error: {err}</div>;
if (!data) return <div>Cargando...</div>;
return <pre>{JSON.stringify(data, null, 2)}</pre>;
}