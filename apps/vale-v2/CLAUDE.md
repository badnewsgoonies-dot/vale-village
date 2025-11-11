# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vale Chronicles V2 - A greenfield RPG rebuild with clean architecture. This is a Golden Sun-inspired turn-based RPG built with React, TypeScript, Zustand, and Zod.

**Game Features:**
- 10 recruitable units with 5 levels of progression (abilities unlock per level)
- 12 collectible Djinn (3 per element: Venus/Mars/Mercury/Jupiter) providing team-wide buffs
- 4-slot equipment system (weapon/armor/helm/boots)
- Turn-based tactical combat with elemental advantages
- XP-based leveling with non-linear curve: [0, 100, 350, 850, 1850]

**Current Status:** Core systems (battle, progression, equipment, djinn) run inside a deterministic queue-battle sandbox (`QueueBattleView`) that wires directly into the Zustand store.

**Last Updated:** 2025-11-10

**State Snapshot:** GameProvider has been fully sunset; all shared state lives in slices under `src/ui/state/`. Overworld/story screens are staged separately while the queue battle flow is hardened.

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
pnpm test                              # Run all tests under apps/vale-v2/tests with coverage
pnpm test:watch                        # Run tests in watch mode
vitest run apps/vale-v2/tests/core/algorithms/damage.test.ts
vitest run apps/vale-v2/tests/core/algorithms
vitest run apps/vale-v2/tests/battle
```

**Testing Philosophy:** Context-aware testing that proves gameplay works, not isolated unit tests. Tests focus on meaningful scenarios like "Level 1 loses, Level 5 wins" rather than "function returns number".

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

### Queue Battle Sandbox

- `src/ui/components/QueueBattleView.tsx` renders the planning UI, event log, Djinn/mana bars, and victory flow. It reads/writes the queue-specific slice (see below).
- `src/ui/state/queueBattleSlice.ts` owns planning-phase state: queued actions, mana pool, Djinn activation, and round execution via `QueueBattleService`.
- `src/ui/state/battleSlice.ts` remains for classic turn-by-turn flows (and is still used for deterministic previews), but `setBattle`/`perform` now drive the queue sandbox through `queueBattleSlice`.
- `src/ui/utils/createTestBattle.ts` seeds `createTestBattle()` so the dev server always boots into a deterministic 4v2 fight for rapid iteration. Swap this helper out when wiring real encounters.

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

## Game Systems

### Battle System
- **Damage Formula:** `(basePower + ATK - DEF×0.5) × randomMultiplier × elementAdvantage`
- **Element Advantages:** 1.5× damage when strong, 0.67× when weak (Venus > Mars > Jupiter > Mercury > Venus)
- **Turn Order:** Speed-based with turn queue, recalculated each round
- **Critical Hits:** Chance based on unit level and luck
- **Status Effects:** Buffs/debuffs tracked per unit with duration counters

### Djinn System
- **Team-Wide:** 3 Djinn slots affect entire party (not per-unit)
- **Synergy Bonuses:** All same element = +12 ATK/+8 DEF, mixed = balanced bonuses
- **Activation:** Using a Djinn in battle enters "Standby" mode (loses passive, recovers after turns)
- **Location:** Core logic in `src/core/algorithms/djinnCalculations.ts` and `src/data/djinn.ts`

### Leveling System
- **XP Curve:** Non-linear [0, 100, 350, 850, 1850] for levels 1-5
- **Ability Unlocks:** Each level unlocks new abilities (defined in unit data)
- **Stat Growth:** Base stats + (level × growthRates) + equipment + djinn
- **Level-Up:** Restores HP to full, persists across battles

### Equipment System
- **4 Slots:** Weapon (ATK), Armor (DEF/HP), Helm (DEF/RES), Boots (SPD/EVA)
- **Stat Bonuses:** Applied during `Unit.calculateStats()` calculation
- **Some weapons unlock abilities** (checked during ability validation)
- **Drop System:** 10% chance from normal battles, 50% from bosses

## TypeScript Configuration

- Strict mode enabled
- `noUncheckedIndexedAccess: true` - All array/object access returns `T | undefined`
- `noImplicitReturns: true` - All code paths must return
- Path alias: `@/*` → `./src/*`

## Common Development Tasks

### Adding a New Ability
1. Add ability data to `src/data/definitions/abilities.ts`
2. Ensure it validates against `AbilitySchema` (manaCost ≥ 0, basePower ≥ 0, unlockLevel 1-5)
3. Run `pnpm validate:data` to verify
4. Add to the relevant units' ability lists in `src/data/definitions/units.ts`
5. Test in battle: `vitest run apps/vale-v2/tests/battle/invariants.test.ts`

### Adding a New Unit
1. Add unit definition to `src/data/definitions/units.ts`
2. Follow stat balance: base ATK 8-19, HP 70-140, DEF 8-15
3. Assign 5 abilities (one unlocks per level)
4. Validate element is one of: Venus, Mars, Mercury, Jupiter
5. Run `pnpm validate:data`

### Adding New Equipment
1. Add to `src/data/definitions/equipment.ts`
2. Validate against `EquipmentSchema`
3. Test stat bonuses: `vitest run apps/vale-v2/tests/core/models/Equipment.test.ts`
4. Verify equipment changes battle outcomes in battle tests (`apps/vale-v2/tests/battle/`)

### Debugging Battle Issues
1. Use `makePRNG(seed)` for reproducible battles: `const rng = makePRNG(42)`
2. Check damage calculations in `src/core/algorithms/damage.ts`
3. Verify turn order in `src/core/algorithms/turnOrder.ts`
4. Check element advantages in damage calculations (1.5× or 0.67×)
5. Run integration tests: `vitest run apps/vale-v2/tests/core/services/`

### Modifying Core Game Logic
1. **Never** modify algorithms without updating tests
2. Run full test suite before committing: `pnpm precommit`
3. Check that battle tests (`apps/vale-v2/tests/battle/`) and service tests still pass (not just unit tests)
4. Verify no regressions in deterministic queue-battle tests (`apps/vale-v2/tests/core/services/queue-battle.test.ts`)

## Current Status & Recent Progress

- **State Management:** Zustand slices power queue battle (`queueBattleSlice`, `battleSlice`, `rewardsSlice`, `storySlice`). GameProvider is removed.
- **Recent Work:** Queue planning/execution service, deterministic preview seeds, post-battle rewards/victory overlay, storySlice hooks for encounter-finished events.
- **Next Focus:** Wiring overworld/story navigation back in once queue battle + rewards UX solidifies.
- **Testing:** Context-aware suites covering algorithms, services, and battle flows (`apps/vale-v2/tests/**`).

## Known Issues & TODOs

- **Console Logs:** Some files still have console statements (cleanup needed)
- **Overworld Integration:** Battle transition system not yet connected to overworld
- **Data Migration:** Enemy/overworld data to be added incrementally as features are built

## Important Files for Context

- `README.md` - Project overview (v2-only)
- `VALE_CHRONICLES_ARCHITECTURE.md` - Complete system architecture
- `ARCHITECTURE_REBUILD_SUMMARY.md` - Recent refactoring summary
- `START_HERE.md` - Quick start guide for v2
- `V1_TO_V2_MIGRATION_STATUS.md` - Migration completion summary
