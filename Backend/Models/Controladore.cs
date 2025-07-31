using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class Controladore
{
    public int IdControlador { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public bool? Estado { get; set; }

    public virtual ICollection<Accione> Acciones { get; set; } = new List<Accione>();
}
