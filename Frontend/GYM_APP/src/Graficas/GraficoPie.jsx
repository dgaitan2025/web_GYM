import { ResponsivePie } from '@nivo/pie';

const data = [
  { id: "ventas", label: "Ventas", value: 400 },
  { id: "marketing", label: "Marketing", value: 300 },
  { id: "soporte", label: "Soporte", value: 200 },
  { id: "desarrollo", label: "Desarrollo", value: 450 },
];






const GraficoPie = () => {

   return (
    <div style={{ height: 400, alignItems:100, position:"center" }}>
      <h1>Data</h1>
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
      />
    </div>
  );
}

export default GraficoPie;