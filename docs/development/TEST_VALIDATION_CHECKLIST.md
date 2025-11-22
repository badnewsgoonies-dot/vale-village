# Test Validation Checklist

## Purpose
Validate all 34 failing tests to ensure they:
1. Test valid game mechanics (not test-specific workarounds)
2. Have proper dependencies and setup
3. Don't have missing prerequisites
4. Are not flaky or timing-dependent
5. Use correct helper functions

## Validation Criteria

### ✅ Valid Test
- Tests actual game mechanic
- Uses proper helpers (`completeBattle`, `completeBattleFlow`, etc.)
- Has proper setup/teardown
- Checks for real game state, not test artifacts

### ❌ Invalid Test
- Tests test-specific workarounds
- Missing dependencies or setup
- Checks for things that don't exist in game
- Flaky or timing-dependent without proper waits
- Uses deprecated or incorrect helpers

## Failing Tests Analysis

### Category 1: Tests Using `completeBattle` (Should benefit from story flag fix)
- `auto-heal.spec.ts` - 2 tests
- `progressive-unlock.spec.ts` - 6 tests  
- `house-01-recruitment.spec.ts` - 2 tests
- `recruited-units-in-battle.spec.ts` - 2 tests
- `rewards-integration.spec.ts` - 1 test
- `epic-gameplay-journey.spec.ts` - 1 test
- `five-houses-progression.spec.ts` - 1 test
- `full-gameplay-loop.spec.ts` - 1 test
- `comprehensive-gameplay-menus.spec.ts` - 1 test

**Total: 17 tests**

### Category 2: Tests Using `completeBattleFlow` (Should benefit from story flag fix)
- `house-01-recruitment.spec.ts` - Already counted above
- `epic-gameplay-journey.spec.ts` - Already counted above
- `five-houses-progression.spec.ts` - Already counted above
- `full-gameplay-loop.spec.ts` - Already counted above

**Total: Overlap with Category 1**

### Category 3: Tests Not Using Battle Helpers (May have different issues)
- `battle-execution.spec.ts` - 1 test (battle UI/execution)
- `combat-mechanics.spec.ts` - 1 test (combat calculations)
- `djinn-collection.spec.ts` - 3 tests (UI screens)
- `djinn-standby.spec.ts` - 1 test (Djinn mechanics)
- `djinn-state-transitions.spec.ts` - 2 tests (Djinn mechanics)
- `shop-equip-integration.spec.ts` - 5 tests (shop/equipment)
- `shop-interactions.spec.ts` - 3 tests (shop UI)
- `smoke-recruitment.spec.ts` - 1 test (uses jumpToHouse)

**Total: 17 tests**

## Next Steps
1. Validate each test file for proper setup
2. Check for missing dependencies
3. Verify tests use correct helpers
4. Identify root causes
5. Fix systematically
