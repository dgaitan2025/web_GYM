import {UrlWithApi, ENDPOINTS} from "../Service/apiConfig"

export async function obtenerClientes() {
  try {
    const response = await fetch(UrlWithApi(ENDPOINTS.indexClientes), {
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


export const eliminarCliente = async (id) => {
  const url = UrlWithApi(ENDPOINTS.eliminarCliente(id));
  console.log("🗑️ Eliminando cliente:", id, "→", url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
      },
    });

    // Si la API responde con error
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Error HTTP ${response.status}:`, errorText);
      return {
        success: false,
        message: `Error al eliminar el cliente (HTTP ${response.status})`,
      };
    }

    // Intentamos parsear la respuesta JSON
    const data = await response.json();
    console.log("✅ Cliente eliminado:", data);

    // La API devuelve { success, message } en formato JSON (desde el SP)
    if (data.success) {
      return data;
    } else {
      return {
        success: false,
        message: data.message || "Error desconocido al eliminar el cliente.",
      };
    }
  } catch (error) {
    console.error("⚠️ Error en eliminarCliente:", error);
    return {
      success: false,
      message: error.message || "Error de red o en el servidor.",
    };
  }
};

