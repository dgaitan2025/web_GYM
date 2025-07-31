namespace Api_Empleados.ViewModels
{
    public class UsuarioViewModel
    {
        public int IdUsuario { get; set; }
        public string Usuario { get; set; }
        public string Contraseña { get; set; } // En login será el texto plano, en edición puede venir ya encriptada
        public int IdTipo { get; set; }
    }
}
