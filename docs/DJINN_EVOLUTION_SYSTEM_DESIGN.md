# Djinn Evolution System Design
**Date:** 2025-11-13
**Status:** Prototype Design
**Purpose:** Evolve existing 12 Djinn instead of collecting 24 separate entities

---

## 🎯 **DESIGN PHILOSOPHY**

**Problem:** Adding 12 new Djinn in Chapter 2 creates:
- Content explosion (24 Djinn × 15 abilities = 360 abilities to balance)
- Collection fatigue ("Another earth Djinn?")
- Loss of identity (too many Djinn to track)

**Solution:** Evolve existing 12 Djinn through bond system:
- **Current System:** Collect Flint (T1), Granite (T2), Bane (T3) separately
- **New Narrative:** Collect Flint (T1), then Flint evolves into Granite (T2), then into Bane (T3)

**Benefits:**
- Manageable scope (still 12 Djinn, still 180 abilities)
- Emotional attachment ("My Flint is growing!")
- Clear progression (4 Djinn × 3 evolutions each)
- Build variety (choose which Djinn to evolve first)

---

## 🔄 **NARRATIVE REFRAME**

### **Before (Collection Model):**
> "You found **Flint**, a Venus Djinn!"
> *20 battles later...*
> "You found **Granite**, a Venus Djinn!"
> *Player thinks: "Didn't I already have an earth Djinn?"*

### **After (Evolution Model):**
> "You found **Flint**, a Venus Djinn!"
> *20 battles later, bond reaches 100...*
> "**Flint** is glowing! Its bond with you has deepened!"
> "**Flint** evolved into **Granite**!"
> *Player thinks: "My Flint grew stronger! This is my Djinn!"*

**Key Difference:** Same 12 Djinn, different narrative framing

---

## 📐 **TYPESCRIPT TYPES**

### **Bond System Schema**

```typescript
import { z } from 'zod';

/**
 * Djinn bond tracks usage and enables evolution
 */
export const DjinnBondSchema = z.object({
  /** Djinn ID being tracked */
  djinnId: z.string(),

  /** Current bond level (0-300, increments by 1 per use) */
  bondLevel: z.number().min(0).max(300),

  /** Times used in battle (for UI display) */
  timesUsed: z.number().min(0),

  /** Times summoned (for UI display) */
  timesSummoned: z.number().min(0),

  /** Current tier (1, 2, or 3) */
  currentTier: z.enum(['1', '2', '3']),

  /** Can evolve to next tier (checks bond + story flag) */
  canEvolve: z.boolean(),
});
export type DjinnBond = z.infer<typeof DjinnBondSchema>;

/**
 * Djinn evolution definition
 */
export const DjinnEvolutionSchema = z.object({
  /** Evolution ID (e.g., "flint-to-granite") */
  id: z.string(),

  /** Source Djinn ID (e.g., "flint") */
  sourceDjinnId: z.string(),

  /** Target Djinn ID after evolution (e.g., "granite") */
  targetDjinnId: z.string(),

  /** Source tier */
  sourceTier: z.enum(['1', '2', '3']),

  /** Target tier */
  targetTier: z.enum(['2', '3', '4']),

  /** Bond level required to evolve */
  bondRequired: z.number().min(0).max(300),

  /** Story flag required (e.g., "defeated_chapter_2_boss") */
  storyFlag: z.string(),

  /** Optional: Player chooses when to evolve (not automatic) */
  requiresPlayerChoice: z.boolean().default(true),

  /** Narrative description of evolution */
  description: z.string(),
});
export type DjinnEvolution = z.infer<typeof DjinnEvolutionSchema>;
```

### **Extended Djinn Model**

```typescript
/**
 * Extended Djinn interface to support evolution
 */
export interface Djinn {
  // ... existing fields (id, name, element, tier, summonEffect, grantedAbilities) ...

  /** Evolution path (which Djinn this evolves into) */
  evolvesInto?: string; // Target Djinn ID (e.g., "granite")

  /** Evolution requirements */
  evolutionRequirements?: {
    bondLevel: number;
    storyFlag: string;
  };

  /** Previous form (which Djinn this evolved from) */
  evolvedFrom?: string; // Source Djinn ID (e.g., "flint")

  /** Lore text for evolution */
  evolutionLore?: string;
}
```

