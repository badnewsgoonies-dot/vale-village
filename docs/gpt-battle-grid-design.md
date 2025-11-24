# GPT's Battle Grid Design Proposal

## Overview

GPT proposed a 3-column grid layout with always-visible combat log, contrasting with the existing 2-column mockup design.

## Grid Structure

### GPT's Approach
```
3 columns: 260px (party) | 1fr (battlefield) | 320px (log)
3 rows: auto (top bar) | 1fr (main content) | auto (bottom panel)

Grid areas:
"top    top        top"
"party  battlefield log"
"bottom bottom     log"
```

### Existing Mockup Approach (battle-screen-queue-based-final.html)
```
2 columns: 200px (portraits) | 1fr (battlefield)
3 rows: auto (top bar) | 1fr (main content) | auto (bottom panel)

Grid areas:
"top    top"
"party  battlefield"
"bottom bottom"
```

## Key Differences

### 1. Combat Log Placement

**GPT Design:**
- Combat log always visible on right side
- Takes up 320px of horizontal space
- Spans middle + bottom rows
- Always accessible during planning and execution

**Mockup Design:**
- Combat log lives in bottom panel's right column
- Toggles with ability details during planning
- Only fully visible during execution phase
- More space-efficient for tactical planning

### 2. Bottom Panel Layout

**GPT Design:**
- Bottom panel spans only left two columns
- Two-column ability layout (50/50 split)
- Log remains separate on the right

**Mockup Design:**
- Bottom panel spans full width
- Two-column ability layout (35/65 split)
- Right column shows either ability details OR combat log
- Dynamic content based on phase

### 3. Screen Real Estate

**GPT Design:**
- Battlefield gets less horizontal space (minus 320px for log)
- Party portraits get 60px more width (260px vs 200px)
- Combat log always consumes space even when not primary focus

**Mockup Design:**
- Battlefield gets maximum horizontal space
- Party portraits minimal but sufficient (200px)
- Log only takes space when execution phase active

## Component Architecture

GPT proposed these components in `src/ui/components/battle/`:

### 1. BattleScreenLayout.tsx
```typescript
interface BattleScreenLayoutProps {
  topBar: ReactNode;
  portraits: ReactNode;
  battlefield: ReactNode;
  bottomPanel: ReactNode;
  logPanel: ReactNode;  // NEW: separate log panel
}
```

Grid wrapper that positions all major sections.

### 2. BattleTopBar.tsx
```typescript
interface BattleTopBarProps {
  currentMana: number;
  maxMana: number;
  queuedManaChange: number;
  djinnSlots: DjinnSlot[];
}
```

Top bar with mana circles and Djinn icons.

### 3. BattlePortraitPanel.tsx + PortraitCard.tsx
```typescript
interface BattlePortraitPanelProps {
  units: BattleUnitSummary[];
  selectedUnitId: string | null;
  onSelectUnit: (unitId: string) => void;
}

interface PortraitCardProps {
  unit: BattleUnitSummary;
  selected: boolean;
  onClick: () => void;
}
```

Left sidebar with party unit portraits, HP bars, status effects, and hover-expanded stats.

### 4. Battlefield.tsx + EnemyCard.tsx + PlayerCard.tsx
```typescript
interface BattlefieldProps {
  enemies: EnemySummary[];
  players: PlayerSpriteSummary[];
  backgroundSrc: string;
}
```

Center area with background GIF, enemy sprites (top), and player sprites (bottom).

### 5. BattleBottomPanel.tsx + AbilityListItem.tsx
```typescript
interface BattleBottomPanelProps {
  mode: "planning" | "allQueued";
  currentUnitLabel: string;
  queue: QueueEntry[];
  abilities: AbilitySummary[];
  canExecute: boolean;
  onExecuteRound: () => void;
  onAbilityClick: (abilityId: string) => void;
}
```

Bottom panel that switches between:
- Planning mode: ability list + queue summary
- All queued mode: queue display + execute button

### 6. BattleLogPanel.tsx
```typescript
interface BattleLogPanelProps {
  entries: LogEntry[];
}
```

**NEW component** - Right-side always-visible combat log.

## Data Flow

