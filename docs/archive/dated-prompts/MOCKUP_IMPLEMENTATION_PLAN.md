# Mockup Implementation Plan

**Created:** November 3, 2025  
**Status:** 🔴 Planning Phase  
**Goal:** Implement 7 authentic Golden Sun mockups into the game

---

## Executive Summary

We have **7 polished HTML/CSS mockups** in `mockups/improved/` that authentically recreate Golden Sun's GBA aesthetic. This document outlines the plan to:

1. **Scale up the overworld** (20×15 → 60×45+ tiles)
2. **Implement camera system** (viewport follows player)
3. **Apply authentic styling** (tiled terrain, GBA colors, shadows)
4. **Build 7 new screens** (Battle polish, Equipment, Djinn, Rewards, Collection, Transition)

**Total Estimated Time:** 18-23 hours

---

## Current State Assessment

### What We Have

**Functional:**
- ✅ Basic overworld with movement (WASD/arrows)
- ✅ NPC interactions and dialogues
- ✅ Battle system with 26 NPC battles
- ✅ Treasure chests and boss encounters
- ✅ Quest system
- ✅ Area transitions (Vale Village ↔ Forest Path ↔ Ancient Ruins)

**Mockups Complete:**
- ✅ Battle Screen Authentic (960×640)
- ✅ Djinn Menu Authentic (1200px)
- ✅ Overworld Golden Sun Authentic (960×640)
- ✅ Equipment Screen Polished (1200px)
- ✅ Rewards Screen Celebration (800px)
- ✅ Unit Collection Roster (1200px)
- ✅ Battle Transition Spiral (960×640)

### What We Need

**Current Limitations:**
- ❌ Overworld too small (Vale Village = 20×15 tiles = 640×480px)
- ❌ No camera system (entire map visible at once)
- ❌ Solid color backgrounds (not tiled terrain)
- ❌ Generic colors (not Golden Sun palette)
- ❌ Missing screens (Equipment, Djinn, Rewards, Collection)
- ❌ Battle screen needs polish (match mockup)
- ❌ Transition effect needs enhancement (spiral animation)

---

## Current Overworld Specs

### Areas (from `src/data/areas.ts`)

| Area | Width | Height | Total Tiles | Pixel Size |
|------|-------|--------|-------------|------------|
| Vale Village | 20 | 15 | 300 | 640×480px |
| Forest Path | 25 | 20 | 500 | 800×640px |
| Ancient Ruins | 30 | 25 | 750 | 960×800px |

**Tile Size:** 32px × 32px

### Mockup Specs (from `vale-village-authentic.html`)

| Property | Value | Notes |
|----------|-------|-------|
| Viewport | 960×640px | GBA 240×160 scaled 4× |
| World Size | 1920×1920px | 120×120 tiles at 16px |
| Tile Size | 16px | Half the current size |
| Camera | Follows player | Smooth scrolling |

**Key Insight:** Mockups use **2× larger world** with **half-size tiles** → same visual density but 4× more space

---

## Phase 1: Scale Up Overworld (2-3 hours)

### Goal
Increase map sizes 3-4× and implement camera system

### Tasks

#### 1.1 Update Area Dimensions
**File:** `src/data/areas.ts`

```typescript
// BEFORE
export const VALE_VILLAGE: Area = {
  width: 20,
  height: 15,
  // ...
};

// AFTER
export const VALE_VILLAGE: Area = {
  width: 60,   // 3× larger
  height: 45,  // 3× larger
  // NPCs, treasures, exits need repositioning
};
```

**Changes Needed:**
- Vale Village: 20×15 → 60×45 (2,700 tiles)
- Forest Path: 25×20 → 75×60 (4,500 tiles)
- Ancient Ruins: 30×25 → 90×75 (6,750 tiles)

#### 1.2 Reposition Entities
**Approach:** Scale all positions by 3×

```typescript
// BEFORE
npcs: [
  { id: 'Mayor', position: { x: 10, y: 5 } }
]

// AFTER
npcs: [
  { id: 'Mayor', position: { x: 30, y: 15 } }  // 3× multiplier
]
```

**Entities to Update:**
- NPCs (26+ characters)
- Treasures (10+ chests)
- Bosses (3+ encounters)
- Exits (6+ zones)

#### 1.3 Implement Camera System
**File:** `src/components/overworld/NewOverworldScreen.tsx`

