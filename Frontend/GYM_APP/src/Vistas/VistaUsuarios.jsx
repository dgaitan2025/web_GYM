// src/components/Usuarios.jsx
import React, { useState, useEffect } from 'react';
import FormRegUsuario from '../Formularios/FormRegUsuario'; // Asegúrate que esta ruta sea correcta
import "./VistaUsuarios.css"
import { obtenerClientes, eliminarCliente } from "../Funciones/IndexClientes";
import ExpCliente from "../Expedientes/ExpCliente"; // Cambio Agregado Exp
import ModalRenovarMembresia from "../Componente/crearOrden";
import axios from "axios";
import { Procesando } from "../Componente/Espera.jsx";
import { UrlWithApi, ENDPOINTS } from "../Service/apiConfig"

const { showLoading, closeLoading } = Procesando();


const Usuarios = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // Cambio Agregado Exp

  const [showRenewModal, setShowRenewModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const handleOpenRenewModal = (cliente) => {
    setClienteSeleccionado(cliente);
    setShowRenewModal(true);
  };

  useEffect(() => {
    obtenerClientes()
      .then(data => setClientes(data)) // Guardamos el JSON tal cual
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (id) => {
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
    <main className="main">
      <header className="header">
        <h1>Usuarios</h1>
        <button className="add-user" onClick={() => setShowForm(true)}>
          Añadir Usuario
        </button>

        {showForm && <FormRegUsuario onClose={() => setShowForm(false)} />}
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
              <th>Estado Membresía</th>
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
                    <td
                      className={
                        user.estado_Membresia === "Vigente"
                          ? "status-vigente"
                          : "status-vencida"
                      }
                    >
                      {user.estado_Membresia}
                    </td>
                    <td>
                      {/*<button className="edit">Editar</button>*/}
                      <button className="edit" onClick={() => setSelectedUserId(user.id_Cliente)}>
                        Editar
                      </button>
                      {user.estado_Membresia === "Vencida" && (
                        <>
                          <button className="renew" onClick={() => handleOpenRenewModal(user)}>Renovar</button>
                          <button className="delete" onClick={() => handleSubmit(user.id_Cliente)}>Eliminar</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {/* Cambios para modal de expediente */}
      {selectedUserId !== null && (
        <div className="modal2-overlay" onClick={() => setSelectedUserId(null)}>
          <div className="modal2-content" onClick={(e) => e.stopPropagation()}>
            <ExpCliente userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
            <button className="close-exp" onClick={() => setSelectedUserId(null)}>
              &times;
            </button>
          </div>
        </div>
      )}

      <ModalRenovarMembresia
        visible={showRenewModal}
        cliente={clienteSeleccionado}
        onClose={() => setShowRenewModal(false)}
      />


    </main>


  );


};

export default Usuarios;
