import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Procesando } from "./Espera";
import { obtenerDatosOrden, crearOrden } from "../Funciones/Api_ordenes"


export default function ModalRenovarMembresia({ visible, onClose, cliente }) {
    const [tipoPago, setTipoPago] = useState("");
    const [numeroAutorizacion, setNumeroAutorizacion] = useState("");

    // 🔹 Cada vez que el modal se abre o cierra, restablecemos valores
    useEffect(() => {
        if (!visible) {
            setTipoPago("");
            setNumeroAutorizacion("");
        }
    }, [visible]);

    if (!visible || !cliente) return null;

    const handleClose = () => {
        // 🔹 Resetear campos antes de cerrar
        setTipoPago("");
        setNumeroAutorizacion("");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tipoPago) {
            alert("Selecciona un tipo de pago");
            return;
        }

        if ((tipoPago === "2" || tipoPago === "3") && !numeroAutorizacion) {
            alert("Debes ingresar el número de autorización");
            return;
        }

        const { showLoading, closeLoading } = Procesando();
        showLoading("Procesando", "Creando orden de renovación...");

        try {

            const datos = await obtenerDatosOrden(cliente.id_Cliente);
            console.log("datos de la orden", datos)

            const orden = {
                
                Id_Usuario: datos.id_Usuario,
                Fecha_Emision: new Date().toISOString(),
                Id_Estado_Orden: 2,
                Total: datos.total || 450,
                Id_Sucursal: datos.id_Sucursal || 1,
                Detalles: [
                    {
                        
                        Id_Metodo: parseInt(tipoPago),
                        Monto: datos.total || 450,
                        Referencia:
                            tipoPago === "1" ? 1 : numeroAutorizacion || null,
                        Id_Membresia: datos.id_Membresia,
                    },
                ]
            };

            console.log("datos a insertar", orden)

            const respuesta = await crearOrden(orden);

            if (respuesta.success) {
                closeLoading(true, "Renovación procesada con éxito");
                handleClose();
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                closeLoading(false, respuesta.message || "Error al crear la orden");
            }
        } catch (error) {
            console.error(error);
            closeLoading(false, "Error al procesar la renovación.");
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
                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title">Renovar Membresía</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={handleClose}
                        ></button>
                    </div>

                    {/* FORMULARIO */}
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <p>
                                <strong>Cliente:</strong> {cliente.nombre}
                            </p>

                            <div className="mb-3">
                                <label className="form-label">Tipo de pago:</label>
                                <select
                                    className="form-select"
                                    value={tipoPago}
                                    onChange={(e) => setTipoPago(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="1">Efectivo</option>
                                    <option value="2">Transferencia</option>
                                    <option value="3">Tarjeta</option>
                                </select>
                            </div>

                            {(tipoPago === "2" || tipoPago === "3") && (
                                <div className="mb-3">
                                    <label className="form-label">Número de Autorización:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ingrese número o referencia"
                                        value={numeroAutorizacion}
                                        onChange={(e) => setNumeroAutorizacion(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-success">
                                Renovar
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClose}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
