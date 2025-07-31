using System;
using System.Collections.Generic;

namespace Api_Empleados.Models;

public partial class VwClientesDetalle
{
    public int IdCliente { get; set; }

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public long? Telefono { get; set; }

    public DateOnly FechaNacimiento { get; set; }

    public int? Edad { get; set; }

    public string? Foto { get; set; }

    public string? Correo { get; set; }

    public int IdMembresia { get; set; }

    public int IdUsuario { get; set; }

    public string Usuario { get; set; } = null!;

    public int IdTipo { get; set; }
}
