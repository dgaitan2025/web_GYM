import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpCliente.css"; // Puedes mantener el mismo CSS
import { UrlWithApiDG, ENDPOINTS } from "../Service/apiConfig";
import { Procesando } from "../Componente/Espera";

const { showLoading, closeLoading } = Procesando();

const Field = ({ label, name, value, onChange, isEditing, readOnly }) => (
  <div className="field">
    <label>{label}</label>
    {isEditing && !readOnly ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="..."
      />
    ) : (
      <p>{value || "—"}</p>
    )}
  </div>
);

const ExpRutina = ({ rutinaId, onClose }) => {
  const [rutinaData, setRutinaData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Cargar datos de la rutina seleccionada
  useEffect(() => {
    if (rutinaId == null) return;

    axios
      .get(UrlWithApiDG(ENDPOINTS.obtenerRutina(rutinaId)))
      .then((res) => {
        if (res.data) {
          setRutinaData(res.data);
          setFormData(res.data);
        }
      })
      .catch(() => {
        setRutinaData(null);
        setFormData({});
      });
  }, [rutinaId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Guardar cambios
  const handleSubmit = async () => {
    onClose();
    showLoading("Actualizando", "Procesando cambios...");

    try {
      const { nombre, descripcion, objetivo } = formData;

      if (!nombre?.trim() || !descripcion?.trim() || !objetivo?.trim()) {
        closeLoading(false, "Todos los campos son obligatorios");
        return;
      }

      const response = await axios.post(
        UrlWithApiDG(ENDPOINTS.actualizarRutina),
        formData
      );

      const data = response.data;
      console.log("Respuesta API:", data);

      if (data.success) {
        closeLoading(true, data.mensaje || "Rutina actualizada correctamente");

        setTimeout(() => window.location.reload(), 1500);
      } else {
        closeLoading(false, data.mensaje || "Error al actualizar rutina");
      }
    } catch (err) {
      console.error(err);
      closeLoading(false, "Error al conectarse con el servidor");
    }
  };

  const fields = [
    { label: "Nombre", name: "nombre" },
    { label: "Descripción", name: "descripcion" },
    { label: "Objetivo", name: "objetivo" },
    
  ];

  return (
    <div className="exp-cliente-container">
      <div className="exp-cliente-header">
        <h2>Actualizar Rutina</h2>
      </div>

      <div className={`exp-cliente-data ${isEditing ? "editing" : ""}`}>
        <h3>Datos de la Rutina</h3>
        <div className="data-grid">
          {fields.map((field) => {
            let value = formData[field.name] ?? rutinaData?.[field.name] ?? "";

            return (
              <Field
                key={field.name}
                label={field.label}
                name={field.name}
                value={value}
                onChange={handleChange}
                isEditing={isEditing}
                readOnly={field.readOnly}
              />
            );
          })}
        </div>
      </div>

      <div className="exp-actions">
        {isEditing ? (
          <>
            <button
              className="btn cancel"
              onClick={() => {
                setFormData(rutinaData);
                setIsEditing(false);
              }}
            >
              Cancelar
            </button>
            <button className="btn save" onClick={handleSubmit}>
              Guardar
            </button>
          </>
        ) : (
          <button className="btn edit" onClick={() => setIsEditing(true)}>
            Editar
          </button>
        )}
      </div>
    </div>
  );
};

export default ExpRutina;
