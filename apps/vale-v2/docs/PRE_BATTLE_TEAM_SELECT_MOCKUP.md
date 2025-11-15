# Pre-Battle Team Selection Screen - Single Screen Mockup

## Design Requirements
- **Single screen** - All information visible without scrolling
- **No scrolling** - Layout scales to fit viewport
- **Detailed team management** - Full unit stats, equipment, Djinn
- **Enemy intelligence** - Show enemy composition and stats
- **Bench management** - Select from roster (up to 10 units)

---

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PRE-BATTLE TEAM SELECTION                    [X] Close                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ENEMY INTELLIGENCE (Left Panel - 30% width)                                 │
│  ┌─────────────────────────────────────┐                                    │
│  │ VS1: Garet's Challenge               │                                    │
│  │ Difficulty: Medium                    │                                    │
│  ├─────────────────────────────────────┤                                    │
│  │ Enemy 1: Garet (Mars)                │                                    │
│  │   Level 2 | HP: 85 | ATK: 18         │                                    │
│  │   DEF: 12 | MAG: 14 | SPD: 10        │                                    │
│  │   Abilities: Strike, Fireball        │                                    │
│  ├─────────────────────────────────────┤                                    │
│  │ Threat Assessment:                    │                                    │
│  │ • High physical damage                │                                    │
│  │ • Fire attacks (Mars)                 │                                    │
│  │ • Counter: Mercury units              │                                    │
│  └─────────────────────────────────────┘                                    │
│                                                                               │
│  YOUR TEAM (Right Panel - 70% width)                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Active Party (1-4 units)                                               │  │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  │  │
│  │ │ Slot 1   │ │ Slot 2   │ │ Slot 3   │ │ Slot 4   │                  │  │
│  │ │ [Isaac]  │ │ [Empty]   │ │ [Empty]  │ │ [Empty]  │                  │  │
│  │ │ Lv. 1    │ │ [Click]   │ │ [Click]  │ │ [Click]  │                  │  │
│  │ │ Venus    │ │ to add    │ │ to add   │ │ to add   │                  │  │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘                  │  │
│  │                                                                         │  │
│  │ Selected Unit Details (Expanded when unit selected)                    │  │
│  │ ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │ │ Isaac (Venus Adept)                    [Remove] [Equipment]      │  │  │
│  │ │ Level 1 | HP: 45/45 | PP: 12/12                                  │  │  │
│  │ │ ATK: 8 | DEF: 6 | MAG: 7 | SPD: 5                                │  │  │
│  │ │                                                                    │  │  │
│  │ │ Equipment:                                                         │  │  │
│  │ │ • Weapon: [None] [Change]                                         │  │  │
│  │ │ • Armor:  [None] [Change]                                         │  │  │
│  │ │ • Helm:   [None] [Change]                                         │  │  │
│  │ │ • Boots:  [None] [Change]                                         │  │  │
│  │ │ • Accessory: [None] [Change]                                      │  │  │
│  │ │                                                                    │  │  │
│  │ │ Djinn (3 slots):                                                   │  │  │
│  │ │ • Slot 1: [Flint] (Venus) [Remove]                                │  │  │
│  │ │ • Slot 2: [Empty] [Add Djinn]                                    │  │  │
│  │ │ • Slot 3: [Empty] [Add Djinn]                                    │  │  │
│  │ │                                                                    │  │  │
│  │ │ Abilities (from Djinn):                                            │  │  │
│  │ │ • Growth (Venus - Same)                                            │  │  │
│  │ │ • Quake (Venus - Same)                                            │  │  │
│  │ └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                         │  │
│  │ Bench Units (Available to add)                                         │  │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  │  │
│  │ │ Garet    │ │ [More...]│ │          │ │          │                  │  │
│  │ │ Lv. 1    │ │          │ │          │ │          │                  │  │
│  │ │ Mars     │ │          │ │          │ │          │                  │  │
│  │ │ [Add]    │ │          │ │          │ │          │                  │  │
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘                  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ [Cancel]                                    [Start Battle]              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Enemy Intelligence Panel (Left - 30%)
- **Encounter name** and difficulty
- **Enemy list** with stats (HP, ATK, DEF, MAG, SPD)
- **Elemental typing** (Venus/Mars/Mercury/Jupiter)
- **Abilities** preview
- **Threat assessment** (weaknesses, strengths, elemental counters)

### 2. Active Party Slots (Top Right)
- **4 slots** (1-4 can be filled)
- **Visual cards** showing:
  - Unit name
  - Level
  - Element icon
  - Empty slots show "[Click to add]"
- **Click slot** to select unit for editing

### 3. Unit Details Panel (Middle Right)
- **Expands** when a unit is selected
- Shows:
  - Full stats (HP/PP, ATK/DEF/MAG/SPD)
  - Equipment slots (5 slots: Weapon/Armor/Helm/Boots/Accessory)
  - Djinn slots (3 slots max)
  - Granted abilities from Djinn
- **Actions**: Remove from party, Change equipment, Manage Djinn

### 4. Bench Units (Bottom Right)
- **Scrollable horizontal list** of available units from roster
- Shows unit name, level, element
- **"Add" button** to add to active party
- **Max 4 units** in active party

### 5. Action Buttons (Bottom)
- **Cancel** - Return to overworld
- **Start Battle** - Begin battle with current team (disabled if < 1 unit)

---

## Responsive Scaling

**Viewport sizes:**
- **1920x1080**: Full layout, all panels visible
- **1366x768**: Slightly compressed, unit details may collapse to tabs
- **1280x720**: Compact mode, enemy panel narrower, unit cards smaller

**Scaling strategy:**
- Use CSS `clamp()` for font sizes
- Use CSS Grid with `fr` units for flexible panels
- Use `max-height` and `overflow: hidden` (NOT scroll) to prevent overflow
- Reduce padding/margins on smaller screens
- Collapse unit details to accordion on very small screens

---

## Interaction Flow

1. **Select slot** → Unit details panel expands
2. **Click "Add" on bench unit** → Adds to selected slot
3. **Click equipment slot** → Opens equipment modal (overlay)
4. **Click Djinn slot** → Opens Djinn selection modal (overlay)
5. **Click "Remove"** → Removes unit from party, returns to bench
6. **Click "Start Battle"** → Validates team (1-4 units), starts battle

---

## State Management

**Required Zustand slices:**
- `teamSlice` - Roster, active team, equipment, Djinn
- `gameFlowSlice` - Mode, pending encounter
- `inventorySlice` - Available equipment

**New state needed:**
- `pendingBattleEncounterId: string | null` - Encounter awaiting team selection
- `teamSelectionMode: boolean` - Whether in team selection screen

---

## Validation Rules

1. **Team size**: 1-4 units (enforced)
2. **Equipment**: Unit-locked (can't equip wrong unit's gear)
3. **Djinn**: Max 3 per team, no duplicates
4. **Start Battle**: Disabled if team empty or invalid

---

## Visual Style

- **Dark theme** matching battle UI
- **Card-based** layout with subtle borders
- **Element colors**: Venus (brown/green), Mars (red), Mercury (blue), Jupiter (yellow)
- **Hover states** on all interactive elements
- **Selected state** highlighting for active unit
- **Disabled state** for invalid actions

