# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vale Chronicles V2** - A Golden Sun-inspired tactical RPG built with clean architecture principles. This is a monorepo containing a greenfield rebuild of the game using React, TypeScript, Zustand, and Zod.

**Working Directory:** This is a pnpm workspace monorepo. The main application is located in `apps/vale-v2/`.

**For detailed development guidance**, see `apps/vale-v2/CLAUDE.md` - it contains comprehensive architecture details, testing philosophy, and development workflows.

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

Uses **Zustand** with feature-based slices:
- `battleSlice` - Battle state and turn progression
- `teamSlice` - Player team management
- `saveSlice` - Save/load operations
- `storySlice` - Story progression

**Pattern:** State slices contain only state and setters. Business logic lives in `core/services/`.

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

- **10 recruitable units** with 5 levels of progression
- **12 Djinn** (3 per element: Venus/Mars/Mercury/Jupiter) with team-wide buffs
- **4-slot equipment system** (Weapon/Armor/Helm/Boots)
- **Turn-based battles** with queue system, elemental advantages, mana management
- **XP curve:** [0, 100, 350, 850, 1850] for levels 1-5

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

## Key Documentation

- **`apps/vale-v2/CLAUDE.md`** - Detailed development guide (READ THIS FIRST)
- **`VALE_CHRONICLES_ARCHITECTURE.md`** - Complete system architecture
- **`ARCHITECTURE_REBUILD_SUMMARY.md`** - Recent refactoring summary
- **`docs/adr/`** - Architecture Decision Records
  - `001-layering-and-boundaries.md` - Layer rules
  - `002-state-management.md` - Zustand patterns
  - `004-rng-and-determinism.md` - PRNG usage

## TypeScript Configuration

- Strict mode enabled
- `noUncheckedIndexedAccess: true` - Array/object access returns `T | undefined`
- `noImplicitReturns: true` - All code paths must return
- Path alias: `@/*` maps to `./src/*` (in vale-v2)

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

## Migration Status

GameProvider → Zustand migration is **complete**. All state now lives in Zustand slices (`battleSlice`, `teamSlice`, `saveSlice`, `storySlice`, `queueBattleSlice`, `rewardsSlice`). Core systems (battle, progression, equipment, djinn) are functional.

## Project Status

- **Core Systems:** Battle, progression, equipment, djinn are complete
- **Testing:** Context-aware test suite passing
- **Recent Work:** Queue-based battle system with mana and Djinn integration

---

**For comprehensive development guidance, architecture patterns, and detailed examples, see `apps/vale-v2/CLAUDE.md`**
