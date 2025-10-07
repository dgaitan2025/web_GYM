import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpCliente.css";





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

  /* --------------------------
     Mapas para mostrar nombres legibles
     - membershipNames: mapea idMembresia a texto
     - userTypeNames: mapea idTipoUsuario a texto
     - branchNames: mapea idSucursal a texto
  -------------------------- */
  const membershipNames = { 1: "Básica", 2: "Estándar", 3: "Premium", 7: "VIP" };
  const userTypeNames = { 1: "Cliente", 2: "Administrador", 3: "Instructor" };
  const branchNames = { 1: "Sucursal Centro", 2: "Sucursal Norte", 3: "Sucursal Sur" };

  /* ================================
     useEffect para obtener datos del usuario
     ----------------
     - Hace un GET a /api/users/:userId
     - Si hay datos, los almacena en userData y formData
     - Si no hay datos o hay error, deja los campos vacíos
  ================================= */
  useEffect(() => {
    console.log(userId)
    if (!userId) return; // Si no hay userId, no hace nada

    axios.get(`/api/users/${userId}`)
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

  /* ================================
     handleChange
     ----------------
     - Se llama al cambiar un input
     - Actualiza formData en tiempo real
  ================================= */
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================================
     handleSubmit
     ----------------
     - Envía los datos editados al backend
     - Hace PUT a /api/users/:userId
     - Actualiza userData con la respuesta
  ================================= */
  const handleSubmit = () => {
    axios.put(`/api/users/${userId}`, formData)
      .then(res => {
        setUserData(res.data);
        setIsEditing(false); // Sale del modo edición
      })
      .catch(() => {
        // En caso de error, por ahora no se muestra mensaje
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
    { label: "Apellido", name: "apellido" },
    { label: "Teléfono", name: "telefono" },
    { label: "Fecha de Nacimiento", name: "fechaNacimiento" },
    { label: "Correo", name: "correo" },
    { label: "Número de Identificación", name: "numero_Identificacion" },
    { label: "Tipo de Usuario", name: "idTipoUsuario", readOnly: true },
    { label: "Sucursal", name: "idSucursal", readOnly: true },
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
        <h2>Expediente de Cliente</h2>
      </div>

      {/* FOTO Y MEMBRESÍA */}
      <div className="exp-cliente-profile">
        <img
          src={userData?.foto || "/default-avatar.png"} // Foto de usuario o default
          alt={`${userData?.nombre || ""} ${userData?.apellido || ""}`}
          className="exp-profile-pic"
        />
        <div className="profile-info">
          <h3>{userData?.nombre || "Nombre"} {userData?.apellido || "Apellido"}</h3>
          <span className="membership">
            {membershipNames[userData?.idMembresia] || "Sin membresía"}
          </span>
        </div>
      </div>

      {/* DATOS PERSONALES */}
      <div className={`exp-cliente-data ${isEditing ? "editing" : ""}`}>
        <h3>Datos Personales</h3>
        <div className="data-grid">
          {fields.map(field => {
            let value = formData[field.name] || userData?.[field.name];

            // Convertir IDs a nombres legibles
            if (field.name === "idTipoUsuario") value = userTypeNames[value] || "";
            if (field.name === "idSucursal") value = branchNames[value] || "";

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
            <button className="btn cancel" onClick={() => setIsEditing(false)}>Cancelar</button>
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