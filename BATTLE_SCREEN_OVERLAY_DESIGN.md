# Battle Screen - Overlay Panel Design (Revised)

**Date:** 2025-11-21  
**Concept:** Fixed battlefield + overlaying abilities panel + two-column layout

---

## Core Design Principles

✅ **Battlefield stays fixed size** - no resizing confusion  
✅ **Abilities panel overlays from bottom** - slides up 15% when active  
✅ **Two-column layout** - list left, details right (on hover)  
✅ **Mana integrated into abilities** - not in top bar  
✅ **Djinn expandable menu** - summon columns on hover  

---

## Layout Structure

### Full Screen Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │ ← Top (no mana bar)
│  ┌─────────────┬────────────────────────────────┬──────────────┐   │
│  │             │                                │              │   │
│  │ Portraits   │                                │ Turn Order   │   │
│  │             │                                │              │   │
│  │ [Isaac]     │     [Enemy A]    [Enemy B]     │ 1. Isaac →   │   │
│  │ HP: 80/100  │                                │ 2. Goblin A  │   │
│  │             │           ↖ Diagonal           │ 3. Garet     │   │
│  │ [Garet]     │         Positioning            │ 4. Goblin B  │   │
│  │ HP: 100/100 │                                │ 5. Mia       │   │
│  │             │    LARGE BATTLEFIELD           │ ...          │   │
│  │ [Mia]       │    (Fixed Size)                │              │   │ ← 75%
│  │ HP: 75/100  │                                │              │   │
│  │             │                                │              │   │
│  │ [Ivan]      │                                │              │   │
│  │ HP: 60/100  │      [Unit A]    [Unit B]      │              │   │
│  │             │                                │              │   │
│  │             │         [Unit C]    [Unit D]   │              │   │
│  │             │              ↗ Bottom Right    │              │   │
│  └─────────────┴────────────────────────────────┴──────────────┘   │
│  ═══════════════════════════════════════════════════════════════   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ABILITIES PANEL (Default: 10% height)                       │   │
│  │ ─────────────────────────────────────────────────────────   │   │
│  │ MANA: ●●●●○ 4/5 | DJINN: [🔥][💨][💧]                       │   │ ← 10%
│  │                                                             │   │
│  │ Unit: Garet | Level 5 Mars                                 │   │
│  │ ⚔️ Attack [0] | 🔥 Fireball [2] | 💚 Heal [1] | ...         │   │ ← Compact list
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │ ← Bottom (15% buffer)
└─────────────────────────────────────────────────────────────────────┘
```

---

## State 1: Default (Collapsed - 10% Panel)

### Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────────┬────────────────────────────────┬──────────────┐   │
│  │             │                                │              │   │
│  │ Portraits   │     BATTLEFIELD (FULL VIEW)    │ Turn Order   │   │
│  │             │                                │              │   │
│  │ [Isaac] ✓   │                                │              │   │
│  │ [Garet] 👈  │     [Enemy A]    [Enemy B]     │              │   │
│  │ [Mia]       │                                │              │   │ ← 85%
│  │ [Ivan]      │                                │              │   │
│  │             │    [Unit A]  [Unit B]          │              │   │
│  │             │    [Unit C]  [Unit D]          │              │   │
│  └─────────────┴────────────────────────────────┴──────────────┘   │
│  ═══════════════════════════════════════════════════════════════   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 💠 MANA: ●●●●○ 4/5  |  DJINN: [🔥Flint] [💨Fizz] [💧Sleet]  │   │
│  │ ─────────────────────────────────────────────────────────   │   │
│  │ GARET (Lv5 Mars) - Select Ability:                          │   │ ← 10%
│  │ ⚔️ Attack [0○] | 🔥 Fireball [2○] | 💚 Heal [1○] | ...       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │ ← 5% buffer
└─────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Compact horizontal list of abilities
- Mana display integrated
- Djinn icons visible
- Minimal screen space usage
- Full battlefield visible

---

## State 2: Active (Expanded - 25% Panel, Overlaying)

### Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────────┬────────────────────────────────┬──────────────┐   │
│  │             │                                │              │   │
│  │ Portraits   │                                │ Turn Order   │   │
│  │             │     [Enemy A]    [Enemy B]     │              │   │
│  │ [Isaac] ✓   │                                │ 1. Isaac     │   │
│  │ [Garet] 👈  │           ↖ Top area          │ 2. Goblin A  │   │
│  │ [Mia]       │          visible               │ 3. Garet →   │   │ ← 70%
│  │ [Ivan]      │                                │ 4. Goblin B  │   │
│  │             │    BATTLEFIELD (Fixed)         │ ...          │   │
│  └─────────────┤                                ├──────────────┘   │
│  ══════════════╪════════════════════════════════╪═══════════════   │
│  ┌─────────────┤  [Unit A]  [Unit B] ← Partially covered         │
│  │             │  [Unit C]  [Unit D] ← Partially covered         │
│  │ ABILITY     └────────────────────────────────┘              │   │
│  │ LIST        │  ABILITY DETAILS (Hover)                      │   │
│  │ ──────────  │  ──────────────────────────────               │   │
│  │             │                                                │   │
│  │ ⚔️ Attack   │  🔥 FIREBALL (Hovered)                        │   │
│  │ [0○]        │  ─────────────────────────────                │   │
│  │ Unlocked    │  Type: Mars Psynergy                          │   │
│  │             │  Target: Single Enemy                          │   │
│  │ 🔥 Fireball │  Power: 35                                    │   │ ← 25%
│  │ [2○] 👈     │  Mana Cost: 2                                 │   │ (Overlays
│  │ Lv2 - Djinn │                                                │   │  bottom)
│  │             │  Launches a ball of fire at a single enemy,   │   │
│  │ 💚 Heal     │  dealing fire damage.                         │   │
│  │ [1○]        │                                                │   │
│  │ Lv3 - Core  │  Effects:                                     │   │
│  │             │  • Burn: 80% chance, 3 turns, 10 dmg/turn    │   │
│  │ 🛡️ Guard    │  • Element Advantage: 1.5× vs Jupiter        │   │
│  │ [0○]        │  • Weak vs Mercury: 0.67× damage             │   │
│  │ Lv4 - Core  │                                                │   │
│  │             │                                                │   │
│  │ [Scroll]    │  [CONFIRM] [CANCEL]                           │   │
│  └─────────────┴────────────────────────────────────────────────   │
│  💠 MANA: ●●○○○ 2/5 (after selection)                              │ ← 5%
└─────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Panel slides up 15% (from 10% to 25%)
- Bottom half of battlefield is **overlaid** (units partially covered)
- Two-column layout:
  - **Left (30%):** Ability list (compact)
  - **Right (70%):** Details panel (on hover)
- Enemies at top still fully visible
- Units at bottom partially obscured (acceptable)

---

## Two-Column Abilities Layout

### Left Column: Ability List (Always Visible)

```
┌─────────────────────┐
│ ABILITY LIST        │
│ ─────────────────── │
│                     │
│ ⚔️ Attack           │
│ [0○] Physical       │
│ Unlocked            │
│                     │
│ 🔥 Fireball ← Hover │
│ [2○] Mars Psynergy  │
│ Lv2 - Djinn         │
│                     │
│ 💚 Heal             │
│ [1○] Healing        │
│ Lv3 - Core          │
│                     │
│ 🛡️ Guard Break      │
│ [0○] Physical       │
│ Lv4 - Core          │
│                     │
│ ⚡ Spark Strike     │
│ [2○] Jupiter        │
│ Lv5 - Djinn         │
│                     │
│ 🔒 Quake            │
│ [3○] Venus          │
│ Locked (Need Djinn) │
│                     │
│ [Scroll ↓]          │
└─────────────────────┘
```

**Format:**
- Icon + Name
- Mana cost in circles: `[●●○○○]` or `[2○]`
- Type/Element (1 line)
- Origin: "Lv X - Core" or "Lv X - Djinn"
- Visual state: Selected, Hovered, Locked, Unaffordable

---

### Right Column: Details Panel (On Hover)

```
┌──────────────────────────────────────────────┐
│ 🔥 FIREBALL                                  │
│ ──────────────────────────────────────────── │
│                                              │
│ Type: Mars Psynergy                          │
│ Target: Single Enemy                         │
│ Power: 35                                    │
│ Mana Cost: 2 ●●○○○                          │
│                                              │
│ Description:                                 │
│ Launches a ball of fire at a single enemy,  │
│ dealing fire damage. Effective against      │
│ wind-based enemies.                          │
│                                              │
│ Effects:                                     │
│ • Status: Burn (80% chance)                 │
│   - Duration: 3 turns                       │
│   - Damage: 10 per turn                     │
│                                              │
│ • Elemental Advantages:                     │
│   - vs Jupiter: 1.5× damage (Strong)        │
│   - vs Mercury: 0.67× damage (Weak)         │
│                                              │
│ Unlocked by: Flint (Mars Djinn) - Level 2   │
│                                              │
│ ──────────────────────────────────────────── │
│ Expected Damage vs Current Targets:          │
│ • Goblin A (Jupiter): 52-63 dmg            │
│ • Goblin B (Venus): 35-42 dmg              │
│                                              │
│ [SELECT TARGET] [CANCEL]                     │
└──────────────────────────────────────────────┘
```

**Format:**
- Large ability name with icon
- Key stats (type, target, power, cost)
- Full description
- Detailed effects (status, buffs, special)
- Elemental advantages
- Unlock source
- Expected damage (optional, Phase 2)
- Action buttons

---

## Mana Display Integration

### Option 1: Top of Abilities Panel (Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│ 💠 MANA POOL: ●●●●○ 4/5                                     │
│ ═══════════════════════════════════════════════════════════ │
│ ABILITY LIST          │  ABILITY DETAILS                    │
│ ...                   │  ...                                │
└─────────────────────────────────────────────────────────────┘
```

