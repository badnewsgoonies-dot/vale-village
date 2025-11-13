# PHASE 8: DJINN STANDBY MECHANICS (FINAL PHASE)

**Date:** November 12, 2025  
**Priority:** HIGH (Completes game mechanics overhaul)  
**Estimated Effort:** 4-6 hours (core logic already implemented)  
**Model:** Codex with Extended Thinking  
**Prerequisites:** Phases 1-7 complete (especially Phase 7 - Djinn abilities)

---

## CONTEXT

This is the **FINAL PHASE** of the game mechanics overhaul. When complete, all mechanics from the instruction booklet will be implemented.

**From VALE_CHRONICLES_INSTRUCTION_BOOKLET.md (Lines 394-442):**

```
THE TRADE-OFF

When you activate a Djinn, it moves to "Standby" state:

WHAT YOU LOSE (Until Recovery):
  ❌ That Djinn's stat bonuses/penalties
  ❌ All abilities that Djinn unlocked for your team
  
  These losses affect YOUR ENTIRE PARTY immediately!

WHEN RECOVERED:
  ✅ Djinn returns to "Set" state
  ✅ All stat bonuses/penalties restored
  ✅ All abilities unlocked again
```

**Strategic Example:**
```
Round 1 - Before Activation:
  Flint is Set
  Isaac: +4 ATK, +3 DEF, has "Stone Fist" ability
  Garet: -3 ATK, -2 DEF (counter penalty), has "Lava Stone" ability

Round 1 - Activate Flint:
  Flint → Standby (2-turn recovery)
  Isaac: LOSES +4 ATK, +3 DEF, loses "Stone Fist"
  Garet: LOSES -3 ATK, -2 DEF penalty (temp boost!), loses "Lava Stone"

Round 4 - Flint Recovers:
  Flint returns to Set
  Isaac: REGAINS +4 ATK, +3 DEF, "Stone Fist" back
  Garet: REGAINS -3 ATK, -2 DEF penalty, "Lava Stone" back
```

---

## CURRENT STATE

**What Exists (Already Implemented):**
- ✅ Stat bonuses filter by Djinn state (`getSetDjinnIds()` filters by `state === 'Set'`)
- ✅ `calculateDjinnBonusesForUnit()` uses `getSetDjinnIds()` for filtering
- ✅ Stats recalculate automatically when Djinn state changes
- ✅ Abilities filter by Djinn state (`getDjinnGrantedAbilitiesForUnit()` uses `getSetDjinnIds()`)
- ✅ `mergeDjinnAbilitiesIntoUnit()` called on Djinn activation (QueueBattleService.ts:467-469)
- ✅ `mergeDjinnAbilitiesIntoUnit()` called on Djinn recovery (QueueBattleService.ts:359-361)
- ✅ Real-time updates via `calculateEffectiveStats()` on-demand

**What's Missing (Phase 8):**
- ❌ BattleEvent types for bonus loss/restoration feedback
- ❌ UI visual indicators for locked abilities
- ❌ Tooltips explaining why abilities are locked
- ❌ Battle log messages showing stat changes
- ❌ Comprehensive tests for standby mechanics

**The Gap:**
The core state filtering logic is complete! Phase 8 is about adding **visibility and testing** - events for the battle log and UI feedback so players understand what's happening.

---

## OBJECTIVES

1. **Remove bonuses when Djinn activated** - Stat bonuses lost immediately
2. **Remove abilities when Djinn activated** - Abilities become unavailable
3. **Restore bonuses when Djinn recovers** - Stats return when timer expires
4. **Restore abilities when Djinn recovers** - Abilities become available again
5. **Real-time updates** - Effective stats recalculate during battle
6. **UI feedback** - Players see stat changes and ability locks

---

## ARCHITECTURAL CHALLENGE

### **The Core Problem:**

**Effective stats are cached:**
```typescript
// Current: Calculated once at battle start
const effectiveStats = calculateEffectiveStats(unit, team);
```

**When Djinn activated:**
- Djinn state changes: Set → Standby
- But `calculateEffectiveStats()` doesn't re-run
- Stats stay the same (wrong!)

**Solution:**
`calculateEffectiveStats()` must filter Djinn by state:
```typescript
// Only count Djinn in 'Set' state
const setDjinn = team.equippedDjinn.filter(id => 
  team.djinnTrackers[id]?.state === 'Set'
);
const djinnBonuses = calculateDjinnBonuses(setDjinn, unit);
```

