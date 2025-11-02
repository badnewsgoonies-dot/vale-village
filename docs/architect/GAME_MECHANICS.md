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

### 1.5 Complete Ability Definitions (Audited from Implementation)

**Source:** Audited from `src/data/abilities.ts` and `src/data/unitDefinitions.ts`

#### Physical Attacks (0 PP Cost - Always Available)

| Ability ID | Name   | Type     | PP Cost | Base Power | Targets        | Unlock Level | Special |
|------------|--------|----------|---------|------------|----------------|--------------|---------|
| slash      | Slash  | physical | 0       | 0          | single-enemy   | 1            | Uses ATK stat for damage |
| cleave     | Cleave | physical | 0       | 0          | single-enemy   | 1            | Uses ATK stat for damage |

**Implementation:**
```typescript
export const SLASH: Ability = {
  id: 'slash',
  name: 'Slash',
  type: 'physical',
  ppCost: 0,
  basePower: 0,  // Damage calculated from ATK stat
  targets: 'single-enemy',
  unlockLevel: 1
};

export const CLEAVE: Ability = {
  id: 'cleave',
  name: 'Cleave',
  type: 'physical',
  ppCost: 0,
  basePower: 0,  // Damage calculated from ATK stat
  targets: 'single-enemy',
  unlockLevel: 1
};
```

#### Venus (Earth) Elemental Abilities

| Ability ID    | Name        | Type      | PP Cost | Base Power | Targets        | Unlock Level | Special |
|---------------|-------------|-----------|---------|------------|----------------|--------------|---------|
| quake         | Quake       | offensive | 5       | 30         | all-enemies    | 2            | AoE earth damage |
| clay-spire    | Clay Spire  | offensive | 10      | 60         | single-enemy   | 3            | Single-target spike |
| ragnarok      | Ragnarok    | offensive | 15      | 100        | single-enemy   | 4            | Heavy earth blade |
| judgment      | Judgment    | offensive | 25      | 150        | all-enemies    | 5            | Ultimate AoE |

**Implementation:**
```typescript
export const QUAKE: Ability = {
  id: 'quake',
  name: 'Quake',
  type: 'offensive',
  element: 'Venus',
  ppCost: 5,
  basePower: 30,
  targets: 'all-enemies',
  unlockLevel: 2
};

export const CLAY_SPIRE: Ability = {
  id: 'clay-spire',
  name: 'Clay Spire',
  type: 'offensive',
  element: 'Venus',
  ppCost: 10,
  basePower: 60,
  targets: 'single-enemy',
  unlockLevel: 3
};

export const RAGNAROK: Ability = {
  id: 'ragnarok',
  name: 'Ragnarok',
  type: 'offensive',
  element: 'Venus',
  ppCost: 15,
  basePower: 100,
  targets: 'single-enemy',
  unlockLevel: 4
};

export const JUDGMENT: Ability = {
  id: 'judgment',
  name: 'Judgment',
  type: 'offensive',
  element: 'Venus',
  ppCost: 25,
  basePower: 150,
  targets: 'all-enemies',
  unlockLevel: 5
};
```

#### Mars (Fire) Elemental Abilities

| Ability ID      | Name           | Type      | PP Cost | Base Power | Targets        | Unlock Level | Special |
|-----------------|----------------|-----------|---------|------------|----------------|--------------|---------|
| fireball        | Fireball       | offensive | 5       | 32         | single-enemy   | 2            | Single-target burn |
| volcano         | Volcano        | offensive | 12      | 65         | all-enemies    | 3            | AoE eruption |
| meteor-strike   | Meteor Strike  | offensive | 18      | 110        | single-enemy   | 4            | Heavy single-hit |
| pyroclasm       | Pyroclasm      | offensive | 30      | 170        | all-enemies    | 5            | Ultimate fire AoE |

**Implementation:**
```typescript
export const FIREBALL: Ability = {
  id: 'fireball',
  name: 'Fireball',
  type: 'offensive',
  element: 'Mars',
  ppCost: 5,
  basePower: 32,
  targets: 'single-enemy',
  unlockLevel: 2
};

export const VOLCANO: Ability = {
  id: 'volcano',
  name: 'Volcano',
  type: 'offensive',
  element: 'Mars',
  ppCost: 12,
  basePower: 65,
  targets: 'all-enemies',
  unlockLevel: 3
};

export const METEOR_STRIKE: Ability = {
  id: 'meteor-strike',
  name: 'Meteor Strike',
  type: 'offensive',
  element: 'Mars',
  ppCost: 18,
  basePower: 110,
  targets: 'single-enemy',
  unlockLevel: 4
};

export const PYROCLASM: Ability = {
  id: 'pyroclasm',
  name: 'Pyroclasm',
  type: 'offensive',
  element: 'Mars',
  ppCost: 30,
  basePower: 170,
  targets: 'all-enemies',
  unlockLevel: 5
};
```

#### Mercury (Water) Abilities (Healing + Damage)

| Ability ID         | Name               | Type      | PP Cost | Base Power | Targets        | Unlock Level | Special |
|--------------------|--------------------|-----------|---------|------------|----------------|--------------|---------|
| ply                | Ply                | healing   | 4       | 40         | single-ally    | 1            | Basic heal |
| frost              | Frost              | offensive | 6       | 28         | all-enemies    | 2            | AoE ice damage |
| ice-horn           | Ice Horn           | offensive | 11      | 58         | single-enemy   | 3            | Single-target pierce |
| wish               | Wish               | healing   | 15      | 70         | all-allies     | 4            | Party-wide heal |
| glacial-blessing   | Glacial Blessing   | healing   | 35      | 120        | all-allies     | 5            | Ultimate heal + revive |