**Benefits:**
- Mana right above abilities (contextual)
- Always visible when panel is up
- Clear visual separation

---

### Option 2: Inline with Unit Info

```
┌─────────────────────────────────────────────────────────────┐
│ GARET (Lv5 Mars) | MANA: ●●●●○ 4/5                         │
│ ═══════════════════════════════════════════════════════════ │
│ ABILITY LIST          │  ABILITY DETAILS                    │
│ ...                   │  ...                                │
└─────────────────────────────────────────────────────────────┘
```

**Benefits:**
- Compact, single line
- Unit and resource info together

---

### Mana Visualization

**Current System (Keep):**
- Filled circles: `●` = available mana
- Empty circles: `○` = used/unavailable mana
- Example: `●●●○○` = 3 out of 5 mana

**Enhanced Visual (Optional):**
- Color-coded by remaining amount:
  - 4-5 mana: Blue circles (full)
  - 2-3 mana: Yellow circles (medium)
  - 0-1 mana: Red circles (low)

---

## Djinn Expandable Menu

### Default State (Collapsed)

```
┌─────────────────────────────────────────────────────────────┐
│ 💠 MANA: ●●●●○ 4/5  |  DJINN: [🔥] [💨] [💧] 👈 Hover       │
│                                      ↑ Active ↑ Standby      │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Compact icons
- Visual state: Active (bright) vs Standby (dimmed)
- Hover to expand

---

### Expanded State (On Hover)

```
┌─────────────────────────────────────────────────────────────┐
│ 💠 MANA: ●●●●○ 4/5                                          │
├─────────────────────────────────────────────────────────────┤
│ ╔═══════════════════════════════════════════════════════╗  │
│ ║ DJINN SUMMONS (Hover to see details)                  ║  │
│ ╠═══════════════════════════════════════════════════════╣  │
│ ║                                                        ║  │
│ ║  SINGLE (1 Djinn)  │  DOUBLE (2 Djinn)  │  TRIPLE (3) ║  │
│ ║  ────────────────  │  ────────────────  │  ────────── ║  │
│ ║                    │                    │             ║  │
│ ║  🔥 Flint          │  🔥💨 Tinder       │  🔥💨💧 Gaia ║  │
│ ║  [Active]          │  [2 Active]        │  [3 Active] ║  │
│ ║  Mars Attack       │  Mars+Jupiter      │  All 3      ║  │
│ ║  Power: 20         │  Power: 45         │  Power: 80  ║  │
│ ║  Target: 1         │  Target: All       │  Target: All║  │
│ ║                    │                    │  + Buff ATK ║  │
│ ║  💨 Fizz           │  💨💧 Breeze       │             ║  │
│ ║  [Active]          │  [2 Active]        │             ║  │
│ ║  Jupiter Strike    │  Jupiter+Mercury   │             ║  │
│ ║  Power: 22         │  Power: 50         │             ║  │
│ ║                    │                    │             ║  │
│ ║  💧 Sleet          │  🔥💧 Steam        │             ║  │
│ ║  [Standby] 🔒      │  [Need 2]          │             ║  │
│ ║  (1 turn)          │                    │             ║  │
│ ║                    │                    │             ║  │
│ ║  [Select]          │  [Select]          │  [Select]   ║  │
│ ╚═══════════════════════════════════════════════════════╝  │
└─────────────────────────────────────────────────────────────┘
```

**Three-Column Layout:**

**Column 1: Single Djinn (1 Djinn)**
- Individual Djinn summons
- Show each Djinn's individual power
- State: Active, Standby (locked), Recovery time

**Column 2: Double Summons (2 Djinn)**
- Combination summons (any 2 Djinn)
- More powerful effects
- Requires 2 active Djinn

**Column 3: Triple Summons (3 Djinn)**
- Ultimate summons
- Requires all 3 Djinn active
- Highest power, often with buffs/debuffs

---

### Djinn States Visual

**Active (Ready):**
```
🔥 Flint
[●] Active
Ready to summon
```

**Standby (Used, Recovering):**
```
💨 Fizz
[○] Standby
Ready in 2 turns
```

**Recovery (Not Available):**
```
💧 Sleet
[⏳] Recovery
Not available
```

---

## Overlay Mechanics

### How Overlay Works

**Default (10% panel):**
```
┌────────────────────┐
│                    │
│   Battlefield      │ ← 85% visible
│   (Full)           │
│                    │
└────────────────────┘
─────────────────────── ← Panel starts here
┌────────────────────┐
│ Abilities (10%)    │
└────────────────────┘
```

**Active (25% panel overlaying):**
```
┌────────────────────┐
│   Battlefield      │ ← Top 70% visible
│   (Fixed Size)     │
├────────────────────┤ ← Panel starts overlaying here
│ /////// Overlay //// │ ← Bottom 15% obscured
│ [Units partially]  │
│ [visible here]     │
├────────────────────┤
│                    │
│ Abilities Panel    │ ← 25% height
│ (Two Columns)      │
│                    │
└────────────────────┘
```

**Key Points:**
- Battlefield height never changes (85%)
- Panel slides up from 10% → 25%
- Bottom 15% of battlefield gets overlaid
- Enemies (top) stay fully visible ✓
- Units (bottom) partially covered ✓
- Acceptable tradeoff for detail visibility

---

## CSS Implementation

### Container Structure

```css
.battle-view-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Fixed battlefield (never changes size) */
.battlefield-section {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 85vh;
  display: grid;
  grid-template-columns: 20% 60% 20%;
}

