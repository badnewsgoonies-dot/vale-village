# Error Handling & Edge Case Audit

**Date:** 2025-01-27  
**Scope:** Error boundaries, Result types, null/undefined handling, battle/equipment/progression edge cases  
**Status:** 🔴 **CRITICAL GAPS FOUND**

---

## Executive Summary

**Total Issues Found:** 12  
**Error Boundary Issues:** 1  
**Result Type Violations:** 2  
**Null/Undefined Handling:** 2  
**Battle Edge Cases:** 4  
**Equipment Edge Cases:** 2  
**Progression Edge Cases:** 1

**Overall Error Handling Score:** 45/100

---

## 🔴 ERROR BOUNDARIES

### 1. No React Error Boundary
**File:** `apps/vale-v2/src/main.tsx:19-22`  
**Severity:** 🔴 **CRITICAL**

**Issue:**
```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

**Problem:**
- No error boundary wraps `<App />`
- Any runtime error from `QueueBattleView` or descendants tears down entire tree
- Players see blank screen instead of helpful error message
- No recovery mechanism

**Test Case:**
```typescript
// apps/vale-v2/tests/ui/App.errorBoundary.test.tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from '@/App';

vi.mock('@/ui/components/QueueBattleView', () => ({
  QueueBattleView: () => {
    throw new Error('boom');
  },
}));

it('shows a fallback UI instead of crashing when the battle view throws', () => {
  expect(() => render(<App />)).not.toThrow();
  expect(
    screen.getByText(/hang tight, the arena needs a reset/i)
  ).toBeInTheDocument();
});
```

**Fix:**
- Create `GameErrorBoundary` component
- Wrap `<App />` in error boundary
- Show user-friendly fallback UI

**Effort:** S (2-4 hours)

---

## 🟠 RESULT TYPES

### 2. queueAction Throws Instead of Returning Result
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts:41-75`  
**Severity:** 🟠 **HIGH**

**Issue:**
- DoD requires services to return `Result<T, E>`
- `queueAction` throws errors instead
- Uncaught errors bubble into UI
- Forces ad-hoc try/catch alert flows

**Test Case:**
```typescript
// apps/vale-v2/tests/battle/QueueBattleService.result.test.ts
import { queueAction } from '@/core/services/QueueBattleService';
import { mkBattle } from '@/test/factories';
import { FIREBALL } from '@/data/definitions/abilities';

it('returns Err when the queued ability exceeds the remaining mana budget', () => {
  const battle = mkBattle({});
  const starving = { ...battle, remainingMana: 0 };
  const outcome = queueAction(
    starving,
    starving.playerTeam.units[0].id,
    FIREBALL.id,
    [starving.enemies[0].id],
    FIREBALL
  );
  expect(outcome).toMatchObject({ 
    ok: false, 
    error: expect.stringMatching(/cannot afford/i) 
  });
});
```

**Fix:**
- Convert `queueAction` to return `Result<BattleState, string>`
- Update all call sites to handle Result type

**Effort:** M (1 day)

---

### 3. generateEnemyActions Doesn't Handle AI Failures
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts:461-473`  
**Severity:** 🟠 **HIGH**

**Issue:**
- `generateEnemyActions` blindly calls `makeAIDecision`
- `makeAIDecision` throws when enemy has no usable abilities
- Single malformed enemy definition crashes entire round

**Test Case:**
```typescript
// apps/vale-v2/tests/battle/EnemyDecision.resilience.test.ts
import { executeRound } from '@/core/services/QueueBattleService';
import { mkBattle, mkEnemy } from '@/test/factories';
import { makePRNG } from '@/core/random/prng';

it('keeps executing when an enemy definition exposes no usable abilities', () => {
  const battle = mkBattle({
    enemies: [mkEnemy('slime', { abilities: [] })],
  });
  expect(() => executeRound(battle, makePRNG(123))).not.toThrow();
});
```

**Fix:**
- Wrap `makeAIDecision` in try/catch
- Return fallback action (basic attack) on failure
- Log warning for debugging

**Effort:** S (2-4 hours)

---

## 🟠 NULL/UNDEFINED HANDLING

### 4. ActionQueuePanel Treats Record as Array
**File:** `apps/vale-v2/src/ui/components/ActionQueuePanel.tsx:51-88`  
**Severity:** 🟠 **HIGH**

**Issue:**
```typescript
const ability = action?.abilityId
  ? ABILITIES.find(a => a.id === action.abilityId)  // ⚠️ ABILITIES is Record, not array!
  : null;
