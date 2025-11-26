# Services Test Coverage Assessment

**Date:** 2025-11-26
**Agent:** Testing Agent #2 (Services)
**Scope:** src/core/services/

## Executive Summary

**Total Service Files:** 17
**Files with Tests:** 6
**Files Missing Tests:** 11
**Overall Coverage:** ~35%

### Priority Assessment
- **Critical Gaps:** AIService, EncounterService, TowerService, ShopService
- **Moderate Gaps:** DjinnService, RewardsService, RngService, DevModeService
- **Well-Covered:** QueueBattleService, DialogueService, StoryService, SaveService, OverworldService

---

## Service-by-Service Coverage Analysis

### 1. AIService.ts
**Status:** ❌ NO TESTS
**Priority:** CRITICAL
**Lines of Code:** ~367

**Missing Test Coverage:**
- `makeAIDecision()` - Core AI decision logic
  - Ability scoring based on tactical rules
  - Target selection strategies (weakest, lowestRes, healerFirst, highestDef, random)
  - Fallback behavior when no abilities available
  - Avoid overkill logic
  - Opener preference
- `scoreAbility()` - Ability utility scoring
  - Damage estimation with elemental modifiers
  - Healing value estimation
  - Buff/debuff utility weight
  - Multi-target bonuses
- `selectTargets()` - Target selection algorithms
  - All target hint strategies
  - Deterministic randomness with PRNG
  - Edge cases (no valid targets, all targets KO'd)

**Recommended Tests:**
1. AI selects highest damage ability against weak enemies
2. AI targets weakest enemy when using single-target attacks
3. AI prefers AoE when multiple low-HP targets exist
4. AI avoids overkill when hint is set
5. AI falls back to basic attack when no abilities available
6. AI uses healers-first targeting for healer enemies
7. Deterministic target selection with seeded PRNG

---

### 2. BattleService.ts
**Status:** ⚠️ PARTIAL COVERAGE
**Priority:** HIGH
**Lines of Code:** ~894

**Existing Coverage:**
- Used extensively by QueueBattleService tests
- Action execution via `performAction()` tested indirectly
- Status effects tested via status algorithm tests

**Missing Direct Tests:**
- `startBattle()` - Battle initialization
  - Turn order calculation
  - Team validation
  - Enemy validation
- `executeAbility()` - Direct ability execution
  - Multi-hit abilities
  - Splash damage
  - Phase 2 effects (shields, status cleanse)
  - Status chance rolls
- `endTurn()` - Turn transition
  - Status effect tick processing
  - Round advancement
  - Turn order recalculation
- `checkBattleEnd()` - Victory/defeat detection
- `startTurnTick()` - Turn start status processing

**Recommended Tests:**
1. Battle initialization with valid team/enemies
2. Battle initialization rejects empty teams
3. Multi-hit abilities deal cumulative damage
4. Splash damage affects secondary targets
5. Shield status blocks damage
6. Status cleanse removes negative effects
7. Turn end triggers status damage
8. Victory detected when all enemies KO
9. Defeat detected when all players KO
10. Status effects expire correctly

---

### 3. BattleTransaction.ts
**Status:** ❌ NO TESTS
**Priority:** LOW
**Lines of Code:** ~50

**Missing Coverage:**
- Transaction begin/commit/rollback
- State isolation during transactions
- Nested transaction handling (if supported)

**Note:** BattleTransaction is a helper class used internally by BattleService. Testing may be unnecessary if BattleService tests validate state management.

**Recommended Action:** Consider integration tests in BattleService tests rather than unit tests.

---

### 4. DevModeService.ts
**Status:** ❌ NO TESTS
**Priority:** LOW (dev-only)
**Lines of Code:** ~178

**Missing Coverage:**
- `getAllHousesMetadata()` - House metadata generation
  - Correct act assignment (1-7, 8-14, 15-20)
  - Spike house detection (H08, H15)
  - Final boss detection (H20)
  - Reward parsing
- `jumpToHouse()` - House jumping logic
  - Flag setting for completed houses
  - Djinn collection
  - Unit recruitment (battle + story join)
  - Roster deduplication

**Recommended Tests:**
1. getAllHousesMetadata returns 20 houses
2. Houses assigned to correct acts
3. jumpToHouse grants all rewards from previous houses
4. jumpToHouse collects Djinn from completed houses
5. jumpToHouse recruits units without duplicates
6. jumpToHouse sets completion flags

---

### 5. DialogueService.ts
**Status:** ✅ WELL TESTED
**Priority:** COMPLETE
**Existing Coverage:** tests/core/services/DialogueService.test.ts

**Coverage:**
- Dialogue initialization
- Linear dialogue advancement
- Choice branching
- Condition evaluation (flags, items, gold, level)
- Completion detection

**Gap:** None identified. Good coverage.

---

### 6. DjinnService.ts
**Status:** ⚠️ INDIRECT COVERAGE
**Priority:** MEDIUM
**Lines of Code:** ~120

**Existing Coverage:**
- Tested via djinnStandbyEvents.test.ts
- Tested via djinnRecovery.test.ts
- Tested via story-djinn-acquisition.test.ts

**Missing Direct Tests:**
- `collectDjinn()` error cases
  - Djinn doesn't exist
  - Djinn already collected
  - Max collection limit (12)
- `equipDjinn()` edge cases
  - Not collected error
  - Already equipped error
  - Slot replacement logic
  - Tracker initialization
- `unequipDjinn()` validation
  - Not equipped error

**Recommended Tests:**
1. collectDjinn rejects invalid Djinn ID
2. collectDjinn rejects duplicate collection
3. collectDjinn enforces 12-Djinn limit
4. equipDjinn rejects uncollected Djinn
5. equipDjinn replaces Djinn in full slots
6. unequipDjinn removes from equipped list
7. equipDjinn initializes trackers correctly

---

### 7. EncounterService.ts
**Status:** ❌ NO TESTS
**Priority:** CRITICAL
**Lines of Code:** ~160

**Missing Coverage:**
- `loadEncounter()` - Encounter lookup
  - Valid encounter ID
  - Invalid encounter ID returns null
- `createBattleFromEncounter()` - Battle state creation
  - Enemy instantiation with unique IDs
  - Battle metadata assignment (encounterId, difficulty, isBossBattle)
  - Error handling for missing enemies
  - Error handling for invalid encounters
- `getChapter1Encounters()` - Encounter sequencing
  - Returns correct order
  - Includes dynamically discovered encounters
- `isBossEncounter()` - Boss detection
- `rollForRandomEncounter()` - Encounter probability
  - Returns true based on rate
  - Deterministic with PRNG
- `selectRandomEncounter()` - Pool selection
  - Returns random encounter from pool
  - Handles empty pool
  - Deterministic with PRNG
- `processRandomEncounter()` - Combined logic
  - Triggers encounter based on rate + pool
  - Returns null when no encounter

**Recommended Tests:**
1. loadEncounter returns valid encounter
2. loadEncounter returns null for invalid ID
3. createBattleFromEncounter creates battle with enemies
4. createBattleFromEncounter assigns unique enemy IDs
5. createBattleFromEncounter sets boss flag correctly
6. getChapter1Encounters returns correct sequence
7. rollForRandomEncounter triggers based on rate
8. selectRandomEncounter returns deterministic encounter
9. processRandomEncounter returns null when rate not met
10. processRandomEncounter returns encounter when triggered

---

### 8. OverworldService.ts
**Status:** ✅ WELL TESTED
**Priority:** COMPLETE
**Existing Coverage:** tests/core/services/OverworldService.test.ts

**Coverage:**
- Movement validation (`canMoveTo`)
- Movement processing (`processMovement`)
- Trigger detection
- Boundary checks
- NPC collision

**Gap:** None identified. Good coverage.

---

### 9. QueueBattleService.ts
**Status:** ✅ WELL TESTED
**Priority:** COMPLETE
**Existing Coverage:**
- tests/core/services/QueueBattleService.test.ts
- tests/core/services/executePlayerActionsPhase.test.ts
- tests/core/services/executeEnemyActionsPhase.test.ts
- tests/core/services/checkBattleEndPhase.test.ts
- tests/core/services/transitionToPlanningPhase.test.ts
- tests/core/services/validateQueueForExecution.test.ts
- tests/core/services/manaGeneration.test.ts
- tests/core/services/djinnStandbyEvents.test.ts
- tests/core/services/djinnRecovery.test.ts
- tests/core/services/queue-battle.test.ts
- tests/core/services/preview-determinism.test.ts

**Coverage:**
- Queue action management
- Mana deduction/refund
- Djinn queueing
- Round execution
- Action sorting by SPD
- Retargeting logic
- Victory/defeat detection
- Planning phase transitions
- Djinn recovery system
- Deterministic execution

**Gap:** Excellent coverage. Comprehensive integration and unit tests.

---

### 10. RewardsService.ts
**Status:** ⚠️ INDIRECT COVERAGE
**Priority:** MEDIUM
**Lines of Code:** ~97

**Existing Coverage:**
- Tested via predeterminedRewards.test.ts

**Missing Direct Tests:**
- `processVictory()` edge cases
  - No survivors (should this error?)
  - Missing encounter ID error
  - Djinn reset after battle
  - Equipment resolution (fixed, choice, none)
- `resolveEquipmentReward()` validation
  - Missing equipment ID error
  - All reward types (none, fixed, choice)

**Recommended Tests:**
1. processVictory calculates rewards correctly
2. processVictory resets Djinn to Set state
3. processVictory resolves fixed equipment
4. processVictory resolves equipment choice
5. processVictory handles no equipment reward
6. resolveEquipmentReward throws on invalid ID

---

### 11. RngService.ts
**Status:** ❌ NO TESTS
**Priority:** LOW
**Lines of Code:** ~37

**Missing Coverage:**
- `createRng()` - PRNG creation from seed
- `createRandomRng()` - PRNG from timestamp
- `cloneRng()` - PRNG cloning for branching
- `getRngSeed()` - Seed extraction

**Note:** This is a thin wrapper around PRNG. If PRNG itself is tested, these functions may not need extensive testing.

**Recommended Tests:**
1. createRng produces deterministic sequence
2. cloneRng creates independent branches
3. getRngSeed returns correct seed
4. createRandomRng produces different seeds

---

### 12. SaveService.ts
**Status:** ✅ WELL TESTED
**Priority:** COMPLETE
**Existing Coverage:** tests/core/services/SaveService.test.ts

**Coverage:**
- Checksum validation
- Backup system
- Progress save/load
- Battle save/load
- Auto-save
- Slot management
- Metadata extraction
- Error handling

**Gap:** Excellent coverage. Comprehensive edge case testing.

---

### 13. ShopService.ts
**Status:** ❌ NO TESTS
**Priority:** HIGH
**Lines of Code:** ~120

**Missing Coverage:**
- `canAffordItem()` - Affordability check
  - Valid item
  - Invalid item
  - Sufficient gold
  - Insufficient gold
- `buyItem()` - Purchase logic
  - Valid purchase
  - Invalid item ID
  - Insufficient gold
  - Gold deduction
- `purchaseStarterKit()` - Kit purchasing
  - Element-based kit selection
  - Gold deduction
  - Equipment retrieval
  - Insufficient gold error
  - Missing equipment error
- `purchaseUnitEquipment()` - Unit-specific purchase
  - Element compatibility check
  - Gold validation
- `getPriceByTier()` - Tier pricing

**Recommended Tests:**
1. canAffordItem returns true with sufficient gold
2. canAffordItem returns false with insufficient gold
3. buyItem succeeds with valid item and gold
4. buyItem fails with insufficient gold
5. purchaseStarterKit returns correct equipment for element
6. purchaseStarterKit deducts correct gold
7. purchaseUnitEquipment validates element compatibility
8. getPriceByTier returns correct prices

---

### 14. StoryService.ts
**Status:** ✅ WELL TESTED
**Priority:** COMPLETE
**Existing Coverage:**
- tests/core/services/StoryService.test.ts
- tests/core/services/story.test.ts
- tests/core/services/story-integration.test.ts
- tests/core/services/story-djinn-acquisition.test.ts

**Coverage:**
- Story progression
- Flag management
- Chapter advancement
- Unit recruitment via flags
- Djinn acquisition via flags
- House unlocking
- Encounter completion

**Gap:** Excellent coverage. Multiple integration tests.

---

### 15. TowerService.ts
**Status:** ❌ NO TESTS
**Priority:** CRITICAL
**Lines of Code:** ~275

**Missing Coverage:**
- `createTowerRun()` - Tower run initialization
  - Floor sorting
  - Stats initialization
  - History initialization
  - Config application
  - Error on empty floors
- `getCurrentFloor()` - Floor retrieval
  - Valid floor index
  - Out of bounds returns null
- `isRestFloor()` - Rest floor detection
- `advanceToNextFloor()` - Floor advancement
  - Index increment
  - Completion detection
  - Failed state preservation
- `recordBattleResult()` - Battle result recording
  - Stats update (victories, defeats, retreats)
  - History update
  - Floor advancement on victory
  - Pending rewards accumulation
  - Completion detection
  - Error on rest floor
- `completeRestFloor()` - Rest floor completion
  - History update with rest summary
  - Floor advancement
  - Highest floor tracking
  - Error on battle floor
- `clearPendingRewards()` - Reward clearing
- `calculateEnemyScaling()` - Scaling calculation
  - Floor-based multiplier
  - Difficulty bonus (hard mode)
  - Level delta calculation

**Recommended Tests:**
1. createTowerRun initializes tower state correctly
2. createTowerRun sorts floors by floorNumber
3. getCurrentFloor returns correct floor
4. getCurrentFloor returns null at end
5. isRestFloor detects rest floors
6. advanceToNextFloor increments floor index
7. advanceToNextFloor sets completion flag
8. recordBattleResult updates stats correctly
9. recordBattleResult advances floor on victory
10. recordBattleResult accumulates pending rewards
11. recordBattleResult detects run completion
12. completeRestFloor records rest summary
13. calculateEnemyScaling applies floor multiplier
14. calculateEnemyScaling applies difficulty bonus

---

### 16. types.ts
**Status:** N/A (Type definitions)
**Priority:** N/A

Type-only file. No tests needed.

---

### 17. index.ts
**Status:** N/A (Barrel export)
**Priority:** N/A

Barrel export file. No tests needed.

---

## Priority Ranking

### Tier 1: Critical (Block Production)
1. **AIService** - Core enemy AI logic, affects all battles
2. **EncounterService** - Battle creation, affects all combat scenarios
3. **TowerService** - Battle Tower mode, significant feature
4. **ShopService** - Equipment purchasing, affects progression

### Tier 2: High (Important Features)
5. **BattleService** - Direct tests for ability execution edge cases
6. **RewardsService** - Victory processing edge cases
7. **DjinnService** - Error handling and edge cases

### Tier 3: Medium (Nice to Have)
8. **DevModeService** - Development tools (low priority)
9. **RngService** - Thin wrapper (low ROI)

### Tier 4: Complete (No Action Needed)
10. QueueBattleService ✅
11. DialogueService ✅
12. StoryService ✅
13. SaveService ✅
14. OverworldService ✅

---

## Coverage Gaps Summary

### Orchestration Testing
Services are **orchestrators** that combine algorithms and manage state. Tests should focus on:
1. **Error handling** - Invalid inputs, missing data, state violations
2. **State mutations** - Correct state updates, immutability
3. **Integration** - Algorithms + models working together
4. **Edge cases** - Empty lists, null values, boundary conditions

### Common Missing Patterns
- **Validation errors** - Most services lack error case tests
- **Empty/null handling** - Edge cases with missing data
- **State transitions** - Complex state changes (e.g., battle phases)
- **Determinism** - RNG-based logic needs seeded tests

### Testing Strategy
1. Use `test()` not `it()`
2. Use `mk*` factories from `src/test/factories.ts`
3. Use `makePRNG(seed)` for deterministic RNG
4. Focus on **orchestration**, not re-testing algorithms
5. Test **Result types** for error cases
6. Validate **state immutability**

---

## Recommended Test Files to Create

1. `tests/core/services/AIService.test.ts` (CRITICAL)
2. `tests/core/services/EncounterService.test.ts` (CRITICAL)
3. `tests/core/services/TowerService.test.ts` (CRITICAL)
4. `tests/core/services/ShopService.test.ts` (HIGH)
5. `tests/core/services/BattleService.test.ts` (HIGH - enhance existing)
6. `tests/core/services/RewardsService.test.ts` (MEDIUM)
7. `tests/core/services/DjinnService.test.ts` (MEDIUM)
8. `tests/core/services/DevModeService.test.ts` (LOW)
9. `tests/core/services/RngService.test.ts` (LOW)

---

## Next Steps

1. Write tests for Tier 1 (Critical) services first
2. Run `pnpm test` after each service to verify no regressions
3. Focus on error cases and edge cases (most missing)
4. Ensure deterministic tests with seeded PRNG
5. Validate state immutability in all tests

---

**Assessment Complete**
**Next Action:** Begin writing tests for AIService (Tier 1, Critical)
