# Frontend (React + Vite)

## Structure

```
apps/web/src/
├── main.tsx
├── App.tsx
├── pages/           # Page-level components (one per route)
│   └── Home.tsx
├── components/      # Reusable UI components
│   └── ui/
├── hooks/           # Custom React hooks
├── services/        # API client (axios/fetch wrappers)
├── types/           # Shared TypeScript types/interfaces
└── utils/           # Helper utilities
```

## Conventions

- **Pages** live in `pages/`, routed via `react-router-dom`.
- **Reusable components** live in `components/ui/`.
- **Custom hooks** in `hooks/` — each hook is a single file named `use<Name>.ts`.
- **API calls** go through `services/` — one file per resource.
- **No barrel exports** — prefer direct imports to avoid circular deps.

## Styling

Use Tailwind CSS with a `tailwind.config.ts`. Avoid inline styles. Use `cn()` utility (from `clsx` + `tailwind-merge`) for conditional classes.

## State management

- **React Query** for server state (API calls, caching, mutations).
- **Zustand** or **React Context** for global client state (auth, theme).
- Component-local state stays in `useState` / `useReducer`.

## API client

Use `fetch` or `axios` with a base instance configured in `services/client.ts`. Include auth token from context/store in interceptors.
