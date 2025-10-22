// src/Vistas/VistaEnConstruccion.jsx
import React from "react";
import "./VistaInicioComun.css";

const VistaEnConstruccion = () => {
  return (
    <main className="main construccion-container">
      <div className="construccion-content">
        <img
          src="/fit.jpg" // o usa una URL externa
          alt="En construcción"
          className="construccion-img"
        />
        <h2>Tu espacio para mantenerte en forma, saludable y motivado.</h2>
      </div>
    </main>
  );
};

export default VistaEnConstruccion;
