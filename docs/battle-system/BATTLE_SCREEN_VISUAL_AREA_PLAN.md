# Battle Screen Visual Area & Ability Details Plan

**Date:** 2025-11-21  
**Focus Areas:**
1. Middle "Visual Area Continued" section design
2. Comprehensive ability details optimization (keyhole gameplay)
3. Status effects & multi-hit mechanics investigation

---

## Part 1: Visual Area Continued (Middle Section)

### Layout Reference (Mockup 1)

```
┌──────────────────────┬──────────────────────────────────┬───────────────────┤
│                      │                                  │                   │
│  LEFT PANEL          │  VISUAL AREA CONTINUED           │   RIGHT PANEL     │
│  Character           │  (Battlefield Background)        │   Turn Order      │
│  Portraits           │                                  │                   │
│                      │                                  │                   │
```

### Design Options for Middle Section

#### Option 1: **Battle Log** (Recommended)

**Description:** Real-time event log showing recent battle actions

**Pros:**
✅ Shows combat flow (who hit whom, damage dealt, status applied)  
✅ Component already exists (`BattleLog.tsx`)  
✅ Helps players understand what happened  
✅ Natural fit for "continued visual area"  

**Cons:**
⚠️ Can get cluttered with many events  
⚠️ May need scrolling or auto-scroll

**Implementation:**
- Use existing `BattleLog` component
- Style as semi-transparent overlay on battlefield
- Auto-scroll to recent events
- Limit to last 8-10 events
- Format: `"Isaac used Fireball on Goblin A for 45 damage!"`

**Example:**
```
┌────────────────────────────────────────┐
│  BATTLE LOG                            │
├────────────────────────────────────────┤
│  Isaac used Fireball on Goblin A       │
│  → 45 damage! (Weakness!)              │
│                                         │
│  Goblin A attacked Isaac                │
│  → 12 damage                            │
│                                         │
│  Garet used Guard Break on Goblin B    │
│  → 18 damage, DEF -6 for 2 turns       │
│                                         │
│  Mia used Heal on Isaac                 │
│  → Restored 25 HP                       │
└────────────────────────────────────────┘
```

---

#### Option 2: **Taglines / Flavor Text**

**Description:** Show dramatic taglines when abilities are used

**Pros:**
✅ Adds flavor and personality  
✅ Makes abilities feel more impactful  
✅ Golden Sun style (authentic feel)  

**Cons:**
⚠️ Requires writing taglines for every ability  
⚠️ May distract from tactical information  
⚠️ Not as informative as battle log

**Implementation:**
- Map ability IDs to taglines
- Show on ability cast (fade in/out animation)
- Examples:
  - `Fireball`: "Flames consume the battlefield!"
  - `Heal`: "Soothing energy restores vitality."
  - `Guard Break`: "Defenses shattered!"

**Example:**
```
┌────────────────────────────────────────┐
│                                         │
│                                         │
│      ⚔️ FLAMES CONSUME THE ENEMY! ⚔️    │
│                                         │
│                                         │
└────────────────────────────────────────┘
```

---

#### Option 3: **Animation Placeholder / Background**

**Description:** Just show battlefield background, reserve space for future animations

**Pros:**
✅ Clean and uncluttered  
✅ Future-proof for animation system  
✅ Keeps focus on portraits and turn order  

**Cons:**
⚠️ Wastes valuable screen space  
⚠️ Doesn't provide tactical information  
⚠️ Less engaging

**Implementation:**
- Use `BackgroundSprite` component
- Show battlefield background (forest, cave, etc.)
- Add subtle particle effects (optional)

---

#### Option 4: **Hybrid: Battle Log + Taglines**

**Description:** Battle log with occasional dramatic taglines for major events

**Pros:**
✅ Best of both worlds  
✅ Tactical information + flavor  
✅ Taglines for critical moments (KO, summons, ultimates)  

**Implementation:**
- Default: Show battle log
- On major events: Override with tagline (3-second display)
- Major events: KO, status applied, ultimate abilities, critical hits

