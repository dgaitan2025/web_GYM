import React, { useState, useRef, useEffect } from "react";
import "../Front/SiteDinamic";
import axios from "axios";
import "./FormRegUsuario.css";
import { validarDPI } from "validador-dpi-nit";
import { insertarCliente } from "../Funciones/IntoClienteService";
import { createPortal } from "react-dom";

function Formulario({ onClose }) {
  const initialFormData = {
    nombre: "",
    apellido: "",
    telefono: "",
    dpi: "",
    fechaNacimiento: "",
    foto: "",
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

  useEffect(() => {
    axios
      .get("https://Compiladores2025.somee.com/api/Clientes/listarmembresias")
      .then((response) => setMembresias(response.data))
      .catch((error) => console.error("Error al obtener membresías:", error));

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);



  // Validación básica de DPI (Guatemala): 13 dígitos, con departamento y municipio válidos
function validarDPI(dpi) {
  if (!/^\d{13}$/.test(dpi)) return false;

  const departamento = parseInt(dpi.substring(9, 11), 10);
  const municipio = parseInt(dpi.substring(11, 13), 10);

  if (departamento === 0 || municipio === 0) return false;
  if (departamento > 22 || municipio > 20) return false; // rangos válidos

  return true;
}




  /* Gestion de los campos */
  /* implementacion de validaciones */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newErrors = { ...errors };

    if (name === "nombre" || name === "apellido") {
      const soloLetras = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
      setFormData({ ...formData, [name]: soloLetras });

      if (value !== soloLetras) {
        newErrors[name] = "Solo se permiten letras en este campo";
      } else {
        delete newErrors[name];
      }

      setErrors(newErrors);
      return;
    }

    if (name === "telefono") {
      const soloNumeros = value.replace(/\D/g, "").slice(0, 8);
      setFormData({ ...formData, [name]: soloNumeros });

      if (value !== soloNumeros) {
        newErrors.telefono = "Solo se permiten números (máximo 8 dígitos)";
      } else {
        delete newErrors.telefono;
      }

      setErrors(newErrors);
      return;
    }



if (name === "dpi") {
  const soloNumeros = value.replace(/\D/g, "").slice(0, 13);
  setFormData({ ...formData, [name]: soloNumeros });

  if (value !== soloNumeros) {
    newErrors.dpi = "Solo se permiten números (máximo 13 dígitos)";
  } else if (soloNumeros.length !== 13) {
    newErrors.dpi = "El DPI debe contener exactamente 13 dígitos";
  } else if (!validarDPI(soloNumeros)) {
    newErrors.dpi = "El DPI no es válido";
  } else {
    delete newErrors.dpi;
  }

  setErrors(newErrors);
  return;
}


if (name === "correo") {
  const correoTrim = value.trim();
  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const dominiosValidos = [
    "@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com", "@aol.com", "@icloud.com", "@protonmail.com",
    "@umg.edu.gt", "@usac.edu.gt", "@uvg.edu.gt", "@galileo.edu", "@uaglobal.edu.gt", "@uac.edu.gt", "@panamericana.edu.gt",
    "@banrural.com.gt", "@bi.com.gt", "@bancoagricola.com.gt", "@baccredomatic.com", "@gytcontinental.com.gt", "@bam.com.gt",
    "@intelaf.com", "@cemaco.com", "@prensa.com.gt", "@telgua.com.gt", "@clarogt.com.gt", "@tigo.com.gt",
    "@agenciasway.com", "@cerveceriacentroamericana.com", "@pollo.campero.com", "@cementosprogreso.com",
    "@disatel.com.gt", "@grupoalmo.com", "@alimentosmaravilla.com", "@company.com", "@corp.com", "@enterprise.com", "@business.com"
  ];

  setFormData({ ...formData, correo: correoTrim });

  if (!correoTrim) {
    newErrors.correo = "El correo es obligatorio";
  } else if (correoTrim.length < 6 || correoTrim.length > 100) {
    newErrors.correo = "Debe tener entre 6 y 100 caracteres";
  } else if (!correoRegex.test(correoTrim)) {
    newErrors.correo = "Formato de correo inválido";
  } else {
    const dominioCorreo = correoTrim.split("@")[1]?.toLowerCase() || "";
    const dominioValido = dominiosValidos.some((domPermitido) =>
      dominioCorreo === domPermitido.replace("@", "").toLowerCase() ||
      dominioCorreo.endsWith("." + domPermitido.replace("@", "").toLowerCase())
    );

    if (!dominioValido) {
      newErrors.correo = "Dominio no permitido. Usa un correo válido.";
    } else {
      delete newErrors.correo;
    }
  }

  setErrors(newErrors);
  return;
}






    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (!soloLetrasRegex.test(formData.nombre)) {
      newErrors.nombre = "El nombre solo puede contener letras";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    } else if (!soloLetrasRegex.test(formData.apellido)) {
      newErrors.apellido = "El apellido solo puede contener letras";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = "Debe contener exactamente 8 dígitos numéricos";
    }


    if (!formData.dpi.trim()) {
  newErrors.dpi = "El DPI es obligatorio";
} else if (!validarDPI(formData.dpi.trim())) {
  newErrors.dpi = "El DPI no es válido";
}



    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha es obligatoria";
    } else {
      const hoy = new Date();
      const fechaNac = new Date(formData.fechaNacimiento);
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      const cumpleEsteAño = new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate());
      const edadFinal = hoy >= cumpleEsteAño ? edad : edad - 1;
      if (edadFinal < 13) {
        newErrors.fechaNacimiento = "Debes tener al menos 13 años";
      }
    }


    if (!correoTrim) {
      newErrors.correo = "El correo es obligatorio";
    } else if (correoTrim.length < 6 || correoTrim.length > 100) {
      newErrors.correo = "El correo debe tener entre 6 y 100 caracteres";
    } else if (!correoRegex.test(correoTrim)) {
      newErrors.correo = "Formato de correo inválido";
    } else {
      const dominioCorreo = correoTrim.split("@")[1]?.toLowerCase() || "";
      const dominioValido = dominiosValidos.some((domPermitido) =>
        dominioCorreo === domPermitido.replace("@", "").toLowerCase() ||
        dominioCorreo.endsWith("." + domPermitido.replace("@", "").toLowerCase())
      );

      if (!dominioValido) {
        newErrors.correo = "Dominio no permitido. Usa un correo válido.";
      } else {
        delete newErrors.correo;
      }
    

    setErrors(newErrors);
  return;
}

    





    if (!formData.membresiaId.trim()) {
      newErrors.membresiaId = "El ID de membresía es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (true) {
      /*
      const fileReader = new FileReader();
      fileReader.onload = () => {
        alert("Ingreso");
        console.log("Foto (Base64):", fileReader.result);
      };
      */

      //parte para insertar usuario en db
      const cliente = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono,
      fechaNacimiento: formData.fechaNacimiento,
      foto: formData.base64, // o base64 si tienes imagen
      correo: formData.correo,
      idTipoUsuario: 4,
      idMembresia: parseInt(formData.membresiaId),
      idSucursal: 1,
      numero_Identificacion: formData.dpi
    };
    console.log(formData.nombre);
    console.log(formData.apellido);
    console.log(formData.telefono);
    console.log(formData.fechaNacimiento);
    console.log(formData.foto64);
    console.log(formData.correo);
    console.log(formData.membresiaId);
    
    const resultado = await insertarCliente(cliente);

    if (resultado.success === 1) {
    window.alert("✅ Cliente insertado con éxito");
  } else {
    window.alert("❌ Ocurrió un error al insertar el cliente");
  }

    } else {
      alert("Cliente registrado correctamente (sin foto)");
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFormData(initialFormData);
    setPreviewUrl(null);
    onClose();
  };

  const abrirCamara = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
    }
  };