/* Overlaying abilities panel */
.abilities-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #1a1a1a, rgba(26, 26, 26, 0.95));
  border-top: 2px solid #444;
  transition: height 250ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  overflow: hidden;
}

/* Collapsed state */
.abilities-panel[data-state="collapsed"] {
  height: 10vh;
}

/* Expanded state (overlays battlefield) */
.abilities-panel[data-state="expanded"] {
  height: 25vh;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
}

/* Two-column layout inside panel */
.abilities-panel-content {
  display: grid;
  grid-template-columns: 30% 70%;
  height: 100%;
  gap: 1rem;
  padding: 1rem;
}
```

---

### Slide Animation

```css
/* Smooth slide up/down */
.abilities-panel {
  transform: translateY(0);
  transition: 
    height 250ms cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 250ms ease;
}

/* Optional: Add backdrop blur when expanded */
.abilities-panel[data-state="expanded"]::before {
  content: '';
  position: absolute;
  top: -15vh;
  left: 0;
  right: 0;
  height: 15vh;
  background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
  pointer-events: none;
}
```

---

## Interaction Flow

### Flow 1: Select Ability

```
1. User clicks unit portrait "Garet"
   ↓
2. Abilities panel slides up (10% → 25%)
   Bottom of battlefield overlaid
   ↓
