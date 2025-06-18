import React from 'react';

const Login = () => (
  <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
    <div className="card p-4 shadow" style={{ maxWidth: 350, width: "100%" }}>
      <h2 className="mb-4 text-center">Iniciar sesión</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input type="text" className="form-control" placeholder="Ingresa tu usuario" />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" placeholder="Ingresa tu contraseña" />
        </div>
        <button type="submit" className="btn btn-primary w-100">Ingresar</button>
      </form>
      <div className="mt-3 text-center">
        <a href="/register">¿No tienes cuenta? Registrate</a>
      </div>
    </div>
  </div>
);

export default Login;