# Complete System 3: Fix ActionQueuePanel Edge Cases

## Context
System 3 (Error Handling) is 80% complete. The error boundary and Result types are done. Only ActionQueuePanel edge cases remain.

## Current Issues
### Issue 1: ABILITIES.find() Can Return Undefined
- **File:** `src/ui/components/ActionQueuePanel.tsx:56`
- **Problem:** `ABILITIES[action.abilityId]` can return `undefined` if abilityId is invalid
- **Impact:** Component may crash or display incorrectly

### Issue 2: Need to Verify Simultaneous Wipe-Out Logic
- **File:** `src/core/services/QueueBattleService.ts` or `BattleService.ts`
- **Problem:** Need to verify victory condition when both teams wipe out simultaneously
- **Impact:** May incorrectly determine winner

### Issue 3: Retargeting Preserves Target Type
- **File:** `src/core/services/QueueBattleService.ts` (resolveValidTargets)
- **Problem:** Need to verify retargeting preserves single-target vs multi-target type
- **Impact:** Single-target abilities may become multi-target after retargeting

## Tasks
### Task 1: Fix ABILITIES.find() Undefined Access
- **File:** `src/ui/components/ActionQueuePanel.tsx`
- **Current Code (line 55-57):**
```ts
const ability = action?.abilityId  ? ABILITIES[action.abilityId] ?? null  : null;
```
- **Fix:**
  - Add proper null check
  - Handle invalid ability IDs gracefully
  - Display fallback text if ability not found
  - Consider using AbilityId type guard
- **Target:**
```ts
const ability = action?.abilityId  ? (isAbilityId(action.abilityId) ? ABILITIES[action.abilityId] : null)  : null;
// Or simpler:
const ability = action?.abilityId && action.abilityId in ABILITIES  ? ABILITIES[action.abilityId]  : null;
```
- **Implementation:**
  - Add fallback UI
  - Maintain existing display layout

### Task 2: Verify Simultaneous Wipe-Out Logic
- **File:** `src/core/services/QueueBattleService.ts` or `BattleService.ts`
- **Check:**
  - Find `checkBattleEnd()` function
  - Verify logic when all player units KO'd AND all enemies KO'd simultaneously
  - Should result in defeat (player loses ties)
- **Expected Behavior:**
  - If all players KO'd → `DEFEAT`
  - If all enemies KO'd → `VICTORY`
  - If both KO'd simultaneously → `DEFEAT` (player loses ties)

### Task 3: Verify Retargeting Preserves Target Type
- **File:** `apps/vale-village/src/core/services/QueueBattleService.ts`
- **Check:**
  - Find `resolveValidTargets()` function
  - Verify it preserves target type (single vs multi)
  - Single-target abilities should retarget to 1 valid target
  - Multi-target abilities can retarget to multiple valid targets
- **Expected Behavior:**
  - Single-target ability with KO'd target → retarget to 1 valid target (or skip if none)
  - Multi-target ability → retarget to all valid targets from original list

## Success Criteria
- ✅ ActionQueuePanel handles invalid ability IDs gracefully
- ✅ No crashes from undefined ability access
- ✅ Simultaneous wipe-out results in correct outcome
- ✅ Retargeting preserves target type
- ✅ All tests pass
- ✅ No regressions

## Files to Modify
- `src/ui/components/ActionQueuePanel.tsx` - Fix undefined access
- `src/core/services/QueueBattleService.ts` - Verify retargeting
- `src/core/services/BattleService.ts` - Verify wipe-out logic

## Testing
# Test ActionQueuePanel with invalid ability IDs
# Test simultaneous wipe-out scenario
# Test retargeting with various target types
pnpm test tests/core/services/
pnpm test tests/battle/
