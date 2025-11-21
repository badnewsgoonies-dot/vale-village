# Djinn Menu - Element Combination System (Revised)

**Date:** 2025-11-21  
**System:** Summons based on element type combinations, not specific Djinn identities

---

## Core Mechanic

**Summons are determined by ELEMENT COMBINATIONS:**
- Each Djinn has an element: Venus, Mars, Mercury, Jupiter
- Summons use element combos, not specific Djinn
- Any Djinn of the right element can fulfill the requirement

**Example Equipped Djinn:**
- Djinn 1: Venus (🌍)
- Djinn 2: Mercury (💧)
- Djinn 3: Mercury (💧)

---

## Combination Logic

### Scenario 1: Venus + Mercury + Mercury (2 same, 1 diff)

**Single Column (Individual):**
- 🌍 Venus summon (uses Djinn 1)
- 💧 Mercury summon (uses Djinn 2 OR 3)
- 💧 Mercury summon (duplicate, same as above)

**Double Column (Pairs):**
- 🌍💧 Venus+Mercury combo (uses Djinn 1 + any Mercury)
- 💧💧 Mercury+Mercury combo (uses Djinn 2 + 3)

**Triple Column:**
- 🌍💧💧 Venus+Mercury×2 combo (uses all 3)

---

### Scenario 2: Venus + Mars + Jupiter (all different)

**Single Column:**
- 🌍 Venus summon
- 🔥 Mars summon
- 💨 Jupiter summon

**Double Column (All permutations):**
- 🌍🔥 Venus+Mars combo
- 🌍💨 Venus+Jupiter combo
- 🔥💨 Mars+Jupiter combo

**Triple Column:**
- 🌍🔥💨 Venus+Mars+Jupiter combo (all 3)

---

### Scenario 3: Mars + Mars + Mars (all same)

**Single Column:**
- 🔥 Mars summon (any of the 3)
- 🔥 Mars summon (duplicate)
- 🔥 Mars summon (duplicate)

**Double Column:**
- 🔥🔥 Mars×2 combo (any 2 of the 3)

**Triple Column:**
- 🔥🔥🔥 Mars×3 combo (all 3)

---

## Visual Layout

### Example: Venus + Mercury + Mercury

```
                                    ┌─────────────────┐
                                    │ DJINN:          │
                                    │ [🌍] [💧] [💧]  │
                                    └─────────────────┘
                                    ┌───────────────────────────────────────────┐
                                    │ SUMMONS (Hover for details)               │
                                    ├────────────┬────────────────┬─────────────┤
                                    │ SINGLE     │ DOUBLE         │ TRIPLE      │
                                    │ (1 Djinn)  │ (2 Djinn)      │ (3 Djinn)   │
                                    ├────────────┼────────────────┼─────────────┤
                                    │            │                │             │
                                    │ 🌍 Venus   │ 🌍💧 V+M      │ 🌍💧💧 All │
                                    │ Quake      │ Geyser         │ Judgment    │
                                    │ Power: 25  │ Power: 55      │ Power: 100  │
                                    │ Uses: 1    │ Uses: V+M      │ Uses: All 3 │
                                    │ [Active]✓  │ [2 Active]✓    │ [3 Active]✓ │
                                    │            │                │             │
                                    │ 💧 Mercury │ 💧💧 M+M      │             │
                                    │ Frost      │ Tidal Wave     │             │
                                    │ Power: 20  │ Power: 50      │             │
                                    │ Uses: 1    │ Uses: 2×M      │             │
                                    │ [Active]✓  │ [2 Active]✓    │             │
                                    │            │                │             │
                                    └────────────┴────────────────┴─────────────┘
```

---

## Column Generation Algorithm

### Single Column (Column 1)

```typescript
function generateSingleSummons(djinn: Djinn[]): SummonOption[] {
  const elementTypes = [...new Set(djinn.map(d => d.element))]; // Unique elements
  
  return elementTypes.map(element => ({
    id: `single-${element}`,
    name: getSingleSummonName(element), // e.g., "Quake" for Venus
    elements: [element],
    power: getSingleSummonPower(element),
    requiredDjinn: 1,
    availableDjinn: djinn.filter(d => d.element === element && d.state === 'active'),
    isAvailable: djinn.some(d => d.element === element && d.state === 'active'),
  }));
}

// Example output for [Venus, Mercury, Mercury]:
// [
//   { name: "Quake", elements: ["Venus"], power: 25, requiredDjinn: 1, availableDjinn: 1 },
//   { name: "Frost", elements: ["Mercury"], power: 20, requiredDjinn: 1, availableDjinn: 2 }
// ]
```

