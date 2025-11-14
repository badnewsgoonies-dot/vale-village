# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vale Chronicles V2** - A Golden Sun-inspired tactical RPG built with clean architecture principles. This is a monorepo containing a greenfield rebuild of the game using React, TypeScript, Zustand, and Zod.

**Working Directory:** This is a pnpm workspace monorepo. The main application is located in `apps/vale-v2/`.

**For detailed development guidance**, see `apps/vale-v2/CLAUDE.md` - it contains comprehensive architecture details, testing philosophy, and development workflows.

---

## Quick Reference Card

**Most Common Commands:**
```bash
pnpm test              # Run all tests with coverage
pnpm dev               # Start dev server
pnpm validate:data     # Validate game data against Zod schemas
pnpm typecheck         # TypeScript type checking
pnpm precommit         # Run all checks before committing
```

**Running Specific Tests:**
```bash
cd apps/vale-v2
vitest run tests/core/algorithms/damage.test.ts    # Single file
vitest run tests/gameplay/                          # Directory
vitest run tests/core/algorithms                    # All algorithm tests
```

**Key Files:**
- [apps/vale-v2/CLAUDE.md](apps/vale-v2/CLAUDE.md) - Detailed development patterns & conventions
- [CHANGELOG.md](CHANGELOG.md) - Recent changes & breaking changes (check after git pull!)
- [COMPREHENSIVE_AUDIT_2025.md](COMPREHENSIVE_AUDIT_2025.md) - Current state & roadmap

---

## What's New (Last Updated: 2025-11-14)

### Recent Critical Changes

**⚠️ Breaking Changes (Nov 11, 2025):**
- **Healing API Changed** - `applyHealing()` now requires 3rd parameter `abilityRevivesFallen`
  - Old: `applyHealing(unit, amount)`
  - New: `applyHealing(unit, amount, abilityRevivesFallen: boolean)`
  - Prevents healing KO'd units without revival flag
  - See [CHANGELOG.md](CHANGELOG.md) for migration guide

- **PRNG Validation Enforced** - Negative seeds now rejected (throws Error), zero seeds converted to 1
  - Critical for determinism guarantees
  - Update any test code using negative seeds

- **Team Djinn Validation** - Duplicate Djinn prevention and 3-Djinn limit enforced
  - `addDjinn()` now validates uniqueness and slot limits
  - Affects team management and save/load logic

### Recent Improvements

- **QueueBattleService Refactored** (Nov 2025)
  - `executeRound()` split into composable phases (~38 lines, down from 120+)
  - New phase functions: `validateQueueForExecution()`, `executePlayerActionsPhase()`, `executeEnemyActionsPhase()`, `checkBattleEndPhase()`, `transitionToPlanningPhase()`
  - Better testability and maintainability

- **AbilityId Type Safety** (Nov 2025)
  - New [data/types/AbilityId.ts](apps/vale-v2/src/data/types/AbilityId.ts) union type
  - Compile-time validation of ability IDs
  - Replaces stringly-typed ability references

- **Equipment Schema Default** - `statBonus` now defaults to `{}` instead of undefined

- **Phase 7: Djinn Ability Unlocking System** (Nov 12, 2025) ✅ COMPLETE
  - Element compatibility logic (same/counter/neutral)
  - Per-unit stat bonuses based on Djinn compatibility
  - 180 Djinn-granted abilities across 12 Djinn (15 per Djinn)
  - Full battle integration with ability unlocking/unlocking on Djinn state changes
  - Complete test coverage and data validation
  - See [docs/PHASE_07_COMPLETION_SUMMARY.md](docs/PHASE_07_COMPLETION_SUMMARY.md) for details

- **Repository Cleanup** (Nov 14, 2025) ✅ COMPLETE
  - Cleaned up stale AI-generated branches (53 → 18 branches, 66% reduction)
  - Removed 35 branches: 14 merged, 7 duplicate storyboards, 3 failed attempts, 6 local Cursor branches, 5 worktrees
  - All work safely preserved in `main`, no data loss
  - Cleaner git workflow with only active branches remaining

**For complete change history**, see [CHANGELOG.md](CHANGELOG.md)

## Prerequisites

Before working with this codebase, ensure you have:

- **Node.js 18+** - Verify with `node -v`
- **pnpm 8.15.0+** - Install with `npm install -g pnpm`

### First-Time Setup

