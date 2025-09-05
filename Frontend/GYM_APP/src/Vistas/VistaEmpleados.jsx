// src/components/Usuarios.jsx
import React, { useState, useEffect } from 'react';
import FormRegEmpleado from '../Formularios/FormRegEmpleado'; // Asegúrate que esta ruta sea correcta
import "./VistaUsuarios.css"
import { obtenerEmpleados } from "../Funciones/IndexEmpleados";

const Usuarios = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState(null);

  useEffect(() => {
    obtenerEmpleados()
      .then(data => setClientes(data)) // Guardamos el JSON tal cual
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
                    <td>{user.sucursal}
                    </td>
                    <td>
                      <button className="edit">Editar</button>
                      <button className="delete">Eliminar</button>
                      
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Usuarios;
