# SYSTEM READINESS ASSESSMENT

**Date:** November 4, 2025  
**Purpose:** Evaluate current codebase infrastructure to determine which systems can support new features immediately vs. which need foundational work first  

---

## EXECUTIVE SUMMARY

**Overall Readiness: 65%** - Strong core systems with several critical gaps

**Key Findings:**
- ✅ **EXCELLENT**: Battle calculation system, type safety, unit/stat management
- ✅ **GOOD**: Equipment system structure, element system, basic UI framework
- ⚠️ **PARTIAL**: Status effects (defined but not processed), PP regen (exists in code but not called)
- ❌ **MISSING**: Camera system, save/load, party management UI, Djinn implementation

---

## DETAILED SYSTEM ANALYSIS

### 1. STATUS EFFECTS SYSTEM - ⚠️ 60% READY

**What Exists:**
- ✅ `StatusEffect` interface in `Unit.ts` with full type definitions
- ✅ `unit.statusEffects: StatusEffect[]` property exists on all units
- ✅ Status effect duration countdown in `advanceBattleTurn()` (Battle.ts:436)
- ✅ Buff/debuff application in `executeAbility()` (Battle.ts:333)

**What's Missing:**
- ❌ NO poison/burn damage calculation in battle loop
- ❌ NO freeze turn skip logic
- ❌ NO paralyze action failure check
- ❌ NO status effect tick processing (poison/burn damage at start of turn)
- ❌ NO cure logic in healing abilities

**Infrastructure Grade: B-** - Types and storage ready, just needs processing logic

**Can Layer On?** YES - Ready for implementation with minimal refactoring

---

### 2. EVASION & DODGE MECHANICS - ⚠️ 40% READY

