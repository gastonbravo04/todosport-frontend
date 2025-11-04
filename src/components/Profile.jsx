import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API = 'http://127.0.0.1:8000/api';

export default function Profile() {
const { authFetch } = useAuth();
const [data, setData] = useState(null);
const [err, setErr] = useState('');

useEffect(() => {
    (async () => {
    try {
        const res = await authFetch(`${API}/user/profile/`);
        if (!res.ok) throw new Error((await res.json()).detail || `Error ${res.status}`);
        setData(await res.json());
    } catch (e) { setErr(e.message); }
    })();
}, [authFetch]);

if (err) return <div>Error: {err}</div>;
if (!data) return <div>Cargando...</div>;
return <pre>{JSON.stringify(data, null, 2)}</pre>;
}