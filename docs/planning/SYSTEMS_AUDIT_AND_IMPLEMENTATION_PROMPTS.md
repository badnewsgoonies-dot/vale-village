# Systems Audit & Implementation Prompts

**Date:** 2025-01-27  
**Purpose:** Comprehensive audit of systems needing implementation, with detailed prompts for Claude AI assistants

---

## Executive Summary

**Total Systems Identified:** 6 major categories  
**Priority Breakdown:**
- 🔴 **Critical:** 2 systems (Bug fixes, Code quality)
- 🟠 **High:** 2 systems (Error handling, Overworld integration)
- 🟡 **Medium:** 2 systems (Console cleanup, TODO resolution)

**Recommended AI Model:**
- **Claude 4.5 Sonnet** (200k context) - Best for complex refactoring (XL/L effort)
- **Claude 3.5 Sonnet** (200k context) - Sufficient for smaller tasks (S/M effort)

---

## System 1: Critical Bug Fixes 🔴

### Priority: CRITICAL
### Effort: M (4-6 hours)
### Model: Claude 3.5 Sonnet

### Issues to Fix:

1. **HP Validation Bugs**
   - Negative HP allowed (can set HP < 0)
   - Overheal allowed (HP can exceed maxHP)
   - Dead units can be healed without `revivesFallen` flag

2. **Healing Logic Bugs**
   - Negative healing values damage units
   - Healing doesn't check if unit is KO'd

3. **RNG Negative Seeds**
   - PRNG accepts negative seeds and returns negative values

4. **Djinn Duplicate Equip**
   - Same Djinn can be equipped twice on team

5. **Equipment Missing statBonus**
   - Crashes with malformed equipment data

### Implementation Prompt:

```
# Fix Critical Bugs in Vale Chronicles V2

## Context
You are working on Vale Chronicles V2, a Golden Sun-inspired tactical RPG built with clean architecture. The codebase uses TypeScript, React, Zustand, and follows strict architectural boundaries.

## Current State
The game has several critical bugs that need immediate fixing:
1. HP can be set to negative values or exceed maxHP
2. Dead units can be healed without proper checks
3. Negative healing values cause damage instead of being rejected
4. PRNG accepts negative seeds and returns negative values
5. Duplicate Djinn can be equipped on the same team
6. Equipment validation crashes on missing statBonus

## Architecture Constraints
- Core logic (`src/core/`) must remain React-free
- All models are POJOs with factory functions (no classes)
- Use Result types for error handling where appropriate
- Follow existing patterns in the codebase
- All changes must include tests

## Tasks

### Task 1: Fix HP Validation
**File:** `src/core/models/Unit.ts`
- Add validation in `applyDamage()` to clamp HP to [0, maxHP]
- Add validation in `applyHealing()` to:
  - Reject negative healing values (return error)
  - Check if unit is KO'd and ability doesn't have `revivesFallen`
  - Clamp healing to maxHP (prevent overheal)
- Update `createUnit()` to ensure initial HP is valid

**Test Requirements:**
- Test negative HP is clamped to 0
- Test overheal is clamped to maxHP
- Test healing KO'd unit without revivesFallen returns error
- Test negative healing value is rejected

### Task 2: Fix PRNG Negative Seeds
**File:** `src/core/random/prng.ts`
- Validate seed is non-negative in constructor
- Throw error or convert negative seeds to positive (document decision)
- Ensure `next()` always returns [0, 1)

**Test Requirements:**
- Test negative seed is rejected or converted
- Test all PRNG methods return valid ranges

### Task 3: Fix Duplicate Djinn Equip
**File:** `src/core/models/Team.ts`
- Add validation in Djinn equip function to check for duplicates
- Return Result type with error if duplicate detected

**Test Requirements:**
- Test equipping same Djinn twice returns error
- Test equipping different Djinn works normally

### Task 4: Fix Equipment Validation
**File:** `src/data/schemas/EquipmentSchema.ts`
- Ensure statBonus is required or has default empty object
- Add validation to prevent crashes on malformed data

**Test Requirements:**
- Test equipment with missing statBonus doesn't crash
- Test validation catches malformed equipment

## Success Criteria
- All bugs fixed with proper validation
- All tests pass
- No regressions in existing functionality
- Code follows existing patterns and conventions
- All error cases return Result types or throw appropriately

## Files to Review
- `src/core/models/Unit.ts`
- `src/core/models/Team.ts`
- `src/core/random/prng.ts`
- `src/data/schemas/EquipmentSchema.ts`
- `tests/core/models/Unit.test.ts`
- `tests/core/random/prng.test.ts`
```

