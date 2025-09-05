import axios from "axios";

const API_URL = "https://Compiladores2025.somee.com/api/Clientes/listarmembresias";
const API_Sucursales ="https://Compiladores2025.somee.com/api/sucursales/sucursalesindex"

export async function obtenerMembresias() {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Devuelve los datos
  } catch (error) {
    
    alert("Error al extraer membresias: ", error);
    
  }
}

export async function obtenerSucursales() {
  try {
    const response = await axios.get(API_Sucursales);
    return response.data; // Devuelve los datos
  } catch (error) {
    
    alert("Error al extraer membresias: ", error);
    
  }
}