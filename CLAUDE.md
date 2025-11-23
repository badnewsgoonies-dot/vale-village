# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Quick Reference Card

**Most Common Commands:**

```bash
pnpm dev               # Start dev server (loads into test battle)
pnpm test              # Run all tests with coverage
pnpm test:watch        # Run tests in watch mode
pnpm validate:data     # Validate all game data against Zod schemas
pnpm typecheck         # TypeScript type checking
pnpm lint              # Run ESLint
pnpm build             # Build for production

# Run specific tests
vitest run tests/core/algorithms/damage.test.ts    # Single file
vitest run tests/core/services/                     # Directory
vitest run tests/gameplay/                          # Gameplay tests
```

**Important Files:**

- [CHANGELOG.md](CHANGELOG.md) - Recent changes & breaking changes
- [docs/NAMING_CONVENTIONS.md](docs/NAMING_CONVENTIONS.md) - ID formatting rules
- [docs/app/GAME_MECHANICS_FLOW.md](docs/app/GAME_MECHANICS_FLOW.md) - Complete flow documentation

---

## Project Overview

Vale Chronicles V2 - A greenfield RPG rebuild with clean architecture. Golden Sun-inspired turn-based RPG built with React, TypeScript, Zustand, and Zod.

**Game Features:**

- 10 recruitable units with 20 levels of progression (abilities unlock per level)
- 12 collectible Djinn (3 per element) providing team-wide buffs and ability unlocking
- 5-slot equipment system (weapon/armor/helm/boots/accessory) - element-restricted
- Turn-based tactical combat with elemental advantages, mana-based abilities
- XP-based leveling with non-linear curve: [0, 100, 350...92,800] for levels 1-20

**Current Status:** Core systems (battle, progression, equipment, djinn) run inside a deterministic queue-battle sandbox (`QueueBattleView`) that wires directly into the Zustand store.

---

## Architecture

### Core Principles

**Clean Architecture with Strict Boundaries:**

- `src/core/` - Pure TypeScript, no React, fully deterministic
- `src/ui/` - React components, UI logic
- `src/data/` - JSON data files and Zod schemas
- `src/infra/` - Infrastructure (save system, localStorage)

**Dependency Flow:**

```
UI → State (Zustand slices) → Services → Algorithms → Models
```

### Critical Guardrails

1. **No React in `core/**`** - ESLint enforces this. Core is React-free for testability and determinism.

2. **No classes in `core/models/**`** - Models are POJOs with factory functions and immutable updates:

   ```typescript
   export interface BattleState { readonly playerTeam: Team; /* ... */ }
   export function createBattleState(/* ... */): BattleState { /* ... */ }
   export function updateBattleState(state: BattleState, updates: Partial<BattleState>): BattleState {
     return { ...state, ...updates };
   }
   ```

3. **No `any` in `core/**`** - ESLint error level enforcement. All types must be explicit.

4. **Seeded RNG only in core** - Use `PRNG` interface from `src/core/random/prng.ts`. Never use `Math.random()` in core logic. Ensures deterministic, reproducible battles.

5. **Zod is single source of truth** - All data files (`src/data/definitions/*.ts`) must have corresponding Zod schemas (`src/data/schemas/*Schema.ts`). Run `pnpm validate:data` to verify.

6. **State in Zustand, not components** - State management uses Zustand slices in `src/ui/state/`. React components should be thin and call slice methods.

### ESLint Import Restrictions

The following import rules are enforced:

- ❌ `src/ui/` cannot import from `src/core/`
- ❌ `src/core/algorithms/` cannot import from `src/core/services/`
- ✅ Services can use algorithms and models
- ✅ UI uses Zustand slices which call services

### Queue Battle Sandbox

- `src/ui/components/QueueBattleView.tsx` renders the planning UI, event log, Djinn/mana bars, and victory flow.
- `src/ui/state/queueBattleSlice.ts` owns planning-phase state: queued actions, mana pool, Djinn activation, and round execution via `QueueBattleService`.
- `src/ui/state/battleSlice.ts` remains for classic turn-by-turn flows and deterministic previews.
- `src/ui/utils/createTestBattle.ts` seeds `createTestBattle()` so the dev server always boots into a deterministic 4v2 fight for rapid iteration.

---

## Coding Conventions

### Function Naming Prefixes

Functions follow consistent naming patterns:

