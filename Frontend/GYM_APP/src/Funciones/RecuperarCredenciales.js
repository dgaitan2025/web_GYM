//Recuperar Clave
import {UrlWithApi, ENDPOINTS} from "../Service/apiConfig"

export async function recuperarClave(correo) {
  const respuesta = await fetch(UrlWithApi(ENDPOINTS.recuperarClave), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(correo),
  });

  if (!respuesta.ok) {
    throw new Error("Error en la petición");
  }

  return await respuesta.json(); // 👈 el componente decide qué hacer con esto
}