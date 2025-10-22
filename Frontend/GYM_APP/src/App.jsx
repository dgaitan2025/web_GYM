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
import VistaRutinas from "./Vistas/VistaRutinas"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import VistaDashAdmin from "./Vistas/VistaDashAdmin"
import VistaAsistencia from "./Vistas/VistaAsistencia"
import VistaAsigRutina from "./Vistas/VistaAsigRutina"
import VistaAsigRutinaCliente from "./Vistas/VistaAsigRutinaCliente"
import VistaInicioComun from "./Vistas/VistaInicioComun"
import VistaReportes from "./Vistas/VistaReportes"

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
          <Route index element={<VistaInicioComun />}/>
          <Route path="VistaDashAdmin" element={<RequireRole roles={[1,4]}><VistaDashAdmin /></RequireRole>}>
            {/* Hijas (dashboards) */}
            <Route index element={<DashContent />} />
          </Route>
            
          <Route path="VistaUsuarios" element={<RequireRole roles={[1,2]}><VistaUsuarios/></RequireRole>}/>
          <Route path="VistaEmpleados" element={<RequireRole roles={[1,2]}><VistaEmpleados /></RequireRole>}/>
          <Route path="VistaRutinas" element={<RequireRole roles={[3]}><VistaRutinas /></RequireRole>}/>
          <Route path="VistaAsigRutina" element={<RequireRole roles={[3]}><VistaAsigRutina /></RequireRole>}/>
          <Route path="VistaAsistencia" element={<RequireRole roles={[2]}><VistaAsistencia/></RequireRole>}/>
          <Route path="VistaAsigRutinaCliente" element={<RequireRole roles={[3]}><VistaAsigRutinaCliente/></RequireRole>}/>
          <Route path="VistaReportes" element={<RequireRole roles={[1]}><VistaReportes/></RequireRole>}/>
          <Route path="EnConstruccion" element={<VistaEnConstruccion />}/>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