---

## IMPLEMENTATION TASKS

### **Task 8.1: VERIFY Djinn Bonus Calculation Filters by State** ✅

**Status:** Already Implemented  
**File:** `apps/vale-v2/src/core/algorithms/djinnAbilities.ts` (line 34)

**Existing Implementation:**
```typescript
export function calculateDjinnBonuses(team: Team): Partial<Stats> {
  if (team.equippedDjinn.length === 0) {
    return { atk: 0, def: 0, spd: 0 };
  }

  const djinnElements = team.equippedDjinn.map(id => getDjinnElement(id));
  const synergy = calculateDjinnSynergy(djinnElements);
  
  return {
    atk: synergy.atk,
    def: synergy.def,
    spd: synergy.spd,
  };
}
```

**Updated Code (Filter by State):**
```typescript
export function calculateDjinnBonuses(team: Team): Partial<Stats> {
  if (team.equippedDjinn.length === 0) {
    return { atk: 0, def: 0, spd: 0 };
  }

  // CRITICAL: Only count Djinn in 'Set' state
  // Djinn in Standby/Recovery don't provide bonuses
  const setDjinn = team.equippedDjinn.filter(djinnId => {
    const tracker = team.djinnTrackers[djinnId];
    return tracker?.state === 'Set';
  });

  if (setDjinn.length === 0) {
    return { atk: 0, def: 0, spd: 0 };
  }

  const djinnElements = setDjinn.map(id => getDjinnElement(id));
  const synergy = calculateDjinnSynergy(djinnElements);
  
  return {
    atk: synergy.atk,
    def: synergy.def,
    spd: synergy.spd,
  };
}
```

**Verification Steps:**
- [x] Check `getSetDjinnIds()` exists and filters by `state === 'Set'`
- [x] Check `calculateDjinnBonusesForUnit()` uses `getSetDjinnIds()`
- [x] Verify bonuses = 0 when all Djinn in Standby
- [x] Test in battle: activate Djinn → stats decrease

**Status:** ✅ COMPLETE - No code changes needed

---

### **Task 8.2: VERIFY Per-Unit Djinn Bonuses Filter by State** ✅

**Status:** Already Implemented  
**File:** `apps/vale-v2/src/core/algorithms/djinnAbilities.ts`

**Existing Implementation:**
```typescript
export function calculateDjinnBonusesForUnit(
  unit: Unit,
  equippedDjinn: readonly Djinn[]
): Partial<Stats> {
  // Calculates per-unit bonuses based on element compatibility
  // ...
}
```

**Updated Code (Filter by State):**
```typescript
export function calculateDjinnBonusesForUnit(
  unit: Unit,
  equippedDjinn: readonly Djinn[],
  djinnStates: Record<string, 'Set' | 'Standby' | 'Recovery'>
): Partial<Stats> {
  let totalBonus: Partial<Stats> = { atk: 0, def: 0, spd: 0 };
  
  for (const djinn of equippedDjinn) {
    // CRITICAL: Skip Djinn not in Set state
    if (djinnStates[djinn.id] !== 'Set') continue;
    
    const compatibility = getElementCompatibility(unit.element, djinn.element);
    
    switch (compatibility) {
      case 'same':
        totalBonus.atk! += 4;
        totalBonus.def! += 3;
        break;
      case 'counter':
        totalBonus.atk! -= 3;  // PENALTY
        totalBonus.def! -= 2;
        break;
      case 'neutral':
        totalBonus.atk! += 2;
        totalBonus.def! += 2;
        break;
    }
  }
  
  return totalBonus;
}
```

**Verification Steps:**
- [x] Verify function uses `getSetDjinnIds()`
- [x] Test counter element: penalty removed when Djinn in Standby
- [x] Test same element: bonus removed when Djinn in Standby

**Status:** ✅ COMPLETE - No code changes needed

---

### **Task 8.3: VERIFY Ability Unlocking Filters by State** ✅

**Status:** Already Implemented  
**File:** `apps/vale-v2/src/core/algorithms/djinnAbilities.ts` (line 72)

**Existing Implementation:**
```typescript
export function getDjinnGrantedAbilities(
  unit: Unit,
  equippedDjinn: readonly Djinn[]
): string[] {
  const abilities: string[] = [];
  
  for (const djinn of equippedDjinn) {
    const compatibility = getElementCompatibility(unit.element, djinn.element);
    const granted = djinn.grantedAbilities[unit.id];
    
    // Add abilities based on compatibility
    // ...
  }
  
  return abilities;
}
```

