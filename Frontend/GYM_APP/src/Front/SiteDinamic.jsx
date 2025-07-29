import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ IMPORTANTE
import "./SiteDinamic.css";
import FormRegUsuario from "./FormRegUsuario";


const usersData = [
  { id: "03", name: "Juan Perez", dpi: "#123-456ABC", status: "Vigente", expiration: "2025", attendance: "14/05/2025" },
  { id: "03", name: "Maria Lopez", dpi: "#123-456ABC", status: "Vencida", expiration: "2025", attendance: "14/05/2025" },
  { id: "03", name: "Ricardo Mendez", dpi: "#123-456ABC", status: "Vigente", expiration: "2025", attendance: "14/05/2025" },
];



export default function SiteDinamic() {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("isLogged"); // Elimina el estado de login
    navigate("/"); // Redirige al login
  };

  

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">🏋️‍♂️ GYM</div>
        <nav>
          <button className="active">Registrar Usuario</button>
          <button>Renovar Membresía</button>
          <button>Reportes</button>
          <button>Usuarios</button>
          <button>Settings</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout" onClick={handleLogout}>
          Cerrar Sesión
        </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="header">
          <h1>Usuarios</h1>
          <button className="add-user" onClick={() => setShowForm(true)} > 
            Añadir Usuario 
            </button>
            {/* ✅ Mostramos el formulario como modal */}
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
    </div>
  );
}
