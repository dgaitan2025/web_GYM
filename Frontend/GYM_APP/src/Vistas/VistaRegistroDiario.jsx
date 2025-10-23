import React, { useEffect, useState } from "react";
import axios from "axios";
import { Procesando } from "../Componente/Espera.jsx";
import { UrlWithApi, ENDPOINTS } from "../Service/apiConfig.js";
import { decryptString } from "../Funciones/Encriptar";
import "./VistaUsuarios.css";
import { finalizarRutina } from "../Funciones/Api_asistencia.js"; // ✅ Esta es la que se debe usar

const { showLoading, closeLoading } = Procesando();

const VistaRegistroDiario = () => {
  const [registros, setRegistros] = useState([]);
  const [search, setSearch] = useState("");

  // 🔹 Cargar registros del usuario al montar
  useEffect(() => {
    const obtenerRegistros = async () => {
      const encryptedId = localStorage.getItem("IdUser");
      if (!encryptedId) {
        console.warn("⚠️ No se encontró IdUser en localStorage");
        return;
      }

      const userID = Number(decryptString(encryptedId));

      if (isNaN(userID) || userID <= 0) {
        console.warn("⚠️ ID de usuario inválido:", userID);
        return;
      }

      showLoading("Cargando registros...", "Por favor, espere");

      try {
        const response = await axios.get(
          UrlWithApi(ENDPOINTS.rutinaClienteAsig(userID))
        );
        setRegistros(response.data);
        closeLoading(true, "Registros cargados correctamente");
      } catch (error) {
        console.error("Error al obtener registros:", error);
        closeLoading(false, "Error al obtener los registros");
      }
    };

    obtenerRegistros();
  }, []);

  // ✅ Lógica para manejar el clic y enviar el id_registro
  const handleFinalizarRutina = async (idRegistro) => {
    const result = await finalizarRutina(idRegistro); // ← Usa la función importada

    if (result.success) {
      // ✅ Actualizar el estado sin recargar
      setRegistros((prev) =>
        prev.map((r) =>
          r.id_registro === idRegistro ? { ...r, completado: true } : r
        )
      );
    }
  };

  return (
    <main className="form-empleado">
      <header className="header">
        <h1>Registro Diario de Rutinas</h1>
      </header>

      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre Rutina</th>
              <th>Objetivo</th>
              <th>Comentarios</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.length > 0 ? (
              registros
                .filter((r) =>
                  r.nombreRutina.toLowerCase().includes(search.toLowerCase())
                )
                .map((r, idx) => (
                  <tr key={r.id_registro}> {/* ✅ usa id_registro como key */}
                    <td>{r.nombreRutina}</td>
                    <td>{r.objetivo}</td>
                    <td>{r.comentarios}</td>
                    <td>
                      {r.completado ? (
                        <span className="status success">Completado</span>
                      ) : (
                        <button
                          className="edit"
                          onClick={() => handleFinalizarRutina(r.id_registro)} // ✅ Envia id_registro
                        >
                          Finalizar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay registros disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default VistaRegistroDiario;