---

## System 2: Code Quality Refactoring 🔴

### Priority: HIGH (Technical Debt)
### Effort: XL (2-4 days)
### Model: **Claude 4.5 Sonnet** (recommended for complex refactoring)

### Issues to Fix:

1. **executeRound Monolith** (120+ lines, complexity ~15)
   - Split into composable phases
   - Extract validation, Djinn execution, player actions, enemy actions

2. **BattleState God Object**
   - Split into focused interfaces
   - Extract `BattleTurnOrder`, `BattleQueue`, `BattleStatus`, `BattleMetadata`

3. **Magic Numbers**
   - Extract constants (PARTY_SIZE, DEFAULT_ABILITY_ACCURACY, etc.)

4. **Stringly-Typed Ability IDs**
   - Create `AbilityId` union type

### Implementation Prompt:

```
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
```

---

## System 3: Error Handling & Edge Cases 🟠

### Priority: HIGH
### Effort: M (1 day)
### Model: Claude 3.5 Sonnet

### Issues to Fix:

1. **React Error Boundary Missing**
2. **Result Types Not Used Consistently**
3. **AI Decision Failures Not Handled**
4. **Action Queue Edge Cases**

### Implementation Prompt:

```
# Improve Error Handling & Edge Cases

## Context
Improve error handling throughout Vale Chronicles V2 to prevent crashes and provide better error recovery.

## Current State
- No React error boundary (crashes show blank screen)
- Some functions don't use Result types consistently
- AI decision failures can crash battle rounds
- Edge cases in action queue not handled

## Tasks

### Task 1: Add React Error Boundary
**File:** `src/ui/components/GameErrorBoundary.tsx` (exists but needs enhancement)

**Requirements:**
- Catch all React errors
- Display user-friendly error message
- Log error details
- Provide "Reload Game" button
- Wrap App component in ErrorBoundary

### Task 2: Convert queueAction to Result Type
**File:** `src/ui/state/queueBattleSlice.ts`

**Current:** Throws errors or uses console.error

**Target:** Return Result type:
```typescript
type QueueActionResult = Result<void, QueueActionError>;
```

**Error Types:**
- Invalid unit index
- Invalid ability ID
- Insufficient mana
- Invalid targets

### Task 3: Handle AI Decision Failures
**File:** `src/core/services/QueueBattleService.ts`

**Current:** AI failures can crash round execution

**Target:** Fallback to basic attack if AI decision fails:
```typescript
try {
  const decision = generateEnemyAction(enemy, state, rng);
} catch (error) {
  console.warn(`AI decision failed for ${enemy.id}, using basic attack`);
  // Fallback to basic attack
}
```

### Task 4: Fix Action Queue Edge Cases
**File:** `src/ui/components/ActionQueuePanel.tsx`

**Issues:**
- `ABILITIES.find()` can return undefined (crashes)
- Simultaneous wipe-out logic incorrect
- Retargeting doesn't preserve target type

**Fix:**
- Add null checks for ABILITIES.find()
- Fix victory condition logic
- Preserve target type during retargeting

## Success Criteria
- Error boundary catches all React errors
- All queue actions return Result types
- AI failures don't crash battles
- Edge cases handled gracefully
- All tests pass

## Files to Review
- `src/ui/components/GameErrorBoundary.tsx`
- `src/ui/state/queueBattleSlice.ts`
- `src/core/services/QueueBattleService.ts`
- `src/ui/components/ActionQueuePanel.tsx`
```

---

## System 4: Overworld Integration Completion 🟠

### Priority: HIGH
### Effort: L (1-2 days)
### Model: Claude 3.5 Sonnet

### Current State:
- OverworldMap component exists
- Basic movement works
- Triggers exist but not fully integrated
- Battle transitions not seamless

### Implementation Prompt:

```
# Complete Overworld Integration

## Context
Complete the overworld system integration to enable seamless transitions between overworld exploration and battles.

## Current State
- OverworldMap component exists with basic movement
- Battle system is complete
- Triggers exist but integration is incomplete
- Battle transitions are not seamless

## Tasks

### Task 1: Complete Battle Transition Flow
**Files:**
- `src/ui/state/gameFlowSlice.ts`
- `src/ui/components/OverworldMap.tsx`

**Requirements:**
- When encounter trigger fires, transition to battle mode
- Store overworld state (map, position) for return
- After battle victory, return to overworld at same position
- After battle defeat, return to last save point or inn

### Task 2: Implement Encounter Triggers
**File:** `src/core/services/EncounterService.ts`

**Requirements:**
- Random encounters based on map difficulty
- Fixed encounters at specific positions
- Boss encounters at story points
- Encounter rate configurable per map

### Task 3: Add Overworld State Persistence
**File:** `src/ui/state/overworldSlice.ts`

**Requirements:**
- Save current map ID
- Save player position
- Save visited maps
- Restore on game load

### Task 4: Enhance OverworldMap UI
**File:** `src/ui/components/OverworldMap.tsx`

**Requirements:**
- Display current map name
- Show minimap (optional)
- Display encounter rate indicator
- Show save points
- Show NPCs with interaction indicators

## Success Criteria
- Seamless battle transitions
- Overworld state persists
- Encounter system works correctly
- All tests pass
- No regressions in battle system

## Files to Review
- `src/ui/components/OverworldMap.tsx`
- `src/ui/state/overworldSlice.ts`
- `src/core/services/EncounterService.ts`
- `src/ui/state/gameFlowSlice.ts`
- `src/data/definitions/maps.ts`
```

---

## System 5: Console Log Cleanup 🟡

### Priority: MEDIUM
### Effort: S (2-4 hours)
### Model: Claude 3.5 Sonnet

### Current State:
- 45 console statements found
- Most are console.error/warn (allowed)
- Some console.log may need cleanup
- ESLint rule: no console.log, only warn/error allowed

### Implementation Prompt:

```
# Clean Up Console Statements

## Context
Review and clean up console statements according to project rules: only console.warn and console.error are allowed, no console.log.

## Current State
- 45 console statements found across codebase
- Most are console.error/warn (allowed)
- Some may be console.log (needs removal)
- Some console.warn may need to be converted to proper error handling

## Tasks

### Task 1: Audit All Console Statements
**Action:** Review all console statements in `src/`

**Rules:**
- ✅ `console.error()` - Allowed for errors
- ✅ `console.warn()` - Allowed for warnings
- ❌ `console.log()` - Must be removed
- ❌ `console.debug()` - Must be removed

### Task 2: Remove console.log Statements
**Action:** Remove all console.log statements

**Options:**
- Delete if debug-only
- Convert to console.warn if important
- Convert to proper error handling if error case

### Task 3: Review console.warn Usage
**Action:** Review each console.warn

**Questions:**
- Should this be proper error handling instead?
- Is this warning actionable?
- Should this be logged to error tracking service?

**Keep if:**
- User-actionable warnings
- Data validation warnings
- Fallback behavior notifications

**Convert to error handling if:**
- Represents actual error condition
- Should be caught and handled
- User shouldn't see technical details

### Task 4: Ensure Consistency
**Action:** Ensure all error logging follows patterns

**Pattern:**
```typescript
// Good
console.error('Failed to save game:', error);
return Result.err(error);

// Bad
console.log('Saving game...');
console.error('Error:', error);
```

## Success Criteria
- No console.log statements remain
- All console.warn are appropriate
- Error handling improved where needed
- ESLint passes (no console.log violations)

## Files to Review
- All files with console statements (45 found)
- `.eslintrc` (verify rules)
```

---

## System 6: TODO Resolution 🟡

### Priority: MEDIUM
### Effort: S-M (varies per TODO)
### Model: Claude 3.5 Sonnet

### Current State:
- 17 TODO comments found
- Some are critical (save hydration, mana migration)
- Some are deferred (future features)

### Implementation Prompt:

