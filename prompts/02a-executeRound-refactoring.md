# Complete System 2 Task 1: Refactor executeRound into Composable Phases

## Context
You are completing the final task of System 2 Code Quality Refactoring. Tasks 2, 3, and 4 are already complete. Only Task 1 remains: refactoring `executeRound()` from a 130-line monolith into composable phases.

## Current State
- **File:** `src/core/services/QueueBattleService.ts`
- **Function:** `executeRound()` (lines 176-303, ~130 lines)
- **Complexity:** ~12-15 cyclomatic complexity
- **Status:** Monolithic function with interleaved logic

## What's Already Done
- ✅ Task 2: BattleState split into interfaces (BattleTurnOrder, BattleQueue, BattleProgress, BattleMetadata)
- ✅ Task 3: Magic numbers extracted to constants.ts
- ✅ Task 4: AbilityId union type created

## Task: Refactor executeRound into Composable Phases

### Current Structure (lines 176-303)
```ts
export function executeRound(state: BattleState, rng: PRNG): { state: BattleState; events: readonly BattleEvent[] } {  
  // Validation (lines 180-192)  
  // Phase transition (lines 194-197)  
  // Djinn execution (lines 201-206)  
  // Player actions loop (lines 208-246)  
  // Enemy actions loop (lines 248-273)  
  // Battle end check (lines 275-297)
}
```

### Target Structure
Split into these internal helper functions (not exported):
```ts
/**
 * Validate queue is ready for execution
 * Throws if validation fails
 */
function validateQueueForExecution(state: BattleState): void {
  if (state.phase !== 'planning') {
    throw new Error('Can only execute round from planning phase');
  }
  if (!isQueueComplete(state.queuedActions)) {
    throw new Error('Cannot execute: queue is not complete');
  }
  if (!validateQueuedActions(state.remainingMana, state.queuedActions)) {
    throw new Error('Cannot execute: actions exceed mana budget');
  }
}

/**
 * Transition battle state to executing phase
 */
function transitionToExecutingPhase(state: BattleState): BattleState {
  return updateBattleState(state, {
    phase: 'executing',
    executionIndex: 0,
  });
}

/**
 * Execute player actions phase
 * Processes all queued player actions in SPD order
 */
function executePlayerActionsPhase(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  const playerActions = state.queuedActions.filter((a): a is QueuedAction => a !== null);
  const sortedPlayerActions = sortActionsBySPD(playerActions, state.playerTeam, state.enemies);

  let currentState = state;
  const events: BattleEvent[] = [];

  for (const action of sortedPlayerActions) {
    const actor = currentState.playerTeam.units.find(u => u.id === action.unitId);
    if (!actor || isUnitKO(actor)) {
      events.push({
        type: 'ability',
        casterId: action.unitId,
        abilityId: action.abilityId || 'strike',
        targets: action.targetIds,
      });
      events.push({
        type: 'miss',
        targetId: action.targetIds[0] || '',
      });
      continue;
    }
    const validTargets = resolveValidTargets(action, currentState);
    if (validTargets.length === 0) {
      continue;
    }
    const actionResult = performAction(
      currentState,
      action.unitId,
      action.abilityId || 'strike',
      validTargets,
      rng
    );
    currentState = actionResult.state;
    events.push(...actionResult.events);
  }

  return { state: currentState, events };
}

/**
 * Execute enemy actions phase
 * Generates and processes all enemy actions in SPD order
 */
function executeEnemyActionsPhase(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  const enemyActions = generateEnemyActions(state, rng);
  const sortedEnemyActions = sortActionsBySPD(enemyActions, state.playerTeam, state.enemies);

  let currentState = state;
  const events: BattleEvent[] = [];

  for (const action of sortedEnemyActions) {
    const actor = currentState.enemies.find(u => u.id === action.unitId);
    if (!actor || isUnitKO(actor)) {
      continue;
    }
    const validTargets = resolveValidTargets(action, currentState);
    if (validTargets.length === 0) {
      continue;
    }
    const actionResult = performAction(
      currentState,
      action.unitId,
      action.abilityId || 'strike',
      validTargets,
      rng
    );
    currentState = actionResult.state;
    events.push(...actionResult.events);
  }

  return { state: currentState, events };
}

/**
 * Check if battle has ended (victory or defeat)
 * Returns battle result or null if battle continues
 */
function checkBattleEndPhase(state: BattleState): 'PLAYER_VICTORY' | 'PLAYER_DEFEAT' | null {
  return checkBattleEnd(state);
}

/**
 * Transition to victory or defeat phase
 */
function transitionToVictoryOrDefeat(
  state: BattleState,
  result: 'PLAYER_VICTORY' | 'PLAYER_DEFEAT'
): BattleState {
  return updateBattleState(state, {
    phase: result === 'PLAYER_VICTORY' ? 'victory' : 'defeat',
    status: result,
  });
}

/**
 * Transition back to planning phase for next round
 */
function transitionToPlanningPhase(state: BattleState): BattleState {
  let newState = updateBattleState(state, {
    phase: 'planning',
    roundNumber: state.roundNumber + 1,
    currentQueueIndex: 0,
    queuedActions: createEmptyQueue(),
    queuedDjinn: [],
    executionIndex: 0,
  });
  return refreshMana(newState);
}

/**
 * Execute a complete round
 * PR-QUEUE-BATTLE: Executes Djinn → player actions (SPD order) → enemy actions
 *
 * @param state - Current battle state
 * @param rng - PRNG instance
 * @returns Updated battle state and events
 */
export function executeRound(
  state: BattleState,
  rng: PRNG
): { state: BattleState; events: readonly BattleEvent[] } {
  // Validate queue is ready
  validateQueueForExecution(state);

  // Transition to executing phase
  let currentState = transitionToExecutingPhase(state);
  const allEvents: BattleEvent[] = [];

  // Phase 1: Execute Djinn summons (if any)
  if (currentState.queuedDjinn.length > 0) {
    const djinnResult = executeDjinnSummons(currentState, rng);
    currentState = djinnResult.state;
    allEvents.push(...djinnResult.events);
  }

  // Phase 2: Execute player actions (SPD sorted)
  const playerResult = executePlayerActionsPhase(currentState, rng);
  currentState = playerResult.state;
  allEvents.push(...playerResult.events);

  // Phase 3: Execute enemy actions (SPD sorted)
  const enemyResult = executeEnemyActionsPhase(currentState, rng);
  currentState = enemyResult.state;
  allEvents.push(...enemyResult.events);

  // Phase 4: Check battle end
  const battleEnd = checkBattleEndPhase(currentState);
  if (battleEnd) {
    currentState = transitionToVictoryOrDefeat(currentState, battleEnd);
    allEvents.push({
      type: 'battle-end',
      result: battleEnd,
    });
  } else {
    currentState = transitionToPlanningPhase(currentState);
  }

  return {
    state: currentState,
    events: allEvents,
  };
}
```

