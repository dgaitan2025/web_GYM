// src/components/Usuarios.jsx
import React, { useState } from 'react';
import FormRegUsuario from '../Formularios/FormRegUsuario'; // Asegúrate que esta ruta sea correcta
import "./VistaUsuarios.css"
const Usuarios = ({ usersData }) => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

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
              <th>ID Usuario</th>
              <th>Nombre</th>
              <th>DPI</th>
              <th>Estado Membresía</th>
              <th>Vencimiento</th>
              <th>Asistencia</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {usersData
              .filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
              .map((user, idx) => (
                <tr key={idx}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.dpi}</td>
                  <td className={user.status === "Vigente" ? "status-vigente" : "status-vencida"}>
                    {user.status}
                  </td>
                  <td>{user.expiration}</td>
                  <td>{user.attendance}</td>
                  <td>
                    <button className="edit">Editar</button>
                    {user.status === "Vencida" ? (
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