**New State:**
```typescript
const [camera, setCamera] = useState({ x: 0, y: 0 });
const VIEWPORT_WIDTH = 960;  // 30 tiles visible
const VIEWPORT_HEIGHT = 640; // 20 tiles visible
```

**Camera Logic:**
```typescript
// Center camera on player
const updateCamera = () => {
  const targetX = playerPos.x * 32 - VIEWPORT_WIDTH / 2;
  const targetY = playerPos.y * 32 - VIEWPORT_HEIGHT / 2;
  
  // Clamp to world bounds
  const maxX = area.width * 32 - VIEWPORT_WIDTH;
  const maxY = area.height * 32 - VIEWPORT_HEIGHT;
  
  setCamera({
    x: Math.max(0, Math.min(targetX, maxX)),
    y: Math.max(0, Math.min(targetY, maxY))
  });
};
```

**Viewport Rendering:**
```tsx
<div className="map-container" style={{ width: '960px', height: '640px', overflow: 'hidden' }}>
  <div className="map" style={{
    width: `${area.width * 32}px`,
    height: `${area.height * 32}px`,
    transform: `translate(-${camera.x}px, -${camera.y}px)`,
    transition: 'transform 0.1s linear'
  }}>
    {/* Entities render at absolute positions */}
  </div>
</div>
```

#### 1.4 Test Movement & Bounds
- ✅ Player can move across entire large map
- ✅ Camera follows smoothly
- ✅ Camera stops at world edges
- ✅ NPCs visible when in viewport
- ✅ Transitions work correctly

---

## Phase 2: Authentic Terrain Styling (1-2 hours)

### Goal
Replace solid backgrounds with tiled Golden Sun terrain

### Tasks

#### 2.1 Import Design Tokens
**File:** `src/components/overworld/OverworldTokens.css`

Extract from `mockups/tokens.css`:
```css
:root {
  /* Element Colors */
  --color-venus: #E8A050;      /* Earth */
  --color-mars: #E05050;       /* Fire */
  --color-mercury: #5090D8;    /* Water */
  --color-jupiter: #A858D8;    /* Wind */
  
  /* Terrain Colors */
  --color-grass-light: #88C070;
  --color-grass-mid: #70A858;
  --color-grass-dark: #609048;
  --color-path: #C8A870;
  
  /* UI Colors */
  --color-text-primary: #F8F8F0;
  --color-text-gold: #FFD87F;
  --color-bg-panel: rgba(12, 16, 40, 0.85);
  --color-border-light: #4A7AB8;
  --color-border-dark: #0F2550;
  
  /* Typography */
  --font-primary: 'Press Start 2P', monospace;
  
  /* GBA Scaling */
  --scale-4x: 960px;
  --scale-height-4x: 640px;
}
```

#### 2.2 Tiled Grass Background
**File:** `src/components/overworld/NewOverworldScreen.css`

```css
.map {
  background-color: var(--color-grass-mid);
  background-image:
    /* Grid lines for tile effect */
    repeating-linear-gradient(0deg, 
      transparent, transparent 16px, 
      rgba(104, 160, 80, 0.2) 16px, 
      rgba(104, 160, 80, 0.2) 17px
    ),
    repeating-linear-gradient(90deg, 
      transparent, transparent 16px, 
      rgba(104, 160, 80, 0.2) 16px, 
      rgba(104, 160, 80, 0.2) 17px
    );
  image-rendering: pixelated;
}
```

#### 2.3 Area-Specific Terrain
```css
/* Vale Village - Lush grass */
.overworld-screen[data-area="vale_village"] .map {
  background-color: var(--color-grass-mid);
  background-image: 
    repeating-linear-gradient(45deg, 
      var(--color-grass-light) 0px, 
      var(--color-grass-light) 8px, 
      var(--color-grass-mid) 8px, 
      var(--color-grass-mid) 16px
    );
}

/* Forest Path - Dark forest floor */
.overworld-screen[data-area="forest_path"] .map {
  background-color: #2d4a2e;
  background-image: 
    repeating-linear-gradient(60deg, 
      #2d4a2e 0px, #2d4a2e 8px, 
      #3a5f3b 8px, #3a5f3b 16px
    );
}

/* Ancient Ruins - Stone tiles */
.overworld-screen[data-area="ancient_ruins"] .map {
  background-color: #6b7280;
  background-image: 
    repeating-linear-gradient(30deg, 
      #6b7280 0px, #6b7280 8px, 
      #7a8491 8px, #7a8491 16px
    );
}
```

