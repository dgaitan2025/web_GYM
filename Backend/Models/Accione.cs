using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class Accione
{
    public int IdAccion { get; set; }

    public int IdControlador { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public bool? Estado { get; set; }

    public virtual ICollection<AsignacionesPermiso> AsignacionesPermisos { get; set; } = new List<AsignacionesPermiso>();

    public virtual Controladore IdControladorNavigation { get; set; } = null!;
}
