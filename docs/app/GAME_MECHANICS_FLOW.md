# Game Mechanics Flow Documentation

This document describes the complete flow of game mechanics, particularly mode transitions, post-battle flow, and reward systems.

**Last Updated:** 2025-11-16 (after E2E fixes)

---

## Mode Transitions

### Available Modes
- `'overworld'` - Main game world, exploration
- `'team-select'` - Pre-battle team selection screen
- `'battle'` - Active battle
- `'rewards'` - Post-battle rewards screen
- `'dialogue'` - Dialogue/cutscene mode
- `'shop'` - Shop screen

### Mode Transition Flow

#### 1. Battle Trigger → Team Select
**Trigger:** Player encounters battle trigger (overworld tile or Dev Mode jump)

**Flow:**
```
overworld → team-select
```

**Implementation:**
- `handleTrigger()` (for overworld triggers) or `setPendingBattle()` (for Dev Mode) sets:
  - `mode: 'team-select'`
  - `pendingBattleEncounterId: encounterId`

**Key Point:** `setPendingBattle()` **automatically** sets mode to `'team-select'` when an `encounterId` is provided. This ensures consistent behavior whether triggered from overworld or Dev Mode.

#### 2. Team Select → Battle
**Trigger:** Player confirms team selection

**Flow:**
```
team-select → battle
```

**Implementation:**
- `confirmBattleTeam()` creates battle state and sets `mode: 'battle'`
- Clears `pendingBattleEncounterId`

#### 3. Battle → Rewards
**Trigger:** Battle ends (victory or defeat)

**Flow:**
```
battle → rewards
```

**Implementation:**
- `processVictory()` (in `rewardsSlice`) sets:
  - `mode: 'rewards'`
  - `lastBattleRewards: distribution`
  - `lastBattleEncounterId: encounterId` ⚠️ **Critical:** Stores encounterId before battle state is cleared

**Key Point:** `encounterId` is stored in `rewardsSlice.lastBattleEncounterId` because `battle` state is cleared after victory, losing the original `encounterId`.

#### 4. Rewards → Dialogue or Overworld
**Trigger:** Player clicks "Continue" on rewards screen

**Flow:**
```
rewards → dialogue (if recruitment) OR rewards → overworld (if no dialogue)
```

**Implementation:**
- `handleRewardsContinue()` (in `App.tsx`):
  1. Calls `claimRewards()` - clears `lastBattleRewards` but **keeps** `lastBattleEncounterId`
  2. Clears battle state
  3. Retrieves `encounterId` from `lastBattleEncounterId` (from rewards slice)
  4. Checks for recruitment dialogue:
     - If `ENCOUNTER_TO_RECRUITMENT_DIALOGUE[encounterId]` exists → `startDialogueTree()` → `mode: 'dialogue'`
     - Otherwise → `returnToOverworld()` → `mode: 'overworld'`
  5. Clears `lastBattleEncounterId` after use

**Key Points:**
- `claimRewards()` **does NOT** set mode to `'overworld'` anymore (changed in fix)
- Mode transition responsibility moved to `handleRewardsContinue()` to allow dialogue check
- `encounterId` must be preserved through rewards screen to trigger recruitment dialogues

#### 5. Dialogue → Overworld
**Trigger:** Dialogue completes

**Flow:**
```
dialogue → overworld
```

**Implementation:**
- `endDialogue()` sets `mode: 'overworld'`

---

## Post-Battle Flow

### Complete Flow Diagram

```
Battle Victory
    ↓
processVictory()
    ├─ Calculate rewards (XP, gold, equipment)
    ├─ Store rewards in lastBattleRewards
    ├─ Store encounterId in lastBattleEncounterId ⚠️ CRITICAL
    └─ Set mode: 'rewards'
    ↓
Rewards Screen (player views rewards)
    ↓
Player clicks "Continue"
    ↓
handleRewardsContinue()
    ├─ claimRewards() (clears rewards, keeps encounterId)
    ├─ Clear battle state
    ├─ Get encounterId from lastBattleEncounterId
    ├─ Check for recruitment dialogue
    │   ├─ YES → startDialogueTree() → mode: 'dialogue'
    │   └─ NO → returnToOverworld() → mode: 'overworld'
    └─ Clear lastBattleEncounterId
    ↓
[If dialogue triggered]
    ↓
Dialogue Screen (recruitment narrative)
    ├─ Dialogue effects processed:
    │   ├─ recruitUnit → adds unit to roster
    │   └─ grantDjinn → adds Djinn to team
    └─ endDialogue() → mode: 'overworld'
    ↓
Overworld
```