#### 2.4 Add Grass Variations
```tsx
// In NewOverworldScreen.tsx
const grassPatches = [
  { x: 100, y: 50 },
  { x: 400, y: 200 },
  { x: 600, y: 350 },
  // ... more patches
];

<div className="terrain-layer">
  {grassPatches.map((patch, i) => (
    <div 
      key={i} 
      className="grass-patch" 
      style={{ left: patch.x, top: patch.y }} 
    />
  ))}
</div>
```

```css
.grass-patch {
  position: absolute;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(136, 192, 112, 0.4), transparent);
  border-radius: 50%;
  z-index: 1;
}
```

---

## Phase 3: Visual Improvements (2-3 hours)

### Goal
Add authentic GBA visual effects

### Tasks

#### 3.1 Entity Drop Shadows
**File:** `src/components/overworld/NewOverworldScreen.css`

```css
/* Circular drop shadow for entities */
.player::after,
.npc::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 8px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.4), transparent);
  z-index: -1;
}

.player-sprite,
.npc-sprite {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
}
```

#### 3.2 3D Building Roofs
```tsx
// Add to areas.ts
buildings: [
  { 
    id: 'isaacs_house',
    position: { x: 30, y: 20 },
    width: 96,
    height: 96,
    sprite: '/sprites/scenery/buildings/Vale/Vale_Isaacs_House.gif'
  }
]
```

```css
.building {
  position: absolute;
  image-rendering: pixelated;
  filter: drop-shadow(4px 6px 8px rgba(0, 0, 0, 0.5));
}

.building-roof {
  position: absolute;
  top: -20px;
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, #C04040 0%, #A03030 100%);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}
```

#### 3.3 Player Bob Animation
```css
@keyframes playerBob {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
}

.player {
  animation: playerBob 1.5s ease-in-out infinite;
}
```

#### 3.4 Dialogue Box Polish
Match mockup styling:
```css
.dialogue-box {
  background: var(--color-bg-panel);
  border: 3px solid var(--color-border-light);
  border-bottom-color: var(--color-border-dark);
  border-right-color: var(--color-border-dark);
  box-shadow: 
    inset 1px 1px 0 rgba(255, 255, 255, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.6);
  font-family: var(--font-primary);
  color: var(--color-text-primary);
  text-shadow: 1px 1px 0 #000;
}
```

---

## Phase 4: Screen Implementations (8-10 hours)

### 4.1 Battle Screen Polish (2 hours)
**Goal:** Match `battle-screen-authentic.html`

**File:** `src/components/battle/BattleScreen.tsx`

**Changes:**
- Add turn order display (circular portraits)
- Polish stat bars (HP/PP gradients)
- Add 5-button command menu layout
- Add combat log panel
- Match authentic GBA colors

**Key Features from Mockup:**
```tsx
// Turn Order Display
<div className="turn-order">
  {turnOrder.map((unit, i) => (
    <div key={i} className="turn-portrait" data-element={unit.element}>
      <img src={unit.portraitUrl} alt={unit.name} />
      <div className="turn-number">{i + 1}</div>
    </div>
  ))}
</div>

// Command Menu (5 buttons)
<div className="command-menu">
  <button className="cmd-fight">⚔️ Fight</button>
  <button className="cmd-psynergy">✨ Psynergy</button>
  <button className="cmd-djinn">🔮 Djinn</button>
  <button className="cmd-items">🎒 Items</button>
  <button className="cmd-flee">🏃 Flee</button>
</div>
```

### 4.2 Equipment Screen (2 hours)
**Goal:** Implement `equipment-screen-polished.html`

**New File:** `src/components/menu/EquipmentScreen.tsx`

**Layout:**
- Left sidebar: 10 unit portraits (scrollable)
- Center: 4 equipment slots (Weapon/Armor/Helm/Boots)
- Right: Stats panel with before/after comparison
- Bottom: Action buttons (Optimize/Unequip All/Back)

