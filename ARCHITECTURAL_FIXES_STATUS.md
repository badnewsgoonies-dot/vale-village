# Architectural Fixes Status & Implementation Guide

**Last Updated:** 2025-11-16  
**Status:** E2E Tests Complete ✅ | Architectural Fixes Pending ⏳

---

## 🎯 Executive Summary

**What's Done:**
- ✅ **E2E Combat Mechanics Tests** - 5 comprehensive tests validating core combat (damage, equipment, Djinn, level-ups, turn order)
- ✅ **Test Coverage:** Improved from ~50-60% → ~80%+ (real battle execution, not simulated)

**What Needs Fixing:**
- ⏳ **Quick Wins** - 1,617 LOC cleanup (dead code removal)
- ⏳ **Battle Slice Duplication** - Merge `battleSlice` and `queueBattleSlice`
- ⏳ **Large Function Refactoring** - Extract `executeAbility` (334 lines → smaller functions)

**How Tests Help:**
- ✅ **Safety Net** - Tests catch regressions during refactoring
- ✅ **Validation** - Verify combat mechanics still work after changes
- ✅ **Confidence** - Enable safer architectural changes

---

## 📊 Current State

### ✅ Completed: E2E Combat Mechanics Tests

**File:** `tests/e2e/combat-mechanics.spec.ts`

**5 Tests Implemented:**
1. **Damage Formula Validation** - Verifies `2×ATK - DEF/2` formula
2. **Equipment Bonus Integration** - Validates Wooden Sword (+5 ATK) increases damage
3. **Djinn Stat Bonus Integration** - Validates Flint Set (+4 ATK) increases damage
4. **Level-Up Stat Growth** - Validates HP +25, ATK +3, DEF +4, SPD +1 per level
5. **Turn Order Validation** - Validates speed-based turn ordering

**Helper Function:** `executeBattleActionAndCaptureDamage()` in `helpers.ts:567-663`
- Executes real battle actions (not simulated)
- Captures actual damage dealt
- Returns HP changes for validation

**Test Performance:** All 5 tests pass in ~21.8 seconds

**Coverage Impact:**
- Before: ~50-60% (UI/navigation only)
- After: ~80%+ (includes core combat mechanics)

---

## 🔴 Issues Identified (Need Fixing)

### Issue 1: Quick Wins - Dead Code Cleanup (1,617 LOC)

**Priority:** HIGH  
**Effort:** LOW (2-3 hours)  
**Impact:** -1,617 lines of code

#### Dead UI Components to Delete:

1. **`src/ui/components/BattleScreen.tsx`**
   - Status: Never imported, dead code
   - Action: Delete file

2. **`src/ui/components/BattleView.tsx`**
   - Status: Only exported, never imported
   - Action: Delete file

3. **`src/ui/components/battle/` folder**
   - Status: Entire folder is dead code
   - Contains: `UnitCard.tsx`, `TurnOrderStrip.tsx` (duplicates exist elsewhere)
   - Action: Delete entire folder

4. **Associated CSS Files:**
   - `src/ui/components/battle/*.css`
   - Action: Delete all CSS files in battle folder

#### Verification:
- ✅ Confirmed `QueueBattleView` is the only active battle view
- ✅ Duplicate components exist in `ui/components/` (not in `battle/` subfolder)

**Files to Delete:**
```
src/ui/components/BattleScreen.tsx
src/ui/components/BattleView.tsx
src/ui/components/battle/ (entire folder)
src/ui/components/battle/*.css (all CSS files)
```

**Estimated LOC Reduction:** ~1,617 lines

---

### Issue 2: Battle Slice Duplication

**Priority:** HIGH  
**Effort:** MEDIUM (4-6 hours)  
**Impact:** Eliminates state duplication, reduces maintenance burden

#### Problem:

Two Zustand slices manage nearly identical battle state:

1. **`battleSlice.ts`** (Classical turn-based)
   ```typescript
   export interface BattleSlice {
     battle: BattleState | null;  // DUPLICATE
     events: BattleEvent[];        // DUPLICATE
     rngSeed: number;              // DUPLICATE
     turnNumber: number;
     // Methods: perform(), endTurn(), performAIAction()
   }
   ```