### Critical Implementation Details

#### 1. EncounterId Preservation
**Problem:** Battle state is cleared after victory, losing `encounterId` needed for recruitment dialogues.

**Solution:** Store `encounterId` in `rewardsSlice.lastBattleEncounterId` during `processVictory()`.

**Code:**
```typescript
// In processVictory (rewardsSlice.ts)
const encounterId = battle.encounterId || (battle.meta as any)?.encounterId || null;
set({
  lastBattleRewards: result.distribution,
  lastBattleEncounterId: encounterId, // Store for post-battle dialogue
  mode: 'rewards',
});
```

#### 2. Mode Transition Deferral
**Problem:** `claimRewards()` was immediately setting `mode: 'overworld'`, preventing dialogue check.

**Solution:** `claimRewards()` no longer sets mode. `handleRewardsContinue()` handles mode transition after checking for dialogue.

**Code:**
```typescript
// In claimRewards (rewardsSlice.ts)
// Don't set mode here - let handleRewardsContinue handle mode transition
// (it needs to check for recruitment dialogue first)
set({ lastBattleRewards: null });
```

#### 3. Equipment Choices
Some battles offer equipment choices that must be selected before continuing.

**Flow:**
1. Rewards screen shows equipment choice picker
2. Player selects equipment (1-9 keys or click)
3. `selectEquipmentChoice()` updates `rewards.choiceSelected`
4. Continue button becomes enabled
5. Player clicks continue → `handleRewardsContinue()`

---

## Recruitment System

### Recruitment Dialogues

**Trigger:** After battle victory, if `encounterId` matches a recruitment encounter.

**Mapping:** `ENCOUNTER_TO_RECRUITMENT_DIALOGUE` (in `App.tsx`) maps encounter IDs to dialogue tree IDs.

**Recruitment Encounters:**
- `house-01` → War Mage
- `house-05` → Blaze
- `house-08` → Sentinel (+ Fizz Djinn)
- `house-11` → Karis
- `house-14` → Tyrell
- `house-15` → Stormcaller (+ Squall Djinn)
- `house-17` → Felix
- `house-20` → (Final boss, no recruitment)

### Dialogue Effects

Recruitment dialogues can have two effects:

#### 1. Unit Recruitment
**Effect:** `recruitUnit: 'unit-id'`

**Implementation:**
- `processDialogueEffects()` (in `dialogueSlice.ts`) calls `addUnitToRoster()`
- Unit is added to roster at current party average level

#### 2. Djinn Granting
**Effect:** `grantDjinn: 'djinn-id'`

**Implementation:**
- `processDialogueEffects()` calls `collectDjinn()` directly from `DjinnService`
- **Important:** Does NOT use `setStoryFlag()` because `STORY_FLAG_TO_DJINN` doesn't have `djinn:*` keys
- Djinn is added to `team.collectedDjinn` array

**Code:**
```typescript
// In dialogueSlice.ts
if (typeof effects.grantDjinn === 'string') {
  const djinnId = effects.grantDjinn;
  const team = store.team;
  
  if (team) {
    const result = collectDjinn(team, djinnId);
    if (result.ok) {
      store.updateTeam(result.value);
    }
  }
}
```

### Story Joins (Separate System)

Some units join automatically via story flags (not recruitment dialogues):
- House 2 → Mystic (via `STORY_FLAG_TO_UNIT['house-02']`)
- House 3 → Ranger (via `STORY_FLAG_TO_UNIT['house-03']`)

These are handled by `processStoryFlagForUnit()` in `StoryService.ts`, triggered by `onBattleEvents()` when encounter completes.

---

## Djinn System

### Djinn Acquisition Methods

#### 1. Dialogue Effects (Recruitment Dialogues)
**Method:** `grantDjinn` effect in dialogue tree

**Implementation:** Direct call to `collectDjinn()` (see above)

**Examples:**
- House 8 → Fizz (via recruitment dialogue)
- House 15 → Squall (via recruitment dialogue)

