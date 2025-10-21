import React, { useState, useRef, useEffect } from "react";
import "../Front/SiteDinamic.jsx";
import "./FormRegUsuario.css";
import { insertarRutina } from "../Funciones/Api_rutinas.js";
import { createPortal } from "react-dom";
import { Procesando } from "../Componente/Espera.jsx";
import { UrlWithApiDG, ENDPOINTS } from "../Service/apiConfig.js";


const SOLO_LETRAS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

// ---------- Helpers de validación ----------
const normalizarLetras = (v) => v.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");


// ------------------------------------------------
const { showLoading, closeLoading } = Procesando();
function Formulario({ onClose }) {

  const initialFormData = {
    nombre: "",
    descripcion: "",
    objetivo: "",
    grupoMuscular: "",

  };

  const [grupos, setGrupos] = useState([]);
  // 🔹 Consultar API al montar
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        // ⚠️ cambia la URL a tu endpoint real
        const response = await fetch(UrlWithApiDG(ENDPOINTS.listarGrupoMuscular));
        const data = await response.json();
        setGrupos(data);
      } catch (error) {
        console.error("Error al cargar grupos musculares:", error);
      }
    };
    fetchGrupos();
  }, []);

  const [formData, setFormData] = useState(initialFormData);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});




  // ------------ onChange con validaciones por campo ------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    // Nombre y Apellido
    if (name === "nombre" || name === "descripcion" || name === "objetivo") {
      const limpio = normalizarLetras(value);
      setFormData((p) => ({ ...p, [name]: limpio }));
      if (!limpio.trim()) newErrors[name] = `El ${name} es obligatorio`;
      else if (!SOLO_LETRAS_REGEX.test(limpio)) newErrors[name] = `El ${name} solo puede contener letras`;
      else delete newErrors[name];
      setErrors(newErrors);
      return;
    }

    if (name === "grupoMuscular") {
      setFormData((p) => ({ ...p, grupoMuscular: value }));
      delete newErrors.grupoMuscular;
      setErrors(newErrors);
      return
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

    if (!formData.objetivo.trim()) newErrors.objetivo = "El objetivo es obligatorio";
    else if (!SOLO_LETRAS_REGEX.test(formData.objetivo)) newErrors.objetivo = "El objetivo solo puede contener letras";

    if (!formData.grupoMuscular.trim())
      newErrors.grupoMuscular = "Debes seleccionar un grupo muscular";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------ Submit ------------
  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!validate()) return;
    onClose();
    showLoading("Registro Rutina", "Registrando");
    try {

      const rutina = {
        Nombre: formData.nombre,
        Descripcion: formData.descripcion,
        Objetivo: formData.objetivo,
        Id_Grupo: parseInt(formData.grupoMuscular),
        estado: true
      };
      console.log(rutina)

      const resultado = await insertarRutina(rutina);
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
              <h2>Registro Rutina</h2>
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

              <div>
                <label>Objetivo:</label>
                <input
                  type="text"
                  name="objetivo"
                  value={formData.objetivo}
                  onChange={handleChange}
                  required
                />
                {errors.objetivo && <p className="error">{errors.objetivo}</p>}
              </div>

              <div>
                <label>Grupo Muscular:</label>
                <select
                  name="grupoMuscular"
                  value={formData.grupoMuscular}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un grupo muscular</option>
                  {grupos.map((g) => (
                    <option key={g.id_Grupo} value={g.id_Grupo}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
                {errors.grupoMuscular && (
                  <p className="error">{errors.grupoMuscular}</p>
                )}
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