**Implementation:**
```typescript
export const PLY: Ability = {
  id: 'ply',
  name: 'Ply',
  type: 'healing',
  element: 'Mercury',
  ppCost: 4,
  basePower: 40,
  targets: 'single-ally',
  unlockLevel: 1
};

export const FROST: Ability = {
  id: 'frost',
  name: 'Frost',
  type: 'offensive',
  element: 'Mercury',
  ppCost: 6,
  basePower: 28,
  targets: 'all-enemies',
  unlockLevel: 2
};

export const ICE_HORN: Ability = {
  id: 'ice-horn',
  name: 'Ice Horn',
  type: 'offensive',
  element: 'Mercury',
  ppCost: 11,
  basePower: 58,
  targets: 'single-enemy',
  unlockLevel: 3
};

export const WISH: Ability = {
  id: 'wish',
  name: 'Wish',
  type: 'healing',
  element: 'Mercury',
  ppCost: 15,
  basePower: 70,
  targets: 'all-allies',
  unlockLevel: 4
};

export const GLACIAL_BLESSING: Ability = {
  id: 'glacial-blessing',
  name: 'Glacial Blessing',
  type: 'healing',
  element: 'Mercury',
  ppCost: 35,
  basePower: 120,
  targets: 'all-allies',
  unlockLevel: 5,
  revivesFallen: true  // Special: Can revive KO'd allies with 50% HP
};
```

#### Jupiter (Wind) Elemental Abilities

| Ability ID    | Name         | Type      | PP Cost | Base Power | Targets        | Unlock Level | Special |
|---------------|--------------|-----------|---------|------------|----------------|--------------|---------|
| gust          | Gust         | offensive | 4       | 25         | single-enemy   | 2            | Basic wind blade |
| plasma        | Plasma       | offensive | 10      | 55         | all-enemies    | 3            | Chain damage effect |
| thunderclap   | Thunderclap  | offensive | 16      | 95         | all-enemies    | 4            | AoE lightning |
| tempest       | Tempest      | offensive | 28      | 160        | all-enemies    | 5            | Ultimate wind storm |

**Implementation:**
```typescript
export const GUST: Ability = {
  id: 'gust',
  name: 'Gust',
  type: 'offensive',
  element: 'Jupiter',
  ppCost: 4,
  basePower: 25,
  targets: 'single-enemy',
  unlockLevel: 2
};

export const PLASMA: Ability = {
  id: 'plasma',
  name: 'Plasma',
  type: 'offensive',
  element: 'Jupiter',
  ppCost: 10,
  basePower: 55,
  targets: 'all-enemies',
  unlockLevel: 3,
  chainDamage: true  // Special: 10% chance to hit twice
};

export const THUNDERCLAP: Ability = {
  id: 'thunderclap',
  name: 'Thunderclap',
  type: 'offensive',
  element: 'Jupiter',
  ppCost: 16,
  basePower: 95,
  targets: 'all-enemies',
  unlockLevel: 4
};

export const TEMPEST: Ability = {
  id: 'tempest',
  name: 'Tempest',
  type: 'offensive',
  element: 'Jupiter',
  ppCost: 28,
  basePower: 160,
  targets: 'all-enemies',
  unlockLevel: 5
};
```

#### Buff Abilities (Support)

| Ability ID         | Name               | Type | PP Cost | Buff Effect                | Duration | Unlock Level | Special |
|--------------------|--------------------|------|---------|----------------------------|----------|--------------|---------|
| blessing           | Blessing           | buff | 8       | ATK +25%, DEF +25%         | 3 turns  | 3            | Balanced party buff |
| guardians-stance   | Guardian's Stance  | buff | 6       | DEF +50%                   | 2 turns  | 3            | Tank defensive boost |
| winds-favor        | Wind's Favor       | buff | 10      | SPD +40%, Evasion +20%     | 3 turns  | 3            | Speed/dodge boost |

**Implementation:**
```typescript
export const BLESSING: Ability = {
  id: 'blessing',
  name: 'Blessing',
  type: 'buff',
  ppCost: 8,
  buffEffect: {
    atk: 1.25,  // 25% ATK increase
    def: 1.25   // 25% DEF increase
  },
  duration: 3,  // 3 turns
  targets: 'single-ally',
  unlockLevel: 3
};

export const GUARDIANS_STANCE: Ability = {
  id: 'guardians-stance',
  name: "Guardian's Stance",
  type: 'buff',
  ppCost: 6,
  buffEffect: {
    def: 1.5  // 50% DEF increase
  },
  duration: 2,  // 2 turns
  targets: 'self',
  unlockLevel: 3
};

export const WINDS_FAVOR: Ability = {
  id: 'winds-favor',
  name: "Wind's Favor",
  type: 'buff',
  ppCost: 10,
  buffEffect: {
    spd: 1.4,     // 40% SPD increase
    evasion: 20   // +20% evasion chance
  },
  duration: 3,  // 3 turns
  targets: 'single-ally',
  unlockLevel: 3
};
```

#### Unit Ability Assignment Matrix

**All 10 Units with Their 5 Abilities:**

| Unit   | Element  | Role               | Ability 1 | Ability 2 | Ability 3         | Ability 4      | Ability 5        |
|--------|----------|--------------------|-----------|-----------|-------------------|----------------|------------------|
| Isaac  | Venus    | Balanced Warrior   | Slash     | Quake     | Clay Spire        | Ragnarok       | Judgment         |
| Garet  | Mars     | Pure DPS           | Cleave    | Fireball  | Volcano           | Meteor Strike  | Pyroclasm        |
| Ivan   | Jupiter  | Elemental Mage     | Slash     | Gust      | Plasma            | Thunderclap    | Tempest          |
| Mia    | Mercury  | Healer             | Ply       | Frost     | Ice Horn          | Wish           | Glacial Blessing |
| Felix  | Venus    | Rogue Assassin     | Slash     | Quake     | Clay Spire        | Ragnarok       | Judgment         |
| Jenna  | Mars     | AoE Fire Mage      | Cleave    | Fireball  | Volcano           | Meteor Strike  | Pyroclasm        |
| Sheba  | Jupiter  | Support Buffer     | Slash     | Gust      | Blessing          | Thunderclap    | Tempest          |
| Piers  | Mercury  | Defensive Tank     | Cleave    | Frost     | Guardian's Stance | Wish           | Glacial Blessing |
| Kraden | Venus    | Versatile Scholar  | Slash     | Quake     | Blessing          | Ragnarok       | Judgment         |
| Kyle   | Mars     | Master Warrior     | Cleave    | Fireball  | Guardian's Stance | Meteor Strike  | Pyroclasm        |

