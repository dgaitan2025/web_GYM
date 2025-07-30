import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeSite from "./Front/HomeSite";
import Login from "./Front/Login";
import SiteDinamic from "./Front/SiteDinamic";
import FormRegUsuario from "./Formularios/FormRegUsuario";
import PrivateRoute from "./Funciones/PrivateRoute";
import VistaUsuarios from "./Vistas/VistaUsuarios";
import VistaEnConstruccion from "./Vistas/VistaEnConstruccion";

function App() {
  const usersData = [
    { id: "03", name: "Juan Perez", dpi: "#123-456ABC", status: "Vigente", expiration: "2025", attendance: "14/05/2025" },
    { id: "04", name: "Maria Lopez", dpi: "#123-456ABC", status: "Vencida", expiration: "2025", attendance: "14/05/2025" },
    { id: "05", name: "Ricardo Mendez", dpi: "#123-456ABC", status: "Vigente", expiration: "2025", attendance: "14/05/2025" },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeSite />} />
        <Route path="/login" element={<Login />} />
        <Route path="/FormRegUsuario" element={<FormRegUsuario />} />

        {/* ✅ RUTA PADRE CON RUTAS ANIDADAS */}
        <Route path="/SiteDinamic" element={<PrivateRoute><SiteDinamic /></PrivateRoute>}>
          {/* ✅ RUTA HIJA */}
          <Route index element={<VistaEnConstruccion />}/>
          <Route path="VistaUsuarios" element={<VistaUsuarios usersData={usersData} />}/>
          <Route path="EnConstruccion" element={<VistaEnConstruccion />}/>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
