# 🎨 VALE CHRONICLES - MOCKUP INVENTORY

**Approved Reference Mockups for Development**

---

## ✅ **APPROVED MOCKUPS (Use These!)**

### **MOCKUP 1: VALE VILLAGE OVERWORLD**

**Location:** `MetaPrompt/golden-sun/mockups/vale-village.html`  
**Also Available:** `c:\Users\gxpai\Desktop\New folder (5)\` (if you have access)

**What It Shows:**
- ✅ 16 NPCs positioned throughout village
- ✅ 7 Buildings (Isaac's House, Elder's House, Item Shop, Armor Shop, Inn, Kraden's Study, Garet's House)
- ✅ Dirt paths (yellow roads connecting areas)
- ✅ Grass background (gradient: light → dark green)
- ✅ Vale Gate (ornate archway at bottom)
- ✅ Dialogue box (Garet example)
- ✅ Player sprite (Isaac in center)

**Use For:**
- Overworld exploration system
- NPC positioning reference
- Dialogue box design
- Scene layout
- Camera viewport size

**Design Tokens:** `mockups/tokens.css` + `mockups/overworld.css`

**Sprite Map:** `mockups/sprite_map.json`

---

### **MOCKUP 2: DJINN MENU**

**Location:** `c:\Users\gxpai\Desktop\New folder (5)\djinn-menu.html`

**What It Shows:**
- ✅ Top-left: 4 party portraits (Isaac, Garet, Ivan, Mia) in 2×2 grid
- ✅ Top-right: Return button panel
- ✅ Main panel: 4 Djinn columns (Flint/Venus, Fizz/Mercury, Forge/Mars, Gust/Jupiter)
- ✅ Element color coding (Orange, Blue, Red, Purple)
- ✅ Psynergy ability lists (5-6 abilities per Djinn)
- ✅ Dark blue panels with 3D borders
- ✅ Authentic Golden Sun UI aesthetic

**Use For:**
- Djinn equipment screen
- Team Djinn slot management (3 slots to highlight)
- Element color coding system
- Panel design pattern
- Psynergy list styling

**Design Tokens:** `djinn-menu-tokens.css`

**Sprite Map:** `djinn-menu-sprite-map.json`

---

### **MOCKUP 3: BATTLE SCREEN**

**Location:** `c:\Users\gxpai\Desktop\New folder (5)\golden-sun-battle.html`

**What It Shows:**
- ✅ Real Golden Sun cave background (rocky cave with water)
- ✅ Turn order pills at top (Ally, Enemy, Ally, Enemy)
- ✅ 3 Enemy sprites (Goblin, Wolfkin, Battle icon) with platforms
- ✅ 4 Party sprites at bottom (Isaac, Garet, Mia, Ivan) with platforms
- ✅ Combat log ("Isaac strikes Goblin for 25 HP!")
- ✅ Command menu (Fight, Psynergy, Djinn, Items, Flee)
- ✅ Semi-transparent panels

**Use For:**
- Battle screen layout
- Enemy/party positioning
- Turn order display
- Combat log design
- Command menu design
- Background integration
- Platform shadows

**Design Tokens:** `tokens.css` + `battle.css`

**Sprite Map:** `sprite_map.json`

---

## ❌ **REJECTED MOCKUPS (Don't Use These!)**

**Location:** `MetaPrompt/mockup-examples/` (PR #24)

**Why Rejected:**
- ❌ Units standing on nothing (no grounding)
- ❌ Random objects (boats in wrong places)
- ❌ Everything pushed to center (bad layout)
- ❌ Poor visual hierarchy
- ❌ Bad examples of composition

**Files to Ignore:**
- `mockup-examples/golden-sun-battle/screens/psynergy-menu.html` ❌
- `mockup-examples/golden-sun-battle/screens/djinn-board.html` ❌
- `mockup-examples/overworld-village/overworld-village.html` ❌
- `mockup-examples/overworld-ice-cave/` ❌
- `mockup-examples/overworld-temple/` ❌
- `mockup-examples/overworld-palace/` ❌

---

## 🆕 **MOCKUPS STILL NEEDED**

**Graphics Phase 1 Must Create:**

### **1. Equipment Screen**
**Requirements:**
- Unit selector (show all collected units 1-10)
- 4 equipment slots (Weapon, Armor, Helm, Boots)
- Stat comparison (before/after equip)
- Equipment inventory list
- Golden Sun panel styling (copy from Djinn menu)

**Reference Pattern:** Copy panel layout from Djinn menu

---

### **2. Unit Collection Screen**
**Requirements:**
- All collected units displayed (up to 10)
- Level indicators per unit
- Active party selector (highlight 4 chosen units)
- Bench vs Active visual distinction
- Stats preview on hover/select

**Reference Pattern:** Grid layout like Djinn menu, panels like Battle screen

---

### **3. Rewards Screen**
**Requirements:**
- XP gained display
- Money gained display
- Items/equipment dropped
- Unit recruited announcement (if applicable)
- Level up notification with sparkles
- "Continue" button

**Reference Pattern:** Center panel with celebration visual, copy fonts/colors from existing mockups

---

### **4. Battle Swirl Transition**
**Requirements:**
- Mockup showing transition sequence:
  1. Overworld screenshot
  2. Swirl effect (spiral graphic)
  3. Fade to black
  4. Battle screen fade-in
- CSS animation defined
- Timing: ~1 second total

**Reference Pattern:** CSS @keyframes animation example

---

## 📁 **MOCKUP FILE LOCATIONS**

### **Primary Sources (APPROVED):**

```
c:\Users\gxpai\Desktop\New folder (5)\
├── djinn-menu.html ✅
├── djinn-menu.css ✅
├── djinn-menu-tokens.css ✅
├── golden-sun-battle.html ✅
├── battle.css ✅
├── tokens.css ✅
└── assets/ ✅