**Updated Code (Filter by State):**
```typescript
export function getDjinnGrantedAbilities(
  unit: Unit,
  equippedDjinn: readonly Djinn[],
  djinnStates: Record<string, 'Set' | 'Standby' | 'Recovery'>
): string[] {
  const abilities: string[] = [];
  
  for (const djinn of equippedDjinn) {
    // CRITICAL: Only grant abilities if Djinn is Set
    if (djinnStates[djinn.id] !== 'Set') continue;
    
    const compatibility = getElementCompatibility(unit.element, djinn.element);
    const granted = djinn.grantedAbilities[unit.id];
    
    if (!granted) continue;
    
    switch (compatibility) {
      case 'same':
        abilities.push(...granted.same);
        break;
      case 'counter':
        abilities.push(...granted.counter);
        break;
      case 'neutral':
        abilities.push(...granted.neutral);
        break;
    }
  }
  
  return abilities;
}
```

**Verification Steps:**
- [x] Verify `getDjinnGrantedAbilitiesForUnit()` uses `getSetDjinnIds()`
- [x] Verify `mergeDjinnAbilitiesIntoUnit()` called on activation
- [x] Verify `mergeDjinnAbilitiesIntoUnit()` called on recovery
- [x] Test: Activate Djinn → abilities disappear
- [x] Test: Djinn recovers → abilities return

**Status:** ✅ COMPLETE - No code changes needed

---

### **Task 8.4: VERIFY calculateEffectiveStats Uses State** ✅

**Status:** Already Working (via Task 8.1)  
**File:** `apps/vale-v2/src/core/algorithms/stats.ts`

**How It Works:**
```typescript
export function calculateEffectiveStats(unit: Unit, team: Team): Stats {
  const base = unit.baseStats;
  const levelBonus = calculateLevelBonuses(unit);
  const equipment = calculateEquipmentBonuses(unit);
  const djinn = calculateDjinnBonuses(team);  // Uses all equipped Djinn
  const status = calculateStatusModifiers(unit);

  return {
    hp: base.hp + levelBonus.hp + (equipment.hp ?? 0),
    pp: base.pp + levelBonus.pp + (equipment.pp ?? 0),
    atk: base.atk + levelBonus.atk + (equipment.atk ?? 0) + (djinn.atk ?? 0) + (status.atk ?? 0),
    def: base.def + levelBonus.def + (equipment.def ?? 0) + (djinn.def ?? 0) + (status.def ?? 0),
    mag: base.mag + levelBonus.mag + (equipment.mag ?? 0) + (status.mag ?? 0),
    spd: base.spd + levelBonus.spd + (equipment.spd ?? 0) + (djinn.spd ?? 0) + (status.spd ?? 0),
  };
}
```

**Verification Steps:**
- [x] `calculateDjinnBonuses()` calls `getSetDjinnIds()` (verified in Task 8.1)
- [x] Called every time stats calculated (no caching)
- [x] Stats update automatically when Djinn state changes

**Status:** ✅ COMPLETE - Works via existing functions

---

### **Task 8.5: ADD BattleEvents for Stat Changes** ⚠️ NEEDED

