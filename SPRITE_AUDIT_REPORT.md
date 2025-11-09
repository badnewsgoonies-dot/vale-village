# Sprite Directory Audit Report

**Date:** 2025-11-09
**Audited By:** Claude
**Total Sprite Files:** 2,572

## Executive Summary

The sprite directory structure has been audited and several issues were identified and **FIXED**:

1. ✅ **FIXED:** Jenna sprite fallback was incomplete - now properly handles all front-facing animations
2. ✅ **FIXED:** Young character sprites were misplaced - moved to proper subdirectory
3. ⚠️ **DOCUMENTED:** Unnamed icon files identified but kept for potential UI use
4. ℹ️ **DOCUMENTED:** Jenna's Ankh weapon sprites in GS2 (not used in GS1)

---

## Directory Structure Overview

```
public/sprites/
├── backgrounds/     72 files    ✓ OK
├── battle/         579 files    ✓ FIXED
├── icons/          766 files    ⚠ Minor issues documented
├── overworld/      455 files    ✓ OK
├── psynergy/        19 files    ✓ OK
├── scenery/        591 files    ✓ OK
└── text/            90 files    ✓ OK
```

**Total:** 2,572 sprite files

---

## Issues Found & Fixed

### 1. ✅ FIXED: Jenna Sprite Fallback Incomplete

**Location:** `src/sprites/registry.ts:46-52`

**Original Problem:**
The fallback to `jenna_gs2` only covered `CastFront` animations, leaving other front-facing states broken.

**Original Code:**
```typescript
if (unitId === 'jenna' && animation.startsWith('CastFront')) {
  folder = mapping.fallback || 'jenna';
}
```

**Missing Sprites in `jenna/` directory:**
- ❌ `Jenna_lBlade_Front.gif`
- ❌ `Jenna_lBlade_HitFront.gif`
- ❌ `Jenna_lBlade_DownedFront.gif`
- ❌ `Jenna_Staff_Front.gif`
- ❌ `Jenna_Staff_HitFront.gif`
- ❌ `Jenna_Staff_DownedFront.gif`

**Fix Applied:**
```typescript
// Handle Jenna fallback for missing front-facing animations
// Jenna's GS1 sprites only have back-facing animations, so we use GS2 for all front-facing states
let folder = mapping.folder;
const frontFacingAnimations = ['Front', 'CastFront1', 'CastFront2', 'HitFront', 'DownedFront'];
if (unitId === 'jenna' && frontFacingAnimations.includes(animation)) {
  folder = mapping.fallback || 'jenna';
}
```

**Result:** All front-facing Jenna animations now properly fall back to `jenna_gs2` sprites.

---

### 2. ✅ FIXED: Misplaced Young Character Sprites

**Original Location:** `public/sprites/battle/party/`

**Files:**
- `Young_Garet2.gif`
- `Young_Isaac2.gif`

**Problem:** These sprites were in the party root directory instead of a subdirectory, making them harder to locate and maintain.

**Fix Applied:**
Created `public/sprites/battle/party/young/` subdirectory and moved both files there.

**New Location:** `public/sprites/battle/party/young/`
- ✓ `Young_Garet2.gif`
- ✓ `Young_Isaac2.gif`

---

### 3. ⚠️ DOCUMENTED: Unnamed Item Icon Files

**Location:** `public/sprites/icons/items/`

**Files Found:**
- `2.gif`
- `3.gif`
- `4.gif`
- `coin.gif`
- `equipped.gif`

**Analysis:**
These files don't match the equipment naming pattern used by `equipmentPaths.ts`. They appear to be UI elements or placeholders rather than actual equipment icons.

**Recommendation:**
Leave as-is unless they're causing issues. They may be used for UI elements like:
- Quantity indicators (2.gif, 3.gif, 4.gif)
- Currency display (coin.gif)
- Equipment status indicator (equipped.gif)

**Action Taken:** Documented for reference. No changes needed at this time.

---

### 4. ℹ️ DOCUMENTED: Jenna Ankh Weapon Sprites

**Location:** `public/sprites/battle/party/jenna_gs2/`

**Files:** 12 `Jenna_Ankh_*.gif` sprites

**Analysis:**
The `jenna_gs2` directory contains Ankh weapon sprites, but the code mapping for `jenna` only declares `['lBlade', 'Staff']` as available weapons.

**Code Reference:**
```typescript
'jenna': {
  folder: 'jenna',
  weapons: ['lBlade', 'Staff'], // GS2 also has Ankh but it's not used in GS1
  animations: 7,
  fallback: 'jenna_gs2'
},
```

**Explanation:**
- Ankh weapons are only available in Golden Sun 2
- Jenna can use Ankh in GS2 but not in GS1
- The sprites exist for completeness but aren't referenced for the GS1 `jenna` character
- Sheba is the primary Ankh user in both games

**Action Taken:** Added clarifying comment in code. No functional changes needed.

---

## Party Member Sprite Inventory

| Character | Sprite Count | Expected | Weapons | Status |
|-----------|--------------|----------|---------|--------|
| Isaac     | 48 | 48 | Axe, lBlade, lSword, Mace (4 × 12) | ✓ Complete |
| Garet     | 36 | 36 | Axe, lSword, Mace (3 × 12) | ✓ Complete |
| Ivan      | 24 | 24 | lBlade, Staff (2 × 12) | ✓ Complete |
| Mia       | 24 | 24 | Mace, Staff (2 × 12) | ✓ Complete |
| Felix     | 48 | 48 | Axe, lBlade, lSword, Mace (4 × 12) | ✓ Complete |
| **Jenna** | **14** | **14** | **lBlade, Staff (2 × 7)** | **✓ Works with fallback** |
| jenna_gs2 | 36 | 36 | Ankh, lBlade, Staff (3 × 12) | ✓ Complete |
| Piers     | 24 | 24 | lSword, Mace (2 × 12) | ✓ Complete |
| Sheba     | 36 | 36 | Ankh, Mace, Staff (3 × 12) | ✓ Complete |

