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
    public class PedidoItensController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidoItensController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PedidoItens>>> GetPedidoItens()
        {
            return await _context.PedidoItens.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PedidoItens>> GetPedido(int id)
        {
            var pedidoItens = await _context.PedidoItens.FindAsync(id);

            if (pedidoItens == null)
            {
                return NotFound();
            }

            return pedidoItens;
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPedidoItens(int id, PedidoItens pedidoItens)
        {
            if (id != pedidoItens.Codigo_Pedido)
            {
                return BadRequest();
            }

            _context.Entry(pedidoItens).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PedidoItensExists(id))
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
        public async Task<ActionResult<PedidoItens>> PostPedidoItens(PedidoItens pedidoItens)
        {
            _context.PedidoItens.Add(pedidoItens);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPedidoItens", new { id = pedidoItens.Codigo_Pedido }, pedidoItens);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePedidoItens(int id)
        {
            var pedidoItens = await _context.PedidoItens.FindAsync(id);
            if (pedidoItens == null)
            {
                return NotFound();
            }

            _context.PedidoItens.Remove(pedidoItens);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PedidoItensExists(int id)
        {
            return _context.PedidoItens.Any(e => e.Codigo_Pedido == id);
        }
    }
}
