import React, { useState, useEffect } from "react";
import "./VistaReportes.css";
import { Procesando } from "../Componente/Espera.jsx";
import axios from "axios";
import { UrlWithApiDG, ENDPOINTS } from "../Service/apiConfig.js";
import { descargarReporteClientes } from "../Funciones/Api_reportes.js";

const { showLoading, closeLoading } = Procesando();

const Reportes = () => {
  const [reportes, setReportes] = useState([]);
  const [search, setSearch] = useState("");


  // 🔹 Cargar tipos de reporte disponibles (ejemplo: desde API o estáticos)
  useEffect(() => {
    // Puedes reemplazar esto con un GET a tu API si lo deseas
    setReportes([
      { id: 1, nombre: "Clientes activos" },
      { id: 2, nombre: "Membresías vencidas" },
      { id: 3, nombre: "Rutinas por cliente" },
      { id: 4, nombre: "Ingresos mensuales" },
    ]);
  }, []);

  // 🔹 Función para descargar reporte
  const handleDescargar = async (id) => {
    showLoading("Generando reporte...", "Espere un momento");
    if (id === 1){
      descargarReporteClientes()
    }
  };

  return (
    <main className="main">
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h1>Descargar Reportes</h1>

       
      </header>

    

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre del Reporte</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes
              .filter((r) =>
                r.nombre.toLowerCase().includes(search.toLowerCase())
              )
              .map((rep) => (
                <tr key={rep.id}>
                  <td>{rep.nombre}</td>
                  <td>
                    <button
                      className="download"
                      onClick={() => handleDescargar(rep.id)}
                    >
                      📄 Descargar PDF
                    </button>
                    
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Reportes;
