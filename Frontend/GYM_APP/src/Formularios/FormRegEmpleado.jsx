import React, { useState } from "react";
import "./FormRegEmpleado.css";

export default function FormRegEmpleado({ open = false, onClose = () => {} }) {
  // Datos del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [sucursal, setSucursal] = useState("Central");
  const [nuevaSucursal, setNuevaSucursal] = useState("");
  const [sucursales, setSucursales] = useState(["Central", "Las Brisas", "Zona 19"]);

  const onOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) onClose();
  };

  const agregarSucursal = () => {
    const s = nuevaSucursal.trim();
    if (!s || sucursales.includes(s)) return;
    setSucursales([...sucursales, s]);
    setSucursal(s);
    setNuevaSucursal("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.alert(`Empleado registrado: ${nombre} ${apellido}`);
    setNombre(""); setApellido(""); setTelefono(""); setCorreo("");
    setSucursal("Central");
    onClose();
  };

  // 👉 IMPORTANTE: si no está abierto, no se renderiza nada
  if (!open) return null;

  return (
    <main className="form-empleado">
      <div className="modal-overlay" onClick={onOverlayClick}>
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="cerrar-modal" onClick={onClose}>×</button>

          <form onSubmit={handleSubmit} noValidate>
            <h2>Registro de Empleados</h2>

            <div>
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Ej: Juan"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Apellido</label>
              <input
                type="text"
                placeholder="Ej: Pérez"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Teléfono</label>
              <input
                type="tel"
                placeholder="Ej: +502 1234 5678"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            <div>
              <label>Correo</label>
              <input
                type="email"
                placeholder="Ej: correo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div>
              <label>Sucursal</label>
              <select value={sucursal} onChange={(e) => setSucursal(e.target.value)}>
                {sucursales.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>

              <div className="row-inline">
                <input
                  type="text"
                  placeholder="Nueva sucursal"
                  value={nuevaSucursal}
                  onChange={(e) => setNuevaSucursal(e.target.value)}
                />
                <button type="button" onClick={agregarSucursal}>+</button>
              </div>
            </div>

            <button type="submit">Registrar empleado</button>
          </form>
        </div>
      </div>
    </main>
  );
}
