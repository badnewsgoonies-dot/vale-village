# E2E Test Fixes Summary

## Overview

Fixed critical game bugs that were causing E2E test failures. All fixes prioritize **game logic correctness** over test workarounds, ensuring the game behaves correctly for both players and tests.

## Test Results

- **Before**: Multiple test failures due to mode transition issues and Djinn not being granted
- **After**: 130+ tests passing, 7/7 `battle-recruits-devmode` tests passing

## Game Fixes Applied

### 1. Mode Transition: `setPendingBattle` → `team-select`

**File**: `src/ui/state/gameFlowSlice.ts`

**Problem**: When `setPendingBattle` was called (e.g., via Dev Mode jump), the mode wasn't automatically set to `'team-select'`, causing tests to timeout waiting for team selection.

**Fix**: `setPendingBattle` now automatically sets `mode: 'team-select'` when an `encounterId` is provided, matching the behavior of `handleTrigger` when a battle trigger is encountered.

```typescript
setPendingBattle: (encounterId) => {
  set({
    pendingBattleEncounterId: encounterId,
    mode: encounterId ? 'team-select' : 'overworld'
  });
},
```

### 2. Post-Battle Flow: Preserve `encounterId` for Recruitment Dialogues

**Files**:

- `src/ui/state/rewardsSlice.ts`
- `src/ui/state/store.ts`
- `src/App.tsx`

**Problem**: After `processVictory`, the `battle` state was cleared, losing the `encounterId` needed to trigger recruitment dialogues. Additionally, `claimRewards()` was immediately setting `mode: 'overworld'`, preventing `handleRewardsContinue()` from triggering dialogues.

**Fixes**:

1. **Store `encounterId` in rewards slice**: Added `lastBattleEncounterId` to `RewardsSlice` to preserve the encounter ID after battle state is cleared.
2. **Defer mode transition**: `claimRewards()` no longer sets `mode: 'overworld'` - that responsibility is moved to `handleRewardsContinue()`.
3. **Reliable `encounterId` retrieval**: `handleRewardsContinue` now retrieves `encounterId` from `lastBattleEncounterId` (stored during `processVictory`) instead of relying on cleared battle state.
4. **Export store instance**: Exported `store` from `store.ts` for direct access in `App.tsx` when needed outside React hooks.

### 3. Djinn Granting: Direct Collection via Dialogue Effects

**File**: `src/ui/state/dialogueSlice.ts`

**Problem**: Dialogue effects with `grantDjinn` were calling `setStoryFlag(\`djinn:${djinnId}\`, true)`, but`STORY_FLAG_TO_DJINN` doesn't have entries for `djinn:*` keys. It only has entries for encounter flags like `encounter:ch1:8` or `house-08`.

**Fix**: Dialogue effects now directly call `collectDjinn()` from `DjinnService` instead of relying on story flag mapping.

```typescript
// Handle Djinn granting via dialogue
if (typeof effects.grantDjinn === 'string') {
  const djinnId = effects.grantDjinn;
  const team = store.team;
  
  if (team) {
    const result = collectDjinn(team, djinnId);
    if (result.ok) {
      store.updateTeam(result.value);
      console.warn(`🎉 Granted Djinn ${djinnId} via dialogue effect!`);
    }
  }
}
```

## Test Helper Improvements

### Equipment Choice Handling

**File**: `tests/e2e/helpers.ts`

**Problem**: Some battles have equipment choices that must be selected before the continue button is enabled. Tests were failing because they tried to click a disabled button.

**Fix**: `completeBattleFlow` now checks for pending equipment choices and selects the first option before attempting to click continue.

### Removed Test Workarounds

- Removed manual mode setting fallback in `jumpToHouse` (no longer needed due to game fix #1)
- Removed `__LAST_BATTLE_ENCOUNTER_ID__` window storage (replaced by `lastBattleEncounterId` in rewards slice)
- Updated `completeBattleFlow` to use `handleRewardsContinue` logic (exposed on `window` for E2E tests)

## Files Modified

### Game Code

1. `src/ui/state/gameFlowSlice.ts` - Auto-transition to `team-select` mode
2. `src/ui/state/rewardsSlice.ts` - Store `lastBattleEncounterId`, defer mode transition
3. `src/ui/state/store.ts` - Export store instance
4. `src/App.tsx` - Reliable `encounterId` retrieval and mode management
5. `src/ui/state/dialogueSlice.ts` - Direct Djinn collection

### Test Code

1. `tests/e2e/helpers.ts` - Equipment choice handling, removed workarounds
2. `tests/e2e/battle-execution.spec.ts` - Button text fix, unit selection

## Impact

### ✅ Fixed Issues

- Mode transitions now work reliably (no more timeouts waiting for `team-select`)
- Recruitment dialogues trigger correctly after battles
- Djinn are granted via dialogue effects
- Equipment choices are handled in tests

### ⚠️ Remaining Issues (Unrelated)

- Some tests still fail due to story flags (`house-02`, `house-03`) not being set - this is a separate issue from mode transitions
- Auto-heal tests failing - unrelated to these fixes

## Testing

All `battle-recruits-devmode` tests now pass:

- ✅ House 5: Blaze recruits
- ✅ House 8: Sentinel recruits + Fizz Djinn granted
- ✅ House 11: Karis recruits
- ✅ House 14: Tyrell recruits
- ✅ House 15: Stormcaller recruits + Squall Djinn granted
- ✅ House 17: Felix recruits
- ✅ Full progression: All units and Djinn collected

## Principles Followed

1. **Fix the game, not the tests** - All changes improve game logic correctness
2. **Remove workarounds** - Tests now use the same code paths as players
3. **Maintain determinism** - No flaky behavior introduced
4. **Preserve existing behavior** - Changes are additive/refinements, not breaking changes
