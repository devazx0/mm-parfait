# Testing

## Unit tests (Jest)

Both apps use Jest.

### Backend

```bash
pnpm --filter api test          # unit tests
pnpm --filter api test:watch    # watch mode
pnpm --filter api test:cov      # coverage report
pnpm --filter api test:e2e      # e2e tests
```

- Test files co-locate with source: `*.spec.ts` next to the file they test.
- Use `@nestjs/testing` `Test.createTestingModule` — provide real providers, mock external services.
- Mock Prisma with `mockDeep` from `jest-mock-extended` or an in-memory SQLite database.

**Example:**

```typescript
const module = await Test.createTestingModule({
  providers: [UsersService, PrismaService],
}).compile();
```

### Frontend

```bash
pnpm --filter web test
pnpm --filter web test:watch
pnpm --filter web test:cov
```

- Component tests use **React Testing Library** — prefer `screen.getByRole` / `findByText` over test IDs.
- Test behavior, not implementation (don't assert internal state).
- Wrap components with necessary providers (Router, QueryClient, etc.).

**Example:**

```typescript
render(<MyComponent />);
expect(screen.getByText('Hello')).toBeInTheDocument();
```

## E2E tests

### Backend

Backend e2e tests use **Supertest** against a running NestJS app (test module).

```bash
pnpm --filter api test:e2e
```

- Create a dedicated e2e test module with an isolated test database.
- Use `beforeAll` to bootstrap the test app, `afterAll` to close it.
- Test full request-response cycles: HTTP → controller → service → Prisma → DB.

**Example:**

```typescript
const response = await request(app.getHttpServer())
  .get('/users')
  .expect(200);
```

### Frontend

Frontend e2e tests use **Playwright** or **Cypress** (whichever is configured).

```bash
pnpm --filter web test:e2e
```

## Coverage

Backend coverage threshold: 80% (statements, branches, functions, lines).
Frontend coverage threshold: 70%.

Configure thresholds in `jest.config.ts` / `package.json` under `jest.coverageThreshold`.
