# Battle UI - Bottom Layout Design (Final)

**Last Updated:** 2025-11-24
**Status:** Design Locked - Ready for Implementation

---

## Overview

This document specifies the complete bottom UI layout for the queue-based battle system. All interactive elements are positioned at the bottom of the screen, leaving maximum space for the battlefield.

---

## Layout Structure

```
┌─────────────────────────────── BATTLEFIELD (full screen) ───────────────────────────────┐
│                                                                                          │
│                                                                                          │
│                                                                                          │
│                                                                                          │
│                              [○○○○○○] Mana: 6/12                                        │
│                              ┌──────────────────┐                                       │
│         ┌─────────────────┐  │ ⚔️ ATTACK        │                                       │
│         │ Not enough mana!│  │ ABILITIES     →  │                                       │
│         └────┬────────────┘  │ DJINN ABILIT. →  │                                       │
│  ┌───────────┴─────────┐    └──────────────────┘                                       │
│  │  🟡    🟤    🔵     │      ↑ pops up                                                 │
│  │ Flint Granite Echo  │    ┌────┬────┬────┬────┐                                       │
│  │ (sprites standing)  │    │Isaa│Gare│Mia │Ivan│                                       │
│  └─────────────────────┘    │[ACT│    │    │    │  ← Bottom-middle                     │
│   ↑ Bottom-left             │ Lv5│Lv6 │Lv4 │Lv4 │                                       │
│   Click to open summons     │HP██│HP██│HP█─│HP█─│                                       │
│                             └────┴────┴────┴────┘                                       │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Player Portraits (Bottom-Middle)

**Position:** Horizontally centered at bottom of screen

**Layout:**
- 4 portraits in horizontal row (left to right in speed order)
- Active portrait highlighted/glowing
- Each portrait shows:
  - Character sprite/avatar
  - Name
  - Level
  - HP bar
  - Status indicator (✓ when action queued)

**Mechanical Display Elements:**

1. **Crit Counter Badge**
   - Position: Top-right corner of portrait
   - Format: `⚡7/10` (current hits / threshold)
   - Updates on each hit dealt by this unit
   - Visual: Small text with lightning icon
   - On crit trigger:
     - Portrait border flashes yellow (~200ms)
     - Counter resets to 0
     - Optional: Brief "CRITICAL!" text overlay

2. **Status Effect Icons**
   - Position: Below crit counter or above HP bar
   - Max visible: 2-3 icons
   - Each icon shows:
     - Status sprite (from `icons/misc/`)
     - Turn counter as small number (e.g., `🔥2` = Burn for 2 turns)
   - Available statuses:
     - 🔥 Burn (DoT)
     - ⛔ Paralyze (skip actions)
     - 🛡↓ Guard Break (defense down)
     - 🌀↑/↓ Haste/Slow (speed modifier)
     - 🎯 Focus (buff: +crit dmg or -mana cost)

3. **HP Bar**
   - Position: Bottom of portrait card
   - Visual: Gradient fill bar
   - Format: Filled portion shows current HP relative to max

4. **Queued Action Indicator**
   - Position: Bottom-right corner
   - Visual: ✓ checkmark when action queued
   - Appears after player confirms action for this unit

**Behavior:**
- Active portrait triggers action menu popup above it
- After action queued, next portrait becomes active
- Portraits remain static (no sliding animations)

**Design Inspiration:** Golden Sun original battle UI

---

### 2. Action Menu (Popup Above Active Portrait)

**Position:** Pops up directly above the active portrait

**Structure:**
```
┌──────────────────┐
│ ⚔️ ATTACK        │  ← Button: Select target → Queue action
│ ABILITIES     →  │  ← Button: Expand to ability grid
│ DJINN ABILIT. →  │  ← Button: Expand to djinn-granted abilities
└──────────────────┘
```

**Button Behaviors:**

1. **⚔️ ATTACK (with auto-attack metadata)**
   - Opens target selection
   - Select enemy → Confirm → Queue action
   - Display format varies by unit/weapon:

     **Same-turn mana (standard):**
     ```
     ⚔️ ATTACK
       +1 mana (this round)
     ```

     **Next-turn mana (battery units):**
     ```
     ⚔️ ATTACK
       +1 mana (next round)
     ```

     **Multi-hit weapons:**
     ```
     ⚔️ ATTACK (Double Hit)
       +2 mana (this round)
     ```

   - Auto-attack type is determined by:
     - Unit's base auto-attack type (same-turn vs next-turn)
     - Equipped weapon modifiers (single/double/triple hit)

2. **ABILITIES →**
   - Expands to show unit's learned psynergy
   - Display as 3-column icon grid (compact)
   - Each ability shows: icon + mana cost + name
   - Selected ability shows details below/adjacent
   - Keyboard navigable (arrow keys)

3. **DJINN ABILIT. →**
   - Shows abilities granted TO this unit BY team's Djinn
   - Same icon grid format as abilities
   - Different from Djinn summons (separate system)

**Ability Card Format:**

Each ability in the grid displays:

```
┌─────────────────────┐
│ [🔥] Fireball   4MP │  ⚡ (if can crit)
│ 40 DMG, Burns 2T    │
└─────────────────────┘
```

**Elements:**
1. **Icon** - Ability visual (from sprite assets or placeholder)
2. **Name** - Ability name (truncate if needed)
3. **Mana Cost** - e.g., `4MP`
4. **Crit Indicator** - `⚡` symbol if this ability can crit (decision: physical abilities only, or all?)
5. **Effect Description** - Always deterministic, never "chance to":
   - ✓ "Burns 2T" (burns for 2 turns, guaranteed)
   - ✓ "Paralyze 1T" (paralyzes for 1 turn, guaranteed)
   - ✗ "50% chance to burn" (NO - random mechanics removed)

**Grid Layout:**
- 3 columns
- Keyboard navigable (arrow keys)
- Selected ability shows expanded details below or adjacent

**Expansion Behavior:**
- When ability/djinn menu expands, replaces the 3 buttons
- Shows icon grid + selected ability details
- [BACK] button to return to main menu

---

### 3. Mana Bar (Above Action Menu)

**Position:** Directly above the action menu, centered

**Display Format:**
```
[●●●◍◍○○○]   ⤼ 1
```

**Visual Legend:**
- **● (solid fill)** = Currently available mana (usable now)
- **◍ (semi-transparent)** = Pending mana from same-turn auto-attacks (will be available when those attacks execute this round)
- **○ (hollow/empty)** = Empty capacity
- **⤼ N** = Total mana pending for next round from next-turn auto-attacks (only shown if N > 0)

**Rendering Rules:**
- Always show exactly `maxMana` circles
- Fill from left to right:
  1. First `currentMana` circles → solid
  2. Next `pendingThisRound` circles → semi-transparent
  3. Remaining → hollow
- Next-round indicator appears to the right, separate from circle row

**On Round Transition:**
- All semi-transparent (pending this round) → convert to solid
- `pendingNextRound` from previous round → becomes new `pendingThisRound`
- Bar updates visually to reflect new mana state

**Color Specs (example):**
- Solid: `#FFD54A` (gold)
- Semi-transparent: `rgba(255, 213, 74, 0.35)`
- Hollow: `transparent` with `1px` light border
- Next-round text: `0.9` opacity, `0.8rem` font size

