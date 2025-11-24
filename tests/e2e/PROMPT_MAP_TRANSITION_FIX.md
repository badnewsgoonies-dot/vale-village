# Fix Prompt: Map Transitions Not Working

**Priority:** LOW  
**Category:** Navigation System  
**Tests Affected:** 3 tests in `map-transitions.spec.ts`

---

## Problem

Map transition tests fail because transitions don't execute correctly or player position doesn't update.

**Test Failures:**
1. `transitions back from weapon-shop-interior to vale-village` - Already in vale-village (transition didn't happen)
2. `transition preserves overworld mode` - Mode is 'team-select' instead of 'overworld'
3. `can move after transition` - Already in vale-village (transition didn't happen)

---

## Investigation Steps

1. **Check transition trigger:**
   - Review transition trigger definitions in maps
   - Verify transition triggers fire when player position matches
   - Check if `handleTrigger()` is called for transitions

2. **Check transition execution:**
   - Review `overworldSlice.ts` for `teleportPlayer()` function
   - Verify map ID and position update correctly
   - Check if mode is preserved during transition

3. **Check trigger detection:**
   - Verify transition triggers are detected correctly
   - Check if trigger type is 'transition' and data contains `targetMap` and `targetPos`

---

## Expected Behavior

**When player walks to transition trigger:**
1. Trigger detection fires (transition trigger at same position as player)
2. `handleTrigger()` is called with transition trigger data
3. `teleportPlayer(targetMap, targetPos)` is called
4. `currentMapId` updates to `targetMap`
5. `playerPosition` updates to `targetPos`
6. Mode stays 'overworld' (unless battle/shop triggered)

---

## Files to Check

1. `apps/vale-v2/src/ui/state/overworldSlice.ts` - `teleportPlayer()` function
2. `apps/vale-v2/src/data/definitions/maps.ts` - Transition trigger definitions
3. `apps/vale-v2/src/ui/components/OverworldMap.tsx` - Trigger handling

---

## Fix Requirements

1. **Fix transition execution:**
   - Ensure `teleportPlayer()` updates `currentMapId` and `playerPosition`
   - Verify transition triggers call `teleportPlayer()` correctly
   - Preserve mode during transition (unless other trigger fires)

2. **Fix trigger detection:**
   - Ensure transition triggers fire when player position matches
   - Verify trigger data contains correct `targetMap` and `targetPos`

---

## Acceptance Criteria

✅ Transition from vale-village to weapon-shop-interior works  
✅ Transition back from weapon-shop-interior to vale-village works  
✅ Mode preserved during transition (stays 'overworld')  
✅ Player can move after transition  
✅ All 3 tests in `map-transitions.spec.ts` pass

---

## Testing

After fixes, run:
```bash
cd apps/vale-v2
pnpm test:e2e tests/e2e/map-transitions.spec.ts
```

Expected: All 3 tests pass.

