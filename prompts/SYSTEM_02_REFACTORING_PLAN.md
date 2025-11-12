# System 2: Code Quality Refactoring - Implementation Plan

**Project:** Vale Chronicles V2
**System:** Battle System Code Quality Refactor
**Created:** 2025-11-11
**Status:** Planning Phase

---

## Executive Summary

This document provides a comprehensive implementation plan for refactoring the battle system to improve code quality, reduce complexity, and enhance maintainability. The refactor focuses on four key areas:

1. **Decompose `executeRound()`** - Break 120+ line monolith into composable phases
2. **Split `BattleState`** - Decompose god object into focused interfaces
3. **Extract Magic Numbers** - Centralize remaining magic numbers to constants
4. **Type-Safe Ability IDs** - Replace `string` with union type for compile-time safety

**Estimated Effort:** 8-12 hours
**Risk Level:** Medium (high test coverage mitigates risk)
**Dependencies:** None (self-contained refactor)

---

## Current State Analysis

### File: `QueueBattleService.ts` (559 lines)

**Function:** `executeRound()` (lines 176-303, ~130 lines)

**Complexity Metrics:**
- Lines: 130
- Cyclomatic Complexity: ~12-15
- Responsibility Count: 6 (validation, phase transitions, djinn, player actions, enemy actions, battle end)
- Test Coverage: High (queue-battle.test.ts)

**Issues:**
- Mixed concerns (validation, execution, state transitions)
- Hard to test phases in isolation
- Difficult to understand control flow
- Repeated patterns (action execution loops)

**Strengths:**
- Already uses helper functions (executeDjinnSummons, sortActionsBySPD, etc.)
- Deterministic with PRNG
- Good event tracking

### File: `BattleState.ts` (221 lines)

**Interface:** `BattleState` (lines 55-133, 25+ fields)

**Responsibility Count:** 7 distinct concerns
1. Units/Teams (playerTeam, enemies, unitById)
2. Turn Order (turnOrder, currentActorIndex)
3. Queue System (currentQueueIndex, queuedActions, queuedDjinn, executionIndex)
4. Mana Management (remainingMana, maxMana)
5. Battle Status (phase, status, roundNumber, currentTurn)
6. Metadata (isBossBattle, npcId, encounterId, meta)
7. UI State (log)

**Issues:**
- God object anti-pattern
- Difficult to understand at a glance
- Some deprecated fields (encounterId vs meta.encounterId)
- Mixed levels of abstraction

**Strengths:**
- Good helper functions (buildUnitIndex, updateBattleState)
- Immutable updates via factory pattern
- Performance optimization (unitById index)

### File: `constants.ts` (84 lines)

**Status:** ✅ Most work already done!

**Already Extracted:**
- `PARTY_SIZE = 4`
- `MAX_QUEUE_SIZE = PARTY_SIZE`
- `BATTLE_CONSTANTS.DEFAULT_ABILITY_ACCURACY = 0.95`
- `BATTLE_CONSTANTS.CRITICAL_HIT_MULTIPLIER = 2.0`
- `BATTLE_CONSTANTS.REVIVE_HP_PERCENTAGE = 0.5`

**Remaining Issues:**
- Magic numbers still exist in other files (need audit)
- Constants not consistently imported across codebase

### File: `abilities.ts` (418 lines)

**Current Type:** `abilityId: string | null`

**Ability Count:** 18 abilities defined
- Physical: strike, heavy-strike, guard-break, precise-jab, poison-strike
- Psynergy: fireball, ice-shard, quake, gust, chain-lightning, burn-touch, freeze-blast, paralyze-shock
- Healing: heal, party-heal
- Buffs: boost-atk, boost-def
- Debuffs: weaken-def, blind

**Files Using `abilityId: string`:** 19 files
- Core: BattleService, QueueBattleService, AIService, mana.ts, types.ts
- UI: queueBattleSlice, battleSlice, QueueBattleView, ActionBar, ActionQueuePanel
- Tests: queue-battle.test.ts, Progression.test.ts
- Models: BattleState

**Risk:** High impact (19 files), but TypeScript will catch all errors

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                     Task Execution Order                     │
└─────────────────────────────────────────────────────────────┘

Task 3: Extract Magic Numbers (INDEPENDENT)
    ↓
    │ (Can run in parallel with Task 4)
    ↓
Task 4: Introduce AbilityId Union Type (INDEPENDENT)
    ↓
    │ (Must complete before Task 1 & 2)
    ↓
