import axios from "axios";
import { UrlWithApi, ENDPOINTS } from "../Service/apiConfig.js";
import { Procesando } from "../Componente/Espera.jsx";

const { showLoading, closeLoading } = Procesando();

export const registrarAsistencia = async (usuario, idSucursal) => {
  showLoading("Registrando asistencia...", "Por favor, espere");

  try {
    // Enviar datos al endpoint con POST
    const response = await axios.post(
      UrlWithApi(ENDPOINTS.asistencia),
      {
        usuario: usuario,
        id_Sucursal: idSucursal,
      }
    );

    // El SP devuelve un JSON (FOR JSON PATH), así que response.data será un objeto
    const data = response.data;


    if (data.success) {
      closeLoading(true, data.mensaje || "Asistencia registrada correctamente");
    } else {
      closeLoading(false, data.mensaje || "Error al registrar asistencia");
    }
  } catch (error) {
    console.error("Error al registrar asistencia:", error);
    closeLoading(false, "Error al conectarse con el servidor");
  }
};


export const obtenerAsistenciasDelDia = async () => {
  try {
    const response = await axios.get(UrlWithApi(ENDPOINTS.clientesAsistencia));
    return response.data; // Devuelve la lista de usuarios con asistencia
  } catch (error) {
    console.error("Error al obtener asistencias del día:", error);
    throw error;
  }
};


export const registrarSalida = async (usuario) => {
  showLoading("Registrando salida...", "Por favor, espere");

  try {
    // Enviar petición PUT al endpoint dinámico
    const response = await axios.put(
      UrlWithApi(ENDPOINTS.clienteSalida(usuario)), // /api/Asistenciums/AsistenciaActualizar/usuario
      {
        usuario: usuario, // 🔹 cuerpo de la petición
      }
    );

    const data = response.data;
    console.log("📤 Respuesta de salida:", data);

    if (data.success) {
      closeLoading(true, data.mensaje || "Salida registrada correctamente ✅");
    } else {
      closeLoading(false, data.mensaje || "Error al registrar la salida");
    }
  } catch (error) {
    console.error("❌ Error al registrar salida:", error);
    closeLoading(false, "Error al conectarse con el servidor");
  }
};


export const crearRegistroDiario = async (registro) => {
  showLoading("Creando registro diario...", "Por favor, espere");

  try {
    // Enviar la petición POST al endpoint
    const response = await axios.post(
      UrlWithApi(ENDPOINTS.asignarRutina),
      registro,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.data; // JSON retornado por el SP

    if (data.success) {
      closeLoading(true, data.message || "Registro diario creado con éxito");
    } else {
      closeLoading(false, data.message || "No se pudo crear el registro diario");
    }

    return data;
  } catch (error) {
    console.error("Error al crear el registro diario:", error);
    closeLoading(false, "Error al conectarse con el servidor");
    return {
      success: false,
      message: "Error al conectarse con el servidor",
      error: error.response?.data || error.message,
    };
  }
};

export const finalizarRutina = async (idRegistro) => {
  showLoading("Finalizando rutina...", "Por favor, espere");

  try {
    // 🔹 Llamada al endpoint del backend
    const response = await axios.put(
      UrlWithApi(ENDPOINTS.rutinaFinalizar(idRegistro))
    );

    const data = response.data;

    if (data.success === 1 || data.success === true) {
      closeLoading(true, data.message || "Rutina finalizada correctamente");
      return { success: true, message: data.message };
    } else {
      closeLoading(false, data.message || "No se pudo finalizar la rutina");
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("❌ Error al finalizar rutina:", error);
    closeLoading(false, "Error al conectar con el servidor");
    return { success: false, message: "Error al conectar con el servidor" };
  }
};
