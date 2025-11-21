# Improved Pre-Battle Team Selection Design

## Design Goals
1. **No scrolling** - Everything fits in viewport
2. **Lightweight enemy display** - Names, icons, element only (no stats/intelligence)
3. **Compact layout** - Streamlined, minimal visual weight
4. **Single screen** - All information visible at once

---

## Layout Structure (No Scrolling)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PRE-BATTLE PREPARATION                    [X] Close                          │
│ VS1: Garet's Challenge | Difficulty: Medium | Rewards: 60 XP, 19 Gold       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ YOUR TEAM (1/4)                                                       │  │
│  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                                 │  │
│  │ │Isaac │ │[+]   │ │[+]   │ │[+]   │                                 │  │
│  │ │Lv.1  │ │      │ │      │ │      │                                 │  │
│  │ │Venus │ │      │ │      │ │      │                                 │  │
│  │ └──────┘ └──────┘ └──────┘ └──────┘                                 │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ EQUIPMENT (Isaac)                                                      │  │
│  │ Weapon: [None] [Change▼]  Armor: [None] [Change▼]                   │  │
│  │ Helm:   [None] [Change▼]  Boots: [None] [Change▼]  Acc: [None] [▼] │  │
│  │ STAT PREVIEW: ATK:8 DEF:6 MAG:7 SPD:5                                 │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ DJINN (3 slots)                                                        │  │
│  │ [Flint]Venus[Set] [Empty] [Empty]                                     │  │
│  │ Available: [Forge]Mars [Fizz]Mercury [Breeze]Jupiter                  │  │
│  │ ABILITIES: Growth, Quake (from Flint)                                 │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ BENCH UNITS                                                            │  │
│  │ [Garet]Mars [Ivan]Jupiter [Mia]Mercury                                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ ENEMIES                                                                │  │
│  │ [Garet] Mars  [Empty]  [Empty]                                        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ [Cancel]                                    [Start Battle]             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Changes

### 1. Removed Enemy Intelligence Panel
- **Before:** Detailed threat assessment, stats, abilities
- **After:** Minimal display - just name, icon, element
- **Location:** Bottom section, compact horizontal layout

### 2. Eliminated Scrolling
- **Before:** Multiple scrollable sections
- **After:** Fixed-height sections, compact spacing
- **Strategy:**
  - Use horizontal layouts where possible
  - Reduce vertical padding/margins
  - Compact font sizes
  - Collapsible sections (equipment/Djinn details)

### 3. Lighter Visual Design
- **Reduced visual weight:**
  - Thinner borders (1px instead of 2px)
  - Less padding (0.5rem instead of 1rem)
  - Compact font sizes
  - Minimal shadows/effects
  - Flat design (no gradients)

### 4. Compact Layout Strategy
- **Horizontal equipment display** - All 5 slots in one row
- **Inline stat preview** - Single line, not separate panel
- **Compact Djinn display** - Horizontal slots, abilities inline
- **Bench units** - Horizontal scrollable strip (if needed)
- **Enemies** - Horizontal compact cards

---

## Component Structure (Simplified)

### Main Component: PreBattleTeamSelectScreen

```typescript
interface PreBattleTeamSelectScreenProps {
  encounterId: string;
  onConfirm: (team: Team) => void;
  onCancel: () => void;
}

// Sections (all fixed height, no scrolling):
// 1. Header (fixed height: 60px)
// 2. Team Slots (fixed height: 120px)
// 3. Equipment (fixed height: 80px, collapsible)
// 4. Djinn (fixed height: 80px, collapsible)
// 5. Bench Units (fixed height: 100px)
// 6. Enemies (fixed height: 80px)
// 7. Actions (fixed height: 60px)
// Total: ~580px (fits in 720p+ viewports)
```

---

## CSS Layout (No Scrolling)