Task 1: Refactor executeRound() ←──────┐
    ↓                                   │
    │ (Can run in parallel)             │ (Share test updates)
    ↓                                   │
Task 2: Split BattleState ─────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Dependency Details                        │
└─────────────────────────────────────────────────────────────┘

Task 3 (Magic Numbers)
  ├─ Blocks: None
  ├─ Enables: Better readability for Task 1 & 2
  └─ Risk: Low (additive change)

Task 4 (AbilityId Type)
  ├─ Blocks: Task 1 (type signatures)
  ├─ Enables: Compile-time safety for refactor
  └─ Risk: Medium (19 files affected, but TS catches all errors)

Task 1 (executeRound decomposition)
  ├─ Depends: Task 4 (optional, but recommended)
  ├─ Affects: QueueBattleService.ts, tests
  └─ Risk: Medium (complex logic, high test coverage)

Task 2 (BattleState split)
  ├─ Depends: None (can run parallel with Task 1)
  ├─ Affects: 20+ files importing BattleState
  └─ Risk: High (widespread changes, but mechanical)

```

---

## Risk Assessment

### Overall Risk: MEDIUM

Risk mitigated by:
- ✅ High test coverage (queue-battle.test.ts, invariants.test.ts, golden tests)
- ✅ TypeScript compile-time safety
- ✅ Deterministic PRNG (can reproduce any failure)
- ✅ Clear rollback path (git)

### Risk Breakdown by Task

#### Task 1: Refactor `executeRound()` - MEDIUM RISK

**Risk Factors:**
- Complex control flow with 4 phases
- Deterministic behavior must be preserved
- Event ordering must be exact

**Mitigation:**
- ✅ Extract phases one at a time
- ✅ Run tests after each extraction
- ✅ Use existing helper functions as blueprint
- ✅ Keep original function as reference until done
- ✅ Property-based tests catch regressions

**Rollback Plan:**
- Single file change (QueueBattleService.ts)
- Easy to revert via git
- Tests will catch any behavioral changes

#### Task 2: Split `BattleState` - HIGH RISK (but mechanical)

**Risk Factors:**
- 20+ files import BattleState
- Widespread mechanical changes
- Easy to miss a call site

**Mitigation:**
- ✅ TypeScript will catch ALL missed call sites
- ✅ Use find/replace with regex for mechanical changes
- ✅ Run `pnpm typecheck` after each sub-interface
- ✅ Tests ensure behavior unchanged

**Rollback Plan:**
- More complex (multiple files)
- Use git branches for easy revert
- Incremental approach (one sub-interface at a time)

#### Task 3: Extract Magic Numbers - LOW RISK

**Risk Factors:**
- Easy to miss scattered magic numbers

**Mitigation:**
- ✅ Grep for numeric literals
- ✅ Constants already defined (just need to import)
- ✅ Tests ensure values unchanged

**Rollback Plan:**
- Simple revert if issues found
- Additive change (doesn't break existing code)

#### Task 4: Introduce `AbilityId` Type - MEDIUM RISK

**Risk Factors:**
- 19 files affected
- String → union type migration

**Mitigation:**
- ✅ TypeScript catches all errors at compile time
- ✅ Union type includes all existing IDs (no runtime breaks)
- ✅ `null` case already handled (basic attack)

**Rollback Plan:**
- Single type definition file
- Easy to revert type alias
- No runtime behavior changes

---

## Detailed Task Breakdown

### Task 1: Refactor `executeRound()` into Composable Phases

**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts`

**Current Structure:**
```typescript
export function executeRound(state: BattleState, rng: PRNG) {
  // Lines 176-303 (130 lines)
  // 1. Validation (lines 180-192)
  // 2. Phase transition (lines 194-198)
  // 3. Djinn execution (lines 200-206)
  // 4. Player actions (lines 208-246)
  // 5. Enemy actions (lines 248-273)
  // 6. Battle end check (lines 275-302)
}
```

