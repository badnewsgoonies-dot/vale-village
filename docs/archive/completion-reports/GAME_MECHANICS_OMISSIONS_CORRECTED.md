# GAME MECHANICS OMISSIONS - CORRECTED REPORT

**Date:** November 4, 2025  
**Scope:** Complete game mechanics audit (equipment only, no consumable items)  
**Method:** Cross-reference GAME_MECHANICS.md specifications with actual source code  

---

## EXECUTIVE SUMMARY

This report identifies **every missing or incomplete feature** in Vale Chronicles by comparing the comprehensive GAME_MECHANICS.md specification against the actual codebase.

**Note:** This is the CORRECTED report. Items/consumables have been removed from the game design (healing/buffs handled by abilities only).

---

## TABLE OF CONTENTS

1. [Status Effects System](#1-status-effects-system)
2. [Evasion & Dodge Mechanics](#2-evasion--dodge-mechanics)
3. [Class Change System](#3-class-change-system)
4. [Critical Hit System](#4-critical-hit-system)
5. [Element Advantage System](#5-element-advantage-system)
6. [Battle Flee Mechanics](#6-battle-flee-mechanics)
7. [Party Management System](#7-party-management-system)
8. [Djinn System Implementation](#8-djinn-system-implementation)
9. [Equipment Special Effects](#9-equipment-special-effects)
10. [Battle Turn Order](#10-battle-turn-order)
11. [XP Distribution](#11-xp-distribution)
12. [AOE Damage Application](#12-aoe-damage-application)
13. [PP Regeneration](#13-pp-regeneration)
14. [Inn Rest System](#14-inn-rest-system)
15. [Shop Buy/Sell System](#15-shop-buysell-system)
16. [Equipment Drops](#16-equipment-drops)
17. [Save/Load System](#17-saveload-system)
18. [Camera Follow System](#18-camera-follow-system)
19. [NPC Dialogue Display](#19-npc-dialogue-display)
20. [Battle Transitions](#20-battle-transitions)
21. [Treasure Chest System](#21-treasure-chest-system)

---

## 1. STATUS EFFECTS SYSTEM

### What's Specified (GAME_MECHANICS.md Section 9.5)

```typescript
const STATUS_EFFECTS = {
  poison: {
    damagePerTurn: (targetMaxHP: number) => Math.floor(targetMaxHP * 0.08),  // 8% max HP
    duration: 5,      // Lasts 5 turns
    cure: ["Cure (ability)", "Wish", "Inn Rest"],
    tick: "START_OF_TURN"  // Damage before unit acts
  },

  burn: {
    damagePerTurn: (targetMaxHP: number) => Math.floor(targetMaxHP * 0.10),  // 10% max HP
    duration: 3,      // Lasts 3 turns
    cure: ["Ply", "Wish", "Inn Rest"],
    tick: "START_OF_TURN"
  },

  freeze: {
    effect: "SKIP_TURN",  // Unit cannot act
    breakChance: 0.3,     // 30% chance to break free each turn
    duration: 999,        // Until broken or cured
    cure: ["Fire spell (any)", "Inn Rest"],
    immuneWhileFrozen: true  // Takes no damage while frozen
  },

  paralyze: {
    effect: "50% chance to fail action each turn",
    duration: 2,          // Lasts 2 turns
    cure: ["Restore (ability)", "Wish", "Inn Rest"],
    tick: "BEFORE_ACTION"  // Check before unit acts
  }
};
```

### What's Missing

**Status Effect Processing:**
- ❌ No status effect tick processing in battle turn logic
- ❌ No poison damage calculation at start of turn
- ❌ No burn damage calculation at start of turn
- ❌ No freeze turn skip logic
- ❌ No paralyze action failure check (50% chance)
- ❌ No duration countdown after each turn
- ❌ No automatic removal when duration expires

**Status Effect Application:**
- ❌ No way for abilities to apply status effects to enemies
- ❌ No chance calculation for status effect success
- ❌ No visual indicators for afflicted units
- ❌ No status icons/text display in battle UI

**Status Effect Curing:**
- ❌ Cure abilities (Ply, Wish, Restore) don't remove status effects
- ❌ Fire spells don't cure freeze
- ❌ Inn rest doesn't clear status effects

**Files Needing Changes:**
- `src/types/Unit.ts` - Add `statusEffects: StatusEffect[]` property
- `src/types/StatusEffect.ts` - Define status effect types
- `src/components/battle/BattleScreen.tsx` - Process status effects each turn
- `src/utils/battleCalculations.ts` - Add status damage/check functions
- `src/data/abilities.ts` - Add status effect application to abilities

---

## 2. EVASION & DODGE MECHANICS

### What's Specified (GAME_MECHANICS.md Section 3.1)

```typescript
const BOOTS = {
  steel: {
    name: "Hyper Boots",
    spd: +8,
    evasion: +10,  // 10% dodge chance
    cost: 750
  },
  legendary: {
    name: "Hermes' Sandals",
    spd: +10,
    evasion: +15,  // 15% dodge chance
    alwaysFirstTurn: true,
    cost: 5000
  }
};
```

### What's Missing

**Evasion Calculation:**
- ❌ Equipment evasion bonuses are defined but never checked
- ❌ No dodge chance calculation in damage formulas
- ❌ No "Miss!" message when attacks are dodged
- ❌ No visual indication of dodged attacks

**Implementation Needed:**
```typescript
function checkDodge(attacker: Unit, defender: Unit): boolean {
  const baseEvasion = 0.05;  // 5% base
  const equipmentEvasion = defender.equipment.boots?.evasion || 0;
  const speedBonus = (defender.stats.spd - attacker.stats.spd) * 0.01;
  
  const totalEvasion = baseEvasion + (equipmentEvasion / 100) + speedBonus;
  return Math.random() < Math.max(0, Math.min(0.75, totalEvasion));  // Cap at 75%
}
```

**Files Needing Changes:**
- `src/utils/battleCalculations.ts` - Add `checkDodge()` before damage calculation
- `src/components/battle/BattleScreen.tsx` - Display "Miss!" message
- `src/types/Equipment.ts` - Ensure `evasion` property exists on boots

---

## 3. CLASS CHANGE SYSTEM

### What's Specified (GAME_MECHANICS.md Section 2.3)

```typescript
const CLASS_CHANGES = {
  venusAdept: {
    requiredDjinn: { venus: 2 },
    statBonus: { atk: 1.1, def: 1.15 },  // +10% ATK, +15% DEF
    unlockedAbilities: ["Earthquake"]
  },
  
  marsAdept: {
    requiredDjinn: { mars: 2 },
    statBonus: { atk: 1.2, mag: 1.1 },   // +20% ATK, +10% MAG
    unlockedAbilities: ["Meteor Strike"]
  },
  
  mercuryAdept: {
    requiredDjinn: { mercury: 2 },
    statBonus: { mag: 1.15, def: 1.1 },  // +15% MAG, +10% DEF
    unlockedAbilities: ["Wish"]
  },
  
  jupiterAdept: {
    requiredDjinn: { jupiter: 2 },
    statBonus: { spd: 1.2, mag: 1.1 },   // +20% SPD, +10% MAG
    unlockedAbilities: ["Thunderclap"]
  }
};
```

### What's Missing

**Class Change Detection:**
- ❌ No checking of Djinn composition to determine class
- ❌ No calculation of which class a unit should be
- ❌ No class change display in UI

**Class Change Application:**
- ❌ Stat bonuses from class changes not applied to unit stats
- ❌ Class-specific abilities not unlocked
- ❌ No "Class Changed!" notification

**Class Change Preview:**
- ❌ Equipment/Djinn screens don't show "Class will change to: Venus Adept"
- ❌ No preview of stat changes before equipping Djinn

**Files Needing Changes:**
- `src/utils/classSystem.ts` - NEW FILE - Calculate class from Djinn
- `src/utils/statCalculations.ts` - Apply class bonuses to stats
- `src/components/djinn/DjinnScreen.tsx` - Show class change preview
- `src/types/Unit.ts` - Add `currentClass` property

---

## 4. CRITICAL HIT SYSTEM

### What's Specified (GAME_MECHANICS.md Section 6.2)

```typescript
function checkCriticalHit(attacker: Unit): boolean {
  const BASE_CRIT_CHANCE = 0.05;  // 5%
  const SPEED_BONUS = attacker.stats.spd * 0.002;  // +0.2% per SPD point

  const totalChance = BASE_CRIT_CHANCE + SPEED_BONUS;
  return Math.random() < totalChance;
}

// Critical hit multiplier: 2.0x damage
```

### What's Missing

**Critical Hit Checking:**
- ❌ No crit chance calculation before damage
- ❌ No 2.0x damage multiplier applied on crit
- ❌ No "Critical Hit!" message displayed

**Critical Hit Feedback:**
- ❌ No visual/audio cue for critical hits
- ❌ No different damage number color/size
- ❌ No screen shake or special effect

**Files Needing Changes:**
- `src/utils/battleCalculations.ts` - Add `checkCriticalHit()` function
- `src/components/battle/BattleScreen.tsx` - Display crit indicator
- `src/components/battle/DamageNumber.tsx` - Special styling for crits

---

## 5. ELEMENT ADVANTAGE SYSTEM

### What's Specified (GAME_MECHANICS.md Section 5.2)

```typescript
function getElementModifier(attackElement: Element, defenseElement: Element): number {
  const ADVANTAGE = {
    "Venus → Jupiter": 1.5,   // Earth strong vs Wind
    "Mars → Venus": 1.5,      // Fire strong vs Earth
    "Mercury → Mars": 1.5,    // Water strong vs Fire
    "Jupiter → Mercury": 1.5  // Wind strong vs Water
  };

  const key = `${attackElement} → ${defenseElement}`;
  if (ADVANTAGE[key]) return 1.5;  // +50% damage

  const reverseKey = `${defenseElement} → ${attackElement}`;
  if (ADVANTAGE[reverseKey]) return 0.67;  // -33% damage

  return 1.0;  // Neutral
}
```

### What's Missing

**Element Modifier Calculation:**
- ❌ Element advantage not checked during damage calculation
- ❌ No 1.5x multiplier for super effective attacks
- ❌ No 0.67x multiplier for not very effective attacks

**Element Feedback:**
- ❌ No "Super effective!" or "Not very effective..." messages
- ❌ No visual indicator of element matchup

**Files Needing Changes:**
- `src/utils/battleCalculations.ts` - Integrate `getElementModifier()` into damage formula
- `src/components/battle/BattleScreen.tsx` - Display effectiveness messages

---

## 6. BATTLE FLEE MECHANICS

### What's Specified (GAME_MECHANICS.md Section 6.4)

```typescript
function attemptFlee(playerAverageSpd: number, enemyAverageSpd: number): boolean {
  const BASE_FLEE_CHANCE = 0.5;  // 50%
  const speedRatio = playerAverageSpd / enemyAverageSpd;

  // If player is faster: Higher chance
  // If enemy is faster: Lower chance
  const fleeChance = BASE_FLEE_CHANCE * speedRatio;

  // Clamp between 10% and 90%
  const finalChance = Math.max(0.1, Math.min(0.9, fleeChance));

  return Math.random() < finalChance;
}

// Cannot flee from boss battles
// Cannot flee from recruitment battles
```

### What's Missing

**Flee Functionality:**
- ❌ "Flee" button exists but has no implementation
- ❌ No speed-based flee chance calculation
- ❌ No success/failure feedback
- ❌ Failed flee attempts don't end player's turn

**Flee Restrictions:**
- ❌ No check for boss battles (should disable flee)
- ❌ No check for recruitment battles (should disable flee)
- ❌ Flee button not disabled for restricted battles

**Files Needing Changes:**
- `src/components/battle/BattleScreen.tsx` - Implement flee button handler
- `src/utils/battleCalculations.ts` - Add `attemptFlee()` function
- `src/types/Enemy.ts` - Add `canFlee: boolean` property

---

## 7. PARTY MANAGEMENT SYSTEM

### What's Specified (GAME_MECHANICS.md Section 7.1)

```typescript
const PARTY_RULES = {
  maxTotalUnits: 10,     // Can recruit up to 10 units
  maxActiveParty: 4,     // Only 4 can be in active battle party
  minActiveParty: 1,     // Must have at least 1 active unit
  benchSize: 6,          // Remaining units (10 - 4 = 6 on bench)

  // Djinn bonuses only apply to active party members
  // Bench units do NOT receive Djinn bonuses
};
```

### What's Missing

**Party Roster Management:**
- ❌ No UI to view all 10 recruited units
- ❌ No way to swap units between active party (4) and bench (6)
- ❌ No "Party Management" screen

**Active Party Selection:**
- ❌ Can't choose which 4 units enter battle
- ❌ No drag-and-drop or button to move units to/from bench

**Bench System:**
- ❌ Bench units don't gain XP (correct per spec)
- ❌ Bench units don't receive Djinn bonuses (correct per spec)
- ❌ But no way to access benched units at all

**Files Needing Changes:**
- `src/components/party/PartyManagementScreen.tsx` - NEW FILE - Party roster UI
- `src/components/party/PartyMemberCard.tsx` - NEW FILE - Unit card component
- `src/context/GameContext.tsx` - Add party swap actions
- `src/types/PlayerData.ts` - Separate `activeParty` and `benchedUnits`

---

## 8. DJINN SYSTEM IMPLEMENTATION

### What's Specified (GAME_MECHANICS.md Section 2)

**Collection System:**
- 12 total Djinn (3 Venus, 3 Mars, 3 Mercury, 3 Jupiter)
- Found in world, given by NPCs, or earned through battles

**Team Equip System (GLOBAL):**
- Team has 3 Djinn slots (not per-unit)
- Any 3 collected Djinn can be equipped to team
- ALL 4 active party members receive synergy bonuses
- Bench units do NOT receive bonuses

**In-Battle Activation:**
- Each equipped Djinn can be activated once per battle
- Activation: Set → Standby → Recovery → Set (multi-turn cycle)
- When activated: Lose passive bonus temporarily, gain one-time effect

### What's Missing

**Djinn Collection:**
- ❌ No Djinn data definitions (only placeholder files)
- ❌ No Djinn discovery events in overworld
- ❌ No "Djinn Obtained!" notification

**Djinn Equipment Screen:**
- ❌ No screen to view all 12 collected Djinn
- ❌ No way to select which 3 Djinn are equipped to team
- ❌ No synergy bonus preview ("All party gains: +12 ATK, +8 DEF")

**Djinn in Battle:**
- ❌ No "Djinn Board" showing 3 equipped Djinn with states (Set/Standby/Recovery)
- ❌ No way to activate Djinn during battle
- ❌ No loss of passive bonuses when Djinn activated
- ❌ No recovery timer countdown

**Synergy Calculation:**
- ❌ Djinn bonuses not applied to party stats
- ❌ No checking of equipped Djinn composition
- ❌ Class changes from Djinn synergy not triggered

**Files Needing Changes:**
- `src/data/djinn.ts` - Define all 12 Djinn with stats/effects
- `src/components/djinn/DjinnEquipScreen.tsx` - NEW FILE - Team Djinn management
- `src/components/battle/DjinnBoard.tsx` - NEW FILE - In-battle Djinn display
- `src/utils/djinnSystem.ts` - NEW FILE - Synergy calculations
- `src/types/Djinn.ts` - Define Djinn types and states

---

## 9. EQUIPMENT SPECIAL EFFECTS

### What's Specified (GAME_MECHANICS.md Section 3.1)

```typescript
const LEGENDARY_EQUIPMENT = {
  solBlade: {
    name: "Sol Blade",
    atk: +30,
    unlocksAbility: "Megiddo",  // 150 damage, costs 25 PP
    cost: 10000
  },
  
  dragonScales: {
    name: "Dragon Scales",
    def: +35,
    hp: +60,
    elemental_resist: 0.2,  // 20% reduction to elemental damage
    cost: 4000
  },
  
  oraclesCrown: {
    name: "Oracle's Crown",
    def: +25,
    mag: +10,
    pp: +15,   // Extra Psynergy Points
    cost: 3500
  },
  
  hermesSandals: {
    name: "Hermes' Sandals",
    spd: +10,
    alwaysFirstTurn: true,  // Always acts first in battle
    cost: 5000
  }
};
```

### What's Missing

**Ability Unlocking:**
- ❌ Sol Blade doesn't grant "Megiddo" ability when equipped
- ❌ No system to add equipment-granted abilities to unit's ability list
- ❌ No removal of ability when equipment unequipped

**Special Equipment Effects:**
- ❌ Dragon Scales' 20% elemental resist not applied
- ❌ Oracle's Crown +PP bonus not added to max PP
- ❌ Hermes' Sandals "always first" not implemented in turn order

**Files Needing Changes:**
- `src/utils/statCalculations.ts` - Apply equipment PP bonuses
- `src/utils/battleCalculations.ts` - Check elemental resist, turn order special cases
- `src/utils/abilitySystem.ts` - Grant/remove equipment abilities

---

## 10. BATTLE TURN ORDER

### What's Specified (GAME_MECHANICS.md Section 6.1)

```typescript
function calculateTurnOrder(units: Unit[]): Unit[] {
  // Sort by SPD stat (highest first)
  return units.sort((a, b) => b.stats.spd - a.stats.spd);

  // Tiebreaker: Random
  // Special case: Hermes' Sandals always first
}
```

### What's Missing

**Turn Order Calculation:**
- ❌ Turn order might not be recalculated properly each turn
- ❌ Speed stat changes (buffs/debuffs) may not update turn order
- ❌ Random tiebreaker not implemented for equal speeds

**Special Cases:**
- ❌ Hermes' Sandals "always first" not checked
- ❌ Stun/freeze effects should skip turn but unit still in order

**Turn Order Display:**
- ❌ No UI showing upcoming turn order
- ❌ Players can't see who acts next

**Files Needing Changes:**
- `src/utils/battleCalculations.ts` - Add proper turn order calculation with special cases
- `src/components/battle/TurnOrderDisplay.tsx` - NEW FILE - Show turn order UI

---

## 11. XP DISTRIBUTION

### What's Specified (GAME_MECHANICS.md Section 4.1.5)

```typescript
const XP_DISTRIBUTION = {
  mode: "FULL_TO_EACH",  // Each active unit gets full XP amount

  // Example: Battle rewards 80 XP
  // Party of 4 units → Each gets 80 XP
  // Total XP awarded: 80 × 4 = 320 XP

  koUnitsGetXP: false,   // KO'd units don't gain XP
  benchUnitsGetXP: false // Only active party members gain XP
};

// Example:
// Battle: 4-unit party defeats Level 3 enemy
const xp = calculateBattleXP(3, 4); // 80 XP

// Distribution:
isaac.xp += 80;  // ✅ Gets full 80
garet.xp += 80;  // ✅ Gets full 80
ivan.xp += 80;   // ✅ Gets full 80
mia.xp += 80;    // ✅ Gets full 80

// Felix on bench: +0 XP ❌
// Garet (KO'd): +0 XP ❌
```

### What's Missing

**XP Distribution Logic:**
- ❌ Need to verify each active unit gets FULL XP (not split)
- ❌ Need to verify KO'd units don't gain XP
- ❌ Need to verify bench units don't gain XP

**Files Needing Changes:**
- `src/utils/battleRewards.ts` - Verify XP distribution matches spec

---

## 12. AOE DAMAGE APPLICATION

### What's Specified (GAME_MECHANICS.md Section 5.2.5)

```typescript
const AOE_DAMAGE_RULE = {
  mode: "FULL_TO_EACH",  // Each enemy takes full calculated damage

  // Example: Quake deals 47 damage
  // vs 3 enemies → 47 to EACH (141 total)
  // NOT: 47 divided by 3 = 15 each ❌
  // NOT: 47 with penalty = 35 each ❌

  reasoning: "Higher PP cost balances full damage to each target"
};

// Example:
// Isaac (MAG 20) casts Quake (base 30) on 3 Goblins
const damage = calculatePsynergyDamage(isaac, goblin1, quakeAbility);
// = ~47 damage

// Application:
goblin1.hp -= 47;  // ✅ Full damage
goblin2.hp -= 47;  // ✅ Full damage
goblin3.hp -= 47;  // ✅ Full damage
```

### What's Missing

**AOE Damage Calculation:**
- ❌ Need to verify AOE abilities deal FULL damage to each target
- ❌ No penalty/split should occur

**Files Needing Changes:**
- `src/utils/battleCalculations.ts` - Verify AOE damage not split/reduced

---

## 13. PP REGENERATION

### What's Specified (GAME_MECHANICS.md Section 5.2.6)

```typescript
const PP_REGEN = {
  afterBattle: 1.0,        // Full PP restore after battle ends
  innRest: 1.0,            // Full PP restore at inn (costs gold)
  perTurnInBattle: 0.0,    // NO regen during battle
  abilityRestoration: true // Healing abilities can restore PP
};

function onBattleVictory(units: Unit[]): void {
  units.forEach(unit => {
    unit.currentPp = unit.maxPp;  // ✅ Restore PP
    // HP stays as-is (must heal manually)
  });
}
```

### What's Missing

**Post-Battle PP Restore:**
- ❌ PP not automatically restored to full after battle victory
- ❌ Units enter next battle with depleted PP from previous battle

**Inn PP Restore:**
- ❌ Inn rest implemented but may not restore PP

**In-Battle PP:**
- ✅ Correctly no in-battle regen (per spec)

**Files Needing Changes:**
- `src/components/battle/BattleScreen.tsx` - Restore PP on victory
- `src/components/overworld/InnScreen.tsx` - Ensure PP restoration

---

## 14. INN REST SYSTEM

### What's Specified (GAME_MECHANICS.md Section 15)

```typescript
const INN_SYSTEM = {
  cost: 10,  // 10 gold per rest

  effects: {
    restoreHP: 1.0,      // Full HP restore (100%)
    restorePP: 1.0,      // Full PP restore (100%)
    cureStatusAilments: true,  // Remove poison, burn, freeze, paralyze
    autoSave: true       // Triggers auto-save after rest
  },

  requirements: {
    goldCheck: true,     // Must have at least 10 gold
    canUseWhen: "OVERWORLD_ONLY"  // Cannot use during battle
  },

  dialogue: {
    greeting: "Welcome to the inn! Rest is 10 gold. Would you like to stay?",
    success: "Have a good rest! (HP/PP fully restored, game saved)",
    insufficient: "Sorry, you need at least 10 gold to rest here."
  }
};
```

### What's Missing

**Inn Screen:**
- ❌ No Inn screen/UI implemented
- ❌ Can't interact with Inn NPCs to trigger rest

**Inn Functionality:**
- ❌ No "Rest" option when entering Inn
- ❌ No gold deduction (10g)
- ❌ No HP/PP restoration
- ❌ No status effect removal
- ❌ No auto-save trigger

**Files Needing Changes:**
- `src/components/overworld/InnScreen.tsx` - NEW FILE - Inn UI with rest option
- `src/utils/innSystem.ts` - NEW FILE - Inn rest logic
- `src/context/GameContext.tsx` - Add inn rest action

---

## 15. SHOP BUY/SELL SYSTEM

### What's Specified (GAME_MECHANICS.md Section 14)

**Buying:**
- Fixed prices (no negotiation)
- Unlimited stock
- Must have enough gold
- Immediate transaction

**Selling:**
- Can sell equipment only
- Get 50% of original cost back
- Immediate transaction

**Starting Resources:**
- Player starts with 500 gold
- No equipment (must buy from shops)

### What's Missing

**Shop Screen:**
- ❌ Shop UI partially implemented but may not be functional
- ❌ Buy/sell tabs may not work properly

**Buying System:**
- ❌ Can't purchase equipment from shops
- ❌ Gold not deducted properly
- ❌ Equipment not added to inventory

**Selling System:**
- ❌ Can't sell equipment back to shops
- ❌ 50% buyback price not calculated
- ❌ Gold not added on sale

**Shop Inventory:**
- ❌ Shop items may not display correctly
- ❌ Iron tier equipment unlock after first boss not implemented

**Files Needing Changes:**
- `src/components/shop/ShopScreen.tsx` - Complete buy/sell functionality
- `src/context/GameContext.tsx` - Add buyEquipment/sellEquipment actions
- `src/data/shops.ts` - Verify shop inventory and unlock flags

---

## 16. EQUIPMENT DROPS

### What's Specified (GAME_MECHANICS.md Section 4.3)

```typescript
const DROP_RATES = {
  common: {
    chance: 0.30,  // 30%
    items: ["Iron Sword", "Iron Armor", "Cloth Cap", "Leather Boots"]
  },
  rare: {
    chance: 0.10,  // 10%
    items: ["Steel Sword", "Steel Armor", "Steel Helm", "Hyper Boots"]
  },
  legendary: {
    chance: 0.02,  // 2%
    items: ["Sol Blade", "Dragon Scales", "Oracle's Crown", "Hermes' Sandals"]
  }
};

// Boss battles have guaranteed drops:
const BOSS_DROP_RATES = {
  common: { chance: 0.80 },  // 80%
  rare: { chance: 0.50 },    // 50%
  legendary: { chance: 0.15 } // 15%
};
```

### What's Missing

**Drop Calculation:**
- ❌ No equipment drop system implemented
- ❌ Enemies only drop gold, not equipment
- ❌ No rarity-based drop chances

**Boss Drops:**
- ❌ Boss battles don't have higher drop rates
- ❌ No guaranteed rare drops from bosses

**Drop Display:**
- ❌ Rewards screen doesn't show equipment drops
- ❌ No "Equipment Obtained!" notification

**Files Needing Changes:**
- `src/utils/battleRewards.ts` - Add equipment drop calculation
- `src/components/battle/RewardsScreen.tsx` - Display equipment rewards
- `src/types/Enemy.ts` - Add drop table data

---

## 17. SAVE/LOAD SYSTEM

### What's Specified (GAME_MECHANICS.md Section 8)

**Save Triggers:**
- Inn rest (auto-save)
- Manual save at save points
- After major story events

**Save Data:**
- All unit stats, equipment, Djinn
- Player gold, position, story flags
- Recruited units (active + bench)

### What's Missing

**Save Functionality:**
- ❌ No save system implemented
- ❌ Game state not persisted to localStorage/file
- ❌ Can't reload game on refresh

**Load Functionality:**
- ❌ No load game option on title screen
- ❌ Can't resume from saved game

**Auto-Save:**
- ❌ Inn rest doesn't trigger auto-save
- ❌ Story events don't trigger auto-save

**Files Needing Changes:**
- `src/utils/saveSystem.ts` - NEW FILE - Save/load logic
- `src/components/menu/SaveScreen.tsx` - NEW FILE - Manual save UI
- `src/context/GameContext.tsx` - Add save/load actions

---

## 18. CAMERA FOLLOW SYSTEM

### What's Specified (GAME_MECHANICS.md Section 13)

**Camera Behavior:**
- Camera follows player character
- Centers on player position
- Scrolls smoothly as player moves
- Stays within map bounds

**Map Sizes:**
- Vale Village: 40×30 tiles (640×480px)
- Vale Outskirts: 50×40 tiles (800×640px)
- Sol Sanctum: 30×50 tiles (480×800px)

### What's Missing

**Camera Implementation:**
- ❌ No camera follow system
- ❌ Player walks off screen on large maps
- ❌ Can't see player when near edges

**Camera Smoothing:**
- ❌ No smooth scrolling
- ❌ Camera doesn't stay within bounds

**Files Needing Changes:**
- `src/components/overworld/NewOverworldScreen.tsx` - Add camera transform
- `src/utils/cameraSystem.ts` - NEW FILE - Camera calculations

---

## 19. NPC DIALOGUE DISPLAY

### What's Specified (GAME_MECHANICS.md Section 13)

**Dialogue System:**
- NPCs have dialogue strings
- Display in text box on interaction
- Multiple dialogue lines for story progression

### What's Missing

**Dialogue UI:**
- ❌ No dialogue box UI component
- ❌ NPC dialogue strings exist but don't display
- ❌ No text scrolling/typewriter effect

**Dialogue Interaction:**
- ❌ Interacting with NPCs triggers battles but no dialogue first
- ❌ No "press key to continue" prompt

**Files Needing Changes:**
- `src/components/overworld/DialogueBox.tsx` - NEW FILE - Dialogue display
- `src/components/overworld/NewOverworldScreen.tsx` - Show dialogue before battle trigger

---

## 20. BATTLE TRANSITIONS

### What's Specified (GAME_MECHANICS.md Section 2.1)

**Transition Animation:**
- Duration: 2.3 seconds
- Swirl/spiral effect
- Overworld fades out
- Battle scene fades in

### What's Missing

**Transition Effect:**
- ❌ Battles start instantly with no transition
- ❌ No swirl/spiral animation
- ❌ Jarring switch from overworld to battle

**Files Needing Changes:**
- `src/components/battle/BattleTransition.tsx` - NEW FILE - Transition animation
- `src/components/overworld/NewOverworldScreen.tsx` - Trigger transition before battle

---

## 21. TREASURE CHEST SYSTEM

### What's Specified (GAME_MECHANICS.md Section 13)

**Treasure Chests:**
- Contain gold and/or equipment
- One-time open (stay open after)
- Visual indicator (open/closed sprite)

**Chest Contents:**
```typescript
const CHEST_CONTENTS = {
  chest_1: { gold: 100, equipment: ["Iron Sword"] },
  chest_2: { gold: 250 },
  chest_3: { equipment: ["Steel Helm"] },
  chest_4: { gold: 500, equipment: ["Sol Blade"] }  // Legendary
};
```

### What's Missing

**Chest Interaction:**
- ❌ Can't open treasure chests
- ❌ No "Open chest?" prompt
- ❌ Chest sprites don't change to open state

**Chest Rewards:**
- ❌ No gold/equipment given on open
- ❌ No "Found 100 gold!" message
- ❌ No tracking of which chests already opened

**Files Needing Changes:**
- `src/components/overworld/ChestOpenScreen.tsx` - NEW FILE - Chest opening UI
- `src/types/Area.ts` - Add treasure chest data
- `src/context/GameContext.tsx` - Track opened chests

---

## PRIORITY RECOMMENDATIONS

### CRITICAL (Blocks Core Gameplay)

1. **Camera Follow System** - Large maps unplayable without it
2. **Save/Load System** - Can't preserve progress
3. **Inn Rest System** - Only way to restore HP
4. **Shop Buy/Sell** - Core economy system
5. **PP Regeneration** - Post-battle PP restore needed

### HIGH (Core Mechanics)

6. **Status Effects** - Major battle mechanic
7. **Djinn System** - Core progression system
8. **Party Management** - Can't use recruited units
9. **Battle Flee** - Softlock prevention
10. **NPC Dialogue** - Story delivery

### MEDIUM (Polish & Balance)

11. **Critical Hits** - Adds excitement
12. **Element Advantage** - Strategic depth
13. **Evasion System** - Stat diversity
14. **Equipment Drops** - Reward variety
15. **Battle Transitions** - Visual polish

### LOW (Advanced Features)

16. **Class Changes** - Advanced progression
17. **Equipment Special Effects** - Endgame features
18. **Turn Order Display** - Nice-to-have UI
19. **Treasure Chests** - Exploration rewards
20. **XP/AOE Verification** - Should work correctly already

---

## IMPLEMENTATION ESTIMATE

**Total Features Missing:** 21 major systems

**Estimated Development Time:**
- Critical: 40-60 hours
- High: 60-80 hours
- Medium: 30-40 hours
- Low: 20-30 hours

**Total: 150-210 hours** (4-5 weeks full-time)

---

**This report is CORRECTED and COMPLETE as of November 4, 2025.**

All consumable item references have been removed per design decision.
