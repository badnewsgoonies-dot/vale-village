# Complete System 6: Implement Critical TODOs

## Context
13 TODO comments found. Focus on critical ones that block features or cause technical debt.

## Critical TODOs (Must Implement)
### TODO 1: Hydrate Team and Battle from Save Data
- **Files:** `src/ui/state/saveSlice.ts:130, 210`
- **Priority:** CRITICAL
- **Impact:** Save/load doesn't restore game state
- **Current:**
```ts
// Line 130: TODO: Hydrate team and battle from save data
// Line 210: TODO: Hydrate all state from save data
```
- **Implementation:**
```ts
// In loadGame() function
const hydratedTeam = saveData.team ? createTeam(saveData.team.units) : null;
const hydratedBattle = saveData.battle ? /* restore battle state */ : null;
setTeam(hydratedTeam);
setBattle(hydratedBattle, saveData.rngSeed || 0);
// Also restore: story, inventory, overworld state
```

### TODO 2: Migrate PP to Team Mana
- **Files:**
  - `src/ui/components/UnitCard.tsx:24`
  - `src/ui/components/ActionBar.tsx:47`
- **Priority:** HIGH
- **Impact:** Technical debt, inconsistent system
- **Current:**
```ts
// UnitCard.tsx:24
// TODO: Migrate PP to team mana in PR-MANA-QUEUE
const currentPp = unit.baseStats.pp + (unit.level - 1) * unit.growthRates.pp;
```
- **Implementation:**
  - Remove PP display from UnitCard (team mana is shown in ManaCirclesBar)
  - Remove PP checks from ActionBar (use team mana instead)
  - Verify all PP references removed

## High Priority TODOs (Should Implement)
### TODO 3: Add Chapter to SaveV1Schema
- **File:** `src/core/services/SaveService.ts:246`
- **Priority:** HIGH
- **Implementation:**
  - Add `chapter: number` to `SaveV1Schema`
  - Save current chapter from `storySlice`
  - Restore chapter on load

## Medium Priority TODOs (Document)
### TODO 5-8: Document Deferred TODOs
- **Files:**
  - `EncounterService.ts:78` - "Make this data-driven via chapter definitions"
  - `SaveService.ts:103` - "Create separate ReplayPort interface"
  - `AIService.ts:65` - "Pass team to scoreAbility for accurate effective stats"
  - `stats.ts:49` - "Replace with proper Djinn registry"
- **Action:** Document why deferred and create follow-up tickets

## Low Priority TODOs (Defer)
- `encounters.ts:62` - "Add this ability later" - Feature addition, defer
- `saveSlice.ts:97, 103, 106, 110` - Tracking flags/stats/playtime - Nice to have, defer

## Success Criteria
- ✅ Critical TODOs implemented
- ✅ High priority TODOs implemented
- ✅ Medium priority TODOs documented
- ✅ Low priority TODOs left as-is or documented
- ✅ All tests pass
- ✅ Save/load works correctly

## Files to Modify
**Critical:**
- `src/ui/state/saveSlice.ts` - Hydrate state
- `src/ui/components/UnitCard.tsx` - Remove PP
- `src/ui/components/ActionBar.tsx` - Remove PP

**High Priority:**
- `src/data/schemas/SaveV1Schema.ts` - Add chapter
- `src/core/services/SaveService.ts` - Save chapter

## Testing
# Test save/load with all state
# Test PP removal doesn't break UI
pnpm test tests/core/save/
pnpm dev  # Manual test save/load

## Reference
- Save slice: `src/ui/state/saveSlice.ts`
- Save schema: `src/data/schemas/SaveV1Schema.ts`
- Current TODOs: Found 13 total across codebase
