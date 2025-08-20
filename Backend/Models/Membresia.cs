using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class Membresia
{
    public int IdMembresia { get; set; }

    public string Descripcion { get; set; } = null!;

    public string? Beneficios { get; set; }

    public int Costo { get; set; }

    public bool? Estado { get; set; }

    public virtual ICollection<Cliente> Clientes { get; set; } = new List<Cliente>();
}
