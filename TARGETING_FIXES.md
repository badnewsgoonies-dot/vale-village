# Targeting System Fixes - Cursor Composer Task

## Problem Summary

The battle system has critical targeting bugs preventing gameplay:

1. **"No valid targets for ability fireball" error** - Repeating in console, causing React error boundaries
2. **User cannot select targets** - When clicking ability buttons (Strike, Fireball, Heal), selecting enemy targets fails
3. **Root cause**: Mismatch between UI target selection and BattleService validation

## Technical Root Cause

### Issue 1: resolveTargets Returns Too Few Targets

**File**: `src/core/algorithms/targeting.ts`

The `resolveTargets()` function uses `.slice(0, 1)` for single-target abilities, returning ONLY the first valid target:

```typescript
case 'single-enemy':
  return isPlayerUnit
    ? enemyUnits.filter(u => !isUnitKO(u)).slice(0, 1)  // ❌ Only first enemy!
    : playerUnits.filter(u => !isUnitKO(u)).slice(0, 1);

case 'single-ally':
  return isPlayerUnit
    ? playerUnits.filter(u => !isUnitKO(u) && u.id !== caster.id).slice(0, 1)  // ❌ Only first ally!
    : enemyUnits.filter(u => !isUnitKO(u) && u.id !== caster.id).slice(0, 1);
```

**Problem Flow:**
1. User clicks "Fireball" ability in ActionBar
2. UI shows ALL enemies as valid targets (lines 120-149 in ActionBar.tsx)
3. User clicks "Goblin 2" (enemy-2)
4. ActionBar calls `preview(actorId, 'fireball', ['enemy-2'])`
5. BattleService.performAction calls `resolveTargets()` which returns `[enemy-1]` (only first enemy)
6. Then filters to match user selection: `validTargets.filter(t => targetIds.includes(t.id))`
7. Result: Empty array because `enemy-2` is not in `[enemy-1]`
8. **Error thrown**: "No valid targets for ability fireball"

### Issue 2: ActionBar vs BattleService Mismatch

**ActionBar** (UI) assumes it can show ALL valid targets:
```typescript
// Lines 120-132 in ActionBar.tsx
{allUnits.map((unit) => {
  const isEnemy = battle.enemies.some(e => e.id === unit.id);
  const isValidTarget =
    (ability.targets === 'single-enemy' && isEnemy) ||
    // ... shows ALL enemies for single-enemy abilities
```

**BattleService** expects targets to match `resolveTargets()` output:
```typescript
// Lines 123-133 in BattleService.ts
const potentialTargets = resolveTargets(ability, actor, ...);
const validTargets = filterValidTargets(potentialTargets, ability);
const targets = validTargets.filter(t => targetIds.includes(t.id));

if (targets.length === 0) {
  throw new Error(`No valid targets for ability ${abilityId}`);
}
```

## Solution

### Fix 1: Update resolveTargets to Return ALL Valid Targets

**File**: `src/core/algorithms/targeting.ts`

Remove `.slice(0, 1)` for single-target abilities. The function should return ALL valid targets, and the caller (AI or player) chooses which specific target:

```typescript
case 'single-enemy':
  return isPlayerUnit
    ? enemyUnits.filter(u => !isUnitKO(u))  // ✅ Return ALL enemies
    : playerUnits.filter(u => !isUnitKO(u));

case 'single-ally':
  return isPlayerUnit
    ? playerUnits.filter(u => !isUnitKO(u) && u.id !== caster.id)  // ✅ Return ALL allies
    : enemyUnits.filter(u => !isUnitKO(u) && u.id !== caster.id);
```

**Rationale:**
- `resolveTargets` should answer: "What are ALL the valid targets for this ability?"
- The **caller** (AI service or player via UI) decides which specific target to hit
- This matches how `all-enemies` and `all-allies` already work

### Fix 2: Verify AI Service Still Works

**File**: `src/core/services/AIService.ts`

The AI's `selectTargets()` function (lines 130-233) should still work correctly because it:
1. Calls `resolveTargets()` to get candidates
2. Applies AI logic (weakest, lowestRes, random, etc.) to pick ONE from the list
3. Returns `[targetId]` for single-target abilities

**Verify these cases:**
- Lines 192: `return scored.length > 0 ? [scored[0]!.target.id] : []` - picks first from scored list ✅
- Lines 207: `return scored.length > 0 ? [scored[0]!.target.id] : []` - picks best resistance ✅
- Lines 218: `return validTargets.length > 0 ? [validTargets[0]!.id] : []` - picks healer ✅
- Lines 227: Random selection from validTargets ✅

**Expected**: No AI changes needed - it already handles multiple targets correctly.

### Fix 3: Add Error Boundaries (Optional Enhancement)

**File**: `src/ui/components/ActionBar.tsx`

Wrap the preview call in try-catch to prevent React crashes:

```typescript
const previewData = useMemo(() => {
  if (!selectedAbility || selectedTargets.length === 0 || !currentActorId) return null;

  try {
    return preview(currentActorId, selectedAbility, selectedTargets);
  } catch (error) {
    console.error('Preview failed:', error);
    return null;
  }
}, [selectedAbility, selectedTargets, currentActorId, preview]);
```

This prevents the preview error from crashing the entire component while the underlying issue is fixed.

## Testing Checklist

After implementing fixes:

1. **Player targeting**:
   - [ ] Click "Strike" → Can select ANY enemy → Preview works → Execute works
   - [ ] Click "Fireball" → Can select ANY enemy → Preview shows damage range → Execute works
   - [ ] Click "Heal" → Can select ANY ally → Preview works → Execute works

2. **AI targeting**:
   - [ ] Enemy turn executes without errors
   - [ ] AI still picks reasonable targets (weakest HP, etc.)
   - [ ] No "No available abilities" errors

3. **Edge cases**:
   - [ ] All enemies except first one KO'd → Can still target remaining enemy
   - [ ] Multiple enemies → Can target any of them
   - [ ] Self-targeting abilities work (if any exist)

4. **Console**:
   - [ ] No "No valid targets" errors
   - [ ] No React error boundary crashes
   - [ ] Battle log shows actions correctly

## Implementation Priority

1. **CRITICAL**: Fix `resolveTargets()` in targeting.ts (removes `.slice(0, 1)`)
2. **VERIFY**: Test AI still works correctly with AIService.ts
3. **OPTIONAL**: Add error boundary to ActionBar preview

## Files to Modify

- `src/core/algorithms/targeting.ts` - Remove `.slice(0, 1)` from single-target cases
- `src/ui/components/ActionBar.tsx` - (Optional) Add try-catch around preview
- No changes needed to `AIService.ts` - verify it still works

## Success Criteria

✅ User can click Fireball → Select any enemy → See damage preview → Execute action
✅ No console errors about "No valid targets"
✅ React components don't crash
✅ AI enemies can still take actions without errors
✅ All 114 tests continue to pass
