import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// Necesario para cerrar el modal si usas data-bs-dismiss

export default function ModalRecuperarClave({ visible, onClose }) {
  if (!visible) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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

          <div className="modal-body">
            <p>Ingresa tu correo para recuperar la clave.</p>
            <input type="email" className="form-control" placeholder="Correo electrónico" />
          </div>

          <div className="modal-footer">
            
            <button type="button" className="btn btn-primary">
              Enviar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
