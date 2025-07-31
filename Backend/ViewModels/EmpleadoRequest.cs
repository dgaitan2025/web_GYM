namespace Api_Empleados.ViewModels
{
    public class EmpleadoUsuarioUpdateViewModel
    {
        public EmpleadoRequest Empleado { get; set; }
        public UsuarioViewModel Usuario { get; set; }
    }
    public class EmpleadoRequest
    {
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public long Telefono { get; set; }
        public string Correo { get; set; }
        public int IdSucursal { get; set; }
        public int IdTipoUsuario { get; set; }
    }
}
