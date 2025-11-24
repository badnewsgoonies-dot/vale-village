# Fix Prompt: Djinn Activation Not Working

**Priority:** HIGH  
**Category:** Core Gameplay Mechanic  
**Tests Affected:** 4 tests in `djinn-state-transitions.spec.ts`

---

## Problem

All Djinn state transition tests fail because Djinn activation doesn't work:
- Djinn state remains "Set" instead of transitioning to "Standby"
- Recovery timer is 1 instead of 2 (or doesn't exist)
- Multiple Djinn activation doesn't work
- Save/load can't be tested because activation doesn't work

**Test Failures:**
1. `djinn activation transitions Set to Standby` - Expected "Standby", got "Set"
2. `djinn recovery timer countdown` - Expected timer 2, got 1
3. `multiple djinn activated simultaneously` - All Djinn remain "Set"
4. `djinn state persists through save/load` - Can't activate Djinn

---

## Investigation Steps

1. **Check Djinn activation in battle:**
   - Review `QueueBattleService.ts` for Djinn activation logic
   - Check if `activateDjinn()` function exists and works
   - Verify Djinn activation updates `djinnTrackers[djinnId].state` to "Standby"
   - Verify recovery timer is set correctly (2 for T1, 3 for T2, 4 for T3)

2. **Check battle UI:**
   - Review `CommandPanel.tsx` or battle UI components
   - Verify Djinn activation button exists and is clickable
   - Verify clicking button calls activation function

3. **Check Djinn tracker structure:**
   - Verify `djinnTrackers` structure matches expected format:
     ```typescript
     {
       [djinnId]: {
         djinnId: string;
         state: 'Set' | 'Standby' | 'Recovery';
         lastActivatedTurn: number | null;
         recoveryTurnsRemaining: number | null;
       }
     }
     ```

4. **Check test helpers:**
   - Review `djinn-state-transitions.spec.ts` helper functions:
     - `getDjinnState()` - Should read from `team.djinnTrackers[djinnId]`
     - `activateDjinnInBattle()` - Should call activation function
     - `getDjinnRecoveryTimer()` - Should read `recoveryTurnsRemaining`

---

## Expected Behavior

**When Djinn is activated:**
1. `djinnTrackers[djinnId].state` changes from "Set" → "Standby"
2. `djinnTrackers[djinnId].lastActivatedTurn` is set to current turn number
3. `djinnTrackers[djinnId].recoveryTurnsRemaining` is set to:
   - 2 for Tier 1 Djinn
   - 3 for Tier 2 Djinn
   - 4 for Tier 3 Djinn
4. Unit stats decrease (Djinn bonuses removed)
5. Djinn ability becomes available (if applicable)

**When recovery timer counts down:**
1. Each turn, `recoveryTurnsRemaining` decrements by 1
2. When `recoveryTurnsRemaining` reaches 0, state changes to "Set"
3. Unit stats increase (Djinn bonuses restored)

---

## Files to Check

1. `apps/vale-v2/src/core/services/QueueBattleService.ts` - Djinn activation logic
2. `apps/vale-v2/src/ui/components/battle/CommandPanel.tsx` - Djinn activation UI
3. `apps/vale-v2/src/core/models/Team.ts` - Djinn tracker structure
4. `apps/vale-v2/tests/e2e/djinn-state-transitions.spec.ts` - Test helpers

---

## Fix Requirements

1. **Implement Djinn activation:**
   - Create/update `activateDjinn()` function in `QueueBattleService`
   - Update `djinnTrackers` state correctly
   - Set recovery timer based on Djinn tier

2. **Update battle UI:**
   - Ensure Djinn activation button is visible and functional
   - Connect button click to activation function

3. **Fix recovery timer:**
   - Ensure timer decrements each turn
   - Ensure state transitions when timer reaches 0

4. **Update tests if needed:**
   - Verify test helpers use correct store paths
   - Ensure tests wait for state updates

---

## Acceptance Criteria

✅ Djinn activation transitions Set → Standby  
✅ Recovery timer starts at correct value (2/3/4 based on tier)  
✅ Recovery timer decrements each turn  
✅ Djinn recovers (Standby → Set) when timer reaches 0  
✅ Multiple Djinn can be activated simultaneously  
✅ Djinn state persists through save/load  
✅ All 4 tests in `djinn-state-transitions.spec.ts` pass

---

## Testing

After fixes, run:
```bash
cd apps/vale-v2
pnpm test:e2e tests/e2e/djinn-state-transitions.spec.ts
```

Expected: All 4 tests pass.