**Behavior:**
- Team-wide mana pool (shared by all units)
- Auto-attacks generate mana according to their timing (same-turn → `pendingThisRound`, next-turn → `pendingNextRound`)
- Abilities consume `currentMana` immediately when queued

---

### 4. Djinn Advisor Panel (Bottom-Left)

**Position:** Bottom-left corner of screen

**Visual:**
- 3 Djinn sprites standing in a horizontal line
- Sprites use actual game assets (not icons/emoji)
- Names displayed below sprites: "Flint  Granite  Echo"
- Light container/background to distinguish from battlefield

**Speech Bubble System:**
```
┌─────────────────┐
│ Not enough mana!│  ← Tutorial/helper messages
└────┬────────────┘
     ↓
  🟡 Flint
```

**Tutorial Messages (Context-Aware):**
- "Not enough mana!" → When trying expensive ability without mana
- "Target an enemy first!" → When action needs target
- "Summons consume Djinn!" → First time opening summon menu
- "Speed determines turn order!" → Early game tip
- Idle chatter (optional): "Flint: Let's go!"

**Click Interaction:**
- Click Djinn panel → Opens summon screen (expands upward/center)

---

### 5. Djinn Summon Screen (Expanded)

**Trigger:** Click on Djinn advisor panel at bottom-left