**What Exists:**
- ✅ `evasion` property defined in Equipment.ts (line 29)
- ✅ Equipment data has evasion values (Hyper Boots, Hermes' Sandals)
- ✅ `alwaysFirstTurn` property implemented in turn order (Battle.ts:94)

**What's Missing:**
- ❌ NO `checkDodge()` function anywhere in codebase
- ❌ NO evasion check in damage calculation pipeline
- ❌ NO "Miss!" message handling

**Infrastructure Grade: C** - Properties exist but completely unused

**Can Layer On?** YES - Need to add dodge check before damage application in `executeAbility()`

---

### 3. CLASS CHANGE SYSTEM - ❌ 10% READY

**What Exists:**
- ✅ Djinn synergy calculation exists (Unit.ts has `calculateDjinnSynergy`)
- ✅ Team-wide Djinn system architecture in place

**What's Missing:**
- ❌ NO class definitions anywhere
- ❌ NO class change detection logic
- ❌ NO `currentClass` property on Unit
- ❌ NO class-based stat multipliers
- ❌ NO class-specific ability unlocking

**Infrastructure Grade: D** - Would require significant new systems

**Can Layer On?** NO - Needs foundational class system first

---

### 4. CRITICAL HIT SYSTEM - ✅ 95% READY

**What Exists:**
- ✅ `checkCriticalHit()` function implemented (Battle.ts:128)
- ✅ Crit chance formula correct: 5% base + 0.2% per SPD
- ✅ 2.0x damage multiplier applied in `executeAbility()` (Battle.ts:260)
- ✅ `isCritical` flag in ActionResult

**What's Missing:**
- ❌ NO visual feedback for crits in UI (no special styling/animation)

**Infrastructure Grade: A** - Already implemented!

**Can Layer On?** YES - Just needs UI polish

---

### 5. ELEMENT ADVANTAGE SYSTEM - ✅ 100% READY

**What Exists:**
- ✅ `getElementModifier()` implemented (Element.ts:25)
- ✅ Already integrated into `calculatePsynergyDamage()` (Battle.ts:187)
- ✅ 1.5x / 0.67x modifiers correct per spec

**What's Missing:**
- ❌ NO "Super effective!" messages in UI

**Infrastructure Grade: A+** - Fully implemented!

**Can Layer On?** YES - Only needs UI messaging

---

### 6. BATTLE FLEE MECHANICS - ✅ 90% READY

**What Exists:**
- ✅ `attemptFlee()` function fully implemented (Battle.ts:378-417)
- ✅ Speed-based flee chance calculation correct
- ✅ Boss battle check implemented
- ✅ 10%-90% clamping implemented

**What's Missing:**
- ❌ NO UI button wired to call `attemptFlee()`
- ❌ NO success/failure feedback display

**Infrastructure Grade: A** - Logic complete, just needs UI hookup

**Can Layer On?** YES - Just needs button handler in BattleScreen.tsx

---

### 7. PARTY MANAGEMENT SYSTEM - ❌ 20% READY

**What Exists:**
- ✅ `activePartyIds: string[]` in PlayerData
- ✅ `setActiveParty()` action in GameContext
- ✅ Max 10 units, max 4 active logic in PlayerData.ts

**What's Missing:**
- ❌ NO party management UI component
- ❌ NO way to swap units in/out
- ❌ NO visual representation of bench vs active
- ❌ NO drag-and-drop or selection UI

**Infrastructure Grade: D** - Data structure exists, zero UI

**Can Layer On?** NO - Needs entire UI screen built first

---

### 8. DJINN SYSTEM IMPLEMENTATION - ❌ 30% READY

**What Exists:**
- ✅ Djinn type definitions (Djinn.ts)
- ✅ `calculateDjinnSynergy()` function (Djinn.ts)
- ✅ Team-wide Djinn architecture (not per-unit)
- ✅ `djinnCollected` array in PlayerData
- ✅ DjinnState enum (Set/Standby/Recovery)

**What's Missing:**
- ❌ NO Djinn data definitions (only placeholder types)
- ❌ NO Djinn equip screen UI
- ❌ NO in-battle Djinn activation
- ❌ NO Djinn discovery/collection events
- ❌ NO Djinn board UI in battle

**Infrastructure Grade: D+** - Strong types, zero implementation

**Can Layer On?** NO - Needs data + 2 major UI screens

---

### 9. EQUIPMENT SPECIAL EFFECTS - ⚠️ 50% READY

**What Exists:**
- ✅ `unlocksAbility` property on Equipment
- ✅ `elementalResist` property on Equipment
- ✅ `alwaysFirstTurn` property implemented (Battle.ts:94)
- ✅ Equipment stat bonuses applied in `calculateStats()` (Unit.ts:170)

**What's Missing:**
- ❌ NO ability granting/removal when equipment changes
- ❌ NO elemental resist check in damage calculation
- ❌ NO PP bonus from Oracle's Crown applied to maxPp

**Infrastructure Grade: C+** - Properties defined, not all processed

**Can Layer On?** YES - Needs conditional checks in existing functions

---

### 10. BATTLE TURN ORDER - ✅ 85% READY

**What Exists:**
- ✅ `calculateTurnOrder()` fully implemented (Battle.ts:88)
- ✅ SPD sorting correct
- ✅ Random tiebreaker implemented (Battle.ts:107)
- ✅ Hermes' Sandals "always first" logic (Battle.ts:94)
- ✅ KO'd units filtered out

**What's Missing:**
- ❌ NO turn order display UI component
- ❌ NO visual preview of who acts next

**Infrastructure Grade: A-** - Logic perfect, UI missing

**Can Layer On?** YES - Just needs display component

---

### 11. XP DISTRIBUTION - ✅ 100% READY

**What Exists:**
- ✅ `distributeRewards()` gives full XP to each active unit (BattleRewards.ts)
- ✅ KO'd units excluded from XP gain
- ✅ Bench units never gain XP (only activePartyIds get rewards)

**Infrastructure Grade: A+** - Correctly implemented per spec!

**Can Layer On?** N/A - Already working correctly

---

### 12. AOE DAMAGE APPLICATION - ✅ 100% READY

**What Exists:**
- ✅ `executeAbility()` loops through all targets and applies full damage to each (Battle.ts:253-264)
- ✅ NO damage splitting or reduction

**Infrastructure Grade: A+** - Correctly implemented per spec!

**Can Layer On?** N/A - Already working correctly

---

### 13. PP REGENERATION - ⚠️ 70% READY

**What Exists:**
- ✅ `restorePPAfterBattle()` function implemented (Battle.ts:482)
- ✅ Sets `unit.currentPp = unit.maxPp` for all units
- ✅ Called in `processBattleVictory()` (Battle.ts:529)

**What's Missing:**
- ❌ `processBattleVictory()` may not be called in UI victory flow
- ❌ Inn rest doesn't restore PP (no inn system exists)

**Infrastructure Grade: B** - Function exists but may not be invoked

**Can Layer On?** YES - Just need to ensure victory handler calls it

---

### 14. INN REST SYSTEM - ❌ 0% READY

**What Exists:**
- Nothing

**What's Missing:**
- ❌ NO Inn screen UI
- ❌ NO inn rest action in GameContext
- ❌ NO gold deduction logic
- ❌ NO HP/PP restoration function
- ❌ NO auto-save trigger

**Infrastructure Grade: F** - Completely missing

**Can Layer On?** NO - Needs entire system built from scratch

---

### 15. SHOP BUY/SELL SYSTEM - ⚠️ 50% READY

**What Exists:**
- ✅ ShopScreen.tsx component exists (299 lines)
- ✅ `buyEquipment()` action in GameProvider (line 518)
- ✅ Shop data in shops.ts (equipment only)
- ✅ Gold deduction logic exists

**What's Missing:**
- ❌ ShopScreen.tsx has broken imports (references removed ITEMS)
- ❌ Quantity state for items (should be removed - equipment only)
- ❌ Shop mode switching may not work
- ❌ Sell functionality incomplete

**Infrastructure Grade: C** - UI exists but partially broken

**Can Layer On?** YES - Needs refactoring to remove item code

---

### 16. EQUIPMENT DROPS - ❌ 10% READY

**What Exists:**
- ✅ DROP_RATES defined in GAME_MECHANICS.md
- ✅ Rewards screen UI exists

**What's Missing:**
- ❌ NO equipment drop calculation in battleRewards.ts
- ❌ NO drop table data on enemies
- ❌ NO equipment display in rewards screen
- ❌ NO inventory addition on drop

**Infrastructure Grade: D-** - Zero implementation

**Can Layer On?** YES - Need to add drop calculation to rewards system

---

### 17. SAVE/LOAD SYSTEM - ❌ 0% READY

**What Exists:**
- Nothing

**What's Missing:**
- ❌ NO save/load functions
- ❌ NO localStorage persistence
- ❌ NO save screen UI
- ❌ NO load game option
- ❌ NO auto-save triggers

**Infrastructure Grade: F** - Completely missing

**Can Layer On?** NO - Needs entire system built from scratch

---

### 18. CAMERA FOLLOW SYSTEM - ❌ 0% READY

**What Exists:**
- ✅ NewOverworldScreen.tsx exists (422 lines)
- ✅ Player position tracked in GameState

**What's Missing:**
- ❌ NO camera transform/offset calculations
- ❌ NO viewport centering on player
- ❌ NO boundary checking
- ❌ NO smooth scrolling

**Infrastructure Grade: F** - Zero implementation

**Can Layer On?** YES - Can add transform CSS to existing screen

---

### 19. NPC DIALOGUE DISPLAY - ⚠️ 40% READY

**What Exists:**
- ✅ `showDialogue` state in NewOverworldScreen.tsx (line 13)
- ✅ NPC interaction logic (line 98)
- ✅ Boss dialogue before battles (line 61)

**What's Missing:**
- ❌ NO DialogueBox component
- ❌ NO text scrolling/typewriter effect
- ❌ NO "press to continue" prompt
- ❌ Dialogue displays as simple alert/state

**Infrastructure Grade: C-** - Basic state management, no UI

**Can Layer On?** YES - Need to create DialogueBox component

---

### 20. BATTLE TRANSITIONS - ❌ 0% READY

**What Exists:**
- Nothing

**What's Missing:**
- ❌ NO transition component
- ❌ NO swirl/spiral animation
- ❌ NO fade effects
- ❌ Battles start instantly (NewOverworldScreen.tsx:73)

**Infrastructure Grade: F** - Zero implementation

**Can Layer On?** YES - Can add transition component between screens

---

### 21. TREASURE CHEST SYSTEM - ⚠️ 30% READY

**What Exists:**
- ✅ `openTreasureChest()` action in GameContext
- ✅ `openedChests: Set<ChestId>` in AreaState
- ✅ `isTreasureAtPosition()` helper in Area.ts

**What's Missing:**
- ❌ NO treasure chest data in areas
- ❌ NO chest opening UI
- ❌ NO reward distribution on open
- ❌ NO visual sprite change (open/closed)

**Infrastructure Grade: D+** - State tracking exists, no content/UI

**Can Layer On?** YES - Need to add chest data + opening screen

---

## IMPLEMENTATION PRIORITY MATRIX

### TIER 1: READY TO IMPLEMENT (Can start immediately)

1. **Critical Hits (UI)** - 95% ready, just add visual feedback
2. **Element Advantage (UI)** - 100% ready, just add messages
3. **Battle Flee (UI)** - 90% ready, wire up button
4. **Evasion System** - 40% ready, add dodge check function
5. **Status Effects** - 60% ready, add tick processing
6. **PP Regeneration** - 70% ready, ensure victory calls it
7. **Equipment Special Effects** - 50% ready, add conditional checks

### TIER 2: NEEDS MINOR REFACTORING

8. **Shop Buy/Sell** - 50% ready, remove item code
9. **NPC Dialogue** - 40% ready, create DialogueBox component
10. **Treasure Chests** - 30% ready, add data + UI
11. **Equipment Drops** - 10% ready, add drop calculation
12. **Turn Order Display** - 85% ready, create display component

### TIER 3: NEEDS MAJOR NEW SYSTEMS

13. **Camera Follow** - 0% ready, add transform logic
14. **Battle Transitions** - 0% ready, create animation component
15. **Djinn System** - 30% ready, needs data + 2 UIs
16. **Party Management** - 20% ready, needs full UI screen
17. **Class Changes** - 10% ready, needs class system architecture
18. **Inn Rest System** - 0% ready, needs full implementation
19. **Save/Load System** - 0% ready, needs full implementation

---

## RECOMMENDED IMPLEMENTATION ORDER

### PHASE 1: QUICK WINS (1-2 weeks)
Polish existing systems that are 80%+ ready:
1. Battle Flee button hookup
2. Critical hit visual feedback
3. Element advantage messages
4. Turn order display UI
5. PP regeneration call verification

### PHASE 2: CORE MECHANICS (2-3 weeks)
Complete partially-built systems:
6. Status effect processing (poison/burn damage)
7. Evasion dodge checks
8. Equipment special effects processing
9. Shop refactoring (remove item code)
10. Equipment drops

### PHASE 3: NEW FEATURES (3-4 weeks)
Build missing medium-complexity systems:
11. Camera follow system
12. NPC dialogue UI
13. Battle transitions
14. Treasure chest system

### PHASE 4: MAJOR SYSTEMS (4-6 weeks)
Implement large architectural additions:
15. Save/Load system
16. Inn rest system
17. Party management UI
18. Djinn collection + UI
19. Class change system

---

## RISK ASSESSMENT

### LOW RISK (Can implement without breaking existing code)
- Critical hit UI
- Element advantage messages
- Battle flee hookup
- Turn order display
- Camera follow (CSS only)
- Battle transitions (screen wrapper)

### MEDIUM RISK (May affect existing battle flow)
- Status effect processing (battle turn loop changes)
- Evasion checks (damage calculation changes)
- Equipment special effects (multiple function updates)
- PP regeneration (victory flow changes)

### HIGH RISK (Major architectural changes)
- Class change system (affects stat calculations)
- Djinn system (affects team composition + battle)
- Party management (affects unit selection everywhere)
- Save/Load (affects state management architecture)

---

## CONCLUSION

**The codebase has excellent bones** - Battle system is solid, type safety is strong, and many "missing" features are actually 60-90% complete and just need final hookup/polish.

**Recommended Approach:**
1. Start with TIER 1 features (1-2 weeks of quick wins)
2. Move to TIER 2 refactoring (2-3 weeks of cleanup)
3. Build TIER 3 new systems (4-6 weeks of development)

**Total Estimated Time: 7-11 weeks** for all 21 features

**Best ROI:** Focus on Tier 1 first - will show immediate progress with minimal risk.
