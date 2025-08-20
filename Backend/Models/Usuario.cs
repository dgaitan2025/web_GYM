using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class Usuario
{
    public int IdUsuario { get; set; }

    public string Usuario1 { get; set; } = null!;

    public byte[] Contraseña { get; set; } = null!;

    public int IdTipo { get; set; }

    public bool? Estado { get; set; }

    public virtual ICollection<AsignacionesPermiso> AsignacionesPermisos { get; set; } = new List<AsignacionesPermiso>();

    public virtual ICollection<Asistencium> Asistencia { get; set; } = new List<Asistencium>();

    public virtual ICollection<Cliente> Clientes { get; set; } = new List<Cliente>();

    public virtual ICollection<Empleado> Empleados { get; set; } = new List<Empleado>();

    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();

    public virtual TiposUsuario IdTipoNavigation { get; set; } = null!;
}
