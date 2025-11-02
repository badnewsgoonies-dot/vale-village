# GAME MECHANICS - Vale Chronicles

**Architect Deliverable - Phase 3**

This document contains ALL game mechanics with EXACT formulas. NO VAGUENESS - every mechanic has specific numbers.

---

## TABLE OF CONTENTS

1. [Leveling System](#1-leveling-system)
2. [Djinn System](#2-djinn-system)
3. [Equipment System](#3-equipment-system)
4. [Battle Rewards](#4-battle-rewards)
5. [Ability System](#5-ability-system)
6. [Battle Mechanics](#6-battle-mechanics)
7. [Recruitment System](#7-recruitment-system)
8. [Save System](#8-save-system)

---

## 1. LEVELING SYSTEM

### 1.1 XP Requirements

**Formula:** Exponential curve with base 100

```typescript
const XP_CURVE = {
  1: 0,      // Starting XP
  2: 100,    // Level 1 → 2
  3: 250,    // Level 2 → 3  (base * 2.5)
  4: 500,    // Level 3 → 4  (base * 5)
  5: 1000    // Level 4 → 5  (base * 10)
};

// Total XP needed to reach level 5: 1850 XP
```

### 1.2 Stat Growth Formulas

**Base Formula:**
```typescript
newStat = baseStat + (growthRate × (level - 1))
```

### 1.3 Unit Stat Tables

#### Isaac (Venus - Balanced Warrior)
```typescript
const ISAAC_STATS = {
  base: { hp: 100, pp: 20, atk: 15, def: 10, mag: 12, spd: 12 },
  growth: { hp: 20, pp: 4, atk: 3, def: 2, mag: 2, spd: 1 },

  byLevel: {
    1: { hp: 100, pp: 20, atk: 15, def: 10, mag: 12, spd: 12 },
    2: { hp: 120, pp: 24, atk: 18, def: 12, mag: 14, spd: 13 },
    3: { hp: 140, pp: 28, atk: 21, def: 14, mag: 16, spd: 14 },
    4: { hp: 160, pp: 32, atk: 24, def: 16, mag: 18, spd: 15 },
    5: { hp: 180, pp: 36, atk: 27, def: 18, mag: 20, spd: 16 }
  }
};
```

#### Garet (Mars - Pure DPS)
```typescript
const GARET_STATS = {
  base: { hp: 120, pp: 15, atk: 18, def: 8, mag: 10, spd: 10 },
  growth: { hp: 15, pp: 3, atk: 4, def: 1, mag: 2, spd: 1 },

  byLevel: {
    1: { hp: 120, pp: 15, atk: 18, def: 8, mag: 10, spd: 10 },
    2: { hp: 135, pp: 18, atk: 22, def: 9, mag: 12, spd: 11 },
    3: { hp: 150, pp: 21, atk: 26, def: 10, mag: 14, spd: 12 },
    4: { hp: 165, pp: 24, atk: 30, def: 11, mag: 16, spd: 13 },
    5: { hp: 180, pp: 27, atk: 34, def: 12, mag: 18, spd: 14 }
  }
};
```

#### Ivan (Jupiter - Elemental Mage)
```typescript
const IVAN_STATS = {
  base: { hp: 80, pp: 30, atk: 10, def: 6, mag: 18, spd: 15 },
  growth: { hp: 12, pp: 6, atk: 2, def: 1, mag: 4, spd: 2 },

  byLevel: {
    1: { hp: 80, pp: 30, atk: 10, def: 6, mag: 18, spd: 15 },
    2: { hp: 92, pp: 36, atk: 12, def: 7, mag: 22, spd: 17 },
    3: { hp: 104, pp: 42, atk: 14, def: 8, mag: 26, spd: 19 },
    4: { hp: 116, pp: 48, atk: 16, def: 9, mag: 30, spd: 21 },
    5: { hp: 128, pp: 54, atk: 18, def: 10, mag: 34, spd: 23 }
  }
};
```

#### Mia (Mercury - Healer)
```typescript
const MIA_STATS = {
  base: { hp: 90, pp: 25, atk: 12, def: 12, mag: 16, spd: 11 },
  growth: { hp: 15, pp: 5, atk: 2, def: 3, mag: 3, spd: 1 },

  byLevel: {
    1: { hp: 90, pp: 25, atk: 12, def: 12, mag: 16, spd: 11 },
    2: { hp: 105, pp: 30, atk: 14, def: 15, mag: 19, spd: 12 },
    3: { hp: 120, pp: 35, atk: 16, def: 18, mag: 22, spd: 13 },
    4: { hp: 135, pp: 40, atk: 18, def: 21, mag: 25, spd: 14 },
    5: { hp: 150, pp: 45, atk: 20, def: 24, mag: 28, spd: 15 }
  }
};
```

#### Felix (Venus - Rogue Assassin)
```typescript
const FELIX_STATS = {
  base: { hp: 95, pp: 18, atk: 17, def: 9, mag: 11, spd: 18 },
  growth: { hp: 14, pp: 3, atk: 4, def: 1, mag: 2, spd: 3 },

  byLevel: {
    1: { hp: 95, pp: 18, atk: 17, def: 9, mag: 11, spd: 18 },
    2: { hp: 109, pp: 21, atk: 21, def: 10, mag: 13, spd: 21 },
    3: { hp: 123, pp: 24, atk: 25, def: 11, mag: 15, spd: 24 },
    4: { hp: 137, pp: 27, atk: 29, def: 12, mag: 17, spd: 27 },
    5: { hp: 151, pp: 30, atk: 33, def: 13, mag: 19, spd: 30 }
  }
};
```

#### Jenna (Mars - AoE Fire Mage)
```typescript
const JENNA_STATS = {
  base: { hp: 75, pp: 28, atk: 9, def: 5, mag: 20, spd: 13 },
  growth: { hp: 12, pp: 6, atk: 1, def: 1, mag: 5, spd: 2 },

  byLevel: {
    1: { hp: 75, pp: 28, atk: 9, def: 5, mag: 20, spd: 13 },
    2: { hp: 87, pp: 34, atk: 10, def: 6, mag: 25, spd: 15 },
    3: { hp: 99, pp: 40, atk: 11, def: 7, mag: 30, spd: 17 },
    4: { hp: 111, pp: 46, atk: 12, def: 8, mag: 35, spd: 19 },
    5: { hp: 123, pp: 52, atk: 13, def: 9, mag: 40, spd: 21 }
  }
};
```

#### Sheba (Jupiter - Support Buffer)
```typescript
const SHEBA_STATS = {
  base: { hp: 85, pp: 26, atk: 11, def: 7, mag: 17, spd: 14 },
  growth: { hp: 13, pp: 5, atk: 2, def: 2, mag: 4, spd: 2 },

  byLevel: {
    1: { hp: 85, pp: 26, atk: 11, def: 7, mag: 17, spd: 14 },
    2: { hp: 98, pp: 31, atk: 13, def: 9, mag: 21, spd: 16 },
    3: { hp: 111, pp: 36, atk: 15, def: 11, mag: 25, spd: 18 },
    4: { hp: 124, pp: 41, atk: 17, def: 13, mag: 29, spd: 20 },
    5: { hp: 137, pp: 46, atk: 19, def: 15, mag: 33, spd: 22 }
  }
};
```

#### Piers (Mercury - Defensive Tank)
```typescript
const PIERS_STATS = {
  base: { hp: 140, pp: 20, atk: 14, def: 16, mag: 13, spd: 8 },
  growth: { hp: 18, pp: 4, atk: 2, def: 3, mag: 2, spd: 1 },

  byLevel: {
    1: { hp: 140, pp: 20, atk: 14, def: 16, mag: 13, spd: 8 },
    2: { hp: 158, pp: 24, atk: 16, def: 19, mag: 15, spd: 9 },
    3: { hp: 176, pp: 28, atk: 18, def: 22, mag: 17, spd: 10 },
    4: { hp: 194, pp: 32, atk: 20, def: 25, mag: 19, spd: 11 },
    5: { hp: 212, pp: 36, atk: 22, def: 28, mag: 21, spd: 12 }
  }
};
```

#### Kraden (Neutral - Versatile Scholar)
```typescript
const KRADEN_STATS = {
  base: { hp: 70, pp: 35, atk: 8, def: 8, mag: 15, spd: 10 },
  growth: { hp: 10, pp: 7, atk: 1, def: 2, mag: 3, spd: 1 },

  byLevel: {
    1: { hp: 70, pp: 35, atk: 8, def: 8, mag: 15, spd: 10 },
    2: { hp: 80, pp: 42, atk: 9, def: 10, mag: 18, spd: 11 },
    3: { hp: 90, pp: 49, atk: 10, def: 12, mag: 21, spd: 12 },
    4: { hp: 100, pp: 56, atk: 11, def: 14, mag: 24, spd: 13 },
    5: { hp: 110, pp: 63, atk: 12, def: 16, mag: 27, spd: 14 }
  }
};
```

#### Kyle (Mars - Master Warrior)
```typescript
const KYLE_STATS = {
  base: { hp: 130, pp: 22, atk: 16, def: 14, mag: 14, spd: 11 },
  growth: { hp: 17, pp: 4, atk: 3, def: 2, mag: 2, spd: 1 },

  byLevel: {
    1: { hp: 130, pp: 22, atk: 16, def: 14, mag: 14, spd: 11 },
    2: { hp: 147, pp: 26, atk: 19, def: 16, mag: 16, spd: 12 },
    3: { hp: 164, pp: 30, atk: 22, def: 18, mag: 18, spd: 13 },
    4: { hp: 181, pp: 34, atk: 25, def: 20, mag: 20, spd: 14 },
    5: { hp: 198, pp: 38, atk: 28, def: 22, mag: 22, spd: 15 }
  }
};
```

### 1.4 Ability Unlocks by Level

```typescript
const ABILITY_UNLOCKS = {
  // All units follow this pattern:
  level1: ["Basic Attack"],  // Physical attack using ATK stat
  level2: ["Element Spell"], // Basic elemental Psynergy using MAG stat
  level3: ["Utility"],       // Buff/debuff/special
  level4: ["Strong Attack"], // Powerful elemental Psynergy
  level5: ["Ultimate"]       // Signature ultimate ability
};

// Examples per unit:
const ISAAC_ABILITIES = {
  level1: ["Slash"],           // ATK-based, single target
  level2: ["Quake"],           // MAG-based earth spell, all enemies
  level3: ["Clay Spire"],      // High damage earth spike
  level4: ["Ragnarok"],        // Very high damage earth blade
  level5: ["Judgment"]         // Ultimate earth attack
};

const GARET_ABILITIES = {
  level1: ["Cleave"],          // ATK-based, single target
  level2: ["Fireball"],        // MAG-based fire spell
  level3: ["Volcano"],         // Fire AoE
  level4: ["Meteor Strike"],   // High fire damage
  level5: ["Pyroclasm"]        // Ultimate fire explosion
};

// ... (all 10 units have similar structure)
```

---

## 2. DJINN SYSTEM

### 2.1 Djinn Passive Synergy Formulas

**All Same Element (e.g., 3 Venus Djinn):**
```typescript
const SYNERGY_ALL_SAME = {
  statBonus: { atk: +12, def: +8 },
  classChange: "[Element] Adept",  // e.g., "Venus Adept"
  abilitiesUnlocked: ["[Element]-Ultimate"], // e.g., "Earthquake"
};

// Example: 3 Venus (Flint + Granite + Bane)
// → ATK +12, DEF +8
// → Class: "Venus Adept"
// → Unlocks: "Earthquake" ability
```

**2 Same + 1 Different (e.g., 2 Venus + 1 Mars):**
```typescript
const SYNERGY_TWO_ONE = {
  statBonus: { atk: +8, def: +6 },
  classChange: "[Primary Element] Knight", // e.g., "Venus Knight"
  abilitiesUnlocked: ["Hybrid-Spell"]
};

// Example: 2 Venus + 1 Mars
// → ATK +8, DEF +6
// → Class: "Venus Knight"
// → Unlocks: "Stone Edge" (hybrid ability)
```

**All Different Elements (e.g., Venus + Mars + Mercury):**
```typescript
const SYNERGY_ALL_DIFF = {
  statBonus: { atk: +4, def: +4, spd: +4 },
  classChange: "Mystic",
  abilitiesUnlocked: ["Balance-Spell"]
};

// Example: Flint (Venus) + Forge (Mars) + Fizz (Mercury)
// → ATK +4, DEF +4, SPD +4
// → Class: "Mystic"
// → Unlocks: "Elemental Harmony" ability
```

### 2.2 Djinn Active Use in Battle

**Activation Requirements:**
```typescript
const DJINN_ACTIVATION = {
  requirement: "Unit must have dealt or taken 30+ cumulative damage in this battle",
  effect: "Unleash Djinn for powerful attack/heal/buff",
  consequence: "Lose passive bonus for 2 turns",
  recovery: "After 2 turns, Djinn returns to Set state, passive restored"
};
```

**Djinn Active Effects by Tier:**
```typescript
const DJINN_TIER_EFFECTS = {
  tier1: {
    damage: 80,      // Base damage for attack Djinn (scaled by MAG)
    heal: 60,        // Base heal for support Djinn (scaled by MAG)
    buffPower: 1.2   // 20% stat boost for buff Djinn
  },
  tier2: {
    damage: 120,
    heal: 90,
    buffPower: 1.3   // 30% stat boost
  },
  tier3: {
    damage: 180,
    heal: 140,
    buffPower: 1.5   // 50% stat boost
  }
};
```

**Example: Granite (Venus Tier 2) Active:**
```typescript
{
  name: "Earthquake",
  type: "damage",
  element: "Venus",
  targets: "all-enemies",
  baseDamage: 120,
  formula: (userMAG) => Math.floor(120 * (1 + userMAG / 100)),

  // Example calculation:
  // User has MAG = 20
  // Damage = 120 * (1 + 20/100) = 120 * 1.2 = 144
}
```

### 2.3 Djinn Distribution & Acquisition

**12 Djinn Total:**
```typescript
const DJINN_CATALOG = {
  venus: [
    { id: "flint", tier: 1, source: "Guard's Challenge reward" },
    { id: "granite", tier: 2, source: "Sol Sanctum boss drop" },
    { id: "bane", tier: 3, source: "Special Quest: 'The Sealed Terror'" }
  ],
  mars: [
    { id: "forge", tier: 1, source: "Blacksmith quest reward" },
    { id: "char", tier: 2, source: "Bandit Hideout hidden chest" },
    { id: "fury", tier: 3, source: "Kyle's special quest" }
  ],
  mercury: [
    { id: "fizz", tier: 1, source: "Healer Iris gift (heal 50 HP)" },
    { id: "swell", tier: 2, source: "Vale Harbor defender" },
    { id: "chill", tier: 3, source: "Piers's Ice Cavern quest" }
  ],
  jupiter: [
    { id: "breeze", tier: 1, source: "Bilibin Forest (with Sheba)" },
    { id: "zephyr", tier: 2, source: "Priestess Aria's vision quest" },
    { id: "bolt", tier: 3, source: "Post-game 'Sealed Storm' quest" }
  ]
};
```

---

## 3. EQUIPMENT SYSTEM

### 3.1 Equipment Tiers & Stat Bonuses

**WEAPONS:**
```typescript
const WEAPONS = {
  basic: {
    name: "Wooden Sword",
    atk: +5,
    unlocksAbility: null,
    cost: 50
  },
  iron: {
    name: "Iron Sword",
    atk: +12,
    unlocksAbility: null,
    cost: 200
  },
  steel: {
    name: "Steel Sword",
    atk: +20,
    unlocksAbility: null,
    cost: 600
  },
  legendary: {
    name: "Sol Blade",
    atk: +30,
    unlocksAbility: "Megiddo",  // 150 damage, costs 25 PP
    cost: 3000
  }
};
```

**ARMOR:**
```typescript
const ARMOR = {
  basic: {
    name: "Leather Vest",
    def: +6,
    hp: +10,
    cost: 80
  },
  iron: {
    name: "Iron Armor",
    def: +14,
    hp: +20,
    cost: 300
  },
  steel: {
    name: "Steel Armor",
    def: +22,
    hp: +35,
    cost: 800
  },
  legendary: {
    name: "Dragon Scales",
    def: +35,
    hp: +60,
    elemental_resist: 0.2,  // 20% reduction to elemental damage
    cost: 4000
  }
};
```

**HELMS:**
```typescript
const HELMS = {
  basic: {
    name: "Cloth Cap",
    def: +4,
    cost: 60
  },
  iron: {
    name: "Iron Helm",
    def: +10,
    cost: 250
  },
  steel: {
    name: "Steel Helm",
    def: +16,
    cost: 700
  },
  legendary: {
    name: "Oracle's Crown",
    def: +25,
    mag: +10,  // Also boosts magic
    pp: +15,   // Extra Psynergy Points
    cost: 3500
  }
};
```

**BOOTS:**
```typescript
const BOOTS = {
  basic: {
    name: "Leather Boots",
    spd: +2,
    cost: 70
  },
  iron: {
    name: "Running Shoes",
    spd: +5,
    cost: 280
  },
  steel: {
    name: "Hyper Boots",
    spd: +8,
    evasion: +10,  // 10% dodge chance
    cost: 750
  },
  legendary: {
    name: "Hermes' Sandals",
    spd: +15,
    evasion: +20,
    alwaysFirstTurn: true,  // Always acts first in battle
    cost: 4500
  }
};
```

### 3.2 Stat Calculation Formula

```typescript
function calculateFinalStats(unit: Unit): Stats {
  const base = unit.baseStats;
  const levelBonus = unit.growthRates.map(stat => stat * (unit.level - 1));
  const equipment = sumEquipmentBonuses(unit.equipment);
  const djinn = calculateDjinnSynergy(unit.djinn);
  const buffs = sumActiveBuffs(unit.buffs);

  return {
    hp: base.hp + levelBonus.hp + equipment.hp,
    pp: base.pp + levelBonus.pp + equipment.pp,
    atk: base.atk + levelBonus.atk + equipment.atk + djinn.atk + buffs.atk,
    def: base.def + levelBonus.def + equipment.def + djinn.def + buffs.def,
    mag: base.mag + levelBonus.mag + equipment.mag + buffs.mag,
    spd: base.spd + levelBonus.spd + equipment.spd + djinn.spd + buffs.spd
  };
}

// Example: Isaac Level 5, Iron Sword, Iron Armor, 3 Venus Djinn
// Base (Lv5): HP 180, ATK 27, DEF 18, MAG 20, SPD 16
// Iron Sword: ATK +12
// Iron Armor: HP +20, DEF +14
// 3 Venus Djinn: ATK +12, DEF +8
// FINAL: HP 200, ATK 51, DEF 40, MAG 20, SPD 16
```

---

## 4. BATTLE REWARDS

### 4.1 XP Formula

```typescript
function calculateBattleXP(enemyLevel: number, partySize: number): number {
  const BASE_XP = 50;
  const LEVEL_MULTIPLIER = 10;
  const SIZE_PENALTY = partySize > 1 ? 0.8 : 1.0;  // -20% for parties

  return Math.floor(
    (BASE_XP + (LEVEL_MULTIPLIER * enemyLevel)) * SIZE_PENALTY
  );
}

// Examples:
// Solo vs Level 1 enemy: 50 + (10 * 1) = 60 XP
// Party of 4 vs Level 1 enemy: 60 * 0.8 = 48 XP
// Solo vs Level 5 enemy: 50 + (10 * 5) = 100 XP
// Party of 4 vs Level 5 enemy: 100 * 0.8 = 80 XP
```

### 4.2 Gold Formula

```typescript
function calculateBattleGold(enemyLevel: number): number {
  const BASE_GOLD = 25;
  const LEVEL_MULTIPLIER = 15;

  return BASE_GOLD + (LEVEL_MULTIPLIER * enemyLevel);
}

// Examples:
// Level 1 enemy: 25 + (15 * 1) = 40 gold
// Level 3 enemy: 25 + (15 * 3) = 70 gold
// Level 5 enemy: 25 + (15 * 5) = 100 gold
```

### 4.3 Drop Rates

```typescript
const DROP_RATES = {
  common: {
    chance: 0.30,  // 30%
    items: ["Herb", "Antidote", "Potion"]
  },
  rare: {
    chance: 0.10,  // 10%
    items: ["Iron Sword", "Iron Armor", "Steel Helm"]
  },
  legendary: {
    chance: 0.02,  // 2%
    items: ["Sol Blade", "Dragon Scales", "Hermes' Sandals"]
  }
};

// Boss battles have guaranteed drops:
const BOSS_DROP_RATES = {
  common: { chance: 0.80 },  // 80%
  rare: { chance: 0.50 },    // 50%
  legendary: { chance: 0.15 } // 15%
};
```

### 4.4 Recruitment Rewards

```typescript
const RECRUITMENT_REWARDS = {
  // When recruitable NPC is defeated:
  unitRecruitment: true,
  bonusXP: 200,     // Flat bonus
  bonusGold: 500,   // Flat bonus
  guaranteedDrop: "rare"  // Always drops rare item
};
```

---

## 5. ABILITY SYSTEM

### 5.1 Ability Categories

```typescript
enum AbilityType {
  PHYSICAL_ATTACK = "physical",  // Uses ATK stat
  PSYNERGY_ATTACK = "psynergy",  // Uses MAG stat, costs PP
  HEALING = "healing",           // Uses MAG stat, costs PP
  BUFF = "buff",                 // Uses MAG stat, costs PP
  DEBUFF = "debuff",             // Uses MAG stat, costs PP
  SUMMON = "summon"              // Requires Djinn, costs PP
}
```

### 5.2 Damage Calculation Formulas

**Physical Attack:**
```typescript
function calculatePhysicalDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability
): number {
  const baseDamage = ability.basePower || attacker.stats.atk;
  const attackPower = attacker.stats.atk;
  const defense = defender.stats.def;

  const damage = Math.floor(
    (baseDamage + attackPower - (defense * 0.5)) * getRandomMultiplier()
  );

  return Math.max(1, damage);  // Minimum 1 damage
}

// Random multiplier: 0.9 to 1.1 (±10% variance)
function getRandomMultiplier(): number {
  return 0.9 + (Math.random() * 0.2);
}
```

**Psynergy Attack:**
```typescript
function calculatePsynergyDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability
): number {
  const basePower = ability.basePower;
  const magicPower = attacker.stats.mag;
  const magicDefense = defender.stats.def * 0.3;  // DEF also resists magic

  // Element advantage/disadvantage
  const elementModifier = getElementModifier(ability.element, defender.element);

  const damage = Math.floor(
    (basePower + magicPower - magicDefense) * elementModifier * getRandomMultiplier()
  );

  return Math.max(1, damage);
}

// Element triangle:
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

**Healing:**
```typescript
function calculateHealAmount(
  caster: Unit,
  ability: Ability
): number {
  const baseHeal = ability.basePower;
  const magicPower = caster.stats.mag;

  const healAmount = Math.floor(
    (baseHeal + magicPower) * getRandomMultiplier()
  );

  return healAmount;
}
```

### 5.3 Ability Costs & Powers

#### VENUS (Earth) Abilities
```typescript
const VENUS_ABILITIES = {
  quake: {
    name: "Quake",
    type: "psynergy",
    element: "Venus",
    ppCost: 5,
    basePower: 30,
    targets: "all-enemies",
    unlockLevel: 2
  },
  claySpire: {
    name: "Clay Spire",
    type: "psynergy",
    element: "Venus",
    ppCost: 10,
    basePower: 60,
    targets: "single-enemy",
    unlockLevel: 3
  },
  ragnarok: {
    name: "Ragnarok",
    type: "psynergy",
    element: "Venus",
    ppCost: 15,
    basePower: 100,
    targets: "single-enemy",
    unlockLevel: 4
  },
  judgment: {
    name: "Judgment",
    type: "psynergy",
    element: "Venus",
    ppCost: 25,
    basePower: 150,
    targets: "all-enemies",
    unlockLevel: 5
  }
};
```

#### MARS (Fire) Abilities
```typescript
const MARS_ABILITIES = {
  fireball: {
    name: "Fireball",
    type: "psynergy",
    element: "Mars",
    ppCost: 5,
    basePower: 32,  // Slightly higher than Quake (glass cannon)
    targets: "single-enemy",
    unlockLevel: 2
  },
  volcano: {
    name: "Volcano",
    type: "psynergy",
    element: "Mars",
    ppCost: 12,
    basePower: 65,
    targets: "all-enemies",
    unlockLevel: 3
  },
  meteorStrike: {
    name: "Meteor Strike",
    type: "psynergy",
    element: "Mars",
    ppCost: 18,
    basePower: 110,
    targets: "single-enemy",
    unlockLevel: 4
  },
  pyroclasm: {
    name: "Pyroclasm",
    type: "psynergy",
    element: "Mars",
    ppCost: 30,
    basePower: 170,
    targets: "all-enemies",
    unlockLevel: 5
  }
};
```

#### MERCURY (Water) Abilities
```typescript
const MERCURY_ABILITIES = {
  ply: {
    name: "Ply",
    type: "healing",
    element: "Mercury",
    ppCost: 4,
    basePower: 40,  // Base heal amount
    targets: "single-ally",
    unlockLevel: 1  // Healers get healing at level 1
  },
  frost: {
    name: "Frost",
    type: "psynergy",
    element: "Mercury",
    ppCost: 6,
    basePower: 28,  // Lower damage (support focus)
    targets: "all-enemies",
    unlockLevel: 2
  },
  iceHorn: {
    name: "Ice Horn",
    type: "psynergy",
    element: "Mercury",
    ppCost: 11,
    basePower: 58,
    targets: "single-enemy",
    unlockLevel: 3
  },
  wish: {
    name: "Wish",
    type: "healing",
    element: "Mercury",
    ppCost: 15,
    basePower: 70,
    targets: "all-allies",
    unlockLevel: 4
  },
  glacialBlessing: {
    name: "Glacial Blessing",
    type: "healing",
    element: "Mercury",
    ppCost: 35,
    basePower: 120,
    targets: "all-allies",
    revivesFallen: true,  // Can revive KO'd units
    unlockLevel: 5
  }
};
```

#### JUPITER (Wind) Abilities
```typescript
const JUPITER_ABILITIES = {
  gust: {
    name: "Gust",
    type: "psynergy",
    element: "Jupiter",
    ppCost: 4,
    basePower: 25,
    targets: "single-enemy",
    unlockLevel: 2
  },
  plasma: {
    name: "Plasma",
    type: "psynergy",
    element: "Jupiter",
    ppCost: 10,
    basePower: 55,
    targets: "all-enemies",
    chainDamage: true,  // Hits each enemy once, damage chains
    unlockLevel: 3
  },
  thunderclap: {
    name: "Thunderclap",
    type: "psynergy",
    element: "Jupiter",
    ppCost: 16,
    basePower: 95,
    targets: "all-enemies",
    unlockLevel: 4
  },
  tempest: {
    name: "Tempest",
    type: "psynergy",
    element: "Jupiter",
    ppCost: 28,
    basePower: 160,
    targets: "all-enemies",
    unlockLevel: 5
  }
};
```

#### Buff/Debuff Abilities
```typescript
const BUFF_ABILITIES = {
  blessing: {
    name: "Blessing",
    type: "buff",
    ppCost: 8,
    targets: "all-allies",
    effect: { atk: 1.25, def: 1.25 },  // +25% stats
    duration: 3,  // Lasts 3 turns
    unlockLevel: 3
  },
  guardiansStance: {
    name: "Guardian's Stance",
    type: "buff",
    ppCost: 6,
    targets: "all-allies",
    effect: { def: 1.5 },  // +50% defense
    duration: 2,
    unlockLevel: 3
  },
  windsFavor: {
    name: "Wind's Favor",
    type: "buff",
    ppCost: 10,
    targets: "all-allies",
    effect: { spd: 1.4, evasion: +20 },  // +40% speed, +20% dodge
    duration: 3,
    unlockLevel: 3
  }
};
```

---

## 6. BATTLE MECHANICS

### 6.1 Turn Order

```typescript
function calculateTurnOrder(units: Unit[]): Unit[] {
  // Sort by SPD stat (highest first)
  return units.sort((a, b) => b.stats.spd - a.stats.spd);

  // Tiebreaker: Random
  // Special case: Hermes' Sandals always first
}

// Example:
// Isaac (SPD 16), Garet (SPD 14), Enemy (SPD 12)
// Turn order: Isaac → Garet → Enemy
```

### 6.2 Critical Hit System

```typescript
function checkCriticalHit(attacker: Unit): boolean {
  const BASE_CRIT_CHANCE = 0.05;  // 5%
  const SPEED_BONUS = attacker.stats.spd * 0.002;  // +0.2% per SPD point

  const totalChance = BASE_CRIT_CHANCE + SPEED_BONUS;

  return Math.random() < totalChance;
}

// Critical hit multiplier: 2.0x damage
```

### 6.3 Battle End Conditions

```typescript
enum BattleResult {
  PLAYER_VICTORY,  // All enemies defeated
  PLAYER_DEFEAT,   // All player units KO'd
  PLAYER_FLEE      // Player chose to flee
}

function checkBattleEnd(playerUnits: Unit[], enemyUnits: Unit[]): BattleResult | null {
  const allPlayerKO = playerUnits.every(u => u.currentHp <= 0);
  const allEnemiesKO = enemyUnits.every(u => u.currentHp <= 0);

  if (allEnemiesKO) return BattleResult.PLAYER_VICTORY;
  if (allPlayerKO) return BattleResult.PLAYER_DEFEAT;

  return null;  // Battle continues
}
```

### 6.4 Flee Mechanics

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

---

## 7. RECRUITMENT SYSTEM

### 7.1 Party Management Rules

```typescript
const PARTY_RULES = {
  maxTotalUnits: 10,     // Can recruit up to 10 units
  maxActiveParty: 4,     // Only 4 can be in active battle party
  minActiveParty: 1,     // Must have at least 1 active unit
  benchSize: 6           // Remaining units (10 - 4 = 6 on bench)
};
```

### 7.2 Recruitment Methods

```typescript
enum RecruitmentMethod {
  STARTER_CHOICE,     // Pick 1 of 3 starters at tutorial
  FRIENDLY_BATTLE,    // Defeat in non-lethal battle (Mia)
  HONOR_DUEL,         // Win 1v1 challenge (Felix)
  RESCUE_QUEST,       // Complete rescue mission (Jenna)
  EXPLORATION_FIND,   // Discover in location (Sheba)
  GUARDIAN_CHALLENGE, // Defeat guardian (Piers)
  SPECIAL_QUEST,      // Complete quest chain (Kraden)
  TRIAL_BATTLE        // Win hardest trial (Kyle)
}
```

### 7.3 Recruitment Flags

```typescript
const RECRUITMENT_FLAGS = {
  isaac: { method: "STARTER_CHOICE", flag: "starter_selected_isaac" },
  garet: { method: "STARTER_CHOICE", flag: "starter_selected_garet" },
  ivan: { method: "STARTER_CHOICE", flag: "starter_selected_ivan" },
  mia: { method: "FRIENDLY_BATTLE", flag: "defeated_mia_friendly_spar" },
  felix: { method: "HONOR_DUEL", flag: "defeated_felix_honor_duel" },
  jenna: { method: "RESCUE_QUEST", flag: "rescued_jenna_from_bandits" },
  sheba: { method: "EXPLORATION_FIND", flag: "found_sheba_in_forest" },
  piers: { method: "GUARDIAN_CHALLENGE", flag: "defeated_piers_harbor_guardian" },
  kraden: { method: "SPECIAL_QUEST", flag: "completed_kraden_research_quest" },
  kyle: { method: "TRIAL_BATTLE", flag: "defeated_kyle_warrior_trial" }
};
```

### 7.4 Recruitment Level Scaling

```typescript
// Units join at specific levels based on story progression
const RECRUITMENT_LEVELS = {
  isaac: 1,   // Starter
  garet: 1,   // Starter
  ivan: 1,    // Starter
  mia: 3,     // Early game
  felix: 5,   // Mid game
  jenna: 4,   // Mid game
  sheba: 4,   // Mid game
  piers: 6,   // Mid-late game
  kraden: 7,  // Late game
  kyle: 8     // Late game (highest)
};
```

---

## 8. SAVE SYSTEM

### 8.1 Save Data Structure

```typescript
interface SaveData {
  version: string;
  timestamp: number;

  // Player progress
  playerData: {
    unitsCollected: RecruitedUnit[];  // Up to 10
    activeParty: string[];            // 4 unit IDs
    inventory: Item[];
    gold: number;
    djinnCollected: Djinn[];          // Up to 12
    recruitmentFlags: Record<string, boolean>;
    storyFlags: Record<string, boolean>;
  };

  // Overworld state
  overworldState: {
    playerPosition: { x: number; y: number };
    currentScene: string;
    npcStates: Record<string, NPCState>;
  };

  // Statistics
  stats: {
    battlesWon: number;
    battlesLost: number;
    totalDamageDealt: number;
    totalHealingDone: number;
    playtime: number;  // Seconds
  };
}
```

### 8.2 Auto-Save Triggers

```typescript
const AUTO_SAVE_TRIGGERS = [
  "AFTER_BATTLE_WIN",
  "AFTER_RECRUITMENT",
  "AFTER_LEVEL_UP",
  "AFTER_EQUIPMENT_CHANGE",
  "AFTER_INN_REST",
  "BEFORE_BOSS_BATTLE"  // Safety save
];
```

---

## SUMMARY: KEY NUMBERS

**Leveling:**
- XP to Level 5: 1850 total
- 5 abilities per unit (unlock at levels 1-5)

**Djinn:**
- 12 total (3 per element)
- All same element: +12 ATK, +8 DEF
- Mixed elements: Lower bonuses

**Equipment:**
- 4 slots: Weapon, Armor, Helm, Boots
- Legendary tier: +30 ATK (weapon), +35 DEF (armor)

**Battle:**
- XP: 50 + (level × 10)
- Gold: 25 + (level × 15)
- Drop rates: 30% common, 10% rare, 2% legendary

**Abilities:**
- Basic spells: 4-6 PP
- Mid-tier: 10-16 PP
- Ultimate: 25-35 PP

---

**All formulas defined with EXACT numbers!** ✅

**Next Document:** TASK_BREAKDOWN.md (20+ tasks for Coder)
