namespace Api_Empleados.ViewModels
{
    public class ClientesUsuarioEditViewModel
    {
        public ClientesViewModel Clientes { get; set; }
        public UsuarioViewModel Usuario { get; set; }
    }
    public class ClientesViewModel
    {
        public string Nombre { get; set; } = null!;

        public string Apellido { get; set; } = null!;

        public long? Telefono { get; set; }

        public DateOnly FechaNacimiento { get; set; }

        public string? Foto { get; set; }

        public string? Correo { get; set; }

        public int IdTipoUsuario { get; set; }

        public int IdMembresia { get; set; }

        public int IdSucursal { get; set; }
    }

}
