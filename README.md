# GerenciadorTarefas

Primeira etapa do projeto: API em ASP.NET Core para gerenciamento de tarefas.

O frontend será adicionado depois neste mesmo repositório.

## API (status atual)

- Projeto: `GerenciadorTarefasApi`
- Framework: `.NET 10`
- Banco: SQL Server LocalDB
- CRUD de tarefas implementado
- Migração inicial criada

## Rodando a API

```bash
cd GerenciadorTarefasApi
dotnet restore
dotnet ef database update
dotnet run
```

### Rodando pelo Visual Studio

1. Abra a pasta `GerenciadorTarefasApi` no Visual Studio (ou a solução, se preferir).
2. Aguarde o restore automático dos pacotes NuGet.
3. No `Package Manager Console`, execute:

```powershell
Update-Database
```

4. Defina o perfil `https` para execução.
5. Pressione `F5` para rodar.

URLs locais:

- `https://localhost:7197`

## Endpoints

Base: `api/tarefas`

- `GET /api/tarefas`
- `GET /api/tarefas/{id}`
- `POST /api/tarefas`
- `PUT /api/tarefas/{id}`
- `DELETE /api/tarefas/{id}`

Exemplo de payload (`POST`/`PUT`):

```json
{
  "titulo": "Estudar ASP.NET",
  "descricao": "Revisar controllers",
  "status": "Pendente"
}
```
