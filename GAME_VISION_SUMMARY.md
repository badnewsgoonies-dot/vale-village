# 🎮 VALE CHRONICLES - GAME VISION & MECHANICS SUMMARY

**Last Updated:** November 5, 2025
**Purpose:** Align AI sessions on game vision and UI requirements

---

## 🎯 CORE VISION

**Elevator Pitch:**
A Golden Sun-inspired RPG where you explore Vale Village (one big map), battle NPCs for XP/gold, unlock allies through story progression, collect elemental Djinn for class changes, and defeat an ancient demon sealed beneath Sol Sanctum.

**Inspiration:**
- **Golden Sun** - Overworld exploration, Djinn system, elemental Psynergy
- **NextEraGame** - Turn-based tactical combat, party management
- **GBA Aesthetic** - Authentic sprite-based graphics, 240x160 resolution feel

**Scope:**
8-15 hour RPG with 10 recruitable units, 12 Djinn to collect, and multiple story paths

---

## 🎭 CORE GAMEPLAY LOOP

```
1. EXPLORE Vale Village (one big town map)
   ↓
2. TALK to NPCs → Dialogue → Choose to Battle (optional)
   ↓
3. WIN Battle → Earn XP/Gold
   ↓
4. EQUIP Gear & Djinn
   ↓
5. LEVEL UP Units (1-20/30, unlock spells)
   ↓
6. UNLOCK new units through story progression
   ↓
7. REPEAT until strong enough
   ↓
8. DEFEAT Nox Typhon (Final Boss)
```

---

## 🔑 CORE SYSTEMS

