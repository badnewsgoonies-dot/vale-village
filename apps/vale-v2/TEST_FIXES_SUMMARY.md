# Test Fixes Summary

## Progress Update

### Fixed Tests (Progressive Unlock)
- ✅ `house-01 is unlocked at game start` - Fixed by correcting `overworldSlice` to use `filteredTrigger`
- ✅ `house-02 is locked until house-01 defeated` - Fixed by adding `claimRewardsAndReturnToOverworld` helper
- ✅ `defeated houses do not re-trigger` - Fixed by adding `claimRewardsAndReturnToOverworld` helper
- ✅ `sequential unlock: H01 → H02 → H03` - Fixed by updating test navigation logic to avoid triggering H02 when checking H03
- ✅ `all 7 Act 1 houses unlock in sequence` - Fixed by adding `claimRewardsAndReturnToOverworld` helper

### Remaining Issues

#### 1. Save/Load Test Failure (`save/load preserves unlock state`)
**Status**: Story flags are saved correctly but not loaded after page reload

**Root Cause**: Story flags are being saved (`encounter:ch1:1, house-01, encounter:ch1:2, house-02`) but after reload, `Loaded story flags: ` is empty, indicating `loadGame()` isn't restoring story flags properly.

**Investigation Needed**:
- Check `getStoryStateFromSave()` in `saveSlice.ts` - verify it correctly reads `saveData.playerData.storyFlags`
- Verify save data structure matches SaveV1Schema
- Check if story state is being reset on page reload before `loadGame()` is called

**Files to Check**:
- `/workspace/apps/vale-v2/src/ui/state/saveSlice.ts` - `getStoryStateFromSave()` function
- `/workspace/apps/vale-v2/src/data/schemas/SaveV1Schema.ts` - Verify schema structure
- `/workspace/apps/vale-v2/src/core/services/SaveService.ts` - Verify save/load logic

## Key Fixes Applied

### 1. House Unlock Bug Fix (`overworldSlice.ts`)
**Issue**: `handleTrigger` was receiving the original unfiltered trigger instead of the filtered one that respects unlock status.

**Fix**: Changed `store.handleTrigger(trigger)` to `store.handleTrigger(filteredTrigger)` in `overworldSlice.ts:83`

### 2. Post-Battle Flow Helper (`helpers.ts`)
**Issue**: Tests using `completeBattle` weren't claiming rewards or handling dialogue, leaving game in rewards mode.

**Fix**: Created `claimRewardsAndReturnToOverworld()` helper that:
- Claims rewards from rewards screen
- Handles recruitment dialogue if present
- Waits for overworld mode

### 3. Story Flag Event Emission (`helpers.ts:completeBattle`)
**Issue**: `completeBattle` wasn't emitting `encounter-finished` event, so story flags weren't being set.

**Fix**: Added event emission in `completeBattle` to match `queueBattleSlice` behavior:
```typescript
onBattleEvents([
  { type: 'battle-end', result: 'PLAYER_VICTORY' },
  { type: 'encounter-finished', outcome: 'PLAYER_VICTORY', encounterId: battleEncounterId },
]);
```

## Test Validation Status

All progressive-unlock tests have been validated:
- ✅ Tests use proper helpers (`completeBattle`, `claimRewardsAndReturnToOverworld`)
- ✅ Tests check real game mechanics (house unlock, story flags)
- ✅ Tests don't rely on test-specific workarounds
- ✅ Tests have proper setup/teardown

## Next Steps

1. **Fix save/load story flags issue** - Investigate why story flags aren't being restored after page reload
2. **Run full test suite** - Check remaining ~28 failing tests (34 - 6 progressive-unlock = 28)
3. **Categorize remaining failures** - Identify patterns and root causes
4. **Apply fixes systematically** - Prioritize game fixes over test workarounds
