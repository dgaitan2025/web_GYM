using Api_Empleados.Funciones;
using Api_Empleados.Models;
using Api_Empleados.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Api_Empleados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoesController : ControllerBase
    {
        private readonly DbGymBrisasContext _context;
        

        public EmpleadoesController(DbGymBrisasContext context)
        {
            _context = context;
        }

        // GET: api/Empleadoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Empleado>>> GetEmpleados()
        {
            var empleados = await _context.Empleados
                .Include(e => e.IdSucursalNavigation)
                .Include(e => e.IdUsuarioNavigation)
                .Select(e => new
                {
                    e.IdEmpleado,
                    e.Nombre,
                    e.Apellido,
                    e.Telefono,
                    e.Correo,
                    Sucursal = e.IdSucursalNavigation.Descripion,
                    Usuario = e.IdUsuarioNavigation.Usuario1
                })
                .ToListAsync();

            return Ok(empleados);
        }

        // GET: api/Empleadoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Empleado>> GetEmpleado(int id)
        {
            try
            {
                var empleado = await _context.Empleados
                    .Include(e => e.IdSucursalNavigation) // Relación con la tabla Sucursales
                    .Include(e => e.IdUsuarioNavigation)
                    .Where(e => e.IdEmpleado == id)
                    .Select(e => new
                    {
                        e.IdEmpleado,
                        e.Nombre,
                        e.Apellido,
                        e.Telefono,
                        e.Correo,
                        Sucursal = e.IdSucursalNavigation.Descripion,
                        Usuario = e.IdUsuarioNavigation.Usuario1 // Solo el nombre de usuario
                    })
                    .FirstOrDefaultAsync();

                if (empleado == null)
                {
                    return NotFound();
                }

                return Ok(empleado);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }


        }

        // PUT: api/Empleadoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmpleado(int id, Empleado empleado)
        {
            if (id != empleado.IdEmpleado)
            {
                return BadRequest();
            }

            _context.Entry(empleado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmpleadoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Empleadoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> PostEmpleado([FromBody] EmpleadoRequest empleado)
        {
            try
            {
                string connectionString = _context.Database.GetDbConnection().ConnectionString;
                string jsonResult;

                using (var conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    using (var cmd = new SqlCommand("SP_Empleados_Crear", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Nombre", empleado.Nombre);
                        cmd.Parameters.AddWithValue("@Apellido", empleado.Apellido);
                        cmd.Parameters.AddWithValue("@Telefono", empleado.Telefono);
                        cmd.Parameters.AddWithValue("@Correo", string.IsNullOrEmpty(empleado.Correo) ? (object)DBNull.Value : empleado.Correo);
                        cmd.Parameters.AddWithValue("@Id_Sucursal", empleado.IdSucursal);
                        cmd.Parameters.AddWithValue("@Id_Tipo", empleado.IdTipoUsuario);

                        // Como el SP retorna un JSON (FOR JSON PATH), lo obtenemos en una sola línea
                        jsonResult = (await cmd.ExecuteScalarAsync())?.ToString();

                        if (string.IsNullOrWhiteSpace(jsonResult))
                        {
                            return BadRequest(new { success = false, message = "No se recibió respuesta del SP." });
                        }
                        else 
                        {
                            //Armop esta variable uniamente con un no0mbre y apellido (en caso tuviera mas de uno) si quiero poner todo solo concateno variables
                            string nombre_persona = (empleado.Nombre.Split(' ')[0])+ " " + (empleado.Apellido.Split(' ')[0]);
                            //Armo la ruta hacia la plantilla para enviarla a la funcion para colocar el resto de elemento encima
                            var rutaPlantilla = Path.Combine("Recursos", "img", "Plantilla.png");
                            //Instancio la funcion para crear el carnet
                            var carnetGen = new CarnetGenerador();
                            

                            using JsonDocument doc = JsonDocument.Parse(jsonResult);
                            JsonElement root = doc.RootElement;

                            int success = root.GetProperty("success").GetInt32();

                            if (success == 1)
                            {
                                string usuario = root.GetProperty("usuario").GetString();
                                string contraseña = root.GetProperty("contraseña").GetString();


                                //Asigno el valor de retorno (el pdf) para enviarlo al correo
                                var pdf = carnetGen.GenerarCarnetConPlantilla(
                                    nombre_persona,
                                    usuario,
                                    rutaPlantilla
                                );
                                //Guardo el PDF en el server
                                var rutaPdf = Path.Combine("Recursos", "pdfs");
                                Directory.CreateDirectory(rutaPdf);
                                //Asigno nombre al pdf (uso el nombre de usuario ya que es unico y si en algun momento se debe actualizar la plantilla se sobreescribe buscnado el nombre)
                                string fileName = $"{usuario}.pdf";
                                //Armo la ruta completa donde se guardara el pdf creado
                                string fullPath = Path.Combine(rutaPdf, fileName);
                                await System.IO.File.WriteAllBytesAsync(fullPath, pdf);


                                //Instancio y mando las variables para el envio del correo
                                var emailservice = new EmailService();
                                await emailservice.EnviarCorreoConPDF(empleado.Correo, nombre_persona, usuario, contraseña, empleado.IdTipoUsuario,pdf);   
                            }
                        }
                        

                        // Retornamos el JSON directamente a la API
                        return Content(jsonResult, "application/json");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


        // DELETE: api/Empleadoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmpleado(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);
            if (empleado == null)
            {
                return NotFound();
            }

            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioViewModel datos)
        {
            try
            {
                string connectionString = _context.Database.GetDbConnection().ConnectionString;
                string jsonResult = string.Empty;

                using (var conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    using (var cmd = new SqlCommand("SP_Usuarios_Login", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Usuario", datos.Usuario);
                        cmd.Parameters.AddWithValue("@Contrasena", datos.Contraseña);

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                jsonResult = reader.GetString(0);
                            }
                        }
                    }
                }

                if (string.IsNullOrWhiteSpace(jsonResult))
                {
                    return BadRequest(new { success = false, message = "Sin respuesta del SP" });
                }

                return Content(jsonResult, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


        private bool EmpleadoExists(int id)
        {
            return _context.Empleados.Any(e => e.IdEmpleado == id);
        }
    }
}
