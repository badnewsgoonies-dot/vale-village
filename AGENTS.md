# Repository Guidelines

## Project Structure & Module Organization
- `src/core`: business logic, algorithms, models, validation, save/migrations; keep this UI-free. Other layers enter via `src/core/services`.
- `src/ui`: React components, hooks, Zustand store (`src/ui/state`), sprites/styles; avoid importing `src/core` directly per ESLint path rules.
- `src/data`: game definitions, schemas/types, and startup validation (`core/validation/validateAll`).
- `src/utils` & `src/infra`: shared utilities and infrastructure glue.
- Tests live in `tests/*` (domain buckets; Playwright in `tests/e2e`) with helpers in `src/test/*`. Static assets sit in `public/`; docs and plans in `docs/`.

## Build, Test, and Development Commands
- `pnpm install` then `pnpm dev`: start Vite dev server.
- `pnpm build`: TypeScript compile + Vite build; `pnpm preview` to serve the bundle.
- `pnpm typecheck`, `pnpm lint`: static checks (ESLint enforces path restrictions and no `any`/console).
- `pnpm test`: Vitest run with coverage (happy-dom); `pnpm test:watch` for TDD; `pnpm test:parallel` uses the optimized config.
- `pnpm test:e2e`: Playwright specs in `tests/e2e`.
- Data/assets: `pnpm validate:data` (Zod schema checks), `pnpm generate:sprites`, `pnpm validate:sprites`, `pnpm test:sprites`. Use `pnpm precommit` to run the full gate locally.

## Coding Style & Naming Conventions
- TypeScript/React; 2-space indent, single quotes, semicolons kept. Keep `core/algorithms` pure; side effects live in services/UI hooks.
- Components/files use `PascalCase`, functions/vars `camelCase`, constants `SCREAMING_SNAKE_CASE`.
- Respect ESLint path guards (`import/no-restricted-paths`) and store patterns in `src/ui/state`.
- No stray `console` (only `warn`/`error`); avoid `any`. Comment only for non-obvious game logic.

## Testing Guidelines
- Place unit/integration specs beside domain folders under `tests/` with `.test.ts`/`.test.tsx`/`.spec.tsx` naming; reuse factories/mocks from `src/test`.
- For UI and story flows, favor Playwright (`tests/e2e`) plus vitest integration suites (`tests/vs1/*`, `tests/battle/*`).
- Coverage runs by default via `pnpm test`; add regression cases for bug fixes and update schema tests when touching `src/data`.
- Keep fixtures deterministic (seed PRNGs in battle tests) and run `pnpm validate:data` before committing data changes.

## Commit & Pull Request Guidelines
- Branch from `main` using `feature/`, `fix/`, `docs/`, etc. Commits follow `<type>: <subject>` (e.g., `feat: Add queue battle flow`) per existing history.
- Draft PRs early; title mirrors commit style. Description summarizes scope, tests run, and linked issues. Include screenshots/gifs for UI updates.
- Before review: run `pnpm precommit`, ensure lint/typecheck/test/data validations pass, and list any known follow-ups in the PR body.
