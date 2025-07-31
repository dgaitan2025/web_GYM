using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class TiposUsuario
{
    public int IdTipo { get; set; }

    public string Descripcion { get; set; } = null!;

    public bool? Estado { get; set; }

    public virtual ICollection<AsignacionesPermiso> AsignacionesPermisos { get; set; } = new List<AsignacionesPermiso>();

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
