# Fix Prompt: Miscellaneous Test Failures

**Priority:** LOW  
**Category:** Edge Cases  
**Tests Affected:** 4 tests across multiple files

---

## Problem

Various test failures in movement, encounter selection, rewards, and collision:

1. **Movement:** `moves in all four directions` - Y position is 10 instead of 11
2. **Encounter Selection:** `triggers battle encounter at correct position` - Gets `house-03` instead of `house-01` or `house-02`
3. **Rewards:** `distributes XP, gold, and equipment from single battle` - XP is 50/60 instead of expected 70
4. **Collision:** `walls block movement` - X position changed from 3 to 2 (wall collision not working)

---

## Fix 1: Movement Issue

**Problem:** Y position doesn't increment correctly when moving down.

**Investigation:**
- Check movement handler in `overworldSlice.ts`
- Verify arrow key handling (ArrowDown should increment Y)
- Check if position updates correctly

**Fix:**
- Ensure ArrowDown increments `playerPosition.y`
- Verify position updates are applied correctly

---

## Fix 2: Encounter Selection Issue

**Problem:** Wrong encounter selected from encounter pool.

**Investigation:**
- Review encounter selection logic
- Check encounter pool filtering
- Verify random selection works correctly

**Fix:**
- Filter encounter pool to only unlocked encounters
- Ensure selection prioritizes correct encounters
- See `PROMPT_PROGRESSIVE_UNLOCK_FIX.md` for related fixes

---

## Fix 3: Rewards Issue

**Problem:** XP reward doesn't match expected value (50/60 instead of 70).

**Investigation:**
- Review encounter definitions for XP values
- Check rewards calculation logic
- Verify XP distribution is correct

**Fix:**
- Update test expectations to match actual encounter XP values
- Or fix encounter definitions if XP values are incorrect

---

## Fix 4: Wall Collision Issue

**Problem:** Wall collision not working - player can move through walls.

**Investigation:**
- Review collision detection in `overworldSlice.ts`
- Check tile type checking (wall tiles should block movement)
- Verify position updates are blocked when collision detected

**Fix:**
- Ensure wall tiles block movement
- Verify position doesn't update when collision detected
- Check step counter doesn't increment on blocked moves

---

## Files to Check

1. `apps/vale-v2/src/ui/state/overworldSlice.ts` - Movement and collision
2. `apps/vale-v2/src/data/definitions/encounters.ts` - XP values
3. `apps/vale-v2/src/data/definitions/maps.ts` - Tile types

---

## Acceptance Criteria

✅ Movement works correctly in all four directions  
✅ Correct encounter selected from pool  
✅ XP rewards match expected values  
✅ Wall collision blocks movement  
✅ All 4 tests pass

---

## Testing

After fixes, run:
```bash
cd apps/vale-v2
pnpm test:e2e tests/e2e/game-start.spec.ts
pnpm test:e2e tests/e2e/rewards-integration.spec.ts
pnpm test:e2e tests/e2e/wall-collision.spec.ts
```

Expected: All tests pass.

