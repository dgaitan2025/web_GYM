import React, { useState, useEffect } from "react";
import "../Front/SiteDinamic.jsx";
import "./FormRegUsuario.css";
import { insertarRutina } from "../Funciones/Api_rutinas.js";
import { createPortal } from "react-dom";
import { Procesando } from "../Componente/Espera.jsx";
import { UrlWithApiDG, ENDPOINTS } from "../Service/apiConfig.js";

const SOLO_LETRAS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const normalizarLetras = (v) => v.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");

const { showLoading, closeLoading } = Procesando();

function Formulario({ onClose }) {
  const initialFormData = {
    nombre: "",
    descripcion: "",
    objetivo: "",
    grupoMuscular: "",
    rutinaAsociada: "",
  };

  const [grupos, setGrupos] = useState([]);
  const [rutinas, setRutinas] = useState([]); // ← Rutinas asociadas al grupo seleccionado
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // 🔹 Cargar grupos musculares al montar
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch(UrlWithApiDG(ENDPOINTS.listarGrupoMuscular));
        const data = await response.json();
        setGrupos(data);
      } catch (error) {
        console.error("Error al cargar grupos musculares:", error);
      }
    };
    fetchGrupos();
  }, []);

  // 🔹 Cargar rutinas cuando cambia el grupo muscular
  useEffect(() => {
    const fetchRutinas = async () => {
      if (!formData.grupoMuscular) return;

      try {
        const response = await fetch(
          UrlWithApiDG(`${ENDPOINTS.rutinasPorGrupo}/${formData.grupoMuscular}`)
        );
        const data = await response.json();

        if (data.success) {
          setRutinas(data.data); // ✅ guarda las rutinas obtenidas
        } else {
          setRutinas([]); // limpia si no hay resultados
        }
      } catch (error) {
        console.error("Error al cargar rutinas:", error);
        setRutinas([]);
      }
    };

    fetchRutinas();
  }, [formData.grupoMuscular]);

  // ------------ onChange con validaciones por campo ------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (name === "nombre" || name === "descripcion" || name === "objetivo") {
      const limpio = normalizarLetras(value);
      setFormData((p) => ({ ...p, [name]: limpio }));
      if (!limpio.trim()) newErrors[name] = `El ${name} es obligatorio`;
      else if (!SOLO_LETRAS_REGEX.test(limpio))
        newErrors[name] = `El ${name} solo puede contener letras`;
      else delete newErrors[name];
      setErrors(newErrors);
      return;
    }

    if (name === "grupoMuscular") {
      setFormData((p) => ({
        ...p,
        grupoMuscular: value,
        rutinaAsociada: "", // reiniciar selección
      }));
      delete newErrors.grupoMuscular;
      setErrors(newErrors);
      return;
    }

    if (name === "rutinaAsociada") {
      setFormData((p) => ({ ...p, rutinaAsociada: value }));
      return;
    }
  };

  // ------------ Validación global antes de submit ------------
  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim())
      newErrors.nombre = "El nombre es obligatorio";
    else if (!SOLO_LETRAS_REGEX.test(formData.nombre))
      newErrors.nombre = "El nombre solo puede contener letras";

    if (!formData.descripcion.trim())
      newErrors.descripcion = "La descripción es obligatoria";
    else if (!SOLO_LETRAS_REGEX.test(formData.descripcion))
      newErrors.descripcion = "La descripción solo puede contener letras";

    if (!formData.objetivo.trim())
      newErrors.objetivo = "El objetivo es obligatorio";
    else if (!SOLO_LETRAS_REGEX.test(formData.objetivo))
      newErrors.objetivo = "El objetivo solo puede contener letras";

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
    showLoading("Registro Rutina", "Registrando...");

    try {
      const rutina = {
        Nombre: formData.nombre,
        Descripcion: formData.descripcion,
        Objetivo: formData.objetivo,
        Id_Grupo: parseInt(formData.grupoMuscular),
        estado: true,
      };

      const resultado = await insertarRutina(rutina);
      if (resultado.success) {
        closeLoading(true, resultado.mensaje);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        closeLoading(false, resultado.mensaje);
      }
    } catch (err) {
      console.error(err);
      closeLoading(false, "Error, intente más tarde.");
    } finally {
      setFormData(initialFormData);
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
              <button type="button" className="cerrar-modal" onClick={onClose}>
                ✕
              </button>

              {/* 🔹 Grupo muscular */}
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

              {/* 🔹 Rutinas asociadas */}
              {rutinas.length > 0 && (
                <div>
                  <label>Rutinas asociadas:</label>
                  <select
                    name="rutinaAsociada"
                    value={formData.rutinaAsociada}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione una rutina</option>
                    {rutinas.map((r) => (
                      <option key={r.id_Rutina} value={r.id_Rutina}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 🔹 Campos de texto */}
              <div>
                <label>Repeticiones</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                {errors.nombre && <p className="error">{errors.nombre}</p>}
              </div>

              <button type="submit" className="boton-registrar">
                Registrar
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default Formulario;