### GPT's Proposed Flow
```
QueueBattleView (smart component)
  ↓ (props)
BattleScreenLayout (grid wrapper)
  ↓ (slots: topBar, portraits, battlefield, bottomPanel, logPanel)
  ├─ BattleTopBar
  ├─ BattlePortraitPanel
  │   └─ PortraitCard (× 4)
  ├─ Battlefield
  │   ├─ EnemyCard (× N)
  │   └─ PlayerCard (× 4)
  ├─ BattleBottomPanel
  │   └─ AbilityListItem (× N)
  └─ BattleLogPanel (always visible)
```

### Current Mockup Flow
```
QueueBattleView (smart component)
  └─ .battle-screen (grid wrapper)
      ├─ .top-bar
      ├─ .portrait-panel
      ├─ .battlefield
      └─ .bottom-panel (conditional content)
          ├─ Planning: abilities + details
          └─ Execution: queue + log
```

## CSS Structure

### GPT's CSS Grid
```css
.battle-screen {
  display: grid;
  grid-template-columns: 260px 1fr 320px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "top    top        top"
    "party  battlefield log"
    "bottom bottom     log";
  height: 100vh;
}

.battle-top { grid-area: top; }
.battle-party-sidebar { grid-area: party; }
.battle-field { grid-area: battlefield; }
.battle-bottom { grid-area: bottom; }
.battle-log-panel { grid-area: log; }
```

### Mockup CSS Grid
```css
.battle-screen {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr;
  gap: 0;
}

.top-bar { grid-column: 1 / -1; }
.portrait-panel { grid-row: 2; grid-column: 1; }
.battlefield { grid-row: 2; grid-column: 2; }
.bottom-panel { grid-column: 1 / -1; }
```

## Trade-offs Analysis

### GPT Design Advantages
✅ Combat log always accessible
✅ Clear separation of concerns (log is its own area)
✅ No content toggling in bottom panel
✅ Easier to read log during planning if needed

### GPT Design Disadvantages
❌ Less battlefield horizontal space (important for sprite positioning)
❌ Log takes space even when user focused on abilities
❌ Bottom panel split between two areas feels disconnected
❌ Harder to show detailed ability tooltips (less space)

### Mockup Design Advantages
✅ Maximum battlefield space for cinematics
✅ Efficient space usage (log only when needed)
✅ Better ability tooltip experience (65% of bottom panel)
✅ Cleaner visual hierarchy (3 distinct zones not 4)

### Mockup Design Disadvantages
❌ Log hidden during planning (must wait for execution)
❌ Content toggling in bottom panel adds complexity
❌ Can't reference log while planning abilities

## Recommendation

**Stick with the existing mockup's 2-column design** because:

1. **Battlefield is the hero** - It needs maximum horizontal space for sprite animations, backgrounds, and visual impact
2. **Planning phase UX** - Ability tooltips are more important than log during planning
3. **Log is temporal** - Combat log is primarily useful during/after execution, not during planning
4. **Simpler grid** - Two columns is easier to reason about and maintain
5. **Proven design** - Mockup was already validated through multiple iterations

The 3-column design would be appropriate for a game where:
- Log history is critical for strategy (turn-by-turn analysis)
- Battlefield is less visually important
- Screen space is abundant (desktop-only, large monitors)

But for a Golden Sun-style RPG where cinematics and visual flair matter, the 2-column mockup is the better choice.

## Implementation Path (If Using Mockup Design)

1. Create `src/ui/styles/queue-battle-grid.css` with 2-column grid
2. Extract components in `src/ui/components/battle/`:
   - `BattleScreenLayout.tsx` (no logPanel slot)
   - `BattleTopBar.tsx`
   - `BattlePortraitPanel.tsx`
   - `Battlefield.tsx`
   - `BattleBottomPanel.tsx` (handles log toggle internally)
3. Refactor `QueueBattleView.tsx` to use component composition
4. Wire state/handlers from Zustand slices
5. Test both planning and execution phases

## Files to Reference

- `mockups/improved/battle-screen-queue-based-final.html` - Planning phase
- `mockups/improved/battle-all-queued.html` - All queued state
- GPT's proposed skeleton (this document)
