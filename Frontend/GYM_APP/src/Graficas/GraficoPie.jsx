import { ResponsivePie } from '@nivo/pie';
import React, { useEffect, useState } from "react";
import {obtenerClienteMembresias} from "../Funciones/DashServices"

/*
const rawData = [
  {
    clientes_Activos: 5,
    clientes_con_Membresia_Vigente: 3
  }
];

const data = [
  {
    id: "Clientes Activos",
    label: "Clientes Activos",
    value: rawData[0].clientes_Activos
  },
  {
    id: "Clientes con Membresía Vigente",
    label: "Clientes con Membresía Vigente",
    value: rawData[0].clientes_con_Membresia_Vigente
  }
];*/

const GraficoPie = () => {
    const [data, setData] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuesta = await obtenerClienteMembresias();

        // ⚡ transforma el JSON al formato que necesita Nivo Pie
        if (respuesta && respuesta.length > 0) {
          const raw = respuesta[0];
          const datosTransformados = [
            {
              id: "Clientes Activos",
              label: "Clientes Activos",
              value: raw.clientes_Activos
            },
            {
              id: "Clientes con Membresía Vigente",
              label: "Clientes con Membresía Vigente",
              value: raw.clientes_con_Membresia_Vigente
            }
          ] //.filter(item => item.value > 0); // 👈 opcional: eliminar valores 0

          setData(datosTransformados);
          
        }
      } catch (error) {
        console.error("Error cargando datos del gráfico:", error);
      }
    };

    cargarDatos();
  }, []);


  return (
    <div style={{ height: 400 }}>
      <h2>Clientes</h2>
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
         legends={[
            {
                 anchor: 'bottom',
                direction: 'column',
                translateX: -200,
                translateY: 64,
                itemWidth: 100,
                itemHeight: 18,
                symbolShape: 'circle'
            }
        ]}

        
      />
    </div>
  );
}

export default GraficoPie;
