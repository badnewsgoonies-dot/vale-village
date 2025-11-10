# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vale Chronicles V2 - A greenfield RPG rebuild with clean architecture. This is a Golden Sun-inspired turn-based RPG built with React, TypeScript, Zustand, and Zod.

## Commands

### Development
```bash
pnpm dev              # Start dev server
pnpm build            # Type check + build
pnpm typecheck        # Run TypeScript type checking
pnpm lint             # Lint code
```

### Testing
```bash
pnpm test             # Run all tests with coverage
pnpm test:watch       # Run tests in watch mode
vitest run <path>     # Run specific test file
```

### Data Validation
```bash
pnpm validate:data    # Validate all JSON data against Zod schemas
```

### Pre-commit
```bash
pnpm precommit        # Run typecheck, lint, test, and validate:data
```

## Architecture

### Core Principles

**Clean Architecture with Strict Boundaries:**
- `src/core/` - Pure TypeScript, no React, fully deterministic
- `src/ui/` - React components, UI logic
- `src/data/` - JSON data files and Zod schemas
- `tests/` - Mirror of src/ structure

**Dependency Flow:**
```
UI → State (Zustand slices) → Services → Algorithms → Models
```

### Critical Guardrails

1. **No React in `core/**`** - ESLint enforces this. Core is React-free for testability and determinism.

2. **No classes in `core/models/**`** - Models are POJOs (Plain Old JavaScript Objects) with factory functions and immutable updates. Example:
   ```typescript
   export interface BattleState { readonly playerTeam: Team; /* ... */ }
   export function createBattleState(/* ... */): BattleState { /* ... */ }
   export function updateBattleState(state: BattleState, updates: Partial<BattleState>): BattleState {
     return { ...state, ...updates };
   }
   ```

3. **No `any` in `core/**`** - ESLint error level enforcement. All types must be explicit.

4. **Seeded RNG only in core** - Use `PRNG` interface from `src/core/random/prng.ts`. Never use `Math.random()` in core logic. This ensures deterministic, reproducible battles and can be serialized for save/replay systems.

5. **Zod is single source of truth** - All data files (`src/data/definitions/*.ts`) must have corresponding Zod schemas (`src/data/schemas/*Schema.ts`). Run `pnpm validate:data` to verify.

6. **State in Zustand, not components** - State management uses Zustand slices in `src/ui/state/`. React components should be thin and call slice methods.

### Directory Structure

```
src/
├── core/
│   ├── algorithms/     # Pure functions: damage, turn-order, stats, status, targeting, xp
│   ├── models/         # POJOs with factory functions: Unit, Team, BattleState, Equipment
│   ├── random/         # Seeded PRNG implementation (XorShift)
│   ├── services/       # Orchestration layer: BattleService, AIService, SaveService, StoryService, EncounterService
│   ├── save/           # Save system logic and migrations
│   ├── utils/          # Pure utilities
│   └── validation/     # Data validation scripts
├── data/
│   ├── definitions/    # Game content: abilities, units, enemies, equipment, encounters
│   ├── schemas/        # Zod schemas for all data types
│   └── credits.json    # Credits data
├── ui/
│   ├── components/     # React components
│   ├── state/          # Zustand store + slices (battleSlice, teamSlice, saveSlice, storySlice)
│   ├── sprites/        # Sprite management
│   └── utils/          # UI-specific utilities
└── infra/
    └── save/           # Save infrastructure (localStorage)
```

### Key Patterns

**Services Orchestrate, Algorithms Execute:**
- Services (`src/core/services/`) coordinate multiple algorithms and manage state transitions
- Algorithms (`src/core/algorithms/`) are pure functions that perform calculations
- Example: `BattleService.performAction()` orchestrates damage calculation, status checks, and state updates

**Immutable Updates:**
All model updates return new objects. Use factory functions and spread operators:
```typescript
export function updateBattleState(state: BattleState, updates: Partial<BattleState>): BattleState {
  return { ...state, ...updates };
}
```

**Zustand Slices:**
Store is composed of slices in `src/ui/state/`:
- `battleSlice.ts` - Battle state, events, turn progression
- `teamSlice.ts` - Player team management
- `saveSlice.ts` - Save/load operations
- `storySlice.ts` - Story progression tracking

Each slice is created via `StateCreator` and combined in `store.ts`.

**PRNG Threading:**
Pass `PRNG` instance through function parameters. Clone for branching:
```typescript
function someRandomOperation(rng: PRNG): Result {
  const value = rng.next(); // [0, 1)
  // Use value for calculations
}
```

**Path Aliases:**
Use `@/*` alias for imports: `import { createUnit } from '@/core/models/Unit'`

### Testing

**Location:** Tests mirror `src/` structure in `tests/` directory.

**Property-Based Testing:** Uses `fast-check` for property-based tests. See `tests/core/algorithms/*-properties.test.ts` for examples.

**Test Patterns:**
- Unit tests for pure functions (algorithms)
- Integration tests for services
- Property-based tests for invariants (e.g., damage non-negative, turn order deterministic)
- Use `makePRNG(seed)` for deterministic test data

**Running Specific Tests:**
```bash
vitest run tests/core/algorithms/damage.test.ts
vitest tests/core/services/BattleService.test.ts
```

### ESLint Import Restrictions

The following import rules are enforced:
- ❌ `src/ui/` cannot import from `src/core/`
- ❌ `src/core/algorithms/` cannot import from `src/core/services/`
- ✅ Services can use algorithms and models
- ✅ UI uses Zustand slices which call services

### Data Validation

All game data must validate against Zod schemas:
1. Define data in `src/data/definitions/*.ts`
2. Create/update schema in `src/data/schemas/*Schema.ts`
3. Run `pnpm validate:data` to ensure validity
4. Schemas export TypeScript types: `export type Unit = z.infer<typeof UnitSchema>`

### Save System

- Save format: `SaveV1Schema` in `src/data/schemas/SaveV1Schema.ts`
- Migrations: `src/core/migrations/` handles version upgrades
- Services: `SaveService` (core logic), `saveSlice` (UI integration)
- Infrastructure: `src/infra/save/` (localStorage implementation)
- Seed is saved for deterministic replay

### Story System

- Story progression tracked in `storySlice`
- Encounters have metadata (`encounterId`, `difficulty`)
- Post-battle cutscenes triggered via `npcId` on `BattleState`
- Use `getEncounterId(battle)` helper to access canonical encounter ID

## TypeScript Configuration

- Strict mode enabled
- `noUncheckedIndexedAccess: true` - All array/object access returns `T | undefined`
- `noImplicitReturns: true` - All code paths must return
- Path alias: `@/*` → `./src/*`
