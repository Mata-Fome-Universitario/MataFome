using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MataFomeAPI.Models;

namespace MataFomeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        [HttpGet("{cpf}")]
        public async Task<ActionResult<Usuario>> GetUsuario(long cpf)
        {
            var usuario = await _context.Usuarios.FindAsync(cpf);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        [HttpPut("{cpf}")]
        public async Task<IActionResult> PutUsuario(long cpf, Usuario usuario)
        {
            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CpfExists(cpf))
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

        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            if (CpfExists(usuario.CPF))
                return Problem("Já existe um usuário cadastrado com esse CPF");

            if (EmailExists(usuario.Email))
                return Problem("Já existe um usuário cadastrado com esse Email");

            if (!ValidateRole(usuario.Cargo))
                return Problem("Digite um cargo válido, [Vendedor, Gerente ou Cliente]");

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(usuario);
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{cpf}")]
        public async Task<IActionResult> DeleteUsuario(long cpf)
        {
            var usuario = await _context.Usuarios.FindAsync(cpf);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CpfExists(long cpf)
        {
            return _context.Usuarios.Any(e => e.CPF == cpf);
        }

        private bool EmailExists(string email)
        {
            return _context.Usuarios.Any(e => e.Email == email);
        }

        private bool ValidateRole(string cargo)
        {
            string cargoUpper = cargo.ToUpper();

            if (cargoUpper == "VENDEDOR" || cargoUpper == "GERENTE" || cargoUpper == "CLIENTE")
                return true;
            else
                return false;
        }
    }
}
