using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class GruposMusculare
{
    public int IdGrupo { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public bool? Estado { get; set; }

    public virtual ICollection<RutinasGrupo> RutinasGrupos { get; set; } = new List<RutinasGrupo>();
}
