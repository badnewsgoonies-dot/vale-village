# Fix Prompt: Progressive Unlock System Issues

**Priority:** MEDIUM  
**Category:** Progression System  
**Tests Affected:** 6 tests in `progressive-unlock.spec.ts`

---

## Problem

Progressive unlock tests fail due to:
1. Wrong encounter IDs (getting `house-03` instead of `house-01`)
2. Defeated houses still triggering battles (should be locked)
3. Mode is 'team-select' when it should be 'overworld' (battles triggering when they shouldn't)

**Test Failures:**
1. `house-01 is unlocked at game start` - Gets `house-03` instead of `house-01`
2. `house-02 is locked until house-01 defeated` - Mode is 'team-select' instead of 'overworld'
3. `defeated houses do not re-trigger` - Mode is 'team-select' instead of 'overworld'
4. `sequential unlock: H01 → H02 → H03` - Mode is 'team-select' instead of 'overworld'
5. `all 7 Act 1 houses unlock in sequence` - Gets wrong encounter IDs
6. `save/load preserves unlock state` - Mode is 'team-select' instead of 'overworld'

---

## Investigation Steps

1. **Check encounter selection:**
   - Review how encounters are selected from encounter pool
   - Verify `encounterPool` in map definition contains correct encounters
   - Check if random selection is working correctly

2. **Check house unlock logic:**
   - Review `StoryService.ts` for `isHouseUnlocked()` function
   - Verify house unlock state is checked before battle triggers
   - Check if defeated houses are marked as unlocked

3. **Check battle trigger logic:**
   - Review `overworldSlice.ts` or trigger handler
   - Verify triggers check unlock state before firing
   - Check if defeated houses are skipped

4. **Check story flags:**
   - Verify house defeat sets story flags correctly
   - Check if `house:liberated:01` flag is set after defeating house-01
   - Verify unlock state is derived from story flags

---

## Expected Behavior

**House unlock logic:**
- `house-01` is unlocked at game start (no flags required)
- `house-02` is locked until `house:liberated:01` flag is set
- `house-03` is locked until `house:liberated:02` flag is set
- Defeated houses don't re-trigger (check story flags before triggering)

**Encounter selection:**
- When multiple houses are unlocked, selection should prioritize:
  1. First unlocked house that hasn't been defeated
  2. If all unlocked houses defeated, don't trigger battle
- Encounter pool should only contain unlocked encounters

**Battle trigger:**
- Check `isHouseUnlocked()` before triggering battle
- If house is locked, don't trigger (mode stays 'overworld')
- If house is defeated, don't trigger (mode stays 'overworld')

---

## Files to Check

1. `apps/vale-v2/src/core/services/StoryService.ts` - `isHouseUnlocked()` function
2. `apps/vale-v2/src/ui/state/overworldSlice.ts` - Battle trigger logic
3. `apps/vale-v2/src/data/definitions/maps.ts` - Encounter pool definitions
4. `apps/vale-v2/src/core/services/EncounterService.ts` - Encounter selection

---

## Fix Requirements

1. **Fix encounter selection:**
   - Filter encounter pool to only unlocked encounters
   - Prioritize first unlocked, undefeated encounter
   - Don't select defeated encounters

2. **Fix house unlock check:**
   - Ensure `isHouseUnlocked()` checks story flags correctly
   - Verify house-01 is always unlocked
   - Verify subsequent houses require previous house defeat

3. **Fix battle trigger:**
   - Check unlock state before triggering battle
   - Don't trigger if house is locked
   - Don't trigger if house is already defeated
   - Set mode to 'overworld' if trigger is blocked

4. **Fix story flag setting:**
   - Ensure house defeat sets correct story flag
   - Format: `house:liberated:XX` where XX is house number

---

## Acceptance Criteria

✅ House-01 is unlocked at game start  
✅ House-02 is locked until house-01 defeated  
✅ Defeated houses don't re-trigger  
✅ Sequential unlock works (H01 → H02 → H03)  
✅ All 7 Act 1 houses unlock in sequence  
✅ Save/load preserves unlock state  
✅ Mode stays 'overworld' when house is locked/defeated  
✅ All 6 tests in `progressive-unlock.spec.ts` pass

---

## Testing

After fixes, run:
```bash
cd apps/vale-v2
pnpm test:e2e tests/e2e/progressive-unlock.spec.ts
```

Expected: All 6 tests pass.

---

## Notes

- Progressive unlock is critical for game progression
- Story flags must be set correctly after house defeats
- Encounter pool should dynamically filter based on unlock state

