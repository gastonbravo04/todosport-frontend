import React from 'react';

const ProductDetail = () => (
  <div className="container py-5">
    <div
      className="row align-items-center justify-content-center"
      style={{
        flexWrap: "nowrap",
        overflowX: "auto",
        minHeight: 300
      }}
    >
      <div
        className="col-6 col-md-6 text-center"
        style={{ minWidth: 200, maxWidth: 350 }}
      >
        <img
          src="https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4c8dee7623f4209b76dfd333a68c812_9366/Camiseta_Titular_Argentina_24_Blanco_IP8400_01_laydown.jpg"
          alt="Producto"
          className="img-fluid rounded shadow"
          style={{ maxHeight: 300, width: "100%" }}
        />
      </div>
      <div
        className="col-6 col-md-6"
        style={{
          minWidth: 200,
          maxWidth: 400,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px #eee",
          padding: 24,
          marginLeft: 8
        }}
      >
        <h2>Camiseta Argentina 2024</h2>
        <p className="text-muted">Camiseta oficial Selección Argentina 2024, tecnología AEROREADY.</p>
        <h4 className="text-primary mb-3">$85.000</h4>
        <form>
          <div className="mb-3">
            <label className="form-label">Talle</label>
            <select className="form-select">
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Cantidad</label>
            <input type="number" className="form-control" min="1" defaultValue="1" />
          </div>
          <button type="submit" className="btn btn-warning w-100">Agregar al carrito</button>
        </form>
      </div>
    </div>
  </div>
);

export default ProductDetail;