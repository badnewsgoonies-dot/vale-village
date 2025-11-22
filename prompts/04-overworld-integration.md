# Complete Overworld Integration

## Context
Complete the overworld system integration to enable seamless transitions between overworld exploration and battles.

## Current State
- OverworldMap component exists with basic movement
- Battle system is complete
- Triggers exist but integration is incomplete
- Battle transitions are not seamless

## Tasks

### Task 1: Complete Battle Transition Flow
**Files:**
- `src/ui/state/gameFlowSlice.ts`
- `src/ui/components/OverworldMap.tsx`

**Requirements:**
- When encounter trigger fires, transition to battle mode
- Store overworld state (map, position) for return
- After battle victory, return to overworld at same position
- After battle defeat, return to last save point or inn

### Task 2: Implement Encounter Triggers
**File:** `src/core/services/EncounterService.ts`

**Requirements:**
- Random encounters based on map difficulty
- Fixed encounters at specific positions
- Boss encounters at story points
- Encounter rate configurable per map

### Task 3: Add Overworld State Persistence
**File:** `src/ui/state/overworldSlice.ts`

**Requirements:**
- Save current map ID
- Save player position
- Save visited maps
- Restore on game load

### Task 4: Enhance OverworldMap UI
**File:** `src/ui/components/OverworldMap.tsx`

**Requirements:**
- Display current map name
- Show minimap (optional)
- Display encounter rate indicator
- Show save points
- Show NPCs with interaction indicators

## Success Criteria
- Seamless battle transitions
- Overworld state persists
- Encounter system works correctly
- All tests pass
- No regressions in battle system

## Files to Review
- `src/ui/components/OverworldMap.tsx`
- `src/ui/state/overworldSlice.ts`
- `src/core/services/EncounterService.ts`
- `src/ui/state/gameFlowSlice.ts`
- `src/data/definitions/maps.ts`

## Recommended Model
**Claude 3.5 Sonnet** (200k context) - Sufficient for integration work


