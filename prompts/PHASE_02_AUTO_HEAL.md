# PHASE 2: AUTO-HEAL AFTER EVERY BATTLE

**Date:** November 12, 2025  
**Priority:** HIGH  
**Estimated Effort:** 1 day (6-8 hours)  
**Model:** Claude 3.5 Sonnet  
**Prerequisites:** Phase 1 complete (crits/dodge/selling removed)

---

## CONTEXT

Per the **VALE_CHRONICLES_INSTRUCTION_BOOKLET.md**, the game uses automatic healing after every battle (win or lose). This eliminates the need for Inns, healing items, and manual HP management between battles.

**Instruction Booklet Reference (Lines 206-215):**
```
POST-BATTLE HEALING

After every battle (win or lose):
  • All units: Full HP restored automatically
  • All status effects: Cured automatically
  • Ready for next battle immediately
```

**Current State:**
- No auto-heal implemented
- Units carry HP/status between battles
- Would require manual healing (Inns don't exist anymore)

---

## OBJECTIVES

1. **Auto-heal after VICTORY** - Full HP, clear status
2. **Auto-heal after DEFEAT** - Full HP, clear status
3. **Update team state** - Persist healed units to teamSlice
4. **Remove healing persistence** - HP doesn't carry between battles
5. **Add battle log event** - "All units restored to full health!"

---

## IMPLEMENTATION TASKS

### **Task 2.1: Create Auto-Heal Utility Function**

**File:** `apps/vale-v2/src/core/algorithms/healing.ts` (or add to existing file)

**Create:**
```typescript
/**
 * Auto-heal all units after battle
 * Restores HP to max and clears all status effects
 * 
 * @param units - Units to heal
 * @returns Healed units
 */
export function autoHealUnits(units: readonly Unit[]): readonly Unit[] {
  return units.map(unit => {
    const maxHp = calculateMaxHp(unit);
    
    return {
      ...unit,
      currentHp: maxHp,
      statusEffects: [],
    };
  });
}
```

**Success Criteria:**
- Function is pure (no side effects)
- Returns new unit array (immutability)
- All units have full HP
- All status effects cleared

---

### **Task 2.2: Add Auto-Heal to Victory Flow**

**File:** `apps/vale-v2/src/ui/state/queueBattleSlice.ts`

**Location:** In `executeQueuedRound()`, when `result.state.phase === 'victory'`

**Current Code (Lines ~139-177):**
```typescript
if (result.state.phase === 'victory') {
  const { 
    processVictory, 
    onBattleEvents, 
    setMode, 
    setShowRewards 
  } = get();
  const rngVictory = makePRNG(
    createRNGStream(rngSeed, battle.roundNumber, RNG_STREAMS.VICTORY)
  );

  processVictory(result.state, rngVictory);
  setMode('rewards');
  setShowRewards(true);
  // ... rest
}
```

**Add Auto-Heal:**
```typescript
if (result.state.phase === 'victory') {
  const { 
    processVictory, 
    onBattleEvents, 
    setMode, 
    setShowRewards,
    updateTeamUnits  // NEW: Get team update function
  } = get();
  
  const rngVictory = makePRNG(
    createRNGStream(rngSeed, battle.roundNumber, RNG_STREAMS.VICTORY)
  );

  // AUTO-HEAL: Restore all units to full HP and clear status
  const healedUnits = autoHealUnits(result.state.playerTeam.units);
  const healedTeam = updateTeam(result.state.playerTeam, { units: healedUnits });
  const healedState = updateBattleState(result.state, { playerTeam: healedTeam });
  
  // Add auto-heal event to log
  const healEvent: BattleEvent = {
    type: 'auto-heal',
    message: 'All units restored to full health!',
  };
  set({ events: [...get().events, healEvent] });

  // Process victory with healed state
  processVictory(healedState, rngVictory);
  
  // Persist healed units to team (so they stay healed in teamSlice)
  updateTeamUnits(healedUnits);
  
  setMode('rewards');
  setShowRewards(true);
  
  // ... rest of victory flow
}
```

**Success Criteria:**
- Victory → All units full HP
- Status effects cleared
- teamSlice updated with healed units
- Battle log shows auto-heal message

---

### **Task 2.3: Add Auto-Heal to Defeat Flow**

**File:** `apps/vale-v2/src/ui/state/queueBattleSlice.ts`

**Location:** In `executeQueuedRound()`, when `result.state.phase === 'defeat'`

**Current Code (Lines ~179-202):**
```typescript
if (result.state.phase === 'defeat') {
  const { returnToOverworld, onBattleEvents } = get();

  const encounterId = getEncounterId(result.state);
  if (encounterId && onBattleEvents) {
    onBattleEvents([
      { type: 'battle-end', result: 'PLAYER_DEFEAT' },
      { type: 'encounter-finished', outcome: 'PLAYER_DEFEAT', encounterId },
    ]);
  }

  // Return to pre-battle position
  returnToOverworld();
  
  return;
}
```

**Add Auto-Heal:**
```typescript
if (result.state.phase === 'defeat') {
  const { returnToOverworld, onBattleEvents, updateTeamUnits } = get();

  // AUTO-HEAL: Even after defeat, restore HP and clear status
  const healedUnits = autoHealUnits(result.state.playerTeam.units);
  const healedTeam = updateTeam(result.state.playerTeam, { units: healedUnits });
  const healedState = updateBattleState(result.state, { playerTeam: healedTeam });
  
  // Add auto-heal event
  const healEvent: BattleEvent = {
    type: 'auto-heal',
    message: 'All units restored to full health!',
  };
  set({ battle: healedState, events: [...get().events, healEvent] });
  
  // Persist healed units to team
  updateTeamUnits(healedUnits);

  const encounterId = getEncounterId(healedState);
  if (encounterId && onBattleEvents) {
    onBattleEvents([
      { type: 'battle-end', result: 'PLAYER_DEFEAT' },
      { type: 'encounter-finished', outcome: 'PLAYER_DEFEAT', encounterId },
    ]);
  }

  // Return to pre-battle position (units are now healed)
  returnToOverworld();
  
  return;
}
```

**Success Criteria:**
- Defeat → All units still heal to full
- Can retry battle immediately (no backtracking for healing)
- teamSlice has healed units

---

### **Task 2.4: Add BattleEvent Type for Auto-Heal**

**File:** `apps/vale-v2/src/core/services/types.ts`

**Add Event Type:**
```typescript
export type BattleEvent =
  | { type: 'turn-start'; actorId: string; turn: number }
  | { type: 'ability'; casterId: string; abilityId: string; targets: readonly string[] }
  | { type: 'hit'; targetId: string; amount: number; element?: Element }
  | { type: 'heal'; targetId: string; amount: number }
  | { type: 'auto-heal'; message: string }  // NEW
  | { type: 'status-applied'; targetId: string; status: StatusEffect }
  | { type: 'status-expired'; targetId: string; status: StatusEffect }
  | { type: 'ko'; unitId: string }
  | { type: 'xp'; unitId: string; xp: number; levelUp?: { from: number; to: number } }
  | { type: 'battle-end'; result: 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' | 'PLAYER_FLEE' }
  | { type: 'encounter-finished'; outcome: 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' | 'PLAYER_FLEE'; encounterId: string };
```

**Success Criteria:**
- Auto-heal event type exists
- TypeScript validates event usage

---

### **Task 2.5: Update Battle Log Renderer**

**File:** `apps/vale-v2/src/ui/utils/text.ts`

**Add Case:**
```typescript
export function renderEventText(e: BattleEvent): string {
  switch (e.type) {
    case 'turn-start':
      return `Turn ${e.turn}: ${e.actorId}'s turn`;
    case 'ability':
      return `${e.casterId} used ${e.abilityId}`;
    case 'hit':
      return `${e.targetId} took ${e.amount}${e.element ? ` [${e.element}]` : ''}`;
    case 'heal':
      return `${e.targetId} recovered ${e.amount} HP`;
    case 'auto-heal':  // NEW
      return `✨ ${e.message}`;
    case 'status-applied':
      // ... existing code
  }
}
```

**Success Criteria:**
- Auto-heal message displays in battle log
- Message is clear and visible

---

### **Task 2.6: Add Team Update Helper to teamSlice**

**File:** `apps/vale-v2/src/ui/state/teamSlice.ts`

**Add Method:**
```typescript
export interface TeamSlice {
  team: Team;
  