**Layout:**
```
┌─────────────────────────────────────┐
│ SUMMONS                        [X]  │
├─────────────────────────────────────┤
│ Single (1 Djinn):                   │
│ [Flint]  [Granite]  [Echo]          │
│  🟡 5HP    🟤 8ATK     🔵 +SPD       │
├─────────────────────────────────────┤
│ Double (2 Djinn):                   │
│ [Rampage] [Tidal Wave] [Stone Gaze] │
│  🟡🟤 35dmg  🔵🟤 40dmg   🟡🔵 stun   │
├─────────────────────────────────────┤
│ Triple (3 Djinn):                   │
│ [Judgment] - 150 DMG all enemies    │
│  🟡🟤🔵 Ultimate summon               │
└─────────────────────────────────────┘
```

**Rows:**
1. **Single Summons:** Activate 1 of the 3 Djinn
2. **Double Summons:** Combinations of 2 Djinn (predefined pairs)
3. **Triple Summons:** Ultimate summon using all 3 Djinn

**Interaction:**
- Hover/click summon button → Show details
- Select summon → Queue action (consumes Djinn, enters standby)
- Click [X] or outside panel → Close summon screen

**Note:** This is separate from "DJINN ABILIT." button in action menu. That button shows abilities granted TO units, this screen shows summons.

---

## Design Rationale

### Why Golden Sun Original Layout (Option B)?

**Chosen Over:** Sliding action menu that moves between portraits (Option A)

**Reasons:**
1. **Simpler implementation** - No complex horizontal sliding animations
2. **Proven UX** - Golden Sun players instantly recognize pattern
3. **Less visual noise** - Portraits stay stable, only active highlighted
4. **Easier iteration** - Can refine menu content without animation complexity
5. **Project alignment** - "Golden Sun-inspired" per CLAUDE.md

### Why Mana Above Action Menu (Option 1)?

**Chosen Over:** Vertical mana circles to the left of action menu (Option 2)

**Reasons:**
1. **Clearer spatial relationship** - Mana displayed near abilities that cost mana
2. **Horizontal familiarity** - More intuitive for western reading patterns
3. **Visual cohesion** - Mana → Action Menu → Portraits form vertical stack

### Why Djinn Sprites (Not Icons)?

**Reasons:**
1. **Personality** - Advisor/helper role feels more alive with characters
2. **Tutorial integration** - Speech bubbles work better with character sprites
3. **Visual interest** - Djinn "standing" at bottom-left adds life to static UI
4. **Gameplay clarity** - Clear separation between Djinn panel vs ability icons

---

## Technical Implementation Notes

### CSS Grid Structure

```css
.battle-view {
  display: grid;
  grid-template-rows: 1fr auto; /* battlefield | bottom-ui */
  height: 100vh;
}

.bottom-ui {
  display: grid;
  grid-template-columns: 200px 1fr; /* djinn-panel | center-area */
  position: relative;
}

.center-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
```

### Component Hierarchy

```
QueueBattleView
├── Battlefield (full screen)
└── BottomUI
    ├── DjinnAdvisorPanel (bottom-left)
    │   ├── DjinnSprite (x3)
    │   ├── SpeechBubble (conditional)
    │   └── SummonScreen (modal overlay when expanded)
    └── CenterArea (bottom-middle)
        ├── ManaBar
        ├── ActionMenu (popup)
        │   ├── AttackButton
        │   ├── AbilitiesButton → AbilityGrid
        │   └── DjinnAbilitiesButton → AbilityGrid
        └── PlayerPortraits (x4)
```

### State Management

**Zustand Slice:** `queueBattleSlice.ts`

**Key State:**
- `activePortraitIndex: number` - Which portrait is currently acting
- `actionMenuOpen: boolean` - Is action menu visible?
- `summonScreenOpen: boolean` - Is summon screen expanded?
- `tutorialMessage: string | null` - Current advisor message to display
- `currentMana: number` - Currently available mana
- `maxMana: number` - Maximum mana capacity
- `pendingManaThisRound: number` - Mana coming from same-turn autos
- `pendingManaNextRound: number` - Mana coming from next-turn autos
- `critCounters: Record<string, number>` - Per-unit crit hit counters (unitId → count)
- `critThresholds: Record<string, number>` - Per-unit crit thresholds (can be modified by equipment)

