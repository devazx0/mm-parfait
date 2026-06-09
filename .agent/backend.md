# Backend (NestJS)

## Structure

```
apps/api/src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── modules/
│   └── <feature>/
│       ├── <feature>.module.ts
│       ├── <feature>.controller.ts
│       ├── <feature>.service.ts
│       ├── dto/
│       │   └── *.dto.ts
│       └── entities/
│           └── *.entity.ts (if not using Prisma)
└── common/
    ├── guards/
    ├── interceptors/
    ├── filters/
    └── pipes/
```

## Conventions

- **Modules** are feature-scoped. Each feature gets its own module with controller + service.
- **DTOs** use `class-validator` decorators for input validation.
- **ValidationPipe** is enabled globally in `main.ts`.
- Use **PrismaService** as a provider — never instantiate PrismaClient directly.
- **Endpoints** follow RESTful naming: `GET /api/users`, `POST /api/users`, etc.
- **Version prefix**: `/api/v1/...` is preferred.

## Environment

```
DATABASE_URL=postgresql://...
PORT=9001
```

Use `@nestjs/config` (ConfigModule) for typed environment variables.

## Error handling

Use NestJS exception filters (`ExceptionFilter`) for consistent error responses. Throw `HttpException` or built-in exceptions (`NotFoundException`, `BadRequestException`, etc.) from services.
