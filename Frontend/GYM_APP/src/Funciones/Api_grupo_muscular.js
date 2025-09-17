import {UrlWithApiDG, ENDPOINTS} from "../Service/apiConfig"
import { useEffect, useState } from "react";

async function getGrupoMuscular() {
  const response = await fetch(UrlWithApiDG(ENDPOINTS.listarGrupoMuscular));
  if (!response.ok) throw new Error("Error al obtener tipos de usuario");
  return await response.json();
}

export function useGrupoMuscular() {
  const [grupoMuscular, setgrupoMuscular] = useState([]);

  useEffect(() => {
    getGrupoMuscular()
      .then(data => setgrupoMuscular(data))
      .catch(err => console.error(err));
  }, []);

  return { grupoMuscular };
}