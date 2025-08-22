// apiEmpleado.js
export async function obtenerEmpleados() {
  const url = "https://Compiladores2025.somee.com/api/Empleadoes/EmpleadosIndex";

  try {
    const response = await fetch(url, {
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
