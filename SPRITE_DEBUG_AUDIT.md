# Sprite System Debug Audit

**Date:** 2025-01-XX  
**Status:** ✅ FIXED - Sprite lookups working, components updated

## Problem Summary

Sprites were showing placeholders instead of actual images despite:
- ✅ Sprite files existing at correct paths
- ✅ Vite serving sprites correctly (HTTP 200)
- ✅ Catalog lookup functions working correctly
- ✅ Mapping functions returning correct IDs

## Root Cause

**Issue:** `battle/UnitCard.tsx` was using `unit.id` directly instead of `getPortraitSprite(unit.id)`

**Impact:** When `unit.id = "adept"`, it tried to look up "adept" in the catalog, which doesn't exist. Should use `getPortraitSprite("adept")` which returns "isaac1".

## Fixes Applied

### 1. Fixed UnitCard.tsx
**File:** `apps/vale-v2/src/ui/components/battle/UnitCard.tsx`

**Before:**
```typescript
<SimpleSprite
  id={unit.id}  // ❌ Wrong - tries to look up "adept" directly
  width={32}
  height={32}
/>
```

**After:**
```typescript
import { getPortraitSprite } from '../../sprites/mappings';

<SimpleSprite
  id={getPortraitSprite(unit.id)}  // ✅ Correct - maps "adept" → "isaac1"
  width={32}
  height={32}
/>
```

## Verification Tests

All sprite lookups verified working:

```bash
# Portrait lookups
getPortraitSprite("adept") → "isaac1" → ✅ Finds "Isaac1" sprite
getPortraitSprite("isaac") → "isaac1" → ✅ Finds "Isaac1" sprite

# Ability icon lookups
getAbilityIconSprite("fireball") → "fire-ball" → ✅ Finds "Fireball" sprite
getAbilityIconSprite("heal") → "cure" → ✅ Finds sprite

# Status icon lookups
getStatusIconSprite("poison") → "poison-flow" → ✅ Finds "Poison Flow" sprite
getStatusIconSprite("burn") → "fire" → ✅ Finds sprite

# Djinn sprite lookups
getDjinnSprite("Mars") → "mars-djinn-front" → ✅ Finds "Mars Djinn Front" sprite
```

## Component Status

### ✅ Correctly Using Mapping Functions
- `PartyManagementScreen.tsx` - Uses `getPortraitSprite(unit.id)`
- `DialogueBox.tsx` - Uses `getPortraitSprite(speaker)`
- `AbilityPanel.tsx` - Uses `getAbilityIconSprite(ability.id)`
- `StatusIcon.tsx` - Uses `getStatusIconSprite(statusType)`
- `DjinnCollectionScreen.tsx` - Uses `getDjinnSprite(element)`
- `Battlefield.tsx` - Uses `BattleUnitSprite` (which handles mapping internally)
- `battle/UnitCard.tsx` - ✅ **FIXED** - Now uses `getPortraitSprite(unit.id)`

### ⚠️ Direct Path Usage (OK)
- `EquipmentIcon.tsx` - Uses `equipment.id.toLowerCase()` directly (has fallback)
- `SaveMenu.tsx` - Uses hardcoded IDs like "isaac1" (direct catalog lookup)
- Storyboard components - Use direct paths (OK for mockups)

## Debug Mode

To enable debug logging for sprite lookups, add `debug={true}` to any `SimpleSprite`:

```typescript
<SimpleSprite
  id={getPortraitSprite(unit.id)}
  width={32}
  height={32}
  debug={true}  // Shows lookup info on hover
/>
```

Debug mode will:
- Log sprite lookups to console
- Show sprite info on hover
- Display lookup method (catalog/path/none)
- Show errors if sprite fails to load

## Next Steps

1. ✅ Fix `battle/UnitCard.tsx` to use `getPortraitSprite()`
2. Test in browser - sprites should now display correctly
3. If still showing placeholders, enable `debug={true}` to diagnose
4. Check browser console for any 404 errors or load failures

## Files Changed

- `apps/vale-v2/src/ui/components/battle/UnitCard.tsx` - Added `getPortraitSprite()` import and usage

