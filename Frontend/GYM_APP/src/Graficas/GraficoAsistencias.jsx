import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import {decryptString} from "../Funciones/Encriptar"
import { UrlWithApi, ENDPOINTS } from "../Service/apiConfig";

const GraficoAsis = () => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]); 

useEffect(() => {
  const obtenerDatos = async () => {
    try {
      const response = await fetch(UrlWithApi(ENDPOINTS.dashAsistencia));
      const data = await response.json();

      if (!data || data.length === 0) {
        console.warn("No hay datos disponibles para el dashboard");
        return;
      }

      const { entradas, entradasSinSalida } = data[0]; // tomamos el primer objeto

      // 🔹 Convertir al formato compatible con tu gráfica
      const objetoGrafica = {
        country: "Asistencia",
        Entradas: entradas,
        "Entradas sin salida": entradasSinSalida
      };

      // 🔹 Claves dinámicas (para las barras)
      const claves = Object.keys(objetoGrafica).filter((k) => k !== "country");

      setData([objetoGrafica]);
      setKeys(claves);
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error);
    }
  };

  obtenerDatos();
}, []);



  return (
    <div style={{ height: 400, width: "100%", maxWidth: 800, margin: "0 auto" }}>
      <h3 style={{ textAlign: "center", marginBottom: 20, color: "#1B263B" }}>
        Músculos Trabajados
      </h3>

      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 60, left: 70 }}
        padding={0.3}
        groupMode="grouped"
        colors={{ scheme: 'accent' }}
        innerPadding={4}
        borderRadius={5}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.3]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
         
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Repeticiones / Actividad",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor="#0f0909ff" // texto claro sobre fondo oscuro
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 50,
            itemsSpacing: 10,
            itemWidth: 100,
            itemHeight: 20,
            itemTextColor: "#555",
            symbolSize: 20,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Gráfico de barras de músculos trabajados"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default GraficoAsis;
