using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class RutinasGrupo
{
    public int IdRelacion { get; set; }

    public int IdRutina { get; set; }

    public int IdGrupoMuscular { get; set; }

    public virtual GruposMusculare IdGrupoMuscularNavigation { get; set; } = null!;

    public virtual Rutina IdRutinaNavigation { get; set; } = null!;
}
