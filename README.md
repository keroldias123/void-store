## Void Store

Plataforma de **e-commerce para Angola**, com preços em **Kwanza (AOA)**, preparada para operar em todo o território nacional.

> **Objetivo**: construir uma loja online moderna (web), com autenticação segura, catálogo, carrinho, checkout e integrações locais — mantendo **Kwanza** como moeda padrão e uma base técnica sólida para escalar.

## Stack

- **Web**: Next.js (App Router) + React
- **Estilos**: Tailwind CSS
- **Base de dados**: PostgreSQL (via Docker)
- **ORM/Migrações**: Drizzle ORM + Drizzle Kit
- **Auth**: Better Auth (cookies no Next.js, organizações, OAuth Google)

## Funcionalidades (em evolução)

- **Moeda AOA (Kwanza)**: preços e totais exibidos em Kwanza (ex.: `Kz 12.500,00`)
- **Autenticação**: login/social login (Google) e sessão via cookies
- **Persistência**: PostgreSQL com schema/migrações via Drizzle
- **Arquitetura moderna**: Next.js App Router e rotas de API

## Requisitos

- **Node.js** (recomendado: versão LTS)
- **pnpm** (há `pnpm-lock.yaml`) — opcionalmente `npm`
- **Docker Desktop** (para levantar o PostgreSQL local)

## Começar (desenvolvimento)

Instalar dependências:

```bash
pnpm install
```

Subir a base de dados (PostgreSQL):

```bash
docker compose up -d
```

Criar o ficheiro de ambiente:

```bash
copy .env.example .env
```

> Se não existir `.env.example` ainda, usa o teu `.env` atual como base (ver secção **Variáveis de ambiente**).

Rodar a aplicação:

```bash
pnpm dev
```

A aplicação fica disponível em `http://localhost:3000`.

## Variáveis de ambiente

Este projeto usa variáveis de ambiente para DB e autenticação.

### Obrigatórias (mínimo para rodar localmente)

- **`DATABASE_URL`**: string de conexão Postgres  
  Ex.: `postgres://postgres:postgres@localhost:5432/void_store`
- **`BETTER_AUTH_SECRET`**: segredo para assinar/criptografar tokens/sessões
- **`BETTER_AUTH_URL`**: base URL da app  
  Ex.: `http://localhost:3000`

### OAuth Google (opcional, mas configurado no código)

Se quiseres ativar login com Google:

- **`GOOGLE_CLIENT_ID`**
- **`GOOGLE_CLIENT_SECRET`**

> Nota: no `lib/auth.ts` estes valores são acessados com `!` (não-null). Se não os definires e a configuração for executada, poderás ter erro. Para desenvolvimento sem Google OAuth, define valores dummy ou ajusta a config para tornar o provider condicional.

## Base de dados (Drizzle + Postgres)

- **Docker**: a configuração de DB local está em `docker-compose.yaml`
- **Config Drizzle Kit**: `drizzle.config.ts`
- **Schemas**: `db/schema/*`
- **Instância DB**: `db/index.ts`

Comandos úteis (Drizzle Kit via `pnpm dlx`):

```bash
pnpm dlx drizzle-kit generate
pnpm dlx drizzle-kit migrate
```

> Os comandos exatos podem variar conforme a versão. Se precisares, adicionamos scripts em `package.json` (`db:generate`, `db:migrate`) para padronizar.

## Autenticação (Better Auth)

- **Config principal**: `lib/auth.ts`
- **Handlers Next.js**: `app/api/auth/[...all]/route.ts`
- **Plugins usados**:
  - cookies no Next.js (`nextCookies()`)
  - organizações (`organization()`)
  - provider social Google

## Scripts

```bash
pnpm dev     # ambiente de desenvolvimento
pnpm build   # build de produção
pnpm start   # servir build
pnpm lint    # ESLint
```

## Estrutura do projeto (resumo)

- `app/` — rotas e UI (Next.js App Router)
- `app/api/` — rotas de API (ex.: auth)
- `db/` — Drizzle (schema/migrations) + conexão
- `lib/` — serviços/SDKs (ex.: auth)
- `public/` — assets estáticos
- `utils/` — utilitários

## Padrões para AOA (Kwanza)

Recomendação para padronizar formatação de valores:

- **Locale**: `pt-AO`
- **Moeda**: `AOA`

Exemplo (JS):

```js
new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(12500)
// "Kz 12.500,00"
```

> Se o teu modelo de preços usar centavos/unidades mínimas, define a convenção cedo (ex.: guardar valores em **centavos** para evitar erros de floating point).

## Deploy

Opções comuns:

- **Vercel**: deploy simples para Next.js
- **Docker**: para ambientes próprios

Checklist antes de produção:

- Configurar `BETTER_AUTH_URL` para o domínio real
- Definir `BETTER_AUTH_SECRET` forte (não versionar)
- Provisionar Postgres gerenciado (ou self-host com backups)
- Rodar migrações em ambiente de produção

## Roadmap (sugestão)

- Catálogo (categorias, produtos, variantes, imagens)
- Carrinho e checkout
- Pagamentos locais (integrações a definir)
- Entregas (províncias/municípios), cálculo de frete
- Painel admin (gestão de produtos, stock, pedidos)
- Multi-tenant (organizações) para lojas/marcas

## Contribuição

Pull requests são bem-vindos.

- Cria uma branch a partir de `main`
- Garante que `pnpm lint` passa
- Descreve claramente o objetivo e o plano de teste

## Segurança

- Não faças commit de `.env`
- Rotaciona segredos se forem expostos

## Licença

Ainda não definida. (Sugestão: MIT para open-source, ou licença proprietária se for produto fechado.)
