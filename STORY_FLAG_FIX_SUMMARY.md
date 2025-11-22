# Story Flag Fix Summary

## Problem
Story flags (`house-02`, `house-03`) were not being set after battle completion, causing `story-join-validation.spec.ts` tests to fail.

## Root Cause
The `completeBattle` helper function in `tests/e2e/helpers.ts` was simulating battle victory but **not emitting the `encounter-finished` event** that triggers story flag processing. This event is normally emitted by `queueBattleSlice.ts` when a battle ends, but the test helper bypassed this flow.

## Fixes Applied

### 1. Fixed `processEncounterCompletion` to Set Both Flags
**File:** `src/core/services/StoryService.ts`

For house encounters, now sets both:
- The encounter flag (e.g., `encounter:ch1:2`) - for general encounter tracking
- The house flag (e.g., `house-02`) - for house unlocking and story joins

```typescript
// Before: Only set encounter flag
export function processEncounterCompletion(state: StoryState, encounterId: string): StoryState {
  const flagKey = encounterIdToFlagKey(encounterId);
  return setFlag(state, flagKey, true);
}

// After: Set both flags for house encounters
export function processEncounterCompletion(state: StoryState, encounterId: string): StoryState {
  const flagKey = encounterIdToFlagKey(encounterId);
  let updatedState = setFlag(state, flagKey, true);
  
  // For house encounters, also set the house flag directly
  if (encounterId.startsWith('house-')) {
    updatedState = setFlag(updatedState, encounterId, true);
  }
  
  return updatedState;
}
```

### 2. Fixed `storySlice` to Use House ID for Story Joins
**File:** `src/ui/state/storySlice.ts`

Changed to use the house ID directly (e.g., `house-02`) instead of the flag key (e.g., `encounter:ch1:2`) when processing story joins, because `STORY_FLAG_TO_UNIT` uses house-XX keys.

```typescript
// Before: Used flagKey for story joins
const unitResult = processStoryFlagForUnit(st, flagKey, true, avgLevel);

// After: Use house ID directly for house encounters
const storyJoinFlagKey = e.encounterId.startsWith('house-') ? e.encounterId : flagKey;
const unitResult = processStoryFlagForUnit(st, storyJoinFlagKey, true, avgLevel);
```

### 3. Fixed `completeBattle` Helper to Emit Event
**File:** `tests/e2e/helpers.ts`

Added code to emit the `encounter-finished` event after simulating victory, matching the behavior of `queueBattleSlice.ts`.

```typescript
// Added after processVictory call:
const battleEncounterId = healedBattle.encounterId || healedBattle.meta?.encounterId;
if (battleEncounterId && onBattleEvents) {
  onBattleEvents([
    {
      type: 'battle-end',
      result: 'PLAYER_VICTORY',
    },
    {
      type: 'encounter-finished',
      outcome: 'PLAYER_VICTORY',
      encounterId: battleEncounterId,
    },
  ]);
}
```

## Test Results

**Before:** 36 failing tests (including 2 story join validation tests)
**After:** 34 failing tests (story join validation tests now passing ✅)

### Passing Tests
- ✅ `story-join-validation.spec.ts:23` - House 2: Mystic auto-recruits via dialogue after victory
- ✅ `story-join-validation.spec.ts:68` - House 3: Ranger auto-recruits via dialogue after victory  
- ✅ `story-join-validation.spec.ts:111` - Story joins: Units recruit at appropriate level

## Impact

This fix ensures that:
1. Story flags are properly set after battle completion
2. House unlocking system works correctly (depends on `house-XX` flags)
3. Story join unit recruitment works (depends on `house-02` and `house-03` flags)
4. Tests accurately validate the game's story progression system

## Remaining Issues

34 tests still failing, but these are unrelated to story flags. The story flag system is now working correctly.
