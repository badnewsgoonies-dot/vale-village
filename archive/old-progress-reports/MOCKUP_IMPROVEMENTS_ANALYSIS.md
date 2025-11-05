# Mockup Improvements Analysis - Vale Chronicles

**Date:** November 3, 2025
**Purpose:** Bridge gap between current "made up" graphics and original Golden Sun vision

---

## Current State vs. Original Vision

### What Exists (Current Mockups)

**Created Mockups (7 total):**
1. [battle-transition.html](mockups/battle-transition.html) - Swirl effect
2. [equipment-screen.html](mockups/equipment-screen.html) - 4-slot gear UI
3. [rewards-screen.html](mockups/rewards-screen.html) - Post-battle rewards
4. [unit-collection.html](mockups/unit-collection.html) - Roster management
5. [battle-screen.html](mockups/battle-screen.html) - Combat UI
6. [djinn-menu.html](mockups/djinn-menu.html) - Djinn management
7. [overworld.html](mockups/overworld.html) - Vale Village

### Original Vision (From Architecture Docs)

**Golden Sun GBA Aesthetic Requirements:**
- **Resolution:** 240×160 GBA scaled 2×/3×/4× (integer scaling)
- **Color Palette:** Earth tones with elemental accents
  - Venus: #E8A050 (Orange/Earth)
  - Mars: #E05050 (Red/Fire)
  - Mercury: #5090D8 (Blue/Water)
  - Jupiter: #A858D8 (Purple/Wind)
- **Panels:** Semi-transparent dark blue `rgba(12, 16, 40, 0.85)` with 3D borders
- **Typography:** Press Start 2P font (authentic GBA pixel font)
- **Sprites:** Golden Sun battle sprites with drop shadows for grounding
- **Effects:** Psynergy animations, battle transitions, damage numbers

---

## Key Gaps Identified

### 1. Overworld Deviations

**Current Issues:**
- Generic grass background instead of Golden Sun's signature tiled terrain
- NPCs may be floating without proper grounding shadows
- Missing authentic building sprites from Golden Sun
- Dialogue boxes don't match GBA panel styling
- Camera viewport may not respect 240×160 ratio

**Original Vision:**
- Tiled grass terrain with path variations
- NPCs with circular drop shadows for grounding
- Buildings use Golden Sun's Vale architecture
- Dialogue boxes with authentic GBA 3D panel borders
- Fixed 240×160 viewport (scaled 4× = 960×640)

### 2. Battle Screen Improvements Needed

**Current Issues:**
- May use modern gradients instead of GBA-authentic colors
- Stat bars might not match Golden Sun's style
- Command menu layout could be more authentic
- Background might be generic instead of Golden Sun cave/field

**Original Vision:**
- Battle backgrounds from Golden Sun sprite library (72 backgrounds available)
- Turn order displayed as circular portraits (not text list)
- HP/PP bars with GBA green/blue gradients
- Command menu: 5 buttons horizontal (Fight/Psynergy/Djinn/Items/Flee)
- Semi-transparent panel overlays for readability

### 3. Equipment Screen Enhancements

**Current Issues:**
- May use generic icons instead of Golden Sun weapon sprites
- Stat comparison could be more visual
- 4-slot layout needs Golden Sun panel treatment

**Improvements Needed:**
- **Weapon sprites:** Use actual Golden Sun weapon sprites
- **Before/After arrows:** Show stat changes with up/down arrows in element colors
- **Equipment panel:** Each slot has 3D border with elemental glow when equipped
- **Stat preview:** Right panel shows full stats with color-coded changes
  - Green for stat increases
  - Red for stat decreases
  - Gold for ability unlocks

### 4. Djinn Menu Authenticity

**Current Issues:**
- May not match Golden Sun's signature 4-column Djinn layout
- Psynergy lists might not use authentic formatting
- Element color coding could be inconsistent

**Original Vision (From Reference Mockup):**
- **4-column grid:** Venus | Mars | Mercury | Jupiter
- **3 Djinn per column:** Tier 1, 2, 3 stacked vertically
- **Party portraits:** 2×2 grid in top-left corner
- **Set/Standby status:** Visual indicator (glowing = Set, dim = Standby)
- **Psynergy list:** Shows unlocked abilities per Djinn combo
- **Team slots:** 3 highlighted slots showing active Djinn
- **Element banners:** Each column has colored header with element symbol

