import React from 'react';

const Home = () => (
  <div className="container py-5">
    <div className="row mb-4">
      <div className="col text-center">
        <h1 className="display-4">Bienvenido a TodoSport</h1>
        <p className="lead">Tu tienda deportiva online</p>
      </div>
    </div>
    <div className="row">
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <img src="https://essential.vtexassets.com/arquivos/ids/1515816-1200-auto?v=638821480754000000&width=1200&height=auto&aspect=true" className="card-img-top" alt="Producto 1" />
          <div className="card-body">
            <h5 className="card-title">Camiseta River Plate</h5>
            <p className="card-text">Camiseta oficial temporada 24/25.</p>
            <button className="btn btn-primary w-100">Ver más</button>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <img src="https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c4c8dee7623f4209b76dfd333a68c812_9366/Camiseta_Titular_Argentina_24_Blanco_IP8400_01_laydown.jpg" className="card-img-top" alt="Producto 2" />
          <div className="card-body">
            <h5 className="card-title">Camiseta Argentina</h5>
            <p className="card-text">Camiseta oficial Selección 2024.</p>
            <button className="btn btn-primary w-100">Ver más</button>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <img src="https://http2.mlstatic.com/D_NQ_NP_2X_858857-MLA51805973209_102022-F.webp" className="card-img-top" alt="Producto 3" />
          <div className="card-body">
            <h5 className="card-title">Conjunto Nike</h5>
            <p className="card-text">Conjunto deportivo Nike hombre.</p>
            <button className="btn btn-primary w-100">Ver más</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;