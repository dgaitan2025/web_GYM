// DOminio
export const URL = "https://www.apitect.somee.com"//"http://localhost:5230"; //DG
const API_URL = "https://Compiladores2025.somee.com"//"https://localhost:7288" //"https://Compiladores2025.somee.com"; //RD


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
  reporteAsistenciaPorCliente: "/api/Reportes/Asistencia_FechayCliente?base64=false",
  reportePorcentajeAsistencia: "/api/Reportes/RptAsistenciaRachaDia?base64=false",
  reporteRutinasAsistencia: "/api/Reportes/RptRutinasPorAsistencia?base64=false",
  reporteIngresosPorCliente: "/api/Reportes/RptControlIngresosPorCliente?base64=false",
  reporteIngresosPorFecha: "/api/Reportes/RptTotalIngresosPorFecha?base64=false", 
  asistencia:"/api/Asistenciums/AsistenciaCrear",
  clientesAsistencia:"/api/Asistenciums/AsistenciaDelDia",
  clienteSalida:(id) =>`/api/Asistenciums/AsistenciaActualizar/${id}`,
  asignarRutina: "/api/Registro_Diario/RegistroCrear",
  dashEntrenador: "/api/DashBoard/GruposporRutinas",
  rutinaClienteAsig:(id) => `/api/Registro_Diario/RegistroListarPorUsuario/${id}`,
  rutinaFinalizar:(id) =>`/api/Registro_Diario/RegistroFinalizar/${id}`,
  dashCliente: (id)=>`/api/DashBoard/MusculosMasTrabajadosPorCliente/${id}`,
  dashAsistencia: "/api/DashBoard/EntradasySalidasDelDia"


};

// Helper para armar URLs completas
export const UrlWithApi = (endpoint) => `${API_URL}${endpoint}`;
export const UrlWithApiDG = (endpoint) => `${URL}${endpoint}`;