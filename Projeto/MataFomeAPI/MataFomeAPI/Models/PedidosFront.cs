using System.Collections.Generic;

namespace MataFomeAPI.Models
{
    public class PedidosFront
    {
        public int Codigo { get; set; }
        public double Total { get; set; }
        public int Status { get; set; }
        public string Username { get; set; }
        public List<PedidoItensFront> PedidoItensFront { get; set; }
    }
}