```bash
# Install dependencies
pnpm install

# Verify setup works
pnpm test             # Should run test suite
pnpm validate:data    # Should validate game data
pnpm typecheck        # Should pass type checking
```

**Note:** You may see a pnpm workspace warning - this is non-blocking and can be ignored.

## Quick Start Commands

All commands from the root delegate to the vale-v2 app:

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Type check + build
pnpm typecheck        # Run TypeScript type checking
pnpm lint             # Lint code

# Testing
pnpm test             # Run all tests with coverage
pnpm test:watch       # Run tests in watch mode

# Data Validation
pnpm validate:data    # Validate JSON data against Zod schemas

# Pre-commit
pnpm precommit        # Run all checks (typecheck, lint, test, validate:data)
```

**To run specific tests:**
```bash
cd apps/vale-v2
vitest run tests/core/algorithms/damage.test.ts    # Run specific test
vitest run tests/gameplay/                          # Run gameplay tests
```

## Repository Structure

```
vale-village/
├── apps/
│   └── vale-v2/          # Main application (see apps/vale-v2/CLAUDE.md)
├── docs/
│   ├── adr/              # Architecture Decision Records
│   ├── architect/        # Technical specifications
│   ├── qa/               # QA assessments
│   └── story/            # Story documentation
├── mockups/              # Approved UI mockups
├── story/                # Game story framework
├── README.md             # Project overview
└── VALE_CHRONICLES_ARCHITECTURE.md  # Complete architecture doc
```

## Core Architecture Principles

This codebase follows strict clean architecture with enforced boundaries:

### 1. Layered Architecture (apps/vale-v2/src/)

```
core/         # Pure TypeScript, NO React, fully deterministic
├── models/      # POJOs with factory functions (no classes)
├── algorithms/  # Pure functions (damage, turn order, stats, xp)
├── services/    # Orchestration layer
├── random/      # Seeded PRNG for determinism
└── validation/  # Data validation scripts

ui/           # React components and UI logic
├── components/  # React components
├── state/       # Zustand store + slices
└── sprites/     # Sprite management

data/         # Game content with Zod schemas
├── definitions/ # JSON data (abilities, units, enemies, equipment)
└── schemas/     # Zod validation schemas (single source of truth)

