import React, { useState, useRef, useEffect } from "react";
import "../Front/SiteDinamic";
import "./FormRegUsuario.css";
import { cuiValido, nitValido } from "../Funciones/validaDPI.js";
import { insertarCliente } from "../Funciones/IntoClienteService";
import { createPortal } from "react-dom";
import { Procesando } from "../Componente/Espera";
import { obtenerMembresias } from "../Funciones/Membresias.js";

const SOLO_LETRAS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

// ---------- Helpers de validación ----------
const normalizarLetras = (v) => v.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
const normalizarTelefono = (v) => v.replace(/\D/g, "").slice(0, 8);
const normalizarDPI = (v) => v.replace(/\D/g, "").slice(0, 13);


//Validacion de correo
const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validarCorreo = (correo) => {
  const correoTrim = (correo || "").trim();

  if (!correoTrim) return "El correo es obligatorio";
  
  if (!CORREO_REGEX.test(correoTrim)) {
    return "Formato de correo inválido";
  }

  return null; // ✅ válido
};

const validarEdadMinima = (fechaISO, minAnios = 13) => {
  if (!fechaISO) return "La fecha es obligatoria";
  const hoy = new Date();
  const fechaNac = new Date(fechaISO);
  if (isNaN(fechaNac.getTime())) return "Fecha inválida";

  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const cumpleEsteAño = new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate());
  if (hoy < cumpleEsteAño) edad -= 1;

  if (edad < minAnios) return `Debes tener al menos ${minAnios} años`;
  return null;
};