2. **`queueBattleSlice.ts`** (Queue-based planning)
   ```typescript
   export interface QueueBattleSlice {
     battle: BattleState | null;  // DUPLICATE
     events: BattleEvent[];        // DUPLICATE
     rngSeed: number;              // DUPLICATE
     // Methods: queueUnitAction(), executeQueuedRound()
   }
   ```

#### Current Usage:
- ✅ **Active:** `queueBattleSlice` (used by `QueueBattleView`)
- ❌ **Dead:** `battleSlice` (classical system not used)

#### Solution Approach:

**Option A: Merge into Single Slice** (Recommended)
- Keep `queueBattleSlice` as base
- Add classical methods if needed (or remove if truly dead)
- Update all imports to use merged slice
- Delete `battleSlice.ts`

**Option B: Extract Common State**
- Create `BattleStateSlice` with common fields
- Both slices extend it
- More complex, but preserves separation

**Recommended:** Option A (merge into `queueBattleSlice`)

#### Files to Modify:
```
src/ui/state/battleSlice.ts          → DELETE
src/ui/state/queueBattleSlice.ts     → MERGE methods if needed
src/ui/store.ts                      → Remove battleSlice import
```

#### Verification Steps:
1. Search for `battleSlice` imports
2. Verify no active usage
3. Merge any unique methods into `queueBattleSlice`
4. Delete `battleSlice.ts`
5. Run E2E tests to verify no regressions

---

### Issue 3: Large Function - `executeAbility` (334 lines)

**Priority:** MEDIUM  
**Effort:** MEDIUM-HIGH (6-8 hours)  
**Impact:** Improves maintainability, testability, readability

#### Problem:

**File:** `src/core/services/BattleService.ts`

**Function:** `executeAbility()` (lines 340-673, ~334 lines)

**Complexity:**
- Handles multiple ability types (physical, psynergy, healing, buffs, debuffs)
- Multi-hit logic
- Status effect application
- Shield/invulnerability checks
- Complex nested conditionals

**Current Structure:**
```typescript
function executeAbility(
  caster: Unit,
  ability: Ability,
  targets: readonly Unit[],
  allUnits: readonly Unit[],
  team: Team,
  enemies: readonly Unit[],
  rng: PRNG
): ActionResult {
  // 334 lines of complex logic
  switch (ability.type) {
    case 'physical':
    case 'psynergy': {
      // Damage calculation + multi-hit + shields
    }
    case 'healing': {
      // Healing logic
    }
    case 'buff':
    case 'debuff': {
      // Status effect application
    }
  }
}
```

#### Solution Approach:

**Strategy Pattern** (Recommended)

Extract ability type handlers into separate functions:

```typescript
// Extract handlers
function executePhysicalAbility(...): ActionResult
function executePsynergyAbility(...): ActionResult
function executeHealingAbility(...): ActionResult
function executeBuffAbility(...): ActionResult
function executeDebuffAbility(...): ActionResult

// Main function becomes dispatcher
function executeAbility(...): ActionResult {
  switch (ability.type) {
    case 'physical': return executePhysicalAbility(...);
    case 'psynergy': return executePsynergyAbility(...);
    case 'healing': return executeHealingAbility(...);
    case 'buff': return executeBuffAbility(...);
    case 'debuff': return executeDebuffAbility(...);
  }
}
```

**Benefits:**
- Each handler ~50-80 lines (vs 334)
- Easier to test in isolation
- Clearer responsibility separation
- Easier to add new ability types

#### Files to Modify:
```
src/core/services/BattleService.ts
  → Extract executeAbility() into smaller functions
```

#### Testing Strategy:
- ✅ Existing unit tests for `executeAbility` will catch regressions
- ✅ E2E combat tests will validate damage calculations still work
- ✅ Add unit tests for each extracted handler function

---

## 🛠️ Implementation Methods

### Method 1: Quick Wins (Dead Code Removal)

**Steps:**
1. **Verify Dead Code:**
   ```bash
   # Search for imports
   grep -r "BattleScreen" src
   grep -r "BattleView" src
   grep -r "from.*battle/" src
   ```

2. **Delete Files:**
   ```bash
   rm src/ui/components/BattleScreen.tsx
   rm src/ui/components/BattleView.tsx
   rm -rf src/ui/components/battle/
   ```

3. **Verify No Breakage:**
   ```bash
   pnpm typecheck
   pnpm test
   pnpm test:e2e combat-mechanics
   ```

