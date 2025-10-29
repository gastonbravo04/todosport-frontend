import React, { createContext, useState, useContext, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user');
  }, [user]);
  useEffect(() => {
    token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
    refreshToken ? localStorage.setItem('refreshToken', refreshToken) : localStorage.removeItem('refreshToken');
  }, [token, refreshToken]);

  const parseJwt = (t) => { try { return JSON.parse(atob(t.split('.')[1])); } catch { return null; } };

  useEffect(() => {
    if (token && !user) {
      const p = parseJwt(token);
      const username = p?.username || p?.user || p?.sub || null;
      if (username) setUser({ username });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login: /api/token/
  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const err = (data && (data.detail || data.error || JSON.stringify(data))) || `Error ${res.status}`;
        return { ok: false, error: err };
      }
      const access = data?.access;
      const refresh = data?.refresh;
      if (!access) return { ok: false, error: 'No access token received' };
      setToken(access);
      if (refresh) setRefreshToken(refresh);

      // obtener perfil para saber si es staff
      const pRes = await fetch(`${API_BASE}/user/profile/`, {
        headers: { Authorization: `Bearer ${access}` }
      });
      const profile = await pRes.json().catch(() => null);
      const u = profile?.username ? { username: profile.username, is_staff: !!profile.is_staff } : { username };
      setUser(u);
      return { ok: true, user: u }; // devolvemos objeto con ok
    } catch {
      return { ok: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  // Register: /api/user/register/user/
  const register = async (username, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/register/user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) // más campos si tu serializer los requiere
      });
      let data = null;
      try { data = await res.json(); } catch {}
      if (!res.ok) {
        const msg =
          data?.detail || data?.message || data?.error ||
          (data && typeof data === 'object' ? Object.values(data)[0]?.[0] : null) ||
          `Error ${res.status}`;
        return { ok: false, error: msg };
      }
      return { ok: true, data };
    } catch (e) {
      return { ok: false, error: e.message || 'Error de red' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('cart');
  };

  // helper para peticiones con token (renovar si hace falta, opcional)
  const refreshAccessToken = async () => {
    if (!refreshToken) return null;
    const r = await fetch(`${API_BASE}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken })
    });
    const d = await r.json().catch(() => null);
    if (!r.ok || !d?.access) return null;
    setToken(d.access);
    return d.access;
  };

  const authFetch = async (input, init = {}) => {
    const withAuth = async (tkn) => {
      const h = new Headers(init.headers || {});
      if (tkn) h.set('Authorization', `Bearer ${tkn}`);
      return fetch(input, { ...init, headers: h });
    };
    let r = await withAuth(token);
    if (r.status === 401) {
      const nt = await refreshAccessToken();
      if (nt) r = await withAuth(nt);
    }
    return r;
  };

  const changePassword = async (oldPassword, newPassword) => {
    const res = await authFetch(`${API_BASE}/user/change-password/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail || `Error ${res.status}`);
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, authFetch, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// No pongas nada debajo de esta línea. Quitar el ejemplo que usa useAuth/await fuera de componentes.