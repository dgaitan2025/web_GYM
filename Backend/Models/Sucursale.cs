using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class Sucursale
{
    public int IdSucursal { get; set; }

    public string Descripion { get; set; } = null!;

    public bool? Estado { get; set; }

    public virtual ICollection<Asistencium> Asistencia { get; set; } = new List<Asistencium>();

    public virtual ICollection<Empleado> Empleados { get; set; } = new List<Empleado>();

    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();

    public virtual ICollection<SucursalesCliente> SucursalesClientes { get; set; } = new List<SucursalesCliente>();
}
