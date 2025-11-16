# E2E Test Suite Improvement Prompt

## Context

We have a basic Playwright E2E test (`game-start.spec.ts`) that validates:
- Game loads
- Zustand store exists
- Initial team created (Isaac + Flint)
- Overworld renders
- Player position tracked

**Current test is weak** - it only checks that things exist, not that they work correctly.

## Your Task

Drastically improve the E2E test suite by leveraging **actual game mechanics and data** from the codebase.

## Available Game Data You Must Use

### Maps (src/data/definitions/maps.ts)
- `vale-village` map: 30x20 grid
- **Spawn point:** `{ x: 15, y: 10 }`
- **Battle triggers:**
  - `{ x: 7, y: 10 }` → `house-01` encounter
  - `{ x: 10, y: 10 }` → `house-02` encounter
- **Transition trigger:**
  - `{ x: 8, y: 6 }` → Weapon shop interior
- **Shop trigger:**
  - `{ x: 12, y: 5 }` → `vale-armory`
- **Path tiles:** Row 10 (y=10) from x=5 to x=24
- **Walls:** x=5 and x=24, rows 3-8

### Encounters (src/data/definitions/encounters.ts)
- `house-01`: Tutorial battle
  - Enemies: `earth-scout`, `venus-wolf`
  - Reward: 50 XP, 18 gold, `wooden-sword`
- `house-02`: Djinn battle
  - Enemies: `flame-scout`, `mars-wolf`
  - Reward: 60 XP, 19 gold, Flint Djinn

### Initial Team State (src/App.tsx lines 50-90)
- **Unit:** Isaac (Adept, Level 1)
- **Djinn:** Flint (collected and equipped to slot 0)
- **Gold:** 0
- **Equipment:** None
- **Roster:** [Isaac]

### Game Modes (src/ui/state/gameFlowSlice.ts)
- `overworld` - Default start mode
- `team-select` - Pre-battle team selection
- `battle` - Active battle
- `rewards` - Post-battle rewards
- `dialogue` - NPC dialogue
- `shop` - Shop screen

## What You Must Test

### 1. Precise Movement Validation
**Current:** Just checks position is not null  
**Required:** 
- Start at spawn point (15, 10)
- Press ArrowRight → position becomes (16, 10)
- Press ArrowDown → position becomes (16, 11)
- Try moving into wall at (5, 5) → position DOES NOT change
- Verify step counter increments on valid moves

### 2. Battle Trigger Flow
**Current:** Not tested  
**Required:**
- Walk to (7, 10)
- Verify mode changes: `overworld` → `team-select`
- Verify `pendingBattleEncounterId` === `'house-01'`
- Click confirm button
- Verify mode changes: `team-select` → `battle`
- Verify battle state has 2 enemies (earth-scout, venus-wolf)

### 3. Battle Execution
**Current:** Not tested  
**Required:**
- Queue action for Isaac (e.g., "Attack" targeting enemy 0)
- Click "Execute Round" button
- Wait for turn execution
- Verify enemy HP decreased
- Verify battle events logged
- Continue until victory
- Verify mode changes: `battle` → `rewards`

### 4. Rewards Validation
**Current:** Not tested  
**Required:**
- Verify rewards screen shows:
  - XP gained: 50
  - Gold gained: 18
  - Equipment reward: wooden-sword
- Click "Continue"
- Verify Isaac's XP increased by 50
- Verify team gold increased by 18
- Verify inventory contains wooden-sword
- Verify mode returns to `overworld`

### 5. Shop Interaction
**Current:** Not tested  
**Required:**
- Walk to shop trigger (12, 5)
- Verify mode changes to `shop`
- Verify `currentShopId` === `'vale-armory'`
- Verify shop inventory renders
- Click "Exit" or "Back"
- Verify mode returns to `overworld`

### 6. Map Transition
**Current:** Not tested  
**Required:**
- Walk to transition trigger (8, 6)
- Verify map changes: `vale-village` → `weapon-shop-interior`
- Verify player position changes to (5, 7)
- Walk back to exit trigger
- Verify map returns to `vale-village`
- Verify player position at (8, 6)

### 7. Djinn Collection
**Current:** Not tested  
**Required:**
- Win house-02 battle (grants Flint Djinn)
- After rewards screen, verify:
  - Team has 1 Djinn: `['flint']`
  - Djinn is in 'Set' state
  - Team djinnTrackers contains flint entry

