# 🎮 VALE CHRONICLES - GAME VISION & MECHANICS SUMMARY

**Last Updated:** November 5, 2025
**Purpose:** Align AI sessions on game vision and UI requirements

---

## 🎯 CORE VISION

**Elevator Pitch:**
A Golden Sun-inspired RPG where you explore Vale Village, battle NPCs to recruit allies, collect elemental Djinn for class changes, and defeat an ancient demon sealed beneath Sol Sanctum.

**Inspiration:**
- **Golden Sun** - Overworld exploration, Djinn system, elemental Psynergy
- **NextEraGame** - Turn-based tactical combat, party management
- **GBA Aesthetic** - Authentic sprite-based graphics, 240x160 resolution feel

**Scope:**
8-15 hour RPG with 10 recruitable units, 12 Djinn to collect, and multiple story paths

---

## 🎭 CORE GAMEPLAY LOOP

```
1. EXPLORE Vale Village Overworld
   ↓
2. TALK to NPCs → Trigger Battles
   ↓
3. WIN Battle → Recruit Unit OR Earn Rewards
   ↓
4. EQUIP Gear & Djinn
   ↓
5. LEVEL UP Units (1-5)
   ↓
6. REPEAT until strong enough
   ↓
7. DEFEAT Nox Typhon (Final Boss)
```

---

## 🔑 CORE SYSTEMS

### 1. **Overworld Exploration**
- **Style:** Golden Sun top-down view
- **Movement:** WASD/Arrow keys, 8-directional
- **Interaction:** Space key to talk to NPCs, open chests, enter buildings
- **Areas:** Vale Village, Forest Path, Ancient Ruins
- **NPCs:** 29 total (all can trigger battles!)

### 2. **NPC Battle System** ⭐ KEY FEATURE
- **29 NPCs** each have unique battle encounters
- Press **Space** near NPC → Start Battle
- Defeat them → Optional recruitment or rewards
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
- **Backgrounds:** Authentic GBA battle backgrounds per location

### 4. **Unit System**
- **10 Total Recruitable Units**
- **3 Starters:** Isaac (Earth), Garet (Fire), Ivan (Wind)
- **7 Recruitable:** Mia (Water), Felix (Earth), Jenna (Fire), Sheba (Wind), Piers (Water), Kraden (Support), Kyle (Fire)
- **Levels:** 1-5 (ability unlocks each level)
- **Party Size:** Max 4 active, rest on bench
- **Bench System:** Swap units between battles

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
- **Acquisition:** Buy from shops, find in treasure chests, battle drops
- **NO ITEMS:** Design decision - no consumables (potions, herbs, etc.)

### 7. **Progression**
- **XP System:** Gain XP from battles → Level up
- **Level 1 → 5:** Each level unlocks 1 new ability
- **Example (Garet):**
  - Lv1: Basic Attack
  - Lv2: Flame Burst
  - Lv3: Fire Shield
  - Lv4: Blazing Strike
  - Lv5: Volcano (Ultimate)
- **Impact:** Level 1 loses to boss, Level 5 wins

### 8. **Healing & Resources**
- **NO Consumable Items** (key design decision!)
- **In Battle:** Mercury Psynergy (Ply, Wish, Glacial Blessing)
- **Out of Battle:**
  - Auto-restore PP (magic) after each battle
  - Inn: 10 gold for full HP/PP restore
- **Why:** Makes healers essential, PP management strategic

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
- Top-down Vale Village view
- Player character sprite
- 29 NPCs positioned around village
- Buildings, trees, scenery (all authentic GS sprites)
- Dialogue box at bottom when talking
- Controls overlay (can toggle)

**2. Battle Screen**
- **Background:** Location-specific (Cave.gif, Forest.gif, etc.)
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
- **Active Party (4 max):** Top row with checkmarks
- **Bench (6):** Bottom row
- **Click to Toggle:** Active ↔ Bench
- **Unit Cards:** Portrait, name, level, element
- **View Equipment Button:** Opens Equipment for selected unit

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
- **Items Found:** Equipment drops
- **Level Up:** Special celebration if leveled
  - Show new stats
  - Show new ability unlocked
  - Sparkle effects
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
- Start in Vale Village
- Complete tutorial battle
- Recruit initial party (4 units)
- Learn about weakening seal at Sol Sanctum
- Complete Elder's trials
- Collect first 2 Djinn

**Act 2: The Gathering Storm** (4-5 hours)
- Investigate Sol Sanctum
- Discover Nox Typhon (ancient demon)
- Explore new areas (Forest, Harbor, Ruins)
- Recruit mid-game units
- Collect 6-8 Djinn total
- Learn true nature of threat

**Act 3: The Final Stand** (2-3 hours)
- Final preparations
- Recruit remaining units (optional)
- Collect final Djinn (optional)
- Seal breaks - Nox Typhon escapes!
- Final boss battle (3 phases)
- Ending (Standard or True based on completion)

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
- ❌ Consumable Items (potions, herbs) - healing via abilities only
- ❌ Item menu in battle
- ❌ Random encounters - all battles are NPC-triggered
- ❌ Multiplayer/PvP
- ❌ Complex crafting system
- ❌ Open world (linear story with optional content)
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

1. **Battle Backgrounds**
   - ✅ Already have 72 authentic GBA backgrounds
   - ✅ CSS integration complete
   - ❓ Verify all load correctly
   - ❓ Add fallback for missing backgrounds

2. **Unit Sprites in Battle**
   - ✅ Sprite paths defined
   - ✅ Animation system exists
   - ❓ Verify all 10 units have complete sprite sets
   - ❓ Test animation transitions
   - ❓ Add sprite error handling

3. **Enemy Sprites**
   - ✅ Enemy sprites exist (Slime, Wolf, Goblin)
   - ❓ Need Nox Typhon boss sprite
   - ❓ Verify enemy positioning looks correct

4. **UI Polish**
   - Command menu styling (authentic GS look)
   - Combat log readability
   - Damage numbers (size, color, animation)
   - Turn order indicator clarity
   - Status effect icons

5. **Effects & Juice**
   - Screen shake on hits (exists but tune intensity)
   - Flash effect (exists but verify)
   - Djinn activation sparkles
   - Psynergy cast animations (fire, water, earth, wind)
   - Victory fanfare animation

6. **Responsive Testing**
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
- Golden Sun aesthetic and mechanics
- Turn-based tactical combat
- NPC-driven battles (no random encounters)
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
