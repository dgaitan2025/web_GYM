using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class AsignacionesPermiso
{
    public int Id { get; set; }

    public int? IdUsuario { get; set; }

    public int? IdTipoUsuario { get; set; }

    public int IdAccion { get; set; }

    public bool EsDenegado { get; set; }

    public virtual Accione IdAccionNavigation { get; set; } = null!;

    public virtual TiposUsuario? IdTipoUsuarioNavigation { get; set; }

    public virtual Usuario? IdUsuarioNavigation { get; set; }
}
