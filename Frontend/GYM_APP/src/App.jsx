import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeSite from "./Front/HomeSite";
import Login from "./Front/Login";
import SiteDinamic from "./Front/SiteDinamic";
import FormRegUsuario from "./Formularios/FormRegUsuario"
import PrivateRoute from "./Funciones/PrivateRoute";

function App() {
  return (
    <Router>
      {/* Navbar siempre fija */}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomeSite />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SiteDinamic" element={<PrivateRoute><SiteDinamic /></PrivateRoute>} />
          <Route path="/FormRegUsuario" element={<FormRegUsuario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;