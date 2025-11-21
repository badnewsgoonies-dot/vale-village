# Phase 1: Flexible Team Size (1-4 Units) - Implementation Prompt

## Context

The codebase currently hardcodes teams to exactly 4 units. VS1 needs to start with only Isaac (1 unit) + Flint Djinn. This requires making the team size flexible (1-4 units) throughout the entire codebase.

## Goal

Enable teams of 1-4 units instead of hardcoded 4 units, maintaining backward compatibility with existing 4-unit teams and saves.

## Implementation Order

Follow this exact order to ensure dependencies are met:

### Phase A: Foundation (Steps 1-3)

**Step 1: Update Constants**
- File: `src/core/constants.ts`
- Add constants:
  ```typescript
  export const MIN_PARTY_SIZE = 1;
  export const MAX_PARTY_SIZE = 4;
  export const PARTY_SIZE = MAX_PARTY_SIZE; // Keep for backward compatibility
  export const MAX_QUEUE_SIZE = MAX_PARTY_SIZE; // Keep for backward compatibility
  ```
- Update `createEmptyQueue()` function:
  ```typescript
  export function createEmptyQueue(size: number = MAX_PARTY_SIZE): readonly null[] {
    if (size < MIN_PARTY_SIZE || size > MAX_PARTY_SIZE) {
      throw new Error(`Queue size must be between ${MIN_PARTY_SIZE} and ${MAX_PARTY_SIZE}, got ${size}`);
    }
    return Array(size).fill(null) as null[];
  }
  ```

**Step 2: Update Team Model**
- File: `src/core/models/Team.ts`
- Add import: `import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '../constants';`
- Update `createTeam()` function:
  ```typescript
  export function createTeam(units: readonly Unit[]): Team {
    if (units.length < MIN_PARTY_SIZE || units.length > MAX_PARTY_SIZE) {
      throw new Error(`Team must have between ${MIN_PARTY_SIZE} and ${MAX_PARTY_SIZE} units, got ${units.length}`);
    }
    // ... rest unchanged
  }
  ```
- Update comment for `units` property: `/** Party members (1-4 units) */`

**Step 3: Update Team Schema**
- File: `src/data/schemas/TeamSchema.ts`
- Add import: `import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '../../core/constants';`
- Change line 19:
  ```typescript
  // BEFORE:
  units: z.array(UnitSchema).length(4),  // Exactly 4 units
  
  // AFTER:
  units: z.array(UnitSchema).min(MIN_PARTY_SIZE).max(MAX_PARTY_SIZE),  // 1-4 units
  ```

### Phase B: Core Logic (Steps 4-7)

**Step 4: Update Battle State Creation**
- File: `src/core/models/BattleState.ts`
- Update `createBattleState()` function (around line 208):
  ```typescript
  // BEFORE:
  queuedActions: createEmptyQueue(),
  
  // AFTER:
  queuedActions: createEmptyQueue(playerTeam.units.length),
  ```
- Update `BattleQueue` interface comments (lines 66-69):
  ```typescript
  export interface BattleQueue {
    /** Which unit we're currently selecting action for (0 to teamSize-1) */
    currentQueueIndex: number;
    /** Queued actions for each unit (null if not queued yet). Array length matches team size (1-4) */
    queuedActions: readonly (QueuedAction | null)[];
    // ... rest unchanged
  }
  ```