### 8. Party Management
**Current:** Not tested  
**Required:**
- Open Party Management screen (button in header)
- Verify Isaac is displayed
- Verify Flint Djinn is shown as equipped
- Close screen
- Verify returns to overworld

### 9. Save/Load Flow
**Current:** Not tested  
**Required:**
- Make progress (gain gold, XP, equipment)
- Click "Save Game" button
- Select save slot 1
- Reload page
- Click "Load Game" button
- Select save slot 1
- Verify all state restored:
  - Isaac's XP/level preserved
  - Gold amount preserved
  - Inventory preserved
  - Player position preserved

### 10. Error Boundary Coverage
**Current:** Only checks for generic error text  
**Required:**
- Verify no console errors during normal gameplay
- Test invalid actions don't crash (e.g., attack when no target)
- Verify graceful degradation

## Implementation Requirements

### Test Organization
```typescript
test.describe('Game Initialization', () => {
  // Basic load tests
});

test.describe('Overworld Movement', () => {
  // Movement, walls, step counter
});

test.describe('Battle Trigger & Team Selection', () => {
  // Encounter triggers, pre-battle screen
});

test.describe('Battle System', () => {
  // Action queueing, round execution, victory
});

test.describe('Rewards & Progression', () => {
  // XP, gold, equipment, Djinn rewards
});

test.describe('Shops & NPCs', () => {
  // Shop interactions, NPC dialogue
});

test.describe('Map Transitions', () => {
  // Transition triggers, map changes
});

test.describe('Save/Load System', () => {
  // Persistence, roundtrip validation
});
```

### Helper Functions to Create
```typescript
// Navigate player to specific coordinates
async function navigateToPosition(page: Page, targetX: number, targetY: number): Promise<void>

// Get full game state snapshot
async function getGameState(page: Page): Promise<GameState>

// Execute a full battle (queue actions until victory/defeat)
async function executeBattle(page: Page, actions: BattleAction[]): Promise<BattleResult>

// Wait for mode change
async function waitForMode(page: Page, expectedMode: string, timeout?: number): Promise<void>

// Verify store state matches expected
async function assertStoreState(page: Page, expected: Partial<GameState>): Promise<void>
```

### Determinism Requirements
- Use `waitForFunction` instead of `waitForTimeout` where possible
- Always verify state changes, not just timing
- Test both success and failure paths
- Use actual game data (spawn points, trigger coords, enemy counts)

## Success Criteria

Your improved test suite must:
1. ✅ Use actual map coordinates from `maps.ts`
2. ✅ Use actual encounter data from `encounters.ts`
3. ✅ Verify precise state transitions (not just "state exists")
4. ✅ Cover full gameplay loop: move → trigger → battle → rewards → overworld
5. ✅ Test edge cases (walls, invalid moves, invalid actions)
6. ✅ Validate data persistence (save/load roundtrip)
7. ✅ Have helper functions to reduce duplication
8. ✅ Be deterministic (no flaky timeouts)
9. ✅ Cover at least 8 of the 10 test categories above

## Files You'll Need to Reference

- `apps/vale-v2/src/data/definitions/maps.ts` - Map data
- `apps/vale-v2/src/data/definitions/encounters.ts` - Encounter data
- `apps/vale-v2/src/data/definitions/enemies.ts` - Enemy stats
- `apps/vale-v2/src/data/definitions/units.ts` - Unit definitions
- `apps/vale-v2/src/ui/state/store.ts` - Store type definitions
- `apps/vale-v2/src/core/models/BattleState.ts` - Battle state structure
- `apps/vale-v2/src/ui/components/QueueBattleView.tsx` - Battle UI selectors

## Current Test to Replace

File: `apps/vale-v2/tests/e2e/game-start.spec.ts`

Replace it entirely with your comprehensive test suite.

## Output Format

Provide:
1. Complete new `game-start.spec.ts` file
2. Any helper files if needed (e.g., `e2e/helpers.ts`)
3. Brief explanation of test coverage improvements

---

**Remember:** The goal is not just "more tests" but **better tests that validate actual game mechanics using real data from the codebase**. Every assertion should reference specific values from the game definitions.