**Methods:**
- `setActivePortrait(index)` - Switch active portrait
- `queueAction(action)` - Queue action and advance to next portrait
- `showTutorialMessage(message)` - Trigger Djinn advisor speech bubble
- `toggleSummonScreen()` - Open/close summon interface
- `updateManaState(current, pending, pendingNext)` - Update all mana values
- `incrementCritCounter(unitId)` - Increment crit counter for unit
- `resetCritCounter(unitId)` - Reset counter to 0 after crit fires
- `triggerCritFlash(unitId)` - Visual feedback for crit (200ms flash)

---

## Sprite Assets (Verified)

### Party Front Battle Sprites
**Location:** `public/sprites/battle/party/`
**Size:** 64×64px each

- Isaac: `public/sprites/battle/party/isaac/Isaac_lSword_Front.gif`
- Garet: `public/sprites/battle/party/garet/Garet_lSword_Front.gif`
- Mia: `public/sprites/battle/party/mia/Mia_Staff_Front.gif`
- Ivan: `public/sprites/battle/party/ivan/Ivan_Staff_Front.gif`

**Note:** Additional weapon variant sprites available (Axe, lBlade, Mace, Staff) for each character.

### Djinn Advisor Sprites
**Location:** `public/sprites/battle/djinn/`
**Size:** 32×32px each (can be scaled 2× to 64×64 for prominence)

- Venus (Flint): `public/sprites/battle/djinn/Venus_Djinn_Front.gif`
- Mars (Granite): `public/sprites/battle/djinn/Mars_Djinn_Front.gif`
- Mercury (Echo): `public/sprites/battle/djinn/Mercury_Djinn_Front.gif`
- Jupiter (bonus): `public/sprites/battle/djinn/Jupiter_Djinn_Front.gif`

### Background Sprites
**Location:** `public/sprites/backgrounds/gs1/`
**Example:** `public/sprites/backgrounds/gs1/Desert.gif` (256×120px)

**Note:** 72 total background sprites available (37 from GS1, 35 from GS2).

### Status Effect Icons
**Location:** `public/sprites/icons/misc/`
**Available icons:**
- `Poison.gif`, `Silence.gif`, `Curse.gif`, `Psynergy_Seal.gif`
- `Delusion.gif`, `Haunted.gif`
- `attack_up.gif`, `defense_up.gif`, `resist_up.gif`
- `Stat-Up.gif`, `Stat-Down.gif`

### UI Elements
**Available in:** `public/sprites/icons/buttons/`
- Attack, Defend, Item, Psynergy, Djinni, Summon buttons
- HP/PP bars, cursor sprites

---

## Figma Layout Specifications

This section provides exact positioning for creating visual mockups using the verified sprite assets.

**Reference Frame:** 960×540 (16:9)  
**Background:** `Desert.gif` (scaled to fill, nearest-neighbor filtering)

### Portrait Row (Bottom-Middle)

**Container:**
- Size: `280 × 64` (4 portraits + gaps)
- Position: `x = 340`, `y = 460` (16px from bottom, centered)
- Horizontal gap between portraits: `8px`

**Individual Portraits:**
1. **Isaac:**
   - Sprite: `Isaac_lSword_Front.gif` (64×64)
   - Position in row: `x = 0`, `y = 0`

2. **Garet:**
   - Sprite: `Garet_lSword_Front.gif` (64×64)
   - Position in row: `x = 72`, `y = 0`

3. **Mia:**
   - Sprite: `Mia_Staff_Front.gif` (64×64)
   - Position in row: `x = 144`, `y = 0`

4. **Ivan:**
   - Sprite: `Ivan_Staff_Front.gif` (64×64)
   - Position in row: `x = 216`, `y = 0`

**Portrait Overlays (per portrait):**
- HP bar: Full-width rectangle at bottom (8px height)
- Crit badge: `⚡7/10` at top-right
- Status icons: 2-3 small icons below crit badge
- Queued checkmark: Bottom-right corner

