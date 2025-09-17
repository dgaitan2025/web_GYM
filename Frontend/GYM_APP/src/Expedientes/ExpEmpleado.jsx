import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpEmpleado.css";

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

const ExpEmpleado = ({ empleadoId }) => {
  const [empleadoData, setEmpleadoData] = useState(null); // Datos obtenidos de la API
  const [formData, setFormData] = useState({});   // Datos para edición
  const [isEditing, setIsEditing] = useState(false); // Control del modo edición

  const branchNames = { 1: "Sucursal Centro", 2: "Sucursal Norte", 3: "Sucursal Sur" };
  const roleNames = { 1: "Administrador", 2: "Instructor", 3: "Recepcionista" };

  useEffect(() => {
    if (!empleadoId) return; // Si no hay empleadoId, no hace nada

    axios.get(`/api/empleados/${empleadoId}`)
      .then(res => {
        if (res.data) {
          setEmpleadoData(res.data); // Guardar datos reales
          setFormData(res.data); // Inicializar formulario editable
        }
      })
      .catch(() => {
        // Si hay error de conexión, no se muestra mensaje, solo deja campos vacíos
        setEmpleadoData(null);
        setFormData({});
      });
  }, [empleadoId]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    axios.put(`/api/empleados/${empleadoId}`, formData)
      .then(res => {
        setEmpleadoData(res.data);
        setIsEditing(false); // Sale del modo edición
      })
      .catch(() => {
        // En caso de error, por ahora no se muestra mensaje
      });
  };

   const fields = [
    { label: "Nombre", name: "nombre" },
    { label: "Apellido", name: "apellido" },
    { label: "Teléfono", name: "telefono" },
    { label: "Correo", name: "correo" },
    { label: "Rol", name: "idRol", readOnly: true },
    { label: "Sucursal", name: "idSucursal", readOnly: true },
  ];



  return (
    <div className="exp-cliente-container">
      {/* HEADER */}
      <div className="exp-cliente-header">
        <h2>Expediente de Empleado</h2>
      </div>

      {/* FOTO Y MEMBRESÍA */}
      <div className="exp-cliente-profile">
        <img
          src={empleadoData?.foto || "/default-avatar.png"} // Foto de usuario o default
          alt={`${empleadoData?.nombre || ""} ${empleadoData?.apellido || ""}`}
          className="exp-profile-pic"
        />
        <div className="profile-info">
          <h3>{empleadoData?.nombre || "Nombre"} {empleadoData?.apellido || "Apellido"}</h3>
          <span className="membership">
            {roleNames[empleadoData?.idRol] || "Sin rol asignado"}
          </span>
        </div>
      </div>

      {/* DATOS PERSONALES */}
      <div className={`exp-cliente-data ${isEditing ? "editing" : ""}`}>
        <h3>Datos del Empleado</h3>
        <div className="data-grid">
          {fields.map(field => {
            let value = formData[field.name] || empleadoData?.[field.name];

            // Convertir IDs a nombres legibles
            if (field.name === "idRol") value = roleNames[value] || "";
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

export default ExpEmpleado;