**Target Structure:**
```typescript
// New helper functions (internal, not exported)
function validateQueueForExecution(state: BattleState): void
function transitionToExecutingPhase(state: BattleState): BattleState
function executePlayerActionsPhase(state: BattleState, rng: PRNG): ExecutionResult
function executeEnemyActionsPhase(state: BattleState, rng: PRNG): ExecutionResult
function checkBattleEndPhase(state: BattleState): BattleEndResult | null
function transitionToPlanningPhase(state: BattleState): BattleState

// Main orchestrator (simplified)
export function executeRound(state: BattleState, rng: PRNG): ExecutionResult {
  validateQueueForExecution(state);
  let currentState = transitionToExecutingPhase(state);
  const allEvents: BattleEvent[] = [];

  // Phase 1: Djinn
  if (currentState.queuedDjinn.length > 0) {
    const djinnResult = executeDjinnSummons(currentState, rng);
    currentState = djinnResult.state;
    allEvents.push(...djinnResult.events);
  }

  // Phase 2: Player actions
  const playerResult = executePlayerActionsPhase(currentState, rng);
  currentState = playerResult.state;
  allEvents.push(...playerResult.events);

  // Phase 3: Enemy actions
  const enemyResult = executeEnemyActionsPhase(currentState, rng);
  currentState = enemyResult.state;
  allEvents.push(...enemyResult.events);

  // Phase 4: Battle end check
  const battleEnd = checkBattleEndPhase(currentState);
  if (battleEnd) {
    currentState = transitionToVictoryOrDefeat(currentState, battleEnd);
    allEvents.push({ type: 'battle-end', result: battleEnd });
  } else {
    currentState = transitionToPlanningPhase(currentState);
  }

  return { state: currentState, events: allEvents };
}
```

**Implementation Steps:**

1. **Step 1.1:** Extract `validateQueueForExecution()`
   - Lines: 180-192
   - Throws error if validation fails
   - No state changes
   - Tests: Add unit test for validation edge cases

2. **Step 1.2:** Extract `transitionToExecutingPhase()`
   - Lines: 194-198
   - Pure state transition
   - Tests: Verify phase and executionIndex set correctly

3. **Step 1.3:** Extract `executePlayerActionsPhase()`
   - Lines: 208-246 (current player action loop)
   - Encapsulates: sorting, KO checks, retargeting, action execution
   - Returns: ExecutionResult with state and events
   - Tests: Test phase in isolation with various scenarios

4. **Step 1.4:** Extract `executeEnemyActionsPhase()`
   - Lines: 248-273 (current enemy action loop)
   - Similar to player phase
   - Tests: Test phase in isolation

5. **Step 1.5:** Extract `checkBattleEndPhase()`
   - Already exists as `checkBattleEnd()` (lines 546-557)
   - Just needs better name for clarity
   - Tests: Already covered

6. **Step 1.6:** Extract `transitionToPlanningPhase()`
   - Lines: 288-296
   - Handles: phase change, round increment, queue reset, mana refresh
   - Tests: Verify all state transitions

7. **Step 1.7:** Simplify main `executeRound()`
   - Reduce to ~40-50 lines
   - Clear phase progression
   - Tests: Run full test suite, verify no regressions

**Success Criteria:**
- ✅ `executeRound()` reduced to < 60 lines
- ✅ Each phase function < 50 lines
- ✅ All existing tests pass
- ✅ New unit tests for each phase function
- ✅ Cyclomatic complexity < 8 per function

**Estimated Time:** 3-4 hours

---

### Task 2: Split `BattleState` into Focused Interfaces

**File:** `apps/vale-v2/src/core/models/BattleState.ts`

**Current Structure:**
```typescript
export interface BattleState {
  // 25+ fields mixing multiple concerns
}
```

**Target Structure:**
```typescript
// 1. Turn order management (2 fields)
export interface BattleTurnOrder {
  readonly turnOrder: readonly string[];
  currentActorIndex: number; // Legacy field
}

// 2. Queue system (4 fields)
export interface BattleQueue {
  currentQueueIndex: number;
  readonly queuedActions: readonly (QueuedAction | null)[];
  readonly queuedDjinn: readonly string[];
  executionIndex: number;
}

// 3. Battle status/phase (4 fields)
export interface BattleStatus {
  phase: BattlePhase;
  status: BattleStatus; // 'ongoing' | BattleResult
  currentTurn: number;
  roundNumber: number;
}

// 4. Mana management (2 fields)
export interface BattleMana {
  remainingMana: number;
  maxMana: number;
}

// 5. Djinn recovery (1 field)
export interface BattleDjinnRecovery {
  djinnRecoveryTimers: Record<string, number>;
}

// 6. Battle metadata (4 fields)
export interface BattleMetadata {
  readonly isBossBattle?: boolean;
  readonly npcId?: string;
  /** @deprecated Use meta.encounterId */
  encounterId?: string;
  meta?: {
    encounterId: string;
    difficulty?: 'normal' | 'elite' | 'boss';
  };
}

// 7. Main BattleState (composition)
export interface BattleState {
  // Core units (3 fields)
  readonly playerTeam: Team;
  readonly enemies: readonly Unit[];
  readonly unitById: ReadonlyMap<string, UnitIndex>;

  // Composed sub-states
  turnOrder: BattleTurnOrder;
  queue: BattleQueue;
  status: BattleStatus;
  mana: BattleMana;
  djinnRecovery: BattleDjinnRecovery;
  metadata: BattleMetadata;

  // UI state
  log: readonly string[];
}
```

