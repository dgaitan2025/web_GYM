using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class Asistencium
{
    public long IdAsistencia { get; set; }

    public DateTime FechaIngreso { get; set; }

    public int IdUsuario { get; set; }

    public int IdSucursal { get; set; }

    public virtual Sucursale IdSucursalNavigation { get; set; } = null!;

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;

    public virtual ICollection<RegistroDiario> RegistroDiarios { get; set; } = new List<RegistroDiario>();
}