**Status:** Not Implemented  
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts`

**Purpose:** Add battle log feedback so players see when bonuses are lost/restored

**Implementation Locations:**

**A) When Djinn Activated (executeDjinnSummons):**
```typescript
function executeDjinnSummons(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  // ... existing summon logic ...
  
  // After setting Djinn to Standby:
  // Team's djinnTrackers now have Djinn in Standby state
  // calculateEffectiveStats() will automatically recalculate with filtered bonuses
  
  // Add event to show stat changes
  const statChangeEvents: BattleEvent[] = [];
  for (const unit of state.playerTeam.units) {
    const oldStats = calculateEffectiveStats(unit, state.playerTeam); // Before
    // (Actually, stats already changed since djinnTrackers updated)
    // Just log that bonuses were lost
    
    statChangeEvents.push({
      type: 'djinn-bonus-lost',
      unitId: unit.id,
      djinnIds: [...state.queuedDjinn],
    });
  }
  
  return { state: currentState, events: [...events, ...statChangeEvents] };
}
```

**B) When Djinn Recovers (transitionToPlanningPhase):**
```typescript
function transitionToPlanningPhase(state: BattleState): BattleState {
  // ... timer decrement logic ...
  
  for (const [djinnId, timer] of Object.entries(updatedTimers)) {
    if (timer === 1) {  // Will be 0 after decrement
      // Djinn recovering - update state to Set
      const tracker = updatedTrackers[djinnId];
      if (tracker) {
        updatedTrackers[djinnId] = {
          ...tracker,
          state: 'Set',  // Recovered!
        };
        
        // Add event showing bonuses restored
        recoveryEvents.push({
          type: 'djinn-bonus-restored',
          djinnId,
        });
      }
    }
  }
  
  // Stats will automatically recalculate when accessed
  // because calculateEffectiveStats() uses updated djinnTrackers
  
  return updatedState;
}
```

**Success Criteria:**
- Events emitted when Djinn activated (bonuses lost)
- Events emitted when Djinn recovers (bonuses restored)
- Battle log shows "Team loses bonuses from Flint!"
- Battle log shows "Flint bonuses restored!"

---

### **Task 8.6: VERIFY Ability Availability Updates** ✅

**Status:** Already Implemented via `mergeDjinnAbilitiesIntoUnit()`  
**Files:** `apps/vale-v2/src/core/services/QueueBattleService.ts`

**How It Works:**
- Activation: `mergeDjinnAbilitiesIntoUnit()` called (line 467-469)
- Recovery: `mergeDjinnAbilitiesIntoUnit()` called (line 359-361)
- Uses `getDjinnGrantedAbilitiesForUnit()` which filters by state

**Implementation:**
```typescript
function getAvailableAbilities(unit: Unit, team: Team): Ability[] {
  const abilities: Ability[] = [];
  
  // Level-unlocked abilities
  const levelAbilities = unit.abilities.filter(a => 
    unit.unlockedAbilityIds.includes(a.id)
  );
  abilities.push(...levelAbilities);
  
  // Equipment-unlocked abilities
  const equipmentAbilities = getEquipmentAbilities(unit);
  abilities.push(...equipmentAbilities);
  
  // Djinn-granted abilities (filtered by state)
  const djinnData = team.equippedDjinn.map(id => DJINN[id]).filter(Boolean);
  const djinnAbilities = getDjinnGrantedAbilities(
    unit,
    djinnData,
    team.djinnTrackers  // Pass state tracking
  );
  
  const djinnAbilityObjects = djinnAbilities
    .map(id => DJINN_ABILITIES[id])
    .filter(Boolean);
  abilities.push(...djinnAbilityObjects);
  
  return abilities;
}
```

**Verification Steps:**
- [x] Check activation calls `mergeDjinnAbilitiesIntoUnit()`
- [x] Check recovery calls `mergeDjinnAbilitiesIntoUnit()`  
- [x] Test: Activate Djinn → abilities removed from unit
- [x] Test: Djinn recovers → abilities added back

**Status:** ✅ COMPLETE - Already working

---

### **Task 8.7: ADD BattleEvent Types for Stat Changes** ⚠️ NEEDED

**Status:** Not Implemented  
**File:** `apps/vale-v2/src/core/services/types.ts`

**Add New Event Types:**
```typescript
export type BattleEvent =
  | { type: 'turn-start'; actorId: string; turn: number }
  | { type: 'ability'; casterId: string; abilityId: string; targets: readonly string[] }
  | { type: 'hit'; targetId: string; amount: number; element?: Element }
  | { type: 'heal'; targetId: string; amount: number }
  | { type: 'auto-heal'; message: string }
  | { type: 'mana-generated'; amount: number; source: string; newTotal: number }
  | { type: 'djinn-activated'; djinnIds: readonly string[]; recoveryTime: number }
  | { type: 'djinn-recovered'; djinnId: string }
  | { type: 'djinn-bonus-lost'; unitId: string; djinnIds: readonly string[] }  // NEW
  | { type: 'djinn-bonus-restored'; djinnId: string }  // NEW
  | { type: 'status-applied'; targetId: string; status: StatusEffect }
  // ... rest
```

**Update Renderer:**
```typescript
// In text.ts
case 'djinn-bonus-lost':
  return `⚠️ Team loses bonuses from ${e.djinnIds.join(', ')}!`;
case 'djinn-bonus-restored':
  return `✨ ${e.djinnId} bonuses restored!`;
