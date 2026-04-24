using GerenciadorTarefasApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorTarefasApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tarefa> Tarefas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var dataExemplo = new DateTime(2024, 4, 24);

            modelBuilder.Entity<Tarefa>().HasData(
                new Tarefa { Id = 1, Titulo = "Estudar .NET 10", Descricao = "Aprender as novidades", Status = "Concluída", DataCriacao = dataExemplo },
                new Tarefa { Id = 2, Titulo = "Configurar Angular", Descricao = "Criar service e componentes", Status = "Pendente", DataCriacao = dataExemplo },
                new Tarefa { Id = 3, Titulo = "Ajustar CORS", Descricao = "Liberar porta 4200", Status = "Concluída", DataCriacao = dataExemplo },
                new Tarefa { Id = 4, Titulo = "Criar Repositório Git", Descricao = "Organizar pastas backend e frontend", Status = "Pendente", DataCriacao = dataExemplo },
                new Tarefa { Id = 5, Titulo = "Validar Endpoints", Descricao = "Testar GET e POST no Scalar", Status = "Concluída", DataCriacao = dataExemplo },
                new Tarefa { Id = 6, Titulo = "Estudar TypeScript", Descricao = "Interfaces e Observables", Status = "Pendente", DataCriacao = dataExemplo },
                new Tarefa { Id = 7, Titulo = "Estilizar Interface", Descricao = "Aplicar CSS no Angular", Status = "Pendente", DataCriacao = dataExemplo },
                new Tarefa { Id = 8, Titulo = "Revisar Controller", Descricao = "Verificar regras de status", Status = "Concluída", DataCriacao = dataExemplo },
                new Tarefa { Id = 9, Titulo = "Finalizar CRUD", Descricao = "Testar edição e exclusão", Status = "Pendente", DataCriacao = dataExemplo },
                new Tarefa { Id = 10, Titulo = "Escrever README", Descricao = "Documentar como rodar o projeto", Status = "Pendente", DataCriacao = dataExemplo }
            );
        }
    }
}
