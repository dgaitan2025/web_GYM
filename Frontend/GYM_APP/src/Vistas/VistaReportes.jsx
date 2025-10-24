import React, { useState, useMemo } from "react";
import "./VistaReportes.css";
import { Procesando } from "../Componente/Espera.jsx";
import { decryptString } from "../Funciones/Encriptar";
import { descargarReporteClientes } from "../Funciones/Api_reportes.js";
import { ENDPOINTS } from "../Service/apiConfig.js";

const { showLoading, closeLoading } = Procesando();

const VistaReportes = () => {
  const [search, setSearch] = useState("");
  const role = Number(decryptString(localStorage.getItem("tipoUser")));

  // 🔹 Reportes con roles permitidos
  const reportesDisponibles = [
  { id: 1, nombre: "Clientes activos", roles: [1, 2], endpoint: ENDPOINTS.reporteClientes },
  { id: 2, nombre: "Asistencia Por Cliente", roles: [1], endpoint: ENDPOINTS.reporteAsistenciaPorCliente },
  { id: 3, nombre: "Porcentaje de Asistencia por Cliente", roles: [1, 2], endpoint: ENDPOINTS.reportePorcentajeAsistencia },
  { id: 4, nombre: "Rutinas por asistencia", roles: [1], endpoint: ENDPOINTS.reporteRutinasAsistencia },
  { id: 5, nombre: "Ingresos por Cliente", roles: [1], endpoint: ENDPOINTS.reporteIngresosPorCliente },
  { id: 6, nombre: "Ingresos por Fecha", roles: [1], endpoint: ENDPOINTS.reporteIngresosPorFecha },
];

  // 🔹 Filtrar según el rol del usuario
  const reportes = useMemo(() => {
    if (!role) return [];
    return reportesDisponibles.filter((r) => !r.roles || r.roles.includes(role));
  }, [role]);

  // 🔹 Función para descargar reporte
  const handleDescargar = async (reporte) => {
    showLoading("Generando reporte...", "Espere un momento");

    try {
        await descargarReporteClientes(reporte.nombre, reporte.endpoint);
      closeLoading(true, "Reporte generado correctamente");
    } catch (error) {
      console.error(error);
      closeLoading(false, "Error al generar el reporte");
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
                      onClick={() => handleDescargar(rep)}
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

export default VistaReportes;