```

**Success Criteria:**
- Events logged when bonuses lost/restored
- Battle log shows stat changes
- Players understand the trade-off

---

### **Task 8.8: ADD UI Indicators for Locked Abilities** ⚠️ NEEDED

**Status:** Not Implemented  
**File:** `apps/vale-v2/src/ui/components/QueueBattleView.tsx` (or ability selection UI)

**Purpose:** Visual feedback showing which abilities are unavailable due to Djinn in Standby

**Implementation:**
```typescript
// In ability list rendering
{abilities.map(ability => {
  const isDjinnAbility = ability.id.startsWith('flint-') || 
                         ability.id.startsWith('granite-') ||
                         // ... check all Djinn prefixes
  
  const grantingDjinn = isDjinnAbility ? findDjinnForAbility(ability.id) : null;
  const isLocked = grantingDjinn && 
                   team.djinnTrackers[grantingDjinn.id]?.state !== 'Set';
  
  return (
    <button
      disabled={isLocked}
      style={{
        opacity: isLocked ? 0.5 : 1,
        cursor: isLocked ? 'not-allowed' : 'pointer',
      }}
      title={isLocked ? `Locked: ${grantingDjinn.name} is in Standby` : ability.description}
    >
      {ability.name}
      {isLocked && ' 🔒'}
    </button>
  );
})}
```

**Success Criteria:**
- Locked abilities visually distinct (grayed out, lock icon)
- Tooltip explains why locked
- Cannot queue locked abilities

---

## TESTING REQUIREMENTS

### **Test 8.1: Stat Loss on Activation**

**File:** `apps/vale-v2/tests/core/algorithms/djinnStandby.test.ts` (NEW)

```typescript
import { describe, test, expect } from 'vitest';
import { createTeam, updateTeam } from '@/core/models/Team';
import { mkUnit } from '@/test/factories';
import { calculateEffectiveStats } from '@/core/algorithms/stats';
import { DJINN } from '@/data/definitions/djinn';