### Mana Bar (Above Portraits)

**Container:**
- Size: `260 × 24`
- Position: `x = 350` (centered), `y = 428` (8px above portraits)

**Contents:**
1. **Circle Row:**
   - Size: `180 × 10`
   - Position: `x = 0`, `y = 7`
   - 8 circles (10px diameter each, 4px gaps)
   - Fill states: solid / semi-transparent / hollow

2. **Next-Round Indicator:**
   - Text: `⤼ 1`
   - Position: `x = 190`, `y = 4`
   - Hidden when `pendingNextRound === 0`

### Action Menu (Above Active Portrait)

**Container:**
- Size: `240 × 100`
- Position: Centered above active portrait
  - For Isaac (leftmost): `x = 252`, `y = 352`
- Background: Dark semi-transparent (`#000000AA`)
- Border: 1px lighter color

**Contents:**
- Auto-layout vertical (Figma)
- 3 text rows:
  1. `⚔️ ATTACK (Double Hit)` + sub-line `+2 mana (this round)`
  2. `ABILITIES →`
  3. `DJINN ABILIT. →`

### Djinn Advisor Panel (Bottom-Left)

**Container:**
- Position: `x = 16`, `y = 460` (if 64×64 scaled sprites)
- Alternative: `y = 476` (if keeping 32×32 native size)

**Djinn Sprites (2× scale to 64×64):**
1. **Venus:**
   - Sprite: `Venus_Djinn_Front.gif` (scaled to 64×64)
   - Position: `x = 0`, `y = 0`

2. **Mars:**
   - Sprite: `Mars_Djinn_Front.gif` (scaled to 64×64)
   - Position: `x = 72`, `y = 0` (8px gap)

3. **Mercury:**
   - Sprite: `Mercury_Djinn_Front.gif` (scaled to 64×64)
   - Position: `x = 144`, `y = 0`

**Djinn Names (optional):**
- Text: `"Flint   Granite   Echo"`
- Size: `~160 × 12`
- Position: `x = 0`, `y = 68` (4px below sprites)

**Speech Bubble:**
- Size: `140 × 32`
- Position: `x = 0`, `y = -40` (floating above Venus)
- Contents: White rounded rectangle, black border, text `"Not enough mana!"`, downward-pointing triangle connector

---

## Interaction Flows

### Flow 1: Queuing an Attack
1. Isaac's portrait highlighted (active)
2. Action menu pops up above Isaac
3. User clicks **⚔️ ATTACK**
4. Target selection UI appears over battlefield
5. User clicks enemy
6. Attack queued, Isaac's portrait shows ✓
7. Next portrait (Garet) becomes active, menu pops above Garet

### Flow 2: Using an Ability
1. Garet's portrait highlighted (active)
2. Action menu pops up above Garet
3. User clicks **ABILITIES →**
4. Action menu expands to show 3-column ability grid
5. User clicks "Fireball" (costs 4 mana)
6. Mana bar updates: 6 → 2
7. Target selection appears
8. User selects enemy, ability queued
9. Next portrait (Mia) becomes active

### Flow 3: Djinn Summon
1. User clicks Djinn advisor panel (bottom-left)
2. Summon screen expands (modal overlay)
3. User clicks "Rampage" (double summon: Flint + Granite)
4. Confirmation prompt (optional)
5. Summon queued, consumes 2 Djinn (enter standby)
6. Djinn sprites dim/gray out
7. Summon screen closes

### Flow 4: Tutorial Message
1. User tries to queue "Megiddo" (costs 15 mana, only has 6)
2. Game detects invalid action
3. Speech bubble appears above Flint sprite: "Not enough mana!"
4. Message auto-dismisses after 3 seconds or user clicks

---

## Design Decisions (Finalized)

1. **Speech Bubble Timing:**
   - **Decision:** Auto-dismiss after 3 seconds AND allow user click to dismiss earlier
   - For critical/blocking messages, can introduce a "sticky" flag later

2. **Djinn Idle Animations:**
   - **Decision:** Start static for initial implementation
   - Add subtle 2-3 frame idle animation later (tiny bob/blink loop) once performance budget is clear

3. **Portrait Animation:**
   - **Decision:** Start static
   - Optional polish pass: add light "breathing" or glow-pulse ONLY on active portrait to avoid clutter