**Step 4.5: Update Battle State Invariants**
- File: `src/core/validation/battleStateInvariants.ts`
- Update `validateQueueInvariants()` function (lines 110-118):
  ```typescript
  // BEFORE:
  if (state.queuedActions.length !== 4) {
    throw new BattleStateInvariantError(
      `Queue length (${state.queuedActions.length}) is not 4`,
      'QUEUE_LENGTH_INVALID',
      { queueLength: state.queuedActions.length }
    );
  }
  
  // AFTER:
  const teamSize = state.playerTeam.units.length;
  if (state.queuedActions.length !== teamSize) {
    throw new BattleStateInvariantError(
      `Queue length (${state.queuedActions.length}) doesn't match team size (${teamSize})`,
      'QUEUE_LENGTH_INVALID',
      { queueLength: state.queuedActions.length, teamSize }
    );
  }
  ```

**Step 5: Update Battle State Schema**
- File: `src/data/schemas/BattleStateSchema.ts`
- Add import: `import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '../../core/constants';`
- Update schema (around lines 49-50):
  ```typescript
  // BEFORE:
  currentQueueIndex: z.number().int().min(0).max(3),
  queuedActions: z.array(QueuedActionSchema.nullable()).length(4),
  
  // AFTER:
  currentQueueIndex: z.number().int().min(0), // Max validated in superRefine
  queuedActions: z.array(QueuedActionSchema.nullable()).min(MIN_PARTY_SIZE).max(MAX_PARTY_SIZE),
  ```
- Add to `superRefine` (after existing validations, around line 65):
  ```typescript
  const teamSize = b.playerTeam.units.length;
  
  // Validate currentQueueIndex doesn't exceed team size
  if (b.currentQueueIndex >= teamSize) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: teamSize - 1,
      type: 'number',
      inclusive: true,
      path: ['currentQueueIndex'],
      message: `currentQueueIndex (${b.currentQueueIndex}) exceeds team size (${teamSize})`,
    });
  }
  
  // Validate queuedActions length matches team size
  if (b.queuedActions.length !== teamSize) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['queuedActions'],
      message: `queuedActions length (${b.queuedActions.length}) must match team size (${teamSize})`,
    });
  }
  
  // Validate queuedActions reference valid unit indices
  for (const [i, action] of b.queuedActions.entries()) {
    if (action && i >= teamSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['queuedActions', i],
        message: `Queued action at index ${i} exceeds team size (${teamSize})`,
      });
    }
  }
  ```

**Step 6: Update Queue Service Functions**
- File: `src/core/services/QueueBattleService.ts`
- Update `queueAction()` function (after line 68):
  ```typescript
  const unitIndex = state.playerTeam.units.findIndex(u => u.id === unitId);
  if (unitIndex === -1) {
    return Err(`Unit ${unitId} not found in player team`);
  }
  
  // Add bounds check:
  const teamSize = state.playerTeam.units.length;
  if (unitIndex < 0 || unitIndex >= teamSize) {
    return Err(`Unit index ${unitIndex} out of bounds for team size ${teamSize}`);
  }
  ```
- Update `clearQueuedAction()` comment (line 106):
  ```typescript
  // BEFORE:
  /**
   * @param unitIndex - Index of unit (0-3)
   */
  
  // AFTER:
  /**
   * @param unitIndex - Index of unit (0 to teamSize-1)
   */
  ```
- Update `validateQueueForExecution()` function (around line 194):
  ```typescript
  // BEFORE:
  if (!isQueueComplete(state.queuedActions)) {
    throw new Error('Cannot execute: queue is not complete');
  }
  
  // AFTER:
  if (!isQueueComplete(state.queuedActions, state.playerTeam.units.length)) {
    throw new Error('Cannot execute: queue is not complete');
  }
  ```
- Update `transitionToPlanningPhase()` function (around line 375):
  ```typescript
  // BEFORE:
  queuedActions: createEmptyQueue(),
  
  // AFTER:
  queuedActions: createEmptyQueue(updatedTeam.units.length),
  ```

**Step 7: Update Mana Algorithm**
- File: `src/core/algorithms/mana.ts`
- Update `isQueueComplete()` function (around line 91):
  ```typescript
  // BEFORE:
  export function isQueueComplete(
    queuedActions: readonly (import('../models/BattleState').QueuedAction | null)[]
  ): boolean {
    return queuedActions.length === 4 && queuedActions.every(action => action !== null);
  }
  
  // AFTER:
  export function isQueueComplete(
    queuedActions: readonly (import('../models/BattleState').QueuedAction | null)[],
    teamSize?: number
  ): boolean {
    const expectedSize = teamSize ?? queuedActions.length;
    if (expectedSize < 1 || expectedSize > 4) {
      throw new Error(`Team size must be between 1 and 4, got ${expectedSize}`);
    }
    return queuedActions.length === expectedSize && queuedActions.every(action => action !== null);
  }
  ```

### Phase C: State Management (Steps 6.5-6.6)

**Step 6.5: Update Team Slice**
- File: `src/ui/state/teamSlice.ts`
- Update `swapPartyMember()` function (lines 65-76):
  ```typescript
  // BEFORE:
  const newUnits = [...state.team.units];
  newUnits[partyIndex] = newUnit;
  
  while (newUnits.length < 4) {
    const placeholderKey = Object.keys(UNIT_DEFINITIONS)[0];
    if (!placeholderKey) break;
    const placeholderDef = UNIT_DEFINITIONS[placeholderKey];
    if (!placeholderDef) break;
    newUnits.push(createUnit(placeholderDef, 1, 0));
  }
  
  const finalUnits = newUnits.slice(0, 4) as typeof state.team.units;
  
  // AFTER:
  const newUnits = [...state.team.units];
  
  // Handle append vs replace for variable team sizes
  if (partyIndex >= newUnits.length) {
    // Append if index is beyond current team size
    newUnits.push(newUnit);
  } else {
    // Replace existing unit
    newUnits[partyIndex] = newUnit;
  }
  
  // No padding, no slice - allow 1-4 units naturally
  const finalUnits = newUnits as typeof state.team.units;
  ```

### Phase D: Persistence (Steps 8-9.3)

**Step 8: Update Save Schema**
- File: `src/data/schemas/SaveV1Schema.ts`
- Add import: `import { MIN_PARTY_SIZE, MAX_PARTY_SIZE } from '../../core/constants';`
- Update schema (around line 28):
  ```typescript
  // BEFORE:
  activeParty: z.array(z.string().min(1)).length(4),  // Exactly 4 unit IDs
  
  // AFTER:
  activeParty: z.array(z.string().min(1)).min(MIN_PARTY_SIZE).max(MAX_PARTY_SIZE),  // 1-4 unit IDs
  ```

**Step 9: Update Save Slice - createSaveData()**
- File: `src/ui/state/saveSlice.ts`
- Update `createSaveData()` function (around lines 55-60):
  ```typescript
  // BEFORE:
  const partyIds = team.units.map(u => u.id).slice(0, 4);
  while (partyIds.length < 4) {
    partyIds.push(''); // Pad to meet schema requirement of length(4)
  }
  const activeParty = partyIds as [string, string, string, string];
  
  // AFTER:
  const partyIds = team.units.map(u => u.id);
  // No slice, no padding - save actual team size (1-4 units)
  const activeParty = partyIds;
  ```

**Step 9.1: Update Save Slice - loadGame()**
- File: `src/ui/state/saveSlice.ts`
- Update `loadGame()` function (around lines 133-159):
  ```typescript
  // BEFORE:
  const activeUnits = saveData.playerData.activeParty
    .map(unitId => saveData.playerData.unitsCollected.find(u => u.id === unitId))
    .filter((u): u is typeof saveData.playerData.unitsCollected[number] => u !== undefined);
  
  if (activeUnits.length > 0) {
    // Pad to 4 units if needed (in case save has fewer)
    while (activeUnits.length < 4 && activeUnits.length < saveData.playerData.unitsCollected.length) {
      const nextUnit = saveData.playerData.unitsCollected.find(
        u => !activeUnits.some(active => active.id === u.id)
      );
      if (nextUnit) activeUnits.push(nextUnit);
    }
  
    // Create team (will use first 4 units)
    const team = {
      units: activeUnits.slice(0, 4),
      // ... rest
    };
  
    state.setTeam(team);
  }
  
  // AFTER:
  const activeUnits = saveData.playerData.activeParty
    .filter(unitId => unitId !== '')  // Filter empty strings from old saves (backward compatibility)
    .map(unitId => saveData.playerData.unitsCollected.find(u => u.id === unitId))
    .filter((u): u is typeof saveData.playerData.unitsCollected[number] => u !== undefined);
  
  if (activeUnits.length > 0) {
    // No padding - use actual team size (1-4 units)
    const team = {
      units: activeUnits,  // No slice, no padding
      equippedDjinn: [],
      djinnTrackers: {},
      collectedDjinn: saveData.playerData.djinnCollected,
      currentTurn: 0,
      activationsThisTurn: {},
      djinnStates: {},
    };
  
    state.setTeam(team);
  }
  ```

**Step 9.2: Update Save Slice - loadGameSlot()**
- File: `src/ui/state/saveSlice.ts`
- Update `loadGameSlot()` function (around lines 274-300):
  - Apply IDENTICAL changes as `loadGame()` above
  - Filter empty strings, remove padding, remove slice

### Phase E: Testing Support (Step 9.5)

**Step 9.5: Update Test Factories**
- File: `src/test/factories.ts`
- Update `mkTeam()` function (around lines 76-90):
  ```typescript
  // BEFORE:
  /**
   * Create a team for testing (fills to 4 units if needed)
   */
  export function mkTeam(units: Unit[]): Team {
    // Ensure exactly 4 units
    const teamUnits = [...units];
    while (teamUnits.length < 4) {
      // Create placeholder units with 9999 HP so they survive but don't contribute damage
      teamUnits.push(mkUnit({
        id: `placeholder_${teamUnits.length}`,
        name: `Placeholder ${teamUnits.length}`,
        baseStats: { hp: 9999, pp: 0, atk: 0, def: 0, mag: 0, spd: 1 },
        currentHp: 9999,
        currentPp: 0,
      }));
    }
    return createTeam(teamUnits.slice(0, 4));
  }
  
  // AFTER:
  /**
   * Create a team for testing
   * @param units - Units to include (1-4)
   * @param padTo4 - If true, pads to 4 units with placeholders (for backward compatibility with existing tests)
   */
  export function mkTeam(units: Unit[], padTo4: boolean = false): Team {
    if (units.length === 0) {
      throw new Error('mkTeam requires at least 1 unit');
    }
    
    const teamUnits = [...units];
    
    if (padTo4) {
      while (teamUnits.length < 4) {
        teamUnits.push(mkUnit({
          id: `placeholder_${teamUnits.length}`,
          name: `Placeholder ${teamUnits.length}`,
          baseStats: { hp: 9999, pp: 0, atk: 0, def: 0, mag: 0, spd: 1 },
          currentHp: 9999,
          currentPp: 0,
        }));
      }
      return createTeam(teamUnits.slice(0, 4));
    }
    
    // No padding - use actual team size (1-4 units)
    return createTeam(teamUnits);
  }
  ```

### Phase F: UI Verification (Step 10)

**Step 10: Verify UI Components**
- File: `src/ui/components/QueueBattleView.tsx`
- Check for hardcoded loops: `for (let i = 0; i < 4; i++)`
- Check for hardcoded array access: `units[0]`, `units[1]`, `units[2]`, `units[3]`
- Verify uses dynamic approach: `battle.playerTeam.units.map()` or `battle.playerTeam.units.length`
- If fixes needed, update to use dynamic team size

## Testing Requirements

### Add New Tests

Create/update test files to verify:

1. **Team creation with 1-4 units:**
   ```typescript
   test('createTeam accepts 1-4 units', () => {
     expect(() => createTeam([mkUnit()])).not.toThrow(); // 1 unit
     expect(() => createTeam([mkUnit(), mkUnit()])).not.toThrow(); // 2 units
     expect(() => createTeam([mkUnit(), mkUnit(), mkUnit()])).not.toThrow(); // 3 units
     expect(() => createTeam([mkUnit(), mkUnit(), mkUnit(), mkUnit()])).not.toThrow(); // 4 units
     expect(() => createTeam([])).toThrow(); // 0 units
     expect(() => createTeam([mkUnit(), mkUnit(), mkUnit(), mkUnit(), mkUnit()])).toThrow(); // 5 units
   });
   ```

2. **Battle initialization with variable queue sizes:**
   ```typescript
   test('battle initializes with correct queue size for 1-unit team', () => {
     const team = mkTeam([mkUnit()], false); // No padding
     const battle = createBattleState(team, [mkEnemy()]);
     expect(battle.queuedActions.length).toBe(1);
     expect(battle.currentQueueIndex).toBe(0);
   });
   ```

3. **Queue completion validation:**
   ```typescript
   test('isQueueComplete works with variable team sizes', () => {
     const queue1 = [mkQueuedAction()];
     expect(isQueueComplete(queue1, 1)).toBe(true);
     
     const queue4 = [mkQueuedAction(), mkQueuedAction(), mkQueuedAction(), mkQueuedAction()];
     expect(isQueueComplete(queue4, 4)).toBe(true);
   });
   ```

4. **Save/load with flexible sizes:**
   ```typescript
   test('save/load preserves team size correctly', () => {
     const team1 = mkTeam([mkUnit()], false);
     const saveData = createSaveData(team1, { gold: 0, equipment: [] }, createStoryState(1), null);
     expect(saveData?.playerData.activeParty.length).toBe(1);
   });
   ```

### Update Existing Tests

- Update any tests that use `mkTeam()` to explicitly pass `padTo4: false` for new flexible tests
- Keep existing tests working with `padTo4: true` for backward compatibility
- Update tests that check for exactly 4 units to check for 1-4 units

## Validation Checklist

After implementation, verify:

- [ ] `createTeam()` accepts 1-4 units
- [ ] `TeamSchema` validates 1-4 units
- [ ] `createEmptyQueue(size)` creates correct size
- [ ] `createBattleState()` creates queue matching team size
- [ ] `BattleStateSchema` validates dynamic queue size
- [ ] `BattleQueue` interface comments updated
- [ ] `battleStateInvariants.ts` validates dynamic queue size
- [ ] `isQueueComplete()` checks against team size
- [ ] All `isQueueComplete()` call sites pass `teamSize` parameter
- [ ] All `createEmptyQueue()` call sites pass size parameter
- [ ] `teamSlice.ts` removed padding logic
- [ ] `teamSlice.ts` `swapPartyMember()` handles append vs replace correctly
- [ ] `saveSlice.ts` `createSaveData()` removed `.slice(0, 4)` and padding
- [ ] `saveSlice.ts` `loadGame()` removed padding and slice logic
- [ ] `saveSlice.ts` `loadGameSlot()` removed padding and slice logic
- [ ] `saveSlice.ts` filters empty strings from old saves
- [ ] `test/factories.ts` updated for flexible team sizes
- [ ] All `.slice(0, 4)` calls removed from codebase
- [ ] `SaveV1Schema` accepts 1-4 activeParty
- [ ] Save/load preserves team size correctly
- [ ] UI renders correct number of unit slots
- [ ] All existing tests pass (backward compatibility)
- [ ] New tests for 1-4 unit teams pass
- [ ] VS1 can start with 1 unit (Isaac) + Flint Djinn

## Backward Compatibility Notes

- Old saves may have `activeParty` with empty strings (from padding) - filter these out
- Old saves may have exactly 4 units - these should still load correctly
- Test factories support optional padding (`padTo4` parameter) for existing tests
- No data migration needed - just handle both formats

## Success Criteria

Phase 1 is complete when:
1. Teams can have 1-4 units
2. Battles initialize with correct queue size
3. Queue validation works for all team sizes
4. Battle state invariants validate dynamic queue size
5. State management removed padding logic
6. Save/load preserves team size and handles old saves
7. Test factories support flexible team sizes
8. UI renders correct number of units
9. All tests pass (existing + new)
10. VS1 can start with 1 unit (Isaac) + Flint Djinn

## Important Notes

- Follow the implementation order exactly (Phase A → B → C → D → E → F)
- Test after each phase before moving to the next
- Keep backward compatibility in mind - existing 4-unit teams should still work
- Filter empty strings when loading saves for backward compatibility
- Use `padTo4: false` for new tests, `padTo4: true` for existing tests that need padding