**Implementation Steps:**

1. **Step 2.1:** Define sub-interfaces
   - Add all 6 sub-interfaces to BattleState.ts
   - Keep side-by-side with existing interface
   - Run `pnpm typecheck` - should still compile

2. **Step 2.2:** Update `createBattleState()`
   - Change to return new structure
   - Keep field names compatible where possible
   - Tests: Factory tests should pass

3. **Step 2.3:** Update `updateBattleState()`
   - Handle nested updates gracefully
   - Support both old and new field access (temporarily)
   - Tests: Update tests should pass

4. **Step 2.4:** Update call sites in `QueueBattleService.ts`
   - Change: `state.queuedActions` → `state.queue.queuedActions`
   - Change: `state.phase` → `state.status.phase`
   - Change: `state.remainingMana` → `state.mana.remainingMana`
   - Run tests after each file update

5. **Step 2.5:** Update call sites in `BattleService.ts`
   - Similar field access updates
   - Run tests

6. **Step 2.6:** Update call sites in UI layer
   - queueBattleSlice.ts
   - battleSlice.ts
   - QueueBattleView.tsx
   - ActionBar.tsx, ActionQueuePanel.tsx, TurnOrderStrip.tsx

7. **Step 2.7:** Update all test files
   - queue-battle.test.ts
   - BattleState.test.ts
   - invariants.test.ts
   - golden-runner.test.ts
   - Other test files

8. **Step 2.8:** Remove old interface definition
   - Delete flattened BattleState interface
   - Keep only new composed version
   - Final typecheck and test run

**Success Criteria:**
- ✅ BattleState split into 6 focused sub-interfaces
- ✅ All 20+ call sites updated
- ✅ All tests pass
- ✅ No TypeScript errors
- ✅ Code more readable (grouped by concern)

**Estimated Time:** 4-5 hours

**Files to Update (20+):**
- Core Services: BattleService.ts, QueueBattleService.ts, AIService.ts, EncounterService.ts, RewardsService.ts, ReplayService.ts
- Core Algorithms: mana.ts
- Models: BattleState.ts (main changes)
- UI State: queueBattleSlice.ts, battleSlice.ts, rewardsSlice.ts
- UI Components: QueueBattleView.tsx, ActionBar.tsx, ActionQueuePanel.tsx, TurnOrderStrip.tsx
- Test Factories: factories.ts
- Tests: queue-battle.test.ts, BattleState.test.ts, replay.test.ts, golden-runner.test.ts, invariants.test.ts, Progression.test.ts
- Schemas: ReplaySchema.ts

---

### Task 3: Extract Remaining Magic Numbers

**File:** `apps/vale-v2/src/core/constants.ts`

**Status:** ✅ Most constants already extracted!

**Remaining Work:**

1. **Step 3.1:** Audit codebase for magic numbers
   ```bash
   # Search for numeric literals in core/
   grep -rn '\b[0-9]\+\(\.[0-9]\+\)\?\b' apps/vale-v2/src/core/ \
     --include='*.ts' \
     | grep -v '\.test\.ts' \
     | grep -v 'node_modules'
   ```

2. **Step 3.2:** Categorize findings
   - Constants (should be extracted)
   - Indexes/counters (can stay inline: `i = 0`, `length - 1`)
   - Test data (can stay in tests)

3. **Step 3.3:** Extract any found constants
   - Add to `BATTLE_CONSTANTS` in constants.ts
   - Document with JSDoc
   - Add rationale for values

4. **Step 3.4:** Replace magic numbers with constants
   - Import constants at call sites
   - Replace literals with named constants
   - Run tests

