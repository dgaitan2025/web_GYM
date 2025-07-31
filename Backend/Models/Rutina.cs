using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class Rutina
{
    public int IdRutina { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public string? Objetivo { get; set; }

    public bool? Estado { get; set; }

    public virtual ICollection<RegistroDiario> RegistroDiarios { get; set; } = new List<RegistroDiario>();

    public virtual ICollection<RutinasGrupo> RutinasGrupos { get; set; } = new List<RutinasGrupo>();
}
