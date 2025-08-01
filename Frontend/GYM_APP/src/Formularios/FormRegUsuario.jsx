import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import "../Front/SiteDinamic";

function Formulario({ cerrarModal }) {
  const initialFormData = {
    nombre: "",
    apellido: "",
    telefono: "",
    dpi: "",
    fechaNacimiento: "",
    foto: null,
    correo: "",
    membresiaId: ""
  };

  const [formData, setFormData] = useState(initialFormData);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [errors, setErrors] = useState({});

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
    const soloNumeros = value.replace(/\D/g, "").slice(0, 8);
    setFormData({ ...formData, [name]: soloNumeros });

    if (value !== soloNumeros) {
      newErrors.dpi = "Solo se permiten números (máximo 13 dígitos)";
    } else {
      delete newErrors.dpi;
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
    } else if (!/^\d{13}$/.test(formData.pdi)) {
      newErrors.dpi = "Debe contener exactamente 13 dígitos numéricos";
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

    const dominiosValidos = ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com"];
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "El formato del correo es inválido";
    } else if (!dominiosValidos.some((dominio) => formData.correo.endsWith(dominio))) {
      newErrors.correo = "Dominio no permitido. Usa @gmail.com, @hotmail.com, etc.";
    }

    if (!formData.membresiaId.trim()) {
      newErrors.membresiaId = "El ID de membresía es obligatorio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (formData.foto) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        alert("Cliente registrado correctamente");
        console.log("Foto (Base64):", fileReader.result);
      };
      fileReader.readAsDataURL(formData.foto);
    } else {
      alert("Cliente registrado correctamente (sin foto)");
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFormData(initialFormData);
    setPreviewUrl(null);
    cerrarModal();
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

  const tomarFoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "foto.jpg", { type: "image/jpeg" });
      setFormData({ ...formData, foto: file });

      const preview = URL.createObjectURL(blob);
      setPreviewUrl(preview);
    }, "image/jpeg");

    cerrarCamara();
  };

  const cerrarCamara = () => {
    setShowCamera(false);
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <h2>Registro de Clientes</h2>

      <button type="button" className="cerrar-modal" onClick={cerrarModal}>✕</button>

      <div>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        {errors.nombre && <p className="error">{errors.nombre}</p>}
      </div>

      <div>
        <label>Apellido:</label>
        <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
        {errors.apellido && <p className="error">{errors.apellido}</p>}
      </div>

      <div>
        <label>Teléfono:</label>
        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
        {errors.telefono && <p className="error">{errors.telefono}</p>}
      </div>



      <div>
        <label>DPI:</label>
        <input type="pdin" name="dpi" value={formData.dpi} onChange={handleChange} required />
        {errors.pdi && <p className="error">{errors.pdi}</p>}
      </div>

      <div>
        <label>Fecha de Nacimiento:</label>
        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
        {errors.fechaNacimiento && <p className="error">{errors.fechaNacimiento}</p>}
      </div>

      <div>
        <label>Correo:</label>
        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
        {errors.correo && <p className="error">{errors.correo}</p>}
      </div>

      <div>
  <label>Membresía:</label>
  <select
    name="membresiaId"
    value={formData.membresiaId}
    onChange={handleChange}
    required
  >
    <option value="">Seleccione una opción</option>
    <option value="BASICA">Básica</option>
    <option value="PREMIUM">Premium</option>
    <option value="VIP">VIP</option>
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

      {showCamera && (
        <div className="modal-overlay">
          <div className="modal-content">
            <video ref={videoRef} autoPlay className="video" />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="modal-buttons">
              <button type="button" onClick={tomarFoto}>Tomar Foto</button>
              <button type="button" onClick={cerrarCamara}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default Formulario;