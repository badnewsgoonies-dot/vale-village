# Complete System 4: Overworld State Persistence & Defeat Handling

## Context
System 4 (Overworld Integration) is 90% complete. Battle transitions work, but overworld state persistence and defeat handling are missing.

## Current State
**What Works:**
- ✅ Battle transitions (overworld → battle)
- ✅ Post-battle return to overworld (victory)
- ✅ Pre-battle position saved (`preBattlePosition`)
- ✅ Encounter system functional
- ✅ OverworldMap displays correctly

**What's Missing:**
- ❌ Overworld state not saved to save file
- ❌ Overworld state not restored on load
- ❌ Defeat handling (return to save point/inn)

## Tasks
### Task 1: Add Overworld State to Save Schema
- **File:** `apps/vale-v2/src/data/schemas/SaveV1Schema.ts`
- **Add fields:**
```ts
overworld: {
  currentMapId: string;
  playerPosition: { x: number; y: number };
  facing: 'up' | 'down' | 'left' | 'right';
  stepCount: number;
  visitedMaps: string[]; // Optional: track visited maps
}
```

### Task 2: Save Overworld State
- **File:** `apps/vale-v2/src/core/services/SaveService.ts` or `saveSlice.ts`
- **Implementation:**
  - When saving, include overworld state from `overworldSlice`
  - Save current map, position, facing, step count
  - Optionally save visited maps

### Task 3: Restore Overworld State on Load
- **File:** `apps/vale-v2/src/ui/state/saveSlice.ts`
- **Implementation:**
  - On load, restore overworld state
  - Set current map, position, facing
  - Restore step count
  - This is the TODO at line 130, 210

### Task 4: Implement Defeat Handling
- **File:** `apps/vale-v2/src/ui/state/gameFlowSlice.ts` or `App.tsx`
- **Requirements:**
  - When battle ends in defeat, don't return to overworld position
  - Instead, return to last save point or inn
  - If no save point, return to starting map/spawn point
- **Implementation:**
```ts
// In gameFlowSlice or App.tsx
const handleBattleDefeat = () => {
  const { lastSavePoint, startingMap, startingPosition } = get();

  // Return to last save point, or starting position if no save
  const returnMap = lastSavePoint?.mapId || startingMap;
  const returnPos = lastSavePoint?.position || startingPosition;

  teleportPlayer(returnMap, returnPos);
  setMode('overworld');
  setBattle(null, 0);
};
```

## Success Criteria
- ✅ Overworld state saved to save file
- ✅ Overworld state restored on load
- ✅ Defeat returns to save point/starting position
- ✅ Victory returns to pre-battle position (existing behavior)
- ✅ All tests pass
- ✅ Save/load cycle works correctly

## Files to Modify
- `apps/vale-v2/src/data/schemas/SaveV1Schema.ts` - Add overworld fields
- `apps/vale-v2/src/core/services/SaveService.ts` - Save overworld state
- `apps/vale-v2/src/ui/state/saveSlice.ts` - Restore overworld state (lines 130, 210)
- `apps/vale-v2/src/ui/state/gameFlowSlice.ts` - Add defeat handling
- `apps/vale-v2/src/App.tsx` - Handle defeat case

## Testing
# Test save/load with overworld state
# Test defeat handling
# Test victory returns to correct position
pnpm test tests/core/save/
pnpm dev  # Manual test: save, load, verify position

## Reference
- Current save schema: `apps/vale-v2/src/data/schemas/SaveV1Schema.ts`
- Overworld slice: `apps/vale-v2/src/ui/state/overworldSlice.ts`
- Game flow slice: `apps/vale-v2/src/ui/state/gameFlowSlice.ts`
- Starting map: `apps/vale-v2/src/data/definitions/maps.ts` (vale-village spawnPoint)
