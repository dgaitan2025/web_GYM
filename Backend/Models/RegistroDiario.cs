using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class RegistroDiario
{
    public long IdRegistro { get; set; }

    public long IdAsistencia { get; set; }

    public int IdRutina { get; set; }

    public string? Comentarios { get; set; }

    public bool? Estado { get; set; }

    public virtual Asistencium IdAsistenciaNavigation { get; set; } = null!;

    public virtual Rutina IdRutinaNavigation { get; set; } = null!;
}
