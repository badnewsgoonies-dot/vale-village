# PHASE 5: VARIABLE DJINN RECOVERY TIMING

**Date:** November 12, 2025  
**Priority:** MEDIUM  
**Estimated Effort:** 1 day (4-6 hours)  
**Model:** Claude 3.5 Sonnet  
**Prerequisites:** Phases 1-4 complete

---

## CONTEXT

Per the **VALE_CHRONICLES_INSTRUCTION_BOOKLET.md**, Djinn recovery time varies based on how many were activated together.

**From Booklet (Lines 295-308, 406-442):**
```
RECOVERY TIME:
  • 1 Djinn activated: 2 rounds to recover
  • 2 Djinn activated: 3 rounds to recover each
  • 3 Djinn activated: 4 rounds to recover each

Recovery order: First activated returns first
```

**State Flow (from Booklet):**
```
Set → Standby → (recovery countdown) → Set
```

**Note:** The booklet shows **no separate "Recovery" state** - Djinn remain in "Standby" during countdown, then return directly to "Set".

**Current State:**
- `djinnRecoveryTimers: Record<string, number>` exists in `BattleState` but is **unused**
- Current system uses `djinnTrackers.lastActivatedTurn` with round-based calculation (fixed 2 rounds)
- `getDjinnReadyForRecovery()` exists but uses old round-difference logic
- `executeDjinnSummons()` sets Djinn to Standby but **doesn't set recovery timers**
- No code recovers Djinn from Standby → Set when timers expire
- **Dual tracking system:** Both `djinnRecoveryTimers` (BattleState) and `djinnTrackers` (Team) are needed - this is intentional architecture

**Target State:**
- Recovery time = `activationCount + 1` (1→2, 2→3, 3→4)
- Track recovery using `djinnRecoveryTimers` in `BattleState` (numeric countdown)
- Track state using `djinnTrackers` in `Team` (Set/Standby for bonuses)
- Decrement timers each round in `transitionToPlanningPhase()`
- When timer = 0, Djinn returns to Set state (restore bonuses/abilities)
- Independent recovery (can activate others while some recover)

---

## OBJECTIVES

1. ✅ Set recovery timers in `executeDjinnSummons()` based on activation count
2. ✅ Variable recovery timing: 1→2 turns, 2→3 turns, 3→4 turns
3. ✅ Decrement timers in `transitionToPlanningPhase()` each round
4. ✅ Recover Djinn state (Standby → Set) when timer reaches 0
5. ✅ Maintain independence: can activate recovered Djinn while others still recovering
6. ✅ Preserve order: first activated returns first (natural from timer system)

---

## IMPLEMENTATION TASKS

### **Task 5.1: Update Djinn Summon Execution to Set Recovery Timers**

**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts`

**Location:** `executeDjinnSummons()` function (around line 396)

**Current Code:**
```typescript
function executeDjinnSummons(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  const events: BattleEvent[] = [];
  let currentState = state;
  let updatedTeam = state.playerTeam;

  const djinnCount = state.queuedDjinn.length as 1 | 2 | 3;
  const damage = calculateSummonDamage(djinnCount);

  // Update Djinn states to Standby
  const updatedTrackers = { ...updatedTeam.djinnTrackers };
  for (const djinnId of state.queuedDjinn) {
    const tracker = updatedTrackers[djinnId];
    if (tracker) {
      updatedTrackers[djinnId] = {
        ...tracker,
        state: 'Standby',
        lastActivatedTurn: state.roundNumber,
      };
    }
  }

  updatedTeam = updateTeam(updatedTeam, {
    djinnTrackers: updatedTrackers,
  });

  currentState = updateBattleState(currentState, {
    playerTeam: updatedTeam,
  });

  // ... damage application ...

  return { state: currentState, events };
}
```

**Updated Code (Add Recovery Timers):**
```typescript
function executeDjinnSummons(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  const events: BattleEvent[] = [];
  let currentState = state;
  let updatedTeam = state.playerTeam;

  const djinnCount = state.queuedDjinn.length as 1 | 2 | 3;
  const damage = calculateSummonDamage(djinnCount);

  // Calculate recovery time
  const activationCount = state.queuedDjinn.length;
  const recoveryTime = activationCount + 1; // 1→2, 2→3, 3→4

  // Update Djinn states to Standby
  const updatedTrackers = { ...updatedTeam.djinnTrackers };
  for (const djinnId of state.queuedDjinn) {
    const tracker = updatedTrackers[djinnId];
    if (tracker) {
      updatedTrackers[djinnId] = {
        ...tracker,
        state: 'Standby',
        lastActivatedTurn: state.roundNumber,
      };
    }
  }

  updatedTeam = updateTeam(updatedTeam, {
    djinnTrackers: updatedTrackers,
  });

  // Set recovery timers
  const newRecoveryTimers = { ...state.djinnRecoveryTimers };
  for (const djinnId of state.queuedDjinn) {
    newRecoveryTimers[djinnId] = recoveryTime;
  }

  currentState = updateBattleState(currentState, {
    playerTeam: updatedTeam,
    djinnRecoveryTimers: newRecoveryTimers,
  });

  // Optionally log activation event
  if (state.queuedDjinn.length > 0) {
    events.push({
      type: 'djinn-activated',
      djinnIds: [...state.queuedDjinn],
      recoveryTime,
    });
  }

  // ... damage application ...

  return { state: currentState, events };
}
```

**Success Criteria:**
- Recovery = activation count + 1
- Timers stored in `djinnRecoveryTimers`
- `djinnTrackers` state updated to Standby

---

### **Task 5.2: Decrement Recovery Timers and Restore State**

**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts`

