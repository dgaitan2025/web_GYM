import React, { useEffect, useState } from "react";
import { ResponsivePie } from "@nivo/pie";
import { obtenerClienteMembresias } from "../Funciones/DashServices";

const GraficoPie = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuesta = await obtenerClienteMembresias();

        // ⚡ Transformar el JSON al formato que requiere Nivo Pie
        if (respuesta && respuesta.length > 0) {
          const raw = respuesta[0];
          const datosTransformados = [
            {
              id: "Clientes Activos",
              label: "Clientes Activos",
              value: raw.clientes_Activos,
            },
            {
              id: "Membresías Vigentes",
              label: "Membresías Vigentes",
              value: raw.clientes_con_Membresia_Vigente,
            },
            {
              id: "Membresías vencidas",
              label: "Membresías vencidas",
              value: raw.clientes_Activos - raw.clientes_con_Membresia_Vigente,
            },
          ];

          setData(datosTransformados);
        }
      } catch (error) {
        console.error("❌ Error cargando datos del gráfico:", error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div style={{ height: 400, width: "100%",  margin: "0 auto" }}>
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>Clientes por Estado</h3>

      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 120, bottom: 80, left: 120 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "set2" }}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 150,
            itemHeight: 20,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
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
        ariaLabel="Gráfico circular de clientes activos y con membresía vigente"
      />
    </div>
  );
};

export default GraficoPie;
