using Api_Empleados.Funciones;
using Api_Empleados.Models;
using Api_Empleados.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Text.Json;

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
        [HttpGet("ClientesIndex")]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            var connectionString = _context.Database.GetConnectionString(); // obtengo mi cadena de conexion del appsettings.json
            try
            {
                using var connection = new SqlConnection(connectionString);
                await connection.OpenAsync();

                using var cmd = new SqlCommand("SP_Clientes_Index", connection);
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

        // GET: api/Clientes/5
        [HttpGet("ClientesDetails/{id}")]
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
        [HttpPut("ClientesActualizar/{id}")]
        public async Task<IActionResult> PutCliente(int id, ClientesUsuarioEditViewModel cliente) //<-- Cambio el parametro Cliente por ClientesUsuarioEditViewModel para recibir los datos del cliente y su usuario juntos
        {
            try
            {
                string connectionString = _context.Database.GetDbConnection().ConnectionString;
                string jsonResult;

                //Abro la conexion con la base (using cierra la conexion al terminar de usarse)
                using (var conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();
                    //Envio el nombre del comando a la base (en este caso el nombre del SP)
                    using (var cmd = new SqlCommand("SP_Clientes_Actualizar", conn))
                    {
                        //Indico el comando que voy a llamar que en este caso es un SP
                        cmd.CommandType = CommandType.StoredProcedure;
                        //Agrego el valor a los parametros del SP
                        cmd.Parameters.AddWithValue("@Id_Cliente", id);
                        cmd.Parameters.AddWithValue("@Nombre", cliente.Clientes.Nombre);
                        cmd.Parameters.AddWithValue("@Apellido", cliente.Clientes.Apellido);
                        cmd.Parameters.AddWithValue("@Telefono", cliente.Clientes.Telefono);
                        cmd.Parameters.AddWithValue("@Correo", cliente.Clientes.Correo);
                        cmd.Parameters.AddWithValue("@Fecha_Nacimiento", cliente.Clientes.FechaNacimiento);
                        cmd.Parameters.AddWithValue("@Foto", cliente.Clientes.Foto);
                        cmd.Parameters.AddWithValue("@Numero_Identificacion",  cliente.Clientes.Numero_Identificacion);
                        cmd.Parameters.AddWithValue("@Usuario", cliente.Usuario.Usuario);
                        cmd.Parameters.AddWithValue("@Contraseña", cliente.Usuario.Contraseña);
                        cmd.Parameters.AddWithValue("@Id_Membresia", cliente.Clientes.IdMembresia);

                        // Como el SP retorna un JSON (FOR JSON PATH), lo obtenemos en una sola línea
                        jsonResult = (await cmd.ExecuteScalarAsync())?.ToString();

                        //Valido si tuve respuesta del SP verificando el que ExecuteScalarAsync retorne alguna cadena
                        if (string.IsNullOrWhiteSpace(jsonResult))
                        {
                            return BadRequest(new { success = false, message = "No se recibió respuesta del SP." });
                        }
                        
                    }
                    // Retornamos el JSON directamente a la API
                    return Content(jsonResult, "application/json");
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // POST: api/Clientes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("ClientesCrear")]
        public async Task<ActionResult<Cliente>> PostCliente(ClientesViewModel cliente)
        {
            try
            {
                string connectionString = _context.Database.GetDbConnection().ConnectionString;
                string jsonResult;

                //Abro la conexion con la base (using cierra la conexion al terminar de usarse)
                using (var conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();
                    //Envio el nombre del comando a la base (en este caso el nombre del SP)
                    using (var cmd = new SqlCommand("SP_Clientes_Crear", conn))
                    {
                        //Indico el comando que voy a llamar que en este caso es un SP
                        cmd.CommandType = CommandType.StoredProcedure;
                        //Agrego el valor a los parametros del SP
                        cmd.Parameters.AddWithValue("@Nombre", cliente.Nombre);
                        cmd.Parameters.AddWithValue("@Apellido", cliente.Apellido);
                        cmd.Parameters.AddWithValue("@Telefono", cliente.Telefono);
                        cmd.Parameters.AddWithValue("@Fecha_Nacimiento", cliente.FechaNacimiento);
                        cmd.Parameters.AddWithValue("@Foto", cliente.Foto);
                        cmd.Parameters.AddWithValue("@Correo", cliente.Correo);
                        cmd.Parameters.AddWithValue("@Id_Tipo", cliente.IdTipoUsuario);
                        cmd.Parameters.AddWithValue("@Id_Membresia", cliente.IdMembresia);
                        cmd.Parameters.AddWithValue("@Id_Sucursal", cliente.IdSucursal);
                        cmd.Parameters.AddWithValue("@Numero_Identificacion", cliente.Numero_Identificacion);

                        // Como el SP retorna un JSON (FOR JSON PATH), lo obtenemos en una sola línea
                        jsonResult = (await cmd.ExecuteScalarAsync())?.ToString();

                        //Valido si tuve respuesta del SP verificando el que ExecuteScalarAsync retorne alguna cadena
                        if (string.IsNullOrWhiteSpace(jsonResult))
                        {
                            return BadRequest(new { success = false, message = "No se recibió respuesta del SP." });
                        }
                        //Declaro JsonDocument para leer el contenido del Json
                        using JsonDocument doc = JsonDocument.Parse(jsonResult);
                        //Declaro JsonElement para leer el contenido del Json (JsonElement es una estructura que representa un elemento JSON en un documento JSON)
                        //Root sera la variable a la que se le asigne el resultado de JsonDocument (el json de la base preparado para leerse en el servidor)
                        JsonElement root = doc.RootElement;

                        
                        int success = root.GetProperty("success").GetInt32();
                        //Si la propiedad succes del Json devuelto es 1 quiere decir que si inserto el cliente con su usuario asi que envio el correo (si no se inserto saltamos al retirn de abajo con el error)
                        if (success == 1)
                        {
                            try
                            {
                                //Instanio la clase EnviodeCorreo para enviar el correo al usuario con el carnet
                                var enviarcorreo = new EnviodeCorreo();
                                //Envio los argumentos necesarios para el envio del correo
                                var ResultadoCorreo = enviarcorreo.EnviarCorreo(root, cliente.Correo, cliente.Nombre, cliente.Apellido, cliente.IdTipoUsuario);
                            }
                            catch (Exception ex)
                            {
                                // Aquí retornas el error real que pasó en la generación PDF o envío
                                var baseMsg = ex.GetBaseException().Message;
                                return StatusCode(500, new
                                {
                                    success = false,
                                    message = $"Usuario creado, pero falló el envío de correo: {baseMsg}"
                                });
                            }
                        }     
                    }
                        // Retornamos el JSON directamente a la API
                        return Content(jsonResult, "application/json");
                }
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // DELETE: api/Clientes/5
        [HttpDelete("ClientesEliminar/{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            try
            {
                string connectionString = _context.Database.GetDbConnection().ConnectionString;
                string jsonResult;

                //Abro la conexion con la base (using cierra la conexion al terminar de usarse)
                using (var conn = new SqlConnection(connectionString))
                {
                    await conn.OpenAsync();
                    //Envio el nombre del comando a la base (en este caso el nombre del SP)
                    using (var cmd = new SqlCommand("SP_Clientes_Eliminar", conn))
                    {
                        //Indico el comando que voy a llamar que en este caso es un SP
                        cmd.CommandType = CommandType.StoredProcedure;
                        //Agrego el valor a los parametros del SP
                        cmd.Parameters.AddWithValue("@Id_Cliente", id);


                        // Como el SP retorna un JSON (FOR JSON PATH), lo obtenemos en una sola línea
                        jsonResult = (await cmd.ExecuteScalarAsync())?.ToString();

                        //Valido si tuve respuesta del SP verificando el que ExecuteScalarAsync retorne alguna cadena
                        if (string.IsNullOrWhiteSpace(jsonResult))
                        {
                            return BadRequest(new { success = false, message = "No se recibió respuesta del SP." });
                        }

                        // Retornamos el JSON directamente a la API
                        return Content(jsonResult, "application/json");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al ejecutar el SP",
                    detalle = ex.Message
                });
            }
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