---

### Double Column (Column 2)

```typescript
function generateDoubleSummons(djinn: Djinn[]): SummonOption[] {
  const elementCounts = countElements(djinn);
  const summons: SummonOption[] = [];
  
  // Get all unique element pairs
  const elements = Object.keys(elementCounts);
  
  // Same element pairs (if 2+ of same type)
  elements.forEach(elem => {
    if (elementCounts[elem] >= 2) {
      const activeDjinn = djinn.filter(d => d.element === elem && d.state === 'active');
      summons.push({
        id: `double-${elem}-${elem}`,
        name: getDoubleSummonName(elem, elem), // e.g., "Tidal Wave" for M+M
        elements: [elem, elem],
        power: getDoubleSummonPower(elem, elem),
        requiredDjinn: 2,
        availableDjinn: activeDjinn.length,
        isAvailable: activeDjinn.length >= 2,
      });
    }
  });
  
  // Different element pairs (all combinations)
  for (let i = 0; i < elements.length; i++) {
    for (let j = i + 1; j < elements.length; j++) {
      const elem1 = elements[i];
      const elem2 = elements[j];
      const active1 = djinn.filter(d => d.element === elem1 && d.state === 'active');
      const active2 = djinn.filter(d => d.element === elem2 && d.state === 'active');
      
      summons.push({
        id: `double-${elem1}-${elem2}`,
        name: getDoubleSummonName(elem1, elem2), // e.g., "Geyser" for V+M
        elements: [elem1, elem2],
        power: getDoubleSummonPower(elem1, elem2),
        requiredDjinn: 2,
        availableDjinn: active1.length + active2.length,
        isAvailable: active1.length >= 1 && active2.length >= 1,
      });
    }
  }
  
  return summons;
}

// Example output for [Venus, Mercury, Mercury]:
// [
//   { name: "Tidal Wave", elements: ["Mercury", "Mercury"], power: 50, requiredDjinn: 2, availableDjinn: 2 },
//   { name: "Geyser", elements: ["Venus", "Mercury"], power: 55, requiredDjinn: 2, availableDjinn: 2 }
// ]
```

---

### Triple Column (Column 3)

```typescript
function generateTripleSummons(djinn: Djinn[]): SummonOption[] {
  if (djinn.length < 3) return [];
  
  const elementCounts = countElements(djinn);
  const elements = Object.keys(elementCounts);
  const activeDjinn = djinn.filter(d => d.state === 'active');
  
  // Determine element combination pattern
  const pattern = getElementPattern(elementCounts);
  // pattern examples: "AAA", "AAB", "ABC"
  
  const summon = {
    id: `triple-${elements.join('-')}`,
    name: getTripleSummonName(pattern, elements), // e.g., "Judgment" for AAB
    elements: djinn.map(d => d.element),
    power: getTripleSummonPower(pattern),
    requiredDjinn: 3,
    availableDjinn: activeDjinn.length,
    isAvailable: activeDjinn.length >= 3,
    additionalEffects: getTripleEffects(pattern), // e.g., +15 ATK, +10 DEF
  };
  
  return [summon];
}

// Helper to determine pattern
function getElementPattern(counts: Record<string, number>): string {
  const values = Object.values(counts).sort((a, b) => b - a);
  
  if (values[0] === 3) return "AAA"; // All same
  if (values[0] === 2) return "AAB"; // 2 same, 1 different
  return "ABC"; // All different
}

// Example output for [Venus, Mercury, Mercury]:
// [
//   { 
//     name: "Judgment", 
//     elements: ["Venus", "Mercury", "Mercury"], 
//     pattern: "AAB",
//     power: 100, 
//     requiredDjinn: 3, 
//     availableDjinn: 3,
//     additionalEffects: { atkBonus: 15, defBonus: 10, duration: 3 }
//   }
// ]
```

---

## Summon Name Mapping

### Single Element Summons

```typescript
const SINGLE_SUMMON_NAMES: Record<string, string> = {
  'Venus': 'Quake',       // Earth summon
  'Mars': 'Flare',        // Fire summon
  'Mercury': 'Frost',     // Water summon
  'Jupiter': 'Bolt',      // Wind summon
};

const SINGLE_SUMMON_POWER: Record<string, number> = {
  'Venus': 25,
  'Mars': 28,
  'Mercury': 20,
  'Jupiter': 22,
};
```

---

### Double Element Summons