**Known Candidates for Extraction:**
- ✅ 4 (queue size) - Already `PARTY_SIZE`
- ✅ 0.95 (accuracy) - Already `DEFAULT_ABILITY_ACCURACY`
- ✅ 2.0 (crit multiplier) - Already `CRITICAL_HIT_MULTIPLIER`
- ✅ 0.5 (revive HP %, defense multiplier) - Already defined
- ✅ 1.5, 0.67 (element modifiers) - Already defined
- Potentially: Djinn recovery timers, summon damage values

**Success Criteria:**
- ✅ All magic numbers extracted to constants
- ✅ Constants documented with JSDoc
- ✅ Tests updated to use constants
- ✅ No regressions in behavior

**Estimated Time:** 1-2 hours

---

### Task 4: Introduce `AbilityId` Union Type

**Files:**
- New: `apps/vale-v2/src/data/types/AbilityId.ts`
- Update: 19 files using `abilityId: string`

**Target Type Definition:**
```typescript
/**
 * Ability ID union type for compile-time safety
 *
 * This ensures only valid ability IDs can be used throughout the codebase.
 * Update this type when adding new abilities to abilities.ts
 */
export type AbilityId =
  // Physical
  | 'strike'
  | 'heavy-strike'
  | 'guard-break'
  | 'precise-jab'
  | 'poison-strike'
  // Psynergy
  | 'fireball'
  | 'ice-shard'
  | 'quake'
  | 'gust'
  | 'chain-lightning'
  | 'burn-touch'
  | 'freeze-blast'
  | 'paralyze-shock'
  // Healing
  | 'heal'
  | 'party-heal'
  // Buffs
  | 'boost-atk'
  | 'boost-def'
  // Debuffs
  | 'weaken-def'
  | 'blind';

/**
 * Ability ID or null (for basic attacks)
 */
export type AbilityIdOrNull = AbilityId | null;
```

**Implementation Steps:**

1. **Step 4.1:** Create AbilityId.ts
   - Define union type
   - Export `AbilityId` and `AbilityIdOrNull`
   - Add JSDoc documentation

2. **Step 4.2:** Update type definitions
   - QueuedAction: `abilityId: AbilityIdOrNull`
   - AIDecision: `abilityId: AbilityIdOrNull`
   - Function signatures in services

3. **Step 4.3:** Update call sites (19 files)
   - Replace `abilityId: string | null` with `abilityId: AbilityIdOrNull`
   - Replace `abilityId: string` with `abilityId: AbilityId`
   - TypeScript will flag any incorrect usages

4. **Step 4.4:** Update Zod schemas
   - AbilitySchema: Keep schema as-is (runtime validation)
   - Add type assertion if needed: `z.string() as z.ZodType<AbilityId>`

5. **Step 4.5:** Run typecheck and fix errors
   - `pnpm typecheck`
   - Fix any type errors (should be mechanical)
   - Tests should still pass (no runtime changes)

**Success Criteria:**
- ✅ AbilityId union type defined
- ✅ All 19 files updated
- ✅ No TypeScript errors
- ✅ Tests pass (no runtime behavior changes)
- ✅ Better IDE autocomplete for ability IDs

**Estimated Time:** 2-3 hours

**Files to Update (19):**
- Core Services: BattleService.ts, QueueBattleService.ts, AIService.ts, types.ts
- Core Algorithms: mana.ts
- Models: BattleState.ts
- UI State: queueBattleSlice.ts, battleSlice.ts
- UI Components: QueueBattleView.tsx, ActionBar.tsx
- Tests: queue-battle.test.ts, Progression.test.ts

---

## Implementation Checklist

### Pre-Implementation

- [ ] Create feature branch: `git checkout -b refactor/system-02-code-quality`
- [ ] Run full test suite: `pnpm test` (establish baseline)
- [ ] Run typecheck: `pnpm typecheck`
- [ ] Commit current state: `git commit -m "Baseline before System 2 refactor"`

### Phase 1: Foundation (Tasks 3 & 4)

**Task 3: Extract Magic Numbers (1-2 hours)**
- [ ] Audit codebase for magic numbers
- [ ] Document findings in prompts/magic-numbers-audit.md
- [ ] Extract any remaining constants to constants.ts
- [ ] Update call sites to use constants
- [ ] Run tests: `pnpm test`
- [ ] Commit: `git commit -m "Extract remaining magic numbers"`

