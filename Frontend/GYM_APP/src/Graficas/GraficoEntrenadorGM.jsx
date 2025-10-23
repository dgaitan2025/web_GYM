import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { UrlWithApi, ENDPOINTS } from "../Service/apiConfig.js"

const GraficoRG = () => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);

useEffect(() => {
  const obtenerDatos = async () => {
    try {
      const response = await fetch(UrlWithApi(ENDPOINTS.dashEntrenador));
      const data = await response.json();

      // 🔹 Convertir el formato del endpoint al formato requerido por la gráfica
      const objetoGrafica = { country: "Grupos Musculares" };

      data.forEach((item) => {
        objetoGrafica[item.grupoMuscular] = item.totalRutinas;
      });

      // 🔹 Detectar dinámicamente las claves (todas excepto "country")
      const claves = Object.keys(objetoGrafica).filter((k) => k !== "country");

      // 🔹 Actualizar estados
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
        Rutinas asignadas a Cada grupo muscular
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
          legend: "Rutinas Asignadas",
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

export default GraficoRG;
