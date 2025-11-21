# Vale Chronicles V2 – AI workspace instructions

These instructions apply to all AI agents working in this repo.

## Architecture & boundaries
- Main app: React + TypeScript + Vite; entrypoint `src/main.tsx`, root component `src/App.tsx`.
- Core game logic lives in `src/core/**` (algorithms, models, services, PRNG). It must stay **pure, deterministic, and React-free**.
- UI and state live in `src/ui/**` (components, hooks, Zustand slices). Business rules belong in `core/services/**`, not in components or slices.
- Data and schemas live in `src/data/definitions/**` and `src/data/schemas/**`. Zod schemas are the single source of truth for all game content.
- Infrastructure (save system, persistence) is under `src/infra/**`; story/overworld content is under `src/story/**`.

## Determinism, types, and patterns
- Never use `Math.random()` in game logic. Use the seeded PRNG in `core/random/prng.ts` and pass a `PRNG` as the **last parameter** to any function that needs randomness.
- No React imports and no `any` types are allowed in `core/**` (ESLint-enforced). Keep models as immutable POJOs; update state by returning new objects.
- Respect dependency flow: `ui → ui/state (Zustand) → core/services → core/algorithms → core/models`. Do not import algorithms directly into React components.
- IDs are usually `kebab-case` for battle content (abilities, equipment, units) and `snake_case` for world/story IDs. See `docs/NAMING_CONVENTIONS.md` before adding new IDs or types.

## State, modes, and cross-cutting flows
- Global game state is in `ui/state/store.ts` and its slices (battle, queueBattle, rewards, overworld, dialogue, gameFlow, story, team, inventory, save, etc.). Add new state via slices, not React context.
- Mode transitions (overworld ⇄ team-select ⇄ battle ⇄ rewards ⇄ dialogue) are coordinated by `gameFlowSlice`, `rewardsSlice`, and `dialogueSlice`. When changing flow, reuse `handleRewardsContinue` in `App.tsx` instead of duplicating logic.
- Recruitment and Djinn rewards are **data-driven**: encounters set an `encounterId`, rewards store it in `lastBattleEncounterId`, then dialogue/recruitment lookups use that ID. Keep this pipe intact when adding new encounters or story beats.

## Commands and workflows
- From repo root: `pnpm dev`, `pnpm test`, `pnpm test:e2e`, `pnpm typecheck`, `pnpm lint`, `pnpm validate:data`, `pnpm precommit`.
- Unit tests use Vitest, E2E uses Playwright with tests under `tests/e2e/**`.
- After editing anything in `src/data/definitions/**`, always run `pnpm validate:data` and fix schema or data issues rather than weakening validation.

## Testing philosophy
- Prefer **context-aware scenario tests** that prove real gameplay (e.g. “Lv1 loses, Lv5 wins”, “no-Djinn vs 3-Djinn team”) over trivial unit tests. Mirror this style when adding tests.
- New core logic should come with unit/service tests in `tests/**` (mirroring the `src/**` structure) and, where relevant, shared factories in `src/test/**`.
- When tests fail, **fix the game, not the tests**: E2E helpers are thin and should reflect real player flows (see `E2E_TEST_COVERAGE_SUMMARY.md` and `tests/e2e/comprehensive-gameplay-menus.spec.ts`).

## Dev mode, debugging, and test hooks
- Dev-mode behavior and hotkeys are implemented via `ui/hooks/useDevMode.ts` and `DevModeOverlay`. Use them for test-only shortcuts; avoid wiring new permanent cheats into production flows.
- `App.tsx` exposes helpers on `window.__VALE_*__` for E2E tests (store access, PRNG, Djinn and stats helpers). Reuse these for new tests instead of introducing ad-hoc globals.
- Before opening a PR, ensure core checks pass from the repo root: `pnpm precommit`, then run at least the critical E2E suites if you touched battles, rewards, recruitment, or menus.

## Key references
- High-level architecture and rules: `CLAUDE.md`, `VALE_CHRONICLES_ARCHITECTURE.md`, `VALE_CHRONICLES_KNOWLEDGE_BASE.md`.
- E2E structure and scenarios: `E2E_TEST_COVERAGE_SUMMARY.md`, `tests/e2e/**`.
- Naming and data conventions: `docs/NAMING_CONVENTIONS.md`, `src/data/schemas/**`.