**Example:**
```
Normal state:
┌────────────────────────────────────────┐
│  BATTLE LOG                            │
│  Isaac → Fireball → Goblin A (45 dmg) │
│  Goblin A → Strike → Isaac (12 dmg)   │
│  ...                                    │
└────────────────────────────────────────┘

On critical moment:
┌────────────────────────────────────────┐
│                                         │
│      💀 GOBLIN A HAS FALLEN! 💀         │
│                                         │
└────────────────────────────────────────┘
```

---

### **My Recommendation: Option 4 (Hybrid)**

**Rationale:**
1. ✅ **Tactical value:** Battle log helps players track what happened (especially in queue-based system where multiple actions resolve simultaneously)
2. ✅ **Engagement:** Taglines add impact to critical moments
3. ✅ **Balanced:** Information + flavor without overwhelming
4. ✅ **Easy to implement:** Both components already exist

**Implementation Priority:**
1. Start with Battle Log only (Phase 1)
2. Add taglines for critical moments (Phase 2)

---

## Part 2: Ability Details Optimization (Keyhole Gameplay)

### Current State

**Current Display (QueueBattleView.tsx lines 410):**
```typescript
{ability.name} [{manaCost}○]
// Example: "Fireball [2○]"
```

**Problem:** ❌ Only shows name and mana cost - no tactical information

---

### Optimized Ability Card Design

#### Card Layout (Bottom Panel)

```
┌─────────────────────────────────────────────────────────────────┐
│ [ICON] Fireball                                         [2○]    │
├─────────────────────────────────────────────────────────────────┤
│ Mars Psynergy | Single Enemy | Power: 35                        │
│                                                                  │
│ Launches a ball of fire at a single enemy, dealing fire damage. │
│                                                                  │
│ Effects:                                                         │
│ • Burn (80% chance, 3 turns, 10 dmg/turn)                      │
│ • Element advantage: 1.5× vs Jupiter, 0.67× vs Mercury         │
└─────────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy (What to Show)

**Tier 1: Always Show (Core Info)**
1. ✅ Icon (visual recognition)
2. ✅ Name (identity)
3. ✅ Mana cost (resource management)
4. ✅ Element + Type (tactical positioning)
5. ✅ Target type (strategic planning)
6. ✅ Base power (damage expectation)

**Tier 2: Contextual (When Present)**
7. ✅ Status effects (type, chance, duration, damage)
8. ✅ Buffs/debuffs (stat, value, duration)
9. ✅ Hit count (multi-hit attacks)
10. ✅ Special mechanics (chain damage, ignore defense, etc.)

**Tier 3: Advanced (Tooltip/Hover)**
11. ⚠️ Elemental advantages (show on hover)
12. ⚠️ Detailed calculations (show on hover)
13. ⚠️ AI priority hints (dev mode only)

---

### Ability Card Component Structure

**New Component: `AbilityDetailCard.tsx`**

```typescript
interface AbilityDetailCardProps {
  ability: Ability;
  isSelected: boolean;
  isLocked: boolean;
  lockReason?: string;
  canAfford: boolean;
  onClick: () => void;
}