3. User sees two-column layout:
   - Left: List of abilities
   - Right: Empty (or default text)
   ↓
4. User hovers over "Fireball"
   ↓
5. Right panel populates with detailed info
   User reads: power, effects, status chances
   ↓
6. User clicks "Fireball"
   ↓
7. Right panel updates: "Select Target"
   Battlefield shows target indicators on enemies
   ↓
8. User clicks "Goblin A"
   ↓
9. Action queued: "Garet → Fireball → Goblin A [2○]"
   Abilities panel slides down (25% → 10%)
   ↓
10. Back to collapsed state
```

---

### Flow 2: Cancel Selection

```
1. User is in expanded state (hovering abilities)
   ↓
2. User clicks [CANCEL] or presses ESC
   ↓
3. Panel slides down (25% → 10%)
   Selection cleared
   ↓
4. Back to collapsed state
```

---

### Flow 3: Djinn Summon

```
1. User hovers over Djinn icons
   ↓
2. Djinn menu expands (slides up from Djinn bar area)
   Shows 3 columns: Single, Double, Triple
   ↓
3. User hovers over "Tinder (Double)"
   Right panel shows:
   - Power: 45
   - Uses: Flint + Fizz
   - Effect: All enemies, Mars+Jupiter damage
   ↓
4. User clicks "Tinder"
   ↓
