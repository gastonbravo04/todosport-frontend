import React, { createContext, useState, useContext, useEffect } from 'react';

const initialUsers = [
  { username: 'mg.bravo', password: '1234' }
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState(() => {
    // Intenta leer el usuario guardado en localStorage
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Guarda el usuario en localStorage cuando cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (username, password) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
      setUser({ username });
      return true;
    }
    return false;
  };

  const register = (username, password) => {
    if (users.find(u => u.username === username)) {
      return false;
    }
    setUsers([...users, { username, password }]);
    setUser({ username });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);