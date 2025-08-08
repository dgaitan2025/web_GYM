// services/ClienteService.js

const URL = 'https://Compiladores2025.somee.com/api/Clientes/ClientesCrear';

export const insertarCliente = async (clienteData) => {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData),
    });

    if (!response.ok) throw new Error('Error al insertar');

    const data = await response.json();
    return data; // Esperamos que `data` tenga el número 1 si se insertó correctamente

  } catch (error) {
    console.error('Error al insertar cliente:', error);
    return null;
  }
};
