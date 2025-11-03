# ROLE 5: GRAPHICS INTEGRATOR - Comprehensive Onboarding Prompt

**Project**: Vale Chronicles - Golden Sun-inspired tactical RPG
**Your Mission**: Convert HTML/CSS mockups into React components and integrate with game logic
**Estimated Time**: 5-6 hours
**Current Phase**: Role 4 (Coder) is fixing tests in parallel, you'll integrate when ready

---

## 🎯 YOUR OBJECTIVE

Convert 4 approved HTML mockups into React components and integrate them with the game logic that's already been implemented. The backend is complete, you're building the frontend UI.

---

## 📋 WHAT YOU'RE BUILDING

### The 4 Core Screens

1. **Equipment Screen** - Where players equip weapons/armor on their units
2. **Unit Collection** - The roster showing all 10 recruitable units + bench management
3. **Rewards Screen** - Post-battle rewards (XP, gold, items, level-ups)
4. **Battle Transition** - The swirl effect when entering/leaving battles

**Note**: Battle screen and Djinn menu are lower priority for MVP.

---

## 📁 FILES YOU NEED

### Mockups (Your Design Reference)
```
mockups/
├── equipment-screen.html               # Your design template
├── unit-collection.html                # Your design template
├── rewards-screen.html                 # Your design template
├── battle-transition.html              # Your design template
├── tokens.css                          # Design tokens (colors, spacing, z-index)
├── equipment-screen-sprite-map.json    # Sprite locations
└── unit-collection-sprite-map.json     # Sprite locations
```

### Approved Design Docs
```
mockups/
├── EQUIPMENT_SCREEN_APPROVED.md        # Design rationale and requirements
├── UNIT_COLLECTION_APPROVED.md         # Design rationale and requirements
├── REWARDS_SCREEN_APPROVED.md          # Design rationale and requirements
└── BATTLE_TRANSITION_APPROVED.md       # Design rationale and requirements
```

### Game Logic (Already Implemented)
```
src/types/
├── Unit.ts                  # Unit class with stats, equipment, djinn
├── Team.ts                  # Party management (4 active + 6 bench)
├── Equipment.ts             # Equipment types and loadouts
├── Battle.ts                # Battle execution and results
├── BattleRewards.ts         # Reward calculation
└── Stats.ts                 # Stat types and utilities

src/data/
├── unitDefinitions.ts       # All 10 unit definitions
├── equipment.ts             # All equipment items
├── djinn.ts                 # All 12 Djinn
└── abilities.ts             # All abilities/Psynergy
```

---

## 🎨 DESIGN TOKENS (Use These!)

**File**: `mockups/tokens.css`

These are already defined, just import them:

```css
:root {
  /* Colors */
  --gs-blue-dark: #0a1f44;
  --gs-blue-mid: #1e3a5f;
  --gs-gold: #f4d03f;
  --gs-text-primary: #f8f9fa;
  --gs-text-secondary: #adb5bd;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Z-index layers */
  --z-battle-bg: 1;
  --z-battle-units: 10;
  --z-battle-ui: 20;
  --z-battle-effects: 30;
  --z-transition: 100;
  --z-modal: 200;

  /* Timing */
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;
}
```

---

## 🔌 GAME LOGIC API (What You'll Integrate With)

### Unit API

```typescript
import { Unit } from '@/types/Unit';
import { ISAAC, GARET, JENNA } from '@/data/unitDefinitions';

// Create a unit at level 5
const isaac = new Unit(ISAAC, 5);

// Properties you'll display
isaac.name;           // "Isaac"
isaac.level;          // 5
isaac.element;        // "Venus"
isaac.role;           // "Balanced Warrior"
isaac.currentHp;      // 180
isaac.maxHp;          // 180
isaac.currentPp;      // 36
isaac.maxPp;          // 36

// Calculated stats (includes equipment + djinn bonuses)
isaac.stats.atk;      // 26 (base) + equipment + djinn
isaac.stats.def;      // 18
isaac.stats.mag;      // 20
isaac.stats.spd;      // 16

// Equipment
isaac.equipment;      // { weapon, armor, accessory1, accessory2 }
isaac.equipItem(STEEL_SWORD, 'weapon');  // Returns Result<void, string>
isaac.unequipItem('weapon');             // Returns Result<void, string>

// Djinn
isaac.djinn;          // Array of equipped Djinn
isaac.equipDjinn([FLINT, GRANITE]);      // Returns Result<void, string>
```

