using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class ClientesMembresia
{
    public int IdRegistro { get; set; }

    public int? IdCliente { get; set; }

    public int? IdMembresia { get; set; }

    public DateOnly? FechaInicio { get; set; }

    public DateOnly? FechaFin { get; set; }

    public virtual Cliente? IdClienteNavigation { get; set; }

    public virtual Membresia? IdMembresiaNavigation { get; set; }
}
