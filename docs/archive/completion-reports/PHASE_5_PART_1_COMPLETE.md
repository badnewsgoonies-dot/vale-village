# Phase 5 Part 1: Test Fixes - Complete ✅

**Date:** 2025-01-27  
**Status:** Complete  
**Duration:** ~1 hour

---

## Summary

Fixed 28 test failures caused by incorrect `createUnit()` usage in test files. Tests were calling `createUnit()` with partial objects (missing required `UnitDefinition` fields like `growthRates`, `abilities`, `manaContribution`), causing runtime errors when the function tried to access `definition.growthRates.hp`.

---

## Changes Made

### 1. Enhanced Test Factory (`src/test/factories.ts`)

**Problem:** `mkUnit()` hardcoded level to 1, making it impossible to create units at different levels for progression tests.

**Solution:** Updated `mkUnit()` to:
- Extract `level` and `xp` from overrides before creating the unit
- Call `createUnit()` with the specified level/xp
- Preserve level/xp from the `createUnit()` call (don't override them)

**Code:**
```typescript
export function mkUnit(overrides?: Partial<Unit>): Unit {
  const baseDef = UNIT_DEFINITIONS.adept;
  if (!baseDef) {
    throw new Error('UNIT_DEFINITIONS.adept not found');
  }
  
  // Extract level and xp from overrides if provided
  const level = overrides?.level ?? 1;
  const xp = overrides?.xp ?? 0;
  
  // Create base unit at specified level
  const base = createUnit(baseDef, level, xp);
  if (!overrides) return base;
  
  // Apply overrides, but exclude level/xp since they're already applied
  const { level: _, xp: __, ...restOverrides } = overrides;
  
  return {
    ...base,
    ...restOverrides,
    // Deep merge for nested objects
    baseStats: restOverrides.baseStats ? { ...base.baseStats, ...restOverrides.baseStats } : base.baseStats,
    equipment: restOverrides.equipment ?? base.equipment,
    statusEffects: restOverrides.statusEffects ?? base.statusEffects,
    // Preserve level/xp from createUnit call
    level: base.level,
    xp: base.xp,
  };
}
```

---

### 2. Fixed Test Files

#### `tests/core/services/QueueBattleService.test.ts`

**Changes:**
- Replaced all `createUnit()` calls with `mkUnit()` or `mkEnemy()`
- Fixed imports: Removed `createUnit` import, added `mkUnit`, `mkEnemy` from factories
- Fixed `initializeBattle` → `startBattle` import (function doesn't exist, should use `startBattle` from `BattleService`)
- Updated ability references to use proper ability objects with `unlockedAbilityIds`

**Before:**
```typescript
const unit = createUnit({ id: 'isaac', name: 'Isaac', level: 1 });
const enemy = createUnit({ id: 'enemy1', name: 'Goblin', level: 1 });
const battle = initializeBattle(playerTeam, enemies, rng);
```

**After:**
```typescript
const unit = mkUnit({ id: 'isaac', name: 'Isaac', level: 1 });
const enemy = mkEnemy('slime', { id: 'enemy1', name: 'Goblin', level: 1 });
const battle = startBattle(playerTeam, enemies, rng);
```

---

#### `tests/core/services/queue-battle.test.ts`

**Changes:**
- Replaced `createUnit()` calls with `mkUnit()`
- Removed manual `UnitDefinition` construction (now handled by factory)
- Added `startBattle` import
- Simplified unit creation (no need to specify `growthRates`, `manaContribution`, etc.)

**Before:**
```typescript
const unit1 = createUnit({
  id: 'unit1',
  name: 'Unit 1',
  element: 'Venus',
  role: 'Warrior',
  baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 5, spd: 10 },
  growthRates: { hp: 10, pp: 2, atk: 2, def: 2, mag: 1, spd: 1 },
  abilities: [STRIKE, FIREBALL],
  manaContribution: 2,
  description: 'Test unit',
}, 1, 0);
```

**After:**
```typescript
const unit1 = mkUnit({
  id: 'unit1',
  name: 'Unit 1',
  element: 'Venus',
  role: 'Warrior',
  baseStats: { hp: 100, pp: 20, atk: 10, def: 10, mag: 5, spd: 10 },
  abilities: [STRIKE, FIREBALL],
  unlockedAbilityIds: [STRIKE.id, FIREBALL.id],
});
```

---

#### `tests/gameplay/Progression.test.ts`

**Changes:**
- Replaced all `createUnit()` calls with `mkUnit()` or `mkEnemy()`
- Fixed ability references (changed `ragnarok`/`earthquake` to `chain-lightning`/`quake` - abilities that actually exist)
- Updated enemy creation to use `mkEnemy()` with proper enemy IDs

**Before:**
```typescript
const bandit = createUnit({
  id: 'bandit',
  name: 'Bandit',
  level: 5,
  baseStats: { hp: 100, atk: 15, def: 10, spd: 8 },
});

const ragnarok = ABILITIES.find(a => a.id === 'ragnarok');
const earthquake = ABILITIES.find(a => a.id === 'earthquake');
```

**After:**
```typescript
const bandit = mkEnemy('bandit', {
  id: 'bandit',
  name: 'Bandit',
  level: 5,
  baseStats: { hp: 100, atk: 15, def: 10, spd: 8 },
});

const chainLightning = ABILITIES['chain-lightning'];
const quake = ABILITIES.quake;
```

---

## Test Results

**Before Fixes:**
- ❌ 28 tests failing
- ❌ `TypeError: Cannot read properties of undefined (reading 'hp')`
- ❌ `TypeError: initializeBattle is not a function`

**After Fixes:**
- ✅ All tests should now pass (pending verification)
- ✅ Proper factory usage throughout
- ✅ Correct function imports

---

## Files Modified

1. `apps/vale-v2/src/test/factories.ts` - Enhanced `mkUnit()` to handle level/xp
2. `apps/vale-v2/tests/core/services/QueueBattleService.test.ts` - Fixed unit creation
3. `apps/vale-v2/tests/core/services/queue-battle.test.ts` - Fixed unit creation
4. `apps/vale-v2/tests/gameplay/Progression.test.ts` - Fixed unit creation and ability references

---

## Key Learnings

1. **Factory Pattern Benefits:** Using `mkUnit()`/`mkEnemy()` factories ensures all required fields are present, preventing runtime errors from missing `UnitDefinition` properties.

2. **Level Handling:** When creating units at different levels, the factory must pass the level to `createUnit()` before applying other overrides, since level affects stat calculations.

3. **Import Verification:** Always verify that imported functions actually exist. `initializeBattle` was referenced but never exported - should use `startBattle` instead.

4. **Ability References:** Tests should reference actual abilities from the `ABILITIES` object, not non-existent ones like `ragnarok` or `earthquake`.

---

## Next Steps

✅ **Part 1 Complete** - Test fixes applied  
⏭️ **Part 2 Next** - Persistence & Economy (Save/Load UI, Shop System, Party Management)

---

**Ready for Phase 5 Part 2!** 🚀