---

## 🔧 **BOND & EVOLUTION MECHANICS**

### **Bond Accumulation**

**How Bond Increases:**
- **Use Djinn Ability:** +1 bond per use
- **Summon Djinn:** +5 bond per summon
- **Win Battle with Djinn Set:** +2 bond per battle

**Example:**
```
Battle 1:
- Use Flint's "Stone Fist" ability 3 times → +3 bond
- Summon Flint once → +5 bond
- Win battle → +2 bond
Total: +10 bond (now 10/100)

Battle 2:
- Use "Granite Guard" 2 times → +2 bond
- Summon Flint once → +5 bond
- Win battle → +2 bond
Total: +9 bond (now 19/100)

After ~10 battles: Bond reaches 100 → ready to evolve!
```

### **Evolution Requirements**

**Three-Gate System (Same as Promotions):**

1. **Bond Gate** - Ensures Djinn was actually used
   - T1 → T2: 100 bond (≈10-15 battles)
   - T2 → T3: 150 bond (≈15-20 battles)

2. **Story Gate** - Ties to narrative progression
   - T1 → T2: Defeat Chapter 2 boss
   - T2 → T3: Defeat Chapter 3 boss

3. **Player Choice Gate** - Evolution is NOT automatic
   - Player must visit menu and choose to evolve
   - Allows strategic timing (evolve now or wait?)

### **Why Player Choice Matters**

**Scenario:** Flint reaches 100 bond halfway through Chapter 2

**Option A: Evolve Now**
- Get Granite's abilities immediately
- Higher summon power (T2 > T1)
- Restart bond at 0 (progress toward T3)

**Option B: Wait**
- Keep using Flint to build more bond
- Evolve later when you need the power spike
- Strategic timing for hard boss fights

**Design Goal:** Evolution feels like a **meaningful decision**, not just "click yes"

---

## 🌟 **PROTOTYPE: FLINT → GRANITE EVOLUTION (T1 → T2)**

### **Evolution Definition**

```typescript
export const FLINT_TO_GRANITE: DjinnEvolution = {
  id: 'flint-to-granite',
  sourceDjinnId: 'flint',
  targetDjinnId: 'granite',
  sourceTier: '1',
  targetTier: '2',

  bondRequired: 100,
  storyFlag: 'defeated_shadow_fortress_boss', // Chapter 2 boss

  requiresPlayerChoice: true,

  description: `Flint's bond with you has deepened through countless battles.
  The earth spirit yearns to grow stronger, resonating with the ancient power
  of the Terra Mountain. Will you allow Flint to evolve into Granite?`,
};
```

### **Updated Djinn Data**

```typescript
// Flint (T1) - Updated with evolution data
export const FLINT: Djinn = {
  id: 'flint',
  name: 'Flint',
  element: 'Venus',
  tier: '1',

  // ... existing summonEffect, grantedAbilities ...

  // NEW: Evolution data
  evolvesInto: 'granite',
  evolutionRequirements: {
    bondLevel: 100,
    storyFlag: 'defeated_shadow_fortress_boss',
  },
  evolutionLore: `When Flint's bond reaches its peak, the spirit transforms into
  Granite, gaining the strength of mountains and the resilience of stone.`,
};

// Granite (T2) - Updated with evolution lineage
export const GRANITE: Djinn = {
  id: 'granite',
  name: 'Granite',
  element: 'Venus',
  tier: '2',

  // ... existing summonEffect, grantedAbilities ...

  // NEW: Evolution lineage
  evolvedFrom: 'flint',
  evolvesInto: 'bane',
  evolutionRequirements: {
    bondLevel: 150,
    storyFlag: 'defeated_chapter_3_boss',
  },
  evolutionLore: `Granite's power continues to grow, aspiring to become Bane,
  the ultimate earth spirit capable of shattering mountains.`,
};

// Bane (T3) - Final form
export const BANE: Djinn = {
  id: 'bane',
  name: 'Bane',
  element: 'Venus',
  tier: '3',

  // ... existing summonEffect, grantedAbilities ...

  // NEW: Evolution lineage
  evolvedFrom: 'granite',
  evolutionLore: `Bane is the ultimate manifestation of earth power, a legendary
  Djinn whose earthquakes can reshape the world itself.`,
};
```

