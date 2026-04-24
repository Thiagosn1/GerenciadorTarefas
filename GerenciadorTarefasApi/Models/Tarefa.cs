using System.ComponentModel.DataAnnotations;

namespace GerenciadorTarefasApi.Models
{
    public class Tarefa
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "O título é obrigatório.")]
        [MaxLength(200, ErrorMessage = "O título deve ter no máximo 200 caracteres.")]
        public string Titulo { get; set; } = string.Empty;

        [MaxLength(1000, ErrorMessage = "A descrição deve ter no máximo 1000 caracteres.")]
        public string? Descricao { get; set; }

        [Required(ErrorMessage = "O status é obrigatório.")]
        public string Status { get; set; } = "Pendente";

        public DateTime DataCriacao { get; set; } = DateTime.Now;
    }
}
