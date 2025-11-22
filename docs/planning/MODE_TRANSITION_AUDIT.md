# Mode Transition System Audit

## Problem Statement
E2E tests are timing out waiting for mode transitions, particularly:
- Battle → Rewards → Dialogue → Overworld flow
- Tests expect dialogue mode after claiming rewards, but mode stays in 'overworld'

## Root Cause Analysis

### Expected Flow
1. Battle ends → `processVictory()` → sets `mode: 'rewards'`
2. User clicks "Continue" → `handleRewardsContinue()` in App.tsx:
   - Calls `claimRewards()` → sets `mode: 'overworld'`
   - Checks for recruitment dialogue → calls `startDialogueTree()` → sets `mode: 'dialogue'`
   - Dialogue ends → `endDialogue()` → sets `mode: 'overworld'`

### Actual Flow in Tests
1. Battle ends → `processVictory()` → sets `mode: 'rewards'`
2. Test helper `completeBattle()` calls `claimRewards()` DIRECTLY:
   - Sets `mode: 'overworld'` immediately
   - **BYPASSES** `handleRewardsContinue()` logic
   - **NO recruitment dialogue is triggered**

## Code Locations

### Correct Flow (App.tsx)
```typescript
// Line 166-198: handleRewardsContinue
const handleRewardsContinue = () => {
  claimRewards(); // Sets mode to 'overworld'
  setBattle(null, 0);
  
  // Check for recruitment dialogue
  if (encounterId && ENCOUNTER_TO_RECRUITMENT_DIALOGUE[encounterId]) {
    startDialogueTree(recruitmentDialogue); // Sets mode to 'dialogue'
    return;
  }
  
  returnToOverworld();
};
```

### Broken Flow (tests/e2e/helpers.ts)
```typescript
// Line 250-276: completeBattle function
await page.evaluate(() => {
  const store = (window as any).__VALE_STORE__;
  store.getState().claimRewards(); // ❌ Bypasses handleRewardsContinue!
});
```

## Fix Strategy

### Option 1: Call handleRewardsContinue from test helper (RECOMMENDED)
- Expose `handleRewardsContinue` on the store or window
- Call it from test helper instead of `claimRewards()` directly

### Option 2: Move recruitment dialogue logic to claimRewards
- Check for recruitment dialogue inside `claimRewards()`
- But this couples rewards logic with dialogue logic (bad separation)

### Option 3: Create a unified "completeRewards" function
- Combine `claimRewards()` + recruitment dialogue check
- Use in both App.tsx and test helpers

## Recommended Fix: Option 1 ✅ IMPLEMENTED

Expose `handleRewardsContinue` on the window so tests can use the same flow as the UI.

### Implementation

1. **App.tsx**: Exposed `handleRewardsContinue` on `window.handleRewardsContinue`
2. **helpers.ts**: Updated `completeBattleFlow` to:
   - Try clicking the continue button first (triggers `handleRewardsContinue`)
   - Fallback to calling `window.handleRewardsContinue()` directly if button not found
   - Properly wait for dialogue mode if recruitment dialogue is expected

### Changes Made

1. **src/App.tsx**:
   - Added `useCallback` import
   - Wrapped `handleRewardsContinue` in `useCallback` with proper dependencies
   - Exposed on `window.handleRewardsContinue` for E2E tests

2. **tests/e2e/helpers.ts**:
   - Updated `completeBattleFlow` to click continue button (triggers proper flow)
   - Added fallback to call `window.handleRewardsContinue()` directly
   - Improved mode checking after claiming rewards
   - Better handling of dialogue mode transitions

## Testing Status

- ✅ Execute button test: FIXED
- ✅ Battle execution test: FIXED  
- ⏳ Battle-recruits-devmode tests: Need Dev Mode overlay fix (separate issue)
- ⏳ Other mode transition tests: Should work now with proper flow

## Next Steps

1. Fix Dev Mode overlay visibility issue (separate from mode transitions)
2. Run full test suite to verify mode transitions work correctly
3. Consider adding mode transition logging for debugging
