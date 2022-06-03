using System.ComponentModel.DataAnnotations;

namespace MataFomeAPI.Models
{
    public class Item
    {
        [Required, Key]
        public int Codigo { get; set; }

        [Required]
        public string Nome { get; set; }

        [Required]
        public string Descricao { get; set; }

        [Required]
        public double Preco { get; set; }

        public string Imagem { get; set; }
    }
}
