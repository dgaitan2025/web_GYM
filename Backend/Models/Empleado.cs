using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class Empleado
{
    public int IdEmpleado { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public long Telefono { get; set; }

    public string? Correo { get; set; }

    public int IdSucursal { get; set; }

    public int IdUsuario { get; set; }

    public bool? Estado { get; set; }

    public virtual Sucursale IdSucursalNavigation { get; set; } = null!;

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;
}
