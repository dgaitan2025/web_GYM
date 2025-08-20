using Api_Empleados.Funciones;
using Api_Empleados.Models;
using Api_Empleados.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Api_Empleados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly DbGymBrisasContext _context;

        public ClientesController(DbGymBrisasContext context)
        {
            _context = context;
        }

        // GET: api/Clientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            return await _context.Clientes.ToListAsync();
        }

        // GET: api/Clientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);

            if (cliente == null)
            {
                return NotFound();
            }

            return cliente;
        }

        // PUT: api/Clientes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.IdCliente)
            {
                return BadRequest();
            }

            _context.Entry(cliente).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(id))
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

        // POST: api/Clientes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(ClientesViewModel cliente)
        {
            try
            {
                string connectionString = _context.Database.GetDbConnection().ConnectionString;
                string jsonResult;

                using (var conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();

                    using (var cmd = new SqlCommand("SP_Clientes_Crear", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@Nombre", cliente.Nombre);
                        cmd.Parameters.AddWithValue("@Apellido", cliente.Apellido);
                        cmd.Parameters.AddWithValue("@Telefono", cliente.Telefono);
                        cmd.Parameters.AddWithValue("@Fecha_Nacimiento", cliente.FechaNacimiento);
                        cmd.Parameters.AddWithValue("@Foto", cliente.Foto);
                        cmd.Parameters.AddWithValue("@Correo", string.IsNullOrEmpty(cliente.Correo) ? (object)DBNull.Value : cliente.Correo);
                        cmd.Parameters.AddWithValue("@Id_Tipo", cliente.IdTipoUsuario);
                        cmd.Parameters.AddWithValue("@Id_Membresia", cliente.IdMembresia);
                        cmd.Parameters.AddWithValue("@Id_Sucursal", cliente.IdSucursal);

                        // Como el SP retorna un JSON (FOR JSON PATH), lo obtenemos en una sola línea
                        jsonResult = (await cmd.ExecuteScalarAsync())?.ToString();

                        if (string.IsNullOrWhiteSpace(jsonResult))
                        {
                            return BadRequest(new { success = false, message = "No se recibió respuesta del SP." });
                        }
                        else
                        {
                            //Armop esta variable uniamente con un no0mbre y apellido (en caso tuviera mas de uno) si quiero poner todo solo concateno variables
                            string nombre_persona = (cliente.Nombre.Split(' ')[0]) + " " + (cliente.Apellido.Split(' ')[0]);
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
                                await emailservice.EnviarCorreoConPDF(cliente.Correo, nombre_persona, usuario, contraseña, cliente.IdTipoUsuario, pdf);
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

        // DELETE: api/Clientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null)
            {
                return NotFound();
            }

            _context.Clientes.Remove(cliente);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClienteExists(int id)
        {
            return _context.Clientes.Any(e => e.IdCliente == id);
        }


        [HttpGet("listarmembresias")]
        public async Task<ActionResult> ListarMembresias()
        {
            var connectionString = _context.Database.GetConnectionString(); // o tu cadena directa
            try
            {
                using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();

                using var cmd = new SqlCommand("SP_Membresias_Listar", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                // Ejecuta el SP y obtiene el JSON como string
                var jsonResult = (await cmd.ExecuteScalarAsync())?.ToString();

                // Devuelve el JSON crudo como lo envia la base
                return Content(jsonResult, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al obtener las membresías",
                    detalle = ex.Message
                });
            }
        }

        [HttpGet("listarsucursales")]
        public async Task<ActionResult> ListarSucursales()
        {
            var connectionString = _context.Database.GetConnectionString(); // o tu cadena directa
            try
            {
                using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();

                using var cmd = new SqlCommand("SP_Sucursales_Listar", connection);
                cmd.CommandType = CommandType.StoredProcedure;

                // Ejecuta el SP y obtiene el JSON como string
                var jsonResult = (await cmd.ExecuteScalarAsync())?.ToString();

                // Devuelve el JSON crudo como lo envia la base
                return Content(jsonResult, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al obtener las sucursales",
                    detalle = ex.Message
                });
            }
        }



    }

}