### 5. Rewards Screen Polish

**Current Issues:**
- May be too plain without celebration effects
- XP/Gold display could be more dynamic
- Level-up notifications need fanfare

**Improvements:**
- **Victory fanfare:** Golden radial burst effect
- **XP counter:** Animated number roll-up effect
- **Level-up:** Large "LEVEL UP!" text with sparkles
- **New abilities:** Highlight unlocked abilities in gold
- **Item drops:** Show item sprites (not just names)
- **Unit recruitment:** If recruited, show portrait with celebration

### 6. Unit Collection Enhancements

**Current Issues:**
- May use placeholders instead of character portraits
- Bench layout could be more visual
- Active party selection might not be clear

**Improvements:**
- **Character portraits:** Use Golden Sun overworld sprites (front-facing)
- **Level badges:** Circle badge showing level number (1-5)
- **Element icons:** Small element symbol in corner
- **Active party:** 4 large slots with "ACTIVE" banner
- **Bench:** 6 smaller slots with "BENCH" label
- **Drag-and-drop zones:** Visual indicators for party swapping
- **Stats preview:** Hover shows full unit stats

### 7. Battle Transition Authenticity

**Current Issues:**
- Swirl effect may not match Golden Sun's signature spiral
- Color sequence might be generic
- Timing could be off

**Golden Sun Reference:**
- **4-circle spiral:** White → Gold → Blue → Orange
- **Rotation:** 1080° (3 full rotations)
- **Duration:** 1 second total
  - 0-800ms: Swirl expansion
  - 800-1000ms: Fade to black
- **Border shrink:** 8px → 4px → 1px as circles expand
- **Scale:** 0 → 10× expansion
- **Center point:** Middle of screen

---

## Improved Mockup Specifications

### MOCKUP 1: Authentic Overworld

**Filename:** `overworld-golden-sun-authentic.html`

**Key Features:**
```
┌─────────────────────────────────────┐
│  [Vale Village - Golden Sun Style]  │
│                                     │
│  🏠 Buildings with GS architecture  │
│  🧍 NPCs with circular shadows      │
│  🌿 Tiled grass terrain (not solid) │
│  💬 GBA-style dialogue panel        │
│  📍 Player sprite (Isaac)           │
│  🗺️  Minimap in corner               │
└─────────────────────────────────────┘
```

**Technical Specs:**
- **Viewport:** 960×640 (240×160 @ 4×)
- **Terrain:** Repeating grass tile sprite
- **Shadows:** CSS drop-shadow on all entities
- **Collision:** Invisible grid overlay
- **Camera:** Follows player, keeps centered

**Sprite Sources:**
- `/sprites/golden-sun/overworld/isaac/isaac_front.gif`
- `/sprites/golden-sun/overworld/npc/*.gif`
- `/sprites/golden-sun/terrain/grass_tile.png`
- `/sprites/golden-sun/buildings/vale/*.png`

---

### MOCKUP 2: Enhanced Battle Screen

**Filename:** `battle-screen-authentic.html`

**Layout Improvements:**
```
┌──────────────────────────────────────────────┐
│ [Isaac] HP ████████ 120/120  PP ████ 50/50  │ ← Top Stat Bar
│ [Garet] HP ████████ 115/115  PP ████ 45/50  │
├──────────────────────────────────────────────┤
│                                              │
│         🧌 Goblin (Enemy)                     │  ← Battle Area
│         HP: ████████ 80/80                    │
│                                              │
│                                              │
│  🧍Isaac   🧍Garet                            │  ← Party Area
│  HP:120    HP:115                            │
├──────────────────────────────────────────────┤
│  Turn Order: ⭕Isaac → ⭕Goblin → ⭕Garet     │ ← Turn Display
├──────────────────────────────────────────────┤
│ [Fight] [Psynergy] [Djinn] [Items] [Flee]   │ ← Command Menu
└──────────────────────────────────────────────┘
```