export function AbilityDetailCard({ ability, isSelected, isLocked, lockReason, canAfford, onClick }: AbilityDetailCardProps) {
  return (
    <div className={`ability-card ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}`}>
      {/* Header: Icon, Name, Mana Cost */}
      <div className="ability-header">
        <AbilityIcon abilityId={ability.id} />
        <span className="ability-name">{ability.name}</span>
        <span className="mana-cost">[{ability.manaCost}○]</span>
      </div>
      
      {/* Meta: Type, Element, Target, Power */}
      <div className="ability-meta">
        <span>{ability.element} {ability.type}</span>
        <span>|</span>
        <span>{formatTargetType(ability.targets)}</span>
        {ability.basePower > 0 && (
          <>
            <span>|</span>
            <span>Power: {ability.basePower}</span>
          </>
        )}
      </div>
      
      {/* Description */}
      <p className="ability-description">{ability.description}</p>
      
      {/* Effects (Conditional) */}
      {hasEffects(ability) && (
        <div className="ability-effects">
          <strong>Effects:</strong>
          <ul>
            {ability.statusEffect && (
              <li>
                {formatStatusEffect(ability.statusEffect)}
              </li>
            )}
            {ability.buffEffect && (
              <li>
                {formatBuffEffect(ability.buffEffect, ability.duration)}
              </li>
            )}
            {ability.debuffEffect && (
              <li>
                {formatDebuffEffect(ability.debuffEffect, ability.duration)}
              </li>
            )}
            {ability.hitCount && ability.hitCount > 1 && (
              <li>
                Hits {ability.hitCount} times
              </li>
            )}
            {ability.chainDamage && (
              <li>
                Chain damage: Each hit deals 80% of previous
              </li>
            )}
            {ability.ignoreDefensePercent && (
              <li>
                Ignores {ability.ignoreDefensePercent * 100}% of target DEF
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

---

### Formatting Helpers

**Status Effect Formatting:**
```typescript
function formatStatusEffect(status: Ability['statusEffect']): string {
  if (!status) return '';
  
  const { type, duration, chance = 1.0 } = status;
  const chancePercent = Math.round(chance * 100);
  
  // Get damage per turn (if applicable)
  const damageInfo = type === 'poison' ? '8 dmg/turn' : type === 'burn' ? '10 dmg/turn' : '';
  
  // Format: "Burn (80% chance, 3 turns, 10 dmg/turn)"
  return `${capitalize(type)} (${chancePercent}% chance, ${duration} turns${damageInfo ? ', ' + damageInfo : ''})`;
}

// Examples:
// "Burn (80% chance, 3 turns, 10 dmg/turn)"
// "Paralyze (50% chance, 2 turns)"
// "Freeze (100% chance, 3 turns)"
```

**Buff/Debuff Formatting:**
```typescript
function formatBuffEffect(buff: Ability['buffEffect'], duration?: number): string {
  if (!buff) return '';
  
  const parts: string[] = [];
  if (buff.atk) parts.push(`ATK +${buff.atk}`);
  if (buff.def) parts.push(`DEF +${buff.def}`);
  if (buff.mag) parts.push(`MAG +${buff.mag}`);
  if (buff.spd) parts.push(`SPD +${buff.spd}`);
  
  const durationText = duration ? ` for ${duration} turns` : '';
  return parts.join(', ') + durationText;
}

// Example: "ATK +12, DEF +8 for 3 turns"
```

---

### Display Modes

#### Mode 1: **Compact List** (Default)

Show all abilities as cards in a scrollable list (current planning phase)

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  ABILITIES (Select One)                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [AbilityDetailCard - Attack]                               │
│  [AbilityDetailCard - Fireball]        ← Selected          │
│  [AbilityDetailCard - Heal]                                 │
│  [AbilityDetailCard - Guard Break]                          │
│  [AbilityDetailCard - Djinn Ability] ← Locked              │
│                                                              │
│  [Scroll for more...]                                       │
└──────────────────────────────────────────────────────────────┘
```

#### Mode 2: **Expanded Card** (On Hover)

Show detailed view on hover (Phase 2 enhancement)

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  Hover over any ability to see detailed breakdown            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ FIREBALL (DETAILED VIEW)                            │   │
│  │                                                      │   │
│  │ Base Power: 35                                      │   │
│  │ Mana Cost: 2                                        │   │
│  │                                                      │   │
│  │ Expected Damage (vs Goblin A):                      │   │
│  │ • Normal: 45-55 damage                              │   │
│  │ • Crit (10%): 90-110 damage                         │   │
│  │ • Elemental Adv (Jupiter): 67-82 damage (1.5×)     │   │
│  │                                                      │   │
│  │ Status Effect:                                      │   │
│  │ • 80% chance to apply Burn                          │   │
│  │ • Burn: 10 damage/turn for 3 turns (30 total)      │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## Part 3: Status Effects & Multi-Hit Investigation

### Question 1: Are Status Effects Implemented?

**Answer: ✅ YES - Fully Implemented**

**Evidence:**

1. **Schema Definition** (`AbilitySchema.ts` line 40-44):
```typescript
statusEffect: z.object({
  type: z.enum(['poison', 'burn', 'freeze', 'paralyze', 'stun']),
  duration: z.number().int().min(1),
  chance: z.number().min(0).max(1).optional(), // Probability 0-1, defaults to 1.0
}).optional()
```

2. **Battle Service Implementation** (`BattleService.ts` lines 395-444):
```typescript
// Apply status effect (if any)
if (ability.statusEffect) {
  const statusType = ability.statusEffect.type;
  const statusDuration = ability.statusEffect.duration;
  const statusChance = ability.statusEffect.chance ?? 1.0; // Default 100%

  // Use RNG for status chance roll
  const roll = rng.next(); // Returns [0, 1)
  if (roll < statusChance) {
    // Create and apply status effect
    // ...
  }
}
```

3. **Example Abilities with Status Effects** (`abilities.ts`):

| Ability | Status Effect | Chance | Duration | Damage/Turn |
|---------|---------------|--------|----------|-------------|
| `poison-strike` | Poison | 100% | 3 turns | 8 dmg/turn |
| `burn-touch` | Burn | 100% | 3 turns | 10 dmg/turn |
| `frost-touch` | Freeze | 100% | 2 turns | N/A |
| `spark-strike` | Paralyze | 100% | 2 turns | N/A |
| `blazing-arrow` | Burn | 80% | 3 turns | 10 dmg/turn |
| `stone-spire` | Freeze | 50% | 2 turns | N/A |
| `thunder-bolt` | Paralyze | 50% | 2 turns | N/A |
| `nova-flare` | Burn | 60% | 2 turns | 10 dmg/turn |

**Status Effect Types:**
- ✅ **Poison:** Damage over time (8 dmg/turn)
- ✅ **Burn:** Damage over time (10 dmg/turn)
- ✅ **Freeze:** Skip turns, cannot act
- ✅ **Paralyze:** Skip turns, cannot act
- ✅ **Stun:** Skip turns (shorter duration)

---

### Question 2: Are Multi-Hits Implemented?

**Answer: ✅ YES - Fully Implemented**

**Evidence:**

1. **Schema Definition** (`AbilitySchema.ts` line 62):
```typescript
hitCount: z.number().int().min(1).max(10).optional(), // 2-4 typical
```

2. **Battle Service Implementation** (`BattleService.ts` lines 358-391):
```typescript
const hitCount = ability.hitCount || 1; // Multi-hit support

// Multi-hit logic
for (let hit = 0; hit < hitCount; hit++) {
  if (isUnitKO(currentTarget)) break; // Stop if target KO'd
  
  const damage = calculateDamage(...);
  const { updatedUnit, actualDamage } = applyDamageWithShields(currentTarget, damage);
  currentTarget = updatedUnit;
  targetDamage += actualDamage;
}
```

3. **Example Abilities with Multi-Hits** (`abilities.ts`):

| Ability | Hit Count | Element | Description |
|---------|-----------|---------|-------------|
| `double-strike` | 2 | Venus | Strike twice with earth force |
| `rapid-fire` | 2 | None | Lightning-fast double strike |
| `triple-strike` | 3 | None | Lightning-fast triple strike |
| `barrage-fire` | 3 | Mars | Rapid-fire explosions |
| `plasma-burst` | 3 | Jupiter | Rapid plasma bolts |
| `flurry-strike` | 4 | None | Rapid flurry of strikes |
| `lightning-barrage` | 4 | Jupiter | Unleash barrage of lightning |
| `combo-strike` | 5 | None | Deadly combination of strikes |
| `infinite-flurry` | 6 | None | Unstoppable barrage |
| `legend-killer` | 8 | None | Legendary technique at blinding speed |

**Multi-Hit Mechanics:**
- ✅ Each hit calculates damage independently
- ✅ Stops hitting if target is KO'd mid-sequence
- ✅ Works with shields (each hit checks shields)
- ✅ Total damage is sum of all hits

---

### Question 3: Are These Deterministic?

**Answer: ✅ YES - Fully Deterministic (Using Seeded PRNG)**

**Evidence:**

1. **PRNG Interface** (`prng.ts`):
```typescript
export interface PRNG {
  next(): number;      // Returns [0, 1)
  nextInt(max: number): number;  // Returns [0, max)
}

export function makePRNG(seed: number): PRNG {
  // LCG implementation with fixed constants
  // Same seed = same sequence every time
}
```

2. **Battle Service Usage**:
- All RNG calls use the passed `PRNG` instance
- Status chance: `const roll = rng.next(); if (roll < statusChance)`
- Damage calculation uses PRNG for crits/variance
- Turn order uses PRNG for tiebreakers

3. **Test Determinism**:
```typescript
// Same seed = same results
const rng1 = makePRNG(12345);
const rng2 = makePRNG(12345);

rng1.next(); // 0.123...
rng2.next(); // 0.123... (identical)
```

**Determinism Guarantees:**
✅ Same battle state + same seed = same outcome  
✅ Replays work perfectly  
✅ Debugging is reproducible  
✅ No `Math.random()` in core logic (enforced by architecture)  

---

### Question 4: About the "3-5 hits" Example

**Current State:**

In the mockup, I wrote:
> "Chain Lightning: Hit Count: 3-5 hits (random)"

**Reality Check:**

❌ **This is NOT implemented.** The current schema only supports fixed hit counts:

```typescript
hitCount: z.number().int().min(1).max(10).optional()
// Example: hitCount: 3  ← Fixed, not random
```

**Would You Like This Feature?**

If you want variable hit counts (e.g., "3-5 hits"), we would need to:

1. Add schema field:
```typescript
hitCountRange: z.object({
  min: z.number().int().min(1),
  max: z.number().int().min(1)
}).optional()
```

2. Implement in battle service:
```typescript
const hitCount = ability.hitCountRange 
  ? rng.nextInt(ability.hitCountRange.max - ability.hitCountRange.min + 1) + ability.hitCountRange.min
  : ability.hitCount || 1;
```

**Recommendation:** 
- ⏸️ **Not needed yet** - Fixed hit counts work well
- 📝 **Consider for Phase 3** if you want more variety

---

## Summary & Recommendations

### Visual Area (Middle Section)

**Recommendation: Hybrid Battle Log + Taglines**

**Phase 1 (Now):**
- Show battle log (recent 8-10 events)
- Use existing `BattleLog` component
- Style as semi-transparent overlay

**Phase 2 (Later):**
- Add taglines for critical moments (KO, critical hits, ultimates)
- 3-second override display
- Fade in/out animations

---

### Ability Details (Bottom Panel)

**Recommendation: Comprehensive Ability Cards**

**Phase 1 (Now):**
- Create `AbilityDetailCard` component
- Show: Icon, Name, Mana, Type, Element, Target, Power, Description
- Show effects: Status, Buffs, Debuffs, Multi-hits, Special mechanics
- Format status effects: "Burn (80% chance, 3 turns, 10 dmg/turn)"

**Phase 2 (Later):**
- Add hover tooltips with damage predictions
- Add elemental advantage calculations
- Add comparison mode (compare multiple abilities)

---

### Mechanics Investigation

**✅ Status Effects: Fully implemented, deterministic, chance-based**  
**✅ Multi-Hits: Fully implemented, deterministic, fixed counts**  
**❌ Variable Hit Counts (3-5): NOT implemented, consider for Phase 3**

---

## Implementation Checklist

### Visual Area (Middle)
- [ ] Add battle log to middle section
- [ ] Style as semi-transparent overlay
- [ ] Auto-scroll to recent events
- [ ] Limit to last 8-10 events
- [ ] Test with long battle sequences

### Ability Details (Bottom)
- [ ] Create `AbilityDetailCard.tsx` component
- [ ] Add formatting helpers (status, buffs, debuffs)
- [ ] Wire to QueueBattleView ability selection
- [ ] Add visual states (selected, locked, unaffordable)
- [ ] Test with all ability types
- [ ] Test with locked Djinn abilities

### Polish
- [ ] Add icons for ability types/elements
- [ ] Color-code elements (Mars=red, Venus=yellow, etc.)
- [ ] Add hover states
- [ ] Add transition animations
- [ ] Test responsiveness

---

**Next Action:** Confirm visual area approach and begin implementation of `AbilityDetailCard` component.
