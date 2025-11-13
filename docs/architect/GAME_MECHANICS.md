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

**Formula:** Exponential curve with base 100, extended to level 20

```typescript
const XP_CURVE = {
  1: 0,      // Starting XP
  2: 100,    // Level 1 → 2
  3: 350,    // Level 1 → 3  (100 + 250)
  4: 850,    // Level 1 → 4  (100 + 250 + 500)
  5: 1850,   // Level 1 → 5  (100 + 250 + 500 + 1000)
  6: 3100,   // Level 1 → 6
  7: 4700,   // Level 1 → 7
  8: 6700,   // Level 1 → 8
  9: 9200,   // Level 1 → 9
  10: 12300, // Level 1 → 10
  11: 16000, // Level 1 → 11
  12: 20400, // Level 1 → 12
  13: 25600, // Level 1 → 13
  14: 31700, // Level 1 → 14
  15: 38800, // Level 1 → 15
  16: 47000, // Level 1 → 16
  17: 56400, // Level 1 → 17
  18: 67100, // Level 1 → 18
  19: 79200, // Level 1 → 19
  20: 92800, // Level 1 → 20
};

// Total XP needed to reach level 20: 92,800 XP
// See: apps/vale-v2/src/core/algorithms/xp.ts
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
  base: { hp: 100, pp: 24, atk: 14, def: 10, mag: 12, spd: 12 },
  growth: { hp: 20, pp: 3, atk: 3, def: 2, mag: 2, spd: 1 },

  byLevel: {
    1: { hp: 100, pp: 24, atk: 14, def: 10, mag: 12, spd: 12 },
    2: { hp: 120, pp: 27, atk: 17, def: 12, mag: 14, spd: 13 },
    3: { hp: 140, pp: 30, atk: 20, def: 14, mag: 16, spd: 14 },
    4: { hp: 160, pp: 33, atk: 23, def: 16, mag: 18, spd: 15 },
    5: { hp: 180, pp: 36, atk: 26, def: 18, mag: 20, spd: 16 }
  }
};
// BALANCE CHANGES: ATK base 15→14, PP base 20→24, PP growth 4→3 (same L5 PP, better early game)
```

#### Garet (Mars - Pure DPS)
```typescript
const GARET_STATS = {
  base: { hp: 120, pp: 15, atk: 19, def: 7, mag: 10, spd: 8 },
  growth: { hp: 15, pp: 3, atk: 3, def: 1, mag: 2, spd: 1 },

  byLevel: {
    1: { hp: 120, pp: 15, atk: 19, def: 7, mag: 10, spd: 8 },
    2: { hp: 135, pp: 18, atk: 22, def: 8, mag: 12, spd: 9 },
    3: { hp: 150, pp: 21, atk: 25, def: 9, mag: 14, spd: 10 },
    4: { hp: 165, pp: 24, atk: 28, def: 10, mag: 16, spd: 11 },
    5: { hp: 180, pp: 27, atk: 31, def: 11, mag: 18, spd: 12 }
  }
};
// BALANCE CHANGES: ATK base 18→19, ATK growth 4→3, DEF base 8→7, SPD base 10→8 (glass cannon archetype)
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
  growth: { hp: 14, pp: 3, atk: 3, def: 1, mag: 2, spd: 3 },

  byLevel: {
    1: { hp: 95, pp: 18, atk: 17, def: 9, mag: 11, spd: 18 },
    2: { hp: 109, pp: 21, atk: 20, def: 10, mag: 13, spd: 21 },
    3: { hp: 123, pp: 24, atk: 23, def: 11, mag: 15, spd: 24 },
    4: { hp: 137, pp: 27, atk: 26, def: 12, mag: 17, spd: 27 },
    5: { hp: 151, pp: 30, atk: 29, def: 13, mag: 19, spd: 30 }
  }
};
// BALANCE CHANGE: ATK growth reduced from 4 to 3 to reduce power gap
```

#### Jenna (Mars - AoE Fire Mage)
```typescript
const JENNA_STATS = {
  base: { hp: 75, pp: 28, atk: 11, def: 5, mag: 28, spd: 13 },
  growth: { hp: 12, pp: 6, atk: 1, def: 1, mag: 5, spd: 2 },

  byLevel: {
    1: { hp: 75, pp: 28, atk: 11, def: 5, mag: 28, spd: 13 },
    2: { hp: 87, pp: 34, atk: 12, def: 6, mag: 33, spd: 15 },
    3: { hp: 99, pp: 40, atk: 13, def: 7, mag: 38, spd: 17 },
    4: { hp: 111, pp: 46, atk: 14, def: 8, mag: 43, spd: 19 },
    5: { hp: 123, pp: 52, atk: 15, def: 9, mag: 48, spd: 21 }
  }
};
// BALANCE CHANGES: ATK base 9→11, MAG base 20→28 (glass cannon archetype, high damage output)
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
  base: { hp: 140, pp: 20, atk: 10, def: 16, mag: 9, spd: 8 },
  growth: { hp: 18, pp: 4, atk: 1, def: 3, mag: 2, spd: 1 },

  byLevel: {
    1: { hp: 140, pp: 20, atk: 10, def: 16, mag: 9, spd: 8 },
    2: { hp: 158, pp: 24, atk: 11, def: 19, mag: 11, spd: 9 },
    3: { hp: 176, pp: 28, atk: 12, def: 22, mag: 13, spd: 10 },
    4: { hp: 194, pp: 32, atk: 13, def: 25, mag: 15, spd: 11 },
    5: { hp: 212, pp: 36, atk: 14, def: 28, mag: 17, spd: 12 }
  }
};
// BALANCE CHANGES: ATK base 14→10, ATK growth 2→1, MAG base 13→9 (tank archetype, trades damage for survivability)
```

#### Kraden (Neutral - Versatile Scholar)
```typescript
const KRADEN_STATS = {
  base: { hp: 70, pp: 35, atk: 8, def: 8, mag: 15, spd: 10 },
  growth: { hp: 10, pp: 7, atk: 2, def: 2, mag: 3, spd: 1 },

  byLevel: {
    1: { hp: 70, pp: 35, atk: 8, def: 8, mag: 15, spd: 10 },
    2: { hp: 80, pp: 42, atk: 10, def: 10, mag: 18, spd: 11 },
    3: { hp: 90, pp: 49, atk: 12, def: 12, mag: 21, spd: 12 },
    4: { hp: 100, pp: 56, atk: 14, def: 14, mag: 24, spd: 13 },
    5: { hp: 110, pp: 63, atk: 16, def: 16, mag: 27, spd: 14 }
  }
};
// BALANCE CHANGE: ATK growth increased from 1 to 2 to improve scholar viability
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

### 2.0 Djinn Slot System

**🚨 CRITICAL: GLOBAL TEAM SLOTS (Not Per-Unit!)**

```typescript
const DJINN_SLOTS = {
  teamSlots: 3,              // Team has exactly 3 Djinn slots (GLOBAL)
  slotsPerUnit: 0,           // NOT per-unit!
  maxEquipped: 3,            // Can only equip 3 Djinn total across entire party
  totalCollectable: 12,      // Can collect all 12 Djinn
  affectsAllUnits: true      // Equipped Djinn bonuses apply to ALL party members
};
```

**How It Works:**
1. Player collects up to 12 Djinn throughout the game (3 per element)
2. Player equips ANY 3 Djinn to the team's 3 global slots
3. The 3 equipped Djinn provide bonuses to ALL 4 party members
4. Synergy is calculated from the team's 3 Djinn (not individual units)

**Example:**
```
Team collects: Flint, Granite, Bane (3 Venus) + 9 other Djinn

Player equips to team slots:
  Slot 1: Flint (Venus T1)
  Slot 2: Granite (Venus T2)
  Slot 3: Bane (Venus T3)

Result (applies to Isaac, Garet, Mia, AND Ivan):
  - ALL units get: +12 ATK, +8 DEF
  - ALL units get: Class change to "Venus Adept"
  - ALL units unlock: "Earthquake" ability

