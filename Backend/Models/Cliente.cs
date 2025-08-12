using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class Cliente
{
    public int IdCliente { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public long? Telefono { get; set; }

    public DateOnly FechaNacimiento { get; set; }

    public string? Foto { get; set; }

    public string? Correo { get; set; }

    public int IdUsuario { get; set; }

    public int IdMembresia { get; set; }

    public bool? Estado { get; set; }

    public string? NumeroIdentificacion { get; set; }

    public virtual ICollection<ClientesMembresia> ClientesMembresia { get; set; } = new List<ClientesMembresia>();

    public virtual Membresia IdMembresiaNavigation { get; set; } = null!;

    public virtual Usuario IdUsuarioNavigation { get; set; } = null!;

    public virtual ICollection<SucursalesCliente> SucursalesClientes { get; set; } = new List<SucursalesCliente>();
}
