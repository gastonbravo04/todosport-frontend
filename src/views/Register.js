import React from 'react';

const Register = () => (
  <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
    <div className="card p-4 shadow" style={{ maxWidth: 370, width: "100%" }}>
      <h2 className="mb-4 text-center">Registrarse</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input type="text" className="form-control" placeholder="Elige un usuario" />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" placeholder="Elige una contraseña" />
        </div>
        <button type="submit" className="btn btn-success w-100">Registrarse</button>
      </form>
      <div className="mt-3 text-center">
        <a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
      </div>
    </div>
  </div>
);

export default Register;