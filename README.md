# Lari Nails Web (Front-End)

Interface web e mobile-first do sistema **Lari Nails**, desenvolvida em **React 19**, **TypeScript**, **Tailwind CSS v4**, **TanStack Query** e **Lucide Icons**, organizada sob os princípios de **Arquitetura Hexagonal (Ports & Adapters)**, **Domain-Driven Design (DDD)** e **Test-Driven Development (TDD)**.

O front-end comunica-se com a API NestJS ([`lari-nails-api`](https://github.com/projects-univesp/lari-nails-api)) através de autenticação baseada em cookies HTTP-only JWT, suporte a Correlation ID e gerenciamento de estado de servidor reativo.

---

## 🏛️ Arquitetura

O código segue estrita separação entre regras de negócio e camada visual:

- **`src/core`**: Núcleo puro em TypeScript, desacoplado de React e de bibliotecas de terceiros.
  - **`domain`**: Entidades ricas com validação de regras invariantes (`ClientEntity`, `AuthUser`) e interfaces de portas de saída (`IClientRepository`, `IAuthRepository`).
  - **`application`**: Casos de uso (`LoginUseCase`, `ListClientsUseCase`, etc.) acompanhados de testes unitários automatizados com **Vitest**.
- **`src/infra`**: Adaptadores secundários de I/O.
  - **`http`**: `HttpClient` centralizado com `credentials: 'include'` e `X-Correlation-Id`.
  - **`auth`**: `HttpAuthRepository` para setup inicial, login, sessão e logout pela API.
  - **`clients`**: `HttpClientRepository` para sincronização em tempo real de clientes com a API.
  - **`operations`**: acesso a serviços, expediente, disponibilidade, bloqueios e agendamentos da API.
- **`src/presentation`**: Adaptadores primários de interface.
  - **`context` & `hooks`**: `useAuth()` e `useClients()` com cache reativo via **TanStack Query**.
  - **`screens` & `components`**: Componentes e telas com visual preservado em Tailwind CSS.

---

## ⚙️ Variáveis de Ambiente

Copie o arquivo de exemplo para criar o seu `.env`:

```bash
cp .env.example .env
```

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `5173` | Porta exposta no host para a aplicação web |
| `IMAGE_NAME` | `lari-nails-web` | Nome da imagem Docker gerada |
| `VERSION` | `latest` | Tag da imagem Docker |
| `VITE_API_BASE_URL` | `http://localhost:3000` | URL da API NestJS acessível pelo navegador. O valor é incorporado ao frontend durante o build. |

---

## 💻 Executando frontend e backend localmente

Para testar a integração, use a branch `dev` dos dois repositórios. Clone-os em pastas lado a lado:

```bash
git clone --branch dev https://github.com/projects-univesp/lari-nails-api.git
git clone --branch dev https://github.com/projects-univesp/Lari-Nails.git
```

Primeiro, siga a seção de execução local do [README do backend](https://github.com/projects-univesp/lari-nails-api/blob/dev/README.md). Ela inicia o PostgreSQL, aplica as migrações e deixa a API disponível na porta `3000`.

Depois, na pasta do frontend, configure e inicie a aplicação:

```bash
cp .env.example .env
npm install
npm run dev
```

O `.env.example` já aponta `VITE_API_BASE_URL` para `http://localhost:3000`. Se a API estiver em outro endereço, atualize essa variável antes de iniciar ou gerar o build. Acesse **`http://localhost:5173`**. No primeiro acesso, preencha o formulário para criar o administrador; depois, entre com o e-mail e a senha cadastrados.

### Escopo da integração atual

Serviços, horários comerciais, bloqueios de agenda e agendamentos usam a API. A tela de agendamento consulta clientes existentes no backend. Dados financeiros e algumas telas de clientes ainda usam dados locais e não são sincronizados entre usuários.

### Executar com Docker (opcional)

Configure `VITE_API_BASE_URL` no `.env` antes do build e execute:

```bash
docker compose up -d --build
```

Acesse `http://localhost:5173`. A API e o banco devem estar iniciados e migrados; consulte o README do backend.

---

## 🧪 Testes e Qualidade

```bash
# Executar todos os testes unitários (Vitest)
npm test

# Executar testes em modo watch
npm run test:watch

# Checagem de linter e formatação (ESLint flat config)
npm run lint

# Build de produção do Vite
npm run build
```

---
