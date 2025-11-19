# Recruitment System: Data-Driven Refactor

**Date:** 2025-11-16  
**Goal:** Make recruitment system data-driven and interchangeable, remove hard-coded mappings

---

## Changes Made

### 1. Created Data-Driven Recruitment System
**File:** `src/data/definitions/recruitmentData.ts`

**Features:**
- `ENCOUNTER_TO_RECRUITMENT_DIALOGUE` - Single source of truth for encounter→dialogue mapping
- `getRecruitmentDialogue(encounterId)` - Get dialogue for an encounter
- `hasRecruitmentDialogue(encounterId)` - Check if encounter has recruitment dialogue
- `extractRecruitmentInfo(dialogue)` - Extract unit/Djinn from dialogue effects dynamically
- `getRecruitmentInfo(encounterId)` - Get recruitment info for an encounter
- `getAllRecruitmentEncounters()` - Get all encounters with recruitment dialogues

**Benefits:**
- ✅ Recruitment mappings are now data, not code
- ✅ Easy to reassign encounters to different dialogues
- ✅ Can extract recruitment info dynamically from dialogue effects
- ✅ No hard-coded house→unit mappings in code

### 2. Updated App.tsx to Use Data-Driven System
**Changes:**
- Removed hard-coded `ENCOUNTER_TO_RECRUITMENT_DIALOGUE` mapping
- Now imports `getRecruitmentDialogue` and `hasRecruitmentDialogue` from `recruitmentData.ts`
- Uses data-driven functions instead of direct object access

**Before:**
```typescript
const ENCOUNTER_TO_RECRUITMENT_DIALOGUE: Record<string, string> = {
  'house-01': 'house-01-recruit',
  // ... hard-coded mappings
};

if (ENCOUNTER_TO_RECRUITMENT_DIALOGUE[encounterId]) {
  const dialogueId = ENCOUNTER_TO_RECRUITMENT_DIALOGUE[encounterId];
  const recruitmentDialogue = DIALOGUES[dialogueId];
  // ...
}
```

**After:**
```typescript
import { getRecruitmentDialogue, hasRecruitmentDialogue } from './data/definitions/recruitmentData';

if (encounterId && hasRecruitmentDialogue(encounterId)) {
  const recruitmentDialogue = getRecruitmentDialogue(encounterId);
  // ...
}
```

### 3. Updated Tests to Verify Mechanism, Not Specific Mappings
**File:** `tests/e2e/battle-recruits-devmode.spec.ts`

**Changes:**
- Removed hard-coded tests like "House 5 recruits Blaze"
- Tests now dynamically find encounters with recruitment data
- Verify the mechanism works, not specific house→unit mappings

**New Test Structure:**
1. **Dynamic Unit Recruitment Test** - Finds any encounter that recruits a unit, verifies mechanism works
2. **Dual Grant Test** - Finds encounter that grants both unit and Djinn, verifies both work
3. **All Encounters Test** - Verifies all recruitment encounters have valid data
4. **Djinn-Only Test** - Tests encounters that grant Djinn but no unit
5. **Full Progression Test** - Tests final house, verifies mechanism works

**Benefits:**
- ✅ Tests verify the system works, not specific data
- ✅ If you change house→unit mappings, tests still pass
- ✅ Tests are more maintainable and flexible
- ✅ Tests prove the mechanism is correct, not just the current data

---

## How It Works

### Data Flow

```
recruitmentData.ts (Data)
    ↓
    ENCOUNTER_TO_RECRUITMENT_DIALOGUE mapping
    ↓
    getRecruitmentDialogue() / hasRecruitmentDialogue()
    ↓
App.tsx (Code)
    ↓
    handleRewardsContinue() checks for recruitment
    ↓
    startDialogueTree() triggers dialogue
    ↓
    dialogueSlice processes effects (recruitUnit, grantDjinn)
```

### Dynamic Extraction

The system extracts recruitment info from dialogue effects dynamically:

```typescript
// Dialogue has effects:
{
  recruitUnit: 'blaze',
  grantDjinn: 'fizz'
}

// extractRecruitmentInfo() traverses dialogue nodes and finds:
{
  recruitsUnit: 'blaze',
  grantsDjinn: 'fizz'
}
```

This means:
- ✅ No need to maintain separate mapping of what each dialogue grants
- ✅ Dialogue effects are the single source of truth
- ✅ Can change dialogue effects without updating code

---

## Interchangeability

### Changing Recruitment Assignments

**Before (Hard-Coded):**
- Change `ENCOUNTER_TO_RECRUITMENT_DIALOGUE` in App.tsx
- Update tests that check specific house→unit mappings
- Risk breaking tests if mappings change

**After (Data-Driven):**
- Change `ENCOUNTER_TO_RECRUITMENT_DIALOGUE` in `recruitmentData.ts`
- Tests automatically adapt (they verify mechanism, not specific mappings)
- No code changes needed

### Example: Swap House 5 and House 8

**Before:**
```typescript
// App.tsx
'house-05': 'house-05-recruit',  // Blaze
'house-08': 'house-08-recruit',  // Sentinel

// Tests
expect(roster.some(u => u.id === 'blaze')).toBe(true);  // Hard-coded!
```

**After:**
```typescript
// recruitmentData.ts
'house-05': 'house-08-recruit',  // Now Sentinel
'house-08': 'house-05-recruit',  // Now Blaze

// Tests - No changes needed!
// Tests dynamically find which encounter recruits which unit
const unitRecruitmentEncounter = recruitmentEncounters.find(...);
const expectedUnitId = getRecruitmentInfo(unitRecruitmentEncounter)?.recruitsUnit;
expect(roster.some(u => u.id === expectedUnitId)).toBe(true);
```

---

## Test Results

All 5 tests passing:
- ✅ Recruitment dialogue triggers and grants unit dynamically
- ✅ Recruitment dialogue grants both unit and Djinn dynamically
- ✅ All recruitment encounters trigger dialogues
- ✅ Recruitment mechanism works for Djinn-only encounters
- ✅ Full progression: Verify all recruitment encounters work

**Key Achievement:** Tests verify the mechanism works, not specific house→unit mappings.

---

## Files Modified

1. **Created:** `src/data/definitions/recruitmentData.ts` - Data-driven recruitment system
2. **Modified:** `src/App.tsx` - Uses data-driven functions instead of hard-coded mapping
3. **Rewritten:** `tests/e2e/battle-recruits-devmode.spec.ts` - Dynamic tests that verify mechanism

---

## Benefits Summary

### For Developers
- ✅ Easy to reassign encounters to different dialogues
- ✅ No code changes needed when changing recruitment assignments
- ✅ Single source of truth for recruitment mappings

### For Tests
- ✅ Tests verify mechanism works, not specific data
- ✅ Tests adapt automatically when data changes
- ✅ More maintainable and flexible

### For Game Design
- ✅ Can experiment with different recruitment assignments easily
- ✅ Can swap encounters without breaking tests
- ✅ Data-driven design allows rapid iteration

---

## Next Steps

1. ✅ **Complete** - Recruitment system is now data-driven
2. ✅ **Complete** - Tests verify mechanism, not specific mappings
3. ⏳ **Optional** - Consider moving `ENCOUNTER_TO_RECRUITMENT_DIALOGUE` to JSON file for even easier editing
4. ⏳ **Optional** - Add validation to ensure all recruitment dialogues have valid effects

---

## Conclusion

The recruitment system is now fully data-driven and interchangeable. Tests verify the mechanism works correctly, not specific house→unit mappings. This makes the system more flexible, maintainable, and easier to iterate on.
