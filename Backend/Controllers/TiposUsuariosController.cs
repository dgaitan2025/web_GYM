using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Api_Empleados.Models;

namespace Api_Empleados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TiposUsuariosController : ControllerBase
    {
        private readonly DbGymBrisasContext _context;

        public TiposUsuariosController(DbGymBrisasContext context)
        {
            _context = context;
        }

        // GET: api/TiposUsuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TiposUsuario>>> GetTiposUsuarios()
        {
            return await _context.TiposUsuarios.ToListAsync();
        }

        // GET: api/TiposUsuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TiposUsuario>> GetTiposUsuario(int id)
        {
            var tiposUsuario = await _context.TiposUsuarios.FindAsync(id);

            if (tiposUsuario == null)
            {
                return NotFound();
            }

            return tiposUsuario;
        }

        // PUT: api/TiposUsuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTiposUsuario(int id, TiposUsuario tiposUsuario)
        {
            if (id != tiposUsuario.IdTipo)
            {
                return BadRequest();
            }

            _context.Entry(tiposUsuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TiposUsuarioExists(id))
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

        // POST: api/TiposUsuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TiposUsuario>> PostTiposUsuario(TiposUsuario tiposUsuario)
        {
            _context.TiposUsuarios.Add(tiposUsuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTiposUsuario", new { id = tiposUsuario.IdTipo }, tiposUsuario);
        }

        // DELETE: api/TiposUsuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTiposUsuario(int id)
        {
            var tiposUsuario = await _context.TiposUsuarios.FindAsync(id);
            if (tiposUsuario == null)
            {
                return NotFound();
            }

            _context.TiposUsuarios.Remove(tiposUsuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TiposUsuarioExists(int id)
        {
            return _context.TiposUsuarios.Any(e => e.IdTipo == id);
        }
    }
}