**Key Features:**
```tsx
interface EquipmentSlot {
  type: 'weapon' | 'armor' | 'helm' | 'boots';
  equipped: Equipment | null;
  icon: string;
}

const slots: EquipmentSlot[] = [
  { type: 'weapon', equipped: currentWeapon, icon: '⚔️' },
  { type: 'armor', equipped: currentArmor, icon: '🛡️' },
  { type: 'helm', equipped: currentHelm, icon: '⛑️' },
  { type: 'boots', equipped: currentBoots, icon: '👢' },
];

// Stat changes with green arrows
{statDiff.atk > 0 && (
  <span className="stat-increase">+{statDiff.atk} ↑</span>
)}
```

### 4.3 Djinn Menu (2 hours)
**Goal:** Implement `djinn-menu-authentic.html`

**New File:** `src/components/menu/DjinnMenu.tsx`

**Layout:**
- 4-column grid (Venus/Mars/Mercury/Jupiter)
- 3 Djinn per element (expandable)
- Party portraits (2×2)
- Team slots (active Djinn)
- Current class display
- Unlocked Psynergy list

**Key Features:**
```tsx
const elements = ['venus', 'mars', 'mercury', 'jupiter'];
const djinnByElement = groupBy(allDjinn, 'element');

<div className="djinn-grid">
  {elements.map(element => (
    <div key={element} className="element-column" data-element={element}>
      <h3>{element.toUpperCase()}</h3>
      {djinnByElement[element].map(djinn => (
        <div className={`djinn-card ${djinn.status}`}>
          <div className="djinn-name">{djinn.name}</div>
          <div className="djinn-tier">Tier {djinn.tier}</div>
          <div className="djinn-status">{djinn.status}</div>
        </div>
      ))}
    </div>
  ))}
</div>
```

### 4.4 Rewards Screen (1-2 hours)
**Goal:** Implement `rewards-screen-celebration.html`

**New File:** `src/components/battle/RewardsScreen.tsx`

**Features:**
- Victory banner with pulse animation
- 3 twinkling stars
- XP/Gold counters (count-up effect)
- Items found panel
- Level-up celebration (if applicable)
- Stat gains display
- Rising sparkle particles
- Continue button

**Animations:**
```css
@keyframes victory-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes star-twinkle {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
}

@keyframes sparkle-rise {
  0% { 
    bottom: -20px; 
    opacity: 1; 
  }
  100% { 
    bottom: 100%; 
    opacity: 0; 
  }
}
```

### 4.5 Unit Collection (1-2 hours)
**Goal:** Implement `unit-collection-roster.html`

**New File:** `src/components/menu/UnitCollectionScreen.tsx`

**Layout:**
- Active party (4 large slots)
- Bench (6 smaller slots)
- Unit details panel (right side)
- Action buttons (Swap/Equip/Back)

**Features:**
```tsx
<div className="party-section">
  <h2>Active Party</h2>
  <div className="party-grid">
    {activeParty.map(unit => (
      <div className="unit-card large active">
        <img src={unit.spriteUrl} alt={unit.name} />
        <div className="unit-name">{unit.name}</div>
        <div className="unit-level">Lv {unit.level}</div>
        <div className="unit-hp">{unit.hp}/{unit.maxHP} HP</div>
        <div className="element-badge" data-element={unit.element} />
        <div className="active-badge">ACTIVE</div>
      </div>
    ))}
  </div>
</div>

<div className="bench-section">
  <h2>Bench</h2>
  <div className="bench-grid">
    {benchUnits.map(unit => (
      <div className="unit-card small">
        {/* Similar structure, smaller */}
      </div>
    ))}
  </div>
</div>
```

### 4.6 Battle Transition (1 hour)
**Goal:** Enhance with `battle-transition-spiral.html`

**File:** `src/components/battle/BattleTransition.tsx`

**Spiral Effect:**
```tsx
const circles = [
  { color: '#FFFFFF', delay: 0 },
  { color: '#FFD700', delay: 100 },
  { color: '#5090D8', delay: 200 },
  { color: '#E8A050', delay: 300 },
];

<div className="spiral-container">
  {circles.map((circle, i) => (
    <div
      key={i}
      className="spiral-circle"
      style={{
        backgroundColor: circle.color,
        animationDelay: `${circle.delay}ms`
      }}
    />
  ))}
</div>
```

