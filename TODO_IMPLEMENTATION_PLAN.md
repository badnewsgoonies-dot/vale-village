# TODO Worklist Implementation Plan

## Status: READY TO IMPLEMENT
**Date:** 2025-11-16  
**Priority Order:** 1 → 2 → 3 → 4

---

## TODO 1: Hydrate Team and Battle from Save Data (CRITICAL)

### Problem
**Line 127-155 in saveSlice.ts:** `loadGame()` restores roster and active party, but NEVER restores:
- Battle state (if user saved mid-battle)
- Equipment/gold inventory
- Story flags
- Overworld position

**Current Code:**
```typescript
loadGame: () => {
  const result = loadGame();
  // ... only restores roster and active party
  // Missing: battle, inventory, story, overworld
}
```

### Implementation

**Step 1: Restore Inventory (Gold + Equipment)**
```typescript
// After line 155 in saveSlice.ts
state.setEquipment(saveData.playerData.equipment || []);
state.setGold(saveData.playerData.gold || 0);
```

**Step 2: Restore Story Flags**
```typescript
// After inventory restore
if (saveData.story) {
  state.setStoryFlags(saveData.story.flags || {});
  state.setCurrentChapter(saveData.story.chapter || 1);
}
```

**Step 3: Restore Overworld State**
```typescript
// After story restore
if (saveData.overworld) {
  state.setCurrentMapId(saveData.overworld.currentMapId || 'vale-village');
  state.setPlayerPosition(saveData.overworld.playerPosition || { x: 10, y: 10 });
}
```

**Step 4: Restore Battle State (if exists)**
```typescript
// After overworld restore
const battleStateStr = localStorage.getItem('vale-v2/battle-state');
if (battleStateStr) {
  try {
    const battleState = JSON.parse(battleStateStr);
    if (battleState.battle) {
      state.setBattle(battleState.battle, battleState.rngSeed || 0);
      // Also restore turn number if stored
    }
  } catch (e) {
    console.warn('Failed to restore battle state:', e);
  }
}
```

### Files to Modify
- `apps/vale-v2/src/ui/state/saveSlice.ts` (lines 127-160)

### Testing
```bash
# 1. Save game with inventory, story progress, and position
# 2. Reload page
# 3. Load save
# 4. Verify:
#    - Gold matches saved value
#    - Equipment inventory matches
#    - Map position correct
#    - Story flags preserved
```

---

## TODO 2: Migrate PP to Team Mana (HIGH)

### Problem
**UnitCard.tsx:24** and **ActionBar.tsx:47** still reference unit PP (Power Points), but the game now uses **team mana** system (shown in ManaCirclesBar).

This is technical debt from the old system.

### Current Code
```typescript
// UnitCard.tsx:24
// TODO: Migrate PP to team mana in PR-MANA-QUEUE
const currentPp = unit.baseStats.pp + (unit.level - 1) * unit.growthRates.pp;
const maxPp = unit.baseStats.pp + (unit.level - 1) * unit.growthRates.pp;
const ppPercent = maxPp > 0 ? (currentPp / maxPp) * 100 : 0;
```

### Implementation

**Step 1: Remove PP display from UnitCard.tsx**
```typescript
// Delete lines 24-26 (PP calculation)
// Remove any PP display in JSX (if exists)
```

**Step 2: Check ActionBar.tsx**
```bash
grep -n "TODO.*PP" apps/vale-v2/src/ui/components/ActionBar.tsx
```
If TODO exists, remove PP checks and use team mana instead.

**Step 3: Search for remaining PP references**
```bash
cd apps/vale-v2
grep -r "currentPp\|maxPp\|ppPercent" src/ui/components/ --include="*.tsx"
```

Remove any remaining PP UI logic.

### Files to Modify
- `apps/vale-v2/src/ui/components/UnitCard.tsx`
- `apps/vale-v2/src/ui/components/ActionBar.tsx` (if exists)

### Testing
```bash
pnpm typecheck  # Ensure no broken references
pnpm test       # Run unit tests
# Manual: Check UnitCard renders without PP display
```

---

## TODO 3: Add Chapter to SaveV1Schema (HIGH)

### Problem
**SaveService.ts:246** mentions chapter should be saved, but schema doesn't include it.

Currently story progress is saved but not which chapter player is on.

### Implementation

**Step 1: Update SaveV1Schema**
```typescript
// apps/vale-v2/src/data/schemas/SaveV1Schema.ts
export const SaveV1Schema = z.object({
  version: z.literal(1),
  timestamp: z.number(),
  playerData: z.object({
    // ... existing fields
  }),
  story: z.object({
    flags: z.record(z.boolean()),
    chapter: z.number().default(1),  // ADD THIS
  }),
  // ... rest of schema
});
```

**Step 2: Update SaveService createSaveData()**
```typescript
// apps/vale-v2/src/core/services/SaveService.ts
story: {
  flags: story.flags,
  chapter: story.chapter || 1,  // ADD THIS
},
```

**Step 3: Update saveSlice.ts saveGame()**
```typescript
// Line 200 in saveSlice.ts
const { team, roster, story, currentMapId, playerPosition, gold, equipment } = get();
// story already includes chapter from storySlice
```

**Step 4: Update loadGame() to restore chapter**
```typescript
// In saveSlice.ts loadGame()
if (saveData.story) {
  state.setStoryFlags(saveData.story.flags || {});
  state.setCurrentChapter(saveData.story.chapter || 1);  // ADD THIS
}
```

### Files to Modify
- `apps/vale-v2/src/data/schemas/SaveV1Schema.ts`
- `apps/vale-v2/src/core/services/SaveService.ts`
- `apps/vale-v2/src/ui/state/saveSlice.ts`
- `apps/vale-v2/src/ui/state/storySlice.ts` (verify chapter field exists)

### Testing
```bash
pnpm validate:data  # Schema validation
pnpm test tests/core/save/  # Save system tests
# Manual: Save game, reload, verify chapter persists
```

---

## Implementation Order

1. **TODO 2 first** (simplest - just remove code)
2. **TODO 3 second** (schema + save/load)
3. **TODO 1 last** (most complex - full hydration)

---

## Estimated Time

- TODO 2: 10 minutes
- TODO 3: 20 minutes
- TODO 1: 30 minutes

**Total: ~60 minutes** (1 hour)

---

## Success Criteria

- ✅ All TODOs removed from code
- ✅ `pnpm typecheck` passes
- ✅ `pnpm validate:data` passes
- ✅ Save/load roundtrip works correctly
- ✅ No functional regressions

