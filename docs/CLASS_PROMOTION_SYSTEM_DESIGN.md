# Class Promotion System Design
**Date:** 2025-11-13
**Status:** Prototype Design
**Purpose:** Enable unit evolution instead of roster bloat

---

## 🎯 **DESIGN PHILOSOPHY**

**Problem:** Adding 4 new units in Chapter 2 creates:
- Role overlap (3 Venus tanks, 2 healers)
- Choice paralysis (10 units, only 4 battle slots)
- Balance nightmare (10 × 168 abilities = massive tuning)

**Solution:** Promote existing 6 units through 3 tiers:
- **Tier 1 (Lv 1-10):** Base classes (current)
- **Tier 2 (Lv 10-15):** Advanced classes (Chapter 2)
- **Tier 3 (Lv 15-20):** Master classes (Chapter 3)

**Benefits:**
- Depth over breadth (18 forms from 6 units)
- Clear progression (Tier 1 → 2 → 3)
- No role overlap (promotions specialize roles)
- Narrative payoff ("Your team grows stronger")

---

## 📐 **TYPESCRIPT TYPES**

### **Core Promotion Schema**

```typescript
import { z } from 'zod';

/**
 * Promotion tier defines class progression stages
 */
export const PromotionTierSchema = z.enum(['1', '2', '3']);
export type PromotionTier = z.infer<typeof PromotionTierSchema>;

/**
 * Promotion requirements define what's needed to promote
 */
export const PromotionRequirementSchema = z.object({
  /** Minimum level required */
  level: z.number().min(1).max(20),

  /** Story flag that must be set (e.g., "defeated_chapter_2_boss") */
  storyFlag: z.string(),

  /** Optional resource cost (item or gold) */
  cost: z.object({
    type: z.enum(['item', 'gold']),
    itemId: z.string().optional(), // Required if type = 'item'
    amount: z.number().positive(), // Gold amount or item quantity
  }).optional(),
});
export type PromotionRequirement = z.infer<typeof PromotionRequirementSchema>;

/**
 * Class promotion definition
 */
export const ClassPromotionSchema = z.object({
  /** Promotion ID (e.g., "adept-to-paladin") */
  id: z.string(),

  /** Source unit ID (e.g., "adept") */
  sourceUnitId: z.string(),

  /** Source tier being promoted FROM */
  sourceTier: PromotionTierSchema,

  /** Target tier being promoted TO */
  targetTier: PromotionTierSchema,

  /** New class name after promotion */
  targetClassName: z.string(),

  /** New role description */
  targetRole: z.string(),

  /** Requirements to unlock this promotion */
  requirements: PromotionRequirementSchema,

  /** Stat bonus applied on promotion (one-time boost) */
  statBonus: z.object({
    hp: z.number().optional(),
    pp: z.number().optional(),
    atk: z.number().optional(),
    def: z.number().optional(),
    mag: z.number().optional(),
    spd: z.number().optional(),
  }).optional(),

  /** New abilities unlocked on promotion */
  newAbilities: z.array(z.object({
    abilityId: z.string(),
    unlockLevel: z.number().min(1).max(20),
  })),

  /** Description of promotion benefits */
  description: z.string(),
});
export type ClassPromotion = z.infer<typeof ClassPromotionSchema>;
```

### **Unit Schema Extension**

```typescript
/**
 * Extended Unit model to support promotions
 */
export interface Unit {
  // ... existing fields (id, name, level, stats, etc.) ...

  /** Current promotion tier (1 = base, 2 = advanced, 3 = master) */
  tier: PromotionTier;

  /** Current class name (e.g., "Paladin" for promoted Adept) */
  className: string;

  /** Current role (e.g., "Venus Bruiser" for promoted Adept) */
  role: string;

  /** Available promotions for this unit (filtered by requirements) */
  availablePromotions?: ClassPromotion[];
}
```

---

## 🔧 **PROMOTION GATING MECHANICS**

### **Three-Gate System**

Promotions require **ALL THREE** conditions:

1. **Level Gate** - Prevents early power spikes
   - Tier 2: Requires Level 10+
   - Tier 3: Requires Level 15+

2. **Story Gate** - Ties progression to narrative
   - Tier 2: Requires defeating Chapter 2 boss
   - Tier 3: Requires defeating Chapter 3 boss

3. **Resource Gate** - Creates meaningful choice
   - Tier 2: Costs 1000 gold OR rare item (e.g., "Promotion Seal")
   - Tier 3: Costs 5000 gold OR "Master's Crest"

### **Why All Three Gates?**

