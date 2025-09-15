// apiEmpleado.js
const clientesMembresias = "https://Compiladores2025.somee.com/api/DashBoard/ClientesTotales_Y_PorMembresia";

export async function obtenerClienteMembresias() {
  

  try {
    const response = await fetch(clientesMembresias, {
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