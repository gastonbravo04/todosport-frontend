import React, { useState } from 'react';

const Checkout = () => {
  const [payment, setPayment] = useState("");
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container py-5">
      <h2 className="mb-4">Resumen de compra</h2>
      <div className="card p-3 mb-4">
        <h5 className="mb-3">Productos en el carrito</h5>
        <ul className="list-group list-group-flush">
          {cartItems.map((item, idx) => (
            <li key={idx} className="list-group-item d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: "contain", marginRight: 16, borderRadius: 8, border: "1px solid #eee" }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div className="text-muted" style={{ fontSize: 14 }}>
                    Talle: {item.size} &nbsp;|&nbsp; Cantidad: {item.quantity}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 600, color: "#ff9900" }}>
                ${item.price.toLocaleString()} x{item.quantity}
              </div>
            </li>
          ))}
        </ul>
        <div className="d-flex justify-content-end mt-3">
          <h5>Total: <span style={{ color: "#ff9900" }}>${total.toLocaleString()}</span></h5>
        </div>
      </div>

      <div className="card p-3 mb-4">
        <h5 className="mb-3">Elegí el método de pago</h5>
        <div className="form-check mb-2">
          <input className="form-check-input" type="radio" name="pago" id="efectivo" value="Efectivo"
            checked={payment === "Efectivo"} onChange={e => setPayment(e.target.value)} />
          <label className="form-check-label" htmlFor="efectivo">
            <span role="img" aria-label="efectivo">💵</span> Efectivo
          </label>
        </div>
        <div className="form-check mb-2">
          <input className="form-check-input" type="radio" name="pago" id="transferencia" value="Transferencia"
            checked={payment === "Transferencia"} onChange={e => setPayment(e.target.value)} />
          <label className="form-check-label" htmlFor="transferencia">
            <span role="img" aria-label="transferencia">🏦</span> Transferencia bancaria
          </label>
        </div>
        <div className="form-check mb-2">
          <input className="form-check-input" type="radio" name="pago" id="debito" value="Débito"
            checked={payment === "Débito"} onChange={e => setPayment(e.target.value)} />
          <label className="form-check-label" htmlFor="debito">
            <span role="img" aria-label="debito">💳</span> Tarjeta de débito
          </label>
        </div>
        <div className="form-check mb-2">
          <input className="form-check-input" type="radio" name="pago" id="credito" value="Crédito"
            checked={payment === "Crédito"} onChange={e => setPayment(e.target.value)} />
          <label className="form-check-label" htmlFor="credito">
            <span role="img" aria-label="credito">💳</span> Tarjeta de crédito
          </label>
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg w-100"
        disabled={!payment}
        onClick={() => alert("¡Compra confirmada!")}
      >
        Confirmar compra
      </button>
    </div>
  );
};

export default Checkout;