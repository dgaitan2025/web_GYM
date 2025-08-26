import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeSite from "./Front/HomeSite";
import Login from "./Front/Login";
import SiteDinamic from "./Front/SiteDinamic";
import FormRegUsuario from "./Formularios/FormRegUsuario"; //formulario usuarios
import { PrivateRoute, RequireRole }  from "./Funciones/PrivateRoute";
import DashContent from "./Graficas/DashContent";
import VistaUsuarios from "./Vistas/VistaUsuarios";
import VistaEmpleados from "./Vistas/VistaEmpleados";
import VistaEnConstruccion from "./Vistas/VistaEnConstruccion";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import VistaDashAdmin from "./Vistas/VistaDashAdmin"

function App() {


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
          <Route path="VistaDashAdmin" element={<RequireRole roles={[1,4]}><VistaDashAdmin /></RequireRole>}>
            {/* Hijas (dashboards) */}
            <Route index element={<DashContent />} />
          </Route>
            
          <Route path="VistaUsuarios" element={<RequireRole roles={[1,2]}><VistaUsuarios/></RequireRole>}/>
          <Route path="VistaEmpleados" element={<RequireRole roles={[1,2]}><VistaEmpleados /></RequireRole>}/>
          <Route path="EnConstruccion" element={<VistaEnConstruccion />}/>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
