import {UrlWithApiDG,UrlWithApi, ENDPOINTS} from "../Service/apiConfig"


export const obtenerDatosOrden = async (idUsuario) => {
  try {

    const url = UrlWithApiDG(ENDPOINTS.obtenerDatosOrden(idUsuario));
    console.log("🌐 Fetching:", url);
    const response = await fetch(url , {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error en la respuesta del servidor:", response.status);
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn("No se encontraron datos para el usuario:", idUsuario);
      return null;
    }

    return data[0]; // El SP devuelve un array, tomamos el primer elemento
  } catch (error) {
    console.error("Error obteniendo datos de la orden:", error);
    return null;
  }
};


export const crearOrden = async (orden) => {
  const url = UrlWithApi(ENDPOINTS.crearOrden);
  console.log("📦 Enviando orden a:", url);
  console.log("🧾 Datos enviados:", orden);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orden),
    });

    // Si la respuesta no es exitosa
    if (!response.ok) {
      console.error(`❌ Error HTTP ${response.status}`);
      return {
        success: false,
        message: `Error del servidor (${response.status})`,
      };
    }

    const data = await response.json();

    if (data.success) {
      console.log("✅ Orden creada con éxito:", data);
      return data;
    } else {
      console.error("⚠️ Error al crear la orden:", data);
      return {
        success: false,
        message: data.message || "Error desconocido al crear la orden.",
      };
    }
  } catch (error) {
    console.error("❌ Error creando la orden:", error);
    return {
      success: false,
      message: error.message || "Error de red o en el servidor.",
    };
  }
};