  // ... existing methods
  
  updateTeamUnits: (units: readonly Unit[]) => void;  // NEW
}

export const createTeamSlice: StateCreator<TeamSlice> = (set, get) => ({
  team: createInitialTeam(),
  
  // ... existing methods
  
  updateTeamUnits: (units) => {
    const currentTeam = get().team;
    const updatedTeam = updateTeam(currentTeam, { units });
    set({ team: updatedTeam });
  },
});
```

**Success Criteria:**
- teamSlice can update units from battle
- Healed units persist after battle ends
- Team state stays synchronized

---

### **Task 2.7: Optional - Show Auto-Heal Visual**

**File:** `apps/vale-v2/src/ui/components/QueueBattleView.tsx` (or new component)

**Add Visual Feedback (Optional):**
```typescript
// After battle ends, before rewards screen
{showAutoHeal && (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 200, 0, 0.9)',
    color: 'white',
    padding: '2rem',
    borderRadius: '8px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    animation: 'fadeInOut 2s ease',
  }}>
    ✨ All Units Restored! ✨
  </div>
)}
```

**Success Criteria:**
- Visual feedback shows heal happened
- Fades in/out smoothly
- Doesn't block rewards screen

---

## TESTING REQUIREMENTS

### **Test 2.1: Victory Auto-Heal Test**

**File:** `apps/vale-v2/tests/ui/state/autoHeal.test.ts` (NEW)

```typescript
import { describe, test, expect } from 'vitest';
import { createStore } from '@/ui/state/store';
import { mkUnit, mkEnemy } from '@/test/factories';
import { applyDamage } from '@/core/algorithms/damage';

