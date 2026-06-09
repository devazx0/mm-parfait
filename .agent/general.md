# General conventions

## Git

- **Branch naming**: `feature/<name>`, `fix/<name>`, `chore/<name>`.
- **Commit messages**: conventional commits preferred (`feat:`, `fix:`, `chore:`, `docs:`, `test:`).
- Squash commits before merging into main.

## Code style

- **TypeScript** strict mode enabled in both apps.
- **ESLint** and **Prettier** are configured per app. Run `pnpm lint` before committing.
- **No `any`** — use `unknown` and narrow with type guards.
- **Async/await** over raw promises / `.then()`.
- **Named exports** preferred over default exports (except for pages/components).

## Adding dependencies

```bash
pnpm --filter web add <package>
pnpm --filter api add <package>
pnpm --filter api add -D <dev-package>
pnpm -w add -D <root-dev-package>
```

## Environment variables

- `.env` files are gitignored. Template variables in `.env.example`.
- Frontend: prefix with `VITE_` to expose to client bundle.
- Backend: use `@nestjs/config` `ConfigModule.forRoot()`.

## Turbo pipeline

The root `turbo.json` defines the task dependency graph. Adding a new app requires updating:
1. `pnpm-workspace.yaml`
2. `turbo.json` if special outputs or deps needed
