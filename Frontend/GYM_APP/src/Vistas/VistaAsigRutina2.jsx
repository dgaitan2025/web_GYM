// src/components/Usuarios.jsx
import React, { useState, useEffect } from 'react';
import FormRegUsuario from '../Formularios/FormRegRutina.jsx'; // Asegúrate que esta ruta sea correcta
import "./VistaAsigRutina.css"
import ExpGrupoMuscular from "../Expedientes/ExpGrupoMuscular.jsx"; // Cambio Agregado Exp
import { useGrupoMuscular } from "../Funciones/Api_rutinas.js"
import axios from "axios";
import { UrlWithApiDG, ENDPOINTS } from "../Service/apiConfig.js"
import { Procesando } from "../Componente/Espera.jsx";

const { showLoading, closeLoading } = Procesando();

const Usuarios = () => {
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null); // Cambio Agregado Exp
    const { grupoMuscular } = useGrupoMuscular();

    const handleSubmit = async (id) => {
        showLoading("Eliminando Grupo Muscular", "Eliminando");
        try {
            // 🔄 Llamada a la API
            const response = await axios.post(
                UrlWithApiDG(ENDPOINTS.elimindarGrupoMuscular),
                { id_Grupo: id }
            );

            const data = response.data; // <- { success: true, mensaje: "Eliminado correctamente" }

            if (data.success) {
                // ✅ Éxito: mostrar mensaje y refrescar
                closeLoading(true, data.mensaje);

                // 🔁 Refrescar lista después de 1.5 segundos
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                // ⚠ Error controlado desde el backend
                closeLoading(false, data.mensaje);
            }
        } catch (err) {
            console.error("Error al eliminar grupo muscular:", err);
            closeLoading(false, "Error al conectarse al Servidor");
        }
    };

    return (
        <main className="main">
            <header className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                <h1>Gestionar Rutinas</h1>

                <div className="d-flex flex-wrap gap-2">
                    <button className="add-user" onClick={() => setShowForm(true)}>
                        Añadir
                    </button>

                </div>
                {showForm && <FormRegUsuario onClose={() => setShowForm(false)} />}
            </header>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Buscar nombre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grupoMuscular &&
                            grupoMuscular
                                .filter((u) =>
                                    u.nombre.toLowerCase().includes(search.toLowerCase())
                                )
                                .map((grupo, idx) => (
                                    <tr key={idx}>
                                        <td>{grupo.nombre}</td>
                                        <td>{grupo.descripcion}</td>

                                        <td>
                                            {/*<button className="edit">Editar</button>*/}
                                            <button className="edit" onClick={() => setSelectedUserId(grupo.id_Grupo)}>
                                                Editar
                                            </button>
                                            <button className="delete" onClick={() => handleSubmit(grupo.id_Grupo)}>Eliminar</button>

                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </div>
            {/* Cambios para modal de expediente */}
            {selectedUserId !== null && (
                <div className="modal-overlay" onClick={() => setSelectedUserId(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <ExpGrupoMuscular userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
                        <button className="close-exp" onClick={() => setSelectedUserId(null)}>
                            &times;
                        </button>
                    </div>
                </div>
            )}


        </main>
    );
};

export default Usuarios;