```css
@keyframes spiral-expand {
  0% {
    width: 0;
    height: 0;
    border-width: 8px;
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    width: 200%;
    height: 200%;
    border-width: 1px;
    transform: translate(-50%, -50%) rotate(1080deg);
  }
}

.spiral-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 8px solid currentColor;
  animation: spiral-expand 1s ease-out forwards;
}
```

---

## Phase 5: Integration & Testing (2-3 hours)

### 5.1 Navigation Wiring
**File:** `src/App.tsx` / `src/context/GameProvider.tsx`

Add new screen types:
```typescript
type Screen = 
  | { type: 'OVERWORLD' }
  | { type: 'BATTLE' }
  | { type: 'EQUIPMENT'; unitId?: string }
  | { type: 'DJINN_MENU' }
  | { type: 'UNIT_COLLECTION' }
  | { type: 'REWARDS'; battleResult: BattleResult }
  | { type: 'MENU' };

// Add actions
interface GameActions {
  navigate: (screen: Screen) => void;
  openEquipment: (unitId?: string) => void;
  openDjinnMenu: () => void;
  openUnitCollection: () => void;
  // ...
}
```

### 5.2 Menu System
Create main menu that links to all screens:
```tsx
<div className="main-menu">
  <button onClick={() => actions.openEquipment()}>Equipment</button>
  <button onClick={() => actions.openDjinnMenu()}>Djinn</button>
  <button onClick={() => actions.openUnitCollection()}>Party</button>
  <button onClick={() => actions.navigate({ type: 'OVERWORLD' })}>Return</button>
</div>
```

### 5.3 Testing Checklist

**Overworld:**
- [ ] Player moves smoothly across large map
- [ ] Camera follows correctly
- [ ] Camera stops at world edges
- [ ] NPCs spawn in correct positions
- [ ] Treasures accessible
- [ ] Exits trigger transitions
- [ ] Terrain renders correctly
- [ ] Performance is smooth (60fps)

**Battle Screen:**
- [ ] Turn order displays correctly
- [ ] HP/PP bars update
- [ ] Command menu works
- [ ] Combat log shows messages
- [ ] Transition animation plays

**Equipment Screen:**
- [ ] Unit selection works
- [ ] Equipment slots show correct items
- [ ] Stats update on equip/unequip
- [ ] Stat changes show green arrows
- [ ] Optimize button works

**Djinn Menu:**
- [ ] All 4 element columns display
- [ ] Djinn status (Set/Standby) correct
- [ ] Class name updates
- [ ] Psynergy list updates
- [ ] Set/Unset actions work

**Rewards Screen:**
- [ ] Victory animation plays
- [ ] XP/Gold count up
- [ ] Items display
- [ ] Level-up detected
- [ ] Sparkles animate
- [ ] Continue button works

**Unit Collection:**
- [ ] Active party shows 4 units
- [ ] Bench shows remaining units
- [ ] Details panel updates
- [ ] Swap action works
- [ ] Navigation works

**Battle Transition:**
- [ ] Spiral animation plays
- [ ] 4 circles expand/rotate correctly
- [ ] Timing is correct (1000ms)
- [ ] Encounter text displays
- [ ] Transitions to battle

### 5.4 Performance Optimization

**Rendering:**
- Use `React.memo()` for entity components
- Virtualize off-screen entities
- Use CSS transforms (GPU accelerated)
- Limit animation complexity

**Camera System:**
- Debounce camera updates
- Use `requestAnimationFrame` for smooth scrolling
- Cull entities outside viewport

**Asset Loading:**
- Lazy load sprites
- Use sprite sheets where possible
- Preload critical assets

### 5.5 Accessibility

**Keyboard Navigation:**
- Tab order logical
- Focus indicators visible
- Shortcuts documented

**Screen Readers:**
- ARIA labels on all interactive elements
- Announce screen changes
- Describe visual elements

**Motion:**
- Respect `prefers-reduced-motion`
- Disable animations if requested
- Provide static alternatives

---

## File Structure (After Implementation)

