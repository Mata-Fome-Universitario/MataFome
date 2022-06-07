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
    public class PedidosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Pedidos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidosFront>>> GetPedidos()
        {
            var pedidos = _context.Pedidos.ToList();

            if (pedidos == null)
                return Ok("Nenhum pedido cadastrado");


            var pedidosFront = new List<PedidosFront>();

            foreach (var pedido in pedidos)
            {
                var pedidoFront = new PedidosFront();
                pedidoFront.Codigo = pedido.Codigo;
                pedidoFront.Status = pedido.Status;

                var user = _context.Usuarios.Where(x => x.CPF == pedido.CPF_Usuario).FirstOrDefault();
                if (user != null)
                    pedidoFront.Username = user.Nome;
                else
                    pedidoFront.Username = "Usuário Excluído";

                var pedidoItens = _context.PedidoItens.Where(x => x.Codigo_Pedido == pedido.Codigo).ToList();
                if (pedidoItens.Any())
                {
                    var pedidoItensFrontList = new List<PedidoItensFront>();
                    foreach (var pedidoItem in pedidoItens)
                    {
                        var item = _context.Items.Where(x => x.Codigo == pedidoItem.Codigo_Item).FirstOrDefault();

                        var pedidoItensFront = new PedidoItensFront();
                        pedidoItensFront.Nome = item.Nome;
                        pedidoItensFront.Quantidade = pedidoItem.Quantidade;
                        pedidoFront.Total += pedidoItem.Total;

                        pedidoItensFrontList.Add(pedidoItensFront);
                    }

                    pedidoFront.PedidoItensFront = pedidoItensFrontList;
                }

                pedidosFront.Add(pedidoFront);
            }

            return Ok(pedidosFront);
        }

        // GET: api/Pedidos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pedido>> GetPedido(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);

            if (pedido == null)
            {
                return NotFound();
            }

            return pedido;
        }

        // PUT: api/Pedidos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPedido(int id, Pedido pedido)
        {
            if (id != pedido.Codigo)
            {
                return BadRequest();
            }

            _context.Entry(pedido).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();

                if (pedido.Status == 2)
                {
                    double total = 0;
                    var pedidoItens = _context.PedidoItens.Where(x => x.Codigo_Pedido == id).ToList();

                    foreach (var item in pedidoItens)
                    {
                        total += item.Total;
                    }

                    var user = _context.Usuarios.Where(x => x.CPF == pedido.CPF_Usuario).FirstOrDefault();
                    if (user != null)
                    {
                        user.Saldo += total;
                        _context.Usuarios.Update(user);
                    }
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PedidoExists(id))
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

        // POST: api/Pedidos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Pedido>> PostPedido(Pedido pedido)
        {
            Usuario user = _context.Usuarios.FirstOrDefault(x => x.CPF == pedido.CPF_Usuario);
            if (user == null)
            {
                return Ok("Usuário não encontrado");
            }

            if (user.Saldo < pedido.Total)
            {
                return Ok("Saldo insuficiente");
            }

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            user.Saldo -= pedido.Total;
            _context.Usuarios.Update(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPedido", new { id = pedido.Codigo }, pedido);
        }

        // DELETE: api/Pedidos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedido(int id)
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido == null)
            {
                return NotFound();
            }

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PedidoExists(int id)
        {
            return _context.Pedidos.Any(e => e.Codigo == id);
        }
    }
}
