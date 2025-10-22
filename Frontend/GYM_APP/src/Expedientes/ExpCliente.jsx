import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExpCliente.css";
import { UrlWithApi, ENDPOINTS } from "../Service/apiConfig";
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

const ExpCliente = ({ userId, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Obtener cliente por ID
  useEffect(() => {
    if (userId == null) return;

    axios
      .get(UrlWithApi(ENDPOINTS.obtenerCliente(userId)))
      .then((res) => {
        if (res.data) {
          setUserData(res.data);
          setFormData(res.data);
        }
      })
      .catch(() => {
        setUserData(null);
        setFormData({});
      });
  }, [userId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Guardar cambios
const handleSubmit = async () => {
  onClose();
  showLoading("Modificando", "Procesando");

  try {
    const payload = {
      clientes: {
        id_Cliente: userData.id_Cliente,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        fechaNacimiento: formData.fecha_Nacimiento,
        foto: "",
        idTipoUsuario: 0,
        idMembresia: 0,
        idSucursal: 0,
        numero_Identificacion: ""
      },
      usuario: {
        idUsuario: userData.idUsuario,
        usuario: formData.usuario,
        contraseña: formData.contraseña,
        correo: formData.correo,
        idTipo: 0,
        id_Sucursal: 0
      }
    };

    const response = await axios.put(
      UrlWithApi(ENDPOINTS.actualizarCliente(userData.id_Cliente)),
      payload
    );

    const data = response.data;

    if (data.success) {
      closeLoading(true, data.Mensaje || "Actualizado correctamente");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      closeLoading(false, data.Mensaje || "Error al actualizar");
    }
  } catch (err) {
    closeLoading(false, "Error al conectarse al servidor");
  }
};

  // 🔹 Campos visibles
  const fields = [
    { label: "Nombre", name: "nombre" },
    { label: "Apellido", name: "apellido" },
    { label: "Teléfono", name: "telefono" },
    { label: "Fecha de Nacimiento", name: "fecha_Nacimiento" },
    { label: "Edad", name: "edad", readOnly: true },
    { label: "Correo Electrónico", name: "correo" },
    { label: "Membresía Activa", name: "membresia_Activa", readOnly: true },
    { label: "Usuario", name: "usuario",readOnly: true  },
    { label: "Contraseña", name: "contraseña"  },
  ];

  return (
    <div className="exp-cliente-container">
      {/* HEADER */}
      <div className="exp-cliente-header">
        <h2>Expediente de Cliente</h2>
      </div>

      {/* FOTO Y DATOS BÁSICOS */}
      <div className="exp-cliente-profile">
        <img
          src={userData?.foto || "/default-avatar.png"}
          alt={`${userData?.nombre || ""} ${userData?.apellido || ""}`}
          className="exp-profile-pic"
        />
        <div className="profile-info">
          <h3>
            {userData?.nombre || "Nombre"} {userData?.apellido || "Apellido"}
          </h3>
          <span className="membership">
            {userData?.membresia_Activa || "Sin membresía"}
          </span>
        </div>
      </div>

      {/* DATOS PERSONALES */}
      <div className={`exp-cliente-data ${isEditing ? "editing" : ""}`}>
        <h3>Datos Personales</h3>
        <div className="data-grid">
          {fields.map((field) => {
            const value = formData[field.name] ?? userData?.[field.name] ?? "";
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

      {/* BOTONES */}
      <div className="exp-actions">
        {isEditing ? (
          <>
            <button
              className="btn cancel"
              onClick={() => {
                setFormData(userData);
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

export default ExpCliente;
