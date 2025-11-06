# 🎮 VALE CHRONICLES - GAME VISION & MECHANICS SUMMARY

**Last Updated:** November 5, 2025
**Purpose:** Align AI sessions on game vision and UI requirements

---

## 🎯 CORE VISION

**Elevator Pitch:**
A Golden Sun-inspired RPG where you explore Vale Village (one big open world map), battle NPCs for XP/gold to unlock them as allies, collect elemental Djinn for class changes, and defeat an ancient demon sealed beneath Sol Sanctum.

**Inspiration:**
- **Golden Sun** - Overworld exploration, Djinn system, elemental Psynergy, GBA aesthetic
- **NextEraGame Battle Simulator** - Turn-based tactical combat with polished logic/mechanics (assess for migration)
- **Phaser Framework** - Recently discovered for potential implementation
- **GBA Aesthetic** - Authentic sprite-based graphics with modern clarity/readability

**Scope:**
8-15 hour RPG - Start small (fewer units/features) with plans to expand significantly in future

**Top Priorities (In Order):**
1. **Battle Simulator** - Core goal, heavy focus on logic and mechanics (assess NextEraGame)
2. **Open World** - Make the pseudo-3D overworld real and functional
3. **UI/Menus/Transitions** - Stats display, menu navigation, screen transitions

---

## 🎭 CORE GAMEPLAY LOOP

```
1. EXPLORE Vale Village (one big open world map)
   ↓
2. TALK to NPCs → Dialogue → Choose to Battle (optional)
   ↓
3. WIN Battle → Earn XP/Gold → RECRUIT that NPC as unit
   ↓
4. AUTO-HEAL (full HP/PP restore after each battle)
   ↓
5. EQUIP Gear & Djinn
   ↓
6. LEVEL UP Units (unlock spells at various levels)
   ↓
7. REPEAT until strong enough
   ↓
8. DEFEAT Nox Typhon (Final Boss)
```

---

## 🔑 CORE SYSTEMS

