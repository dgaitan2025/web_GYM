// src/Vistas/VistaEmpleados.jsx
import React, { useState, useEffect } from 'react';
import FormRegEmpleado from '../Formularios/FormRegEmpleado'; 
import "./VistaUsuarios.css";
import { obtenerEmpleados } from "../Funciones/IndexEmpleados";
import ExpCliente from "../Expedientes/ExpEmpleado";
import { Procesando } from "../Componente/Espera.jsx";
import { UrlWithApi, ENDPOINTS } from "../Service/apiConfig";
import axios from "axios";


const Usuarios = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // ✅ aquí guardamos el empleado seleccionado
  const { showLoading, closeLoading } = Procesando();
  useEffect(() => {
    obtenerEmpleados()
      .then(data => setClientes(data))
      .catch(err => console.error(err));
  }, []);

      const eliminarEmpleado = async (id) => {
      console.log("🟡 Enviando JSON:", { Id_Rutina: id });
      showLoading("Eliminando Rutina", "Eliminando");
      try {
        // 🔄 Llamada a la API
        // ✅ Usa DELETE y ejecuta la función del endpoint
        const url = UrlWithApi(ENDPOINTS.eliminarCliente(id));
        console.log("📡 URL:", url);
  
        const response = await axios.delete(url);
  
        const data = response.data;
  
        if (data.success) {
          closeLoading(true, data.message || "Cliente eliminado con éxito");
          setTimeout(() => window.location.reload(), 1500);
        } else {
          closeLoading(false, data.message || "Error al eliminar cliente");
        }
      } catch (err) {
        console.error("Error al eliminar grupo muscular:", err);
        closeLoading(false, "Error al conectarse al Servidor");
      }
    };

  return (
    <main className="form-empleado">
      <header className="header">
        <h1>Empleados</h1>
        <button className="add-user" onClick={() => setShowForm(true)}>
          Añadir Empleado
        </button>

        {showForm && <FormRegEmpleado onClose={() => setShowForm(false)} />}
      </header>

      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>DPI</th>
              <th>Sucursal</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes &&
              clientes
                .filter((u) =>
                  u.nombre.toLowerCase().includes(search.toLowerCase())
                )
                .map((user, idx) => (
                  <tr key={idx}>
                    <td>{user.nombre}</td>
                    <td>{user.numero_Identificacion}</td>
                    <td>{user.sucursal}</td>
                    <td>
                      <button className="edit" onClick={() => setSelectedUserId(user.id_Usuario)}>
                        Editar
                      </button>
                      <button className="delete" onClick={() => eliminarEmpleado(user.id_Usuario)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Ahora sí usamos selectedUserId para abrir el modal */}
      {selectedUserId !== null && (
        <div className="modal2-overlay" onClick={() => setSelectedUserId(null)}>
          <div className="modal2-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-exp" onClick={() => setSelectedUserId(null)}>×</button>
            <ExpCliente userId={selectedUserId} onClose={() => setSelectedUserId(null)} /> 
          </div>
        </div>
      )}
    </main>
  );
};

export default Usuarios;