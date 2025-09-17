//API para la insertar clientes 
import {UrlWithApi, ENDPOINTS} from "../Service/apiConfig"

export const insertarCliente = async (clienteData) => {
   
  try {
    
    const response = await fetch(UrlWithApi(ENDPOINTS.insertCliente), {
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