**Visual Enhancements:**
- **Background:** Golden Sun cave background (layered parallax)
- **Unit platforms:** Circular platforms under sprites
- **Turn order:** Circular portraits with element-colored borders
- **HP/PP bars:** GBA-authentic green/blue gradients
- **Panel backdrop:** Semi-transparent dark blue overlays
- **Damage numbers:** Floating with golden glow
- **Attack effects:** Screen shake + flash on hit

---

### MOCKUP 3: Polished Equipment Screen

**Filename:** `equipment-screen-polished.html`

**Layout:**
```
┌─────────────┬──────────────────────────┬─────────────────┐
│  UNITS      │  EQUIPMENT               │  STATS PREVIEW  │
│             │                          │                 │
│ ⭕ Isaac*    │   ⚔️  WEAPON             │ Isaac Lv 3      │
│ ⭕ Garet     │   [Long Sword]           │                 │
│ ⭕ Ivan      │   ATK: +15 ⬆️            │ HP:  120  ✓    │
│ ⭕ Mia       │                          │ ATK: 35   ⬆️+15 │
│             │   🛡️  ARMOR              │ DEF: 20   ⬆️+8  │
│ ○ Felix     │   [Iron Armor]           │ SPD: 12   ✓    │
│ ○ Jenna     │   DEF: +8, HP: +15 ⬆️    │                 │
│ ○ Sheba     │                          │ ABILITIES:      │
│ ○ Piers     │   ⛑️  HELM               │ • Attack        │
│ ○ Kraden    │   [Steel Helm]           │ • Ragnarok 🆕   │
│ ○ Kyle      │   DEF: +5 ⬆️             │ • Cure          │
│             │                          │                 │
│             │   👢 BOOTS               │                 │
│ [BACK]      │   [Hyper Boots]          │  [OPTIMIZE]     │
│             │   SPD: +3 ⬆️             │  [UNEQUIP ALL]  │
└─────────────┴──────────────────────────┴─────────────────┘
```

**Visual Details:**
- **Active unit:** Gold border + spotlight glow
- **Benched units:** Grayed out with dim opacity
- **Stat arrows:** Green up-arrows for increases
- **New ability:** Gold "NEW!" badge
- **Equipment slots:** 3D panel borders with elemental glow
- **Sprite icons:** Actual weapon/armor sprites from GS library

---

### MOCKUP 4: Djinn Menu (Authentic Layout)

**Filename:** `djinn-menu-authentic.html`

**Layout (4-Column Grid):**
```
┌────────────────────────────────────────────────────────┐
│  PARTY          VENUS    MARS     MERCURY   JUPITER    │
│                                                        │
│  🧍Isaac        🟠 Flint  🔴 Forge  🔵 Fizz   🟣 Gust   │
│  🧍Garet        HP +10   ATK +8   DEF +5    SPD +7    │
│  🧍Ivan         [SET]    [SET]    [SET]     [STBY]    │
│  🧍Mia                                                  │
│                 🟠 Granite 🔴 Fever 🔵 Sleet  🟣 Breeze │
│  TEAM SLOTS:    HP +15   ATK +12  DEF +8    SPD +10   │
│  [🟠][🔴][🔵]   [SET]    [STBY]   [SET]     [SET]     │
│                                                        │
│                 🟠 Quartz 🔴 Corona 🔵 Mist   🟣 Squall │
│  CLASS:         HP +20   ATK +15  DEF +12   SPD +12   │
│  Venus Adept    [STBY]   [SET]    [STBY]    [STBY]    │
│                                                        │
│  PSYNERGY:      ═══════════════════════════════════    │
│  • Ragnarok     UNLOCKED ABILITIES:                    │
│  • Earthquake   • Ragnarok (Venus)                     │
│  • Cure         • Earthquake (Venus)                   │
│                 • Volcano (Mars)                       │
│  [BACK]         • Cure Wave (Mercury)                  │
└────────────────────────────────────────────────────────┘
```

