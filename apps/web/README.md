# MM Parfait Web

React frontend powered by TanStack Start, TanStack Router, and Vite.

## Development

From the repository root:

```bash
pnpm --filter web dev
```

The development server runs on port `9000`.

## Build

```bash
pnpm --filter web build
pnpm --filter web preview
```

The TanStack Start Vite plugin produces client and server bundles. Public routes are SSR-capable, while browser-only cart, checkout, and authentication state remains client-managed.
