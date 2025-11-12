# Resolve TODO Comments

## Context
Review and resolve TODO comments throughout the codebase. Some are critical, some can be deferred with documentation.

## Current State
18 TODO comments found:
1. `saveSlice.ts:130` - "Hydrate team and battle from save data" (CRITICAL)
2. `saveSlice.ts:210` - "Hydrate all state from save data" (CRITICAL)
3. `UnitCard.tsx:24` - "Migrate PP to team mana" (HIGH)
4. `ActionBar.tsx:47` - "Migrate PP to team mana" (HIGH)
5. `SaveService.ts:246` - "Add chapter to SaveV1Schema" (MEDIUM)
6. `EncounterService.ts:78` - "Make this data-driven via chapter definitions" (MEDIUM)
7. `SaveService.ts:103` - "Create separate ReplayPort interface" (LOW)
8. `BattleService.ts:288` - "Add accuracy property to Ability schema" (MEDIUM)
9. `AIService.ts:65` - "Pass team to scoreAbility for accurate effective stats" (MEDIUM)
10. `encounters.ts:62` - "Add this ability later" (DEFERRED)
11. `stats.ts:49` - "Replace with proper Djinn registry" (MEDIUM)
12. Plus 6 more in saveSlice.ts (tracking flags, stats, playtime)

## Tasks

### Task 1: Implement Critical TODOs
**Priority:** CRITICAL

1. **Save Hydration** (`saveSlice.ts:130, 210`)
   - Implement `hydrateFromSave()` function
   - Restore team, battle, story, inventory from save
   - Test save/load cycle

2. **Mana Migration** (`UnitCard.tsx:24`, `ActionBar.tsx:47`)
   - Remove PP-based checks
   - Use team mana everywhere
   - Update UI components

### Task 2: Implement High Priority TODOs
**Priority:** HIGH

3. **Chapter in Save Schema** (`SaveService.ts:246`)
   - Add chapter field to SaveV1Schema
   - Update save/load logic
   - Test migration

4. **Ability Accuracy** (`BattleService.ts:288`)
   - Add accuracy to Ability schema
   - Use in damage calculations
   - Update ability definitions

### Task 3: Document Deferred TODOs
**Priority:** MEDIUM-LOW

5. **Data-Driven Encounters** (`EncounterService.ts:78`)
   - Document why it's deferred
   - Create issue/plan for future

6. **ReplayPort Interface** (`SaveService.ts:103`)
   - Document current approach
   - Plan future refactoring

7. **Djinn Registry** (`stats.ts:49`)
   - Document current approach
   - Plan future refactoring

### Task 4: Remove or Implement Remaining TODOs
**Action:** Review each TODO

**Options:**
- Implement if straightforward
- Convert to GitHub issue if complex
- Remove if obsolete
- Document if deferred

## Success Criteria
- All critical TODOs implemented
- High priority TODOs implemented or documented
- Deferred TODOs documented with rationale
- No obsolete TODOs remain
- Code quality improved

## Files to Review
- All files with TODO comments (18 found)
- `apps/vale-v2/src/ui/state/saveSlice.ts`
- `apps/vale-v2/src/ui/components/UnitCard.tsx`
- `apps/vale-v2/src/ui/components/ActionBar.tsx`
- `apps/vale-v2/src/core/services/SaveService.ts`

## Recommended Model
**Claude 3.5 Sonnet** (200k context) - Sufficient for mixed complexity tasks