### 1. **Overworld Exploration**
- **Style:** Pseudo-3D with depth and layered heights (like Golden Sun's perspective)
- **Movement:** WASD/Arrow keys, 8-directional
- **Interaction:** Space key to talk to NPCs, enter buildings
- **Areas:** **ONE BIG MAP - Vale Village only** (no separate areas)
- **NPCs:** 29 total positioned around town
- **NO treasure chests** - Gameplay is purely town exploration + NPC battles

### 2. **NPC Battle System** ⭐ KEY FEATURE
- **29 NPCs** each have dialogue + optional battle encounters
- Press **Space** near NPC → Dialogue opens → **NPC ASKS if you want to fight**
  - Choose YES → Start Battle
  - Choose NO → Continue dialogue (plot/lore content)
- Battles are for XP/gold, **NOT recruitment**
- Examples:
  - **Mayor** → 3 Goblins (boss-level)
  - **Young Sarah** → 1 Slime (tutorial-level)
  - **Sage Aldric** → 1 Wolf + 1 Goblin + 1 Slime (hard)

### 3. **Turn-Based Combat**
- **Party:** 1-4 active units from your collection
- **Turn Order:** Speed-based
- **Actions:** Attack, Psynergy (abilities), Djinn, Defend
- **Win Condition:** Defeat all enemies
- **Lose Condition:** All party members KO'd
- **Backgrounds:** Authentic GBA backgrounds **behind** the battlefield
  - ⚠️ **CURRENT ISSUE:** Backgrounds cover entire screen, looks awkward
  - **CORRECT:** Background should be layered behind battle units, not full-screen

### 4. **Unit System**
- **10 Total Units**
- **1 Starter:** Choose Isaac, Garet, OR Ivan at game start
- **9 Unlockable:** Unlock through story progression at key moments
  - The other 2 starters (if not chosen)
  - Mia (Water), Felix (Earth), Jenna (Fire), Sheba (Wind), Piers (Water), Kraden (Support), Kyle (Fire)
- **Levels:** 1-20 or 1-30 (many spell unlocks as you progress)
- **Party Size:** Max 4 active, rest on bench
- **Bench System:** Swap units between battles
- **Recruitment:** Story-driven unlocks at key moments, **NOT "defeat NPC to recruit"**

### 5. **Djinn System** ⭐ UNIQUE MECHANIC
- **12 Djinn Total:** 3 Venus, 3 Mars, 3 Mercury, 3 Jupiter
- **3 Team Slots:** Equip up to 3 Djinn globally
- **Passive Mode:** Stat boosts + class changes when equipped
- **Active Mode:** Unleash in battle for powerful attack
  - Temporarily lose passive bonus
  - Djinn recovers after 2 turns
- **Synergy:** All same element = specialization, Mixed = hybrid class
- **Example:** 3 Venus Djinn = "Venus Adept" + Earthquake ability

### 6. **Equipment System**
- **4 Slots:** Weapon, Armor, Helm, Boots
- **Effects:** Stat boosts (ATK, DEF, SPD), some unlock abilities
- **Acquisition:** Buy from shops, earn from battles (drops)
- **NO ITEMS:** Design decision - no consumables (potions, herbs, etc.)
- **NO Treasure Chests:** Simplified loot system - shops and battle rewards only

### 7. **Progression**
- **XP System:** Gain XP from battles → Level up
- **Level 1 → 20-30:** Many spell unlocks as you progress
- **Abilities:** Unlock new Psynergy spells at various levels
- **Example (Garet):**
  - Lv1: Basic Attack
  - Lv3: Flame Burst
  - Lv7: Fire Shield
  - Lv12: Blazing Strike
  - Lv18: Volcano
  - Lv25: [Ultimate Fire Spell]
- **Impact:** Early levels lose to late-game encounters, progression matters

### 8. **Healing & Resources**
- **NO Consumable Items** (key design decision!)
- **In Battle:** Mercury Psynergy (Ply, Wish, Glacial Blessing)
- **Out of Battle:**
  - Auto-restore PP (magic) after each battle
  - Inn: 10 gold for full HP/PP restore
- **Why:** Makes healers essential, PP management strategic

---

## ⚠️ CRITICAL CORRECTIONS TO OLD DOCS

**The following have changed from original planning docs:**

1. ✅ **ONE BIG MAP** - Vale Village only (no Forest Path, Ancient Ruins as separate areas)
2. ✅ **NO Treasure Chests** - Shops and battle rewards only
3. ✅ **1 Starter Unit** - Pick one of Isaac/Garet/Ivan (not all 3)
4. ✅ **Level 1-20/30** - NOT 1-5 as in old docs
5. ✅ **Story-driven recruitment** - NOT "defeat NPC to recruit"
6. ✅ **Battle backgrounds issue** - Currently full-screen, should be layered behind
7. ✅ **NPC dialogue choice** - Ask if player wants to fight (not instant battle)

**Always prioritize THIS document over old planning docs!**

---

## 🎨 UI SCREENS

### Main Flow
```
TITLE SCREEN
    ↓
INTRO (Story cutscene)
    ↓
OVERWORLD ←──┐ (Main Hub)
    │        │
    ├→ Main Menu (ESC key)
    │   ├→ Djinn Screen
    │   ├→ Equipment Screen
    │   ├→ Party Management
    │   └→ Quest Log
    │        │
    ├→ NPC Dialogue (Space)
    │        │
    ├→ Shop Screen (at shops)
    │        │
    └→ BATTLE (NPC trigger)
         ↓
    REWARDS SCREEN
         ↓
    (Back to Overworld)
```

### Screen Details

**1. Overworld** (Main Hub)
- **Pseudo-3D perspective** with depth and layered heights
- **One big town map** - Vale Village only
- Player character sprite
- 29 NPCs positioned around village
- Buildings, trees, scenery (all authentic GS sprites)
- Dialogue box at bottom when talking
- Controls overlay (can toggle)
- **NO treasure chests** on map

**2. Battle Screen**
- **Background:** Location-specific (Cave.gif, Forest.gif, etc.)
  - ⚠️ **CRITICAL ISSUE:** Background should be BEHIND units, not full-screen
  - Current implementation covers entire screen - looks awkward
  - Need to layer: Background → Units → UI
- **Enemy Row:** Top of screen (animated sprites)
- **Party Row:** Bottom of screen (4 slots max)
- **Command Menu:** Attack / Psynergy / Djinn / Defend
- **Combat Log:** Shows actions/damage
- **Turn Order:** Visual indicator
- **Effects:** Screen shake, flash, damage numbers

**3. Equipment Screen**
- **Left:** Unit list (click to switch)
- **Center:** 4 equipment slots (Weapon/Armor/Helm/Boots)
- **Right:** Stat preview (ATK: +10, DEF: +5, etc.)
- **Bottom:** Inventory (unequipped items)
- **Icons:** Authentic GS equipment icons

**4. Djinn Screen**
- **4-Column Grid:** Venus, Mars, Mercury, Jupiter
- **Party Portraits:** Show who has which Djinn equipped
- **Djinn Cards:** Click to equip/unequip
- **Psynergy Lists:** Update when Djinn change
- **Element Color Coding:** Brown/Red/Blue/Purple

**5. Unit Collection (Party Management)
- **Total Units:** 10 (1 starter + 9 unlockable through story)
- **Active Party (4 max):** Top row with checkmarks
- **Bench (6):** Bottom row
- **Click to Toggle:** Active ↔ Bench
- **Unit Cards:** Portrait, name, level (up to 20-30), element
- **View Equipment Button:** Opens Equipment for selected unit
- **Unlock System:** Units unlock at key story moments (not by defeating NPCs)

**6. Main Menu** (NEW - ESC key)
- **Options:**
  - Djinn (manage Djinn)
  - Equipment (equip items)
  - Party (manage active party)
  - Quest Log (view objectives)
  - Return (back to game)
- **Style:** Golden Sun menu aesthetic

**7. Quest Log**
- **Quest List:** In Progress, Not Started, Complete
- **Details:** Objective text, current progress
- **Simple:** No complex quest tracking
- **Q Key:** Quick access from overworld

**8. Shop Screen**
- **Tabs:** BUY / SELL
- **Equipment Only:** No consumables!
- **Gold Display:** Current balance
- **Item List:** Name, price, stats
- **Shopkeeper Dialogue:** Top of screen

**9. Rewards Screen**
- **Gold Earned:** Animation counting up
- **XP Earned:** Animation counting up
- **Equipment Drops:** Show any equipment earned (no items/consumables)
- **Level Up:** Special celebration if leveled
  - Show new stats
  - Show new Psynergy spell unlocked (if any at this level)
  - Sparkle effects
  - Multiple level-ups possible (level range 1-20/30)
- **Continue Button:** Return to overworld

**10. Battle Transition**
- **Swirl Effect:** 1 second animation
- **Save Overworld State:** Remember position
- **Load Battle:** With NPC's team
- **Return After:** Back to same spot

---

## 📖 STORY STRUCTURE

### Three Acts

**Act 1: The Proving Ground** (2-3 hours)
- Start in Vale Village (one big map)
- Choose starter: Isaac, Garet, OR Ivan
- Complete tutorial battles with NPCs
- Unlock first few story units
- Learn about weakening seal at Sol Sanctum
- Complete Elder's trials
- Collect first 2-3 Djinn
- Level up to ~8-10

**Act 2: The Gathering Storm** (4-5 hours)
- Investigate Sol Sanctum (within Vale map)
- Discover Nox Typhon (ancient demon)
- Battle tougher NPCs in Vale Village
- Unlock mid-game units through story events
- Collect 6-8 Djinn total
- Learn true nature of threat
- Level up to ~15-20

**Act 3: The Final Stand** (2-3 hours)
- Final preparations (battle endgame NPCs)
- Unlock remaining units through story (optional)
- Collect final Djinn (optional)
- Seal breaks - Nox Typhon escapes!
- Final boss battle (3 phases)
- Ending (Standard or True based on completion)
- Max level: 20-30

### Character Arcs
- **Isaac:** Living up to father's legacy
- **Garet:** Learning heart over strength
- **Mia:** Burden of healing
- **Felix:** Redemption for past failure
- (All 10 units have arcs)

### Endings
- **Standard:** Defeat boss with minimum requirements
- **True:** All 10 units, all 12 Djinn, Level 8+
  - Extra scenes
  - Choice: Continue adventuring OR peaceful ending

---

## 🎯 UI REQUIREMENTS FOR GRAPHICS WORK

### What Graphics Needs to Support

**1. Authentic GBA Sprite Aesthetic**
- 240x160 screen feel (scaled up)
- Pixel-perfect sprite rendering
- No anti-aliasing on sprites
- Authentic color palette

**2. Sprite Integration**
- **2500+ Golden Sun sprites** already sourced
- Equipment icons: `/sprites/icons/items/`
- Battle units: `/sprites/battle/party/`
- Enemies: `/sprites/battle/enemies/`
- Djinn: `/sprites/battle/djinn/`
- Backgrounds: `/sprites/backgrounds/gs1/`
- Buildings: `/sprites/scenery/buildings/`
- All paths are documented in sprite registry

**3. Key UI Elements**
- **Golden Sun Font:** Monospace, bold, pixel-perfect
- **Panel Borders:** Authentic GS menu borders (wood texture)
- **Buttons:** GBA-style with hover states
- **Stat Bars:** HP (green), PP (blue), XP (yellow)
- **Element Icons:** Venus (brown rock), Mars (red flame), Mercury (blue drop), Jupiter (purple bolt)

**4. Animation Requirements**
- Battle sprites have 7 animations: Front, Back, Attack1, Attack2, CastFront1, CastBack1, DownedFront
- Damage numbers: Float up and fade
- Screen shake: On heavy hits
- Flash effect: When hit
- Swirl transition: Battle enter/exit
- Sparkles: Level up, Djinn activation
- Victory pose: After battle win

**5. Responsive Layout**
- Must work at various resolutions
- Scale up from 240x160 base
- Maintain aspect ratio
- Touch-friendly for mobile (future)

**6. Accessibility**
- Color-blind friendly mode (optional)
- High contrast mode (optional)
- Large text option (optional)
- Keyboard navigation (required)
- Screen reader hints (future)

---

## 🚫 WHAT'S NOT IN THE GAME

**Explicitly Removed/Not Included:**
- ❌ **Consumable Items** (potions, herbs) - healing via abilities only
- ❌ **Treasure Chests** - simplified loot (shops + battle drops only)
- ❌ **Multiple Areas** - one big Vale Village map only
- ❌ **3 Starting Characters** - pick 1 starter, unlock the rest
- ❌ **Low Level Cap** - NOT 1-5, game has 20-30 levels
- ❌ **Defeat-to-Recruit** - story unlocks units, not NPC battles
- ❌ **Instant Battle Triggers** - NPCs ask if you want to fight
- ❌ Item menu in battle
- ❌ Random encounters (all battles are NPC-triggered)
- ❌ Multiplayer/PvP
- ❌ Complex crafting system
- ❌ Voice acting (text only)
- ❌ Real-time combat (turn-based only)

---

## ✅ CURRENT IMPLEMENTATION STATUS

**Completed:**
- ✅ Battle system (turn-based combat working)
- ✅ 29 NPC battle triggers
- ✅ Equipment system (4 slots)
- ✅ Menu navigation (all screens)
- ✅ Sprite registry (2500+ sprites loaded)
- ✅ Battle backgrounds (72 authentic GBA backgrounds)
- ✅ Equipment icons integration
- ✅ Main menu (ESC key)
- ✅ Quest log system
- ✅ Shop system (equipment only)
- ✅ Overworld exploration
- ✅ Dialogue system

**In Progress/Needs Work:**
- 🔄 Djinn system (mechanics designed, needs full implementation)
- 🔄 Level progression (1-5 with ability unlocks)
- 🔄 Unit recruitment flow
- 🔄 Save/Load system
- 🔄 Story cutscenes
- 🔄 Boss battles (Nox Typhon phases)
- 🔄 Ending sequences

**Not Started:**
- 🆕 Sound effects & music
- 🆕 Particle effects polish
- 🆕 Tutorial system
- 🆕 Achievement system (optional)
- 🆕 New Game+ (optional)

---

## 🎨 GRAPHICS WORK PRIORITIES

### Current Focus: **Battle Screen Visual Polish**

**What Needs Attention:**

### 🔥 **PRIORITY #1: Fix Battle Background Layering**
   - ⚠️ **CRITICAL BUG:** Backgrounds currently cover entire screen (looks awkward)
   - **Correct Behavior:** Background should be BEHIND battle units
   - **Layering:** Background layer → Unit sprites → UI elements
   - **Reference:** Look at actual Golden Sun battles - background is behind, not full-screen
   - ✅ Already have 72 authentic GBA backgrounds
   - ❓ Need to fix CSS/component structure to layer properly

### 2. **Battle Backgrounds (after layering fix)**
   - ❓ Verify all load correctly
   - ❓ Add fallback for missing backgrounds

3. **Unit Sprites in Battle**
   - ✅ Sprite paths defined
   - ✅ Animation system exists
   - ❓ Verify 1 starter + 9 unlockable units have complete sprite sets
   - ❓ Test animation transitions (7 animations per unit)
   - ❓ Add sprite error handling
   - ❓ Ensure sprites render properly with new background layering

4. **Enemy Sprites**
   - ✅ Enemy sprites exist (Slime, Wolf, Goblin)
   - ❓ Need Nox Typhon boss sprite
   - ❓ Verify enemy positioning looks correct with new background layering

5. **UI Polish**
   - Command menu styling (authentic GS look)
   - Combat log readability
   - Damage numbers (size, color, animation)
   - Turn order indicator clarity
   - Status effect icons
   - Level up celebration (for levels 1-20/30)

6. **Effects & Juice**
   - Screen shake on hits (exists but tune intensity)
   - Flash effect (exists but verify)
   - Djinn activation sparkles
   - Psynergy cast animations (fire, water, earth, wind)
   - Victory fanfare animation
   - Unit unlock celebration (story-driven unlocks)

7. **Overworld Polish**
   - Ensure pseudo-3D depth/layering looks correct
   - Verify NPC positioning in one big Vale map
   - Remove any treasure chest UI elements
   - Polish dialogue boxes (choice UI for "Want to fight?")

8. **Responsive Testing**
   - Test on different screen sizes
   - Verify sprite scaling
   - Check touch targets (future mobile)

---

## 🗣️ COMMON PITFALLS TO AVOID

### For AI Sessions Working on Graphics:

1. **Don't Add Features Outside Vision**
   - Stick to the documented systems
   - No complex crafting, no multiplayer, no random encounters
   - If unsure, check this document

2. **Respect the "No Items" Decision**
   - Healing is via Psynergy only
   - Shops sell equipment, not consumables
   - This is intentional game design

3. **Maintain GBA Aesthetic**
   - No smooth gradients
   - No modern UI elements
   - Pixel-perfect sprite rendering
   - Authentic Golden Sun style

4. **Don't Break Existing Systems**
   - Battle system works - don't refactor unless necessary
   - Menu navigation complete - polish, don't rebuild
   - Sprite registry functional - extend, don't replace

5. **Focus on Polish, Not Rebuilding**
   - The systems are implemented
   - Focus on visual quality and feel
   - Add juice (particles, sounds, transitions)
   - Fix bugs, don't rewrite

---

## 📊 SUCCESS METRICS

**A successful graphics session produces:**

1. ✅ Improved visual fidelity (looks more like Golden Sun)
2. ✅ Smoother animations and transitions
3. ✅ Better readability (UI elements clear and obvious)
4. ✅ Consistent aesthetic across all screens
5. ✅ No new bugs introduced
6. ✅ Performance maintained (no lag)
7. ✅ Accessible (keyboard navigation works)

**Red Flags (avoid these):**

- ❌ Changed core mechanics without discussion
- ❌ Added systems not in the vision
- ❌ Broke existing functionality
- ❌ Made UI unreadable or inconsistent
- ❌ Ignored the "no items" design decision
- ❌ Replaced GBA aesthetic with modern UI

---

## 🤝 ALIGNMENT CHECKLIST

**Before starting graphics work, confirm:**

- [ ] I understand Vale Chronicles is a Golden Sun-inspired RPG
- [ ] I know there are NO consumable items (design decision)
- [ ] I understand battles are triggered by NPCs, not random
- [ ] I know there are 10 recruitable units (3 starters + 7)
- [ ] I understand Djinn provide passive + active bonuses
- [ ] I know equipment has 4 slots (Weapon/Armor/Helm/Boots)
- [ ] I understand the GBA sprite aesthetic is non-negotiable
- [ ] I know the battle system is working - focus is on polish
- [ ] I've reviewed the menu navigation flow
- [ ] I understand the sprite registry organization

**If any checkbox is unclear, re-read relevant sections above!**

---

## 📞 QUICK REFERENCE

**For Questions, Check:**
- Game Vision → This document (GAME_VISION_SUMMARY.md)
- Architecture → VALE_CHRONICLES_ARCHITECTURE.md
- Menu Flow → docs/MENU_NAVIGATION_FLOW.md
- NPC Battles → docs/NPC_BATTLE_SYSTEM.md
- No Items Decision → docs/NO_ITEMS_DESIGN_DECISION.md
- Story → docs/story/STORY_STRUCTURE.md
- Units → docs/story/RECRUITABLE_UNITS_FULL.md

**File Locations:**
- Screens: `src/components/{battle|equipment|djinn|etc}/`
- Sprites: `mockups/improved/sprites/`
- Sprite Registry: `src/data/spriteRegistry.ts`
- Router: `src/router/ScreenRouter.tsx`
- Context: `src/context/GameContext.tsx`

---

## 🎯 FINAL WORD

**Vale Chronicles is:**
- A focused, 8-15 hour RPG
- Golden Sun aesthetic and mechanics (pseudo-3D overworld)
- Turn-based tactical combat
- **One big town map** (Vale Village only)
- NPC-driven battles with dialogue choices (no random encounters, no treasure chests)
- **1 starter + 9 story unlocks** (not 3 starters)
- **Levels 1-20/30** with many spell unlocks
- Djinn collection & class changes
- Equipment-based progression (NO consumables)
- Story-driven with optional content

**Graphics work should:**
- Polish what exists
- Maintain authentic GBA aesthetic
- Add visual juice and effects
- Improve readability and clarity
- Respect the design decisions
- Not add new systems

**When in doubt:**
- Check this document
- Ask for clarification
- Default to Golden Sun aesthetics
- Focus on polish over features

---

**Good luck, and let's make Vale Chronicles look amazing! 🎮✨**
