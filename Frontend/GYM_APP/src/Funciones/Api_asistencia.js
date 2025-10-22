import axios from "axios";
import { UrlWithApiDG, ENDPOINTS } from "../Service/apiConfig.js";
import { Procesando } from "../Componente/Espera.jsx";

const { showLoading, closeLoading } = Procesando();

export const registrarAsistencia = async (idUsuario, idSucursal) => {
  showLoading("Registrando asistencia...", "Por favor, espere");

  try {
    // Enviar datos al endpoint con POST
    const response = await axios.post(
      UrlWithApiDG(ENDPOINTS.asistencia),
      {
        id_Usuario: idUsuario,
        id_Sucursal: idSucursal,
      }
    );

    // El SP devuelve un JSON (FOR JSON PATH), así que response.data será un objeto
    const data = response.data;

    if (data.success) {
      closeLoading(true, data.message || "Asistencia registrada correctamente");
    } else {
      closeLoading(false, data.message || "Error al registrar asistencia");
    }
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    closeLoading(false, "Error al conectarse con el servidor");
  }
};
