using System.ComponentModel.DataAnnotations;

namespace MataFomeAPI.Models
{
    public class Usuario
    {
        [Required, Key]
        public long CPF { get; set; }

        [Required]
        public string Nome { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Senha { get; set; }

        [Required]
        public string Cargo { get; set; }

        [Required]
        public double Saldo { get; set; }
    }
}
