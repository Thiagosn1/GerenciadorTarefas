using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GerenciadorTarefasApi.Migrations
{
    /// <inheritdoc />
    public partial class CriacaoInicialEPovoamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tarefas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tarefas", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Tarefas",
                columns: new[] { "Id", "DataCriacao", "Descricao", "Status", "Titulo" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Aprender as novidades", "Concluída", "Estudar .NET 10" },
                    { 2, new DateTime(2024, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Criar service e componentes", "Pendente", "Configurar Angular" },
                    { 3, new DateTime(2024, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Liberar porta 4200", "Concluída", "Ajustar CORS" },
                    { 4, new DateTime(2024, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Organizar pastas backend e frontend", "Pendente", "Criar Repositório Git" },
                    { 5, new DateTime(2024, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Testar GET e POST no Scalar", "Concluída", "Validar Endpoints" },
                    { 6, new DateTime(2024, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Interfaces e Observables", "Pendente", "Estudar TypeScript" },
                    { 7, new DateTime(2024, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Aplicar CSS no Angular", "Pendente", "Estilizar Interface" },
                    { 8, new DateTime(2024, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Verificar regras de status", "Concluída", "Revisar Controller" },
                    { 9, new DateTime(2024, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Testar edição e exclusão", "Pendente", "Finalizar CRUD" },
                    { 10, new DateTime(2024, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), "Documentar como rodar o projeto", "Pendente", "Escrever README" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tarefas");
        }
    }
}