4. **Summon Screen Size:**
   - **Decision:** Fixed-max modal that scales within viewport
   - Max width: ~70% of viewport
   - Centered on screen
   - Scrollable if content overflows

5. **Ability Grid Expansion:**
   - **Decision:** Grid overlays battlefield area (floating panel)
   - Keeps bottom UI layout stable (no reflow)
   - Visually attached to bottom UI but floats above battlefield

6. **Mana Preview:**
   - **Decision:** YES - show ghosted +1 circle for each queued auto-attack
   - Numeric "Mana: X/Y" strictly shows currently available mana (no preview in number)

7. **Crit Counter Display:**
   - **Decision:** Per-unit crit counter displayed on each portrait
   - Badge format: `⚡N/threshold` (e.g., `⚡7/10`)
   - Visual feedback on crit: 200ms yellow border flash + counter reset animation
   - Alternative team-wide counter deferred for now

8. **Status Effect Icon System:**
   - **Decision:** Small, fixed set of deterministic status icons
   - Max 2-3 visible per portrait to avoid clutter
   - Core statuses: Burn, Paralyze, Guard Break, Haste/Slow, Focus
   - Each shows remaining turns as small number overlay
   - Icons sourced from `public/sprites/icons/misc/`

9. **Auto-Attack Type Indicators:**
   - **Decision:** Action menu shows mana generation timing inline
   - Same-turn: `"+N mana (this round)"`
   - Next-turn: `"+N mana (next round)"`
   - Multi-hit weapons show hit count: `"ATTACK (Double Hit)"`

---

## Implementation Phases

### Phase 1: Core Layout (CSS + Skeleton Components)

**Goal:** Visual structure only, no game logic

- Split `QueueBattleView` into two grid rows:
  - Battlefield area (row 1)
  - BottomUI area (row 2)
- Apply CSS grid layout:
  ```css
  .battle-view {
    display: grid;
    grid-template-rows: 1fr auto; /* battlefield | bottom-ui */
    height: 100vh;
  }

  .bottom-ui {
    display: grid;
    grid-template-columns: 200px 1fr; /* djinn-panel | center-area */
    position: relative;
    padding: 8px 16px;
  }

  .center-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  ```
- Add skeleton components:
  - `<DjinnAdvisorPanel />` placeholder (bottom-left)
  - `<CenterArea />` placeholder (bottom-middle):
    - `<ManaBar />` stub
    - `<ActionMenu />` stub
    - `<PlayerPortraits />` row (4 slots with dummy data)

### Phase 2: State Wiring (Zustand)

**Goal:** Extend `queueBattleSlice.ts` with UI-oriented state

- Add new state fields:
  - `activePortraitIndex: number` - Which portrait is currently acting
  - `isActionMenuOpen: boolean` - Is action menu visible?
  - `isSummonScreenOpen: boolean` - Is summon screen expanded?
  - `tutorialMessage: string | null` - Current Djinn advisor message
- Add new actions:
  - `setActivePortrait(index: number)`
  - `openActionMenu()` / `closeActionMenu()`
  - `toggleSummonScreen()`
  - `showTutorialMessage(message: string, durationMs?: number)`
  - `clearTutorialMessage()`
- Hook into planning flow:
  - When planning starts: set `activePortraitIndex = 0`, `isActionMenuOpen = true`
  - After action queued: advance to next portrait
  - When all queued: close menu

### Phase 3: Player Portraits (Bottom-Middle)

**Goal:** Implement interactive portrait display

- Create `<PlayerPortraits />` component:
  - Props: `units`, `activeIndex`, `queuedActionIds`
  - Show 4 slots (or N units if dynamic)
  - Each portrait displays:
    - Character sprite
    - Name
    - Level
    - HP bar
    - Status indicator (✓ when action queued)
  - Highlight active portrait (glow/border)
  - Portraits remain static (no sliding animations)
  - Optional: Click portrait to set `activePortraitIndex` during planning

### Phase 4: Action Menu Popup

**Goal:** Implement main action selection menu