```
src/
├── components/
│   ├── overworld/
│   │   ├── NewOverworldScreen.tsx      (✅ Exists, needs scaling)
│   │   ├── NewOverworldScreen.css      (✅ Exists, needs terrain)
│   │   └── OverworldTokens.css         (🆕 New design tokens)
│   ├── battle/
│   │   ├── BattleScreen.tsx            (✅ Exists, needs polish)
│   │   ├── BattleScreen.css            (✅ Exists, needs updates)
│   │   ├── BattleTransition.tsx        (✅ Exists, needs spiral)
│   │   ├── BattleTransition.css        (✅ Exists, needs updates)
│   │   └── RewardsScreen.tsx           (🆕 New component)
│   └── menu/
│       ├── EquipmentScreen.tsx         (🆕 New component)
│       ├── DjinnMenu.tsx               (🆕 New component)
│       ├── UnitCollectionScreen.tsx    (🆕 New component)
│       └── MainMenu.tsx                (🆕 New component)
├── data/
│   └── areas.ts                        (✅ Needs scaling)
├── types/
│   └── Area.ts                         (✅ May need updates)
└── context/
    ├── types.ts                        (✅ Needs Screen type updates)
    └── GameProvider.tsx                (✅ Needs new actions)
```

---

## Mockup to Component Mapping

| Mockup File | Component | Status | Priority |
|-------------|-----------|--------|----------|
| `vale-village-authentic.html` | `NewOverworldScreen.tsx` | 🟡 Partial | HIGH |
| `battle-screen-authentic.html` | `BattleScreen.tsx` | 🟡 Partial | HIGH |
| `battle-transition-spiral.html` | `BattleTransition.tsx` | 🟡 Needs work | HIGH |
| `equipment-screen-polished.html` | `EquipmentScreen.tsx` | 🔴 Missing | MEDIUM |
| `djinn-menu-authentic.html` | `DjinnMenu.tsx` | 🔴 Missing | MEDIUM |
| `rewards-screen-celebration.html` | `RewardsScreen.tsx` | 🔴 Missing | MEDIUM |
| `unit-collection-roster.html` | `UnitCollectionScreen.tsx` | 🔴 Missing | LOW |

---

## Design Token Extraction

From `mockups/tokens.css`, extract to `src/styles/tokens.css`:

```css
:root {
  /* === GBA RESOLUTION === */
  --gba-width: 240px;
  --gba-height: 160px;
  --scale-2x: 480px;
  --scale-3x: 720px;
  --scale-4x: 960px;
  --scale-height-2x: 320px;
  --scale-height-3x: 480px;
  --scale-height-4x: 640px;

  /* === ELEMENT COLORS === */
  --color-venus: #E8A050;      /* Earth/Orange */
  --color-mars: #E05050;       /* Fire/Red */
  --color-mercury: #5090D8;    /* Water/Blue */
  --color-jupiter: #A858D8;    /* Wind/Purple */

  /* === UI COLORS === */
  --color-text-primary: #F8F8F0;
  --color-text-secondary: #C8C8C0;
  --color-text-gold: #FFD87F;
  --color-text-shadow: #000000;
  
  --color-bg-panel: rgba(12, 16, 40, 0.85);
  --color-bg-panel-solid: #0C1028;
  --color-bg-dark: #000000;
  
  --color-border-light: #4A7AB8;
  --color-border-dark: #0F2550;
  --color-border-gold: #FFD87F;

  /* === TERRAIN COLORS === */
  --color-grass-light: #88C070;
  --color-grass-mid: #70A858;
  --color-grass-dark: #609048;
  --color-path: #C8A870;
  --color-water: #4A90D8;
  --color-stone: #6B7280;

  /* === STATUS COLORS === */
  --color-hp-green: #57E2A6;
  --color-hp-yellow: #FFD700;
  --color-hp-red: #FF4444;
  --color-pp-blue: #5090D8;
  --color-damage-red: #FF4444;
  --color-heal-green: #44FF44;
  --color-critical-gold: #FFD700;

  /* === TYPOGRAPHY === */
  --font-primary: 'Press Start 2P', 'Courier New', monospace;
  --font-fallback: 'Courier New', Courier, monospace;
  --font-size-xs: 8px;
  --font-size-sm: 10px;
  --font-size-md: 12px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;

  /* === SPACING === */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --space-xxl: 32px;

  /* === Z-INDEX === */
  --z-background: 0;
  --z-ground: 1;
  --z-terrain: 5;
  --z-scenery: 10;
  --z-items: 20;
  --z-entities: 30;
  --z-player: 40;
  --z-effects: 50;
  --z-ui: 100;
  --z-overlay: 200;

  /* === ANIMATIONS === */
  --timing-fast: 0.15s;
  --timing-normal: 0.3s;
  --timing-slow: 0.5s;
  --easing-default: ease-out;
  --easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

/* === UTILITY CLASSES === */
.panel {
  background: var(--color-bg-panel);
  border: 3px solid var(--color-border-light);
  border-bottom-color: var(--color-border-dark);
  border-right-color: var(--color-border-dark);
  box-shadow: 
    inset 1px 1px 0 rgba(255, 255, 255, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.4);
}

.text-gold {
  color: var(--color-text-gold);
  text-shadow: 2px 2px 0 var(--color-text-shadow);
}

.element-venus { color: var(--color-venus); }
.element-mars { color: var(--color-mars); }
.element-mercury { color: var(--color-mercury); }
.element-jupiter { color: var(--color-jupiter); }
```