// ------------------------------------------------
const { showLoading, closeLoading } = Procesando();
function Formulario({ onClose }) {

  
  const initialFormData = {
    nombre: "",
    apellido: "",
    telefono: "",
    dpi: "",
    fechaNacimiento: "",
    foto: null,   // File
    foto64: "",   // Base64
    correo: "",
    membresiaId: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [errors, setErrors] = useState({});
  const [membresias, setMembresias] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Cargar membresías y limpiar recursos al desmontar

  useEffect(() => {
    const cargarMembresias = async () => {
      try {
        const data = await obtenerMembresias();
        setMembresias(data);
      } catch (error) {
        alert("Error al extraer membresias");
      }
    };

    cargarMembresias(); // se ejecuta al montar el form
  }, []);

  // ------------ onChange con validaciones por campo ------------
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newErrors = { ...errors };

    // Nombre y Apellido
    if (name === "nombre" || name === "apellido") {
      const limpio = normalizarLetras(value);
      setFormData((p) => ({ ...p, [name]: limpio }));
      if (!limpio.trim()) newErrors[name] = `El ${name} es obligatorio`;
      else if (!SOLO_LETRAS_REGEX.test(limpio)) newErrors[name] = `El ${name} solo puede contener letras`;
      else delete newErrors[name];
      setErrors(newErrors);
      return;
    }

    // Teléfono
    if (name === "telefono") {
      const tel = normalizarTelefono(value);
      setFormData((p) => ({ ...p, telefono: tel }));
      if (tel.length !== 8) newErrors.telefono = "Debe contener exactamente 8 dígitos numéricos";
      else delete newErrors.telefono;
      setErrors(newErrors);
      return;
    }

    // DPI
    if (name === "dpi") {
      const dpi = normalizarDPI(value);
      setFormData((p) => ({ ...p, dpi }));
      if (!cuiValido(dpi)) newErrors.dpi = "El DPI no es válido";
      else delete newErrors.dpi;
      setErrors(newErrors);
      return;
    }

    // Correo
    if (name === "correo") {
      setFormData((p) => ({ ...p, correo: value }));
      const err = validarCorreo(value);
      if (err) newErrors.correo = err;
      else delete newErrors.correo;
      setErrors(newErrors);
      return;
    }

    // Fecha
    if (name === "fechaNacimiento") {
      setFormData((p) => ({ ...p, fechaNacimiento: value }));
      const err = validarEdadMinima(value, 13);
      if (err) newErrors.fechaNacimiento = err;
      else delete newErrors.fechaNacimiento;
      setErrors(newErrors);
      return;
    }

    // Membresía
    if (name === "membresiaId") {
      setFormData((p) => ({ ...p, membresiaId: value }));
      if (!value) newErrors.membresiaId = "El ID de membresía es obligatorio";
      else delete newErrors.membresiaId;
      setErrors(newErrors);
      return;
    }

    // Archivo (no se usa input file en este form, pero lo dejamos compatible)
    if (type === "file") {
      const file = files?.[0] || null;
      setFormData((p) => ({ ...p, foto: file }));
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
      return;
    }

    // Genérico
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ------------ Validación global antes de submit ------------
  const validate = () => {
    const newErrors = {};

    // Nombre / Apellido
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    else if (!SOLO_LETRAS_REGEX.test(formData.nombre)) newErrors.nombre = "El nombre solo puede contener letras";

    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";
    else if (!SOLO_LETRAS_REGEX.test(formData.apellido)) newErrors.apellido = "El apellido solo puede contener letras";

    // Teléfono
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio";
    else if (!/^\d{8}$/.test(formData.telefono)) newErrors.telefono = "Debe contener exactamente 8 dígitos numéricos";

    // DPIf
    const dpi = (formData.dpi || "").trim();
    if (!dpi) newErrors.dpi = "El DPI es obligatorio";
    
    else if (!cuiValido(dpi)) newErrors.dpi = "El DPI no es válido";

    // Fecha
    const errFecha = validarEdadMinima(formData.fechaNacimiento, 13);
    if (errFecha) newErrors.fechaNacimiento = errFecha;

    // Correo
    const errCorreo = validarCorreo(formData.correo);
    if (errCorreo) newErrors.correo = errCorreo;

    // Membresía
    if (!String(formData.membresiaId || "").trim()) {
      newErrors.membresiaId = "El ID de membresía es obligatorio";
    }

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
      const cliente = {

        clientes:{
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        foto: formData.foto64,          // usamos la foto en Base64 si fue tomada
        correo: formData.correo,
        idTipoUsuario: 4,
        idMembresia: parseInt(formData.membresiaId, 10),
        idSucursal: 1,
        numero_Identificacion: formData.dpi
        },
        usuario:{
          correo: formData.correo
        }
        
      };

      const resultado = await insertarCliente(cliente);
      if (resultado?.success === 1) {
        closeLoading(true,"Registrado");
      } else {
        closeLoading(false,resultado.mensaje);
        
      }
    } catch (err) {
      console.error(err);
      closeLoading(false,"Error, intente mas tarde.");
    } finally {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFormData(initialFormData);
      setPreviewUrl(null);
      
    }
  };

  // ------------ Cámara ------------
  const abrirCamara = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
    }
  };

  const cerrarCamara = () => {
    setShowCamera(false);
    const stream = videoRef.current?.srcObject;
    if (stream) stream.getTracks().forEach((t) => t.stop());
  };

  const convertirA64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject("Error al leer archivo");
      reader.readAsDataURL(file);
    });

  const tomarFoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("No se pudo generar el blob");
        return;
      }
      const file = new File([blob], "foto.jpg", { type: "image/jpeg" });
      const preview = URL.createObjectURL(blob);

      try {
        const base64 = await convertirA64(file);
        setFormData((p) => ({ ...p, foto: file, foto64: base64 }));
        setPreviewUrl(preview);
      } catch (err) {
        console.error("Error al convertir a base64:", err);
      }
      cerrarCamara();
    }, "image/jpeg");
  };

  // ------------ UI ------------
  return (
    <>
      {createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <form className="formulario" onSubmit={handleSubmit}>
              <h2>Registro de Clientes</h2>
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
                <label>Apellido:</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
                {errors.apellido && <p className="error">{errors.apellido}</p>}
              </div>

              <div>
                <label>Teléfono:</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
                {errors.telefono && <p className="error">{errors.telefono}</p>}
              </div>

              <div>
                <label>DPI:</label>
                <input
                  type="text"
                  name="dpi"
                  value={formData.dpi}
                  onChange={handleChange}
                  required
                />
                {errors.dpi && <p className="error">{errors.dpi}</p>}
              </div>

              <div>
                <label>Fecha de Nacimiento:</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
                {errors.fechaNacimiento && <p className="error">{errors.fechaNacimiento}</p>}
              </div>

              <div>
                <label>Correo:</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
                {errors.correo && <p className="error">{errors.correo}</p>}
              </div>

              <div>
                <label>Membresía:</label>
                <select className="Membresias"
                  name="membresiaId"
                  value={formData.membresiaId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>Seleccione una opción</option>
                  {membresias.map((m) => (
                    <option key={m.idMembresia} value={m.idMembresia}>
                      {m.descripcion}
                    </option>
                  ))}
                </select>
                {errors.membresiaId && <p className="error">{errors.membresiaId}</p>}
              </div>

              <div>
                <label>Foto:</label>
                <button type="button" className="boton-camara" onClick={abrirCamara}>Usar Cámara</button>
              </div>

              {previewUrl && (
                <div className="preview-container">
                  <p>Vista previa de la foto:</p>
                  <img src={previewUrl} alt="Vista previa" className="preview-img" />
                </div>
              )}

              <button type="submit" className="boton-registrar">Registrar Cliente</button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {showCamera && createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <video ref={videoRef} autoPlay className="video" />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="modal-buttons">
              <button type="button" onClick={tomarFoto}>Tomar Foto</button>
              <button type="button" onClick={cerrarCamara}>Cancelar</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default Formulario;
