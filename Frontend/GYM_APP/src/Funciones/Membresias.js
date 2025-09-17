import axios from "axios";
import { useEffect, useState } from "react";
import {UrlWithApi, ENDPOINTS} from "../Service/apiConfig"

//Se otienen los datos de membresia y se envian al front

export async function obtenerMembresias() {
  try {
    const response = await axios.get(UrlWithApi(ENDPOINTS.listarMembresias));
    return response.data; // Devuelve los datos
  } catch (error) {

    alert("Error al extraer membresias: ", error);

  }
}

export function cargarMembresias (){
  const [membresias, setMembresias] = useState([]);
  useEffect(() => {
      obtenerMembresias()
        .then(data => setMembresias(data))
        .catch(err => console.error(err));
    }, []);
  return {membresias};
};

//Se optinen los datos de las sucursales y se envian al front

export async function obtenerSucursales() {
  try {
    const response = await axios.get(UrlWithApi(ENDPOINTS.listarSucursales));
    return response.data; // Devuelve los datos
  } catch (error) {

    alert("Error al extraer Sucursales", error);

  }
}

export function cargarSucursales (){
  const [sucursales, setSucursales] = useState([]);
  useEffect(() => {
      obtenerSucursales()
        .then(data => setSucursales(data))
        .catch(err => console.error(err));
    }, []);
  return {sucursales};
};