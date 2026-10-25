# Quorl

Quorl is a Bun and Turborepo monorepo created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack). It combines TanStack Start, React Native, Expo, Hono, tRPC, Better Auth, Drizzle and Turso.

## Requirements

- Bun 1.4 or newer

## Getting started

Install the workspace dependencies:

```bash
bun install
```

Configure the environment files used by each application:

- `apps/api/.env`: `BETTER_AUTH_SECRET`, `BETTER_AUTH_TRUSTED_ORIGINS`, `BETTER_AUTH_URL`, `CORS_ORIGIN`, `DATABASE_AUTH_TOKEN`, `DATABASE_URL`, `HOST` and `PORT`
- `apps/web/.env`: `SITE_URL`, `VITE_API_URL`, `VITE_HOST`, `VITE_PORT`, `VITE_PROXY_COOKIE_DOMAIN_REWRITE` and `VITE_PROXY_SECURE`
- `apps/mobile/.env`: `EXPO_PUBLIC_API_URL`

`BETTER_AUTH_TRUSTED_ORIGINS` is a comma-separated allowlist. Set `SITE_URL` to the canonical web origin before generating the sitemap or building the web application. `VITE_PROXY_SECURE` must be `true` or `false`; `VITE_PROXY_COOKIE_DOMAIN_REWRITE` must be a domain or `false`.

Start every application:

```bash
bun run dev
```

## Database

The database package uses Drizzle with SQLite-compatible Turso/LibSQL.

```bash
bun run db:push
```

The remaining database commands are `db:generate`, `db:migrate`, `db:migrate:deploy` and `db:studio`. Every command requires the real `DATABASE_URL` and `DATABASE_AUTH_TOKEN` from `apps/api/.env`.

## End-to-end tests

Playwright reads the real API and web configuration from their application `.env` files. Run the smoke test after completing those files:

```bash
bun run test:e2e
```

The artifact server additionally requires `PLAYWRIGHT_ARTIFACTS_HOST` and `PLAYWRIGHT_ARTIFACTS_PORT` in the process environment.

## Project structure

```text
quorl/
├── apps/
│   ├── api/         # Hono API and tRPC adapter
│   ├── desktop/     # Rust and GPUI desktop application
│   ├── mobile/      # React Native and Expo application
│   └── web/         # TanStack Start web application
└── packages/
    ├── auth/        # Better Auth configuration
    ├── db/          # Drizzle client and schemas
    ├── env/         # Validated API, web and mobile environments
    ├── trpc/        # Shared tRPC context and routers
    ├── ts-config/   # Shared TypeScript configurations
    └── ui/          # Shared shadcn UI components and styles
```

Runtime packages compile to `dist` with tsdown. The UI package remains just-in-time so application bundlers can process its TSX and CSS directly.

## Available scripts

- `bun run dev`: start all applications
- `bun run dev:api`: start only the API
- `bun run dev:desktop`: start only the GPUI desktop application
- `bun run dev:web`: start only the web application
- `bun run dev:mobile`: start only the Expo application
- `bun run build`: build all applications and compiled packages
- `bun run start`: start every application using its production command
- `bun run check-types`: check TypeScript across the workspace
- `bun run check`: run Ultracite checks
- `bun run fix`: format and automatically fix supported issues
- `bun run db:*`: run the corresponding database task in `@quorl/db`

## Mobile builds

EAS profiles are defined in `apps/mobile/eas.json`. Initialize the Expo project connection before the first remote build:

```bash
bun --cwd apps/mobile run eas:init
```

Use `eas:build:android`, `eas:build:ios` or `eas:build` from the mobile workspace after initialization.

## Shared UI

Shared components live in `packages/ui/src/components` and can be imported through package subpaths:

```tsx
import { Button } from "@quorl/ui/components/button"
```

Global styles live in `packages/ui/src/styles/globals.css`.