```

**Problem:**
- `ABILITIES` is `Record<string, Ability>` (dictionary)
- Component calls `.find()` as if it were an array
- Throws `TypeError: ABILITIES.find is not a function` when non-basic action queued

**Test Case:**
```typescript
// apps/vale-v2/tests/ui/ActionQueuePanel.test.tsx
import { render, screen } from '@testing-library/react';
import { mkBattle } from '@/test/factories';
import { FIREBALL } from '@/data/definitions/abilities';
import { ActionQueuePanel } from '@/ui/components/ActionQueuePanel';

it('shows the ability name when an action is queued', () => {
  const battle = mkBattle({});
  const queued = {
    ...battle,
    queuedActions: [
      {
        unitId: battle.playerTeam.units[0].id,
        abilityId: FIREBALL.id,
        targetIds: [battle.enemies[0].id],
        manaCost: FIREBALL.manaCost ?? 0,
      },
      null,
      null,
      null,
    ],
  };
  render(<ActionQueuePanel battle={queued} onClearAction={() => {}} />);
  expect(screen.getByText(/Fireball/i)).toBeInTheDocument();
});
```

**Fix:**
- Use `ABILITIES[action.abilityId]` instead of `.find()`
- Handle missing ability gracefully

**Effort:** S (1-2 hours)

---

### 5. QueueBattleView Calls getAbilityManaCost Before Validation
**File:** `apps/vale-v2/src/ui/components/QueueBattleView.tsx:123-129`  
**Severity:** 🟡 **MEDIUM**

**Issue:**
- Calls `getAbilityManaCost(selectedAbility, ability)` before confirming ability exists
- If ability list changes between render and click, non-null assertion throws
- Error occurs outside try/catch block

**Test Case:**
```typescript
// apps/vale-v2/tests/battle/QueueBattleService.missingAbility.test.ts
import { queueAction } from '@/core/services/QueueBattleService';
import { mkBattle } from '@/test/factories';

it('fails gracefully when an ability id has no metadata', () => {
  const battle = mkBattle({});
  const result = queueAction(
    battle,
    battle.playerTeam.units[0].id,
    'removed-ability',
    [battle.enemies[0].id],
    undefined as any
  );
  expect(result).toMatchObject({ 
    ok: false, 
    error: expect.stringMatching(/removed-ability/i) 
  });
});
```

**Fix:**
- Validate ability exists before calling `getAbilityManaCost`
- Return early if ability missing

**Effort:** S (1 hour)

---

## 🟠 BATTLE EDGE CASES

### 6. Simultaneous Wipe-Out Counts as Player Victory
**File:** `apps/vale-v2/src/core/services/BattleService.ts:486-491`  
**Severity:** 🟠 **HIGH**

**Issue:**
```typescript
export function checkBattleEnd(state: BattleState): BattleResult | null {
  const allEnemyKO = state.enemies.every(e => isUnitKO(e));
  if (allEnemyKO) return 'PLAYER_VICTORY';  // ⚠️ Checks enemies first
  
  const allPlayerKO = state.playerTeam.units.every(u => isUnitKO(u));
  if (allPlayerKO) return 'PLAYER_DEFEAT';
  
  return null;
}
```

**Problem:**
- Checks enemy KO before player KO
- If both teams die simultaneously, returns `PLAYER_VICTORY`
- Contradicts "all units die simultaneously" requirement

**Test Case:**
```typescript
// apps/vale-v2/tests/battle/BattleService.tie.test.ts
import { checkBattleEnd } from '@/core/services/BattleService';
import { mkBattle } from '@/test/factories';

it('does not grant victory when both teams are KO at the same time', () => {
  const battle = mkBattle({});
  const zeroedPlayers = battle.playerTeam.units.map(u => ({ ...u, currentHp: 0 }));
  const zeroedEnemies = battle.enemies.map(e => ({ ...e, currentHp: 0 }));
  const outcome = checkBattleEnd({
    ...battle,
    playerTeam: { ...battle.playerTeam, units: zeroedPlayers },
    enemies: zeroedEnemies,
  });
  expect(outcome).toBeNull();
});
```

**Fix:**
- Check both teams simultaneously
- Return `null` (tie) if both KO'd
- Or return `PLAYER_DEFEAT` (player loses ties)

**Effort:** S (1 hour)

---

### 7. Mana Validation Logic Error
**File:** `apps/vale-v2/src/core/algorithms/mana.ts:78-84`  
**Severity:** 🟡 **MEDIUM**

**Issue:**
- `validateQueuedActions` compares total queued mana against remaining mana
- Any plan spending more than half the bar is rejected
- Logic may be incorrect (should check if total <= remaining)

**Test Case:**
```typescript
// apps/vale-v2/tests/battle/ManaBudget.test.ts
import { validateQueuedActions } from '@/core/algorithms/mana';