### **Ability Unlocking on Evolution**

**Current System:** Each Djinn grants 12-15 abilities (already defined)

**Evolution Impact:**
```
Before Evolution (Flint T1):
- Unlocks: 8 abilities for Venus units (same element)
- Summon Power: 80 damage

After Evolution (Granite T2):
- Unlocks: 8 NEW abilities for Venus units (different abilities!)
- Summon Power: Terra Wall (party defense buff)
- Keeps: Flint's abilities are REPLACED by Granite's

Example:
- Flint grants "Stone Fist" → After evolve, replaced by "Terra Break"
- Unit's available abilities change when Djinn evolves
```

**Design Note:** Evolution changes granted abilities (new tactical options)

---

## 🔥 **PROTOTYPE: FORGE → CORONA EVOLUTION (T1 → T2)**

### **Evolution Definition**

```typescript
export const FORGE_TO_CORONA: DjinnEvolution = {
  id: 'forge-to-corona',
  sourceDjinnId: 'forge',
  targetDjinnId: 'corona',
  sourceTier: '1',
  targetTier: '2',

  bondRequired: 100,
  storyFlag: 'defeated_shadow_fortress_boss',

  requiresPlayerChoice: true,

  description: `Forge burns brighter with each battle, its flames yearning to reach
  the intensity of the sun itself. The Djinn is ready to ascend into Corona,
  a blazing star of fire magic. Do you allow this transformation?`,
};
```

### **Evolution Visual**

**In-Game Flow:**
1. Player visits Djinn menu
2. Sees notification: "⚠️ Forge can evolve! (Bond: 100/100)"
3. Selects Forge → Shows evolution preview:
   ```
   FORGE (T1)                    CORONA (T2)
   ────────────────────────────────────────
   Summon: 120 Fire Damage    →  Summon: Party +8 MAG buff
   Grants: 15 fire abilities  →  Grants: 15 STRONGER fire abilities

   Evolution is PERMANENT. Continue?
   [Yes] [No]
   ```
4. Player confirms → Evolution cutscene plays
5. Forge → Corona transformation
6. Toast: "Forge evolved into Corona!"
7. Bond resets to 0/150 (ready for next evolution)

---

## 🎮 **EVOLUTION PROGRESSION ROADMAP**

### **4 Djinn Families × 3 Tiers Each**

| Family | T1 (Ch1) | T2 (Ch2) | T3 (Ch3) | Bond T1→T2 | Bond T2→T3 |
|--------|----------|----------|----------|------------|------------|
| **Venus** | Flint | Granite | Bane | 100 | 150 |
| **Mars** | Forge | Corona | Fury | 100 | 150 |
| **Mercury** | Fizz | Tonic | Crystal | 100 | 150 |
| **Jupiter** | Breeze | Squall | Storm | 100 | 150 |

### **Chapter-by-Chapter Progression**

**Chapter 1:**
- Collect 4 Djinn (Flint, Forge, Fizz, Breeze) in T1 form
- Build bond through battles (0 → 100)
- By end of Chapter 1: Most players have 50-80 bond

**Chapter 2:**
- Defeat Shadow Fortress Boss → evolution unlocked
- Players can evolve T1 → T2 (Flint → Granite, etc.)
- Collect 4 more Djinn (second set of T1 Djinn OR same Djinn for other party members)
- Build bond for T2 → T3 evolution (0 → 150)

**Chapter 3:**
- Defeat Final Boss → T3 evolution unlocked
- Players evolve T2 → T3 (Granite → Bane, etc.)
- All 12 Djinn at max tier (T3)

---

## 🔄 **INTEGRATION WITH EXISTING SYSTEMS**

### **Team Djinn Management**

**Current:** Team can have up to 3 Djinn equipped per unit