**Note:** Jenna's 14 sprites (2 weapons × 7 back-facing animations) are supplemented by jenna_gs2's front-facing sprites through the fallback mechanism.

---

## Animation States Reference

All party members (except Jenna GS1) support these 12 animations:

| Category | Animations | Description |
|----------|-----------|-------------|
| **Idle** | Front, Back | Standing poses |
| **Attack** | Attack1, Attack2 | Attack animation frames |
| **Casting** | CastFront1, CastFront2, CastBack1, CastBack2 | Psynergy casting |
| **Damage** | HitFront, HitBack | Taking damage |
| **Defeated** | DownedFront, DownedBack | Knocked out |

**Jenna (GS1) Exception:**
Only has 7 back-facing animations: `Back, Attack1, Attack2, CastBack1, CastBack2, HitBack, DownedBack`
Front-facing animations use jenna_gs2 sprites via fallback.

---

## Enemy Sprites

**Count:** 173 enemy sprite files
**Location:** `public/sprites/battle/enemies/`
**Format:** `{Enemy_Name}.gif` (e.g., `Wild_Wolf.gif`, `Goblin.gif`)
**Status:** ✓ All properly organized

---

## Djinn Sprites

**Count:** 8 files (4 elements × 2 orientations)
**Location:** `public/sprites/battle/djinn/`

**Files:**
- ✓ Venus_Djinn_Front.gif / Venus_Djinn_Back.gif
- ✓ Mars_Djinn_Front.gif / Mars_Djinn_Back.gif
- ✓ Mercury_Djinn_Front.gif / Mercury_Djinn_Back.gif
- ✓ Jupiter_Djinn_Front.gif / Jupiter_Djinn_Back.gif

**Status:** ✓ Complete and properly organized

---

## Equipment Icon Categories

**Location:** `public/sprites/icons/items/`

**Categories Found:**
- ✓ armor
- ✓ axes
- ✓ boots
- ✓ bracelets
- ✓ circlets
- ✓ class
- ✓ clothing
- ✓ crowns
- ✓ forgeable
- ✓ gloves
- ✓ hats
- ✓ helmets
- ✓ important
- ✓ light-blades
- ✓ long-swords
- ✓ maces
- ✓ otherhats
- ✓ psynergy
- ✓ rings
- ✓ robes
- ✓ rusted
- ✓ shields
- ✓ single-use/ (healing, battle, important, other)
- ✓ staves
- ✓ undershirt

**Status:** ✓ All categories properly organized

---

## Test Coverage

**Test File:** `tests/sprites/registry.test.ts`

**Tests Updated:**
1. ✓ Updated Jenna fallback test for all front-facing animations
2. ✓ Added test for Jenna's back-facing animations using regular folder
3. ✓ Verified all 8 party members sprite path generation
4. ✓ Equipment icon path generation
5. ✓ Ability icon path generation
6. ✓ Djinn icon path generation

**Test Status:** All tests updated to match fixed behavior

---

## Code Changes Summary

### Files Modified:

1. **`src/sprites/registry.ts`**
   - Updated Jenna fallback logic to include all front-facing animations
   - Changed from `animation.startsWith('CastFront')` to array-based check
   - Added comprehensive comment explaining the fallback behavior

2. **`src/sprites/mappings/unitToSprite.ts`**
   - Added clarifying comments to Jenna's weapon types
   - Documented that Ankh is GS2-only for Jenna
   - Explained the 7 vs 12 animation discrepancy

3. **`tests/sprites/registry.test.ts`**
   - Split Jenna test into two: front-facing and back-facing
   - Updated expectations to match new fallback behavior
   - Added tests for Front, HitFront, DownedFront animations

4. **File System:**
   - Moved `Young_Garet2.gif` and `Young_Isaac2.gif` to `public/sprites/battle/party/young/`

---

## Recommendations for Future Work

### Optional Improvements:

1. **Consider extracting sprite sheets** from `sprite-sheets/` directory into individual frames if not already done

2. **Add sprite preloading** before battle scenes to prevent loading delays

3. **Create a sprite validator script** to automatically check for missing sprites during build

4. **Document the mockups directory** - clarify relationship between `mockups/improved/sprites/` (1,458 files) and `public/sprites/` (2,572 files)

5. **Add sprite atlas** for better performance in production

### No Action Required:

- Enemy sprites are correctly organized and complete
- All party member sprites work correctly with fallbacks
- Equipment icons are properly categorized
- Psynergy and background sprites are well-organized

---

## Conclusion

The sprite directory audit identified 4 issues:
- ✅ **2 Critical Issues:** FIXED (Jenna fallback, misplaced sprites)
- ⚠️ **2 Minor Issues:** DOCUMENTED (unnamed icons, Ankh weapons)

All sprite loading should now work correctly. The sprite registry properly handles:
- ✓ All 8 party members (including Jenna's special fallback case)
- ✓ 173 enemy sprites
- ✓ 766+ equipment icons across 25+ categories
- ✓ Element-based Djinn sprites
- ✓ Psynergy/ability icons
- ✓ Background and scenery sprites

**Overall Status:** ✅ **SPRITES DIRECTORY PROPERLY IMPLEMENTED**

---

*End of Audit Report*