- **`create*`** - Factory functions for production models (`createUnit`, `createTeam`, `createBattleState`)
- **`mk*`** - Factory functions for tests only (`mkUnit`, `mkEnemy`, `mkTeam`) - located in `src/test/factories.ts`
- **`make*`** - Alternative factories, usually for utilities (`makePRNG`)
- **`calculate*`** - Pure mathematical computations (`calculateDamage`, `calculateMaxHp`, `calculateTurnOrder`)
- **`check*`** - Boolean predicates that return true/false (`checkCriticalHit`, `checkDodge`)
- **`get*`** - Accessor/getter functions (`getCurrentNode`, `getAvailableChoices`, `getElementModifier`)
- **`apply*`** - Functions that transform state (`applyDamage`, `applyHealing`, `applyStatusEffect`)
- **`is*`** - Type guards and boolean checks (`isUnitKO`, `isDialogueComplete`)
- **`can*`** - Permission/validation checks (`canMoveTo`, `canAffordAction`, `canUseAbility`)

### File Naming

- **PascalCase**: Models and React components (`Unit.ts`, `BattleView.tsx`)
- **kebab-case**: Algorithms and services (`damage.ts`, `turn-order.ts`)
- **camelCase**: Utilities (`prng.ts`, `result.ts`)
- **Slice suffix**: State slices (`battleSlice.ts`, `teamSlice.ts`)
- **Schema suffix**: Zod schemas (`UnitSchema.ts`, `MapSchema.ts`) - **PascalCase**

### Function Parameters

Standard order: **subject → context → ability → rng (always last)**

```typescript
// ✓ Good
function calculateDamage(
  attacker: Unit,      // subject
  defender: Unit,       // subject
  team: Team,           // context
  ability: Ability,     // action
  rng: PRNG             // always last
): number

// ✗ Bad - rng in middle
function calculateDamage(attacker: Unit, rng: PRNG, defender: Unit): number
```

### ID Formatting

All IDs use **kebab-case**: `'adept'`, `'war-mage'`, `'heavy-strike'`, `'wooden-sword'`

See `docs/NAMING_CONVENTIONS.md` for detailed ID formatting rules.

### Never Use `enum`

Use string literal unions instead:

```typescript
// ✓ Good
type Element = 'Venus' | 'Mars' | 'Mercury' | 'Jupiter';

// ✗ Bad
enum Element { Venus, Mars, Mercury, Jupiter }
```

---

## Game Systems

**📖 For detailed flow documentation, see [docs/app/GAME_MECHANICS_FLOW.md](docs/app/GAME_MECHANICS_FLOW.md)**

### Battle System

- **Damage Formula:** `(basePower + ATK - DEF×0.5) × elementAdvantage`
- **Element Advantages:** 1.5× damage when strong, 0.67× when weak (Venus > Mars > Jupiter > Mercury > Venus)
- **Critical Hits:** Chance based on unit level and luck
- **Status Effects:** Buffs/debuffs tracked per unit with duration counters

#### Turn Order System (Queue-Based)

- **Speed = Turn Order:** Fastest unit acts first, slowest acts last
- **Position = Execution Order:** Slot 1 (leftmost) = fastest = acts first. Visual position reflects turn order.
- **Pre-Battle Auto-Sort:** When selecting units for battle, they auto-sort by SPD. Picking a unit inserts it into the correct speed-sorted position.
- **Speed Changes Apply End-of-Round:** Speed buffs/debuffs cast this round take effect at end of round, affecting NEXT round's order. No mid-round chaos.
- **Player vs Enemy Interleaving:** All combatants (players + enemies) sorted by SPD together (Golden Sun style, fully mixed turn order)

#### Speed Tie Resolution

1. **Primary:** Current SPD (with all buffs/equipment/djinn)
2. **Pre-battle ties:** User can pick order among tied units
3. **Ultimate fallback:** Original base SPD (level 1 starter stat) - stored as `baseSpeed` on unit definition

#### Mana System (Team-Wide Pool)

