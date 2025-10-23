import { useOutletContext } from "react-router-dom";
import GraficoPie from "../Graficas/GraficoPie";
import GraficoBar from "../Graficas/GraficoCliente"
import GraficoRG from "../Graficas/GraficoEntrenadorGM"
import VistaInicioComun from "../Vistas/VistaInicioComun"
import { RequireRole } from "../Funciones/PrivateRoute";
// import Membresias from "../Graficas/Membresias";

export default function DashContent() {
  const { view } = useOutletContext(); // { view: "GraficoPie" | "Membresias" | null }

  switch (view) {
    case "GraficoPie":
      return <RequireRole roles={[1,2]}><GraficoPie /></RequireRole>;
    case "GrupoMuscular":
      return <RequireRole roles={[1,4]}><GraficoBar /></RequireRole>;
    case "RutinasMusculos":
      return <RequireRole roles={[1,3]}><GraficoRG /></RequireRole>;
    default:
      return <VistaInicioComun />; 
  }
}