const tomarFoto = async () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");

  if (!video || !canvas || !context) {
    console.error("Referencia a video o canvas no válida");
    return;
  }

  // Captura la imagen del video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convierte el canvas en un blob, luego a File y finalmente a base64
  canvas.toBlob(async (blob) => {
    if (!blob) {
      console.error("No se pudo generar el blob");
      return;
    }

    const file = new File([blob], "foto.jpg", { type: "image/jpeg" });
    const preview = URL.createObjectURL(blob);

    try {
      const base64 = await convertirA64(file);

      // Guarda tanto el File como (opcionalmente) el Base64
      setFormData(prev => ({
        ...prev,
        foto: file,
        foto64: base64, // opcional si deseas almacenar también el base64
      }));

      setPreviewUrl(preview);

      //alert("Ingreso");
      console.log("📸 Foto en Base64:", base64);
    } catch (err) {
      console.error("Error al convertir a base64:", err);
    }

    cerrarCamara();
  }, "image/jpeg");
};

// Función auxiliar para convertir File a Base64
const convertirA64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject("Error al leer archivo");

    reader.readAsDataURL(file);
  });
};

  const cerrarCamara = () => {
    setShowCamera(false);
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };



  /* modales de formulario y camara separados para evitar conflicto */
  /* uso de createPortal */
  return (
    <>
    {createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <form className="formulario" onSubmit={handleSubmit}>
          <h2>Registro de Clientes</h2>
          <button type="button" className="cerrar-modal" onClick={onClose}>✕</button>

          <div><label>Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
            {errors.nombre && <p className="error">{errors.nombre}</p>}
          </div>

          <div><label>Apellido:</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
            {errors.apellido && <p className="error">{errors.apellido}</p>}
          </div>

          <div><label>Teléfono:</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
            {errors.telefono && <p className="error">{errors.telefono}</p>}
          </div>

          <div><label>DPI:</label>
            <input type="text" name="dpi" value={formData.dpi} onChange={handleChange} required />
            {errors.dpi && <p className="error">{errors.dpi}</p>}
          </div>

          <div><label>Fecha de Nacimiento:</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
            {errors.fechaNacimiento && <p className="error">{errors.fechaNacimiento}</p>}
          </div>

          <div><label>Correo:</label>
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
            {errors.correo && <p className="error">{errors.correo}</p>}
          </div>

          <div><label>Membresía:</label>
            <select name="membresiaId" value={formData.membresiaId} onChange={handleChange} required>
              <option value="" disabled hidden>
                Seleccione una opción
              </option>
              {membresias.map((m) => (
                <option key={m.IdMembresia} value={m.IdMembresia}>
                  {m.Descripcion}
                </option>
              ))}
            </select>
            {errors.membresiaId && <p className="error">{errors.membresiaId}</p>}
          </div>

          <div><label>Foto:</label>
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


        {showCamera && 
        createPortal(
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
