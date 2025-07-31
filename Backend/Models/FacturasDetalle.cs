using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class FacturasDetalle
{
    public long IdDetalle { get; set; }

    public long IdFactura { get; set; }

    public int IdMetodo { get; set; }

    public decimal Monto { get; set; }

    public long Referencia { get; set; }

    public virtual Factura IdFacturaNavigation { get; set; } = null!;

    public virtual MetodosPago IdMetodoNavigation { get; set; } = null!;
}
