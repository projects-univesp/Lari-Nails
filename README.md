# Lari Nails Web (Front-End)

Interface web e mobile-first do sistema **Lari Nails**, desenvolvida em **React 19**, **TypeScript**, **Tailwind CSS v4**, **TanStack Query** e **Lucide Icons**, organizada sob os princípios de **Arquitetura Hexagonal (Ports & Adapters)**, **Domain-Driven Design (DDD)** e **Test-Driven Development (TDD)**.

O front-end comunica-se nativamente com a API NestJS ([`lari-nails-api`](../lari-nails-api)) através de autenticação segura baseada em cookies HTTP-Only JWT, suporte a Correlation ID e gerenciamento de estado de servidor reativo.

---

## 🏛️ Arquitetura

O código segue estrita separação entre regras de negócio e camada visual:

- **`src/core`**: Núcleo puro em TypeScript, desacoplado de React e de bibliotecas de terceiros.
  - **`domain`**: Entidades ricas com validação de regras invariantes (`ClientEntity`, `AuthUser`) e interfaces de portas de saída (`IClientRepository`, `IAuthRepository`).
  - **`application`**: Casos de uso (`LoginUseCase`, `ListClientsUseCase`, etc.) acompanhados de testes unitários automatizados com **Vitest**.
- **`src/infra`**: Adaptadores secundários de I/O.
  - **`http`**: `HttpClient` centralizado com `credentials: 'include'` e `X-Correlation-Id`.
  - **`auth`**: `HttpAuthRepository` com suporte a autenticação real e fallback mock para validação local.
  - **`clients`**: `HttpClientRepository` para sincronização em tempo real de clientes com a API.
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
| `VITE_API_BASE_URL` | `http://localhost:3000` | URL da API NestJS acessível pelo navegador do usuário |

---

## 🐳 Executando com Docker e Docker Compose

O front-end e o back-end compartilham a mesma rede Docker bridge (**`lari-nails-net`**).

### 1. Subir o Back-End e Banco de Dados (na pasta lari-nails-api):
```bash
cd ../lari-nails-api
docker compose up -d
```

### 2. Subir o Front-End (na pasta Lari-Nails):
```bash
cd ../Lari-Nails
docker compose up -d --build
```

Acesse a aplicação no navegador em: **`http://localhost:5173`**.

---

## 💻 Executando em Modo de Desenvolvimento (Local)

### Pré-requisitos
- Node.js 24.x
- npm 11.x

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor Vite de desenvolvimento
npm run dev
```

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

## 🔑 Credenciais para Validação Rápida (Modo Mock / Offline)

Caso deseje testar a interface sem iniciar o banco de dados:
- **E-mail:** `admin@larinails.com`
- **Senha:** `admin123`
