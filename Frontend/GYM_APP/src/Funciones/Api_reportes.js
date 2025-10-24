import axios from "axios";
import { UrlWithApi, ENDPOINTS } from "../Service/apiConfig.js";
import { Procesando } from "../Componente/Espera.jsx";

const { showLoading, closeLoading } = Procesando();

export const descargarReporteClientes = async (nombreArchivo, endpoint) => {
  showLoading("Generando reporte de clientes...", "Espere un momento");

  try {
    // 🔹 Llamada al endpoint que devuelve archivo PDF
    const response = await axios.get(
      UrlWithApi(endpoint), // 🔹 base64=false => retorna archivo binario
      { responseType: "blob" } // ⚠️ necesario para recibir archivo
    );

    // 🔹 Crear un objeto URL temporal
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${nombreArchivo.replace(/\s+/g, "_")}.pdf`);
    document.body.appendChild(link);
    link.click();

    closeLoading(true, "Reporte descargado correctamente");
  } catch (error) {
    console.error("Error al descargar el reporte:", error);
    closeLoading(false, "Error al generar el reporte");
  }
};