4. **Commit:**
   ```bash
   git add -A
   git commit -m "chore: remove dead UI components (-1,617 LOC)"
   ```

**Risk:** LOW (dead code, no active usage)  
**Time:** 30 minutes

---

### Method 2: Merge Battle Slices

**Steps:**

1. **Audit Current Usage:**
   ```bash
   # Find all imports of battleSlice
   grep -r "battleSlice" src
   grep -r "from.*battleSlice" src
   ```

2. **Check Store Configuration:**
   ```typescript
   // src/ui/store.ts
   // Verify battleSlice is imported/used
   ```

3. **Merge Strategy:**
   - If `battleSlice` has unique methods → Add to `queueBattleSlice`
   - If `battleSlice` is completely unused → Delete it
   - Update store to only use `queueBattleSlice`

4. **Update Imports:**
   - Replace `battleSlice` imports with `queueBattleSlice`
   - Update method calls if needed

5. **Verify:**
   ```bash
   pnpm typecheck
   pnpm test
   pnpm test:e2e combat-mechanics  # Critical - validates battle system
   ```

6. **Commit:**
   ```bash
   git add -A
   git commit -m "refactor: merge battleSlice into queueBattleSlice (eliminates duplication)"
   ```

**Risk:** MEDIUM (touches state management)  
**Time:** 4-6 hours  
**Safety Net:** E2E tests will catch if battle system breaks

---

### Method 3: Extract `executeAbility`

**Steps:**

1. **Create Handler Functions:**
   ```typescript
   // Extract each ability type handler
   function executePhysicalAbility(...): ActionResult
   function executePsynergyAbility(...): ActionResult
   function executeHealingAbility(...): ActionResult
   function executeBuffAbility(...): ActionResult
   function executeDebuffAbility(...): ActionResult
   ```

2. **Refactor Main Function:**
   ```typescript
   function executeAbility(...): ActionResult {
     // Dispatch to appropriate handler
     switch (ability.type) {
       case 'physical': return executePhysicalAbility(...);
       // ... etc
     }
   }
   ```

3. **Move Shared Logic:**
   - Extract common patterns (multi-hit, shield checks, status effects)
   - Create helper functions for shared logic

4. **Update Tests:**
   - Existing tests should still pass (same interface)
   - Add unit tests for each handler function

5. **Verify:**
   ```bash
   pnpm test core/services/BattleService
   pnpm test:e2e combat-mechanics  # Validates damage calculations
   ```

6. **Commit:**
   ```bash
   git add -A
   git commit -m "refactor: extract executeAbility handlers (334 → 5×50-80 line functions)"
   ```

**Risk:** MEDIUM (core combat logic)  
**Time:** 6-8 hours  
**Safety Net:** Unit tests + E2E tests validate behavior unchanged

---

## ✅ How E2E Tests Help

### During Quick Wins (Dead Code Removal):
- ✅ **Low Risk** - Dead code has no active usage
- ✅ **Tests Still Run** - Verify no accidental breakage
- ✅ **Confidence** - Can delete safely knowing tests will catch issues

### During Battle Slice Merge:
- ✅ **Critical Validation** - Tests verify battle system still works
- ✅ **Regression Detection** - If merge breaks something, tests fail immediately
- ✅ **Before/After Comparison** - Run tests before and after to ensure no changes

### During `executeAbility` Extraction:
- ✅ **Behavior Validation** - Tests verify damage calculations unchanged
- ✅ **Integration Testing** - Tests validate full battle flow still works
- ✅ **Confidence** - Can refactor knowing tests will catch breaking changes

---

## 📋 Implementation Checklist

### Phase 1: Quick Wins (Dead Code)
- [ ] Verify no imports of `BattleScreen`, `BattleView`, `battle/` folder
- [ ] Delete `BattleScreen.tsx`
- [ ] Delete `BattleView.tsx`
- [ ] Delete `battle/` folder and CSS files
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm test`
- [ ] Run `pnpm test:e2e combat-mechanics`
- [ ] Commit: "chore: remove dead UI components (-1,617 LOC)"

### Phase 2: Merge Battle Slices
- [ ] Audit `battleSlice` usage (grep for imports)
- [ ] Check store configuration
- [ ] Identify unique methods in `battleSlice`
- [ ] Merge methods into `queueBattleSlice` (if needed)
- [ ] Update store to remove `battleSlice`
- [ ] Update all imports
- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm test`
- [ ] Run `pnpm test:e2e combat-mechanics` ⚠️ CRITICAL
- [ ] Commit: "refactor: merge battleSlice into queueBattleSlice"

