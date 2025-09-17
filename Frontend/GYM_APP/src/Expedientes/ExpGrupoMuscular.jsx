import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpCliente.css";
import { UrlWithApiDG, ENDPOINTS } from "../Service/apiConfig"
/* ================================
   Componente Field
   ----------------
   - Representa un campo del formulario de datos personales.
   - Si está en modo edición (isEditing) y no es de solo lectura (readOnly),
     se muestra un input editable.
   - Si no, se muestra un <p> con el valor actual.
   - El placeholder "..." se usa si el campo está vacío.
================================ */
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

/* ================================
   Componente principal: ExpCliente
   ----------------
   Props:
   - userId: ID del usuario que se quiere mostrar.
   
   Estado:
   - userData: almacena los datos reales del usuario desde backend.
   - formData: almacena los datos editables para edición de formulario.
   - isEditing: controla si se está en modo edición.
================================ */
const ExpCliente = ({ userId }) => {
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

  const handleSubmit = () => {
    axios.post(UrlWithApiDG(ENDPOINTS.actualizarGrupoMuscular), formData)
      .then(res => {
        setUserData(res.data);   // refresca datos con la respuesta
        setIsEditing(false);     // sale del modo edición
      })
      .catch((err) => {
        console.error("Error al actualizar grupo muscular:", err);
      });
  };

  /* ================================
     Campos a mostrar en la UI
     ----------------
     - Algunos campos son de solo lectura (readOnly)
     - Otros se pueden editar
  ================================= */
  const fields = [
    { label: "Nombre", name: "nombre" },
    { label: "Descripcion", name: "descripcion" },

  ];

  /* ================================
     Render principal
     - Siempre se renderiza la UI aunque userData sea null
     - Los campos vacíos muestran placeholders o "—"
  ================================= */
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
            let value = formData[field.name] || userData?.[field.name];

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