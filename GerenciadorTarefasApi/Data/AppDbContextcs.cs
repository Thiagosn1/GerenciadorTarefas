using GerenciadorTarefasApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorTarefasApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tarefa> Tarefas { get; set; }
    }
}