### Team API

```typescript
import { Team } from '@/types/Team';

const team = new Team();

// Add units (max 4 active)
team.addUnit(isaac);
team.addUnit(garet);

// Properties
team.units;           // Array of 4 active units
team.benchedUnits;    // Array of 6 benched units (max 10 total)

// Party management
team.removeUnit('isaac');                 // Returns Result<void, string>
team.swapUnits('isaac', 'felix');        // Swap active <-> bench

// Djinn bonuses (team-wide)
team.getDjinnSynergy();                   // { atk: +12, def: +8 }
```

### Equipment API

```typescript
import { STEEL_SWORD, WOODEN_SHIELD } from '@/data/equipment';

// Equipment structure
interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  tier: 'common' | 'rare' | 'legendary';
  statBonus: Partial<Stats>;              // { atk: +8, def: +3 }
  description: string;
}

// Example
STEEL_SWORD = {
  id: 'steel-sword',
  name: 'Steel Sword',
  type: 'weapon',
  tier: 'rare',
  statBonus: { atk: 8 },
  description: 'A reliable steel blade'
}
```

### Battle Rewards API

```typescript
import { calculateRewards } from '@/types/BattleRewards';

// After battle victory
const rewards = calculateRewards({
  playerTeam: team,
  enemyTeam: [goblin1, goblin2],
  victory: true,
  seed: 12345
});

// Rewards structure
rewards = {
  xp: 150,              // Total XP gained
  gold: 75,             // Gold earned
  items: [HERB, POTION], // Dropped items
  levelUps: [           // Units that leveled up
    {
      unitId: 'isaac',
      oldLevel: 4,
      newLevel: 5,
      statGains: { hp: +20, atk: +3, def: +2 }
    }
  ],
  recruitment: {        // If NPC joined
    unitId: 'felix',
    level: 3
  }
}
```

---

## 🎬 SCREEN-BY-SCREEN GUIDE

### SCREEN 1: Equipment Screen

**File**: Create `src/components/EquipmentScreen.tsx`

**What It Does**: Let players equip weapons/armor on their units

**Required Features**:
1. Unit selector (dropdown or tabs showing 4 active party members)
2. 4 equipment slots: Weapon, Armor, Accessory 1, Accessory 2
3. Display current equipped items (or "Empty" if none)
4. Stat preview (show ATK +8 when hovering over weapon)
5. Equipment inventory list (all available items)
6. Equip/Unequip buttons
7. Visual feedback (Golden Sun-style borders, GBA aesthetic)

**Props Interface**:
```typescript
interface EquipmentScreenProps {
  team: Team;                              // The 4-unit party
  inventory: Equipment[];                  // Available equipment
  onEquip: (unitId: string, item: Equipment, slot: string) => void;
  onUnequip: (unitId: string, slot: string) => void;
  onClose: () => void;
}
```

**Key Integration**:
```typescript
// Get unit's current equipment
const unit = team.units.find(u => u.id === selectedUnitId);
const weapon = unit.equipment.weapon;     // Equipment | undefined
const armor = unit.equipment.armor;

// Equip an item
const result = unit.equipItem(STEEL_SWORD, 'weapon');
if (result.ok) {
  // Success! Update UI
} else {
  // Show error: result.error
}

// Show stat changes
const beforeATK = unit.stats.atk;
// ... equip item ...
const afterATK = unit.stats.atk;
const change = afterATK - beforeATK;  // Show "+8 ATK"
```

**Design Reference**: `mockups/equipment-screen.html` + `EQUIPMENT_SCREEN_APPROVED.md`

---

### SCREEN 2: Unit Collection

**File**: Create `src/components/UnitCollectionScreen.tsx`

**What It Does**: Show all 10 units, manage active party (4) vs bench (6)

**Required Features**:
1. Grid of 10 unit cards (4 active marked clearly, 6 benched greyed out)
2. Each card shows: Portrait, Name, Level, HP/PP bars, Element icon
3. Click unit to see details (stats, abilities, equipment)
4. Swap button to move units between active party and bench
5. Visual distinction: Active units have gold border, benched units greyed
6. Locked units (not recruited yet) show as "???" with lock icon

**Props Interface**:
```typescript
interface UnitCollectionScreenProps {
  team: Team;                              // Party with active + bench
  allUnits: UnitDefinition[];              // All 10 possible units
  recruitedUnitIds: string[];              // Which units player has
  onSwapUnit: (unitId1: string, unitId2: string) => void;
  onViewDetails: (unitId: string) => void;
  onClose: () => void;
}
```