describe('Auto-Heal After Victory', () => {
  test('heals all units to full HP after winning battle', () => {
    const store = createStore();
    
    // Setup damaged units
    const damagedUnit1 = applyDamage(mkUnit({ id: 'unit1' }), 50);
    const damagedUnit2 = applyDamage(mkUnit({ id: 'unit2' }), 30);
    
    // Start battle
    store.getState().setBattle(
      createBattleState(
        createTeam([damagedUnit1, damagedUnit2]),
        [mkEnemy({ id: 'enemy1' })]
      ),
      12345
    );
    
    // ... execute battle to victory
    
    // Verify auto-heal happened
    const team = store.getState().team;
    expect(team.units[0]?.currentHp).toBe(calculateMaxHp(team.units[0]));
    expect(team.units[1]?.currentHp).toBe(calculateMaxHp(team.units[1]));
    expect(team.units[0]?.statusEffects).toEqual([]);
    expect(team.units[1]?.statusEffects).toEqual([]);
  });
  
  test('clears status effects after victory', () => {
    const store = createStore();
    
    // Setup poisoned units
    const poisonedUnit = {
      ...mkUnit({ id: 'unit1' }),
      statusEffects: [{
        type: 'poison' as const,
        damagePerTurn: 8,
        duration: 3,
      }],
    };
    
    // ... win battle
    
    // Verify status cleared
    const team = store.getState().team;
    expect(team.units[0]?.statusEffects).toEqual([]);
  });
});
```

---

### **Test 2.2: Defeat Auto-Heal Test**

```typescript
describe('Auto-Heal After Defeat', () => {
  test('heals all units to full HP even after losing', () => {
    const store = createStore();
    
    // Setup weak party that will lose
    const weakUnit = mkUnit({ id: 'weak', level: 1 });
    const strongEnemy = mkEnemy({ id: 'strong', level: 5 });
    
    // ... lose battle
    
    // Verify auto-heal happened even though we lost
    const team = store.getState().team;
    team.units.forEach(unit => {
      expect(unit.currentHp).toBe(calculateMaxHp(unit));
      expect(unit.statusEffects).toEqual([]);
    });
  });
  
  test('allows immediate retry after defeat', () => {
    // Lose battle → auto-heal → retry same battle
    // Should start with full HP, not damaged state
  });
});
```

---

### **Test 2.3: Integration Test**

```typescript
describe('Auto-Heal Battle Flow', () => {
  test('complete battle flow with auto-heal', () => {
    const store = createStore();
    
    // Battle 1: Win with damage taken
    // → Auto-heal
    // → Units at full HP
    
    // Battle 2: Start new battle
    // → Units should start at full HP (not carried damage)
    
    // Battle 2: Lose
    // → Auto-heal even after defeat
    // → Ready to retry
  });
});
```

---

## EDGE CASES TO HANDLE

### **Edge Case 1: KO'd Units**
```typescript
// Unit with 0 HP should heal to full
const koUnit = { ...unit, currentHp: 0 };
const healed = autoHealUnits([koUnit]);
expect(healed[0].currentHp).toBe(calculateMaxHp(healed[0]));
```

### **Edge Case 2: Multiple Status Effects**
```typescript
// Unit with poison + burn should clear both
const afflictedUnit = {
  ...unit,
  statusEffects: [
    { type: 'poison', damagePerTurn: 8, duration: 3 },
    { type: 'burn', damagePerTurn: 10, duration: 2 },
  ],
};
const healed = autoHealUnits([afflictedUnit]);
expect(healed[0].statusEffects).toEqual([]);
```

### **Edge Case 3: No Units (Safety)**
```typescript
const healed = autoHealUnits([]);
expect(healed).toEqual([]);
```

---

## UI/UX CONSIDERATIONS

### **Visual Feedback:**

**Option A: Battle Log Message** (Minimal)
```
"All units restored to full health!"
```

**Option B: Brief Overlay** (Recommended)
```
✨ UNITS RESTORED ✨
(Shows for 1.5 seconds before rewards)
```

**Option C: Unit Card Animations** (Polished)
```
HP bars animate from current → max
Green glow effect on unit cards
Status icons fade out
```

**Recommendation:** Start with Option A (battle log), add Option B if time permits.

---

## FILES TO MODIFY

### **Core Logic:**
1. `apps/vale-v2/src/core/algorithms/healing.ts` (create or extend)
   - Add `autoHealUnits()` function

### **State Management:**
2. `apps/vale-v2/src/ui/state/queueBattleSlice.ts`
   - Add auto-heal to victory flow
   - Add auto-heal to defeat flow

3. `apps/vale-v2/src/ui/state/teamSlice.ts`
   - Add `updateTeamUnits()` method (if doesn't exist)

### **Types:**
4. `apps/vale-v2/src/core/services/types.ts`
   - Add `auto-heal` event type

5. `apps/vale-v2/src/ui/utils/text.ts`
   - Add auto-heal message rendering

### **Tests:**
6. `apps/vale-v2/tests/ui/state/autoHeal.test.ts` (NEW)
   - Victory auto-heal tests
   - Defeat auto-heal tests
   - Integration tests

---

## IMPORTS NEEDED

```typescript
// In queueBattleSlice.ts
import { autoHealUnits } from '@/core/algorithms/healing';
import { calculateMaxHp } from '@/core/models/Unit';
import { updateTeam } from '@/core/models/Team';
import { updateBattleState } from '@/core/models/BattleState';
import type { BattleEvent } from '@/core/services/types';
```

---

## VALIDATION CHECKLIST

Before marking Phase 2 complete:

- [ ] `autoHealUnits()` function exists and is pure
- [ ] Victory flow calls auto-heal
- [ ] Defeat flow calls auto-heal
- [ ] teamSlice persists healed units
- [ ] Battle log shows auto-heal message
- [ ] Auto-heal event type exists
- [ ] Text renderer handles auto-heal
- [ ] All new tests pass
- [ ] No regressions (198/206 tests still passing)
- [ ] TypeScript compiles (pnpm typecheck)
- [ ] Data validation passes (pnpm validate:data)
- [ ] Manual testing: Win battle → check HP bars full
- [ ] Manual testing: Lose battle → check HP bars full

---

## EXPECTED CHANGES

**Files Modified:** 5-6  
**Lines Added:** ~80-100  
**Lines Removed:** ~0-10  
**Net Change:** +70-90 lines

**Test Files Added:** 1  
**Test Cases Added:** 5-7  

---

## SUCCESS CRITERIA

### **Functional:**
✅ After victory: All units full HP, no status  
✅ After defeat: All units full HP, no status  
✅ teamSlice updated with healed units  
✅ Battle log shows "All units restored!"  
✅ No manual healing needed between battles  

### **Technical:**
✅ Pure function (no side effects)  
✅ Immutable updates  
✅ Event sourcing (auto-heal event logged)  
✅ Tests pass  
✅ TypeScript compiles  

### **UX:**
✅ Player knows healing happened (visual feedback)  
✅ Immediate retry after defeat (no backtracking)  
✅ Continuous battle flow (no interruptions)  

---

## ARCHITECTURE COMPLIANCE

**Must Follow:**
- ✅ Pure function in `core/algorithms/` (healing.ts)
- ✅ State updates in slices only
- ✅ Immutable updates (return new objects)
- ✅ Event sourcing (log auto-heal)
- ✅ No side effects in core logic

**Must Not:**
- ❌ Mutate unit objects
- ❌ Update DOM directly
- ❌ Use Math.random()
- ❌ Break save/load (update schema if needed)

---

## ROLLBACK PLAN

If issues arise:

```bash
# Revert changes
git checkout apps/vale-v2/src/ui/state/queueBattleSlice.ts
git checkout apps/vale-v2/src/core/algorithms/healing.ts
# ... other files

# Or revert entire commit
git revert HEAD
```

---

## NEXT PHASE PREVIEW

**After Phase 2:**
- Phase 3: Basic Attack Mana Generation (2 days)
- Phase 4: Predetermined Rewards (2 days)
- Phase 5: Djinn Recovery Timing (1 day)

**Phase 2 is the simplest addition** - just HP restoration logic. Good warm-up for more complex phases!

---

## READY TO IMPLEMENT

**Estimated Time:** 6-8 hours  
**Complexity:** Low  
**Risk:** Low (additive change, doesn't modify existing logic)  
**Value:** High (major UX improvement, aligns with booklet)

**Start with Task 2.1** (create `autoHealUnits()` function), then proceed through tasks 2.2-2.6 sequentially.

Good luck! 🚀

