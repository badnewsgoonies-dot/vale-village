# Fix Prompt: Battle Execute Button Not Visible

**Priority:** LOW  
**Category:** Battle UI  
**Tests Affected:** 1 test in `battle-execution.spec.ts`

---

## Problem

Battle execute button test fails because button is not visible when queue is complete.

**Test Failure:**
- `battle UI shows execute button when queue is complete` - Button not visible when queue is complete

---

## Investigation Steps

1. **Check execute button visibility:**
   - Review battle UI components (CommandPanel, QueueBattleView)
   - Verify execute button visibility logic
   - Check if button is disabled/hidden when queue isn't complete

2. **Check queue completion detection:**
   - Review queue completion logic in QueueBattleService
   - Verify queue length matches active party size
   - Check if queue completion state is tracked correctly

3. **Check button rendering:**
   - Verify execute button exists in UI
   - Check if button is conditionally rendered based on queue state
   - Verify button text/label is correct

---

## Expected Behavior

**When queue is complete:**
- Queue length equals active party size
- Execute button becomes visible
- Execute button is enabled (clickable)

**When queue is incomplete:**
- Queue length less than active party size
- Execute button is hidden or disabled

---

## Files to Check

1. `apps/vale-v2/src/ui/components/battle/CommandPanel.tsx` - Execute button
2. `apps/vale-v2/src/ui/components/battle/QueueBattleView.tsx` - Battle UI
3. `apps/vale-v2/src/core/services/QueueBattleService.ts` - Queue completion logic

---

## Fix Requirements

1. **Fix button visibility:**
   - Ensure execute button is visible when queue is complete
   - Hide/disable button when queue is incomplete
   - Update button state when queue changes

2. **Fix queue completion detection:**
   - Verify queue completion is calculated correctly
   - Ensure queue length matches active party size

---

## Acceptance Criteria

✅ Execute button visible when queue is complete  
✅ Execute button hidden/disabled when queue is incomplete  
✅ Test in `battle-execution.spec.ts` passes

---

## Testing

After fixes, run:
```bash
cd apps/vale-v2
pnpm test:e2e tests/e2e/battle-execution.spec.ts
```

Expected: Test passes.

