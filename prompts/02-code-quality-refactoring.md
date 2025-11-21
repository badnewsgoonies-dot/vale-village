# Refactor Battle System for Code Quality

## Context
You are refactoring the battle system in Vale Chronicles V2 to improve code quality, reduce complexity, and improve maintainability. This is a large refactoring that requires careful planning.

## Current State
The battle system has several code quality issues:
1. `executeRound()` is a 120+ line monolith with complexity ~15
2. `BattleState` is a god object with too many responsibilities
3. Magic numbers scattered throughout (4, 0.95, 2.0, etc.)
4. Ability IDs are strings instead of union types

## Architecture Constraints
- Core logic (`src/core/`) must remain React-free
- All models are POJOs with factory functions
- Maintain backward compatibility during refactoring
- All changes must include tests
- Follow existing patterns (Result types, immutability)

## Tasks

### Task 1: Refactor executeRound into Composable Phases
**File:** `src/core/services/QueueBattleService.ts`

**Current Structure:**
```typescript
export function executeRound(state: BattleState, rng: PRNG): ExecutionResult {
  // 120+ lines of interleaved logic
}
```

**Target Structure:**
```typescript
// Split into focused functions
function validateQueue(state: BattleState): void
function executeDjinnPhase(state: BattleState, rng: PRNG): ExecutionResult
function executePlayerActions(state: BattleState, rng: PRNG): ExecutionResult
function executeEnemyActions(state: BattleState, rng: PRNG): ExecutionResult
function checkBattleEnd(state: BattleState): BattleEndResult | null
function transitionToPlanning(state: BattleState): BattleState

export function executeRound(state: BattleState, rng: PRNG): ExecutionResult {
  validateQueue(state);
  let currentState = transitionToExecuting(state);
  const allEvents: BattleEvent[] = [];
  
  // Phase 1: Djinn
  if (currentState.queuedDjinn.length > 0) {
    const djinnResult = executeDjinnPhase(currentState, rng);
    currentState = djinnResult.state;
    allEvents.push(...djinnResult.events);
  }
  
  // Phase 2: Player actions (SPD sorted)
  const playerResult = executePlayerActions(currentState, rng);
  currentState = playerResult.state;
  allEvents.push(...playerResult.events);
  
  // Phase 3: Enemy actions (SPD sorted)
  const enemyResult = executeEnemyActions(currentState, rng);
  currentState = enemyResult.state;
  allEvents.push(...enemyResult.events);
  
  // Phase 4: Battle end check
  const battleEnd = checkBattleEnd(currentState);
  if (battleEnd) {
    currentState = transitionToVictoryOrDefeat(currentState, battleEnd);
    allEvents.push({ type: 'battle-end', result: battleEnd });
  } else {
    currentState = transitionToPlanning(currentState);
  }
  
  return { state: currentState, events: allEvents };
}
```

**Requirements:**
- Each phase function should be independently testable
- Maintain exact same behavior (deterministic)
- Preserve all existing tests
- Add new tests for each phase function

### Task 2: Split BattleState into Focused Interfaces
**File:** `src/core/models/BattleState.ts`

**Current:** Single `BattleState` interface with 20+ fields

**Target:** Split into focused interfaces:
```typescript
export interface BattleTurnOrder {
  turnOrder: readonly string[];
  currentActorIndex: number;
}

export interface BattleQueue {
  currentQueueIndex: number;
  queuedActions: readonly (QueuedAction | null)[];
  queuedDjinn: readonly string[];
  executionIndex: number;
}

export interface BattleStatus {
  phase: BattlePhase;
  status: BattleStatus;
  currentTurn: number;
  roundNumber: number;
}

export interface BattleMetadata {
  isBossBattle?: boolean;
  npcId?: string;
  encounterId?: string;
  meta?: { encounterId: string; difficulty?: string };
}

export interface BattleState {
  playerTeam: Team;
  enemies: readonly Unit[];
  unitById: ReadonlyMap<string, UnitIndex>;
  turnOrder: BattleTurnOrder;
  queue: BattleQueue;
  status: BattleStatus;
  metadata: BattleMetadata;
  log: readonly string[];
  remainingMana: number;
  maxMana: number;
  djinnRecoveryTimers: Record<string, number>;
}
```

**Requirements:**
- Update all call sites (use find/replace carefully)
- Maintain backward compatibility where possible
- Update Zod schema
- Update all tests

### Task 3: Extract Magic Numbers to Constants
**File:** `src/core/constants.ts`

**Extract:**
- `PARTY_SIZE = 4` (replace hard-coded `[null, null, null, null]`)
- `MAX_QUEUE_SIZE = PARTY_SIZE`
- `DEFAULT_ABILITY_ACCURACY = 0.95`
- `CRITICAL_HIT_MULTIPLIER = 2.0`
- `REVIVE_HP_PERCENTAGE = 0.5`
- Any other magic numbers found

**Requirements:**
- Replace all occurrences
- Update tests that use magic numbers
- Document constants with JSDoc

### Task 4: Introduce AbilityId Union Type
**File:** `src/data/types/AbilityId.ts` (new)

**Create:**
```typescript
export type AbilityId =
  | 'attack'
  | 'strike'
  | 'heavy-strike'
  | 'fireball'
  | 'heal'
  // ... all ability IDs from abilities.ts
```

**Update:**
- Replace `abilityId: string` with `abilityId: AbilityId`
- Update all call sites
- Update Zod schema

## Success Criteria
- All tests pass (no regressions)
- Code complexity reduced (executeRound < 50 lines)
- BattleState split into focused interfaces
- All magic numbers extracted to constants
- AbilityId type used throughout
- Code follows existing patterns
- Documentation updated

## Files to Review
- `src/core/services/QueueBattleService.ts`
- `src/core/models/BattleState.ts`
- `src/core/constants.ts`
- `src/data/definitions/abilities.ts`
- `tests/core/services/queue-battle.test.ts`
- All files that reference BattleState or ability IDs

## Recommended Model
**Claude 4.5 Sonnet** (200k context) - **RECOMMENDED** for complex refactoring requiring deep understanding of codebase structure