**Task 4: Introduce AbilityId Type (2-3 hours)**
- [ ] Create `src/data/types/AbilityId.ts`
- [ ] Define union type with all 18 abilities
- [ ] Update QueuedAction interface
- [ ] Update function signatures in services (5 files)
- [ ] Update UI components (5 files)
- [ ] Update tests (2 files)
- [ ] Run typecheck: `pnpm typecheck`
- [ ] Run tests: `pnpm test`
- [ ] Commit: `git commit -m "Introduce AbilityId union type"`

### Phase 2: Core Refactoring (Tasks 1 & 2)

**Task 1: Refactor executeRound() (3-4 hours)**
- [ ] Extract `validateQueueForExecution()`
- [ ] Run tests
- [ ] Extract `transitionToExecutingPhase()`
- [ ] Run tests
- [ ] Extract `executePlayerActionsPhase()`
- [ ] Write unit tests for player phase
- [ ] Run tests
- [ ] Extract `executeEnemyActionsPhase()`
- [ ] Write unit tests for enemy phase
- [ ] Run tests
- [ ] Extract `transitionToPlanningPhase()`
- [ ] Run tests
- [ ] Simplify main `executeRound()` function
- [ ] Run full test suite: `pnpm test`
- [ ] Verify determinism: Run tests 10x with different seeds
- [ ] Commit: `git commit -m "Refactor executeRound into composable phases"`

**Task 2: Split BattleState (4-5 hours)**
- [ ] Define sub-interfaces in BattleState.ts
- [ ] Run typecheck (should still compile)
- [ ] Update `createBattleState()` factory
- [ ] Update `updateBattleState()` helper
- [ ] Run tests: `pnpm test`
- [ ] Update QueueBattleService.ts call sites
- [ ] Run tests
- [ ] Update BattleService.ts call sites
- [ ] Run tests
- [ ] Update UI state slices (3 files)
- [ ] Run tests
- [ ] Update UI components (4 files)
- [ ] Run tests
- [ ] Update test files (6 files)
- [ ] Run full test suite: `pnpm test`
- [ ] Run typecheck: `pnpm typecheck`
- [ ] Remove old interface definition
- [ ] Final test run: `pnpm test`
- [ ] Commit: `git commit -m "Split BattleState into focused interfaces"`

### Phase 3: Validation & Documentation

- [ ] Run full pre-commit checks: `pnpm precommit`
- [ ] Run data validation: `pnpm validate:data`
- [ ] Manual smoke test in dev: `pnpm dev`
  - [ ] Start battle
  - [ ] Queue actions
  - [ ] Execute round
  - [ ] Test Djinn activation
  - [ ] Verify victory/defeat
- [ ] Update ARCHITECTURE documentation
- [ ] Update this plan with actual times
- [ ] Create pull request
- [ ] Code review

### Post-Implementation

- [ ] Merge to main
- [ ] Tag release: `git tag -a refactor-system-02 -m "Code quality refactor complete"`
- [ ] Update project status docs
- [ ] Create lessons learned doc

---

## Testing Strategy

### Test Categories

1. **Unit Tests** (per-function tests)
   - Each extracted phase function
   - Each sub-interface factory
   - Isolated from side effects

2. **Integration Tests** (service-level tests)
   - Full `executeRound()` with various scenarios
   - State transitions between phases
   - Event ordering

3. **Property-Based Tests** (invariants)
   - Determinism: same seed → same result
   - Event ordering always consistent
   - Mana balance never negative
   - All units accounted for after round

4. **Golden Tests** (snapshot tests)
   - Full battle replay with known seed
   - Verify exact same outcome after refactor
   - Located in: `tests/battle/golden/`

5. **Regression Tests** (existing test suite)
   - All existing tests must pass
   - No behavioral changes

### Test Execution Plan

**After Each Sub-Task:**
```bash
# Quick feedback loop
vitest run tests/core/services/queue-battle.test.ts
```

**After Each Task:**
```bash
# Full core tests
vitest run tests/core/

# Battle tests
vitest run tests/battle/

# Gameplay tests (slowest)
vitest run tests/gameplay/
```

**Before Commit:**
```bash
# Full test suite
pnpm test

# Typecheck
pnpm typecheck

# Lint
pnpm lint
```

**Before PR:**
```bash
# Full pre-commit
pnpm precommit

# Data validation
pnpm validate:data

# Manual smoke test
pnpm dev
```

### Test Coverage Goals