it('treats a fully funded queue as valid even when remaining mana is low', () => {
  const queued = [
    { unitId: 'u1', abilityId: 'a1', targetIds: ['t1'], manaCost: 3 },
    { unitId: 'u2', abilityId: 'a2', targetIds: ['t2'], manaCost: 3 },
    null,
    null,
  ] as const;
  expect(validateQueuedActions(4, queued as any)).toBe(true);
});
```

**Fix:**
- Review validation logic
- Ensure it correctly checks `sum(manaCost) <= remainingMana`

**Effort:** S (1 hour)

---

### 8. Retargeting Changes Single-Target to Multi-Target
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts:424-445`  
**Severity:** 🟠 **HIGH**

**Issue:**
- When original target dies, `resolveValidTargets` retargets to all alive enemies
- `resolveTargets` defines 'single-enemy' as "all living enemies"
- Single-target spell can suddenly hit entire squad

**Test Case:**
```typescript
// apps/vale-v2/tests/battle/Retargeting.test.ts
import { executeRound } from '@/core/services/QueueBattleService';
import { mkBattle, mkEnemy } from '@/test/factories';
import { FIREBALL } from '@/data/definitions/abilities';
import { makePRNG } from '@/core/random/prng';

it('retargets single-target abilities to one new enemy when the original target is KO', () => {
  const battle = mkBattle({
    enemies: [
      mkEnemy('slime', { id: 'slime-a', currentHp: 0 }),
      mkEnemy('slime', { id: 'slime-b', currentHp: 50 }),
    ],
  });
  const prepared = {
    ...battle,
    queuedActions: [
      {
        unitId: battle.playerTeam.units[0].id,
        abilityId: FIREBALL.id,
        targetIds: ['slime-a'],
        manaCost: FIREBALL.manaCost ?? 0,
      },
      null,
      null,
      null,
    ],
    remainingMana: battle.maxMana - (FIREBALL.manaCost ?? 0),
  };
  const result = executeRound(prepared, makePRNG(1));
  const hits = result.events.filter(
    (e): e is Extract<typeof e, { type: 'hit' }> => e.type === 'hit'
  );
  expect(hits.map(h => h.targetId)).toEqual(['slime-b']);  // Should be single target
});
```

**Fix:**
- Ensure retargeting preserves ability's target type
- Single-target abilities retarget to ONE enemy, not all

**Effort:** M (2-4 hours)

---

### 9. Unit Dies Before Action Executes
**Severity:** 🟡 **MEDIUM**

**Issue:**
- Unit queues action, then dies before execution phase
- Action still executes (or throws error)
- Need to handle gracefully

**Test Case:** (To be written)

**Fix:**
- Check if unit alive before executing queued action
- Skip action if unit KO'd
- Emit "miss" event

**Effort:** S (2 hours)

---

## 🟡 EQUIPMENT EDGE CASES

### 10. Duplicate Equipment Removal Bug
**File:** `apps/vale-v2/src/ui/state/inventorySlice.ts:31-38`  
**Severity:** 🟡 **MEDIUM**

**Issue:**
- Drops reuse same object reference from `enemy.drops`
- `removeEquipment` filters by `id`
- Removing one copy deletes all duplicates

**Test Case:**
```typescript
// apps/vale-v2/tests/ui/InventorySlice.duplicates.test.ts
import { create } from 'zustand';
import { createInventorySlice, type InventorySlice } from '@/ui/state/inventorySlice';
import { EQUIPMENT } from '@/data/definitions/equipment';

it('keeps remaining duplicates when removing one piece of gear', () => {
  const useInventory = create<InventorySlice>()((set) => createInventorySlice(set));
  const sword = EQUIPMENT['steel-sword'];
  useInventory.getState().addEquipment([sword, sword]);
  useInventory.getState().removeEquipment(sword.id);
  expect(useInventory.getState().equipment).toHaveLength(1);
});
```

**Fix:**
- Track equipment by unique ID + instance
- Or use array index for removal
- Or deep clone equipment on add

**Effort:** S (2-4 hours)

---

### 11. Equipment References Non-Existent Abilities
**File:** `apps/vale-v2/src/data/definitions/equipment.ts:75-83, 202-209`  
**Severity:** 🟡 **MEDIUM**

