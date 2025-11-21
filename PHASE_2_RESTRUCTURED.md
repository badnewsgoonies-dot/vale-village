# Phase 2: Algorithms & Services - RESTRUCTURED ✅

## Summary

Phase 2 has been restructured to match the planned architecture. All algorithms are now properly separated, and services follow the planned structure.

## New Structure

### Algorithms (`apps/vale-v2/src/core/algorithms/`)
- ✅ **damage.ts** - Physical/psynergy damage, healing, critical hits, dodge, element modifiers
- ✅ **turn-order.ts** - SPD-based turn order calculation with tiebreaker randomization
- ✅ **status.ts** - Status effect processing (poison, burn, freeze, paralyze)
- ✅ **djinn.ts** - Djinn synergy calculation
- ✅ **targeting.ts** - Target resolution for abilities (single/all, enemy/ally)
- ✅ **xp.ts** - XP curve, level calculation, level-up detection
- ✅ **index.ts** - Centralized exports

### Services (`apps/vale-v2/src/core/services/`)
- ✅ **BattleService.ts** - High-level battle coordination:
  - `startBattle()` - Initialize battle with turn order
  - `performAction()` - Execute ability and return updated state
  - `endTurn()` - Advance turn and process status effects
  - `checkBattleEnd()` - Check victory/defeat conditions
- ✅ **RngService.ts** - PRNG wrapper:
  - `createRng()` - Create from seed
  - `createRandomRng()` - Create from time
  - `cloneRng()` - Branch RNG for simulation
  - `getRngSeed()` - Get seed for serialization
- ✅ **SaveService.ts** - Save/load with migration:
  - `saveGame()` - Save to localStorage with validation
  - `loadGame()` - Load and migrate save data
  - `hasSave()` - Check if save exists
  - `deleteSave()` - Delete save file
- ✅ **index.ts** - Service exports

## Changes from Previous Structure

### Removed Files
- ❌ `algorithms/element.ts` - Merged into `damage.ts`
- ❌ `algorithms/battle.ts` - Split into `turn-order.ts` and `status.ts`
- ❌ `services/battle.ts` - Renamed to `BattleService.ts`

### New Files
- ✅ `algorithms/turn-order.ts` - Extracted from battle.ts
- ✅ `algorithms/status.ts` - Extracted from services/battle.ts
- ✅ `algorithms/targeting.ts` - New target resolution logic
- ✅ `services/BattleService.ts` - Restructured battle service
- ✅ `services/RngService.ts` - New RNG wrapper service
- ✅ `services/SaveService.ts` - New save/load service

## Key Improvements

1. **Better Separation of Concerns**
   - Turn order logic separated from battle state management
   - Status effects separated from ability execution
   - Targeting logic extracted for reusability

2. **Service Layer Structure**
   - BattleService coordinates algorithms
   - RngService provides deterministic randomness
   - SaveService handles persistence with migration

3. **Algorithm Organization**
   - Each algorithm file has a single responsibility
   - Element logic embedded in damage (where it's used)
   - Targeting logic reusable across battle system

## Test Results

✅ **All 41 tests passing** (9 test files)
✅ **TypeScript compiles** with no errors
✅ **Coverage maintained** at 53% overall

## File Structure

```
apps/vale-v2/src/core/
├── algorithms/
│   ├── damage.ts          # ✅ Damage, healing, crits, dodge, elements
│   ├── turn-order.ts      # ✅ SPD-based ordering
│   ├── status.ts           # ✅ Status effect processing
│   ├── djinn.ts            # ✅ Djinn synergy
│   ├── targeting.ts        # ✅ Target resolution
│   ├── xp.ts               # ✅ XP and leveling
│   └── index.ts
├── services/
│   ├── BattleService.ts    # ✅ Battle coordination
│   ├── RngService.ts       # ✅ PRNG wrapper
│   ├── SaveService.ts      # ✅ Save/load
│   └── index.ts
└── ...
```

## Example Usage

```typescript
import { createRng } from './core/services/RngService';
import { startBattle, performAction, endTurn } from './core/services/BattleService';
import { resolveTargets } from './core/algorithms/targeting';

// Create deterministic RNG
const rng = createRng(12345);

// Start battle
const battleState = startBattle(playerTeam, enemies, rng);

// Perform action
const { state, result, events } = performAction(
  battleState,
  actorId,
  abilityId,
  targetIds,
  rng
);

// End turn
const nextState = endTurn(state, rng);
```

## Status: ✅ Phase 2 Restructured

All algorithms and services are now organized according to the planned architecture. Ready for Phase 3: State Management & UI Integration!

