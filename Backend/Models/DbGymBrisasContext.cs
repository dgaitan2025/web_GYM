using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Api_Empleados.Models;

public partial class DbGymBrisasContext : DbContext
{
    public DbGymBrisasContext()
    {
    }

    public DbGymBrisasContext(DbContextOptions<DbGymBrisasContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Accione> Acciones { get; set; }

    public virtual DbSet<AsignacionesPermiso> AsignacionesPermisos { get; set; }

    public virtual DbSet<Asistencium> Asistencia { get; set; }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Controladore> Controladores { get; set; }

    public virtual DbSet<Empleado> Empleados { get; set; }

    public virtual DbSet<Factura> Facturas { get; set; }

    public virtual DbSet<FacturasDetalle> FacturasDetalles { get; set; }

    public virtual DbSet<GruposMusculare> GruposMusculares { get; set; }

    public virtual DbSet<Membresia> Membresias { get; set; }

    public virtual DbSet<MetodosPago> MetodosPagos { get; set; }

    public virtual DbSet<RegistroDiario> RegistroDiarios { get; set; }

    public virtual DbSet<Rutina> Rutinas { get; set; }

    public virtual DbSet<RutinasGrupo> RutinasGrupos { get; set; }

    public virtual DbSet<Sucursale> Sucursales { get; set; }

    public virtual DbSet<SucursalesCliente> SucursalesClientes { get; set; }

    public virtual DbSet<TiposUsuario> TiposUsuarios { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<VwClientesDetalle> VwClientesDetalles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
    //=> optionsBuilder.UseSqlServer("Server=DESKTOP-JVIPVHC\\MSSQLSERVER01;Database=db_GymBrisas;Trusted_Connection=True;TrustServerCertificate=True;");
        => optionsBuilder.UseSqlServer("Data Source=db_GymBrisas.mssql.somee.com;Initial Catalog=db_GymBrisas;User ID=Ricardo802_SQLLogin_1;Password=jud5snrpzl;Packet Size=4096;Persist Security Info=False;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Accione>(entity =>
        {
            entity.HasKey(e => e.IdAccion).HasName("PK__Acciones__9845169BAACC826F");

            entity.Property(e => e.Descripcion).HasColumnType("text");
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.IdControladorNavigation).WithMany(p => p.Acciones)
                .HasForeignKey(d => d.IdControlador)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Acciones__IdCont__1DB06A4F");
        });

        modelBuilder.Entity<AsignacionesPermiso>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Asignaci__3214EC074EBF5624");

            entity.Property(e => e.IdTipoUsuario).HasDefaultValueSql("(NULL)");
            entity.Property(e => e.IdUsuario).HasDefaultValueSql("(NULL)");

            entity.HasOne(d => d.IdAccionNavigation).WithMany(p => p.AsignacionesPermisos)
                .HasForeignKey(d => d.IdAccion)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Asignacio__IdAcc__25518C17");

            entity.HasOne(d => d.IdTipoUsuarioNavigation).WithMany(p => p.AsignacionesPermisos)
                .HasForeignKey(d => d.IdTipoUsuario)
                .HasConstraintName("FK__Asignacio__IdTip__245D67DE");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.AsignacionesPermisos)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK__Asignacio__IdUsu__236943A5");
        });

        modelBuilder.Entity<Asistencium>(entity =>
        {
            entity.HasKey(e => e.IdAsistencia).HasName("PK__Asistenc__20240AC4E01D2391");

            entity.HasIndex(e => e.IdSucursal, "IX_Asistencia_Id_Sucursal");

            entity.HasIndex(e => e.IdUsuario, "IX_Asistencia_Id_Usuario");

            entity.Property(e => e.IdAsistencia).HasColumnName("Id_Asistencia");
            entity.Property(e => e.FechaIngreso)
                .HasColumnType("datetime")
                .HasColumnName("Fecha_Ingreso");
            entity.Property(e => e.IdSucursal).HasColumnName("Id_Sucursal");
            entity.Property(e => e.IdUsuario).HasColumnName("Id_Usuario");

            entity.HasOne(d => d.IdSucursalNavigation).WithMany(p => p.Asistencia)
                .HasForeignKey(d => d.IdSucursal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Asistencia_Sucursal");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Asistencia)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Asistencia_Usuario");
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.IdCliente).HasName("PK__Clientes__3DD0A8CB84CA8B7F");

            entity.HasIndex(e => e.IdMembresia, "IX_Clientes_Id_Membresia");

            entity.Property(e => e.IdCliente).HasColumnName("Id_Cliente");
            entity.Property(e => e.Apellido)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Correo)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
            entity.Property(e => e.FechaNacimiento).HasColumnName("Fecha_Nacimiento");
            entity.Property(e => e.Foto).HasColumnType("text");
            entity.Property(e => e.IdMembresia).HasColumnName("Id_Membresia");
            entity.Property(e => e.IdUsuario).HasColumnName("Id_Usuario");
            entity.Property(e => e.Nombre)
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.IdMembresiaNavigation).WithMany(p => p.Clientes)
                .HasForeignKey(d => d.IdMembresia)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Clientes_Membresia");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Clientes)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Clientes_Usuario");
        });

        modelBuilder.Entity<Controladore>(entity =>
        {
            entity.HasKey(e => e.IdControlador).HasName("PK__Controla__1344D62B31419E26");

            entity.HasIndex(e => e.Nombre, "UQ__Controla__75E3EFCF39054417").IsUnique();

            entity.Property(e => e.Descripcion).HasColumnType("text");
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Empleado>(entity =>
        {
            entity.HasKey(e => e.IdEmpleado).HasName("PK__Empleado__7405622355DCE986");

            entity.HasIndex(e => e.IdSucursal, "IX_Empleados_Id_Sucursal");

            entity.Property(e => e.IdEmpleado).HasColumnName("Id_Empleado");
            entity.Property(e => e.Apellido)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Correo)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
            entity.Property(e => e.IdSucursal).HasColumnName("Id_Sucursal");
            entity.Property(e => e.IdUsuario).HasColumnName("Id_Usuario");
            entity.Property(e => e.Nombre)
                .HasMaxLength(150)
                .IsUnicode(false);

            entity.HasOne(d => d.IdSucursalNavigation).WithMany(p => p.Empleados)
                .HasForeignKey(d => d.IdSucursal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Empleados_Sucursal");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Empleados)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Empleados_Usuario");
        });

        modelBuilder.Entity<Factura>(entity =>
        {
            entity.HasKey(e => e.IdFactura).HasName("PK__Facturas__A6DB93626730DBA0");

            entity.HasIndex(e => e.IdSucursal, "IX_Facturas_Id_Sucursal");

            entity.HasIndex(e => e.IdUsuario, "IX_Facturas_Id_Usuario");

            entity.Property(e => e.IdFactura).HasColumnName("Id_factura");
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
            entity.Property(e => e.FechaEmision)
                .HasColumnType("datetime")
                .HasColumnName("Fecha_Emision");
            entity.Property(e => e.IdSucursal).HasColumnName("Id_Sucursal");
            entity.Property(e => e.IdUsuario).HasColumnName("Id_Usuario");

            entity.HasOne(d => d.IdSucursalNavigation).WithMany(p => p.Facturas)
                .HasForeignKey(d => d.IdSucursal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Facturas_Sucursal");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.Facturas)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Facturas_Usuario");
        });

        modelBuilder.Entity<FacturasDetalle>(entity =>
        {
            entity.HasKey(e => e.IdDetalle).HasName("PK__Facturas__9274780B933AF07F");

            entity.ToTable("Facturas_Detalles");

            entity.HasIndex(e => e.IdFactura, "IX_Facturas_Detalles_Id_Factura");

            entity.Property(e => e.IdDetalle).HasColumnName("Id_Detalle");
            entity.Property(e => e.IdFactura).HasColumnName("Id_Factura");
            entity.Property(e => e.IdMetodo).HasColumnName("Id_Metodo");
            entity.Property(e => e.Monto).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.IdFacturaNavigation).WithMany(p => p.FacturasDetalles)
                .HasForeignKey(d => d.IdFactura)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FacturasDetalles_Factura");

            entity.HasOne(d => d.IdMetodoNavigation).WithMany(p => p.FacturasDetalles)
                .HasForeignKey(d => d.IdMetodo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FacturasDetalles_Metodo");
        });

        modelBuilder.Entity<GruposMusculare>(entity =>
        {
            entity.HasKey(e => e.IdGrupo).HasName("PK__Grupos_M__ACDDD978004B8A63");

            entity.ToTable("Grupos_Musculares");

            entity.Property(e => e.IdGrupo).HasColumnName("Id_Grupo");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
            entity.Property(e => e.Nombre)
                .HasMaxLength(70)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Membresia>(entity =>
        {
            entity.HasKey(e => e.IdMembresia).HasName("PK__Membresi__E6D521E86A168304");

            entity.Property(e => e.IdMembresia).HasColumnName("Id_Membresia");
            entity.Property(e => e.Beneficios)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Descripcion)
                .HasMaxLength(70)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
        });

        modelBuilder.Entity<MetodosPago>(entity =>
        {
            entity.HasKey(e => e.IdMetodo).HasName("PK__Metodos___BDBEE834B48E63A9");

            entity.ToTable("Metodos_Pagos");

            entity.Property(e => e.IdMetodo).HasColumnName("Id_Metodo");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
        });

        modelBuilder.Entity<RegistroDiario>(entity =>
        {
            entity.HasKey(e => e.IdRegistro).HasName("PK__Registro__3E5D8D4E837EA724");

            entity.ToTable("Registro_Diario");

            entity.HasIndex(e => e.IdAsistencia, "IX_Registro_Diario_Id_Asistencia");

            entity.HasIndex(e => e.IdRutina, "IX_Registro_Diario_Id_Rutina");

            entity.Property(e => e.IdRegistro).HasColumnName("Id_Registro");
            entity.Property(e => e.Comentarios)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
            entity.Property(e => e.IdAsistencia).HasColumnName("Id_Asistencia");
            entity.Property(e => e.IdRutina).HasColumnName("Id_Rutina");

            entity.HasOne(d => d.IdAsistenciaNavigation).WithMany(p => p.RegistroDiarios)
                .HasForeignKey(d => d.IdAsistencia)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RegistroDiario_Asistencia");

            entity.HasOne(d => d.IdRutinaNavigation).WithMany(p => p.RegistroDiarios)
                .HasForeignKey(d => d.IdRutina)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RegistroDiario_Rutina");
        });

        modelBuilder.Entity<Rutina>(entity =>
        {
            entity.HasKey(e => e.IdRutina).HasName("PK__Rutinas__7C95EE40A79FD13B");

            entity.Property(e => e.IdRutina).HasColumnName("Id_Rutina");
            entity.Property(e => e.Descripcion).IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
            entity.Property(e => e.Nombre)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Objetivo)
                .HasMaxLength(70)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RutinasGrupo>(entity =>
        {
            entity.HasKey(e => e.IdRelacion).HasName("PK__Rutinas___2225CC0911E8B90C");

            entity.ToTable("Rutinas_Grupos");

            entity.HasIndex(e => e.IdGrupoMuscular, "IX_Rutinas_Grupos_Id_GrupoMuscular");

            entity.HasIndex(e => e.IdRutina, "IX_Rutinas_Grupos_Id_Rutina");

            entity.Property(e => e.IdRelacion).HasColumnName("Id_Relacion");
            entity.Property(e => e.IdGrupoMuscular).HasColumnName("Id_GrupoMuscular");
            entity.Property(e => e.IdRutina).HasColumnName("Id_Rutina");

            entity.HasOne(d => d.IdGrupoMuscularNavigation).WithMany(p => p.RutinasGrupos)
                .HasForeignKey(d => d.IdGrupoMuscular)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RutinasGrupos_Grupo");

            entity.HasOne(d => d.IdRutinaNavigation).WithMany(p => p.RutinasGrupos)
                .HasForeignKey(d => d.IdRutina)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_RutinasGrupos_Rutina");
        });

        modelBuilder.Entity<Sucursale>(entity =>
        {
            entity.HasKey(e => e.IdSucursal).HasName("PK__Sucursal__02EDB3EAA0AF7DE6");

            entity.Property(e => e.IdSucursal).HasColumnName("Id_Sucursal");
            entity.Property(e => e.Descripion)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
        });

        modelBuilder.Entity<SucursalesCliente>(entity =>
        {
            entity.HasKey(e => e.IdRegistro).HasName("PK__Sucursal__3E5D8D4E34C90009");

            entity.ToTable("Sucursales_Clientes");

            entity.Property(e => e.IdRegistro).HasColumnName("Id_Registro");
            entity.Property(e => e.IdSucursal).HasColumnName("Id_Sucursal");
            entity.Property(e => e.IdUsuario).HasColumnName("Id_Usuario");

            entity.HasOne(d => d.IdSucursalNavigation).WithMany(p => p.SucursalesClientes)
                .HasForeignKey(d => d.IdSucursal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SucCli_Sucursal");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.SucursalesClientes)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SucCli_Usuario");
        });

        modelBuilder.Entity<TiposUsuario>(entity =>
        {
            entity.HasKey(e => e.IdTipo).HasName("PK__Tipos_Us__70A6B7E79CD03EB7");

            entity.ToTable("Tipos_Usuarios");

            entity.Property(e => e.IdTipo).HasColumnName("Id_tipo");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("PK__Usuarios__63C76BE267505FAA");

            entity.HasIndex(e => e.IdTipo, "IX_Usuarios_Id_Tipo");

            entity.Property(e => e.IdUsuario).HasColumnName("Id_Usuario");
            entity.Property(e => e.Estado)
                .HasDefaultValue(true)
                .HasColumnName("estado");
            entity.Property(e => e.IdTipo).HasColumnName("Id_Tipo");
            entity.Property(e => e.Usuario1)
                .HasMaxLength(70)
                .IsUnicode(false)
                .HasColumnName("Usuario");

            entity.HasOne(d => d.IdTipoNavigation).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.IdTipo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Usuarios_Tipo");
        });

        modelBuilder.Entity<VwClientesDetalle>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("VW_Clientes_Detalles");

            entity.Property(e => e.Apellido)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Correo)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.FechaNacimiento).HasColumnName("Fecha_Nacimiento");
            entity.Property(e => e.Foto).HasColumnType("text");
            entity.Property(e => e.IdCliente).HasColumnName("Id_Cliente");
            entity.Property(e => e.IdMembresia).HasColumnName("Id_Membresia");
            entity.Property(e => e.IdTipo).HasColumnName("Id_Tipo");
            entity.Property(e => e.IdUsuario).HasColumnName("Id_Usuario");
            entity.Property(e => e.Nombre)
                .HasMaxLength(150)
                .IsUnicode(false);
            entity.Property(e => e.Usuario)
                .HasMaxLength(70)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
