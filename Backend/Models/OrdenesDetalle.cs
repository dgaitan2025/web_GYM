using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class OrdenesDetalle
{
    public long IdDetalle { get; set; }

    public long IdFactura { get; set; }

    public int IdMetodo { get; set; }

    public decimal Monto { get; set; }

    public long Referencia { get; set; }

    public int? IdMembresia { get; set; }

    public virtual Ordene IdFacturaNavigation { get; set; } = null!;

    public virtual Membresia? IdMembresiaNavigation { get; set; }

    public virtual MetodosPago IdMetodoNavigation { get; set; } = null!;
}
