# Gestão de Clientes

Aplicação web para gerir contactos de clientes: criar, ver, pesquisar, editar e apagar.
Projeto 1 de uma série de 6 ferramentas para pequenos negócios.

## Funcionalidades

- CRUD completo de clientes (nome, email, telefone, empresa)
- Pesquisa instantânea em todos os campos
- Validação no servidor (email válido, email único)
- Estados de carregamento, lista vazia e erro de ligação
- Interface responsiva

## Stack

| Camada | Tecnologia |
|---|---|
| Interface | React 19, Vite, Tailwind CSS 4 |
| API | Node.js, Express 5 (REST) |
| Base de dados | PostgreSQL |

## Como correr

Requisitos: Node.js 20+ e PostgreSQL 15+.

```bash
# 1. Base de dados
createdb gestao_clientes
psql -d gestao_clientes -f server/db/schema.sql

# 2. API
cd server
cp .env.example .env     # ajusta o utilizador e a palavra-passe
npm install
npm start                # http://localhost:3001

# 3. Interface (noutro terminal)
cd client
npm install
npm run dev              # http://localhost:5173
```

## API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/clientes` | Lista todos os clientes |
| POST | `/clientes` | Cria um cliente |
| PUT | `/clientes/:id` | Atualiza um cliente |
| DELETE | `/clientes/:id` | Apaga um cliente |

## Estrutura

```
gestao-clientes/
  client/   interface React
  server/   API Express e esquema SQL
```