```typescript
const DOUBLE_SUMMON_NAMES: Record<string, string> = {
  // Same element pairs
  'Venus-Venus': 'Rampart',       // Earth×2
  'Mars-Mars': 'Inferno',         // Fire×2
  'Mercury-Mercury': 'Tidal Wave',// Water×2
  'Jupiter-Jupiter': 'Storm',     // Wind×2
  
  // Mixed pairs (ordered alphabetically)
  'Jupiter-Mars': 'Corona',       // Wind+Fire
  'Jupiter-Mercury': 'Breeze',    // Wind+Water
  'Jupiter-Venus': 'Tempest',     // Wind+Earth
  'Mars-Mercury': 'Steam',        // Fire+Water
  'Mars-Venus': 'Volcano',        // Fire+Earth
  'Mercury-Venus': 'Geyser',      // Water+Earth
};

const DOUBLE_SUMMON_POWER: Record<string, number> = {
  'Venus-Venus': 50,
  'Mars-Mars': 55,
  'Mercury-Mercury': 48,
  'Jupiter-Jupiter': 52,
  'Jupiter-Mars': 58,
  'Jupiter-Mercury': 54,
  'Jupiter-Venus': 56,
  'Mars-Mercury': 52,
  'Mars-Venus': 60,
  'Mercury-Venus': 55,
};

function getDoubleSummonKey(elem1: string, elem2: string): string {
  // Always sort alphabetically for consistent lookup
  return [elem1, elem2].sort().join('-');
}
```

---

### Triple Element Summons

```typescript
const TRIPLE_SUMMON_NAMES: Record<string, Record<string, string>> = {
  // AAA patterns (all same element)
  'Venus-AAA': 'Gaia',
  'Mars-AAA': 'Meteor',
  'Mercury-AAA': 'Boreas',
  'Jupiter-AAA': 'Thor',
  
  // AAB patterns (2 same, 1 different)
  'Venus-Mercury-AAB': 'Judgment',    // 2×Venus + Mercury
  'Venus-Mars-AAB': 'Titan',          // 2×Venus + Mars
  'Mars-Jupiter-AAB': 'Phoenix',      // 2×Mars + Jupiter
  'Mercury-Jupiter-AAB': 'Nereid',    // 2×Mercury + Jupiter
  // ... (many more combinations)
  
  // ABC patterns (all different)
  'Jupiter-Mars-Mercury-Venus': 'Catastrophe', // All 4 elements (ultimate)
  'Mars-Mercury-Venus': 'Haures',              // Fire+Water+Earth
  'Jupiter-Mars-Venus': 'Eclipse',             // Wind+Fire+Earth
  // ... (more combinations)
};

const TRIPLE_SUMMON_POWER: Record<string, number> = {
  'AAA': 90,  // All same element
  'AAB': 100, // 2 same, 1 different
  'ABC': 120, // All different (most powerful)
};

function getTripleSummonName(pattern: string, elements: string[]): string {
  if (pattern === 'AAA') {
    const element = elements[0];
    return TRIPLE_SUMMON_NAMES[`${element}-AAA`];
  }
  
  if (pattern === 'AAB') {
    const elementCounts = countElements(elements);
    const primary = Object.entries(elementCounts).find(([_, count]) => count === 2)![0];
    const secondary = Object.entries(elementCounts).find(([_, count]) => count === 1)![0];
    return TRIPLE_SUMMON_NAMES[`${primary}-${secondary}-AAB`];
  }
  
  // ABC pattern - all different
  const sortedElements = elements.slice().sort().join('-');
  return TRIPLE_SUMMON_NAMES[sortedElements] || 'Catastrophe';
}

function getTripleSummonPower(pattern: string): number {
  return TRIPLE_SUMMON_POWER[pattern];
}
```

---

## Visual Examples

### Example 1: Venus + Mercury + Mercury

```
┌────────────────────────────────────────────────────────────┐
│ DJINN: [🌍 Flint] [💧 Sleet] [💧 Mist]                    │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│ SUMMONS (Element Combinations)                             │
├──────────────┬──────────────────┬──────────────────────────┤
│ SINGLE       │ DOUBLE           │ TRIPLE                   │
│ (1 Djinn)    │ (2 Djinn)        │ (3 Djinn)                │
├──────────────┼──────────────────┼──────────────────────────┤
│              │                  │                          │
│ 🌍 Quake     │ 🌍💧 Geyser     │ 🌍💧💧 Judgment         │
│ Earth        │ Earth+Water      │ Venus+Mercury×2          │
│ Power: 25    │ Power: 55        │ Power: 100               │
│ Target: 1    │ Target: All      │ Target: All              │
│ Uses: Flint  │ Uses: V+M (any)  │ Uses: All 3              │
│ [Active] ✓   │ [2 Active] ✓     │ [3 Active] ✓             │
│              │                  │                          │
│ 💧 Frost     │ 💧💧 Tidal Wave │ Bonus: +15 ATK (3t)      │
│ Water        │ Water×2          │        +10 DEF (3t)      │
│ Power: 20    │ Power: 48        │                          │
│ Target: 1    │ Target: All      │                          │
│ Uses: M(any) │ Uses: 2×M        │                          │
│ [Active] ✓   │ [2 Active] ✓     │                          │
│              │                  │                          │
└──────────────┴──────────────────┴──────────────────────────┘
```

