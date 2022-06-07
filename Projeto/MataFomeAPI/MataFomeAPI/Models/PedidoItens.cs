using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MataFomeAPI.Models
{
    public class PedidoItens
    {
        [Required, Key]
        public int Id { get; set; }

        [Required]
        public int Codigo_Pedido { get; set; }

        [Required]
        public int Codigo_Item { get; set; }

        [Required]
        public int Quantidade { get; set; }

        [Required]
        public double Total { get; set; }


        [NotMapped]
        public Pedido Pedido { get; set; }

        [NotMapped]
        public Item Item { get; set; }
    }
}