```css
.pre-battle-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* NO SCROLLING */
  padding: 0.5rem; /* Minimal padding */
}

.pre-battle-container {
  width: 100%;
  height: 100%;
  max-width: 1400px;
  max-height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Compact spacing */
  overflow: hidden; /* NO SCROLLING */
}

/* Fixed height sections */
.pre-battle-header {
  height: 60px;
  flex-shrink: 0;
}

.team-slots-section {
  height: 120px;
  flex-shrink: 0;
}

.equipment-section {
  height: 80px; /* Collapsible to 40px when closed */
  flex-shrink: 0;
  transition: height 0.2s;
}

.djinn-section {
  height: 80px; /* Collapsible to 40px when closed */
  flex-shrink: 0;
  transition: height 0.2s;
}

.bench-section {
  height: 100px;
  flex-shrink: 0;
}

.enemies-section {
  height: 80px;
  flex-shrink: 0;
}

.actions-section {
  height: 60px;
  flex-shrink: 0;
}

/* Compact font sizes */
.unit-name { font-size: clamp(0.75rem, 1vw, 0.9rem); }
.unit-level { font-size: clamp(0.65rem, 0.9vw, 0.75rem); }
.unit-element { font-size: clamp(0.6rem, 0.8vw, 0.7rem); }

/* Minimal borders */
.section-card {
  border: 1px solid #333; /* Thin border */
  border-radius: 4px; /* Small radius */
  padding: 0.5rem; /* Compact padding */
  background: #1e1e1e;
}
```

---

## Enemy Display (Minimal)

### Component: EnemyCompositionPanel

```typescript
interface EnemyCompositionPanelProps {
  encounterId: string;
}

// Display format:
// [Icon] Name | Element
// Horizontal layout, compact cards
// No stats, no abilities, no threat assessment
```

**Visual Design:**
```
┌─────────────────────────────────────┐
│ ENEMIES                              │
│ ┌─────┐ ┌─────┐ ┌─────┐            │
│ │[🎯] │ │[🎯] │ │[👑] │            │
│ │Garet│ │Bandit│ │Captain│          │
│ │Mars │ │Mars  │ │Mars  │          │
│ └─────┘ └─────┘ └─────┘            │
└─────────────────────────────────────┘
```

**CSS:**
```css
.enemies-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.enemies-grid {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto; /* Horizontal scroll only if needed */
  overflow-y: hidden;
}

.enemy-card-minimal {
  min-width: 100px;
  padding: 0.5rem;
  background: #252525;
  border: 1px solid #444;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.enemy-icon {
  font-size: 1.5rem; /* Icon only */
}

.enemy-name {
  font-size: 0.75rem;
  font-weight: bold;
}

.enemy-element {
  font-size: 0.65rem;
  color: #4a9eff;
}
```

---

## Equipment Display (Compact)

### Horizontal Layout

```typescript
// All 5 equipment slots in one row
<div className="equipment-row">
  <EquipmentSlot slot="Weapon" />
  <EquipmentSlot slot="Armor" />
  <EquipmentSlot slot="Helm" />
  <EquipmentSlot slot="Boots" />
  <EquipmentSlot slot="Accessory" />
</div>
<div className="stat-preview">
  STAT PREVIEW: ATK:8 DEF:6 MAG:7 SPD:5
</div>
```

**CSS:**
```css
.equipment-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.equipment-slot-compact {
  padding: 0.5rem;
  background: #252525;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 0.75rem;
}

.stat-preview {
  font-size: 0.7rem;
  color: #ccc;
  text-align: center;
  padding: 0.25rem;
}
```

---

## Djinn Display (Compact)

### Horizontal Layout

```typescript
// 3 Djinn slots + available Djinn in one row
<div className="djinn-row">
  <DjinnSlot index={0} />
  <DjinnSlot index={1} />
  <DjinnSlot index={2} />
</div>
<div className="djinn-available">
  Available: [Forge] [Fizz] [Breeze]
</div>
<div className="djinn-abilities">
  ABILITIES: Growth, Quake (from Flint)
</div>
```