infra/        # Infrastructure (save system, localStorage)
```

**Dependency Flow:** `UI → State (Zustand) → Services → Algorithms → Models`

### 2. Critical Guardrails (ESLint Enforced)

- **No React in `core/**`** - Core logic must be React-free for testability (enforced via code review)
- **No `any` types in `core/**`** - Error-level enforcement (`@typescript-eslint/no-explicit-any`)
- **Import restrictions** (ESLint enforced):
  - ❌ UI cannot import core directly (use services/hooks)
  - ❌ Algorithms cannot import services (services use algorithms, not vice versa)
  - ✅ State slices can import from `core/services/`
- **No `console.log`** - Only `console.warn` and `console.error` allowed (ESLint enforced)
- **Seeded RNG only** - Use `PRNG` interface, never `Math.random()` in core
- **Immutable updates** - Models are POJOs with factory functions, no classes
- **Zod schemas are source of truth** - All data validated at startup

### 3. State Management

Uses **Zustand** with feature-based slices (11 total):

**Battle System:**
- `battleSlice.ts` - Classic turn-by-turn battle state
- `queueBattleSlice.ts` - Queue-based battle planning and execution
- `rewardsSlice.ts` - Post-battle rewards and victory flow

**Game World:**
- `overworldSlice.ts` - Map state, player position, visited locations
- `dialogueSlice.ts` - Dialogue state and progression
- `gameFlowSlice.ts` - High-level game flow (menu, overworld, battle transitions)
- `storySlice.ts` - Story progression and flags

**Player State:**
- `teamSlice.ts` - Player team management (units, Djinn, party composition)
- `inventorySlice.ts` - Equipment inventory and item management
- `saveSlice.ts` - Save/load operations and persistence

**Store:**
- `store.ts` - Combines all slices into unified store

**Pattern:** State slices contain only state and setters. Business logic lives in `core/services/`.

#### When to Use Which Service

**Decision Tree for Common Tasks:**

```
Need to execute a battle action?
├─ Classic turn-by-turn battle → BattleService.performAction()
└─ Queue-based battle (planning phase) → QueueBattleService.queueAction() + executeRound()

Need AI to decide an action?
└─ AIService.selectAction() → Returns best action for AI unit

Need to handle encounter logic?
└─ EncounterService → Manages encounter triggers and spawn logic

Need to save/load game state?
└─ SaveService → Handles serialization, versioning, migrations

Need to manage dialogue progression?
└─ DialogueService (via dialogueSlice) → Handles dialogue trees and choices

Need to manage story progression?
└─ StoryService → Handles story flags, quest tracking

Need to handle rewards after battle?
└─ RewardsService → Calculates XP, gold, items, equipment from encounters

Need to manage overworld movement?
└─ OverworldService → Handles map navigation, triggers, encounters

Need deterministic random numbers?
└─ RngService (or use PRNG directly) → Manages seeded random generation

Need to handle shop transactions?
└─ ShopService → Manages buying/selling equipment
```

**Key Service Relationships:**
- **Battle flow:** `queueBattleSlice` → `QueueBattleService` → `BattleService` (for action execution) → algorithms (damage, status, etc.)
- **Rewards flow:** `rewardsSlice` → `RewardsService` → `calculateRewards()` algorithm
- **AI flow:** `AIService` → evaluates all possible actions → calls algorithms (damage, healing) for each option

### 4. Deterministic Game Logic

All randomness uses **seeded PRNG** for:

- Reproducible battles
- Save/load consistency
- Bug reproduction
- Golden tests

```typescript
// Pass PRNG through function parameters
function calculateDamage(attacker: Unit, defender: Unit, rng: PRNG): number {
  const roll = rng.next(); // [0, 1)
  // deterministic calculation
}
```

## Game Systems

- **10 recruitable units** with 20 levels of progression
- **12 Djinn** (3 per element: Venus/Mars/Mercury/Jupiter) with team-wide buffs and ability unlocking
- **5-slot equipment system** (Weapon/Armor/Helm/Boots/Accessory) - unit-locked
- **Turn-based battles** with queue system, elemental advantages, mana management
- **XP curve:** [0, 100, 350, 850, 1850, 3100...92,800] for levels 1-20

## Testing Philosophy

**Context-Aware Testing** - Tests prove gameplay works, not isolated units.

```typescript
// ✅ GOOD - Proves progression matters
test('Level 1 loses to Boss, Level 5 wins', () => {
  // Tests real gameplay impact
});

// ❌ BAD - Tests nothing meaningful
test('function returns number', () => {
  // Useless!
});
```

Run gameplay tests: `vitest run tests/gameplay/`

## Documentation Index

### Start Here (New Contributors)

1. **This file** ([CLAUDE.md](CLAUDE.md)) - High-level overview and commands
2. **[apps/vale-v2/CLAUDE.md](apps/vale-v2/CLAUDE.md)** - Detailed architecture and development patterns (READ THIS NEXT)
3. **[COMPREHENSIVE_AUDIT_2025.md](COMPREHENSIVE_AUDIT_2025.md)** - Current state audit & 6-month roadmap
4. **[docs/adr/000-architecture-goals.md](docs/adr/000-architecture-goals.md)** - Core design principles

### Architecture & Design

- **[VALE_CHRONICLES_ARCHITECTURE.md](VALE_CHRONICLES_ARCHITECTURE.md)** - Complete system architecture reference
- **[ARCHITECTURE_REBUILD_SUMMARY.md](ARCHITECTURE_REBUILD_SUMMARY.md)** - Recent migration summary (GameProvider → Zustand)
- **[docs/adr/](docs/adr/)** - Architecture Decision Records
  - [000-architecture-goals.md](docs/adr/000-architecture-goals.md) - Overall architecture goals
  - [001-layering-and-boundaries.md](docs/adr/001-layering-and-boundaries.md) - Layer rules and import restrictions
  - [002-state-management.md](docs/adr/002-state-management.md) - Zustand patterns and conventions
  - [003-model-conventions.md](docs/adr/003-model-conventions.md) - Model patterns (POJOs, factories)
  - [004-rng-and-determinism.md](docs/adr/004-rng-and-determinism.md) - PRNG usage and seeding
  - [005-validation-strategy.md](docs/adr/005-validation-strategy.md) - Data validation with Zod

### Current State & Planning

- **[CHANGELOG.md](CHANGELOG.md)** - Recent changes and breaking changes (check this after git pull!)
- **[COMPREHENSIVE_AUDIT_2025.md](COMPREHENSIVE_AUDIT_2025.md)** - Detailed content audit and roadmap
  - Current metrics: units, abilities, equipment, enemies, encounters, maps
  - Known issues and test status
  - 6-week demo timeline
  - 6-month full game plan
- **[SYSTEMS_AUDIT_AND_IMPLEMENTATION_PROMPTS.md](SYSTEMS_AUDIT_AND_IMPLEMENTATION_PROMPTS.md)** - 6 systems needing work with implementation guides
- **[apps/vale-v2/docs/NAMING_CONVENTIONS.md](apps/vale-v2/docs/NAMING_CONVENTIONS.md)** - ID formatting rules (kebab-case required)

### Game Design

- **[docs/architect/](docs/architect/)** - Technical specifications for game systems
- **[docs/story/](docs/story/)** - Story documentation and world-building
- **[mockups/](mockups/)** - Approved UI mockups and designs
- **[story/](story/)** - Game story framework and narrative design

## TypeScript Configuration

- Strict mode enabled
- `noUncheckedIndexedAccess: true` - Array/object access returns `T | undefined`
- `noImplicitReturns: true` - All code paths must return
- Path alias: `@/*` maps to `./src/*` (in vale-v2)

## Common Pitfalls & How to Avoid Them

### 1. Forgetting PRNG in Function Signatures
**Problem:** Using `Math.random()` or forgetting to pass `PRNG` as the last parameter.

```typescript
// ❌ BAD - Uses Math.random()
function calculateDamage(attacker: Unit, defender: Unit): number {
  const roll = Math.random(); // BREAKS determinism!
  return baseDamage * roll;
}

// ❌ BAD - Missing PRNG parameter
function calculateCritical(attacker: Unit): boolean {
  return Math.random() < 0.1; // NOT deterministic!
}

// ✅ GOOD - PRNG as last parameter
function calculateDamage(attacker: Unit, defender: Unit, rng: PRNG): number {
  const roll = rng.next(); // Deterministic!
  return baseDamage * roll;
}
```

**Fix:** Always pass `PRNG` as the last parameter in any function that needs randomness.

---

### 2. Violating Clean Architecture Boundaries
**Problem:** Importing from the wrong layer, breaking dependency flow.

```typescript
// ❌ BAD - UI importing core/algorithms directly
import { calculateDamage } from '@/core/algorithms/damage';

// ❌ BAD - Algorithms importing services
import { BattleService } from '@/core/services/BattleService';

// ✅ GOOD - UI uses services or hooks
import { useBattle } from '@/ui/hooks/useBattle';
// or
import { performAction } from '@/core/services/BattleService';

// ✅ GOOD - Services use algorithms
import { calculateDamage } from '@/core/algorithms/damage';
```

**Fix:** Follow the dependency flow: `UI → State → Services → Algorithms → Models`. ESLint will catch most of these.

---

### 3. Not Validating Data After Changes
**Problem:** Adding/modifying game data without running validation, causing runtime errors.

```bash
# ❌ BAD - Modify data and commit
git add src/data/definitions/units.ts
git commit -m "Added new unit"

# ✅ GOOD - Validate before committing
pnpm validate:data    # Catches schema violations!
pnpm test              # Ensures data works in tests
pnpm precommit         # Runs all checks
git add src/data/definitions/units.ts
git commit -m "Added new unit"
```

**Fix:** Always run `pnpm validate:data` after modifying any file in `src/data/definitions/`.

---

### 4. Using `any` Types in Core
**Problem:** Using `any` defeats TypeScript's safety and is forbidden in `core/`.

```typescript
// ❌ BAD - ESLint will error!
function processUnit(unit: any): void {
  // Type safety lost!
}

// ✅ GOOD - Explicit types
function processUnit(unit: Unit): void {
  // Type-safe!
}

// ✅ GOOD - Generic constraints
function processEntity<T extends { id: string }>(entity: T): void {
  // Type-safe with flexibility!
}
```

**Fix:** Use proper types. If you need flexibility, use generics with constraints or union types.

---

### 5. Mutating Models Instead of Creating New Ones
**Problem:** Directly modifying model properties instead of using immutable updates.

```typescript
// ❌ BAD - Mutating existing object
function damageUnit(unit: Unit, damage: number): Unit {
  unit.currentHp -= damage; // MUTATION!
  return unit;
}

// ✅ GOOD - Immutable update
function damageUnit(unit: Unit, damage: number): Unit {
  return {
    ...unit,
    currentHp: unit.currentHp - damage,
  };
}
```

**Fix:** Always return new objects using spread operators. Use `updateUnit()`, `updateBattleState()` helper functions.

---

### 6. Not Checking Array/Object Access
**Problem:** TypeScript's `noUncheckedIndexedAccess` means array access returns `T | undefined`.

```typescript
// ❌ BAD - TypeScript error!
const firstUnit = team.units[0];
console.log(firstUnit.name); // Error: 'firstUnit' is possibly 'undefined'

// ✅ GOOD - Check before use
const firstUnit = team.units[0];
if (firstUnit) {
  console.log(firstUnit.name);
}

// ✅ GOOD - Optional chaining
console.log(team.units[0]?.name);
```

**Fix:** Always check for `undefined` when accessing arrays/objects by index or key.

---

### 7. Forgetting to Update Tests
**Problem:** Modifying core algorithms without updating corresponding tests.

```bash
# ❌ BAD - Modify algorithm, skip tests
# (Tests will fail, you'll waste time debugging later)

# ✅ GOOD - Update tests immediately
# 1. Modify algorithm
# 2. Run existing tests: pnpm test
# 3. Update/add tests for new behavior
# 4. Verify: pnpm test
```

**Fix:** Never modify an algorithm without immediately updating its tests. Tests document expected behavior.

---

### 8. Using AI-Generated Branches Without Cleanup
**Problem:** AI tools (Claude, Cursor, Copilot) create branches automatically and don't clean up.

```bash
# ❌ BAD - Let branches accumulate
# After a month: 50+ branches, half are duplicates/merged/failed

# ✅ GOOD - Clean up after merging
git push origin --delete feature-branch-name    # Delete remote branch
git branch -d feature-branch-name               # Delete local branch

# ✅ GOOD - Regular cleanup
git branch --merged main    # See what's safe to delete
git push origin --delete $(git branch -r --merged main | grep -v main | sed 's/origin\///')
```

**Fix:** After merging a branch to `main`, immediately delete it. Run regular cleanup (we did this Nov 14: 53 → 18 branches).

---

## Common Workflows

### Adding New Game Content

1. Add data to `apps/vale-v2/src/data/definitions/*.ts`
2. Ensure it validates against corresponding Zod schema in `data/schemas/`
3. Run `pnpm validate:data` to verify
4. Write context-aware tests in `tests/gameplay/`
5. Run `pnpm precommit` before committing

### Modifying Core Logic

1. Update algorithm in `core/algorithms/`
2. Update tests immediately (never modify without tests)
3. Run `pnpm test` to verify no regressions
4. Check gameplay tests still pass: `vitest run tests/gameplay/`
5. Run `pnpm precommit`

### Working with Battle System

The battle system uses a **queue-based turn order**:

- Implemented in `core/services/QueueBattleService.ts`
- Mana system for abilities (costs mana, regenerates each turn)
- Djinn can be used for powerful effects but enter standby mode
- All battle logic is deterministic (uses seeded PRNG)

## Troubleshooting

### pnpm workspace warning

**Symptom:** `WARN The "workspaces" field in package.json is not supported by pnpm`

**Solution:** This is a non-blocking warning and can be safely ignored. The project uses `pnpm-workspace.yaml` correctly.

### Tests failing after git pull

**Symptom:** Tests that previously passed now fail after pulling latest changes

**Solution:**
1. Check [CHANGELOG.md](CHANGELOG.md) for breaking changes (e.g., `applyHealing()` signature change)
2. Run `pnpm install` - dependencies may have changed
3. Check [COMPREHENSIVE_AUDIT_2025.md](COMPREHENSIVE_AUDIT_2025.md) for known failing tests (currently 10 known failures)
4. Ensure you're not using deprecated APIs

### Battle results not deterministic

**Symptom:** Same seed produces different battle results across runs

**Solution:**
1. Verify using `PRNG` from `core/random/prng.ts`, not `Math.random()`
2. Check seed is non-negative (negative seeds now throw Error as of Nov 11, 2025)
3. Zero seeds are automatically converted to 1
4. Ensure no async operations in battle logic (breaks determinism)
5. Verify PRNG is passed through all function parameters, not created mid-battle

### Data validation errors when adding content

**Symptom:** `pnpm validate:data` fails with schema validation errors

**Solution:**
1. Check corresponding Zod schema in `data/schemas/` for required fields
2. Verify ID formatting follows kebab-case convention (see [NAMING_CONVENTIONS.md](apps/vale-v2/docs/NAMING_CONVENTIONS.md))
3. Check schema documentation comments for field examples
4. Common issues:
   - Missing required fields (`id`, `name`, `type`)
   - Incorrect ID format (use `kebab-case-ids`, not `camelCase` or `PascalCase`)
   - Invalid enum values (check schema for allowed values)
   - Missing nested required fields (e.g., `statBonus` structure)

### Type errors about undefined array/object access

**Symptom:** TypeScript errors like "Object is possibly 'undefined'"

**Solution:** This codebase uses `noUncheckedIndexedAccess: true`, which means array/object access returns `T | undefined`. This is intentional for safety.

```typescript
// ❌ Unsafe
const item = array[0];

// ✅ Safe - check first
const item = array[0];
if (item) {
  // use item
}

// ✅ Or use optional chaining
const item = array[0]?.property;
```

### Healing not working on KO'd units

**Symptom:** Healing abilities don't revive fallen units

**Solution:** As of Nov 11, 2025, `applyHealing()` requires `abilityRevivesFallen` parameter. Only abilities with revival flags can heal KO'd units. This is intentional to prevent unintended revival. Check your ability definition has the revival flag if intended.

## Migration Status

GameProvider → Zustand migration is **complete**. All state now lives in Zustand slices (see State Management section). Core systems (battle, progression, equipment, djinn) are functional.

## Project Status

### Core Systems: ✅ Complete

- **Battle System** - Queue-based planning/execution with mana and elemental advantages
- **Progression System** - XP, leveling (20 levels), ability unlocks
- **Equipment System** - 5 slots (Weapon/Armor/Helm/Boots/Accessory) with stat bonuses, unit-locked
- **Djinn System Architecture** - Activation, synergy, summons (system complete, see content status below)
- **Save/Load System** - Versioned schemas with migration support
- **State Management** - 11 Zustand slices managing all game state

### Content Volume (Updated: 2025-11-12)

| Type | Current | Target (Ch 1) | Status |
|------|---------|---------------|---------|
| Recruitable Units | 6 | 10 | 🟡 60% |
| Abilities | 18 | 40 | 🟡 45% |
| Equipment | 58 | 80 | 🟢 73% |
| Enemies | 9 | 25 | 🟡 36% |
| Encounters | 5 | 30 | 🔴 17% |
| Maps | 2 | 10 | 🔴 20% |
| **Djinn Data** | **0** | **12** | **🔴 0%** |
| Dialogue Trees | 2 | 40 | 🔴 5% |

**Note:** Djinn **system architecture** is complete (activation, synergy, summons work), but **0/12 Djinn data** exists. Priority content gap.

### Testing Status: 🟡 Needs Attention

- **37 test files** covering core algorithms and services
- **Core algorithms well-covered** (damage, stats, XP, turn order)
- **Known issues:**
  - 10 failing tests (progression, golden tests, save roundtrip)
  - Test status needs verification after QueueBattleService refactoring
  - Zero UI component tests (25 components untested)
- **See [COMPREHENSIVE_AUDIT_2025.md](COMPREHENSIVE_AUDIT_2025.md) for detailed test status**

### Known Gaps & Issues

**Critical:**
- 🔴 Djinn content missing (0/12) - system works but nothing to collect
- 🔴 10 failing tests need fixing

**High Priority:**
- 🟡 Missing UI screens: character screen, party management, Djinn collection, main menu
- 🟡 Encounter/map content thin (5/30 encounters, 2/10 maps)
- 🟡 Dialogue system needs content (2/40 trees)

**See [SYSTEMS_AUDIT_AND_IMPLEMENTATION_PROMPTS.md](SYSTEMS_AUDIT_AND_IMPLEMENTATION_PROMPTS.md) for fix prompts and implementation guides.**

### Roadmap

- **6-week demo target** - See [COMPREHENSIVE_AUDIT_2025.md](COMPREHENSIVE_AUDIT_2025.md) Part III
- **6-month full game plan** - See [COMPREHENSIVE_AUDIT_2025.md](COMPREHENSIVE_AUDIT_2025.md) Part IV

---

**For comprehensive development guidance, architecture patterns, and detailed examples, see `apps/vale-v2/CLAUDE.md`**
