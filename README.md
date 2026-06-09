# mm-parfait

Monorepo with a React (Vite) frontend and NestJS backend, managed by pnpm and Turbo.

## Structure

```
apps/
├── web/    React + Vite (port 9000)
└── api/    NestJS (port 9001)
```

## Getting started

```bash
pnpm install
pnpm dev          # starts both apps via turbo
pnpm --filter web dev   # frontend only
pnpm --filter api start:dev  # backend only
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run both apps in dev mode (turbo) |
| `pnpm build` | Build both apps |
| `pnpm lint` | Lint all apps |
| `pnpm --filter web <script>` | Run script in frontend |
| `pnpm --filter api <script>` | Run script in backend |

See `.agent/` for project conventions and best practices.