### Phase 3: Extract `executeAbility`
- [ ] Analyze `executeAbility` structure
- [ ] Identify extraction points (by ability type)
- [ ] Create handler functions
- [ ] Extract shared logic helpers
- [ ] Refactor main function to dispatcher
- [ ] Add unit tests for handlers
- [ ] Run `pnpm test core/services/BattleService`
- [ ] Run `pnpm test:e2e combat-mechanics` ⚠️ CRITICAL
- [ ] Commit: "refactor: extract executeAbility handlers"

---

## 🎯 Success Criteria

### Quick Wins:
- ✅ 1,617 LOC removed
- ✅ No TypeScript errors
- ✅ All tests pass
- ✅ No regressions

### Battle Slice Merge:
- ✅ Single battle slice (`queueBattleSlice`)
- ✅ No duplicate state
- ✅ All tests pass
- ✅ E2E combat tests pass ⚠️ CRITICAL
- ✅ Battle system works identically

### `executeAbility` Extraction:
- ✅ Function split into 5 handlers (~50-80 lines each)
- ✅ Main function is dispatcher (~20-30 lines)
- ✅ All unit tests pass
- ✅ E2E combat tests pass ⚠️ CRITICAL
- ✅ Behavior unchanged (same damage calculations)

---

## 🚨 Critical Notes

1. **Always Run E2E Tests After Refactoring:**
   ```bash
   pnpm test:e2e combat-mechanics
   ```
   These tests validate core combat mechanics - if they fail, something broke.

2. **Test-Driven Refactoring:**
   - Run tests BEFORE refactoring (establish baseline)
   - Run tests AFTER refactoring (verify no changes)
   - Tests should pass identically before/after

3. **Incremental Commits:**
   - Commit after each phase
   - Easy to rollback if something breaks
   - Clear history of changes

4. **TypeScript First:**
   - Run `pnpm typecheck` frequently
   - Fix type errors before running tests
   - TypeScript will catch many issues early

---

## 📚 Reference Files

### Test Files (Validation):
- `tests/e2e/combat-mechanics.spec.ts` - E2E combat tests
- `tests/e2e/helpers.ts` - Test helpers (including `executeBattleActionAndCaptureDamage`)

### Files to Modify:
- `src/ui/components/BattleScreen.tsx` → DELETE
- `src/ui/components/BattleView.tsx` → DELETE
- `src/ui/components/battle/` → DELETE (entire folder)
- `src/ui/state/battleSlice.ts` → DELETE (after merge)
- `src/ui/state/queueBattleSlice.ts` → MODIFY (merge methods)
- `src/ui/store.ts` → MODIFY (remove battleSlice)
- `src/core/services/BattleService.ts` → MODIFY (extract executeAbility)

### Architecture Docs:
- `CLAUDE.md` - Architecture principles
- `CHANGELOG.md` - Breaking changes log

---

## 🎓 Key Learnings

1. **E2E Tests Are Safety Net:**
   - They don't fix code, but they catch regressions
   - Critical for refactoring confidence
   - Run them frequently during refactoring

2. **Dead Code Is Safe to Delete:**
   - Quick wins are low-risk
   - Verify with grep before deleting
   - Tests will catch if something was actually needed

3. **State Duplication Is Dangerous:**
   - Two sources of truth = bugs waiting to happen
   - Merge carefully, test thoroughly
   - E2E tests validate behavior unchanged

4. **Large Functions Are Hard to Maintain:**
   - Extract into smaller, focused functions
   - Strategy pattern works well for type-based dispatch
   - Tests validate behavior unchanged

---

## 🚀 Next Steps

1. **Start with Quick Wins** (lowest risk, highest impact)
2. **Then Merge Battle Slices** (medium risk, eliminates duplication)
3. **Finally Extract `executeAbility`** (medium risk, improves maintainability)

**Each phase should:**
- ✅ Run tests before starting
- ✅ Make incremental changes
- ✅ Run tests after each change
- ✅ Commit when tests pass
- ✅ Move to next phase

---

**Status:** Ready for implementation  
**Confidence:** HIGH (E2E tests provide safety net)  
**Estimated Total Time:** 12-17 hours across all phases