5. Target selection (if needed)
   Or immediate cast (if all-enemies)
   ↓
6. Djinn enter standby mode
   Menu collapses
```

---

## React State Structure

```typescript
interface AbilitiesPanelState {
  isExpanded: boolean;
  selectedUnitIndex: number | null;
  hoveredAbilityId: string | null;
  selectedAbilityId: string | null;
  djinnMenuOpen: boolean;
}

const useAbilitiesPanel = () => {
  const [state, setState] = useState<AbilitiesPanelState>({
    isExpanded: false,
    selectedUnitIndex: null,
    hoveredAbilityId: null,
    selectedAbilityId: null,
    djinnMenuOpen: false,
  });

  const expandPanel = (unitIndex: number) => {
    setState(prev => ({
      ...prev,
      isExpanded: true,
      selectedUnitIndex: unitIndex,
    }));
  };

  const collapsePanel = () => {
    setState(prev => ({
      ...prev,
      isExpanded: false,
      selectedUnitIndex: null,
      hoveredAbilityId: null,
      selectedAbilityId: null,
    }));
  };

  const hoverAbility = (abilityId: string) => {
    setState(prev => ({ ...prev, hoveredAbilityId: abilityId }));
  };

  const selectAbility = (abilityId: string) => {
    setState(prev => ({ ...prev, selectedAbilityId: abilityId }));
  };

  const toggleDjinnMenu = () => {
    setState(prev => ({ ...prev, djinnMenuOpen: !prev.djinnMenuOpen }));
  };

  return {
    ...state,
    expandPanel,
    collapsePanel,
    hoverAbility,
    selectAbility,
    toggleDjinnMenu,
  };
};
```

---

## Benefits of Overlay Design

✅ **No battlefield resizing** - avoids visual confusion  
✅ **Smooth overlay animation** - feels natural  
✅ **Acceptable occlusion** - enemies still visible, units partially visible  
✅ **Two-column efficiency** - list + details side-by-side  
✅ **Hover-based details** - minimal clicks  
✅ **Integrated mana** - contextual with abilities  
✅ **Expandable Djinn** - summon columns on demand  

---

## Implementation Checklist

### Phase 1: Core Overlay
- [ ] Create fixed battlefield (85vh, never changes)
- [ ] Create abilities panel (absolute position, bottom)
- [ ] Add slide animation (10vh → 25vh)
- [ ] Test overlay visual (does it cover too much?)
- [ ] Add backdrop shadow/blur

### Phase 2: Two-Column Layout
- [ ] Create ability list (left column, 30%)
- [ ] Create details panel (right column, 70%)
- [ ] Wire hover events (onMouseEnter → show details)
- [ ] Style ability cards (compact left, detailed right)
- [ ] Test scrolling (ability list should scroll)

### Phase 3: Mana Integration
- [ ] Move mana display to abilities panel
- [ ] Update mana circles on ability selection
- [ ] Color-code mana based on remaining amount

### Phase 4: Djinn Menu
- [ ] Create Djinn icon bar (collapsed)
- [ ] Create expandable Djinn menu (3 columns)
- [ ] Wire hover/click to expand
- [ ] Implement summon selection
- [ ] Handle Djinn state changes (active → standby → recovery)

### Phase 5: Polish
- [ ] Add entrance animations
- [ ] Add hover states for all interactive elements
- [ ] Add keyboard shortcuts (ESC, Tab, Enter)
- [ ] Test on different screen sizes
- [ ] Add sound effects (optional)

---

**Next Action:** Begin implementation of overlay panel system with two-column layout