- **Level Gate:** Ensures proper power curve
- **Story Gate:** Prevents sequence breaking (can't promote in Chapter 1)
- **Resource Gate:** Creates strategic choice (promote now or save resources?)

### **Example: Adept → Paladin Promotion**

```typescript
// Player reaches Level 10 in Chapter 2
if (unit.level >= 10) {
  // Check story flag
  if (storyFlags.includes('defeated_shadow_fortress_boss')) {
    // Check resources
    if (gold >= 1000 || inventory.includes('promotion-seal-venus')) {
      // Show promotion option
      showPromotionDialog('adept-to-paladin');
    }
  }
}
```

---

## 🌟 **PROTOTYPE: ADEPT → PALADIN (TIER 1 → 2)**

### **Design Intent**
- **Adept (T1):** Defensive tank, basic earth abilities
- **Paladin (T2):** Venus bruiser, offensive + defensive hybrid

### **Promotion Definition**

```typescript
export const ADEPT_TO_PALADIN: ClassPromotion = {
  id: 'adept-to-paladin',
  sourceUnitId: 'adept',
  sourceTier: '1',
  targetTier: '2',
  targetClassName: 'Paladin',
  targetRole: 'Venus Bruiser',

  requirements: {
    level: 10,
    storyFlag: 'defeated_shadow_fortress_boss', // Chapter 2 boss
    cost: {
      type: 'gold',
      amount: 1000,
    },
  },

  statBonus: {
    hp: 20,   // One-time boost on promotion
    atk: 5,
    def: 3,
    mag: 2,
  },

  newAbilities: [
    { abilityId: 'holy-strike', unlockLevel: 10 },      // Light/physical hybrid
    { abilityId: 'divine-shield', unlockLevel: 11 },    // Party-wide defense buff
    { abilityId: 'judgment-blade', unlockLevel: 13 },   // High-damage finisher
    { abilityId: 'terra-blessing', unlockLevel: 15 },   // Heal + defense buff
  ],

  description: 'The Paladin combines earth magic with holy power, becoming a frontline bruiser who protects allies while dealing devastating blows.',
};
```

### **Ability Previews**

```typescript
// New abilities unlocked on promotion

export const HOLY_STRIKE: Ability = {
  id: 'holy-strike',
  name: 'Holy Strike',
  type: 'attack',
  target: 'single',
  element: 'Venus',
  ppCost: 8,
  power: 140, // Higher than basic Strike (100)
  effects: [
    {
      type: 'damage',
      value: 140,
      element: 'Venus',
    },
    {
      type: 'buff',
      stat: 'def',
      value: 10,
      duration: 2, // Self-buff after attack
    },
  ],
  description: 'Strike with holy earth power, boosting your defense.',
  unlockLevel: 10,
};

export const DIVINE_SHIELD: Ability = {
  id: 'divine-shield',
  name: 'Divine Shield',
  type: 'buff',
  target: 'party',
  element: 'Venus',
  ppCost: 12,
  power: 0,
  effects: [
    {
      type: 'buff',
      stat: 'def',
      value: 15,
      duration: 3, // Lasts 3 turns
    },
  ],
  description: 'Raise a divine barrier, boosting all allies\' defense.',
  unlockLevel: 11,
};
```

### **Stat Progression After Promotion**

```
Before Promotion (Adept, Lv 10):
- HP: 120 + (25 × 9) = 345
- ATK: 14 + (3 × 9) = 41
- DEF: 16 + (4 × 9) = 52

After Promotion (Paladin, Lv 10):
- HP: 345 + 20 (bonus) = 365
- ATK: 41 + 5 (bonus) = 46
- DEF: 52 + 3 (bonus) = 55

Growth Rates (unchanged):
- HP: +25/level, ATK: +3/level, DEF: +4/level
```

**Impact:** Immediate power boost + new abilities = feels rewarding

---

## 🔥 **PROTOTYPE: WAR MAGE → SORCERER (TIER 1 → 2)**

### **Design Intent**
- **War Mage (T1):** AoE fire mage, glass cannon
- **Sorcerer (T2):** Multi-element mage, tactical nuker

### **Promotion Definition**

```typescript
export const WAR_MAGE_TO_SORCERER: ClassPromotion = {
  id: 'war-mage-to-sorcerer',
  sourceUnitId: 'war-mage',
  sourceTier: '1',
  targetTier: '2',
  targetClassName: 'Sorcerer',
  targetRole: 'Elemental Tactician',

  requirements: {
    level: 10,
    storyFlag: 'defeated_shadow_fortress_boss',
    cost: {
      type: 'item',
      itemId: 'promotion-seal-mars', // Rare drop from Chapter 2 boss
      amount: 1,
    },
  },

  statBonus: {
    pp: 10,   // More mana for spellcasting
    mag: 8,   // Huge magic boost
    spd: 3,
  },

  newAbilities: [
    { abilityId: 'meteor-shower', unlockLevel: 10 },    // AoE fire nuke
    { abilityId: 'ice-lance', unlockLevel: 11 },        // Single-target ice (NEW ELEMENT!)
    { abilityId: 'elemental-shift', unlockLevel: 12 },  // Change element for 3 turns
    { abilityId: 'nova-blast', unlockLevel: 14 },       // Ultimate AoE (all elements)
  ],

  description: 'The Sorcerer masters multiple elements, adapting their magic to exploit enemy weaknesses with devastating precision.',
};
```

### **Key Ability: Elemental Shift**

```typescript
export const ELEMENTAL_SHIFT: Ability = {
  id: 'elemental-shift',
  name: 'Elemental Shift',
  type: 'buff',
  target: 'self',
  element: 'Neutral',
  ppCost: 5,
  power: 0,
  effects: [
    {
      type: 'special',
      description: 'Choose element (Venus/Mars/Mercury/Jupiter). All attacks deal that element for 3 turns.',
      duration: 3,
    },
  ],
  description: 'Attune to a chosen element, adapting your magic to enemy weaknesses.',
  unlockLevel: 12,
};
```

**Tactical Impact:** Sorcerer can now counter enemies by shifting elements mid-battle

---

## 🔄 **PROMOTION FLOW (IN-GAME)**

### **Step-by-Step Experience**

1. **Player reaches Level 10** → Notification appears
   > "Adept has reached Level 10! Class promotion may be available."

2. **Player defeats Chapter 2 boss** → Story flag set
   > "Shadow Fortress has fallen. Your units feel stronger..."

3. **Player visits menu** → Promotion option appears
   > **[New!] Class Promotion Available**
   > - Adept → Paladin (Cost: 1000 gold)
   > - War Mage → Sorcerer (Cost: 1× Promotion Seal - Mars)

4. **Player selects promotion** → Preview screen shows:
   - New class name & role
   - Stat bonuses (+20 HP, +5 ATK, etc.)
   - New abilities unlocked
   - Cost breakdown

5. **Player confirms** → Promotion cutscene plays
   - Visual effect (golden light)
   - Stats update
   - Abilities added to unit
   - Toast: "Adept has become a Paladin!"

---

## 🎮 **INTEGRATION WITH EXISTING SYSTEMS**

### **Unit Growth (Unaffected)**
- Growth rates remain the same after promotion
- Example: Paladin still gains +25 HP/level (same as Adept)
- Promotion bonus is ONE-TIME only

### **Djinn Abilities (Compatible)**
- Promoted units keep their Djinn-granted abilities
- Example: Paladin with Flint equipped still gets Stone Fist
- Djinn compatibility based on **original unit ID** (adept), not tier

### **Equipment (Unaffected)**
- Equipment slots remain the same
- Promoted units can still equip existing gear
- Example: Paladin can still equip "Adept's Sword"

### **Save/Load (Extended)**
```typescript
// Save file stores current tier + class name
{
  unitId: 'adept',
  tier: '2',           // Promoted to Tier 2
  className: 'Paladin',
  role: 'Venus Bruiser',
  level: 12,
  // ... other stats ...
}
```

---

## 📋 **FULL TIER 2 PROMOTION ROADMAP**

### **Chapter 2 Promotions (2 Available)**

| Unit | Tier 1 | Tier 2 | Role Shift | New Focus |
|------|--------|--------|------------|-----------|
| **Adept** | Defensive Tank | **Paladin** | Venus Bruiser | Offense + defense hybrid |
| **War Mage** | Elemental Mage | **Sorcerer** | Elemental Tactician | Multi-element adaptation |

### **Chapter 3 Promotions (All 6 Available)**

| Unit | Tier 2 | Tier 3 | Ultimate Form |
|------|--------|--------|---------------|
| Adept (Paladin) | Venus Bruiser | **Sentinel Lord** | Ultimate tank/support |
| War Mage (Sorcerer) | Elemental Tactician | **Archmagus** | Elemental master |
| Mystic | Mercury Healer | **High Cleric** | Healing + revival specialist |
| Ranger | Jupiter Assassin | **Shadowblade** | Critical strike expert |
| Sentinel | Venus Buffer | **Stone Guardian** | Unbreakable defense |
| Stormcaller | Jupiter Storm Mage | **Tempest Sage** | Chain lightning master |

---

## ✅ **DESIGN VALIDATION CHECKLIST**

- ✅ **Solves roster bloat** (6 units × 3 tiers instead of 10 separate units)
- ✅ **Clear progression** (Tier 1 → 2 at Lv 10+, Tier 2 → 3 at Lv 15+)
- ✅ **Gated properly** (level + story + resource prevents early breaks)
- ✅ **Narrative payoff** ("Your team grows stronger with you")
- ✅ **Role specialization** (promotions differentiate, not duplicate)
- ✅ **Compatible with existing systems** (Djinn, equipment, save/load)
- ✅ **Meaningful choice** (resource cost creates strategic decision)

---

## 🎯 **NEXT STEPS**

1. ✅ Design reviewed and approved
2. Implement TypeScript types in `core/models/`
3. Create promotion data in `data/definitions/promotions.ts`
4. Implement promotion UI in `ui/components/`
5. Add promotion logic to `core/services/ProgressionService.ts`
6. Create 2-3 test promotions for Chapter 2

**Status:** Ready for implementation pending approval