## Requirements
1. **Maintain Exact Behavior:**
   - Same validation logic
   - Same execution order (Djinn → Player → Enemy)
   - Same event generation
   - Same state transitions
   - Deterministic (same seed = same result)
2. **Code Quality:**
   - Each phase function < 60 lines
   - Clear separation of concerns
   - Each function independently testable
   - JSDoc comments for each function
3. **Testing:**
   - All existing tests must pass (no regressions)
   - Add tests for each phase function:
     - `validateQueueForExecution.test.ts`
     - `executePlayerActionsPhase.test.ts`
     - `executeEnemyActionsPhase.test.ts`
     - `checkBattleEndPhase.test.ts`
     - `transitionToPlanningPhase.test.ts`
4. **Dependencies:**
   - Use existing helper functions: `executeDjinnSummons()`, `sortActionsBySPD()`, `resolveValidTargets()`, `performAction()`, `generateEnemyActions()`, `checkBattleEnd()`, `refreshMana()`
   - Use existing constants: `createEmptyQueue()`
   - Use existing types: `BattleState`, `BattleEvent`, `PRNG`, `QueuedAction`

## Success Criteria
- ✅ `executeRound()` reduced from ~130 lines to ~50 lines
- ✅ Each phase function < 60 lines
- ✅ All existing tests pass
- ✅ New phase tests added
- ✅ No behavioral changes (deterministic tests pass)
- ✅ Code complexity reduced (cyclomatic complexity < 8)

## Files to Modify
- `src/core/services/QueueBattleService.ts` - Refactor executeRound
- `tests/core/services/queue-battle.test.ts` - Add phase tests

## Testing Commands
# After refactoring, run these:
pnpm test tests/core/services/queue-battle.test.ts
pnpm test tests/battle/invariants.test.ts
pnpm test tests/battle/golden/
pnpm typecheck

## Reference
- See `prompts/SYSTEM_02_REFACTORING_PLAN.md` for detailed plan
- See `prompts/SYSTEM_02_QUICK_REFERENCE.md` for quick lookup
- Current implementation: `src/core/services/QueueBattleService.ts:176-303`
