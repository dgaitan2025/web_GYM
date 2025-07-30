import React, { useState, useRef } from "react";
import "./FormRegUsuario.css";
import "../Front/SiteDinamic";

function Formulario({ onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    fechaNacimiento: "",
    foto: null,
    correo: "",
    membresiaId: "",
  });

   const salir = () => {
    // Elimina el estado de login
    navigate("/SiteDinamic"); // Redirige al login
  };

  const [previewUrl, setPreviewUrl] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Cliente registrado correctamente");
    console.log("Cliente registrado:", formData);

    setFormData({
      nombre: "",
      apellido: "",
      telefono: "",
      fechaNacimiento: "",
      foto: null,
      correo: "",
      membresiaId: "",
    });
    setPreviewUrl(null);

    onClose(); // ✅ Cierra el modal al terminar
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
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-form">
        <button className="close-btn" onClick={salir}>✖</button>
        <h2 className="form-title">Registro de Clientes</h2>

        <form className="formulario" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Apellido:</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Fecha de Nacimiento:</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Correo:</label>
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>ID Membresía:</label>
            <input type="text" name="membresiaId" value={formData.membresiaId} onChange={handleChange} required />
          </div>

          {/* ✅ FOTO AL FINAL */}
          <div className="form-group">
            <label>Foto:</label>
            <input type="file" name="foto" accept="image/*" onChange={handleChange} />
            <button type="button" className="btn-camera" onClick={abrirCamara}>Usar Cámara</button>
          </div>

          {previewUrl && (
            <div className="preview-container">
              <p>Vista previa de la foto:</p>
              <img src={previewUrl} alt="Vista previa" className="preview-img" />
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="btn-submit">Registrar Cliente</button>
            <button type="button" className="btn-exit" onClick={onClose}>Salir</button>
          </div>
        </form>

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
      </div>
    </div>
  );
}

export default Formulario;
