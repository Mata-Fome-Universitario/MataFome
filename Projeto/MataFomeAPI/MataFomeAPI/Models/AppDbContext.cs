
using Microsoft.EntityFrameworkCore;

namespace MataFomeAPI.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {}

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<PedidoItens> PedidoItens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>()
                .Property(p => p.Saldo)
                    .HasPrecision(10, 2);

            modelBuilder.Entity<Item>()
                .Property(p => p.Preco)
                    .HasPrecision(10, 2);

            modelBuilder.Entity<PedidoItens>()
                .Property(p => p.Total)
                    .HasPrecision(10, 2);

            modelBuilder.Entity<Usuario>()
                .HasData(new Usuario { CPF = "15468614677", Nome = "Sávio Cardoso", Email = "cardososavio5@gmail.com", Cargo = "Gerente", Senha = "gerente@123", Saldo = 0.00 });

            modelBuilder.Entity<Usuario>()
                .HasData(new Usuario { CPF = "86264702072", Nome = "João Gomes", Email = "savioshippuden13@gmail.com", Cargo = "Vendedor", Senha = "vendedor@123", Saldo = 0.00 });
        }
    }
}