#### 2. Story Flags (Encounter Completion)
**Method:** `STORY_FLAG_TO_DJINN` mapping in `storyFlags.ts`

**Implementation:** `processStoryFlagForDjinn()` in `StoryService.ts`

**Examples:**
- `encounter:ch1:special` → Fizz
- `miniboss:ch3` → Squall

**Note:** Story flag Djinn granting uses encounter flag keys (e.g., `encounter:ch1:8`), NOT `djinn:*` keys.

#### 3. Pre-Game (Starting Djinn)
**Method:** Initial team setup

**Examples:**
- Flint (starting Djinn)

### Djinn Collection Limits
- Maximum 12 Djinn total
- Cannot collect duplicate Djinn
- `collectDjinn()` validates and returns `Result<Team, string>`

---

## State Management

### Zustand Slices Involved

#### `gameFlowSlice`
- `mode: GameMode` - Current game mode
- `pendingBattleEncounterId: string | null` - Battle pending team selection
- `setPendingBattle(encounterId)` - Sets pending battle and mode to `'team-select'`
- `setMode(mode)` - Direct mode transition

#### `rewardsSlice`
- `lastBattleRewards: RewardDistribution | null` - Current rewards to display
- `lastBattleEncounterId: string | null` - ⚠️ **Critical:** Preserves encounterId for post-battle dialogue
- `showRewards: boolean` - Whether rewards screen is visible
- `processVictory(battle)` - Calculates and stores rewards + encounterId
- `claimRewards()` - Clears rewards (but keeps encounterId until `handleRewardsContinue` uses it)

#### `dialogueSlice`
- `currentDialogueTree: DialogueTree | null` - Active dialogue tree
- `currentDialogueState: DialogueState | null` - Current dialogue state
- `startDialogueTree(tree)` - Starts dialogue, sets mode to `'dialogue'`
- `processDialogueEffects(effects)` - Processes `recruitUnit` and `grantDjinn` effects

#### `teamSlice`
- `team: Team` - Current active team
- `roster: Unit[]` - All recruited units
- `updateTeam(team)` - Updates active team
- `addUnitToRoster(unit)` - Adds unit to roster

---

## Common Pitfalls & Solutions

### ❌ Problem: Mode doesn't transition to `'team-select'` after `setPendingBattle()`
**Cause:** Old code didn't automatically set mode.

**Solution:** ✅ Fixed - `setPendingBattle()` now sets `mode: 'team-select'` automatically.

### ❌ Problem: Recruitment dialogue doesn't trigger after battle
**Cause:** `encounterId` lost when battle state cleared, or `claimRewards()` set mode to `'overworld'` too early.

**Solution:** ✅ Fixed - Store `encounterId` in `rewardsSlice.lastBattleEncounterId` and defer mode transition to `handleRewardsContinue()`.

### ❌ Problem: Djinn not granted via dialogue effects
**Cause:** Dialogue tried to use `setStoryFlag('djinn:fizz', true)` but `STORY_FLAG_TO_DJINN` doesn't have `djinn:*` keys.

**Solution:** ✅ Fixed - Dialogue effects now call `collectDjinn()` directly.

### ❌ Problem: Equipment choice blocks continue button
**Cause:** Test helpers didn't handle equipment choices.

**Solution:** ✅ Fixed - Test helpers now check for and select equipment choices before clicking continue.

---

## Testing Considerations

### E2E Test Flow
1. Use `completeBattleFlow()` helper (in `tests/e2e/helpers.ts`)
2. Handles equipment choices automatically
3. Calls `handleRewardsContinue()` logic (via button click or `window.handleRewardsContinue`)
4. Waits for dialogue mode if `expectDialogue: true`

### Exposed Functions for Testing
- `window.handleRewardsContinue` - Exposed in `App.tsx` for E2E tests to use same logic as UI

---

## References

- `src/ui/state/gameFlowSlice.ts` - Mode transitions
- `src/ui/state/rewardsSlice.ts` - Rewards and encounterId storage
- `src/ui/state/dialogueSlice.ts` - Dialogue effects processing
- `src/App.tsx` - `handleRewardsContinue()` orchestration
- `src/core/services/DjinnService.ts` - Djinn collection logic
- `src/data/definitions/recruitmentDialogues.ts` - Recruitment dialogue definitions
- `src/data/definitions/storyFlags.ts` - Story flag to Djinn/Unit mappings
