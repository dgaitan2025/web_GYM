import React, { useState, useEffect } from "react";
import "../Front/SiteDinamic.jsx";
import "./FormRegUsuario.css";
import { insertarRutina } from "../Funciones/Api_rutinas.js";
import { createPortal } from "react-dom";
import { Procesando } from "../Componente/Espera.jsx";
import { UrlWithApiDG, ENDPOINTS } from "../Service/apiConfig.js";
import { obtenerAsistenciasDelDia } from "../Funciones/Api_asistencia.js";
import { crearRegistroDiario } from "../Funciones/Api_asistencia.js"



const SOLO_LETRAS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const normalizarLetras = (v) => v.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");

const { showLoading, closeLoading } = Procesando();

function Formulario({ onClose }) {


  //asistencia del dia

const [usuariosDia, setUsuariosDia] = useState([]);

// 🔹 Cargar usuarios con asistencia del día
useEffect(() => {
  const cargarUsuarios = async () => {
    const data = await obtenerAsistenciasDelDia();
    setUsuariosDia(data);
  };
  cargarUsuarios();
}, []);
  const initialFormData = {
    nombre: "",
    descripcion: "",
    objetivo: "",
    grupoMuscular: "",
    rutinaAsociada: "",
    usuarioAsistencia: "",
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
  const LETRAS_NUMEROS_REGEX = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]+$/;
  const handleChange = (e) => {
  const { name, value } = e.target;
  const newErrors = { ...errors };

  // 🔹 Campo nombre
  if (name === "nombre") {
    setFormData((p) => ({ ...p, [name]: value }));

    if (!value.trim()) newErrors[name] = "El campo es obligatorio";
    else if (!LETRAS_NUMEROS_REGEX.test(value))
      newErrors[name] = "Solo se permiten letras y números";
    else delete newErrors[name];

    setErrors(newErrors);
    return;
  }

  // 🔹 Campo descripción
  if (name === "descripcion") {
    setFormData((p) => ({ ...p, [name]: value }));

    if (!value.trim()) newErrors[name] = "El campo descripción es obligatorio";
    else delete newErrors[name];

    setErrors(newErrors);
    return;
  }

  // 🔹 Campo repeticiones
  if (name === "repeticiones") {
    const rep = Number(value);
    setFormData((p) => ({ ...p, repeticiones: rep }));

    if (!rep || rep <= 0) newErrors[name] = "Debe ingresar al menos 1 repetición";
    else delete newErrors[name];

    setErrors(newErrors);
    return;
  }

  // 🔹 Otros campos existentes...
  if (name === "grupoMuscular") {
    setFormData((p) => ({
      ...p,
      grupoMuscular: value,
      rutinaAsociada: "",
    }));
    delete newErrors.grupoMuscular;
    setErrors(newErrors);
    return;
  }

  if (name === "rutinaAsociada") {
    setFormData((p) => ({ ...p, rutinaAsociada: value }));
    return;
  }

  if (name === "usuarioAsistencia") {
    setFormData((p) => ({ ...p, usuarioAsistencia: Number(value) }));
    delete newErrors.usuarioAsistencia;
    setErrors(newErrors);
    return;
  }
};


  // ------------ Validación global antes de submit ------------
  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim())
      newErrors.nombre = "El nombre es obligatorio";
    else if (!LETRAS_NUMEROS_REGEX.test(formData.nombre))
      newErrors.nombre = "El nombre solo puede contener letras";

    if (!formData.grupoMuscular.trim())
      newErrors.grupoMuscular = "Debes seleccionar un grupo muscular";

    if (!formData.rutinaAsociada.trim())
      newErrors.rutinaAsociada = "Debes seleccionar una Rutina";

    setErrors(newErrors);
    console.log("Error en formulario",newErrors)
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
        Comentarios: formData.nombre,
        Id_Rutina: parseInt(formData.rutinaAsociada),
        Id_Asistencia: parseInt(formData.usuarioAsistencia),
        
      };

      console.log("Datos a registrar rutina", rutina)

         const resultado = await crearRegistroDiario(rutina);

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

              <div>
                <label>Usuario con asistencia hoy:</label>
                <select
                  name="usuarioAsistencia"
                  value={formData.usuarioAsistencia || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un usuario</option>
                  {usuariosDia.map((u) => (
                    <option key={u.id_Asistencia} value={u.id_Asistencia}>
                      {u.nombreCompleto}
                    </option>
                  ))}
                </select>
              </div>

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
              
                <div>
                  <label>Rutinas asociadas:</label>
                  <select
                    name="rutinaAsociada"
                    value={formData.rutinaAsociada}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una rutina</option>
                    {rutinas.map((r) => (
                      <option key={r.id_Rutina} value={r.id_Rutina}>
                        {r.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.rutinaAsociada && (
                  <p className="error">{errors.rutinaAsociada}</p>
                )}
                </div>
              

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

              <button type="submit" className="boton-registrar" >
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