---

## Dependencies & Tools

### New NPM Packages (if needed)
```json
{
  "dependencies": {
    "@fontsource/press-start-2p": "^5.0.0"  // Local font loading
  }
}
```

### Google Fonts (Already in mockups)
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

### Asset Requirements
- Golden Sun sprite sheets (characters, scenery, items)
- Sound effects (battle, menu, movement)
- Music tracks (overworld, battle, victory)

---

## Risk Assessment

### High Risk
- ⚠️ **Camera system complexity** - Scrolling, bounds, performance
- ⚠️ **Sprite integration** - Mockups use emojis, need real sprites
- ⚠️ **Performance** - Large maps (6,750 tiles) may lag

### Medium Risk
- ⚠️ **Design token conflicts** - Existing CSS may clash
- ⚠️ **Entity repositioning** - 26+ NPCs need manual adjustment
- ⚠️ **Type safety** - New screen types, props, state

### Low Risk
- ✅ **Terrain styling** - Pure CSS, easy to implement
- ✅ **Animations** - CSS only, no JavaScript complexity
- ✅ **Mockup accuracy** - Reference designs complete

---

## Success Criteria

### Phase 1 Complete When:
- [ ] Vale Village is 60×45 tiles (1,920×1,440px)
- [ ] Camera follows player smoothly
- [ ] All 26 NPCs repositioned correctly
- [ ] Movement works across entire map
- [ ] Performance remains smooth

### Phase 2 Complete When:
- [ ] Tiled grass background renders
- [ ] Vale Village has lush green terrain
- [ ] Forest Path has dark forest floor
- [ ] Ancient Ruins has stone texture
- [ ] Grass variations add depth

### Phase 3 Complete When:
- [ ] Entities have drop shadows
- [ ] Buildings have 3D roofs
- [ ] Player has bob animation
- [ ] Dialogue box matches mockup
- [ ] All visual polish applied

### Phase 4 Complete When:
- [ ] All 7 screens implemented
- [ ] Navigation between screens works
- [ ] Game state updates correctly
- [ ] Screens match mockup designs
- [ ] All interactions functional

### Phase 5 Complete When:
- [ ] All screens tested
- [ ] Performance optimized
- [ ] Accessibility validated
- [ ] No critical bugs
- [ ] Ready for playtesting

---

## Timeline Estimate

| Phase | Tasks | Time | Dependencies |
|-------|-------|------|--------------|
| **Phase 1** | Scale overworld, camera | 2-3 hours | None |
| **Phase 2** | Terrain styling | 1-2 hours | Phase 1 |
| **Phase 3** | Visual polish | 2-3 hours | Phase 2 |
| **Phase 4** | 7 screen components | 8-10 hours | Phase 3 |
| **Phase 5** | Testing & integration | 2-3 hours | Phase 4 |
| **Total** | | **18-23 hours** | |

**Breakdown by Priority:**
- **High Priority** (Overworld, Battle): 8-10 hours
- **Medium Priority** (Equipment, Djinn, Rewards): 5-6 hours
- **Low Priority** (Collection, Polish): 2-3 hours
- **Testing** (All phases): 3-4 hours

---

## Next Steps

1. ✅ Review this implementation plan
2. ⏸️ Get approval to proceed
3. 🔄 Start Phase 1 (Scale overworld)
4. 🔄 Implement camera system
5. 🔄 Test movement & bounds
6. 🔄 Continue to Phase 2...

**Ready to begin? Let's scale up the overworld!** 🚀

---

*Implementation Plan created: November 3, 2025*  
*Status: Awaiting approval to proceed*