**Key Integration**:
```typescript
// Active party (4 units)
const activeUnits = team.units;

// Benched units (up to 6)
const benchedUnits = team.benchedUnits;

// Check if unit is recruited
const isRecruited = recruitedUnitIds.includes('felix');

// Swap active <-> bench
const result = team.swapUnits('isaac', 'felix');
if (result.ok) {
  // Success! Felix is now active, Isaac benched
}

// Display unit stats
const unit = activeUnits[0];
const hpPercent = (unit.currentHp / unit.maxHp) * 100;  // For HP bar
```

**Design Reference**: `mockups/unit-collection.html` + `UNIT_COLLECTION_APPROVED.md`

---

### SCREEN 3: Rewards Screen

**File**: Create `src/components/RewardsScreen.tsx`

**What It Does**: Show post-battle rewards (XP, gold, items, level-ups)

**Required Features**:
1. Victory banner with "VICTORY!" text
2. XP gained (with animated counter)
3. Gold earned (with coin animation)
4. Items obtained (show item icons + names)
5. Level-up celebration (if any units leveled up)
   - Show unit portrait
   - Display stat gains (+20 HP, +3 ATK, etc.)
   - Play level-up fanfare (if you add audio)
6. Recruitment announcement (if NPC joined)
7. Continue button to close

**Props Interface**:
```typescript
interface RewardsScreenProps {
  rewards: BattleRewards;
  onContinue: () => void;
}
```

**Key Integration**:
```typescript
// Rewards come from calculateRewards()
const rewards = {
  xp: 150,
  gold: 75,
  items: [HERB, POTION],
  levelUps: [
    {
      unitId: 'isaac',
      oldLevel: 4,
      newLevel: 5,
      statGains: { hp: 20, atk: 3, def: 2, mag: 2, spd: 1 }
    }
  ],
  recruitment: {
    unitId: 'felix',
    level: 3
  }
};

// Display level-up
{rewards.levelUps.map(levelUp => (
  <LevelUpCard key={levelUp.unitId}>
    <h3>{levelUp.unitId} leveled up!</h3>
    <p>Level {levelUp.oldLevel} → {levelUp.newLevel}</p>
    <StatGains>
      <p>HP +{levelUp.statGains.hp}</p>
      <p>ATK +{levelUp.statGains.atk}</p>
      {/* ... etc */}
    </StatGains>
  </LevelUpCard>
))}
```

**Design Reference**: `mockups/rewards-screen.html` + `REWARDS_SCREEN_APPROVED.md`

---

### SCREEN 4: Battle Transition

**File**: Create `src/components/BattleTransition.tsx`

**What It Does**: The iconic swirl effect when entering/leaving battles

**Required Features**:
1. Spiral/swirl animation (CSS or Canvas)
2. 1-second duration
3. Smooth easing (ease-in-out)
4. Covers entire screen (z-index: 100)
5. Three variants:
   - **Enter Battle**: Spiral in (screen → center)
   - **Victory**: Spiral out with flash
   - **Defeat**: Spiral out with fade

**Props Interface**:
```typescript
interface BattleTransitionProps {
  type: 'enter' | 'victory' | 'defeat' | 'flee';
  onComplete: () => void;
}
```

**Key Integration**:
```typescript
// When battle starts
<BattleTransition
  type="enter"
  onComplete={() => {
    // Transition complete, show battle screen
    setShowBattle(true);
  }}
/>

// After battle victory
<BattleTransition
  type="victory"
  onComplete={() => {
    // Show rewards screen
    setShowRewards(true);
  }}
/>
```

**Design Reference**: `mockups/battle-transition.html` + `BATTLE_TRANSITION_APPROVED.md`

**Animation Example** (CSS):
```css
@keyframes spiral-in {
  0% {
    transform: scale(10) rotate(0deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(720deg);
    opacity: 1;
  }
}

.battle-transition {
  animation: spiral-in 1s ease-in-out;
}
```

---

## 📦 COMPONENT STRUCTURE SUGGESTION

