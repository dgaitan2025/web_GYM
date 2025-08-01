import React from "react";
import Formulario from "./Formulario";
import "./App.css"; // tener los estilos aquí

function FormRegUsuario() {
  // Esta función cierra el modal volviendo a la página anterior
  const cerrarModal = () => {
    window.history.back();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Formulario cerrarModal={cerrarModal} />
      </div>
    </div>
  );
}

export default FormRegUsuario;

 
