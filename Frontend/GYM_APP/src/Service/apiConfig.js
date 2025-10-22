// DOminio
export const URL = "http://localhost:5230"; //DG
const API_URL = "https://localhost:7288" //"https://Compiladores2025.somee.com"; //RD


// Endpoints organizados
export const ENDPOINTS = {
  //Darwin
  listarPuestos: "/api/TipoUsuarios",
  listarGrupoMuscular: "/api/GrupoMusculares/ALL",
  optenerGrupoMuscular: (id) => `/api/GrupoMusculares/${id}`,
  actualizarGrupoMuscular: "/api/GrupoMusculares/Actualizar",
  elimindarGrupoMuscular:"/api/GrupoMusculares/Eliminar",
  insertarGrupoMuscular: "/api/GrupoMusculares/Crear",
  listarRutinas: "/api/Rutinas/ALL",
  insetarRutina: "/api/Rutinas/Crear",
  obtenerRutina: (id) => `/api/Rutinas/${id}`,
  actualizarRutina: "/api/Rutinas/Actualizar",
  eliminarRutina:"/api/Rutinas/Eliminar",
  rutinasPorGrupo:"/api/Rutinas/RutinaPorGrupo",
  obtenerDatosOrden: (idUsuario) => `/api/Rutinas/ObtenerDatosOrden/${idUsuario}`,


  //Ricardo
  listarMembresias:"/api/Clientes/listarmembresias",
  listarSucursales:"/api/sucursales/sucursalesindex",
  login:"/api/Login/login",
  DasboarAdmin:"/api/DashBoard/ClientesTotales_Y_PorMembresia",
  indexClientes:"/api/Clientes/ClientesIndex",
  indexEmpleados:"/api/Empleadoes/EmpleadosIndex",
  insertCliente: "/api/Clientes/ClientesCrear",
  insertEmpleado: "/api/empleadoes/EmpleadosCrear",
  recuperarClave:"/api/Login/RecuperarContraseña",
  obtenerCliente: (id) => `/api/Clientes/ClientesDetails/${id}`,
  actualizarCliente: (id) => `/api/Clientes/ClientesActualizar/${id}`,
  crearOrden:"/api/Ordenes/OrdenesCrear",
  eliminarCliente:(id) =>`/api/Clientes/ClientesEliminar/${id}`,
  datosEmpleado:(id) =>`/api/Empleadoes/EmpleadosDetails/${id}`,
  empleadoActualizar: (id)=>`/api/Empleadoes/EmpleadosActualizar/${id}`,
  eliminarCliente: (id) =>`/api/Empleadoes/EmpleadosEliminar/${id}`,
  reporteClientes: "/api/Reportes/RptClienteIndex?base64=false",
  asistencia:"/api/Asistenciums/AsistenciaCrear"


};

// Helper para armar URLs completas
export const UrlWithApi = (endpoint) => `${API_URL}${endpoint}`;
export const UrlWithApiDG = (endpoint) => `${URL}${endpoint}`;