// src/components/Usuarios.jsx
import React, { useState, useEffect } from 'react';
import FormRegUsuario from '../Formularios/FormRegUsuario'; // Asegúrate que esta ruta sea correcta
import "./VistaUsuarios.css"
import { obtenerClientes } from "../Funciones/IndexClientes";
const Usuarios = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [clientes, setClientes] = useState(null);

  useEffect(() => {
    obtenerClientes()
      .then(data => setClientes(data)) // Guardamos el JSON tal cual
      .catch(err => console.error(err));
  }, []);

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
                  u.Nombre.toLowerCase().includes(search.toLowerCase())
                )
                .map((user, idx) => (
                  <tr key={idx}>
                    <td>{user.Nombre}</td>
                    <td>{user.Numero_Identificacion}</td>
                    <td
                      className={
                        user.Estado_Membresia === "Vigente"
                          ? "status-vigente"
                          : "status-vencida"
                      }
                    >
                      {user.Estado_Membresia}
                    </td>
                    <td>
                      <button className="edit">Editar</button>
                      {user.Estado_Membresia === "Vencida" ? (
                        <button className="renew">Renovar</button>
                      ) : (
                        <button className="delete">Eliminar</button>
                      )}
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
