
import {UrlWithApi, ENDPOINTS} from "../Service/apiConfig"

export const insertarEmpleado = async (clienteData) => {
   
  try {
    
    const response = await fetch(UrlWithApi(ENDPOINTS.insertEmpleado), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData),
    });

    if (!response.ok) throw new Error('Error al insertar');
      
    const data = await response.json();
    return data;

  } catch (error) {
    
    
    return null;
  }
};
