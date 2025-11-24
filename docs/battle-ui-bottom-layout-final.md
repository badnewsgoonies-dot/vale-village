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

1. **⚔️ ATTACK**
   - Opens target selection
   - Select enemy → Confirm → Queue action
   - Costs 0 mana, generates +1 mana during execution

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

**Expansion Behavior:**
- When ability/djinn menu expands, replaces the 3 buttons
- Shows icon grid + selected ability details
- [BACK] button to return to main menu

---

### 3. Mana Bar (Above Action Menu)

**Position:** Directly above the action menu, centered

**Display:**
- Horizontal row of circles (filled/empty)
- Text label: "Mana: 6/12"
- Visual preview: +1 ghosted circle when auto-attack queued

**Behavior:**
- Team-wide mana pool (shared by all units)
- Auto-attacks generate +1 mana during execution
- Abilities consume mana immediately when queued

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

**Methods:**
- `setActivePortrait(index)` - Switch active portrait
- `queueAction(action)` - Queue action and advance to next portrait
- `showTutorialMessage(message)` - Trigger Djinn advisor speech bubble
- `toggleSummonScreen()` - Open/close summon interface

---

## Assets Required

### Djinn Sprites
- **Location:** `src/assets/sprites/djinn/` (assumed)
- **Djinn Needed:**
  - `flint.png` (Venus/Earth - 🟡)
  - `granite.png` (Venus/Earth - 🟤)
  - `echo.png` (Mercury/Water - 🔵)
  - Additional djinn as needed per game data

**Sprite Specs:**
- Small standing sprites (~32-48px tall)
- Transparent background
- Idle animation frames (optional, can start static)

### UI Elements
- Speech bubble (9-slice or CSS-based)
- Portrait frames/borders
- HP bar graphics
- Mana circle (filled/empty states)

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

## Open Questions / Future Considerations

1. **Speech Bubble Timing:**
   - Auto-dismiss after N seconds?
   - Or require user click to dismiss?

2. **Djinn Idle Animations:**
   - Should sprites have subtle idle animations?
   - Or stay static for performance?

3. **Portrait Animation:**
   - Should portraits have subtle breathing/idle animation?
   - Or static for clarity?

4. **Summon Screen Size:**
   - Fixed size modal?
   - Or scale based on available summons?

5. **Ability Grid Expansion:**
   - Should ability grid overlay battlefield?
   - Or push content upward?

6. **Mana Preview:**
   - Show "+1" as ghosted circle when auto-attack queued?
   - Or only update during execution phase?

---

## Implementation Phases

### Phase 1: Core Layout
- CSS grid structure for bottom UI
- Position djinn panel (bottom-left)
- Position portraits (bottom-middle)
- Position mana bar (above portraits)

### Phase 2: Action Menu
- Popup positioning above active portrait
- Three button layout (Attack/Abilities/Djinn Abilit.)
- Button click handlers (wireframe only)

### Phase 3: Djinn Advisor System
- Load djinn sprites
- Speech bubble component
- Tutorial message triggers (wire to game events)

### Phase 4: Summon Screen
- Modal overlay layout
- Three rows (single/double/triple)
- Click to summon functionality

### Phase 5: Ability Grids
- 3-column icon grid component
- Keyboard navigation
- Detail display on selection

### Phase 6: Integration & Polish
- Wire all interactions to Zustand state
- Animations (if needed)
- Accessibility (keyboard nav, screen reader)

---

## References

- [CLAUDE.md](../CLAUDE.md) - Project overview and architecture
- [docs/implementation-plan-battle-grid.md](./implementation-plan-battle-grid.md) - Previous grid-based plan (superseded)
- [docs/app/GAME_MECHANICS_FLOW.md](./app/GAME_MECHANICS_FLOW.md) - Complete game flow documentation

---

**Design Status:** ✅ Locked and ready for implementation
**Next Step:** Begin Phase 1 implementation (CSS layout foundation)
