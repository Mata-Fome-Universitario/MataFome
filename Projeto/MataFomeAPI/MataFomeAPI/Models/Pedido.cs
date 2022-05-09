using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MataFomeAPI.Models
{
    public class Pedido
    {
        [Required, Key]
        public int Codigo { get; set; }

        [Required]
        public string CPF_Usuario { get; set; }

        [Required]
        public int Status { get; set; }



        [NotMapped]
        public Usuario Usuario { get; set; }

        [NotMapped]
        public List<Item> Items { get; set; }

        [NotMapped]
        public double Total { get; set; }

    }
}
