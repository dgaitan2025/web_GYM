// DOminio
export const URL = "http://localhost:5230"; //DG
const API_URL = "https://Compiladores2025.somee.com"; //RD


// Endpoints organizados
export const ENDPOINTS = {
  //Darwin
  listarPuestos: "/api/TipoUsuarios",
  listarGrupoMuscular: "/api/GrupoMusculares/ALL",
  optenerGrupoMuscular: (id) => `/api/GrupoMusculares/${id}`,
  actualizarGrupoMuscular: "/api/GrupoMusculares/Actualizar",
  elimindarGrupoMuscular:"/api/GrupoMusculares/Eliminar",

  //Ricardo
  listarMembresias:"/api/Clientes/listarmembresias",
  listarSucursales:"/api/sucursales/sucursalesindex",
  login:"/api/Login/login",
  DasboarAdmin:"/api/DashBoard/ClientesTotales_Y_PorMembresia",
  indexClientes:"/api/Clientes/ClientesIndex",
  indexEmpleados:"/api/Empleadoes/EmpleadosIndex",
  insertCliente: "/api/Clientes/ClientesCrear",
  insertEmpleado: "/api/empleadoes/EmpleadosCrear",
  recuperarClave:"/api/Login/RecuperarContraseña"


};

// Helper para armar URLs completas
export const UrlWithApi = (endpoint) => `${API_URL}${endpoint}`;
export const UrlWithApiDG = (endpoint) => `${URL}${endpoint}`;