**Ability Distribution Summary:**
- **23 unique abilities total** (not 50 - many abilities are shared between units of same element)
- **10 units × 5 abilities each = 50 total assignments**
- **Elemental consistency:** Units of same element share most abilities (Isaac/Felix share Venus, Garet/Jenna share Mars)
- **Role differentiation:** Support roles get buff abilities (Sheba/Kraden have Blessing, Piers/Kyle have Guardian's Stance)

#### Balance Verification

**PP Cost Progression:** ✅ VERIFIED
- Physical attacks: 0 PP (always available)
- Basic spells (Lv2): 4-6 PP
- Mid-tier spells (Lv3): 10-12 PP
- Strong spells (Lv4): 15-18 PP
- Ultimate spells (Lv5): 25-35 PP

**Base Power Progression:** ✅ VERIFIED
- Physical attacks: 0 base power (uses ATK stat directly)
- Basic spells: 25-32 damage
- Mid-tier spells: 55-65 damage
- Strong spells: 95-110 damage
- Ultimate spells: 150-170 damage
- Healing: 40 (basic) → 70 (party) → 120 (ultimate with revive)

**Unlock Level Consistency:** ✅ VERIFIED
- All abilities unlock at levels 1-5 (matches XP curve max level)
- Physical attacks at Lv1 (free)
- Basic spells at Lv2
- Mid-tier at Lv3 (including all buff abilities)
- Strong at Lv4
- Ultimate at Lv5

**Special Mechanics:** ✅ VERIFIED
- `chainDamage` on Plasma (10% double-hit chance)
- `revivesFallen` on Glacial Blessing (revives KO'd allies with 50% HP)
- `buffEffect` on 3 buff abilities (stat multipliers + duration)

**Targeting Balance:** ✅ VERIFIED
- Single-target abilities generally have higher base power
- AoE abilities have lower base power but hit all enemies
- Mix ensures tactical variety (single-target burst vs AoE clear)

**Element Distribution:** ✅ VERIFIED
- **Venus (Earth):** 2 units (Isaac, Felix) + 2 hybrids with Blessing (Sheba, Kraden)
- **Mars (Fire):** 3 units (Garet, Jenna, Kyle) - most DPS-focused element
- **Mercury (Water):** 2 units (Mia, Piers) - only healer element
- **Jupiter (Wind):** 2 units (Ivan, Sheba) - fastest units

---

## 2. DJINN SYSTEM

### 2.0 Djinn Slot System

**🚨 CRITICAL DESIGN DECISION:**

```typescript
const DJINN_SLOTS = {
  slotsPerUnit: 3,        // Each unit has 3 Djinn slots
  maxPerTeam: 12,         // 4 units × 3 slots = 12 total
  canEquipToAnyUnit: true // Any Djinn can go on any unit
};
```

**Clarification:**
- **Per-Unit System:** Each UNIT has 3 Djinn slots (like Golden Sun)
- **Not Global:** NOT 3 slots for the entire team
- **Example:** Isaac can have 3 Djinn, Garet can have 3 Djinn, etc.
- **Total Possible:** 4 active units × 3 slots = 12 Djinn can be equipped at once
- **Collection Limit:** 12 total Djinn exist (3 per element)

---

### 2.1 Djinn Passive Synergy Formulas

**🚨 CRITICAL: Synergy scales with Djinn COUNT!**

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
  whoCanActivate: "any-unit",  // ✅ CLARIFICATION: Any unit can activate any team Djinn
  effect: "Unleash Djinn for powerful attack/heal/buff",
  consequence: "Djinn enters Standby state (lose passive bonus)",
  recovery: "After 2 full turns, Djinn returns to Set state, passive restored"
};
```

**Djinn Activation Rules - DETAILED CLARIFICATIONS:**

```typescript
const DJINN_ACTIVATION_RULES = {
  // WHO CAN ACTIVATE
  whoCanActivate: {
    rule: "ANY unit in active party can activate ANY team Djinn",
    examples: [
      "Isaac can activate Mars Djinn (Forge) even though it's Mars element",
      "Mia can activate Venus Djinn (Flint) to unleash earth attack",
      "Garet can activate Mercury Djinn (Fizz) to heal the party"
    ],
    reasoning: "Team slots (not per-unit slots) mean all Djinn are shared resources"
  },

  // HOW MANY PER TURN
  activationsPerTurn: {
    perUnit: 1,  // Each unit can activate only 1 Djinn per turn
    total: 4,    // Maximum 4 Djinn activations per turn (if all 4 units activate)

    examples: [
      "Turn 1: Isaac activates Flint, Garet activates Forge, Ivan passes, Mia passes = 2 total",
      "Turn 2: All 4 units activate 1 Djinn each = 4 total",
      "Turn 3: Isaac tries to activate 2 Djinn in same turn = NOT ALLOWED"
    ]
  },

  // DAMAGE THRESHOLD
  damageThreshold: {
    requirement: 30,  // 30+ cumulative damage dealt or taken
    tracking: "per-unit",  // Each unit tracks separately
    resetOnBattle: true,  // Counter resets when battle ends

    calculation: {
      damageDealt: "Sum of all damage this unit dealt to enemies",
      damageTaken: "Sum of all damage this unit received from enemies",
      total: "damageDealt + damageTaken >= 30"
    },

    examples: [
      "Isaac deals 20 damage with Slash, then takes 15 damage → 20 + 15 = 35 ✅ Can activate",
      "Garet deals 40 damage with Fireball → 40 ✅ Can activate",
      "Mia heals party (no damage dealt/taken) → 0 ❌ Cannot activate yet",
      "Ivan takes 30 damage from enemy → 30 ✅ Can activate"
    ]
  },

  // STATE MACHINE
  stateTransitions: {
    Set: {
      description: "Default state, passive bonuses active",
      canActivate: true,
      canSummon: false,
      providesPassive: true,
      nextState: "Standby (when activated)"
    },

    Standby: {
      description: "Activated state, waiting for summon or recovery",
      canActivate: false,  // Already activated
      canSummon: true,     // Can be used for summons
      providesPassive: false,  // No passive bonuses
      nextState: "Recovery (if used for summon) OR Set (after 2 full turns if not summoned)"
    },

    Recovery: {
      description: "Post-summon state, cannot be used",
      canActivate: false,
      canSummon: false,
      providesPassive: false,
      nextState: "Set (after 3 full turns)",
      duration: 3  // 3 turns until return to Set
    }
  },

  // RECOVERY TIMING
  recoveryTiming: {
    standbyToSet: {
      duration: 2,  // 2 full turns
      startTurn: "immediately",  // Counter starts at end of activation turn

      example: {
        turn1: "Isaac activates Flint (Set → Standby). Counter starts.",
        turn2: "Flint in Standby (1 turn passed). Can be used for summon.",
        turn3: "Flint in Standby (2 turns passed). Can still be used for summon.",
        turn4: "Flint returns to Set (passive restored). ✅"
      }
    },

    recoveryToSet: {
      duration: 3,  // 3 full turns (from summon usage)
      startTurn: "immediately",  // Counter starts at end of summon turn

      example: {
        turn1: "Party uses Flint/Granite/Bane for Titan summon. All 3 → Recovery.",
        turn2: "All 3 Djinn in Recovery (1 turn passed).",
        turn3: "All 3 Djinn in Recovery (2 turns passed).",
        turn4: "All 3 Djinn in Recovery (3 turns passed).",
        turn5: "All 3 Djinn return to Set (passives restored). ✅"
      }
    },

    turnDefinition: "A full turn = all 4 party members + all enemies have acted"
  },

  // MULTIPLE DJINN MANAGEMENT
  multipleActivations: {
    sameUnit: {
      perTurn: 1,
      reason: "Prevents single unit from dominating Djinn usage"
    },

    differentUnits: {
      perTurn: 4,
      reason: "Each unit can activate 1 Djinn, so max = 4 total"
    },

    standbyAccumulation: {
      allowed: true,
      reason: "Can accumulate multiple Standby Djinn for summons",

      example: {
        turn1: "Isaac activates Flint (1 in Standby)",
        turn2: "Garet activates Granite (2 in Standby)",
        turn3: "Ivan activates Bane (3 in Standby)",
        turn4: "Party can now summon Titan (3 Venus Djinn in Standby)"
      }
    }
  }
};
```

**Djinn Lifecycle - Complete Flow:**
```typescript
const DJINN_LIFECYCLE = {
  // PATH 1: Activation → Natural Recovery (no summon)
  path1: [
    "Set (passive active)",
    "→ Unit activates Djinn (damage/heal/buff effect)",
    "→ Standby (passive lost, can be used for summon)",
    "→ Wait 2 full turns",
    "→ Set (passive restored)"
  ],

  // PATH 2: Activation → Used in Summon
  path2: [
    "Set (passive active)",
    "→ Unit activates Djinn",
    "→ Standby (passive lost)",
    "→ Used for summon (massive damage/effect)",
    "→ Recovery (cannot be used, passive lost)",
    "→ Wait 3 full turns",
    "→ Set (passive restored)"
  ],

  // TOTAL COST COMPARISON
  costComparison: {
    activateOnly: {
      passiveLossDuration: 2,
      benefit: "Immediate damage/heal/buff (80-180 power)",
      turnCost: "2 turns without 1 Djinn passive"
    },

    activateThenSummon: {
      passiveLossDuration: 5,  // 2 turns Standby + 3 turns Recovery
      benefit: "Ultimate summon (250-460+ damage)",
      turnCost: "5 turns without 1 Djinn passive (×3 if using 3 Djinn)",
      strategicNote: "15 total passive-less turns for 3 Djinn used in summon"
    }
  }
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

### 2.4 Djinn Summon System

**Summon Requirements:**
```typescript
const SUMMON_REQUIREMENTS = {
  djinnNeeded: 3,
  djinnState: "Standby",  // All 3 Djinn must be in Standby (not Set, not Recovery)
  whoCanSummon: "any-unit",  // Any unit in active party can perform summon
  consumesDjinn: true,  // All 3 Djinn enter Recovery state after summon
  recoveryTurns: 3  // Djinn return to Set state after 3 turns
};
```

**Summon Types by Element Combination:**

#### Single-Element Summons (3 Same Djinn)

**Titan (3 Venus Djinn):**
```typescript
const TITAN_SUMMON = {
  name: "Titan",
  element: "Venus",
  requirement: "3 Venus Djinn in Standby",
  type: "damage",
  targets: "all-enemies",
  baseDamage: 250,
  damageFormula: (userMAG, tierSum) => {
    // tierSum = sum of Djinn tiers (e.g., Tier1 + Tier2 + Tier3 = 6)
    const scaledDamage = baseDamage + (tierSum * 20);
    return Math.floor(scaledDamage * (1 + userMAG / 100));
  },

  // Example: MAG = 20, Djinn tiers = 1 + 2 + 3 = 6
  // scaledDamage = 250 + (6 * 20) = 250 + 120 = 370
  // finalDamage = 370 * (1 + 20/100) = 370 * 1.2 = 444

  animation: "Giant earth golem rises and crushes all enemies",
  description: "Titan, the Earth Colossus, crushes foes with devastating seismic power"
};
```

**Phoenix (3 Mars Djinn):**
```typescript
const PHOENIX_SUMMON = {
  name: "Phoenix",
  element: "Mars",
  requirement: "3 Mars Djinn in Standby",
  type: "damage",
  targets: "all-enemies",
  baseDamage: 280,  // Highest single-element damage
  damageFormula: (userMAG, tierSum) => {
    const scaledDamage = baseDamage + (tierSum * 20);
    return Math.floor(scaledDamage * (1 + userMAG / 100));
  },

  // Example: MAG = 22, Djinn tiers = 1 + 1 + 2 = 4
  // scaledDamage = 280 + (4 * 20) = 280 + 80 = 360
  // finalDamage = 360 * (1 + 22/100) = 360 * 1.22 = 439

  animation: "Flaming phoenix dive-bombs battlefield, exploding in inferno",
  description: "Phoenix, the Flame Emperor, incinerates enemies in a blazing inferno"
};
```

**Kraken (3 Mercury Djinn):**
```typescript
const KRAKEN_SUMMON = {
  name: "Kraken",
  element: "Mercury",
  requirement: "3 Mercury Djinn in Standby",
  type: "damage-and-heal",
  targets: "all-enemies",
  baseDamage: 220,  // Lower damage but includes heal
  healAmount: 80,  // Heals all allies for fixed amount
  damageFormula: (userMAG, tierSum) => {
    const scaledDamage = baseDamage + (tierSum * 20);
    return Math.floor(scaledDamage * (1 + userMAG / 100));
  },
  healFormula: (userMAG, tierSum) => {
    return Math.floor(healAmount + (tierSum * 10) + (userMAG / 2));
  },

  // Example: MAG = 18, Djinn tiers = 2 + 2 + 3 = 7
  // Damage: 220 + (7 * 20) = 220 + 140 = 360 * 1.18 = 424
  // Heal: 80 + (7 * 10) + (18 / 2) = 80 + 70 + 9 = 159

  animation: "Tidal wave crashes down, then heals party with rejuvenating mist",
  description: "Kraken, the Tidal Beast, drowns enemies and heals allies"
};
```

**Thunderbird (3 Jupiter Djinn):**
```typescript
const THUNDERBIRD_SUMMON = {
  name: "Thunderbird",
  element: "Jupiter",
  requirement: "3 Jupiter Djinn in Standby",
  type: "damage",
  targets: "all-enemies",
  baseDamage: 260,
  damageFormula: (userMAG, tierSum) => {
    const scaledDamage = baseDamage + (tierSum * 20);
    return Math.floor(scaledDamage * (1 + userMAG / 100));
  },
  chainLightning: true,  // Special: 25% chance for double damage on low-HP enemies

  // Example: MAG = 26, Djinn tiers = 1 + 2 + 2 = 5
  // scaledDamage = 260 + (5 * 20) = 260 + 100 = 360
  // finalDamage = 360 * (1 + 26/100) = 360 * 1.26 = 453

  animation: "Lightning storm strikes all enemies from above",
  description: "Thunderbird, the Storm Sovereign, electrocutes enemies with heavenly lightning"
};
```

#### Mixed-Element Summons (Hybrid Combinations)

**Rampage (2 Venus + 1 Mars):**
```typescript
const RAMPAGE_SUMMON = {
  name: "Rampage",
  elements: ["Venus", "Mars"],
  requirement: "2 Venus + 1 Mars Djinn in Standby",
  type: "damage",
  targets: "all-enemies",
  baseDamage: 180,
  damageFormula: (userMAG, tierSum) => {
    const scaledDamage = baseDamage + (tierSum * 15);
    return Math.floor(scaledDamage * (1 + userMAG / 100));
  },
  description: "Berserker golem tramples enemies with earth and fire fury"
};
```

**Typhoon (2 Jupiter + 1 Mercury):**
```typescript
const TYPHOON_SUMMON = {
  name: "Typhoon",
  elements: ["Jupiter", "Mercury"],
  requirement: "2 Jupiter + 1 Mercury Djinn in Standby",
  type: "damage",
  targets: "all-enemies",
  baseDamage: 190,
  damageFormula: (userMAG, tierSum) => {
    const scaledDamage = baseDamage + (tierSum * 15);
    return Math.floor(scaledDamage * (1 + userMAG / 100));
  },
  description: "Hurricane of water and wind devastates battlefield"
};
```

**Judgment (1 of Each Element):**
```typescript
const JUDGMENT_SUMMON = {
  name: "Judgment",
  elements: ["Venus", "Mars", "Mercury", "Jupiter"],
  requirement: "1 Venus + 1 Mars + 1 Mercury Djinn in Standby (or any 1-1-1 combo)",
  type: "damage",
  targets: "all-enemies",
  baseDamage: 200,
  damageFormula: (userMAG, tierSum) => {
    const scaledDamage = baseDamage + (tierSum * 18);
    return Math.floor(scaledDamage * (1 + userMAG / 100));
  },
  specialEffect: "Ignores 20% of enemy DEF",
  description: "Elemental harmony unleashes balanced destruction"
};
```

**Summon Damage Scaling Summary:**
```typescript
const SUMMON_BALANCE = {
  singleElement: {
    baseDamage: "220-280",
    scaling: "20 per tier",
    special: "Phoenix (Mars) = highest damage, Kraken (Mercury) = damage + heal"
  },
  hybridElement: {
    baseDamage: "180-200",
    scaling: "15-18 per tier",
    special: "Judgment ignores 20% DEF"
  },
  tierScaling: {
    tier1Djinn: 1,  // +20 damage for single-element
    tier2Djinn: 2,  // +40 damage
    tier3Djinn: 3   // +60 damage
  }
};

// Best case single-element: 3 Tier-3 Djinn (tier sum = 9)
// Phoenix: 280 + (9 * 20) = 280 + 180 = 460 base (before MAG scaling)

// Worst case single-element: 3 Tier-1 Djinn (tier sum = 3)
// Titan: 250 + (3 * 20) = 250 + 60 = 310 base
```

**Post-Summon Mechanics:**
```typescript
const POST_SUMMON_RECOVERY = {
  djinnState: "Recovery",  // All 3 Djinn enter Recovery state
  recoveryDuration: 3,  // 3 turns until return to Set state
  passiveLoss: true,  // Party loses passive bonuses during recovery

  recoveryMechanic: {
    turn1: "Djinn in Recovery (no passive, cannot use)",
    turn2: "Djinn in Recovery (no passive, cannot use)",
    turn3: "Djinn in Recovery (no passive, cannot use)",
    turn4: "Djinn return to Set state, passives restored"
  },

  strategicCost: "Lose 3-Djinn passive for 3 turns (e.g., -12 ATK, -8 DEF if Venus Adept)"
};
```

**Summon Strategic Use Cases:**
```typescript
const SUMMON_STRATEGY = {
  bossKiller: {
    summon: "Phoenix (3 Mars)",
    reason: "Highest raw damage (280 base + 20 per tier)",
    bestAgainst: "Single strong enemy (boss fights)",
    example: "460 base damage with 3 Tier-3 Djinn + 30% from high MAG = ~600 damage"
  },

  sustainedFight: {
    summon: "Kraken (3 Mercury)",
    reason: "Damage + party heal (159 HP example)",
    bestAgainst: "Multi-wave battles or when party is damaged",
    example: "424 damage + 159 HP heal to all allies"
  },

  speedClear: {
    summon: "Thunderbird (3 Jupiter)",
    reason: "Fast damage with chain lightning bonus",
    bestAgainst: "Multiple weak enemies",
    example: "453 damage + 25% chance to double-hit low-HP foes"
  },

  balanced: {
    summon: "Judgment (1 of each)",
    reason: "Ignores 20% DEF, works with any Djinn mix",
    bestAgainst: "Highly defensive enemies",
    example: "Effective damage increased by DEF penetration"
  }
};
```

**Summon UI Flow:**
```typescript
const SUMMON_MENU = {
  requirement: "At least 3 Djinn in Standby state",
  menuAccess: "Battle menu → Djinn → Summon",
  availableSummons: "Shows only summons with 3+ Djinn in Standby",

  confirmationPrompt: {
    message: "Summon [NAME]? This will put 3 Djinn in Recovery for 3 turns.",
    options: ["Confirm", "Cancel"],
    warning: "Shows passive loss (e.g., 'You will lose Venus Adept bonuses for 3 turns')"
  },

  animationSequence: {
    duration: "2-3 seconds",
    skipable: true,
    phases: [
      "Djinn rise from characters (0.5s)",
      "Summon creature appears (1s)",
      "Attack animation (1s)",
      "Damage numbers (0.5s)"
    ]
  }
};
```

**Summon Balance Design Notes:**
- **Risk vs Reward:** Summons deal massive damage but cost 3-turn passive loss
- **Tier Scaling:** Encourages collecting high-tier Djinn for stronger summons
- **Element Variety:** Single-element summons strongest, but hybrids allow flexibility
- **Kraken Niche:** Only summon that heals, ideal for Mercury healers like Mia/Piers
- **Phoenix Peak DPS:** Mars element has highest damage ceiling (280 base)
- **Judgment Utility:** Best for tanky enemies due to DEF penetration

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
    cost: 500
  },
  legendary: {
    name: "Sol Blade",
    atk: +30,
    unlocksAbility: "Megiddo",  // 150 damage, costs 25 PP
    cost: 10000
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
// Iron Armor: HP +20, DEF +10
// 3 Venus Djinn: ATK +12, DEF +8
// FINAL: HP 200, ATK 51, DEF 36, MAG 20, SPD 16
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

### 5.2.5 AOE Damage Rule

**🚨 CRITICAL: How multi-target abilities deal damage**

```typescript
const AOE_DAMAGE_RULE = {
  mode: "FULL_TO_EACH",  // Each enemy takes full calculated damage

  // Example: Quake deals 47 damage
  // vs 3 enemies → 47 to EACH (141 total)
  // NOT: 47 divided by 3 = 15 each ❌
  // NOT: 47 with penalty = 35 each ❌

  reasoning: "Higher PP cost balances full damage to each target"
};
```

**Why Full Damage:**
- AOE abilities cost more PP (Quake 5 PP vs basic attack 0 PP)
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
// PP cost: 5 (balanced!)
```

**Balance:**
- Single-target (Clay Spire): 60 base, 10 PP, 1 target = 60 damage/10PP = 6.0 efficiency
- Multi-target (Quake): 30 base, 5 PP, 3 targets = 90 damage/5PP = 18.0 efficiency
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

### 5.2.6 PP/MP Regeneration

**🚨 CRITICAL: How units regain PP**

```typescript
const PP_REGEN = {
  afterBattle: 1.0,        // Full PP restore after battle ends
  innRest: 1.0,            // Full PP restore at inn (costs gold)
  perTurnInBattle: 0.0,    // NO regen during battle
  itemRestoration: true,   // Items can restore PP

  items: {
    "Herb": { ppRestore: 0, hpRestore: 30 },
    "Potion": { ppRestore: 20, hpRestore: 50 },
    "Elixir": { ppRestore: 999, hpRestore: 999 }  // Full restore
  }
};
```

**Why No In-Battle Regen:**
- Encourages strategic PP management
- Makes high-PP-cost abilities risky in long battles
- Forces choice between healing and damage dealing
- Standard JRPG balance (Golden Sun model)

**Inn Rest:**
```typescript
function innRest(units: Unit[], cost: number = 10): void {
  if (game.gold < cost) return;  // Can't afford

  units.forEach(unit => {
    unit.currentHp = unit.maxHp;  // Full HP
    unit.currentPp = unit.maxPp;  // Full PP
    unit.statusAilments = [];     // Cure all ailments
  });

  game.gold -= cost;
}
```

**Post-Battle:**
```typescript
function onBattleVictory(units: Unit[]): void {
  units.forEach(unit => {
    unit.currentPp = unit.maxPp;  // ✅ Restore PP
    // HP stays as-is (must heal manually)
  });
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

### 6.5 Damage Calculation Formula

**Physical Damage Formula:**
```typescript
function calculatePhysicalDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability
): number {
  const baseAtk = attacker.stats.atk;
  const baseDef = defender.stats.def;

  // Physical abilities use ATK stat (basePower = 0)
  const rawDamage = Math.max(1, baseAtk - baseDef / 2);

  // Apply elemental advantage (if ability has element)
  const elementalMultiplier = getElementalAdvantage(ability.element, defender.element);

  // Apply equipment bonuses (already included in stats.atk/def)
  const finalDamage = Math.floor(rawDamage * elementalMultiplier);

  return Math.max(1, finalDamage);  // Minimum 1 damage
}
```

**Magical Damage Formula:**
```typescript
function calculateMagicalDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability
): number {
  const userMAG = attacker.stats.mag;
  const enemyDEF = defender.stats.def;
  const basePower = ability.basePower;

  // Magical abilities scale with MAG stat
  const scaledPower = basePower * (1 + userMAG / 100);

  // Defense reduces magical damage (50% effectiveness vs magic)
  const rawDamage = Math.max(1, scaledPower - enemyDEF / 4);

  // Apply elemental advantage
  const elementalMultiplier = getElementalAdvantage(ability.element, defender.element);

  // Apply elemental resistance (from armor/equipment)
  const resistanceReduction = 1 - (defender.elementalResist || 0);

  const finalDamage = Math.floor(rawDamage * elementalMultiplier * resistanceReduction);

  return Math.max(1, finalDamage);  // Minimum 1 damage
}

// Example: Ivan casts Plasma (base 55) with MAG 22 against enemy with DEF 10
// scaledPower = 55 * (1 + 22/100) = 55 * 1.22 = 67.1
// rawDamage = 67.1 - 10/4 = 67.1 - 2.5 = 64.6
// With 1.5x elemental advantage = 64.6 * 1.5 = 96.9 → 96 damage
```

**Elemental Advantage Table:**
```typescript
const ELEMENTAL_ADVANTAGES = {
  // Venus (Earth) > Mars (Fire) > Mercury (Water) > Jupiter (Wind) > Venus
  "Venus vs Mars": 1.5,      // Earth strong vs Fire
  "Mars vs Mercury": 1.5,    // Fire strong vs Water
  "Mercury vs Jupiter": 1.5, // Water strong vs Wind
  "Jupiter vs Venus": 1.5,   // Wind strong vs Earth

  "Mars vs Venus": 0.67,     // Fire weak vs Earth (1 / 1.5)
  "Mercury vs Mars": 0.67,   // Water weak vs Fire
  "Jupiter vs Mercury": 0.67,// Wind weak vs Water
  "Venus vs Jupiter": 0.67,  // Earth weak vs Wind

  "Same element": 1.0,       // Neutral
  "No element": 1.0          // Physical attacks (no element)
};

function getElementalAdvantage(attackElement: string, defenderElement: string): number {
  if (!attackElement) return 1.0;  // Physical attacks
  if (attackElement === defenderElement) return 1.0;

  const advantages = {
    Venus: { Mars: 1.5, Jupiter: 0.67 },
    Mars: { Mercury: 1.5, Venus: 0.67 },
    Mercury: { Jupiter: 1.5, Mars: 0.67 },
    Jupiter: { Venus: 1.5, Mercury: 0.67 }
  };

  return advantages[attackElement]?.[defenderElement] || 1.0;
}
```

### 6.6 Defense and Stat Interaction

**Defense Against Physical Attacks:**
```typescript
const DEFENSE_MECHANICS = {
  physicalReduction: {
    formula: "DEF / 2",
    example: {
      attackerATK: 30,
      defenderDEF: 20,
      rawDamage: "30 - (20 / 2) = 30 - 10 = 20 damage"
    }
  },

  magicalReduction: {
    formula: "DEF / 4",
    reasoning: "DEF is less effective vs magic (50% effectiveness)",
    example: {
      spellPower: 100,
      defenderDEF: 20,
      rawDamage: "100 - (20 / 4) = 100 - 5 = 95 damage"
    }
  }
};
```

### 6.7 Evasion Formula

**Evasion Mechanics:**
```typescript
const EVASION_SYSTEM = {
  baseEvasion: 0.05,  // 5% base dodge chance for all units

  speedScaling: {
    formula: (unitSPD: number, attackerSPD: number) => {
      const speedDiff = unitSPD - attackerSPD;
      const evasionBonus = speedDiff * 0.01;  // 1% per SPD point advantage
      return Math.max(0, evasionBonus);
    },

    example: {
      defenderSPD: 25,
      attackerSPD: 15,
      speedDiff: 10,
      evasionBonus: "10 * 0.01 = 0.10 (10%)"
    }
  },

  equipmentBonus: {
    source: "Boots equipment slot",
    examples: [
      { item: "Iron Boots", evasion: 0 },
      { item: "Hermes' Sandals", evasion: 0 }  // Hermes gives alwaysFirstTurn, not evasion
    ],
    note: "Current equipment doesn't provide evasion bonuses, but slot exists for future items"
  },

  buffBonus: {
    source: "Wind's Favor ability",
    bonus: 0.20,  // +20% evasion (from buffEffect in abilities.ts)
    duration: 3   // 3 turns
  },

  totalEvasion: {
    formula: (unit: Unit, attacker: Unit, buffs: Buff[]) => {
      const base = 0.05;  // 5%
      const speedBonus = Math.max(0, (unit.stats.spd - attacker.stats.spd) * 0.01);
      const equipBonus = unit.equipment.boots?.evasionBonus || 0;
      const buffBonus = buffs.find(b => b.id === "winds-favor")?.effect.evasion || 0;

      return Math.min(0.75, base + speedBonus + equipBonus + buffBonus);  // Cap at 75%
    },

    example: {
      defender: "Ivan (SPD 23)",
      attacker: "Enemy (SPD 10)",
      buffs: ["Wind's Favor (+20% evasion)"],
      calculation: [
        "Base: 5%",
        "Speed: (23 - 10) * 1% = 13%",
        "Equipment: 0%",
        "Buff: 20%",
        "Total: 5% + 13% + 0% + 20% = 38% evasion"
      ]
    }
  },

  evasionCap: 0.75  // 75% maximum evasion chance
};

function attemptEvasion(defender: Unit, attacker: Unit, buffs: Buff[]): boolean {
  const evasionChance = EVASION_SYSTEM.totalEvasion.formula(defender, attacker, buffs);
  return Math.random() < evasionChance;
}
```

**Evasion Priority:**
```typescript
const EVASION_PRIORITY = {
  checkOrder: [
    "1. Roll for evasion (if evaded, skip damage calculation)",
    "2. If not evaded, calculate damage normally",
    "3. Apply damage to defender"
  ],

  notAffectedBy: [
    "Critical hits still need to pass evasion check",
    "AoE abilities check evasion separately for each target",
    "Summons check evasion for each enemy"
  ]
};
```

### 6.8 Elemental Resistance Formula

**Elemental Resistance Mechanics:**
```typescript
const ELEMENTAL_RESISTANCE_SYSTEM = {
  sources: [
    "Armor equipment slot (primary source)",
    "Djinn passive synergy (future enhancement)",
    "Elemental advantage (handled separately)"
  ],

  armorResistance: {
    formula: (elementalDamage: number, resistPercent: number) => {
      const reduction = 1 - resistPercent;
      return Math.floor(elementalDamage * reduction);
    },

    examples: [
      {
        armor: "Dragon Scales",
        resistance: 0.20,  // 20% elemental damage reduction
        incomingDamage: 100,
        finalDamage: "100 * (1 - 0.20) = 100 * 0.80 = 80 damage"
      },
      {
        armor: "Celestial Armor",
        resistance: 0.35,  // 35% elemental damage reduction
        incomingDamage: 150,
        finalDamage: "150 * (1 - 0.35) = 150 * 0.65 = 97 damage"
      }
    ]
  },

  currentEquipment: {
    note: "No equipment in equipment.ts currently has elemental resistance",
    futureItems: [
      { name: "Dragon Scales", slot: "armor", resist: 0.20 },
      { name: "Celestial Armor", slot: "armor", resist: 0.35 },
      { name: "Phoenix Shield", slot: "armor", resist: 0.25, element: "Mars" }
    ]
  },

  resistanceStacking: {
    rule: "Elemental resistance is additive, up to 75% cap",
    example: {
      armorResist: 0.25,
      djinnResist: 0.15,
      totalResist: "Math.min(0.75, 0.25 + 0.15) = 0.40 (40%)"
    }
  },

  interactionWithElementalAdvantage: {
    order: [
      "1. Calculate base damage with elemental advantage/disadvantage",
      "2. Apply elemental resistance reduction",
      "3. Final damage = base * advantage * (1 - resistance)"
    ],

    example: {
      spellPower: 100,
      elementalAdvantage: 1.5,  // Jupiter vs Venus
      resistance: 0.20,         // Dragon Scales
      calculation: [
        "Base with advantage: 100 * 1.5 = 150",
        "Apply resistance: 150 * (1 - 0.20) = 150 * 0.80 = 120 damage"
      ]
    }
  },

  resistanceCap: 0.75  // 75% maximum resistance
};

function applyElementalResistance(
  damage: number,
  defender: Unit,
  ability: Ability
): number {
  if (!ability.element) return damage;  // Physical attacks ignore resistance

  const armorResist = defender.equipment.armor?.elementalResist || 0;
  const djinnResist = 0;  // Future: calculate from Djinn synergy

  const totalResist = Math.min(0.75, armorResist + djinnResist);
  const finalDamage = Math.floor(damage * (1 - totalResist));

  return Math.max(1, finalDamage);  // Minimum 1 damage
}
```

**Complete Damage Pipeline:**
```typescript
function calculateFinalDamage(
  attacker: Unit,
  defender: Unit,
  ability: Ability,
  defenderBuffs: Buff[]
): { damage: number, evaded: boolean, critical: boolean } {
  // Step 1: Check evasion
  const evaded = attemptEvasion(defender, attacker, defenderBuffs);
  if (evaded) {
    return { damage: 0, evaded: true, critical: false };
  }

  // Step 2: Calculate base damage
  const baseDamage = ability.type === 'physical'
    ? calculatePhysicalDamage(attacker, defender, ability)
    : calculateMagicalDamage(attacker, defender, ability);

  // Step 3: Check critical hit
  const isCritical = Math.random() < 0.1;  // 10% crit chance
  const critMultiplier = isCritical ? 1.5 : 1.0;

  // Step 4: Apply elemental resistance
  const resistedDamage = applyElementalResistance(baseDamage, defender, ability);

  // Step 5: Apply critical multiplier
  const finalDamage = Math.floor(resistedDamage * critMultiplier);

  return {
    damage: Math.max(1, finalDamage),
    evaded: false,
    critical: isCritical
  };
}
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
      ppCost: 20,
      targets: "all-allies",
      element: "Neutral"
    },
    {
      name: "Void Strike",
      basePower: 100,
      ppCost: 25,
      targets: "single-ally",
      ignoresDefense: true,  // Bypasses DEF entirely!
      element: "Neutral"
    },
    {
      name: "Dark Heal",
      heals: 150,
      ppCost: 30,
      targets: "self"
    },
    {
      name: "Elemental Chaos",  // Ultimate
      basePower: 150,
      ppCost: 50,
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
    cure: ["Antidote", "Wish", "Inn Rest"],
    tick: "START_OF_TURN"  // Damage before unit acts
  },

  burn: {
    damagePerTurn: (targetMaxHP: number) => Math.floor(targetMaxHP * 0.10),  // 10% max HP
    duration: 3,      // Lasts 3 turns
    cure: ["Herb", "Ply", "Wish", "Inn Rest"],
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
    cure: ["Elixir", "Wish", "Inn Rest"],
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

### 11.3 Flee System with Boss Check

**🚨 FIXED: Boss battles prevent fleeing**

```typescript
function attemptFlee(battle: Battle, rng: SeededRNG): boolean {
  // Boss battles cannot be fled
  if (battle.isBossBattle || battle.isRecruitmentBattle) {
    displayMessage("You can't escape!");
    return false;
  }

  const playerAvgSpd = calculateAverageSpeed(battle.playerParty);
  const enemyAvgSpd = calculateAverageSpeed(battle.enemies);

  const baseFleeChance = 0.5;
  const speedRatio = playerAvgSpd / enemyAvgSpd;
  let fleeChance = baseFleeChance * speedRatio;

  // Clamp between 10% and 90%
  fleeChance = Math.max(0.1, Math.min(0.9, fleeChance));

  const success = rng.float() < fleeChance;

  if (success) {
    displayMessage("Got away safely!");
    return true;
  } else {
    displayMessage("Couldn't escape!");
    return false;  // Wasted turn
  }
}
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