**Evolution Impact:**
```typescript
// Before evolution
team.djinn = ['flint', 'forge', 'fizz'];

// After evolving Flint → Granite
team.djinn = ['granite', 'forge', 'fizz'];
// Flint's slot is replaced by Granite
// Granite is still "the same Djinn" narratively
```

### **Ability Unlocking**

**Current:** Djinn grant abilities based on element compatibility

**Evolution Impact:**
```
Unit: Adept (Venus)
Equipped Djinn: Flint (T1)
Unlocked Abilities:
- Stone Fist (Flint-granted)
- Granite Guard (Flint-granted)
- ... (8 total Flint abilities)

After Evolution (Flint → Granite):
Equipped Djinn: Granite (T2)
Unlocked Abilities:
- Earth Wall (Granite-granted) ← REPLACES Stone Fist
- Terra Break (Granite-granted) ← REPLACES Granite Guard
- ... (8 total Granite abilities)

Impact: Tactical variety (different abilities per tier)
```

### **Save/Load Support**

```typescript
// Save file tracks bond + current Djinn ID
{
  djinnId: 'granite',           // Current form (evolved from Flint)
  bondLevel: 75,                // Progress toward next evolution (Bane)
  timesUsed: 42,
  timesSummoned: 8,
  currentTier: '2',
  evolvedFrom: 'flint',         // Lineage tracking
  canEvolve: false,             // Not enough bond yet (needs 150)
}
```

---

## 📊 **BOND PROGRESSION SIMULATION**

### **Average Player Scenario**

**Assumptions:**
- 20 battles in Chapter 1
- Player uses each Djinn ~2-3 times per battle
- Player summons Djinn ~1 time every 3 battles

**Bond Accumulation:**
```
Chapter 1 (20 battles):
- Use Djinn abilities: 2.5 uses/battle × 20 = 50 bond
- Summon Djinn: 6 summons × 5 bond = 30 bond
- Win battles: 20 × 2 bond = 40 bond
Total: 120 bond → Ready to evolve!

Chapter 2 (15 battles):
- Similar usage → ~90 bond (60/150 toward T3)

Chapter 3 (12 battles):
- Similar usage → ~70 bond (130/150 toward T3)
- Final battles (3 bosses): +30 bond → 160/150 → Ready for T3!
```

**Result:** Natural progression without grinding

---

## 🎯 **PLAYER EXPERIENCE GOALS**

### **Emotional Attachment**
❌ **Bad (Collection):** "I have 12 random Djinn"
✅ **Good (Evolution):** "Flint has been with me since Chapter 1, and now it's Bane!"

### **Progression Clarity**
❌ **Bad:** "Wait, is Granite different from Flint?"
✅ **Good:** "Flint evolved into Granite! It's stronger now!"

### **Strategic Depth**
❌ **Bad:** "Evolution is automatic, no choice"
✅ **Good:** "Should I evolve now or save it for the boss fight?"

### **Scope Management**
❌ **Bad:** "24 Djinn = 360 abilities to balance"
✅ **Good:** "12 Djinn = 180 abilities, same as Chapter 1"

---

## ✅ **DESIGN VALIDATION CHECKLIST**

- ✅ **Solves content explosion** (12 Djinn with evolution vs 24 separate Djinn)
- ✅ **Emotional attachment** (Djinn grow with you, not replaced)
- ✅ **Manageable scope** (Still 180 abilities total)
- ✅ **Strategic choice** (Player decides when to evolve)
- ✅ **Natural progression** (Bond accumulates without grinding)
- ✅ **Story integration** (Evolution tied to chapter bosses)
- ✅ **Compatible with existing systems** (Team management, save/load)

---

## 🎯 **NEXT STEPS**

1. ✅ Design reviewed and approved
2. Extend `DjinnSchema` with evolution fields
3. Add `DjinnBondSchema` to save data
4. Create `djinnEvolutions.ts` in `data/definitions/`
5. Implement bond tracking in `TeamService`
6. Add evolution UI to Djinn menu
7. Update Djinn data files with evolution metadata

**Status:** Ready for implementation pending approval