- **Auto-Attack:** Costs 0 mana, generates +1 mana during execution phase
- **Abilities:** Cost mana from shared team pool
- **Mana Preview UI:** Show "+1" as ghosted/pending segment when auto-attack is queued (indicates "this mana is coming" without implying it's available now)
- **Mana Generation Timing:** Mana from auto-attacks becomes available during execution, so later units in turn order can use mana generated by earlier units' auto-attacks

### Mode Transitions

- **Flow:** `overworld → team-select → battle → rewards → dialogue (if recruitment) → overworld`
- **Key Points:**
  - `setPendingBattle()` automatically sets mode to `'team-select'`
  - `encounterId` preserved in `rewardsSlice.lastBattleEncounterId` for post-battle dialogues
  - `handleRewardsContinue()` orchestrates rewards → dialogue → overworld transition
- See [docs/app/GAME_MECHANICS_FLOW.md](docs/app/GAME_MECHANICS_FLOW.md) for complete flow

### Djinn System

- **Team-Wide:** 3 Djinn slots affect entire party (not per-unit)
- **Synergy Bonuses:** All same element = +12 ATK/+8 DEF, mixed = balanced bonuses
- **Activation:** Using a Djinn in battle enters "Standby" mode (loses passive, recovers after turns)
- **Acquisition Methods:**
  1. Dialogue effects (`grantDjinn` in recruitment dialogues) - calls `collectDjinn()` directly
  2. Story flags (`STORY_FLAG_TO_DJINN` mapping) - via `processStoryFlagForDjinn()`
  3. Pre-game (starting Djinn)
- **Location:** Core logic in `src/core/algorithms/djinnCalculations.ts` and `src/core/services/DjinnService.ts`

### Leveling System

- **XP Curve:** Non-linear [0, 100, 350, 850, 1850...92,800] for levels 1-20
- **Ability Unlocks:** Each level unlocks new abilities (defined in unit data)
- **Stat Growth:** Base stats + (level × growthRates) + equipment + djinn
- **Level-Up:** Restores HP to full, persists across battles

### Equipment System

- **5 Slots:** Weapon (ATK), Armor (DEF/HP), Helm (DEF), Boots (SPD), Accessory (various)
- **Element-Based:** Equipment restricted by element (not unit-specific)
- **Stat Bonuses:** Applied during `Unit.calculateStats()` calculation
- **Some weapons unlock abilities** (checked during ability validation)
- **Reward System:** Predetermined rewards (no RNG), may offer choice of 1 of 3 items

### Recruitment System

- **Two Methods:**
  1. **Recruitment Dialogues** - Post-battle dialogues for Houses 1, 5, 8, 11, 14, 15, 17
  2. **Story Joins** - Automatic via story flags (Houses 2, 3)
- **Dialogue Effects:** `recruitUnit` adds to roster, `grantDjinn` adds Djinn
- See [docs/app/GAME_MECHANICS_FLOW.md](docs/app/GAME_MECHANICS_FLOW.md) for complete flow

---

## Testing

**Testing Philosophy:** Context-aware testing that proves gameplay works, not isolated unit tests. Tests focus on meaningful scenarios like "Level 1 loses, Level 5 wins" rather than "function returns number".

**Test Patterns:**

- Unit tests for pure functions (algorithms)
- Integration tests for services
- Property-based tests for invariants (e.g., damage non-negative, turn order deterministic)
- Use `makePRNG(seed)` for deterministic test data

**Running Specific Tests:**

```bash
vitest run tests/core/algorithms/damage.test.ts
vitest tests/core/services/BattleService.test.ts
vitest run tests/gameplay/                          # Gameplay tests
```

**Test Conventions:**

- Use `test()` for all test functions (not `it()`)
- Test factories use `mk*` prefix, located in `src/test/factories.ts`
- Tests mirror `src/` structure in `tests/` directory

---

## Data Validation

All game data must validate against Zod schemas:

1. Define data in `src/data/definitions/*.ts`
2. Create/update schema in `src/data/schemas/*Schema.ts`
3. Run `pnpm validate:data` to ensure validity
4. Schemas export TypeScript types: `export type Unit = z.infer<typeof UnitSchema>`

---

## TypeScript Configuration

- Strict mode enabled
- `noUncheckedIndexedAccess: true` - All array/object access returns `T | undefined`
- `noImplicitReturns: true` - All code paths must return
- Path alias: `@/*` → `./src/*`

---

## Current Status

- **State Management:** Zustand slices power queue battle (`queueBattleSlice`, `battleSlice`, `rewardsSlice`, `storySlice`). GameProvider is removed.
- **Recent Work:** Queue planning/execution service, deterministic preview seeds, post-battle rewards/victory overlay, storySlice hooks for encounter-finished events.
- **Testing:** Context-aware suites covering algorithms, services, and battle flows (`tests/**`).

**Last Updated:** 2025-11-22