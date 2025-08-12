using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class Ordene
{
    public long IdFactura { get; set; }

    public int IdUsuario { get; set; }

    public DateTime FechaEmision { get; set; }

    public int Total { get; set; }

    public int IdSucursal { get; set; }

    public bool? Estado { get; set; }

    public virtual Sucursale IdSucursalNavigation { get; set; } = null!;

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;

    public virtual ICollection<OrdenesDetalle> OrdenesDetalles { get; set; } = new List<OrdenesDetalle>();
}
