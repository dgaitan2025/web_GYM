using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class MetodosPago
{
    public int IdMetodo { get; set; }

    public string Descripcion { get; set; } = null!;

    public bool? Estado { get; set; }

    public virtual ICollection<FacturasDetalle> FacturasDetalles { get; set; } = new List<FacturasDetalle>();
}