This is a TEAM BUFF, not individual bonuses!
```

**Strategic Depth:**
- With 12 Djinn collected, player chooses which 3 to use
- All same element = specialization (e.g., all Venus = earth power)
- Mixed elements = versatility (e.g., Venus+Mars+Mercury = balanced)
- Harder choices than per-unit system!

---

### 2.1 Djinn Passive Synergy Formulas

**🚨 CRITICAL: Synergy scales with Djinn COUNT!**

**NOTE:** Synergy is calculated from the TEAM'S 3 equipped Djinn (not per-unit).
The resulting bonuses apply to ALL party members globally.

**Example:**
- Team equips: 3 Venus Djinn
- Synergy: +12 ATK, +8 DEF
- Result: Isaac gets +12 ATK, Garet gets +12 ATK, Mia gets +12 ATK, Ivan gets +12 ATK
- **ALL FOUR UNITS benefit from the same synergy!**

---

**1 Djinn (Any Element):**
```typescript
const SYNERGY_ONE = {
  statBonus: { atk: +4, def: +3 },
  classChange: "Adept",
  abilitiesUnlocked: []
};
```

**2 Djinn - Same Element (e.g., 2 Venus):**
```typescript
const SYNERGY_TWO_SAME = {
  statBonus: { atk: +8, def: +5 },
  classChange: "[Element] Warrior",  // e.g., "Venus Warrior"
  abilitiesUnlocked: []
};
```

**2 Djinn - Different Elements (e.g., Venus + Mars):**
```typescript
const SYNERGY_TWO_DIFF = {
  statBonus: { atk: +5, def: +5 },
  classChange: "Hybrid",
  abilitiesUnlocked: []
};
```

**3 Djinn - All Same Element (e.g., 3 Venus Djinn):**
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

**3 Djinn - 2 Same + 1 Different (e.g., 2 Venus + 1 Mars):**
```typescript
const SYNERGY_TWO_ONE = {
  statBonus: { atk: +8, def: +6 },
  classChange: "[Primary Element] Knight", // e.g., "Venus Knight"
  abilitiesUnlocked: ["Hybrid-Spell"]
};

// Example: 2 Venus + 1 Mars (total 3 Djinn)
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

**Activation Mechanics (Team Slots):**

When a Djinn is activated (unleashed):
1. Djinn moves from "Set" → "Standby" state
2. **ALL party members IMMEDIATELY lose that Djinn's portion of synergy**
3. Example:
   - Before: 3 Venus Djinn = +12 ATK to all units
   - Activate Flint: Now 2 Venus Djinn = +8 ATK to all units
   - **ALL 4 units lose 4 ATK!**
4. After 2 turns: Djinn returns to "Set", all units regain +4 ATK

**Trade-off:**
- Activation: Big burst damage (Flint deals 80 damage)
- Penalty: **ALL units lose stats for 2 turns** (team-wide penalty!)
- Strategic: Worth weakening entire team for burst?

**Example Full Scenario:**
```
Turn 1 (Before Activation):
  Team: 3 Venus Djinn (Flint, Granite, Bane) equipped
  All units: +12 ATK, +8 DEF

Turn 2 (Isaac activates Flint):
  Flint unleashes: 80 damage to all enemies
  Team: 2 Venus Djinn (Granite, Bane) remain
  All units: +8 ATK, +5 DEF (-4 ATK, -3 DEF penalty!)

Turn 3:
  Flint still in Standby
  All units still: +8 ATK, +5 DEF

Turn 4 (Flint recovers):
  Flint returns to Set state
  Team: 3 Venus Djinn (Flint, Granite, Bane) back
  All units: +12 ATK, +8 DEF (bonuses restored!)
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

### 2.5 Djinn Menu UI Design

**Screen Layout:**
- **Left Panel:** 12 Djinn collection (3 Venus, 3 Mars, 3 Mercury, 3 Jupiter)
  - Shows all collected Djinn with element badges
  - Grayed out if not yet collected
- **Center Panel:** 3 TEAM SLOTS (drag Djinn here to equip)
  - Slot 1, Slot 2, Slot 3
  - Shows currently equipped Djinn
  - Empty slots are highlighted
- **Right Panel:** Current synergy preview
  - Shows bonuses ALL units will receive
  - "All party members gain: +12 ATK, +8 DEF"
  - Class change preview: "Venus Adept"
  - Unlocked abilities: "Earthquake"

**Equipping Process:**
1. Player opens Djinn menu (from main menu, not during battle)
2. Views all 12 collected Djinn (left panel)
3. Drags/selects 3 Djinn into the team's 3 slots (center panel)
4. Synergy recalculates based on the 3 equipped
5. Preview shows: "All party members will receive: +X ATK, +Y DEF"
6. Confirm → Bonuses apply to entire party

**In-Battle Djinn Board:**
- Shows team's 3 equipped Djinn with state indicators:
  - **Set** (green): Ready to activate, passive bonus active
  - **Standby** (yellow): Just activated, passive bonus lost
  - **Recovery** (red): Recovering, passive bonus lost
- Each can be activated once per battle (Set → Standby → Recovery → Set)
- Activation button shows:
  - Djinn name + effect (e.g., "Flint: 80 damage to all enemies")
  - Warning: "Team will lose +4 ATK, +3 DEF for 2 turns"
- Strategic: Coordinate activations across the team

**Visual Feedback:**
- When Djinn activated: All 4 unit portraits flash briefly (showing global effect)
- Stat bars change color when synergy bonuses are lost
- Recovery timer shows turns until Djinn returns to Set state

---

## 3. EQUIPMENT SYSTEM

### 3.1 Equipment System

**🚨 CRITICAL: Unit-Locked Equipment**

All equipment is UNIT-SPECIFIC. Each character has their own exclusive
equipment that only they can use (no sharing between units).

**Equipment Slots:** 5 per unit
- Weapon (typically ATK boost)
- Armor (typically DEF + HP boost)
- Helm (typically DEF boost)
- Boots (typically SPD boost)
- Accessory (various bonuses)

**Important:** Rare and legendary equipment can provide ANY stat combinations,
not just their typical stats. All equipment has special effects.

**Example Tiers (Unit-Specific Names Vary):**
```typescript
const EQUIPMENT_TIERS = {
  basic: {
    weapon: "+5-7 ATK",
    armor: "+6 DEF, +10 HP",
    helm: "+4 DEF",
    boots: "+2 SPD",
    accessory: "Small stat boost",
    cost: "50-100g per piece"
  },
  iron: {
    weapon: "+12-16 ATK",
    armor: "+10 DEF, +20 HP",
    helm: "+5 DEF",
    boots: "+3 SPD",
    accessory: "Moderate stat boost",
    cost: "150-400g per piece"
  },
  legendary: {
    weapon: "+50-72 ATK, unlocks abilities",
    armor: "+35 DEF, +60 HP, multi-stat bonuses",
    helm: "+25 DEF, +10 MAG, special effects",
    boots: "+10 SPD, always acts first",
    accessory: "Unique powerful effects",
    cost: "5,000-15,000g per piece"
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
    def: +10,
    hp: +20,
    cost: 300
  },
  steel: {
    name: "Steel Armor",
    def: +18,
    hp: +40,
    cost: 700
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
    def: +5,
    cost: 150
  },
  steel: {
    name: "Steel Helm",
    def: +10,
    cost: 400
  },
  legendary: {
    name: "Oracle's Crown",
    def: +25,
    mag: +10,  // Also boosts magic
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
    name: "Iron Boots",
    spd: +3,
    cost: 100
  },
  steel: {
    name: "Hyper Boots",
    spd: +8,
    evasion: +10,  // 10% dodge chance
    cost: 750
  },
  legendary: {
    name: "Hermes' Sandals",
    spd: +10,
    alwaysFirstTurn: true,  // Always acts first in battle
    cost: 5000
  }
};
```

### 3.2 Stat Calculation Formula

```typescript
function calculateFinalStats(unit: Unit, team: Team): Stats {
  const base = unit.baseStats;
  const levelBonus = unit.growthRates.map(stat => stat * (unit.level - 1));
  const equipment = sumEquipmentBonuses(unit.equipment);
  const djinn = calculateDjinnSynergy(team.equippedDjinn);  // Team's 3 Djinn (GLOBAL)
  const buffs = sumActiveBuffs(unit.buffs);

  // Note: djinn synergy is calculated from team.equippedDjinn (the 3 team slots)
  // This synergy bonus applies to ALL units in the party
  // So Isaac, Garet, Mia, and Ivan all get the same Djinn bonus

  return {
    hp: base.hp + levelBonus.hp + equipment.hp,
    pp: base.pp + levelBonus.pp + equipment.pp,
    atk: base.atk + levelBonus.atk + equipment.atk + djinn.atk + buffs.atk,
    def: base.def + levelBonus.def + equipment.def + djinn.def + buffs.def,
    mag: base.mag + levelBonus.mag + equipment.mag + buffs.mag,
    spd: base.spd + levelBonus.spd + equipment.spd + djinn.spd + buffs.spd
  };
}

