# Project Design System

For all design work in this project, always use the `quorl-design` skill before creating or reviewing UI, visual identity, layout, UX writing, marketing pages, product screens, or design-system decisions.

This applies to every Quorl surface: `apps/web`, `apps/mobile`, `apps/desktop`, and the agent computer experience. Use it together with the relevant platform-specific guidance, but keep Quorl's brand, colors, typography, voice, layout patterns, and design principles as the source of truth for visual and UX decisions.

# Product And Brand Context

Before developing product features, flows, data models, API surfaces, or user-facing behavior, read `PRODUCT.md` and keep the implementation aligned with that scope.

Quorl is a system for creating and directing persistent AI teammates that complete real work in real tools. The product should behave like an AI doing partner, not only an AI thinking partner: users delegate outcomes, agents work across tools and surfaces, and results are completed where the work belongs.

Quorl is an independent product. Reference products such as xAI Bot, Rakazo, OpenMausBot, and Mavry may be used for product-category understanding, but do not copy their names, brand language, visual identity, or implementation details unless the user explicitly asks for a direct comparison or port.

# Where Code Lives

## Apps

- `apps/web`: TanStack Start/Vite React web app. This is the web workspace for agent rosters, conversations, runs, approvals, files, skills, routines, settings, and deeper coordination.
- `apps/mobile`: Expo/React Native app using Expo Router, Uniwind, and HeroUI Native. This is the mobile surface for delegation, monitoring, notifications, approvals, and quick intervention while remote work continues off-device.
- `apps/desktop`: Rust desktop app. This is the native desktop surface for continuous agent collaboration, local notifications, observing remote computer work, takeover, and explicitly authorized local computer/file workflows.
- `apps/api`: Hono API app. It exposes auth, tRPC, health, and future API endpoints.

## Packages

- `packages/auth`: Better Auth setup and auth-related server utilities shared by the API and clients.
- `packages/db`: Drizzle/libSQL database client, schema, migrations, and database tooling.
- `packages/env`: Typed environment validation for API, web, and mobile runtimes.
- `packages/tokens`: Shared Quorl design tokens for TypeScript, Tailwind CSS, and Uniwind.
- `packages/trpc`: tRPC routers, context, middleware, and shared server/client contracts.
- `packages/ui`: Shared web UI styling, shadcn/Tailwind setup, UI helpers, hooks, icons, and reusable web components.
- `packages/ts-config`: Shared TypeScript configs for base, Hono, Expo, and React library packages.

# Local Commands

Use Bun for all JavaScript and TypeScript package commands.

## Whole Project From Root

- Install dependencies: `bun install`
- Run all apps locally through Turbo: `bun run dev`
- Run only the web app through Turbo: `bun run dev:web`
- Run only the API app through Turbo: `bun run dev:api`
- Run only the desktop app through Turbo: `bun run dev:desktop`
- Run only the mobile app through Turbo: `bun run dev:mobile`
- Check formatting and linting: `bun run check`
- Fix formatting and linting: `bun run fix`
- Check TypeScript across the repo: `bun run check-types`
- Build the repo through Turbo: `bun run build`
- Run app start scripts through Turbo: `bun run start`
- Run E2E tests: `bun run test:e2e`
- Run E2E tests headed: `bun run test:e2e:headed`
- Open E2E UI mode: `bun run test:e2e:ui`
- Generate database migrations: `bun run db:generate`
- Apply local database migrations: `bun run db:migrate`
- Deploy database migrations: `bun run db:migrate:deploy`
- Push database schema: `bun run db:push`
- Open database studio: `bun run db:studio`

## `apps/api`

- Run locally: `cd apps/api && bun run dev`
- Build locally: `cd apps/api && bun run build`
- Run built server locally: `cd apps/api && bun run start`
- Compile standalone server: `cd apps/api && bun run compile`
- Check types: `cd apps/api && bun run check-types`