**Issue:**
- `SOL_BLADE.unlocksAbility = 'megiddo'` (doesn't exist)
- `STAFF_OF_AGES.unlocksAbility = 'odyssey'` (doesn't exist)
- `validateAllGameData` never checks `unlocksAbility`

**Test Case:**
```typescript
// apps/vale-v2/tests/data/equipmentAbilities.test.ts
import { ABILITIES } from '@/data/definitions/abilities';
import { EQUIPMENT } from '@/data/definitions/equipment';

it('requires every unlocksAbility id to correspond to a defined ability', () => {
  const known = new Set(Object.keys(ABILITIES));
  const offenders = Object.values(EQUIPMENT).filter(
    (item) => item.unlocksAbility && !known.has(item.unlocksAbility)
  );
  expect(offenders).toHaveLength(0);
});
```

**Fix:**
- Add validation in `validateAllGameData`
- Check all `unlocksAbility` references
- Fix or remove invalid references

**Effort:** S (2-4 hours)

---

## 🟡 PROGRESSION EDGE CASES

### 12. Negative XP Causes Level-Down
**File:** `apps/vale-v2/src/core/algorithms/xp.ts:97-120`  
**Severity:** 🟡 **MEDIUM**

**Issue:**
- `addXp` does `unit.xp + xpGain` without bounds checking
- Negative rewards produce negative XP
- Silent level-downs while unlocked ability lists stay inflated

**Test Case:**
```typescript
// apps/vale-v2/tests/core/xpNegative.test.ts
import { addXp, getXpForLevel } from '@/core/algorithms/xp';
import { mkUnit } from '@/test/factories';

it('does not allow XP loss to drive levels or stored XP below zero', () => {
  const unit = mkUnit({ level: 5, xp: getXpForLevel(5) });
  const result = addXp(unit, -999);
  expect(result.unit.level).toBe(5);
  expect(result.unit.xp).toBeGreaterThanOrEqual(0);
});
```

**Fix:**
- Clamp XP to minimum 0
- Recalculate level if XP drops below threshold
- Remove abilities unlocked at higher levels

**Effort:** M (2-4 hours)

---

## 📊 SUMMARY STATISTICS

| Category | Issues | Severity |
|----------|--------|----------|
| Error Boundaries | 1 | 🔴 Critical |
| Result Types | 2 | 🟠 High |
| Null/Undefined | 2 | 🟠 High |
| Battle Edge Cases | 4 | 🟠 High |
| Equipment Edge Cases | 2 | 🟡 Medium |
| Progression Edge Cases | 1 | 🟡 Medium |
| **Total** | **12** | **Mixed** |

---

## 🎯 PRIORITY FIXES

### Phase 1: Critical (This Sprint)
1. **Add React Error Boundary** (S) - Prevents blank screens
2. **Convert queueAction to Result type** (M) - Follows DoD, improves error handling
3. **Handle AI decision failures** (S) - Prevents round crashes

### Phase 2: High Priority (Next Sprint)
4. **Fix ActionQueuePanel ABILITIES.find bug** (S) - Runtime crash
5. **Fix simultaneous wipe-out logic** (S) - Incorrect victory condition
6. **Fix retargeting preserves target type** (M) - Single-target becomes multi-target

### Phase 3: Medium Priority (Backlog)
7. **Fix duplicate equipment removal** (S) - Data integrity issue
8. **Validate equipment ability references** (S) - Data consistency
9. **Clamp negative XP** (M) - Progression integrity
10. **Handle unit dies before action** (S) - Edge case handling

---

## 📋 TEST CASES TO IMPLEMENT

All test cases provided above should be added to the test suite:

1. `App.errorBoundary.test.tsx` - Error boundary fallback
2. `QueueBattleService.result.test.ts` - Result type conversion
3. `EnemyDecision.resilience.test.ts` - AI failure handling
4. `ActionQueuePanel.test.tsx` - ABILITIES dictionary fix
5. `QueueBattleService.missingAbility.test.ts` - Missing ability handling
6. `BattleService.tie.test.ts` - Simultaneous wipe-out
7. `ManaBudget.test.ts` - Mana validation logic
8. `Retargeting.test.ts` - Single-target retargeting
9. `InventorySlice.duplicates.test.ts` - Duplicate equipment
10. `equipmentAbilities.test.ts` - Equipment ability validation
11. `xpNegative.test.ts` - Negative XP clamping

---

**Audit Complete** ✅  
**Report Generated:** 2025-01-27

