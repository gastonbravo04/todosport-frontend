import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const [oldp, setOldp] = useState('');
  const [newp, setNewp] = useState('');
  const [msg, setMsg] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await changePassword(oldp, newp);
      setMsg('Contraseña cambiada');
      setOldp(''); setNewp('');
    } catch (e) { setMsg(e.message); }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="password" placeholder="Contraseña actual" value={oldp} onChange={e=>setOldp(e.target.value)} />
      <input type="password" placeholder="Nueva contraseña" value={newp} onChange={e=>setNewp(e.target.value)} />
      <button type="submit">Cambiar</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}