**Visual Features:**
- **Element colors:** Venus=#E8A050, Mars=#E05050, Mercury=#5090D8, Jupiter=#A858D8
- **Set status:** Glowing border with pulsing animation
- **Standby status:** Dim with 50% opacity
- **Team slots:** 3 circular slots with active Djinn displayed
- **Class display:** Shows current class based on Djinn combo
- **Synergy bonuses:** Displays combined stat bonuses
- **Psynergy list:** Shows all unlocked abilities with element icons

---

### MOCKUP 5: Victory Rewards Screen

**Filename:** `rewards-screen-celebration.html`

**Layout:**
```
┌────────────────────────────────────────────┐
│                                            │
│           ⭐ VICTORY! ⭐                     │
│           ✨✨✨✨✨✨✨                         │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  XP GAINED:    +250 ⬆️                │  │
│  │  💰 Gold:      +120 coins             │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  🎁 ITEMS FOUND:                      │  │
│  │                                       │  │
│  │  ⚔️  Broad Sword  (Weapon)            │  │
│  │  🧪 Potion x2                         │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  📈 LEVEL UP!                         │  │
│  │                                       │  │
│  │  Isaac   Lv 2 → Lv 3  ⭐              │  │
│  │  HP +15  ATK +3  DEF +2  SPD +1      │  │
│  │                                       │  │
│  │  🆕 NEW ABILITY: Ragnarok             │  │
│  └──────────────────────────────────────┘  │
│                                            │
│              [CONTINUE]                    │
└────────────────────────────────────────────┘
```

**Animations:**
- **Victory text:** Pulse scale 1 → 1.05
- **Sparkles:** 20 rising particles (gold gradient)
- **XP counter:** Roll-up animation from 0 → 250
- **Level-up:** Flash effect + fanfare
- **New ability:** Slide in from right with glow

---

### MOCKUP 6: Unit Collection (Roster View)

**Filename:** `unit-collection-roster.html`

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  ACTIVE PARTY (4/4)                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ 🧍Isaac │ │ 🧍Garet │ │ 🧍Ivan  │ │ 🧍Mia   │    │
│  │ Lv 3    │ │ Lv 3    │ │ Lv 2    │ │ Lv 2    │    │
│  │ 🟠Venus │ │ 🔴Mars  │ │ 🟣Jupi. │ │ 🔵Merc. │    │
│  │ 120 HP  │ │ 115 HP  │ │ 95 HP   │ │ 100 HP  │    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│                                                      │
│  BENCH (6/6)                                         │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│  │Felix│ │Jenna│ │Sheba│ │Piers│ │Kraden│ │Kyle│    │
│  │Lv 2 │ │Lv 2 │ │Lv 1 │ │Lv 3 │ │Lv 1 │ │Lv 2 │    │
│  │🟠   │ │🔴   │ │🟣   │ │🔵   │ │🟠   │ │🔴   │    │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘          │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │  UNIT DETAILS: Isaac                        │    │
│  │                                              │    │
│  │  Level: 3        Element: Venus (Earth)     │    │
│  │  Class: Squire → Earth Adept                │    │
│  │                                              │    │
│  │  HP:  120/120    PP:  50/50                 │    │
│  │  ATK: 35         DEF: 20        SPD: 12     │    │
│  │                                              │    │
│  │  ABILITIES:                                  │    │
│  │  • Attack (Physical)                        │    │
│  │  • Ragnarok (Venus Psynergy, 15 PP)         │    │
│  │  • Cure (Mercury Psynergy, 7 PP)            │    │
│  │                                              │    │
│  │  EQUIPMENT:                                  │    │
│  │  ⚔️  Long Sword (+15 ATK)                    │    │
│  │  🛡️  Iron Armor (+8 DEF, +15 HP)            │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  [SWAP PARTY]  [EQUIP]  [BACK]                      │
└──────────────────────────────────────────────────────┘
```

**Features:**
- **Drag zones:** Visual drop targets for party swapping
- **Element badges:** Color-coded circular badges
- **Level indicators:** Circle with number
- **Hover effect:** Shows full stats on mouseover
- **Selected unit:** Gold glow border
- **Portraits:** Authentic Golden Sun character sprites

---

### MOCKUP 7: Battle Transition (Spiral Swirl)

**Filename:** `battle-transition-spiral.html`

**Animation Sequence:**
```css
/* Stage 1: Swirl (0-800ms) */
.swirl-circle-1 { /* White */
  animation: expand-rotate 800ms ease-out;
  border: 8px solid rgba(255, 255, 255, 0.9);
}