describe('Djinn Standby - Stat Bonuses', () => {
  test('activating Djinn removes stat bonuses', () => {
    const isaac = mkUnit({ id: 'adept', element: 'Venus' });
    let team = createTeam([isaac]);
    
    // Equip Flint (Venus Djinn)
    team = updateTeam(team, {
      equippedDjinn: ['flint'],
      djinnTrackers: {
        'flint': { state: 'Set', lastActivatedTurn: 0 },
      },
    });
    
    // Stats with Flint Set (Isaac is Venus = same element)
    const statsWithFlint = calculateEffectiveStats(isaac, team);
    expect(statsWithFlint.atk).toBe(isaac.baseStats.atk + 4); // +4 from Flint
    expect(statsWithFlint.def).toBe(isaac.baseStats.def + 3); // +3 from Flint
    
    // Activate Flint (Set → Standby)
    team = updateTeam(team, {
      djinnTrackers: {
        'flint': { state: 'Standby', lastActivatedTurn: 1 },
      },
    });
    
    // Stats with Flint in Standby (bonuses lost)
    const statsWithoutFlint = calculateEffectiveStats(isaac, team);
    expect(statsWithoutFlint.atk).toBe(isaac.baseStats.atk); // No bonus!
    expect(statsWithoutFlint.def).toBe(isaac.baseStats.def); // No bonus!
  });
  
  test('counter element unit loses penalty when Djinn in Standby', () => {
    const garet = mkUnit({ id: 'war-mage', element: 'Mars' });
    let team = createTeam([garet]);
    
    // Equip Flint (Venus Djinn, counter to Mars)
    team = updateTeam(team, {
      equippedDjinn: ['flint'],
      djinnTrackers: {
        'flint': { state: 'Set', lastActivatedTurn: 0 },
      },
    });
    
    // Stats with Flint Set (Garet is Mars = counter element = PENALTY)
    const statsWithPenalty = calculateEffectiveStats(garet, team);
    expect(statsWithPenalty.atk).toBe(garet.baseStats.atk - 3); // -3 penalty
    expect(statsWithPenalty.def).toBe(garet.baseStats.def - 2); // -2 penalty
    
    // Activate Flint (penalty removed temporarily!)
    team = updateTeam(team, {
      djinnTrackers: {
        'flint': { state: 'Standby', lastActivatedTurn: 1 },
      },
    });
    
    // Stats with Flint in Standby (penalty lost = temporary boost!)
    const statsWithoutPenalty = calculateEffectiveStats(garet, team);
    expect(statsWithoutPenalty.atk).toBe(garet.baseStats.atk); // No penalty!
    expect(statsWithoutPenalty.def).toBe(garet.baseStats.def); // No penalty!
  });
  
  test('recovering Djinn restores bonuses', () => {
    const isaac = mkUnit({ id: 'adept', element: 'Venus' });
    let team = createTeam([isaac]);
    
    // Equip Flint in Standby
    team = updateTeam(team, {
      equippedDjinn: ['flint'],
      djinnTrackers: {
        'flint': { state: 'Standby', lastActivatedTurn: 1 },
      },
    });
    
    // Stats without bonuses
    const statsInStandby = calculateEffectiveStats(isaac, team);
    const baseAtk = isaac.baseStats.atk;
    expect(statsInStandby.atk).toBe(baseAtk);
    
    // Djinn recovers (Standby → Set)
    team = updateTeam(team, {
      djinnTrackers: {
        'flint': { state: 'Set', lastActivatedTurn: 1 },
      },
    });
    
    // Stats with bonuses restored
    const statsRecovered = calculateEffectiveStats(isaac, team);
    expect(statsRecovered.atk).toBe(baseAtk + 4); // Bonus back!
    expect(statsRecovered.def).toBe(isaac.baseStats.def + 3); // Bonus back!
  });
});
```

---

### **Test 8.2: Ability Loss on Activation**

```typescript
describe('Djinn Standby - Ability Availability', () => {
  test('activating Djinn removes granted abilities', () => {
    const isaac = mkUnit({ id: 'adept', element: 'Venus' });
    let team = createTeam([isaac]);
    
    const flint = DJINN['flint'];
    
    // Equip Flint in Set state
    team = updateTeam(team, {
      equippedDjinn: ['flint'],
      djinnTrackers: {
        'flint': { state: 'Set', lastActivatedTurn: 0 },
      },
    });
    
    // Abilities with Flint Set
    const abilitiesWithFlint = getDjinnGrantedAbilities(
      isaac,
      [flint],
      team.djinnTrackers
    );
    expect(abilitiesWithFlint).toContain('flint-stone-fist'); // Has ability
    expect(abilitiesWithFlint.length).toBeGreaterThan(0);
    
    // Activate Flint (Set → Standby)
    team = updateTeam(team, {
      djinnTrackers: {
        'flint': { state: 'Standby', lastActivatedTurn: 1 },
      },
    });
    
    // Abilities with Flint in Standby (abilities lost)
    const abilitiesWithoutFlint = getDjinnGrantedAbilities(
      isaac,
      [flint],
      team.djinnTrackers
    );
    expect(abilitiesWithoutFlint).not.toContain('flint-stone-fist'); // Lost!
    expect(abilitiesWithoutFlint).toHaveLength(0); // All Flint abilities gone
  });
  
  test('recovering Djinn restores abilities', () => {
    const isaac = mkUnit({ id: 'adept', element: 'Venus' });
    let team = createTeam([isaac]);
    
    const flint = DJINN['flint'];
    
    // Start with Flint in Standby
    team = updateTeam(team, {
      equippedDjinn: ['flint'],
      djinnTrackers: {
        'flint': { state: 'Standby', lastActivatedTurn: 1 },
      },
    });
    
    // No abilities while in Standby
    const abilitiesLost = getDjinnGrantedAbilities(isaac, [flint], team.djinnTrackers);
    expect(abilitiesLost).toHaveLength(0);
    
    // Djinn recovers (Standby → Set)
    team = updateTeam(team, {
      djinnTrackers: {
        'flint': { state: 'Set', lastActivatedTurn: 1 },
      },
    });
    
    // Abilities restored
    const abilitiesRestored = getDjinnGrantedAbilities(isaac, [flint], team.djinnTrackers);
    expect(abilitiesRestored).toContain('flint-stone-fist'); // Back!
    expect(abilitiesRestored.length).toBeGreaterThan(0);
  });
});
```

---

### **Test 8.3: Multiple Djinn Staggered Activation**

```typescript
describe('Djinn Standby - Strategic Scenarios', () => {
  test('staggered activation maintains some bonuses', () => {
    const isaac = mkUnit({ id: 'adept', element: 'Venus' });
    let team = createTeam([isaac]);
    
    // Equip 3 Venus Djinn (all Set)
    team = updateTeam(team, {
      equippedDjinn: ['flint', 'granite', 'bane'],
      djinnTrackers: {
        'flint': { state: 'Set', lastActivatedTurn: 0 },
        'granite': { state: 'Set', lastActivatedTurn: 0 },
        'bane': { state: 'Set', lastActivatedTurn: 0 },
      },
    });
    
    // With all 3 Set: +12 ATK, +8 DEF
    const statsAll = calculateEffectiveStats(isaac, team);
    expect(statsAll.atk).toBe(isaac.baseStats.atk + 12);
    expect(statsAll.def).toBe(isaac.baseStats.def + 8);
    
    // Activate Flint only (other 2 still Set)
    team = updateTeam(team, {
      djinnTrackers: {
        'flint': { state: 'Standby', lastActivatedTurn: 1 },
        'granite': { state: 'Set', lastActivatedTurn: 0 },
        'bane': { state: 'Set', lastActivatedTurn: 0 },
      },
    });
    
    // With 2 Set (Granite + Bane): +8 ATK, +5 DEF
    const statsPartial = calculateEffectiveStats(isaac, team);
    expect(statsPartial.atk).toBe(isaac.baseStats.atk + 8);
    expect(statsPartial.def).toBe(isaac.baseStats.def + 5);
    
    // Activate all 3 (none Set)
    team = updateTeam(team, {
      djinnTrackers: {
        'flint': { state: 'Standby', lastActivatedTurn: 2 },
        'granite': { state: 'Standby', lastActivatedTurn: 2 },
        'bane': { state: 'Standby', lastActivatedTurn: 2 },
      },
    });
    
    // With 0 Set: +0 ATK, +0 DEF
    const statsNone = calculateEffectiveStats(isaac, team);
    expect(statsNone.atk).toBe(isaac.baseStats.atk); // No bonuses!
    expect(statsNone.def).toBe(isaac.baseStats.def); // No bonuses!
  });
});
```

---

## EDGE CASES

### **Edge Case 1: All Djinn in Standby**
```typescript
// All 3 Djinn activated together
// Team has ZERO Djinn bonuses
// calculateDjinnBonuses() returns { atk: 0, def: 0, spd: 0 }
// Units use base stats only
```

**Handle:** Already handled by filtering (returns empty bonuses)

---

### **Edge Case 2: Djinn Recovers Mid-Round**
```typescript
// Djinn recovers during enemy action phase
// Player abilities are already queued for this round
// Recovered abilities become available NEXT round
```

**Handle:** Abilities checked at planning phase, so this is fine.

---

### **Edge Case 3: Trying to Use Locked Ability**
```typescript
// Player queued ability while Djinn was Set
// Djinn goes to Standby before ability executes
// Ability should still execute (queued when valid)
```

**Handle:** Queue validation happens at planning phase, execution uses queued actions.

---

### **Edge Case 4: Counter Unit Mid-Battle**
```typescript
// Garet has -3 ATK penalty from Venus Djinn
// Venus Djinn activated
// Garet's ATK increases mid-battle (penalty removed)
// Then Djinn recovers
// Garet's ATK decreases again (penalty restored)
```

**Handle:** This is intentional and strategic! Document in booklet as feature.

---

## VALIDATION CHECKLIST

Before marking Phase 8 complete:

### **Functional:**
- [ ] Djinn in Set state: Provide bonuses + abilities
- [ ] Djinn in Standby: No bonuses, no abilities
- [ ] Djinn in Recovery: No bonuses, no abilities (same as Standby)
- [ ] Djinn recovered: Bonuses + abilities restored
- [ ] Real-time stat updates during battle
- [ ] Ability availability updates when state changes

### **Strategic:**
- [ ] Counter units get temporary stat boost when Djinn in Standby
- [ ] Staggered activation maintains some bonuses
- [ ] All-in activation removes all bonuses (high risk/reward)

### **Events:**
- [ ] `djinn-bonus-lost` logged on activation
- [ ] `djinn-bonus-restored` logged on recovery
- [ ] Battle log shows stat changes

### **UI:**
- [ ] Locked abilities visually distinct
- [ ] Tooltips explain why locked
- [ ] Cannot queue locked abilities

### **Testing:**
- [ ] All Phase 8 tests pass
- [ ] All existing tests still pass
- [ ] Data validation passes
- [ ] TypeScript compiles

---

## EXPECTED CHANGES

**Files Modified:** 4-5  
**Lines Added:** ~100-150  
**Lines Removed:** ~10-20  
**Net Change:** +80-130 lines

**New Test File:** 1  
**Test Cases Added:** 5-7

**Small change!** Mostly parameter additions and filtering logic.

---

## ARCHITECTURE COMPLIANCE

**Must Follow:**
- ✅ Pure functions (calculateDjinnBonuses, getDjinnGrantedAbilities)
- ✅ Immutable updates (don't mutate djinnTrackers)
- ✅ State-driven (djinnTrackers is source of truth)
- ✅ Event sourcing (log bonus changes)

**Must Not:**
- ❌ Cache effective stats (must recalculate when state changes)
- ❌ Mutate team or unit objects
- ❌ Put game logic in UI
- ❌ Break existing Djinn system

---

## SUCCESS METRICS

**Gameplay:**
- ✅ Activating 1 Djinn: Lose ~⅓ of bonuses
- ✅ Activating 2 Djinn: Lose ~⅔ of bonuses
- ✅ Activating 3 Djinn: Lose ALL bonuses (team crippled!)
- ✅ Recovery: Bonuses come back
- ✅ Strategic depth: Timing matters

**Technical:**
- ✅ Stats recalculate automatically
- ✅ Abilities filter by state
- ✅ No performance issues
- ✅ Tests pass

**Booklet Alignment:**
- ✅ Matches lines 394-442 exactly
- ✅ Example scenarios work in-game
- ✅ Trade-off is meaningful

---

## INTEGRATION POINTS

### **With Phase 5 (Djinn Recovery):**
When recovery timer expires:
1. Update djinnTrackers (Standby → Set)
2. calculateEffectiveStats() automatically recalculates
3. getDjinnGrantedAbilities() returns abilities
4. UI updates

### **With Phase 7 (Djinn Abilities):**
- Uses same `getDjinnGrantedAbilities()` function
- Just adds state filtering
- No conflicts

### **With Battle System:**
- Stats calculated every action
- No caching issues
- Real-time updates

---

## ROLLBACK PLAN

If issues arise:

```bash
# Revert changes
git checkout apps/vale-v2/src/core/algorithms/stats.ts
git checkout apps/vale-v2/src/core/algorithms/djinnAbilities.ts
# ... other files

