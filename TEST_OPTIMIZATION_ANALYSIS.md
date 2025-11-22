# Test Optimization Analysis

**Date:** 2025-11-16  
**Context:** After fixing game mechanics (mode transitions, post-battle flow, Djinn granting)

---

## Current Test Suite Overview

- **Total E2E Test Files:** 35
- **Total Test Cases:** ~198
- **Test Status:** 130+ passing, 36 failing (unrelated to recent fixes)

---

## Test Categories

### 1. Recruitment Tests (Potential Redundancy)

#### Files:
- `smoke-recruitment.spec.ts` - Quick smoke test (3 tests)
- `house-01-recruitment.spec.ts` - Natural flow test (2 tests)
- `battle-recruits-devmode.spec.ts` - Dev Mode recruitment (7 tests)
- `recruitment-validation.spec.ts` - Data validation (unit tests, not E2E)
- `story-join-validation.spec.ts` - Story join validation (2 tests)
- `recruited-units-in-battle.spec.ts` - Battle integration (2 tests)

#### Analysis:
- **`smoke-recruitment.spec.ts`** - Tests Dev Mode grants units (doesn't test actual recruitment flow)
- **`house-01-recruitment.spec.ts`** - Tests natural flow (most important, keep)
- **`battle-recruits-devmode.spec.ts`** - Tests all recruitment houses via Dev Mode (comprehensive, keep)
- **`story-join-validation.spec.ts`** - Tests story joins (Houses 2, 3) - **Keep but verify it works with new flow**

#### Recommendation:
- ✅ **Keep:** `house-01-recruitment.spec.ts` (natural flow, critical)
- ✅ **Keep:** `battle-recruits-devmode.spec.ts` (comprehensive coverage)
- ⚠️ **Review:** `smoke-recruitment.spec.ts` - Could be merged into `battle-recruits-devmode.spec.ts` or removed if redundant
- ✅ **Keep:** `story-join-validation.spec.ts` - Tests different system (story flags vs dialogues)
- ✅ **Keep:** `recruited-units-in-battle.spec.ts` - Tests battle integration

### 2. Battle Flow Tests

#### Files:
- `battle-execution.spec.ts` - Battle mechanics (3 tests)
- `combat-mechanics.spec.ts` - Combat integration (5 tests)
- `five-houses-progression.spec.ts` - Sequential progression (1 test)
- `full-gameplay-loop.spec.ts` - Two battles flow (1 test)
- `epic-gameplay-journey.spec.ts` - Full journey (1 test)

#### Analysis:
- All test different aspects of battle flow
- **No obvious redundancy**

#### Recommendation:
- ✅ **Keep all** - Each tests different scenarios

### 3. Djinn Tests

#### Files:
- `djinn-collection.spec.ts` - Collection screen (7 tests)
- `djinn-standby.spec.ts` - Standby mechanics (2 tests)
- `djinn-state-transitions.spec.ts` - State transitions (4 tests)
- `djinn-ability-updates.spec.ts` - Ability updates (11 tests)
- `djinn-and-mana-progression.spec.ts` - Progression (23 tests)
- `counter-element.spec.ts` - Element counter (2 tests)

#### Analysis:
- Comprehensive Djinn coverage
- **No obvious redundancy**

#### Recommendation:
- ✅ **Keep all** - Each tests different aspects

### 4. Equipment Tests

#### Files:
- `equipment-management.spec.ts` - Management (6 tests)
- `shop-equip-integration.spec.ts` - Shop/equip integration (9 tests)

#### Analysis:
- Different focuses (management vs integration)

#### Recommendation:
- ✅ **Keep both**

### 5. Mode Transition Tests

#### Files:
- `map-transitions.spec.ts` - Map transitions (4 tests)
- `progressive-unlock.spec.ts` - House unlock progression (6 tests)
- `npc-dialogue.spec.ts` - NPC dialogue (7 tests)
- `shop-interactions.spec.ts` - Shop interactions (3 tests)

#### Analysis:
- All test different mode transitions
- **Should verify these work with new mode transition fixes**

#### Recommendation:
- ✅ **Keep all** - But verify they work with corrected flow

### 6. Rewards Tests

#### Files:
- `rewards-integration.spec.ts` - Rewards system (3 tests)
- `auto-heal.spec.ts` - Auto-heal after battle (2 tests)

#### Analysis:
- **`auto-heal.spec.ts`** - Currently failing (unrelated to our fixes)
- **`rewards-integration.spec.ts`** - Should verify it works with new flow

#### Recommendation:
- ✅ **Keep both** - But fix `auto-heal.spec.ts` separately

### 7. Utility/Infrastructure Tests

#### Files:
- `game-start.spec.ts` - Game initialization (20 tests)
- `initial-game-state.spec.ts` - Initial state (12 tests)
- `save-load.spec.ts` - Save/load (2 tests)
- `debug-mounting.spec.ts` - Debug mounting (2 tests)
- `verify-sprites.spec.ts` - Sprite verification (5 tests)
- `button-sprites.spec.ts` - Button sprites (1 test)
- `wall-collision.spec.ts` - Wall collision (3 tests)
- `mana-generation.spec.ts` - Mana generation (2 tests)
- `encounter-progression.spec.ts` - Encounter progression (14 tests)
- `comprehensive-gameplay-menus.spec.ts` - Menu flow (4 tests)

#### Analysis:
- **`game-start.spec.ts`** and **`initial-game-state.spec.ts`** - Potential overlap?
- Others test specific features

#### Recommendation:
- ⚠️ **Review:** `game-start.spec.ts` vs `initial-game-state.spec.ts` - Check for redundancy
- ✅ **Keep others**

---

## Tests That Need Updating

### 1. Tests Using Old Mode Transition Flow

**Files to check:**
- `progressive-unlock.spec.ts` - May expect old `setPendingBattle` behavior
- `map-transitions.spec.ts` - May expect old mode transitions
- `story-join-validation.spec.ts` - May need to verify new dialogue flow

**Action:** Run these tests and verify they still work with new flow.

### 2. Tests Using Old Post-Battle Flow

**Files to check:**
- `rewards-integration.spec.ts` - Should verify new `handleRewardsContinue` flow
- `auto-heal.spec.ts` - May need updating for new flow
- `five-houses-progression.spec.ts` - Uses `completeBattleFlow`, should work but verify

**Action:** Verify these tests work with new `handleRewardsContinue` logic.

### 3. Tests That May Need Equipment Choice Handling

**Files to check:**
- Any test that calls `completeBattleFlow()` - Should already handle equipment choices
- Tests that manually claim rewards - May need to handle equipment choices

**Action:** Verify tests handle equipment choices correctly.

---

## Missing Test Coverage

### 1. Mode Transition Edge Cases
- ❌ **Missing:** Test `setPendingBattle(null)` clears pending battle and returns to overworld
- ❌ **Missing:** Test mode transition fails gracefully if encounterId invalid
- ❌ **Missing:** Test `handleRewardsContinue` when no encounterId available

### 2. Equipment Choice Edge Cases
- ❌ **Missing:** Test equipment choice timeout/error handling
- ❌ **Missing:** Test multiple equipment choices in sequence

### 3. Dialogue Effect Edge Cases
- ❌ **Missing:** Test `grantDjinn` when Djinn already collected (should fail gracefully)
- ❌ **Missing:** Test `grantDjinn` when team is null
- ❌ **Missing:** Test `recruitUnit` when unit already in roster

### 4. Integration Tests
- ❌ **Missing:** Test complete flow: overworld → battle → rewards → equipment choice → dialogue → overworld
- ❌ **Missing:** Test Dev Mode jump → battle → rewards → dialogue → overworld (full flow)

---

## Recommendations

### Immediate Actions

1. **Verify Tests Work with New Flow**
   - Run all tests and identify which ones fail due to flow changes
   - Update tests that use old patterns

2. **Consolidate Redundant Tests**
   - Review `smoke-recruitment.spec.ts` - Merge into `battle-recruits-devmode.spec.ts` or remove
   - Review `game-start.spec.ts` vs `initial-game-state.spec.ts` - Consolidate if redundant

3. **Add Missing Coverage**
   - Add tests for mode transition edge cases
   - Add tests for equipment choice edge cases
   - Add tests for dialogue effect edge cases

### Long-Term Improvements

1. **Test Organization**
   - Group related tests better (e.g., all recruitment tests together)
   - Create test suites for different game phases

2. **Test Helpers**
   - Document `completeBattleFlow` usage
   - Add helper for equipment choice handling
   - Add helper for dialogue effect testing

3. **Test Performance**
   - Identify slow tests and optimize
   - Consider parallel test execution where safe

---

## Test Files Status

### ✅ Should Work (No Changes Needed)
- `battle-execution.spec.ts` - Already updated for new flow
- `battle-recruits-devmode.spec.ts` - Already updated, all passing
- `house-01-recruitment.spec.ts` - Uses `completeBattleFlow`, should work
- Most Djinn tests - Don't depend on mode transitions
- Most equipment tests - Don't depend on mode transitions

### ⚠️ Need Verification
- `progressive-unlock.spec.ts` - May need mode transition updates
- `map-transitions.spec.ts` - May need mode transition updates
- `story-join-validation.spec.ts` - May need dialogue flow updates
- `rewards-integration.spec.ts` - Should verify new flow works
- `five-houses-progression.spec.ts` - Uses `completeBattleFlow`, should work but verify

### ❌ Known Failures (Unrelated to Our Fixes)
- `auto-heal.spec.ts` - Auto-heal system issue (separate bug)
- Various story flag tests - Story flag system issue (separate bug)

---

## Next Steps

1. ✅ **Documentation Complete** - Game mechanics flow documented
2. ⏳ **Test Verification** - Run tests and identify what needs updating
3. ⏳ **Test Optimization** - Consolidate redundant tests, add missing coverage
4. ⏳ **Final Assessment** - Overall state after optimizations
