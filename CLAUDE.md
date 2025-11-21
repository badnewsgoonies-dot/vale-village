# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vale Chronicles V2** - A Golden Sun-inspired tactical RPG built with clean architecture principles. The codebase is organized as a light pnpm workspace, with the main application in `apps/vale-v2/`.

> **Workspace layout (important for commands)**
>
> - **Primary app package:** `apps/vale-v2` (has its own `package.json`, scripts, and lockfile)
> - **Workspace root:** this directory; provides convenience scripts that forward to `apps/vale-v2` via `pnpm --filter vale-v2 ...`
> - **Workspace config:** `pnpm-workspace.yaml` declares `apps/*` as workspaces so pnpm understands the layout (and stops warning about `workspaces` in `package.json`).
>
> You can run dev/test commands **either** from the root (using the forwarded scripts) **or** from `apps/vale-v2` directly:
>
> - From **root** (recommended for consistency with existing docs): `pnpm dev`, `pnpm test`, `pnpm validate:data`, etc.
> - From **apps/vale-v2/** (inside the app): `pnpm dev`, `pnpm test`, etc.
>
> Both entry points are supported; the root scripts are thin wrappers and are **not** deprecated.

**For detailed development guidance**, see [apps/vale-v2/CLAUDE.md](apps/vale-v2/CLAUDE.md) - it contains comprehensive architecture details, testing philosophy, and development workflows.

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

**Essential Documentation:**
- [apps/vale-v2/CLAUDE.md](apps/vale-v2/CLAUDE.md) - Development patterns & conventions (READ THIS)
- [CHANGELOG.md](CHANGELOG.md) - Breaking changes (check after git pull!)
- [COMPREHENSIVE_AUDIT_2025.md](COMPREHENSIVE_AUDIT_2025.md) - Roadmap & current state

---

## ⚠️ Breaking Changes (Last Updated: 2025-11-14)

### November 11, 2025

**Healing API Changed** - `applyHealing()` now requires 3rd parameter `abilityRevivesFallen`
```typescript
// ❌ Old
applyHealing(unit, amount)

// ✅ New
applyHealing(unit, amount, abilityRevivesFallen: boolean)
```
Prevents healing KO'd units without revival flag. See [CHANGELOG.md](CHANGELOG.md) for migration guide.

**PRNG Validation Enforced** - Negative seeds now rejected (throws Error), zero seeds converted to 1. Update any test code using negative seeds.

**Team Djinn Validation** - `addDjinn()` now validates uniqueness and 3-Djinn slot limits.

---

## Core Architecture Principles

### 1. Layered Architecture

```
core/         # Pure TypeScript, NO React, fully deterministic
├── models/      # POJOs with factory functions (no classes)
├── algorithms/  # Pure functions (damage, turn order, stats, xp)
├── services/    # Orchestration layer
└── random/      # Seeded PRNG for determinism

ui/           # React components and UI logic
├── components/  # React components
├── state/       # Zustand store + slices
└── sprites/     # Sprite management

data/         # Game content with Zod schemas
├── definitions/ # JSON data (abilities, units, enemies, equipment)
└── schemas/     # Zod validation schemas (single source of truth)
```

**Dependency Flow:** `UI → State (Zustand) → Services → Algorithms → Models`

### 2. Critical Guardrails (ESLint Enforced)

- **No React in `core/**`** - Core logic must be React-free for testability
- **No `any` types in `core/**`** - Error-level enforcement (`@typescript-eslint/no-explicit-any`)
- **Import restrictions** (ESLint enforced):
  - ❌ UI cannot import core directly (use services/hooks)
  - ❌ Algorithms cannot import services (services use algorithms, not vice versa)
  - ✅ State slices can import from `core/services/`
- **No `console.log`** - Only `console.warn` and `console.error` allowed
- **Seeded RNG only** - Use `PRNG` interface, never `Math.random()` in core
- **Immutable updates** - Models are POJOs with factory functions, no classes
- **Zod schemas are source of truth** - All data validated at startup

### 3. State Management (Zustand)

11 feature-based slices:

**Battle:** `battleSlice`, `queueBattleSlice`, `rewardsSlice`
**World:** `overworldSlice`, `dialogueSlice`, `gameFlowSlice`, `storySlice`
**Player:** `teamSlice`, `inventorySlice`, `saveSlice`
**Store:** `store.ts` combines all slices

**Pattern:** State slices contain only state and setters. Business logic lives in `core/services/`.

#### Service Decision Tree

```
Need to execute a battle action?
├─ Classic turn-by-turn → BattleService.performAction()
└─ Queue-based (planning) → QueueBattleService.queueAction() + executeRound()

Need AI to decide an action? → AIService.selectAction()
Need to handle encounters? → EncounterService
Need to save/load? → SaveService
Need rewards after battle? → RewardsService
Need deterministic RNG? → PRNG (from core/random/prng.ts)
```

### 4. Deterministic Game Logic

All randomness uses **seeded PRNG** for reproducible battles, save/load consistency, and bug reproduction.

```typescript
// Pass PRNG through function parameters (always last)
function calculateDamage(attacker: Unit, defender: Unit, rng: PRNG): number {
  const roll = rng.next(); // [0, 1)
  // deterministic calculation
}
```

---

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

---

## Common Pitfalls & How to Avoid Them

### 1. Forgetting PRNG in Function Signatures

```typescript
// ❌ BAD - Uses Math.random()
function calculateDamage(attacker: Unit, defender: Unit): number {
  const roll = Math.random(); // BREAKS determinism!
}

// ✅ GOOD - PRNG as last parameter
function calculateDamage(attacker: Unit, defender: Unit, rng: PRNG): number {
  const roll = rng.next(); // Deterministic!
}
```

**Fix:** Always pass `PRNG` as the last parameter in any function that needs randomness.

### 2. Violating Clean Architecture Boundaries

```typescript
// ❌ BAD - UI importing core/algorithms directly
import { calculateDamage } from '@/core/algorithms/damage';

// ✅ GOOD - UI uses services or hooks
import { useBattle } from '@/ui/hooks/useBattle';
import { performAction } from '@/core/services/BattleService';
```

**Fix:** Follow the dependency flow: `UI → State → Services → Algorithms → Models`. ESLint will catch most violations.

### 3. Not Validating Data After Changes

```bash
# ❌ BAD - Modify data and commit
git add src/data/definitions/units.ts
git commit -m "Added new unit"

# ✅ GOOD - Validate before committing
pnpm validate:data    # Catches schema violations!
pnpm precommit         # Runs all checks
```

**Fix:** Always run `pnpm validate:data` after modifying any file in `src/data/definitions/`.

### 4. Using `any` Types in Core

```typescript
// ❌ BAD - ESLint will error!
function processUnit(unit: any): void { }

// ✅ GOOD - Explicit types
function processUnit(unit: Unit): void { }

// ✅ GOOD - Generic constraints
function processEntity<T extends { id: string }>(entity: T): void { }
```

**Fix:** Use proper types. If you need flexibility, use generics with constraints.

### 5. Mutating Models Instead of Creating New Ones

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

### 6. Not Checking Array/Object Access

TypeScript's `noUncheckedIndexedAccess: true` means array access returns `T | undefined`.

```typescript
// ❌ BAD - TypeScript error!
const firstUnit = team.units[0];
console.log(firstUnit.name); // Error: possibly 'undefined'

// ✅ GOOD - Check before use
const firstUnit = team.units[0];
if (firstUnit) {
  console.log(firstUnit.name);
}

// ✅ GOOD - Optional chaining
console.log(team.units[0]?.name);
```

### 7. Forgetting to Update Tests

```bash
# ❌ BAD - Modify algorithm, skip tests
# (Tests will fail, you'll waste time debugging later)

# ✅ GOOD - Update tests immediately
# 1. Modify algorithm
# 2. Run existing tests: pnpm test
# 3. Update/add tests for new behavior
# 4. Verify: pnpm test
```

**Fix:** Never modify an algorithm without immediately updating its tests.

### 8. Using AI-Generated Branches Without Cleanup

```bash
# ❌ BAD - Let branches accumulate (50+ stale branches)

# ✅ GOOD - Clean up after merging
git push origin --delete feature-branch-name    # Delete remote
git branch -d feature-branch-name               # Delete local

# ✅ GOOD - Regular cleanup
git branch --merged main    # See what's safe to delete
```

**Fix:** After merging to `main`, immediately delete the branch. We cleaned up Nov 14: 53 → 18 branches.

---

## Prerequisites

- **Node.js 18+** - Verify with `node -v`
- **pnpm 8.15.0+** - Install with `npm install -g pnpm`

### First-Time Setup

```bash
pnpm install          # Install dependencies
pnpm test             # Verify test suite runs
pnpm validate:data    # Verify data validation
pnpm typecheck        # Verify type checking
```

**Note:** You may see a pnpm workspace warning - this is non-blocking and can be ignored.

---

**For comprehensive development guidance, architecture patterns, and detailed examples, see [apps/vale-v2/CLAUDE.md](apps/vale-v2/CLAUDE.md)**
