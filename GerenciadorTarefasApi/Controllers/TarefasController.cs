using GerenciadorTarefasApi.Data;
using GerenciadorTarefasApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GerenciadorTarefasApi.Controllers
{
    [ApiController]
    [Route("api/tarefas")]
    public class TarefasController(AppDbContext contexto) : ControllerBase
    {
        private static readonly string[] statusPermitidos = ["Pendente", "Concluída"];

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tarefa>>> BuscarTodas()
        {
            var tarefas = await contexto.Tarefas.ToListAsync();
            return Ok(tarefas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Tarefa>> BuscarPorId(int id)
        {
            var tarefa = await contexto.Tarefas.FindAsync(id);
            if (tarefa is null)
                return NotFound(new { mensagem = $"Tarefa com ID {id} não encontrada." });
            return Ok(tarefa);
        }

        [HttpPost]
        public async Task<ActionResult<Tarefa>> Criar([FromBody] Tarefa tarefa)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!statusPermitidos.Contains(tarefa.Status))
                return BadRequest(new { mensagem = "Status inválido. Use 'Pendente' ou 'Concluída'." });

            tarefa.DataCriacao = DateTime.Now;
            contexto.Tarefas.Add(tarefa);
            await contexto.SaveChangesAsync();

            return CreatedAtAction(nameof(BuscarPorId), new { id = tarefa.Id }, tarefa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] Tarefa tarefaAtualizada)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (!statusPermitidos.Contains(tarefaAtualizada.Status))
                return BadRequest(new { mensagem = "Status inválido. Use 'Pendente' ou 'Concluída'." });

            var tarefa = await contexto.Tarefas.FindAsync(id);
            if (tarefa is null)
                return NotFound(new { mensagem = $"Tarefa com ID {id} não encontrada." });

            tarefa.Titulo = tarefaAtualizada.Titulo;
            tarefa.Descricao = tarefaAtualizada.Descricao;
            tarefa.Status = tarefaAtualizada.Status;

            await contexto.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Excluir(int id)
        {
            var tarefa = await contexto.Tarefas.FindAsync(id);
            if (tarefa is null)
                return NotFound(new { mensagem = $"Tarefa com ID {id} não encontrada." });

            contexto.Tarefas.Remove(tarefa);
            await contexto.SaveChangesAsync();
            return NoContent();
        }
    }
}