- ✅ Maintain 100% coverage on new phase functions
- ✅ Maintain existing coverage on BattleState (~95%)
- ✅ Add property-based tests for determinism

---

## Rollback Plan

### Git Strategy

```bash
# Create feature branch (before starting)
git checkout -b refactor/system-02-code-quality

# Commit after each task
git commit -m "Task X: [description]"

# If something breaks, revert last commit
git revert HEAD

# If major issues, abandon branch
git checkout main
git branch -D refactor/system-02-code-quality
```

### Incremental Approach

- Each task is independently committable
- Tests pass after each task
- Can ship Tasks 3 & 4 without Tasks 1 & 2
- Can ship Task 1 without Task 2 (or vice versa)

### Emergency Rollback

If refactor causes production issues:

1. **Immediate:** Revert merge commit
   ```bash
   git revert -m 1 <merge-commit-sha>
   ```

2. **Investigation:** Create hotfix branch from main
   ```bash
   git checkout -b hotfix/system-02-rollback main
   ```

3. **Fix Forward:** Cherry-pick working commits, fix broken ones
   ```bash
   git cherry-pick <working-commit-sha>
   ```

---

## Success Metrics

### Code Quality Metrics

**Before Refactor:**
- `executeRound()`: 130 lines, complexity ~12-15
- `BattleState`: 25+ fields, 7 concerns
- Magic numbers: Mostly extracted (some remain)
- `abilityId`: `string` type (no compile-time safety)

**After Refactor (Goals):**
- ✅ `executeRound()`: < 60 lines, complexity < 8
- ✅ Phase functions: < 50 lines each, complexity < 6
- ✅ `BattleState`: 6 focused sub-interfaces, clear concerns
- ✅ Magic numbers: 100% extracted to constants
- ✅ `abilityId`: Union type with autocomplete

### Behavioral Metrics

- ✅ All tests pass (no regressions)
- ✅ Determinism preserved (same seed → same result)
- ✅ Performance unchanged (< 5% variance)
- ✅ No new TypeScript errors

### Developer Experience Metrics

- ✅ Easier to understand control flow
- ✅ Easier to test phases in isolation
- ✅ Better IDE autocomplete for ability IDs
- ✅ Clearer BattleState structure

---

## Dependencies & Prerequisites

### Required Tools
- ✅ Node.js 18+
- ✅ pnpm 8+
- ✅ TypeScript 5+
- ✅ Vitest

### Required Knowledge
- ✅ TypeScript (type unions, interfaces)
- ✅ Immutable updates (spread operators)
- ✅ Functional decomposition
- ✅ Battle system architecture (see CLAUDE.md)

### Blocking Issues
- ❌ None - ready to start

---

## Timeline Estimate

| Phase | Task | Estimated | Actual | Status |
|-------|------|-----------|--------|--------|
| **Foundation** | | | | |
| | Task 3: Magic Numbers | 1-2h | | ⏸️ Not Started |
| | Task 4: AbilityId Type | 2-3h | | ⏸️ Not Started |
| **Core Refactor** | | | | |
| | Task 1: executeRound() | 3-4h | | ⏸️ Not Started |
| | Task 2: BattleState Split | 4-5h | | ⏸️ Not Started |
| **Validation** | | | | |
| | Testing & Docs | 1h | | ⏸️ Not Started |
| **Total** | | **11-15h** | | |

**Recommended Schedule:**
- Day 1: Tasks 3 & 4 (Foundation) - 3-5 hours
- Day 2: Task 1 (executeRound) - 3-4 hours
- Day 3: Task 2 (BattleState) - 4-5 hours
- Day 4: Testing & Documentation - 1 hour

---

## Notes & Considerations

### Why This Order?

1. **Tasks 3 & 4 First (Foundation)**
   - Low risk, high value
   - Sets up better DX for Tasks 1 & 2
   - Can ship independently

2. **Task 1 & 2 Can Run in Parallel**
   - Different files (mostly)
   - Independent concerns
   - Can split across developers

### Alternative Approaches Considered

**Alternative 1: Big Bang Refactor**
- Do all 4 tasks in one go
- ❌ Higher risk
- ❌ Harder to debug failures
- ✅ Faster if no issues

**Alternative 2: Incremental Ship (Chosen)**
- Ship each task independently
- ✅ Lower risk
- ✅ Easier to isolate issues
- ❌ More commits/PRs