```
# Resolve TODO Comments

## Context
Review and resolve TODO comments throughout the codebase. Some are critical, some can be deferred with documentation.

## Current State
17 TODO comments found:
1. `saveSlice.ts:130` - "Hydrate team and battle from save data" (CRITICAL)
2. `saveSlice.ts:210` - "Hydrate all state from save data" (CRITICAL)
3. `UnitCard.tsx:24` - "Migrate PP to team mana" (HIGH)
4. `ActionBar.tsx:47` - "Migrate PP to team mana" (HIGH)
5. `SaveService.ts:246` - "Add chapter to SaveV1Schema" (MEDIUM)
6. `EncounterService.ts:78` - "Make this data-driven via chapter definitions" (MEDIUM)
7. `SaveService.ts:103` - "Create separate ReplayPort interface" (LOW)
8. `AIService.ts:65` - "Pass team to scoreAbility for accurate effective stats" (MEDIUM)
9. `encounters.ts:62` - "Add this ability later" (DEFERRED)
10. `stats.ts:49` - "Replace with proper Djinn registry" (MEDIUM)
11. Plus 6 more in saveSlice.ts (tracking flags, stats, playtime)

## Tasks

### Task 1: Implement Critical TODOs
**Priority:** CRITICAL

1. **Save Hydration** (`saveSlice.ts:130, 210`)
   - Implement `hydrateFromSave()` function
   - Restore team, battle, story, inventory from save
   - Test save/load cycle

2. **Mana Migration** (`UnitCard.tsx:24`, `ActionBar.tsx:47`)
   - Remove PP-based checks
   - Use team mana everywhere
   - Update UI components

### Task 2: Implement High Priority TODOs
**Priority:** HIGH

3. **Chapter in Save Schema** (`SaveService.ts:246`)
   - Add chapter field to SaveV1Schema
   - Update save/load logic
   - Test migration

### Task 3: Document Deferred TODOs
**Priority:** MEDIUM-LOW

5. **Data-Driven Encounters** (`EncounterService.ts:78`)
   - Document why it's deferred
   - Create issue/plan for future

6. **ReplayPort Interface** (`SaveService.ts:103`)
   - Document current approach
   - Plan future refactoring

7. **Djinn Registry** (`stats.ts:49`)
   - Document current approach
   - Plan future refactoring

### Task 4: Remove or Implement Remaining TODOs
**Action:** Review each TODO

**Options:**
- Implement if straightforward
- Convert to GitHub issue if complex
- Remove if obsolete
- Document if deferred

## Success Criteria
- All critical TODOs implemented
- High priority TODOs implemented or documented
- Deferred TODOs documented with rationale
- No obsolete TODOs remain
- Code quality improved

## Files to Review
- All files with TODO comments (17 found)
- `src/ui/state/saveSlice.ts`
- `src/ui/components/UnitCard.tsx`
- `src/ui/components/ActionBar.tsx`
- `src/core/services/SaveService.ts`
```

---

## Implementation Order Recommendation

### Phase 1: Critical Fixes (Week 1)
1. **System 1: Critical Bug Fixes** (M - 4-6 hours)
2. **System 3: Error Handling** (M - 1 day)

### Phase 2: Code Quality (Week 2-3)
3. **System 2: Code Quality Refactoring** (XL - 2-4 days)

### Phase 3: Integration & Polish (Week 4)
4. **System 4: Overworld Integration** (L - 1-2 days)
5. **System 6: TODO Resolution** (S-M - varies)
6. **System 5: Console Cleanup** (S - 2-4 hours)

---

## Model Selection Guide

### Use Claude 4.5 Sonnet for:
- System 2 (Code Quality Refactoring) - Complex refactoring, large context needed
- Any XL/L effort tasks requiring deep understanding

### Use Claude 3.5 Sonnet for:
- System 1 (Bug Fixes) - Straightforward fixes
- System 3 (Error Handling) - Pattern-based improvements
- System 4 (Overworld Integration) - Integration work
- System 5 (Console Cleanup) - Simple cleanup
- System 6 (TODO Resolution) - Mixed complexity

---

## Success Metrics

After implementation:
- ✅ All critical bugs fixed
- ✅ Code complexity reduced (executeRound < 50 lines)
- ✅ Error handling improved (error boundary, Result types)
- ✅ Overworld integration complete
- ✅ All TODOs resolved or documented
- ✅ Console statements cleaned up
- ✅ All tests passing
- ✅ No regressions

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-27