**Current Code:**
```typescript
function transitionToPlanningPhase(state: BattleState): BattleState {
  const nextState = updateBattleState(state, {
    phase: 'planning',
    roundNumber: state.roundNumber + 1,
    currentQueueIndex: 0,
    queuedActions: createEmptyQueue(),
    queuedDjinn: [],
    executionIndex: 0,
  });
  return refreshMana(nextState);
}
```

**Updated Code:**
```typescript
function transitionToPlanningPhase(state: BattleState): BattleState {
  const updatedTimers = { ...state.djinnRecoveryTimers };
  const updatedTrackers = { ...state.playerTeam.djinnTrackers };

  for (const [djinnId, timer] of Object.entries(updatedTimers)) {
    if (timer > 0) {
      updatedTimers[djinnId] = timer - 1;
      if (updatedTimers[djinnId] === 0) {
        delete updatedTimers[djinnId];
        const tracker = updatedTrackers[djinnId];
        if (tracker) {
          updatedTrackers[djinnId] = { ...tracker, state: 'Set' };
          events.push({ type: 'djinn-recovered', djinnId });
        }
      }
    } else {
      delete updatedTimers[djinnId];
    }
  }

  const updatedTeam = updateTeam(state.playerTeam, { djinnTrackers: updatedTrackers });

  const nextState = updateBattleState(state, {
    phase: 'planning',
    roundNumber: state.roundNumber + 1,
    currentQueueIndex: 0,
    queuedActions: createEmptyQueue(),
    queuedDjinn: [],
    executionIndex: 0,
    playerTeam: updatedTeam,
    djinnRecoveryTimers: updatedTimers,
  });

  return refreshMana(nextState);
}
```

**Success Criteria:**
- Timers decrement each round
- Timer reaching zero removes entry and sets tracker to Set
- Recovery event optionally emitted

---

### **Task 5.3: Optional Djinn Events**

Add `djinn-activated`/`djinn-recovered` to `apps/vale-v2/src/core/services/types.ts` and render them in `text.ts` for player feedback.

---

### **Task 5.4: Clean up Old Logic**

Remove or document `getDjinnReadyForRecovery()` from `djinn.ts` since timers now handle recovery.

---

### **Task 5.5: Document Recovery State**

Clarify in `Team.ts` that the `Recovery` value is currently unused (Set ↔ Standby only).

---

### **Task 5.6: Optional UI**

Display `djinnRecoveryTimers` countdown on Djinn cards/bar if time allows.

---

## TESTING REQUIREMENTS

- include new djinn recovery tests (single, double, triple, independent, mixed strategies)
- ensure existing suites still pass

---

## READY TO IMPLEMENT

Follow tasks sequentially; Phase 5 should be quick (<6 hours).  
`recoveryTime = activationCount + 1` is the rule to remember.
