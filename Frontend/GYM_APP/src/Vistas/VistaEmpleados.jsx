// src/Vistas/VistaEmpleados.jsx
import React, { useState, useEffect } from 'react';
import FormRegEmpleado from '../Formularios/FormRegEmpleado'; 
import "./VistaUsuarios.css";
import { obtenerEmpleados } from "../Funciones/IndexEmpleados";
import ExpEmpleado from "../Expedientes/ExpEmpleado";

const Usuarios = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // ✅ aquí guardamos el empleado seleccionado

  useEffect(() => {
    obtenerEmpleados()
      .then(data => setClientes(data))
      .catch(err => console.error(err));
  }, []);

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
                      <button className="edit" onClick={() => setSelectedUserId(user.id_Empleado)}>
                        Editar
                      </button>
                      <button className="delete">Eliminar</button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Ahora sí usamos selectedUserId para abrir el modal */}
      {selectedUserId !== null && (
        <div className="modal3-overlay" onClick={() => setSelectedUserId(null)}>
          <div className="modal3-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-exp" onClick={() => setSelectedUserId(null)}>×</button>
            <ExpEmpleado empleadoId={selectedUserId} />
          </div>
        </div>
      )}
    </main>
  );
};

export default Usuarios;