The API reads `HOST`, `PORT`, `CORS_ORIGIN`, `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `BETTER_AUTH_TRUSTED_ORIGINS` from env. Auth routes live under `/api/auth/*`, tRPC lives under `/trpc/*`, and `/` returns a health response.

## `apps/web`

- Run locally: `cd apps/web && bun run dev`
- Build locally: `cd apps/web && bun run build`
- Run built server locally: `cd apps/web && bun run start`
- Preview Vite output: `cd apps/web && bun run preview`
- Generate sitemap: `cd apps/web && bun run sitemap`
- Check types: `cd apps/web && bun run check-types`

Web uses Vite/TanStack Start and reads `VITE_HOST`, `VITE_PORT`, `VITE_API_URL`, `VITE_PROXY_SECURE`, `VITE_PROXY_COOKIE_DOMAIN_REWRITE`, and `SITE_URL` from env where applicable.

## `apps/mobile`

- Run locally with Expo: `cd apps/mobile && bun run dev`
- Export production bundles: `cd apps/mobile && bun run build`
- Run the app start script: `cd apps/mobile && bun run start`
- Check types: `cd apps/mobile && bun run check-types`
- Run Android native build locally when needed: `cd apps/mobile && bun run android`
- Run iOS native build locally when needed: `cd apps/mobile && bun run ios`
- Generate native projects: `cd apps/mobile && bun run prebuild`

Mobile uses Expo and reads `EXPO_PUBLIC_API_URL` from env. Heavy agent execution should not happen on-device; mobile directs and observes work running on Quorl's remote infrastructure.

## `apps/desktop`

- Run locally: `cd apps/desktop && bun run dev`
- Build locally: `cd apps/desktop && bun run build`
- Run release mode locally: `cd apps/desktop && bun run start`
- Check Rust code: `cd apps/desktop && bun run check-types`
- Format Rust code: `cd apps/desktop && bun run format`

Desktop commands wrap Cargo. Keep local-computer access explicit, visible, and permissioned.

# Environment

Do not add `SKIP_ENV_VALIDATION` or temporary in-memory database fallbacks. Normal commands should use real env values and fail clearly when required env is missing.

Database commands should use the real configured database through `DATABASE_URL` and `DATABASE_AUTH_TOKEN`. Test and E2E setup should not silently switch to temporary libSQL memory databases unless the user explicitly asks for that behavior.

# Pull Requests

Never create a pull request unless the user explicitly asks for one.

Each PR must have one objective and one responsibility. If the PR body needs wording like "also", "and also", or introduces a second unrelated concern, split the work into separate PRs.

PR titles must use Conventional Commits format:

- `fix(api): align trpc route`
- `feat(web): add agent run timeline`
- `chore(tokens): add shared radius scale`

PR bodies should be brief and include:

- Problem: what was wrong or missing.
- Solution: how it was fixed or implemented.
- Checks: what was run and whether it passed.
- Impact: user-facing, API, data, migration, deployment, or compatibility impact.

For UI changes that add, remove, or fix visible behavior, include before/after images. If the change involves motion, animation, transitions, gestures, or interaction timing, include a short video instead of only screenshots.

Upload PR evidence to GitHub, not to the repository. Never commit PR-only screenshots, recordings, or temporary assets.

Agents usually create PRs through GitHub CLI, so use `gh --attach` as the default path when you have local screenshot or video files. If the PR body references those local files, GitHub CLI rewrites them to uploaded `user-attachments` URLs:

```sh
gh pr create \
  --title "fix(web): improve approval dialog" \
  --body-file pr-body.md \
  --attach before.png \
  --attach after.png
```

Use the same flag when editing or commenting on an existing PR:

```sh
gh pr edit 123 \
  --body-file pr-body.md \
  --attach before.png \
  --attach after.png
```

```sh
gh pr comment 123 \
  --body-file pr-comment.md \
  --attach motion.mp4
```

The CLI upload path requires push access to the repository. When an agent lacks that access, or when a human contributor is working through the browser, use the GitHub web UI:

1. Open the PR description or comment editor.
2. Drag and drop the local file into the editor, paste the image from the clipboard, or use the attachment button.
3. Wait for GitHub to upload it and insert a `https://github.com/user-attachments/assets/...` URL.
4. Keep the generated URL in the PR body under a clear `Before`, `After`, or motion/video label.

Use this shape for UI evidence:

```md
## UI Changes

### Before

<img width="..." alt="Before: concise description" src="https://github.com/user-attachments/assets/..." />

### After

<img width="..." alt="After: concise description" src="https://github.com/user-attachments/assets/..." />
```

For videos, paste the uploaded GitHub attachment URL on its own line so GitHub renders it as a player:

```md
### Motion

https://github.com/user-attachments/assets/...
```

# Commits

Never create a commit unless the user explicitly asks for one.

Commit messages must:

- use Conventional Commits format
- be 100 characters or fewer
- pass Lefthook hooks

Examples:

- `fix(api): guard private trpc route`
- `feat(web): add approval queue`
- `chore(tokens): add shared typography scale`

Stage files with intent. Do not use a blind `git add .`, and do not stage files one by one when a coherent group should be staged together. Group staged files by the responsibility of the commit.

# Ultracite Code Standards

This project uses **Ultracite**, a zero-config preset that enforces strict code quality standards through automated formatting and linting.

## Quick Reference

- **Format code**: `bun x ultracite fix`
- **Check for issues**: `bun x ultracite check`
- **Diagnose setup**: `bun x ultracite doctor`

Biome (the underlying engine) provides robust linting and formatting. Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity.
- Prefer `unknown` over `any` when the type is genuinely unknown.
- Use const assertions (`as const`) for immutable values and literal types.
- Leverage TypeScript's type narrowing instead of type assertions.
- Use meaningful variable names instead of magic numbers; extract constants with descriptive names.

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions.
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops.
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access.
- Prefer template literals over string concatenation.
- Use destructuring for object and array assignments.
- Use `const` by default, `let` only when reassignment is needed, never `var`.

### Async & Promises

- Always `await` promises in async functions.
- Use `async/await` syntax instead of promise chains for better readability.
- Handle errors appropriately in async code with try-catch blocks.
- Do not use async functions as Promise executors.

### React & JSX

- Use function components over class components.
- Call hooks at the top level only, never conditionally.
- Specify all dependencies in hook dependency arrays correctly.
- Use the `key` prop for elements in iterables; prefer unique IDs over array indices.
- Nest children between opening and closing tags instead of passing them as props.
- Do not define components inside other components.
- Use semantic HTML and ARIA attributes for accessibility:
  - Provide meaningful alt text for images.
  - Use proper heading hierarchy.
  - Add labels for form inputs.
  - Include keyboard event handlers alongside mouse events.
  - Use semantic elements such as `<button>` and `<nav>` instead of `div` elements with roles.

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code.
- Throw `Error` objects with descriptive messages, not strings or other values.
- Use `try-catch` blocks meaningfully; do not catch errors just to rethrow them.
- Prefer early returns over nested conditionals for error cases.

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits.
- Extract complex conditions into well-named boolean variables.
- Use early returns to reduce nesting.
- Prefer simple conditionals over nested ternary operators.
- Group related code together and separate concerns.

### Security

- Add `rel="noopener"` when using `target="_blank"` on links.
- Avoid `dangerouslySetInnerHTML` unless absolutely necessary.
- Do not use `eval()` or assign directly to `document.cookie`.
- Validate and sanitize user input.
- Keep secrets out of chat output, logs, memories, skills, public configuration, and committed files.

### Performance

- Avoid spread syntax in accumulators within loops.
- Use top-level regex literals instead of creating them in loops.
- Prefer specific imports over namespace imports.
- Avoid barrel files that re-export everything.
- Use proper image components when the framework provides them.

### Framework-Specific Guidance

**TanStack Start/Vite React:**

- Keep route code aligned with TanStack Router conventions.
- Keep app env access typed through `@quorl/env`.
- Keep tRPC client paths aligned with `apps/api`.

**Hono:**

- Keep middleware explicit and scoped.
- Keep route prefixes stable and documented.
- Return proper `Response` objects and Hono context responses.

**React 19+:**

- Use ref as a prop instead of `React.forwardRef`.

**Expo/React Native:**

- Keep mobile UI aligned with Expo Router, Uniwind, and HeroUI Native.
- Prefer platform-safe APIs and avoid web-only assumptions.

**Rust/Desktop:**

- Use Cargo commands through the existing package scripts.
- Keep local machine access explicit, minimal, and user-approved.

---

## Testing

- Write assertions inside `it()` or `test()` blocks.
- Avoid done callbacks in async tests; use async/await instead.
- Do not use `.only` or `.skip` in committed code.
- Keep test suites reasonably flat; avoid excessive `describe` nesting.
- For browser-visible changes, verify the real route with Playwright when practical.
- For API route changes, verify the concrete path and status code.
- For DB changes, verify against the configured real database unless the user explicitly asks for a temporary database.

## When Biome Can't Help

Biome's linter will catch most issues automatically. Focus your attention on:

1. **Business logic correctness** - Biome cannot validate product behavior.
2. **Meaningful naming** - Use descriptive names for functions, variables, and types.
3. **Architecture decisions** - Component structure, data flow, API design, and package boundaries.
4. **Edge cases** - Handle boundary conditions, missing env, partial completion, and blocked external systems.
5. **User experience** - Accessibility, performance, visibility, approvals, and intervention flows.
6. **Documentation** - Add comments for complex logic, but prefer self-documenting code.

---

Most formatting and common issues are automatically fixed by Biome. Run `bun x ultracite fix` before committing to ensure compliance.
