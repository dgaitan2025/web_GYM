// src/Vistas/VistaEnConstruccion.jsx
import React from "react";
import "./VistaEnConstruccion.css";

const VistaEnConstruccion = () => {
  return (
    <main className="main construccion-container">
      <div className="construccion-content">
        <img
          src="/Pagina-en-construccion.jpg" // o usa una URL externa
          alt="En construcción"
          className="construccion-img"
        />
        <h2>Esta sección está en construcción</h2>
      </div>
    </main>
  );
};

export default VistaEnConstruccion;