```
src/components/
├── EquipmentScreen/
│   ├── EquipmentScreen.tsx          # Main screen
│   ├── EquipmentSlot.tsx            # Single equipment slot
│   ├── EquipmentList.tsx            # Inventory list
│   ├── StatPreview.tsx              # Stat change preview
│   └── EquipmentScreen.module.css
│
├── UnitCollection/
│   ├── UnitCollectionScreen.tsx     # Main screen
│   ├── UnitCard.tsx                 # Individual unit card
│   ├── UnitDetails.tsx              # Detail view modal
│   └── UnitCollection.module.css
│
├── Rewards/
│   ├── RewardsScreen.tsx            # Main screen
│   ├── LevelUpCard.tsx              # Level-up celebration
│   ├── ItemReward.tsx               # Item display
│   └── RewardsScreen.module.css
│
├── BattleTransition/
│   ├── BattleTransition.tsx         # Main transition
│   └── BattleTransition.module.css
│
└── shared/
    ├── HPBar.tsx                    # Reusable HP/PP bar
    ├── ElementIcon.tsx              # Element type icons
    ├── StatDisplay.tsx              # Stat value display
    └── Button.tsx                   # Golden Sun-style button
```

---

## 🎨 VISUAL STYLE GUIDE

### Golden Sun GBA Aesthetic