- Create `<ActionMenu />` positioned above active portrait:
  - Three main buttons:
    - `⚔️ ATTACK` - Trigger target selection → queue attack (0 mana, +1 on execution)
    - `ABILITIES →` - Switch to ability grid mode
    - `DJINN ABILIT. →` - Switch to djinn-ability grid mode
  - Add `[BACK]` button in grid modes to return to main menu
  - Wire button handlers:
    - ATTACK: opens target selection UI, calls `queueAction({ type: 'attack', targetId })`
    - ABILITIES/DJINN ABILIT.: toggle to grid display mode
  - Keyboard support (arrow keys) can wait for Phase 8 if needed

### Phase 5: Mana Bar

**Goal:** Display team-wide mana pool with preview

- Implement `<ManaBar />` above action menu:
  - Horizontal row of filled/empty circles
  - Text label: "Mana: X/Y"
  - Ghosted +1 preview when auto-attack is queued:
    - Show transparent circle for pending mana
    - Do NOT add to numeric count (only visual indicator)
  - Read from Zustand slice selector (team-wide pool)
  - Do NOT import core services directly

### Phase 6: Djinn Advisor Panel & Speech Bubble

**Goal:** Tutorial system with personality

- Implement `<DjinnAdvisorPanel />` in bottom-left:
  - Load 3 Djinn sprites from `src/assets/sprites/djinn/`:
    - `flint.png`, `granite.png`, `echo.png`
  - Display names under sprites
  - Click panel → toggle `isSummonScreenOpen`
- Implement `<SpeechBubble />` component:
  - Anchored to active Djinn (typically Flint)
  - Render when `tutorialMessage` is non-null
  - Auto-dismiss after 3 seconds OR user click
- Wire helper triggers:
  - Insufficient mana → "Not enough mana!"
  - Missing target → "Target an enemy first!"
  - First summon → "Summons consume Djinn!"
  - First battle → "Speed determines turn order!"

### Phase 7: Djinn Summon Screen

**Goal:** Modal interface for summons

- Implement `<SummonScreen />` modal overlay:
  - Three sections (rows):
    - **Single (1 Djinn):** Individual Djinn activations
    - **Double (2 Djinn):** Predefined pair combinations
    - **Triple (3 Djinn):** Ultimate summon
  - Each summon button shows:
    - Name
    - Djinn cost icons (🟡🟤🔵)
    - Effect summary line
  - Modal sizing:
    - Max width: 70% viewport
    - Centered, scrollable if needed
  - Wire to battle planning:
    - On selection → `queueAction({ type: 'summon', summonId })`
    - Mark Djinn in "standby" (via slice action)
    - Close modal after selection
  - Visual feedback:
    - Dim/gray out consumed Djinn sprites in advisor panel

### Phase 8: Ability Grids (Abilities & Djinn Abilities)

**Goal:** Reusable ability selection component

- Create `<AbilityGrid />` component:
  - 3-column icon grid layout
  - Each tile shows:
    - Ability icon
    - Mana cost
    - Name (truncated if needed)
  - Detail display:
    - On selection → show damage, element, description below grid
  - Keyboard navigation:
    - Arrow keys move selection
    - Enter/Space confirm selection
  - Use for both:
    - Regular abilities (unit's learned psynergy)
    - Djinn-granted abilities (from team's Djinn)
- Grid overlay style:
  - Floats above battlefield area
  - Attached to bottom UI visually
  - Keeps bottom layout stable (no reflow)

### Phase 9: Integration & Polish

**Goal:** Final wiring and refinements

- Wire all interactions to Zustand state
- Test complete planning flow (all 4 portraits)
- Add animations (if needed):
  - Subtle active portrait glow/pulse
  - Menu popup transitions
- Accessibility:
  - Keyboard navigation (tab order)
  - Screen reader labels
  - Focus management
- Performance check:
  - Ensure sprite loading doesn't block UI
  - Verify no unnecessary re-renders

---

## References

- [CLAUDE.md](../CLAUDE.md) - Project overview and architecture
- [docs/implementation-plan-battle-grid.md](./implementation-plan-battle-grid.md) - Previous grid-based plan (superseded)
- [docs/app/GAME_MECHANICS_FLOW.md](./app/GAME_MECHANICS_FLOW.md) - Complete game flow documentation

---

**Design Status:** ✅ Locked and ready for implementation
**Next Step:** Begin Phase 1 implementation (CSS layout foundation)