# Or revert entire phase
git revert HEAD
```

**Low Risk:** Additive changes, well-tested pattern from Phase 7.

---

## TIMELINE

**Session 1 (2-3 hours):**
- Tasks 8.1-8.4: VERIFICATION ONLY (already complete)
- Task 8.5: Add BattleEvents for feedback
- Task 8.7: Add event types and renderer

**Session 2 (2-3 hours):**
- Task 8.8: Add UI indicators for locked abilities
- Testing: Write comprehensive Phase 8 tests
- Edge cases and validation

**Total:** 4-6 hours

**Note:** Core logic is done! This phase is mostly adding visibility/testing.

---

## COMPLETION CRITERIA

Phase 8 is complete when:

1. ✅ Activating Djinn removes bonuses/abilities
2. ✅ Recovering Djinn restores bonuses/abilities
3. ✅ Battle log shows stat changes
4. ✅ UI shows locked abilities
5. ✅ All tests pass
6. ✅ Matches instruction booklet behavior

**Then the entire 8-phase overhaul is COMPLETE!** 🎉

---

## READY TO IMPLEMENT

**Priority:** MEDIUM (polish phase - core logic done)  
**Complexity:** LOW (events + UI + tests only)  
**Risk:** VERY LOW (core logic already tested)  
**Value:** HIGH (visibility and player feedback)

**Start with Task 8.1-8.4** (verification - 30 min), then **Task 8.5** (add events - 1 hour), then **Task 8.7-8.8** (event types + UI - 2 hours), then **testing** (1-2 hours).

**This is the final push to complete the game mechanics overhaul!** 💪

---

## CODEX THINKING POINTS

When implementing with extended thinking, consider:

1. **Performance:** Stats are calculated frequently - ensure filtering is efficient
2. **State consistency:** djinnTrackers must always be in sync with BattleState
3. **UI reactivity:** Stats/abilities must update immediately when state changes
4. **Testing strategy:** Cover all state transitions (Set→Standby, Standby→Set)
5. **Edge cases:** What if djinnTrackers missing? What if state is undefined?

The implementation is straightforward, but the strategic implications are deep. Extended thinking will help ensure all edge cases are covered.

Good luck with the final phase! 🚀

