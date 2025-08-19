import React from 'react';

const Cart = () => (
  <div className="container py-5">
    <h2 className="mb-4">Carrito de compras</h2>
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Talle</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img src="https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4c8dee7623f4209b76dfd333a68c812_9366/Camiseta_Titular_Argentina_24_Blanco_IP8400_01_laydown.jpg" alt="Producto" style={{ width: 60, borderRadius: 8, marginRight: 10 }} />
              Camiseta Argentina 2024
            </td>
            <td>M</td>
            <td>2</td>
            <td>$85.000</td>
            <td>$170.000</td>
            <td>
              <button className="btn btn-outline-danger btn-sm">Eliminar</button>
            </td>
          </tr>
          {/* Puedes duplicar este <tr> para más productos */}
        </tbody>
      </table>
    </div>
    <div className="d-flex justify-content-end align-items-center mt-4">
      <h4 className="me-4">Total: $170.000</h4>
      <button
        className="btn btn-success btn-lg me-2"
        onClick={() => window.location.href = "/checkout"}
      >
        Continuar con el pago
      </button>
    </div>
  </div>
);

export default Cart;