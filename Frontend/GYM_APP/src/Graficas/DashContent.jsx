import { useOutletContext } from "react-router-dom";
import GraficoPie from "../Graficas/GraficoPie";
import VistaEnConstruccion from "../Vistas/VistaEnConstruccion";
import { RequireRole } from "../Funciones/PrivateRoute";
// import Membresias from "../Graficas/Membresias";

export default function DashContent() {
  const { view } = useOutletContext(); // { view: "GraficoPie" | "Membresias" | null }

  switch (view) {
    case "GraficoPie":
      return <RequireRole roles={[1,2]}><GraficoPie /></RequireRole>;
    // case "Membresias":
    //   return <Membresias />;
    default:
      return <VistaEnConstruccion />;
  }
}