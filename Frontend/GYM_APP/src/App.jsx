import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeSite from "./Front/HomeSite";
import Login from "./Front/Login";
import SiteDinamic from "./Front/SiteDinamic";
import FormRegUsuario from "./Formularios/FormRegUsuario"; //formulario usuarios
import PrivateRoute from "./Funciones/PrivateRoute";
import VistaUsuarios from "./Vistas/VistaUsuarios";
import VistaEnConstruccion from "./Vistas/VistaEnConstruccion";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const usersData = [
    { name: "Juan Perez", dpi: "#123-456ABC", status: "Vigente"},
    { name: "Maria Lopez", dpi: "#123-456ABC", status: "Vencida"},
    { name: "Ricardo Mendez", dpi: "#123-456ABC", status: "Vigente"},
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
