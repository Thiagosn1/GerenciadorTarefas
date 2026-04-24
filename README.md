# Gerenciador de Tarefas

Sistema simples para gerenciamento de tarefas, composto por uma API desenvolvida utilizando **ASP.NET Core** e o frontend utilizando **Angular**.

## 🚀 Estrutura do Projeto

- `/GerenciadorTarefasApi`: Backend (API REST)
- `/GerenciadorTarefasFrontend`: Frontend (Angular SPA)

---

## 🛠️ Backend (API)

- **Framework:** .NET 10
- **Banco de Dados:** SQL Server LocalDB
- **ORM:** Entity Framework Core
- **Recursos:** Auto-Migration e Seed Data (10 tarefas iniciais).

---

### Como Rodar (Visual Studio)

1. Abra o arquivo de solução (`.sln`) dentro da pasta `GerenciadorTarefasApi`.
2. Certifique-se de que o **SQL LocalDB** está instalado em sua máquina.
3. Pressione **F5**.
   - O projeto já inclui as **Migrations** necessárias na pasta `/Migrations`.
   - A API criará o banco de dados e as tabelas automaticamente ao iniciar.
   - Documentação disponível em: `https://localhost:7197/scalar/v1`

### Como Rodar (CLI)

```bash
cd GerenciadorTarefasApi
dotnet run
```

---

## 💻 Frontend (Angular)

- **Framework:** Angular 19+
- **Funcionalidades:**
  - Listagem de tarefas via `HttpClient`.
  - Fluxo completo de Criar, Editar e Excluir.
  - Validação de status ("Pendente" / "Concluída").

### Como Rodar

1. Certifique-se de ter o **Node.js** instalado.
2. Acesse a pasta: `cd GerenciadorTarefasFrontend`
3. Instale as dependências: `npm install`
4. Inicie o servidor: `npm start` ou `ng serve`
5. Acesse: `http://localhost:4200`

---

## 🔗 Endpoints da API

A URL base é `https://localhost:7197/api/tarefas`

| Método     | Endpoint            | Descrição                     |
| :--------- | :------------------ | :---------------------------- |
| **GET**    | `/api/tarefas`      | Lista todas as tarefas        |
| **GET**    | `/api/tarefas/{id}` | Busca uma tarefa por ID       |
| **POST**   | `/api/tarefas`      | Cria uma nova tarefa          |
| **PUT**    | `/api/tarefas/{id}` | Atualiza uma tarefa existente |
| **DELETE** | `/api/tarefas/{id}` | Remove uma tarefa             |

---
