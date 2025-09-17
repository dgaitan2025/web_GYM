import {UrlWithApiDG, ENDPOINTS} from "../Service/apiConfig"
import { useEffect, useState } from "react";

export async function getTiposUsuarios() {
  const response = await fetch(UrlWithApiDG(ENDPOINTS.listarPuestos));
  if (!response.ok) throw new Error("Error al obtener tipos de usuario");
  return await response.json();
}

export function useFormularioPuestos() {
  const [puestos, setPuestos] = useState([]);

  useEffect(() => {
    getTiposUsuarios()
      .then(data => setPuestos(data))
      .catch(err => console.error(err));
  }, []);

  return { puestos };
}
