import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpCliente.css";
import { UrlWithApiDG, ENDPOINTS } from "../Service/apiConfig"
import Swal from "sweetalert2";
import { Procesando } from "../Componente/Espera";

const { showLoading, closeLoading } = Procesando();

const Field = ({ label, name, value, onChange, isEditing, readOnly }) => (
  <div className="field">
    <label>{label}</label>
    {isEditing && !readOnly ? (
      <input type="text" name={name} value={value} onChange={onChange} placeholder="..." />
    ) : (
      <p>{value || "—"}</p>
    )}
  </div>
);



const ExpCliente = ({ userId, onClose }) => {
  const [userData, setUserData] = useState(null); // Datos obtenidos de la API
  const [formData, setFormData] = useState({});   // Datos para edición
  const [isEditing, setIsEditing] = useState(false); // Control del modo edición


  useEffect(() => {
    if (userId == null) return; // Si no hay userId, no hace nada

    axios.get(UrlWithApiDG(ENDPOINTS.optenerGrupoMuscular(userId)))
      .then(res => {
        if (res.data) {
          setUserData(res.data); // Guardar datos reales
          setFormData(res.data); // Inicializar formulario editable
        }
      })
      .catch(() => {
        // Si hay error de conexión, no se muestra mensaje, solo deja campos vacíos
        setUserData(null);
        setFormData({});
      });
  }, [userId]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    onClose();

    showLoading("Modificando", "Procesando");
    try {
      const { nombre, descripcion } = formData;

      if (!nombre?.trim() || !descripcion?.trim()) {
        closeLoading(false, "Campo Vacio");
        return;
      }

      const response = await axios.post(UrlWithApiDG(ENDPOINTS.actualizarGrupoMuscular), formData)

      const data = response.data;
      console.log(data)

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

      closeLoading(false, "Error al conectarse al Servidor");

    }
  };

  const fields = [
    { label: "Nombre", name: "nombre" },
    { label: "Descripcion", name: "descripcion" },

  ];

  return (
    <div className="exp-cliente-container">
      {/* HEADER */}
      <div className="exp-cliente-header">
        <h2>Actualizar Grupo Muscular</h2>
      </div>


      {/* DATOS PERSONALES */}
      <div className={`exp-cliente-data ${isEditing ? "editing" : ""}`}>
        <h3>Datos</h3>
        <div className="data-grid">
          {fields.map(field => {
            let value = formData[field.name] ?? userData?.[field.name] ?? "";

            return (
              <Field
                key={field.name}
                label={field.label}
                name={field.name}
                value={value}
                onChange={handleChange}
                isEditing={isEditing && !field.readOnly}
                readOnly={field.readOnly}
              />
            );
          })}
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="exp-actions">
        {isEditing ? (
          <>
            <button className="btn cancel" onClick={() => { setFormData(userData); setIsEditing(false); }}>Cancelar</button>
            <button className="btn save" onClick={handleSubmit}>Guardar</button>
          </>
        ) : (
          <button className="btn edit" onClick={() => setIsEditing(true)}>Editar</button>
        )}
      </div>
    </div>
  );
};

export default ExpCliente;