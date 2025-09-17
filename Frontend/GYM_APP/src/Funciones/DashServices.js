// apiEmpleado.js
import {UrlWithApi, ENDPOINTS} from "../Service/apiConfig"

export async function obtenerClienteMembresias() {
  

  try {
    const response = await fetch(UrlWithApi(ENDPOINTS.DasboarAdmin), {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const datos = await response.json();

    
    return datos;

  } catch (error) {
    console.error("Error al conectar con la API:", error);
    throw error;
  }
}