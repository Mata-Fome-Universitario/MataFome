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

        public string Senha { get; set; }

        [Required]
        public string Cargo { get; set; }

        public double Saldo { get; set; }
    }
}