.swirl-circle-2 { /* Gold */
  animation: expand-rotate 800ms ease-out 100ms;
  border: 6px solid rgba(255, 215, 127, 0.8);
}

.swirl-circle-3 { /* Blue */
  animation: expand-rotate 800ms ease-out 200ms;
  border: 4px solid rgba(80, 144, 216, 0.7);
}

.swirl-circle-4 { /* Orange */
  animation: expand-rotate 800ms ease-out 300ms;
  border: 2px solid rgba(232, 160, 80, 0.6);
}

@keyframes expand-rotate {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  80% {
    transform: scale(10) rotate(1080deg);
    opacity: 0.5;
  }
  100% {
    transform: scale(10) rotate(1080deg);
    opacity: 0;
  }
}

/* Stage 2: Fade to black (800-1000ms) */
.fade-to-black {
  animation: fade-in 200ms ease-in 800ms forwards;
  background: #000;
}
```

**Technical Details:**
- **4 circles:** Concentric expansion from center
- **Rotation:** 1080° (3 full spins)
- **Delay stagger:** 100ms between each circle
- **Border shrink:** Width decreases as scale increases
- **Easing:** ease-out for natural deceleration
- **Center point:** Center of viewport

---

## Color Palette Reference

### Element Colors (Golden Sun Authentic)
```css
:root {
  /* Primary Elements */
  --venus-gold: #E8A050;      /* Earth/Orange */
  --mars-red: #E05050;        /* Fire/Red */
  --mercury-blue: #5090D8;    /* Water/Blue */
  --jupiter-purple: #A858D8;  /* Wind/Purple */

  /* UI Colors */
  --text-primary: #F8F8F0;    /* White */
  --text-gold: #FFD87F;       /* Gold */
  --bg-dark: #0F2550;         /* Dark blue */
  --bg-panel: #1A3560;        /* Panel blue */
  --border-light: #4A7AB8;    /* Light edge (top-left) */
  --border-dark: #0F2550;     /* Dark edge (bottom-right) */
  --border-highlight: #FFD87F; /* Focus/active */

  /* Status Colors */
  --hp-green: #57E2A6;        /* HP bar */
  --pp-blue: #5090D8;         /* PP bar */
  --damage-red: #FF4444;      /* Damage numbers */
  --heal-green: #44FF44;      /* Heal numbers */
  --critical-gold: #FFD700;   /* Critical hits */
  --ko-red: #FF3030;          /* K.O. indicator */
}
```

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

:root {
  --font-primary: 'Press Start 2P', monospace;
  --font-fallback: 'Courier New', monospace;

  /* Font Sizes (GBA Scale) */
  --font-size-xs: 8px;   /* Small labels */
  --font-size-sm: 10px;  /* UI text */
  --font-size-md: 12px;  /* Headers */
  --font-size-lg: 16px;  /* Titles */
  --font-size-xl: 24px;  /* Victory/Defeat */
}
```

---

## Implementation Priority

### Phase 1: Critical Authenticity (High Priority)
1. **Battle Screen** - Most visible, needs GS backgrounds
2. **Overworld** - Entry point, sets tone
3. **Djinn Menu** - Signature GS feature

### Phase 2: Polish & Feel (Medium Priority)
4. **Rewards Screen** - Celebration needs impact
5. **Equipment Screen** - Stat visualization
6. **Battle Transition** - Authentic spiral effect

### Phase 3: UX Refinement (Lower Priority)
7. **Unit Collection** - Roster management clarity

---

## Next Steps

### Option 1: Create Improved HTML Mockups
Generate 7 new HTML files with authentic Golden Sun styling

### Option 2: Create Visual Design Guide
Document for graphics integrator with sprite references

### Option 3: Both
Complete mockups + integration guide

---

**Recommendation:** Start with **Battle Screen** and **Djinn Menu** as they're the most signature Golden Sun elements and will set the visual standard for all other screens.
