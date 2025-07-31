using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class SucursalesCliente
{
    public int IdRegistro { get; set; }

    public int IdUsuario { get; set; }

    public int IdSucursal { get; set; }

    public virtual Sucursale IdSucursalNavigation { get; set; } = null!;

    public virtual Cliente IdUsuarioNavigation { get; set; } = null!;
}
