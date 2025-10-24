import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Procesando } from "./Espera";
import { recuperarClave } from "../Funciones/RecuperarCredenciales";

export default function ModalRecuperarClave({ visible, onClose }) {
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");

  if (!visible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { showLoading, closeLoading } = Procesando();
    showLoading("Recuperando", "Procesando...");

    try {
      // 🔹 JSON completo que la API espera
      const credenciales = {
        correo: email,
        usuario: usuario
      };

      const respuesta = await recuperarClave(credenciales);

      if (respuesta.success === 1 || respuesta.success === true) {
        closeLoading(true, "Correo de recuperación enviado");
        onClose(); // cerrar modal si fue exitoso
      } else {
        closeLoading(false, respuesta.mensaje || "No se pudo enviar el correo");
      }
    } catch (error) {
      console.error(error);
      closeLoading(false, "Error en la respuesta.");
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Recuperar contraseña</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p>Ingresa tu usuario y correo para recuperar la clave.</p>

              {/* 🔹 Usuario */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />

              {/* 🔹 Correo */}
              <input
                type="email"
                className="form-control"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Enviar
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
