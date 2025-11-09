# Code Cleanup Fixes - Follow-up

**Date:** 2025-11-08
**Issue:** Equipment screen broken + village access issue after quest system removal

---

## ✅ FIXES APPLIED

### 1. Equipment Screen React Hooks Error
**Problem:** Violated React's Rules of Hooks by calling `useMemo` after early return

**Error:**
```
Warning: React has detected a change in the order of Hooks called by EquipmentScreen
Rendered more hooks than during the previous render
```

**Fix:** Moved `useMemo` for `currentEquipment` and `currentAbilities` BEFORE the early return to maintain consistent hook order across renders.

**Files Modified:**
- `src/components/equipment/EquipmentScreen.tsx` (lines 56-65)

---

### 2. Village Access Issues (Story Flag References)
**Problem:** Removed quest-related story flags but areas.ts still referenced them

**Broken References Found:**
- `quest_forest_complete` → used in forest_path exit to ancient_ruins
- `battle_row_complete` → used in battle_row exit to vale_village

**Fixes Applied:**
- Changed `quest_forest_complete` to `ancient_ruins_unlocked` (existing flag)
- Removed `battle_row_complete` requirement (players can leave Battle Row anytime)

**Files Modified:**
- `src/data/areas.ts` (lines 648, 1082)

---

### 3. TypeScript Type Safety
**Problem:** `currentEquipment` possibly undefined after optional chaining

**Fix:** Added null check for `currentEquipment` in the early return guard

**Files Modified:**
- `src/components/equipment/EquipmentScreen.tsx` (line 63)

---

## ⚠️ KNOWN REMAINING ISSUES

### NPC Dialogue References to Removed Quest Flags

**Location:** `src/data/areas.ts`
**Impact:** Low (game won't crash, but NPCs will use default dialogue)

**Quest flag references found in NPC dialogue:**
- `quest_forest_active` - 3 NPCs
- `quest_forest_complete` - 6 NPCs
- `quest_ruins_active` - 2 NPCs
- `quest_ruins_complete` - 6 NPCs

**Current Behavior:**
- NPCs check for these flags
- Flags don't exist in StoryFlags interface
- NPCs fall back to default dialogue
- No crashes, just less contextual dialogue

**Options:**
1. **Leave as-is** - Default dialogue still works fine
2. **Remove dialogue keys** - Clean up but lose contextual flavor
3. **Replace with existing flags** - Use `defeated_alpha_wolf`, `defeated_golem_king`, `ancient_ruins_unlocked`, etc.

**Recommendation:** Option 1 (leave as-is) unless you want more contextual NPC dialogue

---

## ✅ VERIFICATION

- **Type Checking:** ✅ PASSES
- **Equipment Screen:** ✅ WORKS
- **Village Access:** ✅ FIXED
- **Console Errors:** ✅ CLEARED

---

## SUMMARY

All critical issues from the cleanup have been resolved:
1. Equipment screen now works correctly
2. Area transitions work properly
3. TypeScript compiles without errors
4. No React warnings

The only remaining issue is cosmetic (NPC dialogue), which doesn't affect gameplay.
