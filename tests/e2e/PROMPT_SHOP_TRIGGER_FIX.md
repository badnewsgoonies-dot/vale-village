# Fix Prompt: Shop Triggers Not Working

**Priority:** MEDIUM  
**Category:** Shop System  
**Tests Affected:** 3 tests in `shop-interactions.spec.ts`

---

## Problem

All shop interaction tests timeout waiting for 'shop' mode. Shop never triggers when player walks to shop trigger position.

**Test Failures (all timeouts):**
1. `triggers shop when walking to shop trigger` - Timeout waiting for 'shop' mode
2. `shop screen displays and can be closed` - Timeout
3. `player position preserved after exiting shop` - Timeout

**Shop Tested:** Shop trigger at position (12, 5) in `vale-village` map

---

## Investigation Steps

1. **Check shop trigger detection:**
   - Review `overworldSlice.ts` or movement handler
   - Verify shop triggers fire when player position matches trigger position
   - Check if `handleTrigger()` is called for shops

2. **Check shop system:**
   - Review `gameFlowSlice.ts` or shop state management
   - Verify shop screen opens when trigger fires
   - Check if mode transitions to 'shop' when shop opens

3. **Check shop data:**
   - Verify shop trigger exists in map definition:
     ```typescript
     // In maps.ts, vale-village should have:
     { id: 'shop-vale-armory', type: 'shop', position: { x: 12, y: 5 }, data: { shopId: 'vale-armory' } }
     ```
   - Verify shop definition exists in shop data

4. **Check trigger system:**
   - Review how triggers are processed in overworld
   - Verify shop triggers are handled correctly
   - Check if trigger detection happens on movement or on position match

---

## Expected Behavior

**When player walks to shop trigger position:**
1. Trigger detection fires (shop trigger at same position as player)
2. `handleTrigger()` is called with shop trigger data
3. Shop screen opens (mode transitions to 'shop')
4. Shop UI displays shop inventory

**When shop closes:**
1. Clicking "Close" or pressing Escape closes shop
2. Mode returns to 'overworld'
3. Player position is preserved

---

## Files to Check

1. `apps/vale-v2/src/ui/state/overworldSlice.ts` - Trigger detection
2. `apps/vale-v2/src/ui/state/gameFlowSlice.ts` - Shop state management
3. `apps/vale-v2/src/data/definitions/maps.ts` - Shop trigger definitions
4. `apps/vale-v2/src/ui/components/ShopScreen.tsx` - Shop UI
5. `apps/vale-v2/src/ui/components/OverworldMap.tsx` - Movement/trigger handling

---

## Fix Requirements

1. **Fix shop trigger detection:**
   - Ensure shop triggers fire when player position matches trigger position
   - Call `handleTrigger()` with shop trigger data
   - Verify trigger type is 'shop' and data contains `shopId`

2. **Fix shop system startup:**
   - Ensure shop screen opens when shop trigger fires
   - Set mode to 'shop'
   - Load shop data from shop definitions

3. **Fix shop UI:**
   - Ensure shop UI displays when mode is 'shop'
   - Display shop inventory and prices
   - Handle purchase logic

4. **Update tests if needed:**
   - Verify test waits for correct mode transition
   - Ensure test navigates to correct shop trigger position
   - Check if test needs to wait for shop UI to render

---

## Acceptance Criteria

✅ Walking to shop trigger position opens shop  
✅ Mode transitions to 'shop'  
✅ Shop screen displays inventory  
✅ Shop can be closed  
✅ Player position preserved after exiting shop  
✅ All 3 tests in `shop-interactions.spec.ts` pass

---

## Testing

After fixes, run:
```bash
cd apps/vale-v2
pnpm test:e2e tests/e2e/shop-interactions.spec.ts
```

Expected: All 3 tests pass.

---

## Notes

- Shop system is important for equipment acquisition
- Shop triggers should work similarly to battle/NPC triggers
- Test uses shop at (12, 5) - verify this trigger exists

