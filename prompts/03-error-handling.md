# Improve Error Handling & Edge Cases

## Context
Improve error handling throughout Vale Chronicles V2 to prevent crashes and provide better error recovery.

## Current State
- No React error boundary (crashes show blank screen)
- Some functions don't use Result types consistently
- AI decision failures can crash battle rounds
- Edge cases in action queue not handled

## Tasks

### Task 1: Add React Error Boundary
**File:** `apps/vale-v2/src/ui/components/GameErrorBoundary.tsx` (exists but needs enhancement)

**Requirements:**
- Catch all React errors
- Display user-friendly error message
- Log error details
- Provide "Reload Game" button
- Wrap App component in ErrorBoundary

### Task 2: Convert queueAction to Result Type
**File:** `apps/vale-v2/src/ui/state/queueBattleSlice.ts`

**Current:** Throws errors or uses console.error

**Target:** Return Result type:
```typescript
type QueueActionResult = Result<void, QueueActionError>;
```

**Error Types:**
- Invalid unit index
- Invalid ability ID
- Insufficient mana
- Invalid targets

### Task 3: Handle AI Decision Failures
**File:** `apps/vale-v2/src/core/services/QueueBattleService.ts`

**Current:** AI failures can crash round execution

**Target:** Fallback to basic attack if AI decision fails:
```typescript
try {
  const decision = generateEnemyAction(enemy, state, rng);
} catch (error) {
  console.warn(`AI decision failed for ${enemy.id}, using basic attack`);
  // Fallback to basic attack
}
```

### Task 4: Fix Action Queue Edge Cases
**File:** `apps/vale-v2/src/ui/components/ActionQueuePanel.tsx`

**Issues:**
- `ABILITIES.find()` can return undefined (crashes)
- Simultaneous wipe-out logic incorrect
- Retargeting doesn't preserve target type

**Fix:**
- Add null checks for ABILITIES.find()
- Fix victory condition logic
- Preserve target type during retargeting

## Success Criteria
- Error boundary catches all React errors
- All queue actions return Result types
- AI failures don't crash battles
- Edge cases handled gracefully
- All tests pass

## Files to Review
- `apps/vale-v2/src/ui/components/GameErrorBoundary.tsx`
- `apps/vale-v2/src/ui/state/queueBattleSlice.ts`
- `apps/vale-v2/src/core/services/QueueBattleService.ts`
- `apps/vale-v2/src/ui/components/ActionQueuePanel.tsx`

## Recommended Model
**Claude 3.5 Sonnet** (200k context) - Sufficient for pattern-based improvements