// Example: Isaac Level 5, Iron Sword, Iron Armor, Team has 3 Venus Djinn equipped
// Base (Lv5): HP 180, ATK 26, DEF 18, MAG 20, SPD 16
// Iron Sword: ATK +12
// Iron Armor: HP +20, DEF +10
// 3 Venus Djinn (team): ATK +12, DEF +8 (ALL units get this!)
// FINAL: HP 200, ATK 50, DEF 36, MAG 20, SPD 16
//
// Note: Garet, Mia, and Ivan ALSO get +12 ATK, +8 DEF from the team's 3 Venus Djinn!
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

### 4.1.5 XP Distribution

**🚨 CRITICAL: How XP is distributed to party members**

```typescript
const XP_DISTRIBUTION = {
  mode: "FULL_TO_EACH",  // Each active unit gets full XP amount

  // Example: Battle rewards 80 XP
  // Party of 4 units → Each gets 80 XP
  // Total XP awarded: 80 × 4 = 320 XP

  koUnitsGetXP: false,   // KO'd units don't gain XP
  benchUnitsGetXP: false // Only active party members gain XP
};
```

**Reasoning:**
- Prevents grinding weak enemies (party penalty already applies)
- Encourages rotating party members (everyone levels equally)
- Standard RPG practice (Final Fantasy, Golden Sun, etc.)
- **Not split:** Splitting would make parties level too slowly