**Colors**:
- Dark blue backgrounds (#0a1f44, #1e3a5f)
- Gold accents (#f4d03f) for selections and highlights
- White text (#f8f9fa) for primary info
- Grey text (#adb5bd) for secondary info

**Typography**:
- Font: System fonts mimicking GBA (monospace, sans-serif)
- Sizes: 12px (small), 14px (normal), 18px (headers)
- Weight: Bold for headers, normal for body

**Borders**:
- 2px solid gold (#f4d03f) for selected items
- 1px solid grey for non-selected
- Rounded corners (4px border-radius)

**Animations**:
- Fast transitions (150ms) for hover effects
- Normal transitions (300ms) for screen changes
- Slow transitions (500ms) for level-ups

**Accessibility**:
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Focus indicators (gold outline)

---

## ✅ ACCEPTANCE CRITERIA

Your implementation is complete when:

### Functionality
- [ ] All 4 screens render without errors
- [ ] Equipment screen: Can equip/unequip items
- [ ] Unit Collection: Can swap active/bench units
- [ ] Rewards screen: Displays all reward types
- [ ] Battle transition: Smooth 1-second animation

### Integration
- [ ] Components use actual game logic (Unit, Team, Equipment classes)
- [ ] No hardcoded data (pull from data files)
- [ ] Result types handled correctly (Ok/Err)
- [ ] TypeScript 0 errors

### Visual Polish
- [ ] Matches mockup designs (colors, layout, spacing)
- [ ] Uses design tokens from tokens.css
- [ ] Smooth animations
- [ ] Responsive layout (works on different screen sizes)
- [ ] GBA aesthetic maintained

### Code Quality
- [ ] Components are typed (TypeScript interfaces)
- [ ] CSS Modules used (no global styles)
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] No console errors or warnings

---

## 🚀 GETTING STARTED

### Step 1: Read the Mockup Files

```bash
# Open in browser
open mockups/equipment-screen.html
open mockups/unit-collection.html
open mockups/rewards-screen.html
open mockups/battle-transition.html

# Read design rationale
cat mockups/EQUIPMENT_SCREEN_APPROVED.md
cat mockups/UNIT_COLLECTION_APPROVED.md
# ... etc
```

### Step 2: Study the Game Logic

```bash
# Read the unit types
cat src/types/Unit.ts | head -200

# Read the team types
cat src/types/Team.ts | head -100

# Look at example data
cat src/data/unitDefinitions.ts | head -100
cat src/data/equipment.ts | head -100
```

### Step 3: Start with Equipment Screen (Simplest)

```typescript
// src/components/EquipmentScreen/EquipmentScreen.tsx

import React, { useState } from 'react';
import { Unit } from '@/types/Unit';
import { Team } from '@/types/Team';
import { Equipment } from '@/types/Equipment';
import styles from './EquipmentScreen.module.css';

interface EquipmentScreenProps {
  team: Team;
  inventory: Equipment[];
  onEquip: (unitId: string, item: Equipment, slot: string) => void;
  onUnequip: (unitId: string, slot: string) => void;
  onClose: () => void;
}

export function EquipmentScreen({ team, inventory, onEquip, onUnequip, onClose }: EquipmentScreenProps) {
  const [selectedUnit, setSelectedUnit] = useState<Unit>(team.units[0]);

  return (
    <div className={styles.container}>
      <h1>Equipment</h1>

      {/* Unit selector */}
      <div className={styles.unitSelector}>
        {team.units.map(unit => (
          <button
            key={unit.id}
            onClick={() => setSelectedUnit(unit)}
            className={unit.id === selectedUnit.id ? styles.selected : ''}
          >
            {unit.name}
          </button>
        ))}
      </div>

      {/* Equipment slots */}
      <div className={styles.equipment}>
        {/* TODO: Render weapon, armor, accessory slots */}
      </div>

      {/* Inventory */}
      <div className={styles.inventory}>
        {/* TODO: Render available equipment list */}
      </div>

      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

### Step 4: Test Your Component

```typescript
// src/App.tsx - Add a test button

import { EquipmentScreen } from './components/EquipmentScreen/EquipmentScreen';
import { Team } from '@/types/Team';
import { Unit } from '@/types/Unit';
import { ISAAC, GARET } from '@/data/unitDefinitions';
import { ALL_EQUIPMENT } from '@/data/equipment';

function App() {
  const [showEquipment, setShowEquipment] = useState(false);

  const team = new Team();
  team.addUnit(new Unit(ISAAC, 5));
  team.addUnit(new Unit(GARET, 5));

  return (
    <div>
      <button onClick={() => setShowEquipment(true)}>
        Test Equipment Screen
      </button>

      {showEquipment && (
        <EquipmentScreen
          team={team}
          inventory={ALL_EQUIPMENT}
          onEquip={(unitId, item, slot) => {
            const unit = team.units.find(u => u.id === unitId);
            unit?.equipItem(item, slot as any);
          }}
          onUnequip={(unitId, slot) => {
            const unit = team.units.find(u => u.id === unitId);
            unit?.unequipItem(slot as any);
          }}
          onClose={() => setShowEquipment(false)}
        />
      )}
    </div>
  );
}
```

---

## 📚 ADDITIONAL RESOURCES

### Reference Documents (Already in Repo)

- `ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md` - Full onboarding guide
- `VALE_CHRONICLES_ARCHITECTURE.md` - System architecture
- `docs/architect/GAME_MECHANICS.md` - Game mechanics (2,600+ lines!)
- `docs/DEEP_ASSESSMENT_CODER.md` - Code patterns and rules

### Sprite Assets

**Location**: `mockups/*-sprite-map.json`

These JSON files map sprite locations. Example:
```json
{
  "isaac-portrait": "sprites/portraits/isaac.png",
  "steel-sword": "sprites/equipment/sword-02.png",
  "venus-icon": "sprites/elements/venus.png"
}
```

### Golden Sun References

- [Golden Sun Wikia](https://goldensun.fandom.com/) - Visual reference
- UI screenshots for design inspiration
- Battle transition reference videos

---

## ⚠️ COMMON PITFALLS TO AVOID

❌ **Don't use Math.random()** - Game uses SeededRNG for determinism
❌ **Don't hardcode unit stats** - Always use `unit.stats` (includes equipment bonuses)
❌ **Don't mutate readonly data** - Unit definitions are immutable
❌ **Don't ignore Result types** - Check `.ok` before accessing value
❌ **Don't use global CSS** - Use CSS Modules (`.module.css`)
❌ **Don't skip accessibility** - Add ARIA labels and keyboard nav

---

## 🎯 SUCCESS CHECKLIST

Before you say "I'm done":

- [ ] All 4 screens implemented and working
- [ ] Integrated with real game logic (not mock data)
- [ ] Matches mockup designs visually
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No console errors in browser
- [ ] Accessible (test with keyboard only)
- [ ] Animations smooth (60 FPS)
- [ ] Mobile-friendly (responsive layout)
- [ ] Code reviewed (clean, commented)
- [ ] Git committed with clear message

---

## 🚀 READY TO START?

**Your first task**: Open `mockups/equipment-screen.html` in a browser, study the design, then start building `src/components/EquipmentScreen/EquipmentScreen.tsx`.

**Questions?** Refer to:
1. `ROLE_5_GRAPHICS_INTEGRATION_ONBOARDING.md` - Detailed guide
2. `docs/DEEP_ASSESSMENT_CODER.md` - Code patterns
3. `docs/architect/GAME_MECHANICS.md` - Game rules

**Parallel Work**: The Coder is fixing tests right now. When tests are all passing, your components will integrate seamlessly with the battle system.

**Good luck! Build something Golden Sun fans will love! ⚔️✨**

---

**Document Created**: 2025-11-03
**Role**: Role 5 Onboarding
**Estimated Completion**: 5-6 hours
**Status**: Ready to start
