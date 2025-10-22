import React, { useState, useRef} from "react";
import "../Front/SiteDinamic.jsx";
import "./FormRegUsuario.css";
import { insertarEmpleado } from "../Funciones/IntoEmpleadoService.js";
import { createPortal } from "react-dom";
import { Procesando } from "../Componente/Espera.jsx";
import { cargarSucursales } from "../Funciones/Membresias.js";
import { useFormularioPuestos } from "../Funciones/Api_puestos.js"
import { handleInputChange, validateForm } from "../Funciones/ValidacionesFormularios.js";

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
    id_Sucursal: "",
    id_puesto: ""
  };

  const { puestos } = useFormularioPuestos();
  const { sucursales } = cargarSucursales();
  const [formData, setFormData] = useState(initialFormData);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [errors, setErrors] = useState({});
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ------------ Submit ------------
  const handleSubmit = async (e) => {

    e.preventDefault();
    console.log("📤 Intentando registrar empleado:", formData);

    if (!validateForm(formData, setErrors)) return;

    onClose();

    

    showLoading("Registro Empleado", "Registrando");
    try {
      const cliente = {

        empleado: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          //fechaNacimiento: formData.fechaNacimiento,
          //foto: formData.foto64,          // usamos la foto en Base64 si fue tomada

          idSucursal: parseInt(formData.id_Sucursal, 10),
          idTipoUsuario: parseInt(formData.id_puesto, 10),
          numero_Identificacion: formData.dpi,
        },
        usuario: { correo: formData.correo }

      };

      const resultado = await insertarEmpleado(cliente);
      if (resultado?.success === 1) {
        closeLoading(true, "Registrado");
      } else {
        closeLoading(false, "Ocurrió un error al insertar el cliente");

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
              <h2>Registro de Empleados</h2>
              <button type="button" className="cerrar-modal" onClick={onClose}>✕</button>

              <div>
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    handleInputChange(e, formData, setFormData, errors, setErrors, setPreviewUrl)
                  }
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
                  onChange={(e) =>
                    handleInputChange(e, formData, setFormData, errors, setErrors, setPreviewUrl)
                  }
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
                  onChange={(e) =>
                    handleInputChange(e, formData, setFormData, errors, setErrors, setPreviewUrl)
                  }
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
                  onChange={(e) =>
                    handleInputChange(e, formData, setFormData, errors, setErrors, setPreviewUrl)
                  }
                  required
                />
                {errors.dpi && (
                  <p className={errors.dpi.tipo === "error" ? "error" : "success"}>
                    {errors.dpi.mensaje}
                  </p>
                )}
              </div>

              <div>
                <label>Fecha de Nacimiento:</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={(e) =>
                    handleInputChange(e, formData, setFormData, errors, setErrors, setPreviewUrl)
                  }
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
                  onChange={(e) =>
                    handleInputChange(e, formData, setFormData, errors, setErrors, setPreviewUrl)
                  }
                  required
                />
                {errors.correo && <p className="error">{errors.correo}</p>}
              </div>

              <div>
                <label>Sucursal</label>
                <select className="Membresias"
                  name="id_Sucursal"
                  value={formData.id_Sucursal}
                  onChange={(e) =>
                    handleInputChange(e, formData, setFormData, errors, setErrors, setPreviewUrl)
                  }
                  required
                >
                  <option value="" disabled hidden>Seleccione una opción</option>
                  {sucursales.map((m) => (
                    <option key={m.id_Sucursal} value={m.id_Sucursal}>
                      {m.descripion}
                    </option>
                  ))}
                </select>
                {errors.id_Sucursal && <p className="error">{errors.id_Sucursal}</p>}
              </div>

              <div>
                <label>Puesto</label>
                <select
                  className="Membresias"
                  name="id_puesto"
                  value={formData.id_puesto}
                  onChange={(e) =>
                    handleInputChange(e, formData, setFormData, errors, setErrors, setPreviewUrl)
                  }
                  required
                >
                  <option value="" disabled hidden>Seleccione una opción</option>
                  {puestos.map((m) => (
                    <option key={m.id_tipo} value={m.id_tipo}>
                      {m.descripcion}
                    </option>
                  ))}
                </select>
                {errors.id_puesto && <p className="error">{errors.id_puesto}</p>}
              </div>

              

              <button type="submit" className="boton-registrar">Registrar Cliente</button>
            </form>
          </div>
        </div>,
        document.body
      )}

      
    </>
  );
}

export default Formulario;