**Example:**
```typescript
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

---

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

### 4.3 Equipment Rewards

**🚨 DESIGN NOTE:** Equipment rewards are predetermined (no RNG).

```typescript
const EQUIPMENT_REWARDS = {
  mode: "PREDETERMINED",  // Each NPC has fixed reward pool
  
  rewardTypes: {
    fixedReward: {
      description: "Specific item guaranteed",
      example: "Tutorial Goblin always gives Wooden Sword"
    },
    
    choiceReward: {
      description: "Player picks 1 of 3 options",
      example: "Boss offers choice: Steel Sword OR Steel Armor OR Steel Helm",
      encouragesReplay: true
    }
  },
  
  noRNG: true  // All rewards are planned and balanced
};
```

**Example Reward Setups:**
```typescript
const NPC_REWARDS = {
  "tutorial-goblin": {
    xp: 60,
    gold: 40,
    equipment: { fixed: "wooden-sword" }
  },
  
  "first-boss": {
    xp: 200,
    gold: 150,
    equipment: { choice: ["steel-sword", "steel-armor", "steel-helm"] }
  }
};
```

### 4.4 Recruitment Rewards

```typescript
const RECRUITMENT_REWARDS = {
  // When recruitable NPC is defeated:
  unitRecruitment: true,
  bonusXP: 200,     // Flat bonus
  bonusGold: 500,   // Flat bonus
  guaranteedDrop: "rare"  // Always drops rare equipment
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

// NOTE: Random damage variance removed in Phase 1
// Damage is now fully deterministic
function getRandomMultiplier(rng: PRNG): number {
  // Placeholder for future variance if needed
  return 1.0;  // No variance
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

### 5.2.5 AOE Damage Rule

**🚨 CRITICAL: How multi-target abilities deal damage**

```typescript
const AOE_DAMAGE_RULE = {
  mode: "FULL_TO_EACH",  // Each enemy takes full calculated damage

  // Example: Quake deals 47 damage
  // vs 3 enemies → 47 to EACH (141 total)
  // NOT: 47 divided by 3 = 15 each ❌
  // NOT: 47 with penalty = 35 each ❌

  reasoning: "Higher mana cost balances full damage to each target"
};
```

**Why Full Damage:**
- AOE abilities cost more mana (Quake 1 mana vs basic attack 0 mana)
- Battles have 1-3 enemies typically (not 10+)
- Golden Sun model (standard JRPG practice)
- Makes AOE abilities worth their cost

**Example:**
```typescript
// Isaac (MAG 20) casts Quake (base 30) on 3 Goblins
const damage = calculatePsynergyDamage(isaac, goblin1, quakeAbility);
// = ~47 damage

// Application:
goblin1.hp -= 47;  // ✅ Full damage
goblin2.hp -= 47;  // ✅ Full damage
goblin3.hp -= 47;  // ✅ Full damage

// Total damage dealt: 141
// Mana cost: 1 (balanced!)
```

**Balance:**
- Single-target (Clay Spire): 60 base, 2 mana, 1 target = 60 damage/2mana = 30 efficiency
- Multi-target (Quake): 30 base, 1 mana, 3 targets = 90 damage/1mana = 90 efficiency
- **AOE is 3× better ONLY when hitting 3 targets** (situational advantage)

---

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

### 5.2.6 Mana System

**🚨 CRITICAL: Mana-based ability system (NO PP)**

```typescript
const MANA_SYSTEM = {
  poolType: "TEAM_SHARED",      // All 4 units share one mana pool
  poolCalculation: "SUM_OF_UNIT_CONTRIBUTIONS",  // Each unit contributes different amounts
  regeneration: "FULL_EACH_PLANNING_PHASE",  // Refills completely every round
  
  abilityCosts: {
    basicAttack: 0,    // Free
    lowCost: 1,        // Simple abilities
    midTier: 2-3,      // Powerful abilities
    ultimate: 4        // Most powerful
  },
  
  manaGeneration: {
    basicAttackHit: +1,  // Gain +1 mana when basic attack hits
    timing: "IMMEDIATE_ON_HIT",  // During execution phase, can help slower units
    missOrDodge: 0  // No mana if attack misses
  },
  
  noPerBattleLimit: true  // Abilities unlimited, only limited by mana per round
};
```

**Why Mana Instead of PP:**
- Simplifies resource management (no cross-battle conservation)
- Focus on tactical round planning, not resource hoarding
- Mana generation creates interesting turn order decisions
- Faster gameplay (no running out of resources mid-battle)

**Mana Pool Calculation:**
```typescript
function calculateTeamManaPool(team: Team): number {
  // Each unit contributes different amounts based on their role
  return team.units.reduce((total, unit) => {
    return total + unit.manaContribution;  // Varies: 1-3 per unit
  }, 0);
  
  // Typical party: 1 + 2 + 2 + 3 = 8 mana pool
}
```

**Post-Battle:**
```typescript
function onBattleEnd(units: Unit[], battleResult: "victory" | "defeat"): void {
  units.forEach(unit => {
    unit.currentHp = unit.maxHp;  // ✅ Auto-heal
    unit.statusAilments = [];     // ✅ Cure all status
  });
  
  // No PP to restore (mana-only system)
  // Mana automatically resets to max at start of next battle's planning phase
}
```

---

### 5.3 Ability Costs & Powers

#### VENUS (Earth) Abilities
```typescript
const VENUS_ABILITIES = {
  quake: {
    name: "Quake",
    type: "psynergy",
    element: "Venus",
    manaCost: 1,
    basePower: 30,
    targets: "all-enemies",
    unlockLevel: 2
  },
  claySpire: {
    name: "Clay Spire",
    type: "psynergy",
    element: "Venus",
    manaCost: 2,
    basePower: 60,
    targets: "single-enemy",
    unlockLevel: 3
  },
  ragnarok: {
    name: "Ragnarok",
    type: "psynergy",
    element: "Venus",
    manaCost: 3,
    basePower: 100,
    targets: "single-enemy",
    unlockLevel: 4
  },
  judgment: {
    name: "Judgment",
    type: "psynergy",
    element: "Venus",
    manaCost: 4,
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
    manaCost: 1,
    basePower: 32,  // Slightly higher than Quake (glass cannon)
    targets: "single-enemy",
    unlockLevel: 2
  },
  volcano: {
    name: "Volcano",
    type: "psynergy",
    element: "Mars",
    manaCost: 3,
    basePower: 65,
    targets: "all-enemies",
    unlockLevel: 3
  },
  meteorStrike: {
    name: "Meteor Strike",
    type: "psynergy",
    element: "Mars",
    manaCost: 3,
    basePower: 110,
    targets: "single-enemy",
    unlockLevel: 4
  },
  pyroclasm: {
    name: "Pyroclasm",
    type: "psynergy",
    element: "Mars",
    manaCost: 4,
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
    manaCost: 1,
    basePower: 40,  // Base heal amount
    targets: "single-ally",
    unlockLevel: 1  // Healers get healing at level 1
  },
  frost: {
    name: "Frost",
    type: "psynergy",
    element: "Mercury",
    manaCost: 1,
    basePower: 28,  // Lower damage (support focus)
    targets: "all-enemies",
    unlockLevel: 2
  },
  iceHorn: {
    name: "Ice Horn",
    type: "psynergy",
    element: "Mercury",
    manaCost: 2,
    basePower: 58,
    targets: "single-enemy",
    unlockLevel: 3
  },
  wish: {
    name: "Wish",
    type: "healing",
    element: "Mercury",
    manaCost: 3,
    basePower: 70,
    targets: "all-allies",
    unlockLevel: 4
  },
  glacialBlessing: {
    name: "Glacial Blessing",
    type: "healing",
    element: "Mercury",
    manaCost: 4,
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
    manaCost: 1,
    basePower: 25,
    targets: "single-enemy",
    unlockLevel: 2
  },
  plasma: {
    name: "Plasma",
    type: "psynergy",
    element: "Jupiter",
    manaCost: 2,
    basePower: 55,
    targets: "all-enemies",
    chainDamage: true,  // Hits each enemy once, damage chains
    unlockLevel: 3
  },
  thunderclap: {
    name: "Thunderclap",
    type: "psynergy",
    element: "Jupiter",
    manaCost: 3,
    basePower: 95,
    targets: "all-enemies",
    unlockLevel: 4
  },
  tempest: {
    name: "Tempest",
    type: "psynergy",
    element: "Jupiter",
    manaCost: 4,
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
    manaCost: 2,
    targets: "all-allies",
    effect: { atk: 1.25, def: 1.25 },  // +25% stats
    duration: 3,  // Lasts 3 turns
    unlockLevel: 3
  },
  guardiansStance: {
    name: "Guardian's Stance",
    type: "buff",
    manaCost: 2,
    targets: "all-allies",
    effect: { def: 1.5 },  // +50% defense
    duration: 2,
    unlockLevel: 3
  },
  windsFavor: {
    name: "Wind's Favor",
    type: "buff",
    manaCost: 2,
    targets: "all-allies",
    effect: { spd: 1.4 },  // +40% speed
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

### 6.2 Combat Mechanics

**🚨 NOTE:** Critical hit system has been removed for simplicity.
Damage is consistent based on stats and formulas only.

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
// FLEEING SYSTEM REMOVED
// Game design: No fleeing from battles
// All battles are NPC-triggered and intentional
// Players can prepare before each battle
```

---

## 7. RECRUITMENT SYSTEM

### 7.1 Party Management Rules

```typescript
const PARTY_RULES = {
  maxTotalUnits: 10,     // Can recruit up to 10 units
  maxActiveParty: 4,     // Only 4 can be in active battle party
  minActiveParty: 1,     // Must have at least 1 active unit
  benchSize: 6,          // Remaining units (10 - 4 = 6 on bench)

  // Djinn management (GLOBAL team system)
  djinnSlots: 3,              // Team has 3 Djinn slots (GLOBAL)
  djinnAffectAllUnits: true,  // Equipped Djinn boost entire party
  djinnCollectionMax: 12,     // Can collect all 12 Djinn
  djinnEquipmentScreen: "team-based",  // One screen for team (not per-unit)

  // How Djinn bonuses work:
  // - Player equips 3 Djinn to TEAM slots (not individual units)
  // - All 4 active party members receive the synergy bonus
  // - Bench units do NOT receive Djinn bonuses (only active party)
  // - When party composition changes, Djinn bonuses automatically apply to new active units
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
// 🚨 FIXED: All levels must be 1-5 (max level is 5)
const RECRUITMENT_LEVELS = {
  isaac: 1,   // Starter (tutorial)
  garet: 1,   // Starter (tutorial)
  ivan: 1,    // Starter (tutorial)
  mia: 2,     // Early game (after first boss)
  felix: 3,   // Mid game
  jenna: 3,   // Mid game
  sheba: 3,   // Mid game
  piers: 4,   // Late game
  kraden: 4,  // Late game
  kyle: 5     // Final recruitment (requires high level to unlock)
};
```

### 7.5 NPC Enemy Stats

**🚨 CRITICAL: Stats for recruitable units when fought as enemies**

When the player battles a recruitable NPC (to recruit them), the NPC uses these enemy stats:

```typescript
const NPC_ENEMY_STATS = {
  // STARTERS (Level 1-2) - Tutorial difficulty
  garet_enemy: {
    level: 2,
    hp: 135,      // Higher than player's level 1 units
    pp: 25,
    atk: 22,
    def: 9,
    mag: 8,
    spd: 10,
    element: "Mars",
    abilities: ["Cleave", "Fireball"],
    aiPattern: "AGGRESSIVE",  // 70% attack, 30% Fireball
    isBoss: false
  },

  ivan_enemy: {
    level: 2,
    hp: 110,      // Lower HP (mage archetype)
    pp: 35,
    atk: 15,
    def: 7,
    mag: 24,
    spd: 14,
    element: "Jupiter",
    abilities: ["Slash", "Gust", "Ray"],
    aiPattern: "CASTER",  // 40% attack, 60% spells
    isBoss: false
  },

  // EARLY GAME (Level 2-3)
  mia_enemy: {
    level: 3,
    hp: 120,
    pp: 40,
    atk: 16,
    def: 18,
    mag: 25,
    spd: 12,
    element: "Mercury",
    abilities: ["Slash", "Ply", "Frost"],
    aiPattern: "HEALER",  // 30% attack, 40% Frost, 30% self-heal
    isBoss: false
  },

  // MID GAME (Level 3-4)
  felix_enemy: {
    level: 4,
    hp: 137,
    pp: 30,
    atk: 29,
    def: 12,
    mag: 22,
    spd: 18,
    element: "Venus",
    abilities: ["Slash", "Quake", "Clay Spire"],
    aiPattern: "BALANCED",  // 50% attack, 50% spells
    isBoss: false
  },

  jenna_enemy: {
    level: 4,
    hp: 122,
    pp: 45,
    atk: 20,
    def: 10,
    mag: 32,
    spd: 15,
    element: "Mars",
    abilities: ["Slash", "Fireball", "Volcano"],
    aiPattern: "AOE_CASTER",  // 30% attack, 70% AoE spells
    isBoss: false
  },

  sheba_enemy: {
    level: 4,
    hp: 115,
    pp: 40,
    atk: 18,
    def: 14,
    mag: 28,
    spd: 20,
    element: "Jupiter",
    abilities: ["Slash", "Ray", "Plasma", "Blessing"],
    aiPattern: "SUPPORT",  // 30% attack, 40% damage spells, 30% buffs
    isBoss: false
  },

  // LATE GAME (Level 4-5)
  piers_enemy: {
    level: 5,
    hp: 158,
    pp: 35,
    atk: 22,
    def: 30,
    mag: 26,
    spd: 12,
    element: "Mercury",
    abilities: ["Slash", "Frost", "Torrent", "Guardian's Stance"],
    aiPattern: "TANK",  // 40% attack, 30% spells, 30% defensive buffs
    isBoss: false
  },

  kraden_enemy: {
    level: 5,
    hp: 140,
    pp: 50,
    atk: 24,
    def: 20,
    mag: 34,
    spd: 16,
    element: "Neutral",
    abilities: ["Slash", "Quake", "Frost", "Thunderclap", "Wish"],
    aiPattern: "VERSATILE",  // Uses random abilities (neutral element = any)
    isBoss: false
  },

  // FINAL RECRUITMENT (Level 5) - Hardest NPC battle
  kyle_enemy: {
    level: 5,
    hp: 198,      // Highest HP of all NPCs
    pp: 40,
    atk: 28,
    def: 22,
    mag: 30,
    spd: 18,
    element: "Mars",
    abilities: ["Cleave", "Fireball", "Guardian's Stance", "Meteor Strike"],
    aiPattern: "WARRIOR",  // 60% strong attacks, 40% spells/buffs
    isBoss: true,  // Treated as mini-boss fight
    cannotFlee: true  // Cannot flee from Kyle's trial
  }
};
```

**AI Patterns Explained:**
```typescript
const AI_PATTERNS = {
  AGGRESSIVE: {
    basicAttack: 0.70,   // 70% chance to use physical attack
    offensiveSpell: 0.30 // 30% chance to use damaging spell
  },

  CASTER: {
    basicAttack: 0.40,   // 40% physical
    offensiveSpell: 0.60 // 60% spells
  },

  HEALER: {
    basicAttack: 0.30,
    offensiveSpell: 0.40,
    healSelf: 0.30       // Heals when below 50% HP
  },

  BALANCED: {
    basicAttack: 0.50,
    offensiveSpell: 0.50
  },

  AOE_CASTER: {
    basicAttack: 0.30,
    aoeSpell: 0.70       // Prefers multi-target abilities
  },

  SUPPORT: {
    basicAttack: 0.30,
    offensiveSpell: 0.40,
    buff: 0.30           // Casts buffs on self
  },

  TANK: {
    basicAttack: 0.40,
    offensiveSpell: 0.30,
    defensiveBuff: 0.30  // Casts defensive buffs
  },

  VERSATILE: {
    randomAbility: 1.0   // Picks random ability each turn
  },

  WARRIOR: {
    strongAttack: 0.60,  // Prefers physical attacks
    spell: 0.25,
    buff: 0.15
  }
};
```

**Difficulty Progression:**
- **Starters (Lv 1-2):** Easy battles, teach basics
- **Early (Lv 2-3):** Moderate, introduce healing/buffs
- **Mid (Lv 3-4):** Challenging, require strategy
- **Late (Lv 4-5):** Hard, need optimized party
- **Kyle (Lv 5 Boss):** Hardest NPC, requires full preparation

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

## 9. BOSS ENCOUNTERS & FINAL BOSS

### 9.1 Nox Typhon - Final Boss

**🚨 CRITICAL: Complete final boss specifications**

```typescript
const NOX_TYPHON = {
  name: "Nox Typhon, Elemental Demon",
  level: 5,
  isBoss: true,
  cannotFlee: true,

  stats: {
    hp: 800,   // Requires full party + strategy to defeat
    pp: 200,
    atk: 35,
    def: 30,
    mag: 40,
    spd: 20
  },

  element: "Neutral",  // No element advantage/disadvantage

  abilities: [
    {
      name: "Elemental Fury",
      basePower: 80,
      manaCost: 4,
      targets: "all-allies",
      element: "Neutral"
    },
    {
      name: "Void Strike",
      basePower: 100,
      manaCost: 4,
      targets: "single-ally",
      ignoresDefense: true,  // Bypasses DEF entirely!
      element: "Neutral"
    },
    {
      name: "Dark Heal",
      heals: 150,
      manaCost: 4,
      targets: "self"
    },
    {
      name: "Elemental Chaos",  // Ultimate
      basePower: 150,
      manaCost: 4,
      targets: "all-allies",
      element: "Neutral"
    }
  ],

  phases: {
    phase1: {
      hpThreshold: [1.0, 0.51],  // 100% - 51% HP
      abilityPool: ["Elemental Fury", "Void Strike"],
      aiPattern: "random"
    },
    phase2: {
      hpThreshold: [0.50, 0.26],  // 50% - 26% HP
      abilityPool: ["Elemental Fury", "Void Strike", "Dark Heal"],
      aiPattern: "heal_when_below_40"
    },
    phase3: {
      hpThreshold: [0.25, 0.0],  // 25% - 0% HP
      abilityPool: ["ALL"],      // Can use any ability
      aiPattern: "aggressive",
      enraged: true,             // +25% damage
      speedBoost: 1.5            // Acts 50% more often
    }
  },

  rewards: {
    xp: 500,
    gold: 2000,
    guaranteedDrops: ["Sol Blade", "Dragon Scales"],
    storyFlag: "defeated_nox_typhon"
  }
};
```

**Phase Transitions:**
```typescript
function checkPhaseTransition(boss: Enemy): void {
  const hpPercent = boss.currentHp / boss.maxHp;

  if (hpPercent <= 0.5 && boss.currentPhase === 1) {
    boss.currentPhase = 2;
    displayMessage("Nox Typhon's power surges!");
  }

  if (hpPercent <= 0.25 && boss.currentPhase === 2) {
    boss.currentPhase = 3;
    boss.stats.atk *= 1.25;  // +25% damage
    boss.stats.spd *= 1.5;   // +50% speed
    displayMessage("Nox Typhon enters a rage!");
  }
}
```

---

## 10. STATUS EFFECTS & AILMENTS

### 10.1 Status Ailments

**🚨 CRITICAL: Debuff formulas**

```typescript
const STATUS_AILMENTS = {
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

**Example - Poison:**
```typescript
function applyPoisonDamage(unit: Unit): void {
  if (!unit.hasStatus("poison")) return;

  const damage = Math.floor(unit.maxHp * 0.08);
  unit.currentHp -= damage;

  displayMessage(`${unit.name} takes ${damage} poison damage!`);

  // Decrement duration
  unit.statusEffects.poison.duration--;
  if (unit.statusEffects.poison.duration <= 0) {
    removeStatus(unit, "poison");
    displayMessage(`${unit.name} recovered from poison!`);
  }
}
```

---

### 10.2 Buff/Debuff Duration Rules

**🚨 CRITICAL: How buff durations work**

```typescript
const BUFF_DURATION_RULES = {
  decrementTiming: "END_OF_BUFFED_UNIT_TURN",

  // Example: Isaac casts Blessing (duration 3)
  // Turn order: Isaac → Garet → Enemy
  //
  // Isaac's turn: Casts Blessing, duration = 3
  // Garet's turn: Blessing still active (3)
  // Enemy's turn: Blessing still active (3)
  // Isaac's turn END: Duration decrements to 2
  // ...repeats until duration = 0

  stacking: {
    sameBuff: "REFRESH",        // Recasting resets duration, doesn't stack
    differentBuffs: "STACK",    // Multiple different buffs can coexist
    maxActiveBuffs: 5           // Can't have more than 5 buffs at once
  },

  dispel: {
    "Dispel Magic": "REMOVES_ALL_BUFFS",
    "Debilitate": "REMOVES_ALL_DEBUFFS",
    "Inn Rest": "REMOVES_ALL"
  }
};
```

**Example - Blessing Duration:**
```typescript
// Isaac casts Blessing on himself (ATK +25%, MAG +25%, duration 3 turns)

turn1_start: {
  isaac.buffs = [{ name: "Blessing", atk: 1.25, mag: 1.25, duration: 3 }];
  isaac.stats.atk = 27 * 1.25 = 34;  // Buffed!
}

turn1_end: {
  // Isaac's turn ends → decrement duration
  isaac.buffs[0].duration = 2;
}

turn2_start: {
  // Blessing still active (duration 2)
  isaac.stats.atk = 34;  // Still buffed
}

turn2_end: {
  isaac.buffs[0].duration = 1;
}

turn3_end: {
  isaac.buffs[0].duration = 0;  // Expires!
  isaac.buffs = [];  // Remove buff
  isaac.stats.atk = 27;  // Back to normal
}
```

---

### 10.3 Buff Stacking Example

```typescript
// Isaac has Blessing active (ATK ×1.25, MAG ×1.25)
// Sheba casts Guardian Stance on Isaac (DEF ×1.5)

isaac.buffs = [
  { name: "Blessing", atk: 1.25, mag: 1.25, duration: 2 },
  { name: "Guardian Stance", def: 1.5, duration: 1 }
];

// Final stats (both buffs active):
isaac.stats.atk = 27 * 1.25 = 34;  // From Blessing
isaac.stats.def = 18 * 1.5 = 27;   // From Guardian Stance
isaac.stats.mag = 20 * 1.25 = 25;  // From Blessing

// If Isaac casts Blessing again:
// Old Blessing duration was 2 → refreshes to 3
// Does NOT stack to ×1.5625 (1.25 × 1.25)
```

---

## 11. DETERMINISTIC RNG

### 11.1 SeededRNG Usage

**🚨 CRITICAL: Replace all Math.random() calls**

```typescript
import { SeededRNG } from '@/utils/rng';

// ❌ WRONG (non-deterministic)
function getRandomMultiplier(): number {
  return 0.9 + (Math.random() * 0.2);
}

// ✅ CORRECT (deterministic)
function getRandomMultiplier(rng: SeededRNG): number {
  return 0.9 + (rng.float() * 0.2);
}

// ❌ WRONG
function checkCriticalHit(attacker: Unit): boolean {
  const totalChance = 0.05 + (attacker.stats.spd * 0.002);
  return Math.random() < totalChance;
}

// ✅ CORRECT
function checkCriticalHit(attacker: Unit, rng: SeededRNG): boolean {
  const totalChance = 0.05 + (attacker.stats.spd * 0.002);
  return rng.float() < totalChance;
}
```

**Battle RNG Seed:**
```typescript
class Battle {
  rng: SeededRNG;

  constructor(playerParty: Unit[], enemies: Enemy[], seed?: number) {
    this.rng = new SeededRNG(seed || Date.now());
    // All random events in this battle use this.rng
  }

  executeTurn(unit: Unit, action: Action): void {
    const damage = calculatePhysicalDamage(
      unit,
      target,
      ability,
      this.rng  // ← Pass RNG instance
    );
  }
}
```

---

### 11.2 Critical Hit Formula Clarification

**🚨 FIXED: Wording correction**

```typescript
// Critical hit formula
const baseCritRate = 0.05;  // 5% base
const speedBonus = attacker.stats.spd * 0.002;  // 0.2 percentage points per SPD

// NOT "0.2% per SPD" ← WRONG wording
// CORRECT: "0.2 percentage points per SPD"

// Example:
// Felix (SPD 30): 0.05 + (30 * 0.002) = 0.05 + 0.06 = 0.11 = 11% crit chance
//                                              ↑
//                                        6 percentage points, not 6%
```

---

### 11.3 Battle Design Principles

**🚨 NO FLEEING SYSTEM**

Vale Chronicles does not include a flee/escape mechanic:

**Design Rationale:**
- All battles are NPC-triggered (no random encounters)
- Players can prepare before each battle (team, Djinn, equipment)
- Auto-heal after every battle (no attrition penalty for losing)
- Cleaner battle flow (no escape option UI needed)
- Encourages tactical planning over risk avoidance

---

## 12. BATTLE TRANSITION SYSTEM

### 12.1 Transition Triggers

**🚨 CRITICAL: How battles are initiated**

```typescript
const BATTLE_TRIGGERS = {
  npcInteraction: {
    method: "TALK_TO_NPC",  // Walk up and press interact button
    npcTypes: [
      "RECRUITABLE_UNIT",    // Isaac, Garet, etc. (battle to recruit)
      "STORY_BOSS",          // Nox Typhon, etc.
      "TRAINING_DUMMY"       // Practice battles
    ]
  },

  randomEncounters: {
    enabled: false,  // NO random encounters while walking
    reasoning: "All battles are NPC-triggered for predictable difficulty"
  },

  forcedBattles: {
    method: "STORY_CUTSCENE",  // Scripted story battles
    examples: ["Tutorial battle", "Final boss cutscene"]
  }
};
```

### 12.2 Transition Animation Sequence

**From Overworld → Battle:**

```typescript
const BATTLE_TRANSITION_IN = {
  phase1: {
    name: "SWIRL",
    duration: 800,  // 800ms spiral effect
    effect: "Spiral wipe from center outward",
    color: "Black with white sparks",
    skipable: true  // Hold button to skip to phase 3
  },

  phase2: {
    name: "FADE_BLACK",
    duration: 200,  // 200ms fade to black
    effect: "Screen fades to solid black"
  },

  phase3: {
    name: "FADE_IN_BATTLE",
    duration: 300,  // 300ms battle screen fades in
    effect: "Battle background + units appear with fade-in"
  },

  totalDuration: 1300  // ~1.3 seconds total (if not skipped)
};
```

**Skip Behavior:**
```typescript
const SKIP_TRANSITION = {
  holdButton: "CONFIRM",  // Hold X/Enter/Space during transition
  skipToPhase: "FADE_IN_BATTLE",  // Skip directly to battle appearing
  minimumDuration: 300  // Must show at least 300ms (can't instant-skip)
};
```

### 12.3 Victory Transition Sequence

**From Battle → Overworld:**

```typescript
const BATTLE_TRANSITION_OUT = {
  phase1: {
    name: "VICTORY_FREEZE",
    duration: 500,  // 500ms - enemies disappear, party strikes victory pose
    effect: "Freeze frame + victory music starts"
  },

  phase2: {
    name: "FADE_BLACK",
    duration: 200,  // 200ms fade to black
    effect: "Battle screen fades out"
  },

  phase3: {
    name: "REWARDS_SCREEN",
    duration: 0,  // Variable (player-controlled with Continue button)
    effect: "Show rewards screen (XP, gold, items, level ups, recruitment)"
  },

  phase4: {
    name: "FADE_BLACK_AFTER_REWARDS",
    duration: 200,  // 200ms fade to black from rewards
    effect: "Rewards screen fades out"
  },

  phase5: {
    name: "FADE_IN_OVERWORLD",
    duration: 300,  // 300ms overworld fades back in
    effect: "Return to overworld at same position"
  },

  totalDuration: "1200 + rewardsTime"  // ~1.2s + however long player views rewards
};
```

### 12.4 Defeat Transition Sequence

**From Battle → Game Over:**

```typescript
const DEFEAT_TRANSITION = {
  phase1: {
    name: "DEFEAT_FREEZE",
    duration: 1000,  // 1 second - party collapses
    effect: "Units fall down, screen shakes, defeat sound"
  },

  phase2: {
    name: "FADE_BLACK",
    duration: 500,  // 500ms slow fade to black
    effect: "Battle screen fades out slowly"
  },

  phase3: {
    name: "GAME_OVER_SCREEN",
    duration: 0,  // Variable (player-controlled)
    effect: "Show 'GAME OVER' text + options: 'Continue from last save' or 'Return to title'"
  },

  totalDuration: "1500 + playerChoice"
};
```

### 12.5 Flee Transition Sequence

**From Battle → Overworld (Successful Flee):**

```typescript
const FLEE_TRANSITION = {
  phase1: {
    name: "FLEE_ANIMATION",
    duration: 800,  // 800ms - party runs off screen
    effect: "Units run to right side of screen, smoke cloud"
  },

  phase2: {
    name: "FADE_BLACK",
    duration: 200,  // 200ms fade to black
    effect: "Battle screen fades out"
  },

  phase3: {
    name: "FADE_IN_OVERWORLD",
    duration: 300,  // 300ms overworld fades in
    effect: "Return to overworld (no rewards, no XP)"
  },

  totalDuration: 1300  // ~1.3 seconds
};
```

**Failed Flee:**
```typescript
const FAILED_FLEE = {
  effect: "NO_TRANSITION",  // Stay in battle
  message: "Couldn't escape!",
  penalty: "Wasted turn"  // Enemy gets to act
};
```

### 12.6 Battle Background Selection

**🚨 CRITICAL: Which background to show**

```typescript
const BATTLE_BACKGROUNDS = {
  default: "vale_grassland",  // Green grass + trees

  locationBased: {
    "vale-village": "vale_grassland",
    "sol-sanctum": "temple_interior",
    "vale-outskirts": "forest_clearing",
    "healing-house": "house_interior",
    "final-boss": "void_dimension"  // Special for Nox Typhon
  },

  selectionRule: "USE_OVERWORLD_LOCATION"  // Look up player's current map area
};
```

### 12.7 Battle Music Selection

```typescript
const BATTLE_MUSIC = {
  regular: "battle_theme.ogg",  // Standard battle music
  boss: "boss_battle.ogg",      // For isBoss: true enemies
  finalBoss: "final_boss.ogg",  // For Nox Typhon specifically
  victory: "victory_fanfare.ogg"  // Plays during VICTORY_FREEZE phase
};
```

### 12.8 Performance Optimization

```typescript
const TRANSITION_OPTIMIZATION = {
  preloadAssets: [
    "battleBackground",  // Load before transition starts
    "enemySprites",
    "battleMusic"
  ],

  unloadAfterBattle: [
    "battleBackground",  // Unload after returning to overworld
    "enemySprites"
  ],

  cacheForSession: [
    "partySprites",      // Keep party sprites loaded
    "uiElements"
  ]
};
```

---

## 13. OVERWORLD MECHANICS

### 13.1 Movement System

**🚨 CRITICAL: Player movement specifications**

```typescript
const OVERWORLD_MOVEMENT = {
  pixelsPerSecond: 120,  // Movement speed (2 pixels per frame at 60fps)
  diagonalMovement: true, // Can move diagonally
  diagonalSpeedCorrection: true,  // √2 correction (prevents faster diagonal)

  controls: {
    keyboard: ["WASD", "Arrow Keys"],
    gamepad: ["Left Stick", "D-Pad"]
  },

  collisionLayers: [
    "WALLS",      // Buildings, trees, rocks
    "NPCS",       // Cannot walk through NPCs
    "TRIGGERS"    // Event triggers (battles, cutscenes)
  ]
};
```

### 13.2 Camera System

```typescript
const CAMERA_SYSTEM = {
  followPlayer: true,  // Camera centers on player
  smoothing: 0.1,      // Lerp factor for smooth follow
  boundaries: "MAP_EDGES",  // Camera stops at map boundaries

  viewportSize: {
    width: 240,   // 240px (15 tiles at 16px each)
    height: 160   // 160px (10 tiles at 16px each)
  },

  zoomLevel: 3  // 3× scale for pixelPerfect rendering
};
```

### 13.3 Encounter System

**🚨 CRITICAL: NO RANDOM ENCOUNTERS!**

```typescript
const ENCOUNTER_SYSTEM = {
  randomEncounters: false,  // NO random battles while walking

  battleTriggers: {
    type: "NPC_ONLY",  // All battles are triggered by talking to NPCs
    interactButton: "CONFIRM",  // Press X/Enter/Space to initiate
    npcIndicator: "EXCLAMATION_MARK"  // Visual indicator above battle NPCs
  },

  reasoning: "Predictable difficulty progression, player controls pacing"
};
```

### 13.4 Save Points

```typescript
const SAVE_POINTS = {
  type: "INN_ONLY",  // Can only save at inns
  autoSave: {
    triggers: [
      "AFTER_INN_REST",
      "AFTER_MAJOR_STORY_EVENT",
      "AFTER_RECRUITMENT",
      "BEFORE_BOSS_BATTLE"
    ],
    singleSlot: true  // Only one auto-save slot
  }
};
```

### 13.5 Map Regions

```typescript
const MAP_REGIONS = {
  "vale-village": {
    name: "Vale Village",
    size: { width: 40, height: 30 },  // In tiles (16px each)
    npcs: ["Isaac", "Garet", "Ivan", "Jenna (pre-recruit)"],
    shops: ["Equipment Shop"],
    inn: true,
    battleBackground: "vale_grassland"
  },

  "vale-outskirts": {
    name: "Vale Outskirts",
    size: { width: 50, height: 40 },
    npcs: ["Felix", "Training Dummy"],
    shops: [],
    inn: false,
    battleBackground: "forest_clearing"
  },

  "sol-sanctum": {
    name: "Sol Sanctum",
    size: { width: 30, height: 50 },
    npcs: ["Mia", "Kyle (late game)"],
    shops: [],
    inn: false,
    battleBackground: "temple_interior"
  },

  // ... more regions defined in map data files
};
```

---

## 14. SHOP SYSTEM

**🚨 DESIGN NOTE:** No consumable items in this game. Healing/buffs handled by abilities (Ply, Wish, etc.). Shops sell equipment only.

### 14.1 Shop Types

```typescript
const SHOP_TYPES = {
  equipmentShop: {
    inventory: ["Equipment only"],
    items: ["Weapons", "Armor", "Helms", "Boots"]
  },

  specialShop: {
    inventory: ["Rare equipment after story flags"],
    unlockCondition: "STORY_PROGRESSION"
  }
};
```

### 14.2 Buying System

**🚨 CRITICAL: Purchase mechanics**

```typescript
const BUYING_SYSTEM = {
  priceFormula: (item) => item.baseCost,  // Fixed prices (no negotiation)
  stock: "UNLIMITED",  // Can buy as many as affordable

  requirements: {
    goldCheck: true,  // Must have enough gold
    inventorySpace: true  // Must have equipment space (unlimited)
  },

  transaction: {
    goldDeducted: "IMMEDIATELY",
    itemAdded: "IMMEDIATELY",
    undoable: false  // Cannot undo purchases
  }
};
```

**Starting Gold:**
```typescript
const STARTING_RESOURCES = {
  gold: 500,  // Player starts with 500 gold

  // Can afford at start:
  // - Wooden Sword (50g) + Leather Vest (80g) = 130g
  // - 370g remaining for other equipment

  initialInventory: []  // Starts with no equipment (must buy from shops)
};
```

### 14.3 Equipment Unlock System

**🚨 CRITICAL: No Selling - Permanent Unlocks**

```typescript
const UNLOCK_SYSTEM = {
  enabled: true,  // Players unlock equipment permanently

  unlockMechanic: "PERMANENT",  // Once unlocked, always available
  
  starterKits: {
    description: "Full equipment set for new recruits",
    contents: "Weapon + Armor + Helm + Boots + Accessory",
    cost: "Varies by unit (200-500g typical)",
    unlocks: "That unit's full equipment store"
  },

  unitStores: {
    description: "Unit-specific equipment catalog",
    access: "After purchasing Starter Kit",
    items: "All tiers (Basic → Artifact)",
    noSelling: true  // Cannot sell or undo unlocks
  }
};
```

**Example:**
```typescript
// Recruit Isaac → Starter Kit available
// Buy Isaac's Starter Kit (350g)
player.gold -= 350;
isaac.equipment = { weapon: "basic-sword", armor: "basic-mail", ... };
isaac.storeUnlocked = true;

// Browse Isaac's store → Unlock Sol Blade
player.gold -= 15000;
isaac.availableEquipment.push("sol-blade");
// Equipment permanently unlocked, can equip anytime
```

### 14.4 Shop Inventory by Location

```typescript
const SHOP_INVENTORY = {
  "vale-village-equipment-shop": {
    name: "Vale Equipment Shop",
    items: [
      { id: "wooden-sword", price: 50, stock: "UNLIMITED" },
      { id: "leather-vest", price: 80, stock: "UNLIMITED" },
      { id: "cloth-cap", price: 60, stock: "UNLIMITED" },
      { id: "leather-boots", price: 70, stock: "UNLIMITED" },
      // Iron tier unlocks after first boss
      { id: "iron-sword", price: 200, unlockFlag: "defeated_first_boss" },
      { id: "iron-armor", price: 300, unlockFlag: "defeated_first_boss" },
      { id: "iron-helm", price: 150, unlockFlag: "defeated_first_boss" },
      { id: "iron-boots", price: 100, unlockFlag: "defeated_first_boss" }
    ]
  },

  "special-shop": {
    name: "Legendary Trader",
    items: [
      { id: "steel-sword", price: 500, unlockFlag: "recruited_3_units" },
      { id: "steel-armor", price: 700, unlockFlag: "recruited_3_units" },
      { id: "steel-helm", price: 400, unlockFlag: "recruited_3_units" },
      { id: "hyper-boots", price: 750, unlockFlag: "recruited_3_units" },
      // Legendary tier (very expensive)
      { id: "sol-blade", price: 10000, unlockFlag: "defeated_kyle" },
      { id: "dragon-scales", price: 4000, unlockFlag: "defeated_nox_typhon" },
      { id: "oracles-crown", price: 3500, unlockFlag: "defeated_kyle" },
      { id: "hermes-sandals", price: 5000, unlockFlag: "recruited_all_units" }
    ]
  }
};
```

---

## 15. POST-BATTLE AUTO-HEAL

### 15.1 Auto-Heal Mechanics

**🚨 CRITICAL: Automatic healing after every battle**

```typescript
const AUTO_HEAL_SYSTEM = {
  triggers: ["BATTLE_VICTORY", "BATTLE_DEFEAT"],
  
  effects: {
    restoreHP: 1.0,              // Full HP restore (100%)
    cureStatusAilments: true,    // Remove poison, burn, freeze, paralyze
  },

  timing: "IMMEDIATE_AFTER_REWARDS",  // After rewards screen, before returning to overworld
  
  noManualHealing: true  // No inns, no healing items needed
};
```

### 15.2 Implementation

```typescript
function onBattleEnd(units: Unit[], battleResult: "victory" | "defeat"): void {
  // Restore all units (win or lose)
  units.forEach(unit => {
    unit.currentHp = unit.maxHp;  // Full HP
    unit.statusAilments = [];     // Clear all status effects
  });
  
  // No PP to restore (mana-only system)
  // No gold cost
  // Always triggers (cannot be disabled)
}
```

**Design Rationale:**
- Simplifies resource management (focus on battle tactics, not healing logistics)
- Removes tedious inn visits
- Allows continuous battle progression
- Losing a battle doesn't require backtracking to heal

---

## SUMMARY: KEY NUMBERS

**Leveling:**
- XP to Level 20: 92,800 total
- Abilities unlock progressively at levels 1-20

**Djinn:**
- 12 total collectible (3 per element: Venus, Mars, Mercury, Jupiter)
- 3 team slots (GLOBAL - affects all 4 party members)
- Choose 3 from 12 collected (strategic depth!)
- Element compatibility: Same=best bonus+2 abilities, Counter=penalty+2 abilities, Neutral=moderate+1 ability
- ~180 unique Djinn-granted abilities total across all combinations
- Activation: Powerful summon effect but lose stat bonuses AND abilities until recovery
- Recovery: 1 Djinn=2 turns, 2 Djinn=3 turns, 3 Djinn=4 turns

**Equipment:**
- 5 slots: Weapon, Armor, Helm, Boots, Accessory
- Unit-locked (each character has exclusive equipment)
- All equipment has special effects
- Rare items can provide any stat combinations

**Battle:**
- XP: 50 + (level × 10), ×0.8 for parties
- Gold: 25 + (level × 15)
- Equipment rewards: Predetermined (no RNG), may offer choice of 1 of 3
- Auto-heal after every battle (win or lose)

**Abilities:**
- Mana-based system (no PP)
- Basic attack: 0 mana
- Low-cost: 1 mana
- Mid-tier: 2-3 mana
- Ultimate: 4 mana
- Mana refills each planning phase

---

## 9. ENEMY CATALOG

### 9.1 Enemy System Overview

**Total Enemies Implemented:** 30 (10 original + 20 Batch 1)
**Total Enemies Planned:** 173 (enemies.ts will scale to 179 total with all batches)

### 9.2 Enemy Categories

#### Original Enemies (10 total)

**Tier 1: Early Game (Levels 1-2)**
- Goblin (Level 1, Neutral) - 30 HP, 8 ATK, 5 DEF
- Wild Wolf (Level 1, Neutral) - 25 HP, 10 ATK, 3 DEF, fast (12 SPD)
- Slime (Level 2, Mercury) - 40 HP, 6 ATK, 8 DEF, uses Frost

**Tier 2: Mid Game (Levels 2-3)**
- Fire Sprite (Level 2, Mars) - 45 HP, 12 MAG, uses Fireball
- Earth Golem (Level 3, Venus) - 90 HP, 20 DEF, uses Quake, tank enemy
- Wind Wisp (Level 3, Jupiter) - 55 HP, 18 SPD, 16 MAG, uses Plasma

**Tier 3: Late Game (Levels 4-5)**
- Fire Elemental (Level 4, Mars) - 120 HP, 22 MAG, uses Volcano
- Ice Guardian (Level 4, Mercury) - 140 HP, 18 DEF, uses Ice Horn
- Stone Titan (Level 5, Venus) - 180 HP, 28 DEF, uses Clay Spire, boss-tier
- Storm Lord (Level 5, Jupiter) - 150 HP, 28 MAG, 22 SPD, uses Plasma

#### Batch 1: Basic Enemies (20 total - Levels 1-2)

**Level 1 Wildlife & Pests (10 enemies)**
- Rat (Level 1, Neutral) - 20 HP, fast pest, low ATK
- Bat (Level 1, Jupiter) - 18 HP, flying enemy, 14 SPD, uses Gust
- Spider (Level 1, Venus) - 22 HP, web attacks
- Grub (Level 1, Neutral) - 28 HP, defensive (8 DEF), slow
- Worm (Level 1, Venus) - 24 HP, uses Quake, burrowing
- Vermin (Level 1, Neutral) - 16 HP, fast swarm unit
- Mini-Goblin (Level 1, Neutral) - 22 HP, weaker goblin variant
- Kobold (Level 1, Neutral) - 26 HP, small humanoid
- Roach (Level 1, Neutral) - 19 HP, fast pest
- Momonga (Level 1, Neutral) - 21 HP, flying squirrel

**Level 2 Nature & Creatures (10 enemies)**
- Emu (Level 2, Neutral) - 35 HP, fast bird (15 SPD)
- Seabird (Level 2, Jupiter) - 30 HP, uses Gust, coastal
- Seafowl (Level 2, Jupiter) - 32 HP, uses Gust, water bird
- Wild Mushroom (Level 2, Venus) - 38 HP, uses Quake, plant enemy
- Poison Toad (Level 2, Mercury) - 36 HP, uses Frost, poison
- Devil Frog (Level 2, Mercury) - 40 HP, uses Frost, drops Leather Vest (8%)
- Mole (Level 2, Venus) - 34 HP, defensive (10 DEF), uses Quake
- Mad Mole (Level 2, Venus) - 37 HP, aggressive mole variant
- Mad Vermin (Level 2, Neutral) - 29 HP, fast (15 SPD), rabid
- Squirrelfang (Level 2, Neutral) - 31 HP, aggressive rodent

### 9.3 Enemy Integration in Areas

**Vale Village (Town)**
- NPC battles use: Goblin, Wild Wolf, Slime, Earth Golem, Fire Sprite, Wind Wisp
- NEW NPCs use: Rat, Spider, Bat, Roach, Vermin, Grub, Worm, Mini-Goblin, Kobold, Seabird, Seafowl

**Forest Path (Dungeon - Random Encounters)**
- Enemy pools (100% total weight):
  - Wild Wolf (30%)
  - Goblin × 2 (25%)
  - Slime + Wild Wolf (15%)
  - Rat × 3 swarm (10%) - NEW
  - Bat × 2 flying (8%) - NEW
  - Spider + Grub (7%) - NEW
  - Poison Toad + Mole (5%) - NEW

**Ancient Ruins (Dungeon - Random Encounters)**
- Enemy pools: Goblin × 2 (40%), Wild Wolf + Goblin (35%), Slime × 2 + Goblin (25%)
- Boss: Golem King (Goblin + Wild Wolf + Goblin)

### 9.4 Enemy Design Guidelines

**Stat Scaling by Level:**
- **Level 1-2:** HP: 16-40, ATK: 4-12, DEF: 2-10, SPD: 4-16
- **Level 3-4:** HP: 45-140, ATK: 8-18, DEF: 6-20, SPD: 5-22
- **Level 5:** HP: 150-180, ATK: 20-28, DEF: 12-28, SPD: 8-22

**Enemy Archetypes:**
- **Swarm:** Low HP, fast, appear in groups (Rat, Vermin, Bat)
- **Tank:** High HP/DEF, slow, strong attacks (Grub, Golem, Mole)
- **Fast:** High SPD, low DEF, dodge-focused (Bat, Emu, Mad Vermin)
- **Caster:** Uses Psynergy, high MAG, low physical stats (Sprites, Wisps)
- **Balanced:** Medium all stats, reliable (Goblin, Wolf, Kobold)

**Drop Rates:**
- Common enemies: 0-8% drop rate
- Mid-tier: 10-18% drop rate
- Elite: 20-25% drop rate

### 9.5 Enemy Implementation Status

**Completed Batches:**
- ✅ Batch 1: 20 basic enemies (Levels 1-2)

**Planned Batches (149 enemies remaining):**
- ⬜ Batch 2: 25 common enemies (Levels 2-3) - Hobgoblins, Wolfkin, Ants, Bees
- ⬜ Batch 3: 25 intermediate enemies (Levels 3-4) - Gnomes, Undead, Spirits, Orcs
- ⬜ Batch 4: 25 advanced enemies (Levels 4-5) - Lizardmen, Golems, Gargoyles
- ⬜ Batch 5: 25 elite enemies (Levels 5-6) - Trolls, Harpies, Gryphons, Wyverns
- ⬜ Batch 6: 25 high-level enemies (Levels 6-8) - Dragons, Demons, Chimeras
- ⬜ Batch 7: 24 late-game enemies (Levels 8-10) - Liches, Titans, Ancient Horrors

**See:** `/docs/ENEMY_IMPLEMENTATION_PLAN.md` for complete enemy roster

---

## BALANCE CHANGES SUMMARY

**Date Applied**: 2025-11-03
**Rationale**: Fix gameplay balance issues identified through testing

### Changes Made:

1. **Isaac**: ATK base 15→14 (create unit identity vs Garet)
2. **Garet**: ATK 18→19, ATK growth 4→3, DEF 8→7, SPD 10→8 (glass cannon archetype)
3. **Felix**: ATK growth 4→3 (reduce power gap)
4. **Jenna**: ATK 9→11, MAG 20→28 (glass cannon damage output)
5. **Piers**: ATK 14→10, ATK growth 2→1, MAG 13→9 (tank trades damage for survivability)
6. **Kraden**: ATK growth 1→2 (improve viability)

### Impact:
- Power gap reduced from 3.88× to 2.25× (all units viable)
- Clear archetypes: Glass Cannon (high damage, low defense), Tank (high HP/DEF, low damage), Balanced
- Unit identity established (3+ stat differences >10% between similar units)
- All units now viable with distinct playstyles

---

**All formulas defined with EXACT numbers!** ✅

**Next Document:** TASK_BREAKDOWN.md (20+ tasks for Coder)