### 1. **Overworld Exploration** ⭐ PRIORITY #2
- **Style:** Pseudo-3D with depth and layered heights (like Golden Sun's perspective)
- **Type:** **OPEN WORLD** - one big Vale Village map, non-linear exploration
- **Movement:** WASD/Arrow keys, 8-directional
- **Interaction:** Space key to talk to NPCs, enter buildings
- **Areas:** **ONE BIG MAP - Vale Village only** (no separate map areas)
- **NPCs:** Flexible count - implement with purpose (could be more or less than originally planned)
  - As game progresses toward endgame, more NPCs appear
  - Not all NPCs are battlable - implement with tact
- **Treasure Chests:** 1-2 rare/secret chests max (no chest mechanic system, just occasional rare find)

### 2. **NPC Battle System** ⭐ KEY FEATURE
- **NPCs positioned around Vale** - implement with tact (not all NPCs are battlable)
- Press **Space** near NPC → Dialogue opens → **NPC ASKS if you want to fight**
  - Choose YES → Start Battle
  - Choose NO → Continue dialogue (plot/lore content)
- **Hybrid Recruitment:** After you WIN a battle against an NPC, you recruit them as a playable unit
  - Battles reward XP/gold AND unlock that NPC as recruitable
  - Re-battling NPCs is situational (design TBD)
- Examples:
  - **Mayor** → 3 Goblins (boss-level) → Unlocks Mayor as unit
  - **Young Sarah** → 1 Slime (tutorial-level) → Unlocks Sarah as unit
  - **Sage Aldric** → 1 Wolf + 1 Goblin + 1 Slime (hard) → Unlocks Aldric as unit

### 3. **Turn-Based Combat** ⭐⭐⭐ PRIORITY #1 - CORE GOAL
- **Status:** Barely working, needs A LOT of work
- **Goal:** Very polished, near-identical (or very good but slightly different) appearance to original Golden Sun
- **Focus:** Heavy emphasis on logic and mechanics, very fun and smooth battles
- **Assessment Needed:** NextEraGame repository has working battle simulator - assess for migration/integration
- **Party:** 1-4 active units from your collection (or 3? - needs decision, see Q9)
- **Turn Order:** Speed-based
- **Actions:**
  - **Attack** - Needs cool mechanic or reason to be important
  - **Psynergy** (abilities) - spell animations critical
  - **Djinn** - unleash mechanics
  - ~~Defend~~ - REMOVE (no longer in design)
- **Win Condition:** Defeat all enemies
- **Lose Condition:** All party members KO'd
- **Backgrounds:** Authentic GBA backgrounds layered **behind** the battlefield
  - ⚠️ **CURRENT STATUS:** Needs A LOT of work - battle flow works most times but game isn't done

### 4. **Unit System**
- **Total Units:** Do fewer for now, but plan to add much more in the future
  - Don't get ahead of yourself - start small, expand later
- **1 Starter:** Choose Isaac, Garet, OR Ivan at game start
- **Unlockable Units:** Win battle against NPC → recruit them as playable unit (hybrid recruitment)
- **Levels:** 1-10 or 1-20, whichever makes more sense (undecided - see Undecided Questions)
- **Party Size:** 4 active max (or 3? - needs decision, see Q9)
- **Bench System:** Swap units between battles
- **Recruitment Method:** Hybrid approach - defeat NPC in battle, then gain them as recruitable unit

### 5. **Djinn System** ⭐ UNIQUE MECHANIC
- **12 Djinn Total:** 3 Venus, 3 Mars, 3 Mercury, 3 Jupiter
- **Equip System:** 3 Djinn per unit (not 3 global) - bench system where Djinn can be swapped
- **Passive Mode:** Stat boosts + class changes when equipped
- **Active Mode:** Unleash in battle for powerful attack
  - ⚠️ **UNDECIDED:** Two options both marked in questionnaire:
    - Option A: Temporarily lose passive bonus, Djinn recovers after 2 turns
    - Option B: Djinn consumed (one-time use)
  - **Decision needed** before implementing
- **Synergy:** All same element = specialization, Mixed = hybrid class
- **Class Changes:** Equipped Djinn affect your character class
- **Example:** 3 Venus Djinn = "Venus Adept" + Earthquake ability

### 6. **Equipment System**
- **4 Slots:** Weapon, Armor, Helm, Boots
- **Effects:** Stat boosts (ATK, DEF, SPD), some unlock abilities
- **Acquisition:**
  - Buy from shops
  - Battle drops
  - 1-2 rare/secret treasure chests (no chest mechanic system, just occasional finds)
- **NO CONSUMABLES:** Design decision - no consumable items (potions, herbs, etc.)
- **Shop Refunds:** Can sell equipment back, but method undecided (currency or materials? - see Undecided Questions)

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
- **After Battle:** Auto-heal - full HP AND PP restore automatically
- **Inn System:** Still available (10 gold) but less necessary due to auto-heal
- **Why:** Makes healers essential during battle, but reduces tedious menu management between fights

---

## ⚠️ CRITICAL CORRECTIONS FROM QUESTIONNAIRE (Nov 5, 2025)

**Top Priorities Changed:**
1. 🔥 **Battle Simulator is CORE GOAL** - Heavy focus on logic/mechanics, assess NextEraGame for migration
2. 🌍 **Open World is Priority #2** - Make the pseudo-3D overworld real
3. 🎨 **UI/Menus/Transitions Priority #3** - Stats, navigation, transitions

**Design Confirmations:**
- ✅ **Open World** - NOT linear story with optional content
- ✅ **ONE BIG MAP** - Vale Village only (no separate map areas)
- ✅ **1 Starter Unit** - Pick one of Isaac/Garet/Ivan (not all 3)
- ✅ **Hybrid Recruitment** - Win battle against NPC → recruit them as unit
- ✅ **Auto-heal Both HP/PP** - After every battle
- ✅ **NO Quest System** - Remove all quest/quest log references
- ✅ **One Ending** - NOT standard + true ending
- ✅ **GBA Sprites + Modern Clarity** - Authentic sprites with readable UI
- ✅ **Spell Animations Critical** - Don't forget spell/Psynergy visual effects
- ✅ **NO Defend Action** - Remove from battle system
- ✅ **Attack Needs Cool Mechanic** - Basic attack needs reason to be important
- ✅ **1-2 Rare Chests** - NOT zero chests, but no chest mechanic system
- ✅ **Flexible NPC Count** - Implement with purpose, not all are battlable
- ✅ **Fewer Units Now** - Start small, expand significantly later
- ✅ **Re-battle Situational** - Design TBD

**Current Implementation Reality:**
- ⚠️ **Battle system barely working** - Needs A LOT of work
- ⚠️ **Battle flow works most times** - But game isn't done
- ⚠️ **NextEraGame assessment critical** - Working battle simulator exists, assess for migration
- ⚠️ **Phaser framework** - Recently discovered, consider for implementation

**Always prioritize questionnaire answers over old planning docs!**

---

## ❓ UNDECIDED DESIGN QUESTIONS

**The following need decisions before implementing:**

1. **Party Size:** 4 units (current) OR 3 units?
   - User: "4 is correct, but give me your thoughts on three as well"

2. **Djinn Unleash Mechanics:** Temporary OR consumed?
   - Option A: Lose passive bonus temporarily, Djinn recovers after 2 turns
   - Option B: Djinn consumed (one-time use)
   - Both options were marked in questionnaire

3. **Level Range:** 1-10 OR 1-20?
   - User: "whichever makes sense"

4. **Shop Refund System:** Currency OR materials?
   - When selling equipment back to shops

5. **Attack Action Mechanic:** What makes basic attack important/cool?
   - Currently just "Attack" - needs compelling reason to choose over Psynergy

**Don't implement these systems until decisions are made!**

---

## 🎨 UI SCREENS

### Main Flow
```
TITLE SCREEN
    ↓
INTRO (Story cutscene)
    ↓
OVERWORLD ←──┐ (Main Hub - Open World)
    │        │
    ├→ Main Menu (ESC key)
    │   ├→ Djinn Screen
    │   ├→ Equipment Screen
    │   └→ Party Management
    │        │
    ├→ NPC Dialogue (Space)
    │        │
    ├→ Shop Screen (at shops)
    │        │
    └→ BATTLE (NPC trigger)
         ↓
    REWARDS SCREEN → Recruit NPC as unit
         ↓
    (Back to Overworld)
```

### Screen Details

**1. Overworld** (Main Hub) ⭐ PRIORITY #2
- **Open World** - Non-linear exploration of Vale Village
- **Pseudo-3D perspective** with depth and layered heights (like Golden Sun)
- **One big map** - Vale Village only (no separate areas)
- Player character sprite
- NPCs positioned around village (flexible count, implement with purpose)
- Buildings, trees, scenery (all authentic GS sprites)
- Dialogue box at bottom when talking
- Controls overlay (can toggle)
- **1-2 rare/secret treasure chests** (no chest mechanic system)

**2. Battle Screen** ⭐⭐⭐ PRIORITY #1 - CORE GOAL
- **Status:** Barely working, needs A LOT of work
- **Goal:** Very polished, near-identical to Golden Sun with fun/smooth battles
- **NextEraGame Assessment:** Working battle simulator exists - assess for migration
- **Background:** Location-specific (Cave.gif, Forest.gif, etc.)
  - Should be layered BEHIND units, not full-screen
- **Enemy Row:** Top of screen (animated sprites)
- **Party Row:** Bottom of screen (3-4 slots - undecided)
- **Command Menu:** Attack (needs cool mechanic) / Psynergy / Djinn / ~~Defend~~
- **Combat Log:** Shows actions/damage
- **Turn Order:** Visual indicator
- **Effects:** Screen shake, flash, damage numbers
- **Spell Animations:** Critical - don't forget Psynergy visual effects

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
- **Total Units:** Fewer for now, plan to add much more in future
- **Active Party (3-4 max - undecided):** Top row with checkmarks
- **Bench:** Remaining units
- **Click to Toggle:** Active ↔ Bench
- **Unit Cards:** Portrait, name, level, element
- **View Equipment Button:** Opens Equipment for selected unit
- **Unlock System:** Win battle against NPC → recruit them as playable unit

**6. Main Menu** (ESC key)
- **Options:**
  - Djinn (manage Djinn)
  - Equipment (equip items)
  - Party (manage active party)
  - Return (back to game)
- **Style:** Golden Sun menu aesthetic
- ~~Quest Log~~ - REMOVED (no quest system)

**7. Shop Screen**
- **Tabs:** BUY / SELL
- **Equipment Only:** No consumables!
- **Gold Display:** Current balance
- **Item List:** Name, price, stats
- **Shopkeeper Dialogue:** Top of screen

**8. Rewards Screen**
- **Gold Earned:** Animation counting up
- **XP Earned:** Animation counting up
- **Equipment Drops:** Show any equipment earned (no consumables)
- **Unit Recruitment:** If defeated NPC, show recruitment message
  - "[NPC Name] has joined your party!"
  - Show unit portrait and stats
- **Level Up:** Special celebration if leveled
  - Show new stats
  - Show new Psynergy spell unlocked (if any at this level)
  - Sparkle effects
- **Auto-Heal:** Full HP/PP restore happens automatically
- **Continue Button:** Return to overworld

**10. Battle Transition**
- **Swirl Effect:** 1 second animation
- **Save Overworld State:** Remember position
- **Load Battle:** With NPC's team
- **Return After:** Back to same spot

---

## 📖 STORY STRUCTURE

### Open World Progression

**Early Game:**
- Start in Vale Village (one big open world map)
- Choose starter: Isaac, Garet, OR Ivan
- Explore and battle NPCs in any order (open world)
- Recruit NPCs by defeating them in battle
- Learn about weakening seal at Sol Sanctum
- Collect Djinn scattered around Vale
- Level progression (1-10 or 1-20, undecided)

**Mid Game:**
- Battle tougher NPCs around Vale Village
- More NPCs appear as game progresses toward endgame
- Discover Nox Typhon (ancient demon sealed beneath Sol Sanctum)
- Continue recruiting units through battles
- Collect more Djinn
- Learn true nature of threat

**End Game:**
- More NPCs populate Vale Village
- Final preparations (battle strongest NPCs)
- Optional: Recruit remaining units
- Optional: Collect final Djinn
- Seal breaks - Nox Typhon escapes!
- Final boss battle (3 phases)
- **One Ending** (not standard + true)

### Character Arcs
- **Isaac:** Living up to father's legacy
- **Garet:** Learning heart over strength
- **Mia:** Burden of healing (if recruited)
- **Felix:** Redemption for past failure (if recruited)
- Character arcs for recruitable NPCs

### Ending
- **Single Ending:** Defeat Nox Typhon and save Vale Village
- No branching endings or completion requirements

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
- ❌ **Consumable Items** (potions, herbs) - healing via Psynergy only
- ❌ **Treasure Chest System** - only 1-2 rare/secret finds (no mechanic)
- ❌ **Quest System / Quest Log** - no quests at all
- ❌ **Multiple Map Areas** - one big Vale Village open world only
- ❌ **3 Starting Characters** - pick 1 starter (Isaac/Garet/Ivan)
- ❌ **Linear Story** - open world exploration, not linear progression
- ❌ **Multiple Endings** - one ending only
- ❌ **Defend Action** - removed from battle system
- ❌ **Instant Battle Triggers** - NPCs ask if you want to fight
- ❌ Item menu in battle
- ❌ Random encounters (all battles are NPC-triggered)
- ❌ Multiplayer/PvP
- ❌ Complex crafting system
- ❌ Voice acting (text only)
- ❌ Real-time combat (turn-based only)

---

## ✅ CURRENT IMPLEMENTATION STATUS

**Reality Check (from Questionnaire):**
- ⚠️ **Battle system barely working** - Needs A LOT of work
- ⚠️ **Battle flow works most times** - But game isn't done
- ⚠️ **Focus needed:** All of the above (battle, open world, UI)

**Some Foundation Exists:**
- 🔄 Battle system (barely working, Priority #1)
- 🔄 Some NPC battle triggers (implement with tact)
- 🔄 Equipment system (4 slots)
- 🔄 Menu navigation (some screens exist)
- 🔄 Sprite registry (2500+ sprites loaded)
- 🔄 Battle backgrounds (72 authentic GBA backgrounds)
- 🔄 Equipment icons integration
- 🔄 Main menu (ESC key)
- ~~Quest log system~~ - REMOVE (no quests)
- 🔄 Shop system (equipment only)
- 🔄 Overworld exploration (needs to become real open world - Priority #2)
- 🔄 Dialogue system

**Critical Needs:**
- 🔥 **Assess NextEraGame battle simulator** - working system exists for possible migration
- 🔥 **Consider Phaser framework** - recently discovered
- 🔥 **Make open world real** - Priority #2
- 🔥 **Fix battle system** - Priority #1, barely working
- 🔄 Djinn system (mechanics designed, needs implementation)
- 🔄 Level progression (1-10 or 1-20, undecided)
- 🔄 Unit recruitment flow (hybrid: defeat NPC → recruit)
- 🔄 Save/Load system
- 🔄 Story cutscenes
- 🔄 Boss battles (Nox Typhon phases)
- 🔄 Ending sequence (one ending)

**Not Started:**
- 🆕 Sound effects & music
- 🆕 Particle effects polish
- 🆕 Spell/Psynergy animations (critical!)
- 🆕 Tutorial system

---

## 🎨 GRAPHICS WORK PRIORITIES

### ⚠️ NEW PRIORITY ORDER (from Questionnaire)

**Current Focus:** "All of the above" - battle, open world, UI work in parallel

### 🔥 **PRIORITY #1: BATTLE SIMULATOR - CORE GOAL**
- **Status:** Barely working, needs A LOT of work
- **Goal:** Very polished, near-identical to Golden Sun appearance
- **Focus:** Heavy emphasis on logic and mechanics, very fun and smooth battles
- **Critical Task:** Assess NextEraGame battle simulator for migration/integration
- **Framework:** Consider Phaser implementation
- **What This Means:**
  - Battle system is the core goal of the project
  - Don't just polish visuals - fix fundamental logic/mechanics
  - Study NextEraGame's working battle simulator
  - Make battles fun and smooth, not just pretty
- **Graphics Needs:**
  - Spell/Psynergy animations (CRITICAL - don't forget!)
  - Battle backgrounds layered behind units (not full-screen)
  - Unit battle sprites (7 animations per unit)
  - Enemy sprites
  - Damage numbers, screen shake, flash effects
  - Command menu (remove Defend, make Attack compelling)
  - Turn order indicators
  - Victory animations

### 🌍 **PRIORITY #2: MAKE THE OPEN WORLD REAL**
- **Type:** Open world (not linear)
- **Map:** One big Vale Village, pseudo-3D with depth/layers
- **What This Means:**
  - Non-linear exploration
  - NPCs implemented with purpose (not all battlable)
  - More NPCs appear toward endgame
  - 1-2 rare/secret treasure chests (no chest system)
- **Graphics Needs:**
  - Pseudo-3D overworld perspective (like Golden Sun)
  - Layered heights and depth
  - Building sprites (authentic GS)
  - Scenery (trees, plants, outdoor objects)
  - NPC sprites positioned strategically
  - Player character movement sprites
  - Dialogue boxes with choice UI ("Want to fight?")

### 🎨 **PRIORITY #3: UI/MENUS/TRANSITIONS**
- **What This Means:**
  - Stats display clearly visible
  - Menu navigation smooth
  - Screen transitions polished
  - Remove quest system entirely
- **Graphics Needs:**
  - Main Menu (Djinn, Equipment, Party - NO Quest Log)
  - Equipment screen (4 slots, stat preview)
  - Djinn screen (3 per unit, bench system)
  - Party management (3-4 active, undecided)
  - Shop screen (equipment only, no consumables)
  - Rewards screen (gold, XP, recruitment message, auto-heal)
  - Battle transition (swirl effect)
  - Stat bars (HP green, PP blue)
  - Golden Sun font and panel borders

---

## 🗣️ COMMON PITFALLS TO AVOID

### For AI Sessions Working on Graphics:

1. **Don't Assume Systems Are Complete**
   - Battle system is **barely working** - needs fundamental work, not just polish
   - Open world needs to be made **real** - not just visual tweaks
   - Check NextEraGame battle simulator before building from scratch
   - "Game isn't done" - don't just polish, build core functionality

2. **Respect the "No Items/No Quests" Decisions**
   - Healing is via Psynergy only (NO consumables)
   - NO quest system / quest log
   - Shops sell equipment only
   - These are intentional game design decisions

3. **Remember It's Open World**
   - NOT linear story with optional content
   - Non-linear exploration of one big Vale Village map
   - Flexible NPC count - implement with purpose
   - One ending (not multiple)

4. **Don't Get Ahead of Yourself**
   - Start with fewer units, expand significantly later
   - Not all NPCs are battlable - implement with tact
   - Several design questions still undecided (see Undecided Questions section)

5. **Maintain GBA Aesthetic + Modern Clarity**
   - Authentic Golden Sun sprites
   - But with modern readability/clarity
   - Pixel-perfect rendering
   - Don't forget spell/Psynergy animations!

---

## 📊 SUCCESS METRICS

**A successful work session produces:**

1. ✅ **Battle system improvement** - Logic, mechanics, fun factor (Priority #1)
2. ✅ **Open world progress** - Pseudo-3D overworld made more real (Priority #2)
3. ✅ **UI/menu polish** - Stats, navigation, transitions improved (Priority #3)
4. ✅ Visual fidelity (GBA sprites + modern clarity)
5. ✅ Spell/Psynergy animations (don't forget these!)
6. ✅ No new bugs introduced
7. ✅ Performance maintained (no lag)
8. ✅ Accessible (keyboard navigation works)

**Red Flags (avoid these):**

- ❌ Building battle system from scratch without checking NextEraGame first
- ❌ Assuming battle system just needs polish (it barely works!)
- ❌ Adding quest system / quest log (removed from game)
- ❌ Adding consumable items (NO items!)
- ❌ Making game linear instead of open world
- ❌ Implementing undecided systems (party size 3/4, Djinn unleash, etc.)
- ❌ Forgetting spell/Psynergy animations
- ❌ Getting ahead of yourself with too many units/NPCs

---

## 🤝 ALIGNMENT CHECKLIST

**Before starting work, confirm:**

- [ ] I understand **battle simulator is Priority #1** (core goal, barely working)
- [ ] I know to **assess NextEraGame battle simulator first** before building
- [ ] I understand **open world is Priority #2** (make it real, not just polish)
- [ ] I know **UI/menus are Priority #3** (stats, navigation, transitions)
- [ ] I understand there are **NO consumable items** (design decision)
- [ ] I know there is **NO quest system** (removed entirely)
- [ ] I understand this is an **open world** (not linear story)
- [ ] I know battles **recruit NPCs** (hybrid: defeat → recruit)
- [ ] I understand **auto-heal both HP/PP** after every battle
- [ ] I know there's **one ending** (not multiple)
- [ ] I understand **1-2 rare chests** (no chest mechanic system)
- [ ] I know **fewer units for now**, expand significantly later
- [ ] I understand **several design questions undecided** (see section above)
- [ ] I know **spell/Psynergy animations are critical** (don't forget!)
- [ ] I understand **GBA sprites + modern clarity** aesthetic
- [ ] I know **Defend action removed** from battle system

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
- A focused, 8-15 hour open world RPG
- Golden Sun aesthetic (GBA sprites + modern clarity)
- **Priority #1:** Battle simulator (core goal, barely working - assess NextEraGame)
- **Priority #2:** Open world pseudo-3D overworld (make it real)
- **Priority #3:** UI/menus/transitions (stats, navigation)
- **One big map** (Vale Village open world only)
- NPC-driven battles → recruit NPCs (no random encounters)
- **1 starter** (Isaac/Garet/Ivan) → recruit more via battles
- **Hybrid recruitment:** Defeat NPC → gain them as unit
- **Auto-heal HP/PP** after every battle
- **Levels 1-10 or 1-20** (undecided - whichever makes sense)
- Djinn collection & class changes (unleash mechanics undecided)
- Equipment-based progression (NO consumables, NO quests)
- **One ending** (not multiple)
- **1-2 rare treasure chests** (no chest mechanic system)
- Start with fewer units, expand significantly in future

**Work priorities:**
1. **Fix battle system** - barely working, needs A LOT of work (check NextEraGame first!)
2. **Make open world real** - pseudo-3D Vale Village with depth/layers
3. **Polish UI/menus** - remove quest system, show stats clearly
4. **Don't forget spell animations!** - Psynergy visual effects critical
5. Respect undecided design questions - don't implement until decided

**When in doubt:**
- Check this document (especially Undecided Questions section)
- Assess NextEraGame battle simulator before building battle system
- Remember: game isn't done, battle barely works, open world needs to be made real
- Default to Golden Sun aesthetics + modern clarity
- Focus on Priority #1 (battle), #2 (open world), #3 (UI)

---

**Updated:** November 5, 2025 - Based on comprehensive questionnaire feedback
**Good luck! Let's make Vale Chronicles' battle simulator amazing, make the open world real, and polish that UI! 🎮✨**