c:\Dev\AiGames\Zzzzzzzzz\MetaPrompt\golden-sun\mockups\
├── vale-village.html ✅
├── overworld.css ✅
├── tokens.css ✅
├── sprite_map.json ✅
└── assets/ ✅
```

### **Rejected Sources (IGNORE):**

```
c:\Dev\AiGames\Zzzzzzzzz\MetaPrompt\mockup-examples\
└── [All subdirectories] ❌ DON'T USE
```

---

## 🎨 **DESIGN SYSTEM (From Approved Mockups)**

### **Color Palette:**

```css
/* From djinn-menu-tokens.css and tokens.css */

/* Element Colors */
--venus-color: #E8A050;      /* Earth/Orange */
--mars-color: #E05050;       /* Fire/Red */
--mercury-color: #5090D8;    /* Water/Blue */
--jupiter-color: #A858D8;    /* Wind/Purple */

/* UI Colors */
--text-primary: #F8F8F0;     /* White */
--text-gold: #FFD87F;        /* Gold */
--bg-dark: #0F2550;          /* Dark blue */
--bg-panel: rgba(12, 16, 40, 0.85);  /* Semi-transparent panel */
--border-light: #4A7AB8;     /* 3D border light edge */
--border-dark: #0F2550;      /* 3D border dark edge */

/* Grass (Overworld) */
--grass-light: #88C070;
--grass-mid: #68A050;
--grass-dark: #48A038;

/* Paths (Overworld) */
--path-color: #D4B896;
```

### **Spacing System:**

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 12px;
--space-lg: 16px;
--space-xl: 24px;
--space-xxl: 32px;
```

### **Z-Index Layers:**

```css
--z-background: 0;
--z-ground: 1;
--z-scenery: 5;
--z-entity-shadow: 9;
--z-entity: 10;
--z-ui: 50;
--z-dialogue: 60;
--z-modal: 100;
```

### **Typography:**

```css
--font-primary: 'Press Start 2P', monospace; /* GBA-style font */
--font-size-xs: 8px;
--font-size-sm: 10px;
--font-size-md: 12px;
--font-size-lg: 14px;
```

### **Timing:**

```css
--timing-fast: 150ms;
--timing-normal: 300ms;
--timing-slow: 500ms;
--timing-dialog: 50ms;  /* Text reveal speed */
```

---

## 🎯 **HOW TO USE THIS INVENTORY**

### **For Graphics Phase 1 (Mockup):**

1. **Study the 3 approved mockups**
2. **Extract design patterns** (panels, colors, spacing)
3. **Create 4 new mockups** (equipment, collection, rewards, transition)
4. **Use same design tokens** (copy from approved mockups)
5. **Maintain consistency** (same fonts, colors, borders, spacing)

### **For Graphics Phase 2 (Integration):**

1. **Convert approved mockups to React**
2. **Follow the exact layouts** (pixel-perfect conversion)
3. **Reuse design token CSS** (import into React app)
4. **Wire up game state** (props, callbacks, state management)

### **For Coder (Implementation):**

1. **Reference mockups for UI structure**
2. **Use sprite maps for asset paths**
3. **Follow layout constraints** (panel sizes, viewport dimensions)
4. **Don't guess UI - follow mockups exactly**

---

## ✅ **QUALITY CHECKLIST**

**Every mockup must have:**

- [ ] HTML/CSS only (no JavaScript in Phase 1)
- [ ] Design tokens CSS file
- [ ] Sprite map JSON
- [ ] MOCKUP_APPROVED.md document
- [ ] Screenshot/visual evidence
- [ ] WCAG 2.1 AA accessible (keyboard nav, ARIA, contrast)
- [ ] Matches Golden Sun aesthetic
- [ ] Proper entity grounding (shadows, platforms)
- [ ] Clean layout (not everything pushed to center)
- [ ] Realistic composition (no random objects)

---

## 📊 **MOCKUP STATUS TRACKER**

| Mockup | Status | Location | Quality |
|--------|--------|----------|---------|
| Vale Village Overworld | ✅ APPROVED | `mockups/vale-village.html` | Excellent |
| Djinn Menu | ✅ APPROVED | `New folder (5)/djinn-menu.html` | Excellent |
| Battle Screen | ✅ APPROVED | `New folder (5)/golden-sun-battle.html` | Excellent |
| Equipment Screen | 🆕 NEEDED | TBD | - |
| Unit Collection | 🆕 NEEDED | TBD | - |
| Rewards Screen | 🆕 NEEDED | TBD | - |
| Battle Transition | 🆕 NEEDED | TBD | - |

---

## 🚀 **READY FOR MOCKUP CREATION!**

**Graphics Phase 1 can now:**
- Reference 3 approved mockups
- Copy design patterns
- Create 4 new mockups
- Maintain visual consistency
- Avoid bad mockup practices (from PR #24 examples)

**Total Mockups Needed:** 7 (3 done, 4 to create)

---

**Updated:** November 2, 2025  
**Next Step:** Graphics Phase 1 creates remaining 4 mockups