**Alternative 3: UI-First**
- Start with UI components, then core
- ❌ Doesn't follow architecture (core → UI)
- ❌ UI depends on core types

### Technical Debt Considerations

**What This Refactor Addresses:**
- ✅ God object (BattleState)
- ✅ Long function (executeRound)
- ✅ Magic numbers
- ✅ String types (abilityId)

**What This Refactor Does NOT Address:**
- ❌ Legacy turn-by-turn system (out of scope)
- ❌ UI component complexity (separate effort)
- ❌ Test organization (separate effort)
- ❌ Performance optimization (separate effort)

### Future Enhancements

After this refactor, consider:
1. Extract action execution pattern (DRY player/enemy phases)
2. Introduce phase pipeline pattern
3. Add phase-level events for better observability
4. Refactor status effect application (separate service)

---

## Appendix A: File Impact Analysis

### Core Services (6 files)
- ✅ QueueBattleService.ts - Heavy changes (Task 1, 2, 4)
- ✅ BattleService.ts - Medium changes (Task 2, 4)
- ✅ AIService.ts - Light changes (Task 2, 4)
- ✅ EncounterService.ts - Light changes (Task 2)
- ✅ RewardsService.ts - Light changes (Task 2)
- ✅ ReplayService.ts - Light changes (Task 2)

### Core Models (2 files)
- ✅ BattleState.ts - Heavy changes (Task 2)
- ✅ constants.ts - Light changes (Task 3)

### Core Algorithms (1 file)
- ✅ mana.ts - Light changes (Task 2, 4)

### Data Types (1 new file)
- ✅ AbilityId.ts - New file (Task 4)

### UI State (3 files)
- ✅ queueBattleSlice.ts - Medium changes (Task 2, 4)
- ✅ battleSlice.ts - Medium changes (Task 2, 4)
- ✅ rewardsSlice.ts - Light changes (Task 2)

### UI Components (4 files)
- ✅ QueueBattleView.tsx - Medium changes (Task 2, 4)
- ✅ ActionBar.tsx - Light changes (Task 2, 4)
- ✅ ActionQueuePanel.tsx - Light changes (Task 2)
- ✅ TurnOrderStrip.tsx - Light changes (Task 2)

### Tests (6 files)
- ✅ queue-battle.test.ts - Heavy changes (Task 1, 2, 4)
- ✅ BattleState.test.ts - Medium changes (Task 2)
- ✅ invariants.test.ts - Light changes (Task 2)
- ✅ golden-runner.test.ts - Light changes (Task 2)
- ✅ replay.test.ts - Light changes (Task 2)
- ✅ Progression.test.ts - Light changes (Task 2, 4)

### Test Factories (1 file)
- ✅ factories.ts - Light changes (Task 2)

### Schemas (1 file)
- ✅ ReplaySchema.ts - Light changes (Task 2)

**Total Files Affected: 29**
- Heavy changes: 3
- Medium changes: 5
- Light changes: 20
- New files: 1

---

## Appendix B: Code Complexity Analysis

### Current Complexity (McCabe Cyclomatic Complexity)

**QueueBattleService.ts:**
```
executeRound(): 12-15
├─ if/else: 3
├─ for loops: 3
├─ ternary: 2
└─ try/catch: 1
```

**Target Complexity:**
```
executeRound(): 5-6 (orchestrator only)
├─ validateQueueForExecution(): 3-4
├─ executePlayerActionsPhase(): 6-8
├─ executeEnemyActionsPhase(): 6-8
├─ transitionToPlanningPhase(): 3-4
```

### Lines of Code Reduction

**Before:**
- QueueBattleService.ts: 559 lines
- BattleState.ts: 221 lines

**After (Estimated):**
- QueueBattleService.ts: ~600 lines (more functions, but simpler)
- BattleState.ts: ~280 lines (sub-interfaces add lines, but clearer)

**Note:** We're optimizing for clarity, not LOC reduction.

---

## Appendix C: References

### Documentation
- CLAUDE.md - Development guide
- VALE_CHRONICLES_ARCHITECTURE.md - System architecture
- docs/adr/003-model-conventions.md - Model patterns
- docs/NAMING_CONVENTIONS.md - Naming standards

### Related Issues
- None (greenfield refactor)

### Related PRs
- None (first refactor of this system)

### External Resources
- [Clean Code (Martin)](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring (Fowler)](https://refactoring.com/)
- [TypeScript Handbook - Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

---

**END OF REFACTORING PLAN**
