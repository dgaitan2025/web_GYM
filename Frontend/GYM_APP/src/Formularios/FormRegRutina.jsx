import React, { useState, useRef, useEffect } from "react";
import "../Front/SiteDinamic.jsx";
import "./FormRegUsuario.css";
import { insertarRutinaMuscular} from "../Funciones/Api_grupo_muscular.js";
import { createPortal } from "react-dom";
import { Procesando } from "../Componente/Espera.jsx";


const SOLO_LETRAS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

// ---------- Helpers de validación ----------
const normalizarLetras = (v) => v.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");


// ------------------------------------------------
const { showLoading, closeLoading } = Procesando();
function Formulario({ onClose }) {

  const initialFormData = {
    nombre: "",
    descripcion: "",

  };

  const [formData, setFormData] = useState(initialFormData);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  



  // ------------ onChange con validaciones por campo ------------
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newErrors = { ...errors };

    // Nombre y Apellido
    if (name === "nombre" || name === "descripcion") {
      const limpio = normalizarLetras(value);
      setFormData((p) => ({ ...p, [name]: limpio }));
      if (!limpio.trim()) newErrors[name] = `El ${name} es obligatorio`;
      else if (!SOLO_LETRAS_REGEX.test(limpio)) newErrors[name] = `El ${name} solo puede contener letras`;
      else delete newErrors[name];
      setErrors(newErrors);
      return;
    }

  }



  // ------------ Validación global antes de submit ------------
  const validate = () => {
    const newErrors = {};

    // Nombre / Apellido
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    else if (!SOLO_LETRAS_REGEX.test(formData.nombre)) newErrors.nombre = "El nombre solo puede contener letras";

    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripcion es obligatoria";
    else if (!SOLO_LETRAS_REGEX.test(formData.descripcion)) newErrors.descripcion = "La descripcion solo puede contener letras";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------ Submit ------------
  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!validate()) return;
    onClose();
    showLoading("Registro Usuarios", "Registrando");
    try {

      const rutina = {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          estado: true,

      };

      const resultado = await insertarRutinaMuscular(rutina);
      console.log(resultado)
      if (resultado.success) {
        closeLoading(true, resultado.mensaje);
        setTimeout(() => {
      window.location.reload();
    }, 1000);
      } else {
        closeLoading(false, resultado.mensaje);

      }
    } catch (err) {
      console.error(err);
      closeLoading(false, "Error, intente mas tarde.");
    } finally {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFormData(initialFormData);
      setPreviewUrl(null);

    }
  };


  // ------------ UI ------------
  return (
    <>
      {createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <form className="formulario" onSubmit={handleSubmit}>
              <h2>Registro Grupo muscular</h2>
              <button type="button" className="cerrar-modal" onClick={onClose}>✕</button>

              <div>
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                {errors.nombre && <p className="error">{errors.nombre}</p>}
              </div>

              <div>
                <label>Descripcion:</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                />
                {errors.descripcion && <p className="error">{errors.descripcion}</p>}
              </div>
              <button type="submit" className="boton-registrar">Registrar</button>
            </form>
          </div>
        </div>,
        document.body
      )}

    </>
  );
}

export default Formulario;