**CSS:**
```css
.djinn-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.djinn-slot-compact {
  flex: 1;
  padding: 0.5rem;
  background: #252525;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 0.75rem;
  text-align: center;
}

.djinn-available {
  font-size: 0.7rem;
  color: #ccc;
  margin-bottom: 0.25rem;
}

.djinn-abilities {
  font-size: 0.65rem;
  color: #4a9eff;
}
```

---

## Bench Units (Compact Horizontal)

```css
.bench-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bench-grid {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto; /* Horizontal scroll only if many units */
  overflow-y: hidden;
}

.bench-unit-compact {
  min-width: 80px;
  padding: 0.5rem;
  background: #252525;
  border: 1px solid #444;
  border-radius: 4px;
  text-align: center;
  font-size: 0.75rem;
  cursor: pointer;
}
```

---

## Responsive Scaling

### Viewport Heights
- **1080p (1920x1080)**: Full layout, comfortable spacing
- **768p (1366x768)**: Compact spacing, smaller fonts
- **720p (1280x720)**: Minimal spacing, smallest fonts

### Strategy
- Use `clamp()` for all font sizes
- Reduce gaps/padding on smaller screens
- Collapsible sections (equipment/Djinn) on very small screens
- Horizontal scrolling for bench/enemies if needed (not vertical)

---

## Implementation Checklist

### Phase 1: Core Layout (No Scrolling)
- [ ] Fixed-height container (no overflow)
- [ ] All sections with `flex-shrink: 0`
- [ ] Compact spacing (0.5rem gaps)
- [ ] Minimal padding (0.5rem)

### Phase 2: Enemy Display (Minimal)
- [ ] Remove threat assessment
- [ ] Remove stats display
- [ ] Remove abilities display
- [ ] Show only: icon, name, element
- [ ] Horizontal compact layout

### Phase 3: Equipment Display (Compact)
- [ ] Horizontal row layout (5 slots)
- [ ] Inline stat preview
- [ ] Collapsible details
- [ ] Compact font sizes

### Phase 4: Djinn Display (Compact)
- [ ] Horizontal slots layout
- [ ] Inline abilities display
- [ ] Compact available Djinn list
- [ ] Collapsible details

### Phase 5: Visual Polish
- [ ] Thin borders (1px)
- [ ] Minimal shadows
- [ ] Flat design
- [ ] Compact fonts
- [ ] Reduced visual weight

---

## File Structure (Simplified)

**New Files:**
1. `PreBattleTeamSelectScreen.tsx` - Main component (simplified)
2. `PreBattleTeamSelectScreen.css` - Compact layout CSS
3. `EnemyCompositionPanel.tsx` - Minimal enemy display
4. `EquipmentRow.tsx` - Horizontal equipment display
5. `DjinnRow.tsx` - Horizontal Djinn display
6. `TeamSlots.tsx` - Compact team slots
7. `BenchUnits.tsx` - Horizontal bench display

**Modified Files:**
1. `gameFlowSlice.ts` - Add team selection mode
2. `App.tsx` - Render team selection screen

---

## Key Improvements Summary

1. ✅ **No scrolling** - Fixed heights, compact spacing
2. ✅ **Minimal enemy display** - Names, icons, elements only
3. ✅ **Lighter design** - Thin borders, minimal padding, flat design
4. ✅ **Horizontal layouts** - Equipment, Djinn, bench, enemies
5. ✅ **Collapsible sections** - Equipment/Djinn details can collapse
6. ✅ **Compact fonts** - Smaller, responsive sizing
7. ✅ **Streamlined** - Removed unnecessary visual weight

---

## Next Steps

1. Create simplified component structure
2. Implement compact CSS layout
3. Build minimal enemy display component
4. Test on multiple viewport sizes (1080p, 768p, 720p)
5. Verify no vertical scrolling
6. Polish visual design (reduce weight)