**Available Summons:** 2 single + 2 double + 1 triple = **5 total**

---

### Example 2: Venus + Mars + Jupiter (All Different)

```
┌────────────────────────────────────────────────────────────┐
│ DJINN: [🌍 Granite] [🔥 Forge] [💨 Gust]                  │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│ SUMMONS (Element Combinations)                             │
├──────────────┬──────────────────┬──────────────────────────┤
│ SINGLE       │ DOUBLE           │ TRIPLE                   │
├──────────────┼──────────────────┼──────────────────────────┤
│              │                  │                          │
│ 🌍 Quake     │ 🔥💨 Corona     │ 🌍🔥💨 Eclipse         │
│ Earth        │ Fire+Wind        │ Earth+Fire+Wind          │
│ Power: 25    │ Power: 58        │ Power: 120               │
│ [Active] ✓   │ [2 Active] ✓     │ [3 Active] ✓             │
│              │                  │                          │
│ 🔥 Flare     │ 🌍💨 Tempest    │ Bonus: +20 ATK (3t)      │
│ Fire         │ Earth+Wind       │        +15 DEF (3t)      │
│ Power: 28    │ Power: 56        │        +10 SPD (3t)      │
│ [Active] ✓   │ [2 Active] ✓     │                          │
│              │                  │                          │
│ 💨 Bolt      │ 🌍🔥 Volcano    │                          │
│ Wind         │ Earth+Fire       │                          │
│ Power: 22    │ Power: 60        │                          │
│ [Active] ✓   │ [2 Active] ✓     │                          │
│              │                  │                          │
└──────────────┴──────────────────┴──────────────────────────┘
```

**Available Summons:** 3 single + 3 double + 1 triple = **7 total** (maximum)

---

### Example 3: Mars + Mars + Mars (All Same)

```
┌────────────────────────────────────────────────────────────┐
│ DJINN: [🔥 Forge] [🔥 Fever] [🔥 Corona]                  │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│ SUMMONS (Element Combinations)                             │
├──────────────┬──────────────────┬──────────────────────────┤
│ SINGLE       │ DOUBLE           │ TRIPLE                   │
├──────────────┼──────────────────┼──────────────────────────┤
│              │                  │                          │
│ 🔥 Flare     │ 🔥🔥 Inferno    │ 🔥🔥🔥 Meteor          │
│ Fire         │ Fire×2           │ Mars×3                   │
│ Power: 28    │ Power: 55        │ Power: 90                │
│ Target: 1    │ Target: All      │ Target: All              │
│ Uses: Any M  │ Uses: Any 2×M    │ Uses: All 3              │
│ [Active] ✓   │ [2 Active] ✓     │ [3 Active] ✓             │
│              │                  │                          │
│              │                  │ Bonus: +25 ATK (4t)      │
│              │                  │        +5 DEF (4t)       │
│              │                  │        Pure Fire damage  │
│              │                  │                          │
└──────────────┴──────────────────┴──────────────────────────┘
```

**Available Summons:** 1 single + 1 double + 1 triple = **3 total** (fewest, but most focused)

---

## Djinn Selection Logic

### Which Djinn Get Used?

**System automatically selects:**
1. **Priority:** Active Djinn first (not in Standby)
2. **Order:** By slot position (left to right)
3. **Requirement:** Must match required elements

**Example:**
```
Equipped: [🌍 Flint-Active] [💧 Sleet-Active] [💧 Mist-Standby]

User selects: 💧💧 Tidal Wave (requires 2× Mercury)

System uses: Sleet + Mist (but Mist is in Standby, so UNAVAILABLE)
Result: Summon is locked, shows "Need 2 Active Mercury Djinn"
```

---

## Effects Panel Integration

When user hovers over a summon option (e.g., "Geyser"), show effects panel:

```
┌──────────────────────────────────────────────────────────┐
│ ⚡ UNLEASH: GEYSER (🌍💧)                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Summon Power:                                            │
│ • Deals 55 Earth+Water damage to all enemies            │
│ • May apply Muddy (50% chance, SPD -10 for 2 turns)     │
│                                                          │
│ ═══════════════════════════════════════════════════════  │
│ STAT CHANGES (While in Standby):                        │
│ ═══════════════════════════════════════════════════════  │
│                                                          │
│ Will use: Flint (Venus) + Sleet (Mercury)               │
│                                                          │
│ Lost Passive Bonuses:                                    │
│ • Flint: -6 ATK, -4 DEF                                 │
│ • Sleet: -3 MAG, -2 DEF                                 │
│ ─────────────────────────────────────                   │
│ TOTAL LOSS: -6 ATK, -6 DEF, -3 MAG                      │
│                                                          │
│ ═══════════════════════════════════════════════════════  │
│ ABILITIES LOCKED (While in Standby):                    │
│ ═══════════════════════════════════════════════════════  │
│                                                          │
│ Garet will lose:                                         │
│ ❌ Quake [3○] (requires Flint-Active)                    │
│                                                          │
│ Mia will lose:                                           │
│ ❌ Ice Shard [2○] (requires Sleet-Active)               │
│ ❌ Frost [1○] (requires Sleet-Active)                   │
│                                                          │
│ ═══════════════════════════════════════════════════════  │
│ RECOVERY: Both Djinn return in 3 turns                  │
│                                                          │
│ ⚠️ Team will be weakened until Djinn recover!            │
│                                                          │
│ [CONFIRM SUMMON] [CANCEL]                                │
└──────────────────────────────────────────────────────────┘
```

---

## Implementation Updates

### Summon Data Structure

```typescript
interface SummonOption {
  id: string;
  name: string;
  elements: ElementType[]; // Element types used
  elementPattern: 'AAA' | 'AAB' | 'ABC'; // Pattern for triple summons
  power: number;
  target: 'single-enemy' | 'all-enemies';
  requiredDjinn: 1 | 2 | 3;
  usedDjinnIds: string[]; // Specific Djinn that will be used
  availableDjinn: number; // How many active Djinn of required elements
  isAvailable: boolean;
  statusEffects?: StatusEffect[];
  additionalEffects?: {
    atkBonus?: number;
    defBonus?: number;
    spdBonus?: number;
    magBonus?: number;
    duration?: number;
  };
}

type ElementType = 'Venus' | 'Mars' | 'Mercury' | 'Jupiter';
```

---

### Component Updates

```typescript
export function DjinnMenu({ equippedDjinn }: DjinnMenuProps) {
  // Calculate available summons based on equipped Djinn element types
  const singleSummons = useMemo(() => 
    generateSingleSummons(equippedDjinn), 
    [equippedDjinn]
  );
  
  const doubleSummons = useMemo(() => 
    generateDoubleSummons(equippedDjinn), 
    [equippedDjinn]
  );
  
  const tripleSummons = useMemo(() => 
    generateTripleSummons(equippedDjinn), 
    [equippedDjinn]
  );
  
  return (
    <div className="djinn-menu">
      <DjinnIcons djinn={equippedDjinn} />
      
      <DjinnSummonGrid
        singleSummons={singleSummons}
        doubleSummons={doubleSummons}
        tripleSummons={tripleSummons}
        onHover={setHoveredSummon}
        onSelect={handleSummonSelect}
      />
      
      {hoveredSummon && (
        <DjinnEffectsPanel
          summon={hoveredSummon}
          equippedDjinn={equippedDjinn}
          team={currentTeam}
          onConfirm={handleConfirmSummon}
          onCancel={() => setHoveredSummon(null)}
        />
      )}
    </div>
  );
}
```

---

## Summary of Changes

### Key Differences from Previous Design

**OLD (Specific Djinn Pairs):**
- Tinder = Flint + Fizz specifically
- Each Djinn combo is unique

**NEW (Element Type Combinations):**
- Tinder = Mars + Jupiter (ANY Mars + ANY Jupiter)
- Summons based on element types, not specific Djinn
- More flexible, more strategic

**Benefits:**
✅ **Flexible:** Any Djinn of the right element works  
✅ **Combinatorial:** More interesting combinations (AAA, AAB, ABC)  
✅ **Strategic:** Element diversity matters  
✅ **Scalable:** Easy to add more Djinn without breaking summon system  

---

**Next:** Implement element-based combination system in Djinn menu?
