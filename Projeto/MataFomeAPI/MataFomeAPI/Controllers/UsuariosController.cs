using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MataFomeAPI.Models;
using Microsoft.AspNetCore.Cors;

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
        public async Task<ActionResult<Usuario>> GetUsuario(string cpf)
        {
            var usuario = await _context.Usuarios.FindAsync(cpf);

            if (usuario == null)
            {
                return Ok("Usuário não encontrado");
            }

            return usuario;
        }

        [HttpPut("{cpf}")]
        public async Task<IActionResult> PutUsuario(string cpf, Usuario usuario)
        {
            try
            {
                Usuario oldUser = _context.Usuarios.Where(x => x.CPF == cpf).AsNoTracking().FirstOrDefault();
                if (string.IsNullOrEmpty(usuario.Nome))
                    usuario.Nome = oldUser.Nome;

                if (string.IsNullOrEmpty(usuario.Email))
                    usuario.Email = oldUser.Email;

                if (!ValidateRole(usuario.Cargo))
                    usuario.Cargo = oldUser.Cargo;

                if (double.IsNaN(usuario.Saldo))
                    usuario.Saldo = oldUser.Saldo;

                usuario.Senha = oldUser.Senha;

                if (usuario.Email != oldUser.Email)
                {
                    Usuario newUser = _context.Usuarios.Where(x => x.Email == usuario.Email).AsNoTracking().FirstOrDefault();

                    if (newUser != null)
                    {
                        if (newUser.CPF != oldUser.CPF)
                            return Ok("Já existe um usuário cadastrado com esse Email");
                    }
                }

                if (!string.IsNullOrWhiteSpace(usuario.CPF) && usuario.CPF != cpf)
                {
                    if (_context.Usuarios.Where(x => x.CPF == usuario.CPF).Any())
                        return Ok("Já existe um usuário cadastrado com esse CPF");

                    _context.Usuarios.Remove(oldUser);
                    await _context.SaveChangesAsync();

                    _context.Usuarios.Add(usuario);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    _context.Entry(usuario).State = EntityState.Modified;
                    await _context.SaveChangesAsync();
                }

                usuario.Senha = "*****";
                return Ok(usuario);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!CpfExists(cpf))
                    return Ok("Nenhum usuário com esse CPF foi encontrado");
                else
                    throw;
            }

            return Ok("Usuário atualizado com sucesso");
        }

        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            if (CpfExists(usuario.CPF))
                return Ok("Já existe um usuário cadastrado com esse CPF");

            if (EmailExists(usuario.Email))
                return Ok("Já existe um usuário cadastrado com esse Email");

            if (!ValidateRole(usuario.Cargo))
                return Ok("Digite um cargo válido, [Vendedor, Gerente ou Cliente]");

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(usuario);
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{cpf}")]
        public async Task<IActionResult> DeleteUsuario(string cpf)
        {
            var usuario = await _context.Usuarios.FindAsync(cpf);
            if (usuario == null)
            {
                return Ok("Nenhum usuário com esse CPF foi encontrado");
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok("Usuário deletado com sucesso");
        }

        [Route("login"), HttpPost]
        public async Task<ActionResult<Usuario>> Login(string email, string senha)
        {
            Usuario usuario = _context.Usuarios.Where(x => x.Email == email).FirstOrDefault();

            if(usuario == null)
                return Ok("Email incorreto!");
            else
            {
                if (usuario.Senha != senha)
                    return Ok("Senha incorreta!");

                usuario.Senha = "****";
                return Ok(usuario);
            }
        }

        [Route("changePassword"), HttpPost]
        public async Task<ActionResult<Usuario>> ChangePassword(string cpf, string oldPassword, string newPassword)
        {
            Usuario usuario = _context.Usuarios.Where(x => x.CPF == cpf).FirstOrDefault();

            if (usuario == null)
                return Ok("Usuário não existe");

            if (usuario.Senha != oldPassword)
                return Ok("Senha incorreta");

            usuario.Senha = newPassword;
            _context.Entry(usuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok("Senha alterada com sucesso");
        }

        private bool CpfExists(string cpf)
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
