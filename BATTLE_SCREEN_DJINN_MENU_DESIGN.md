# Djinn Menu - Top Right Cascading Dropdown Design

**Date:** 2025-11-21  
**Location:** Top-right corner of screen (fixed position)  
**Behavior:** Multi-layer cascading dropdown menu

---

## Menu Structure

### Layer 1: Collapsed Icons (Default)

**Position:** Top-right corner, floating above battlefield

```
                                    ┌─────────────────┐
                                    │ DJINN:          │
                                    │ [🔥] [💨] [💧]  │ ← Click/Hover
                                    └─────────────────┘
```

**Features:**
- Minimal space (just icons)
- Visual state indicators:
  - **Active (bright):** `[🔥]` - Ready to summon
  - **Standby (dimmed):** `[🔥]` - Recently used, recovering
  - **Set (normal):** `[🔥]` - Equipped, providing passive bonus

---

### Layer 2: Summon Options Dropdown (On Hover/Click)

**Expands downward from Layer 1**

```
                                    ┌─────────────────┐
                                    │ DJINN:          │
                                    │ [🔥] [💨] [💧]  │
                                    └─────────────────┘
                                    ┌────────────────────────────────────────┐
                                    │ SUMMON OPTIONS (Hover column)          │
                                    ├────────────┬────────────┬──────────────┤
                                    │ SINGLE     │ DOUBLE     │ TRIPLE       │
                                    │ (1 Djinn)  │ (2 Djinn)  │ (3 Djinn)    │
                                    ├────────────┼────────────┼──────────────┤
                                    │            │            │              │
                                    │ 🔥 Flint   │ 🔥💨 Tinder│ 🔥💨💧 Gaia  │
                                    │ Mars       │ Fire+Wind  │ Tri-Element  │
                                    │ Power: 25  │ Power: 55  │ Power: 100   │
                                    │ Target: 1  │ Target: All│ Target: All  │
                                    │ [Active]   │ [2 Active] │ [3 Active]   │
                                    │            │            │              │
                                    │ 💨 Fizz    │ 💨💧 Breeze│              │
                                    │ Jupiter    │ Wind+Water │              │
                                    │ Power: 22  │ Power: 50  │              │
                                    │ Target: 1  │ Target: All│              │
                                    │ [Active]   │ [2 Active] │              │
                                    │            │            │              │
                                    │ 💧 Sleet   │ 🔥💧 Steam │              │
                                    │ Mercury    │ Fire+Water │              │
                                    │ Power: 20  │ Power: 52  │              │
                                    │ Target: 1  │ Target: 1  │              │
                                    │ [Standby]🔒│ [Need 2]🔒 │              │
                                    │            │            │              │
                                    │ [Hover →]  │ [Hover →]  │ [Hover →]    │
                                    └────────────┴────────────┴──────────────┘
```

**Features:**
- 3 columns: Single, Double, Triple summons
- Each option shows:
  - Djinn required (icons)
  - Element type
  - Power level
  - Target type
  - Availability status
- Hover over any option to see Layer 3

---

### Layer 3: Effects Panel (On Hover Option)

**Expands downward from Layer 2, below selected column**

```
                                    ┌─────────────────┐
                                    │ DJINN:          │
                                    │ [🔥] [💨] [💧]  │
                                    └─────────────────┘
                                    ┌────────────────────────────────────────┐
                                    │ SUMMON OPTIONS                         │
                                    ├────────────┬────────────┬──────────────┤
                                    │ SINGLE     │ DOUBLE     │ TRIPLE       │
                                    ├────────────┼────────────┼──────────────┤
                                    │ 🔥 Flint   │ 🔥💨 Tinder│ 🔥💨💧 Gaia  │
                                    │ Power: 25  │ Power: 55  │ Power: 100   │
                                    │ [Hover →]  │ [HOVERED]  │              │
                                    └────────────┴────────────┴──────────────┘
                                    ┌──────────────────────────────────────────┐
                                    │ ⚡ UNLEASH EFFECTS: TINDER               │
                                    ├──────────────────────────────────────────┤
                                    │                                          │
                                    │ Summon Power:                            │
                                    │ • Deals 55 fire+wind damage to all      │
                                    │ • May apply Burn (50% chance, 2 turns)  │
                                    │                                          │
                                    │ ───────────────────────────────────────  │
                                    │ STAT CHANGES (While in Standby):        │
                                    │ ───────────────────────────────────────  │
                                    │                                          │
                                    │ Lost Passive Bonuses:                    │
                                    │ • Flint: -6 ATK, -4 DEF                 │
                                    │ • Fizz: -5 SPD, +0 ATK                  │
                                    │ Total Loss: -6 ATK, -4 DEF, -5 SPD      │
                                    │                                          │
                                    │ ───────────────────────────────────────  │
                                    │ ABILITIES LOCKED (While in Standby):    │
                                    │ ───────────────────────────────────────  │
                                    │                                          │
                                    │ ❌ Fireball (requires Flint - Active)    │
                                    │ ❌ Spark Strike (requires Fizz - Active) │
                                    │                                          │
                                    │ ───────────────────────────────────────  │
                                    │ ⏱️ RECOVERY:                             │
                                    │ Both Djinn return to Set after 3 turns  │
                                    │                                          │
                                    │ ⚠️ WARNING: Team will be weakened       │
                                    │    until Djinn recover!                  │
                                    │                                          │
                                    │ [CONFIRM SUMMON] [CANCEL]                │
                                    └──────────────────────────────────────────┘
```

**Features:**
- Shows comprehensive effects of unleashing
- **Section 1: Summon Power**
  - Damage dealt
  - Status effects applied
  - Target info
- **Section 2: Stat Changes**
  - Lost passive bonuses from each Djinn
  - Total stat loss calculated
- **Section 3: Abilities Locked**
  - List of abilities that become unavailable
  - Reason: "requires X - Active"
- **Section 4: Recovery Info**
  - How many turns until Djinn return
  - Warning about team weakness

---

## Complete Visual Flow

### State 1: Collapsed (Default)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                              ┌─────────────────┐    │
│                                              │ DJINN:          │    │
│                                              │ [🔥] [💨] [💧]  │    │
│                                              └─────────────────┘    │
│                                                                     │
│  ┌─────────────┬────────────────────────────────┬──────────────┐   │
│  │             │                                │              │   │
│  │ Portraits   │     BATTLEFIELD                │ Turn Order   │   │
│  │             │                                │              │   │
│  │             │   [Enemy A]    [Enemy B]       │              │   │
│  │             │                                │              │   │
│  │             │                                │              │   │
│  │             │   [Unit A]  [Unit B]           │              │   │
│  │             │   [Unit C]  [Unit D]           │              │   │
│  └─────────────┴────────────────────────────────┴──────────────┘   │
│                                                                     │
│  [Abilities panel at bottom]                                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

### State 2: Summon Options Expanded

```
┌─────────────────────────────────────────────────────────────────────┐
│                                              ┌─────────────────┐    │
│                                              │ DJINN:          │    │
│                                              │ [🔥] [💨] [💧]  │    │
│                                              └─────────────────┘    │
│                                              ┌─────────────────────┐│
│                                              │ SUMMON OPTIONS      ││
│                                              ├──────┬──────┬───────┤│
│                                              │SINGLE│DOUBLE│TRIPLE ││
│                                              ├──────┼──────┼───────┤│
│  ┌─────────────┬────────────────────────────│🔥    │🔥💨  │🔥💨💧 ││
│  │             │                            │Flint │Tinder│Gaia   ││
│  │ Portraits   │     BATTLEFIELD            │Pwr:25│Pwr:55│Pwr:100││
│  │             │                            │[Act] │[2Act]│[3Act] ││
│  │             │   [Enemy A]    [Enemy B]   │      │      │       ││
│  │             │                            │💨    │💨💧  │       ││
│  │             │                            │Fizz  │Breeze│       ││
│  │             │   [Unit A]  [Unit B]       │Pwr:22│Pwr:50│       ││
│  │             │   [Unit C]  [Unit D]       │[Act] │[2Act]│       ││
│  └─────────────┴────────────────────────────│      │      │       ││
│                                              │💧    │🔥💧  │       ││
│  [Abilities panel at bottom]                │Sleet │Steam │       ││
│                                              │[Stby]│[Need]│       ││
│                                              └──────┴──────┴───────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

### State 3: Effects Panel Shown (Hovering "Tinder")

```
┌─────────────────────────────────────────────────────────────────────┐
│                                              ┌─────────────────┐    │
│                                              │ DJINN:          │    │
│                                              │ [🔥] [💨] [💧]  │    │
│                                              └─────────────────┘    │
│                                              ┌─────────────────────┐│
│                                              │ SUMMON OPTIONS      ││
│                                              ├──────┬──────┬───────┤│
│  ┌─────────────┬────────────────────────────│SINGLE│DOUBLE│TRIPLE ││
│  │             │                            ├──────┼──────┼───────┤│
│  │ Portraits   │     BATTLEFIELD            │🔥    │🔥💨✓ │🔥💨💧 ││
│  │             │                            │Flint │Tinder│Gaia   ││
│  │             │   [Enemy A]    [Enemy B]   └──────┴──────┴───────┘│
│  │             │                            ┌─────────────────────┐│
│  │             │                            │⚡ UNLEASH: TINDER   ││
│  │             │   [Unit A]  [Unit B]       ├─────────────────────┤│
│  │             │   [Unit C]  [Unit D]       │ Summon Power:       ││
│  └─────────────┴────────────────────────────│ • 55 dmg to all     ││
│                                              │ • Burn 50% (2t)     ││
│  [Abilities panel at bottom]                │                     ││
│                                              │ STAT CHANGES:       ││
│                                              │ Lost Bonuses:       ││
│                                              │ • Flint: -6 ATK     ││
│                                              │ • Fizz: -5 SPD      ││
│                                              │ Total: -6 ATK, -5SPD││
│                                              │                     ││
│                                              │ ABILITIES LOCKED:   ││
│                                              │ ❌ Fireball         ││
│                                              │ ❌ Spark Strike     ││
│                                              │                     ││
│                                              │ RECOVERY: 3 turns   ││
│                                              │                     ││
│                                              │ ⚠️ Team weakened!   ││
│                                              │                     ││
│                                              │ [CONFIRM] [CANCEL]  ││
│                                              └─────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Layer Breakdowns

### Layer 1: Djinn Icons (Collapsed)

```
┌─────────────────┐
│ DJINN:          │
│ [🔥] [💨] [💧]  │
│  ↑    ↑    ↑   │
│  │    │    │   │
│  │    │    └─ Mercury - Standby (dimmed, with timer overlay)
│  │    └────── Jupiter - Active (bright, ready)
│  └─────────── Mars - Active (bright, ready)
└─────────────────┘
```

**Visual States:**
- **Active (Set):** Bright color, no overlay
  - `[🔥]` - Bright red/orange
- **Standby:** Dimmed, with turn counter
  - `[🔥₂]` - Dimmed with "2" overlay (returns in 2 turns)
- **Recovery:** Very dim, locked icon
  - `[🔥🔒]` - Very dim with lock

**Interaction:**
- Click/Hover to expand Layer 2

---

### Layer 2: Summon Options (3 Columns)

#### Column 1: Single Djinn Summons

```
┌─────────────────────┐
│ SINGLE (1 Djinn)    │
├─────────────────────┤
│                     │
│ 🔥 Flint            │
│ ─────────────       │
│ Element: Mars       │
│ Power: 25           │
│ Target: Single      │
│ Status: Active ✓    │
│                     │
│ [Hover for effects] │
├─────────────────────┤
│ 💨 Fizz             │
│ ─────────────       │
│ Element: Jupiter    │
│ Power: 22           │
│ Target: Single      │
│ Status: Active ✓    │
│                     │
│ [Hover for effects] │
├─────────────────────┤
│ 💧 Sleet            │
│ ─────────────       │
│ Element: Mercury    │
│ Power: 20           │
│ Target: Single      │
│ Status: Standby 🔒  │
│ (Returns in 2)      │
│                     │
│ [UNAVAILABLE]       │
└─────────────────────┘
```

#### Column 2: Double Djinn Summons

```
┌─────────────────────┐
│ DOUBLE (2 Djinn)    │
├─────────────────────┤
│                     │
│ 🔥💨 Tinder         │
│ ─────────────       │
│ Elements: Fire+Wind │
│ Power: 55           │
│ Target: All Enemies │
│ Uses: Flint + Fizz  │
│ Status: 2 Active ✓  │
│                     │
│ [Hover for effects] │
├─────────────────────┤
│ 💨💧 Breeze         │
│ ─────────────       │
│ Elements: Wind+Water│
│ Power: 50           │
│ Target: All Enemies │
│ Uses: Fizz + Sleet  │
│ Status: Need Sleet🔒│
│                     │
│ [UNAVAILABLE]       │
├─────────────────────┤
│ 🔥💧 Steam          │
│ ─────────────       │
│ Elements: Fire+Water│
│ Power: 52           │
│ Target: Single      │
│ Uses: Flint + Sleet │
│ Status: Need Sleet🔒│
│                     │
│ [UNAVAILABLE]       │
└─────────────────────┘
```

#### Column 3: Triple Djinn Summons

```
┌─────────────────────┐
│ TRIPLE (3 Djinn)    │
├─────────────────────┤
│                     │
│ 🔥💨💧 Gaia         │
│ ─────────────       │
│ Elements: Tri-Elem  │
│ Power: 100          │
│ Target: All Enemies │
│ Uses: All 3 Djinn   │
│ Status: Need Sleet🔒│
│                     │
│ Additional Effect:  │
│ • +15 ATK to team   │
│ • +10 DEF to team   │
│ • Duration: 3 turns │
│                     │
│ [UNAVAILABLE]       │
│                     │
│                     │
│                     │
│                     │
│                     │
│                     │
│                     │
└─────────────────────┘
```

---

### Layer 3: Effects Panel (Detailed Breakdown)

#### Section 1: Summon Power

```
┌──────────────────────────────────────────────┐
│ ⚡ UNLEASH EFFECTS: TINDER (🔥💨)            │
├──────────────────────────────────────────────┤
│                                              │
│ Summon Attack:                               │
│ ───────────────                              │
│ • Damage: 55 (Fire + Wind)                   │
│ • Target: All Enemies                        │
│ • Hit Count: 2 (chain)                       │
│                                              │
│ Status Effects:                              │
│ • Burn: 50% chance, 2 turns, 10 dmg/turn    │
│ • Wind Pressure: -5 SPD for 2 turns         │
│                                              │
│ Elemental Advantages:                        │
│ • Strong vs Jupiter/Venus enemies (1.5×)    │
│ • Weak vs Mercury enemies (0.67×)           │
└──────────────────────────────────────────────┘
```

#### Section 2: Stat Changes (What You Lose)

```
┌──────────────────────────────────────────────┐
│ ═══════════════════════════════════════════  │
│ ⚠️ STAT CHANGES (While Djinn in Standby):   │
│ ═══════════════════════════════════════════  │
│                                              │
│ Lost Passive Bonuses:                        │
│ ───────────────────────                      │
│                                              │
│ From Flint (Mars):                           │
│ • -6 ATK                                     │
│ • -4 DEF                                     │
│                                              │
│ From Fizz (Jupiter):                         │
│ • -5 SPD                                     │
│ • +0 MAG (no bonus lost)                     │
│                                              │
│ ─────────────────────────────────────────    │
│ TOTAL STAT LOSS: -6 ATK, -4 DEF, -5 SPD     │
│ ─────────────────────────────────────────    │
│                                              │
│ Affects all units with these Djinn equipped │
└──────────────────────────────────────────────┘
```

#### Section 3: Abilities Locked (What You Can't Use)

```
┌──────────────────────────────────────────────┐
│ ═══════════════════════════════════════════  │
│ ❌ ABILITIES LOCKED (While in Standby):      │
│ ═══════════════════════════════════════════  │
│                                              │
│ Garet will LOSE access to:                   │
│ ───────────────────────────                  │
│                                              │
│ ❌ Fireball [2○]                             │
│    Reason: Requires Flint (Active)           │
│    Granted by: Flint Djinn                   │
│                                              │
│ ❌ Inferno [3○]                              │
│    Reason: Requires Flint (Active)           │
│    Granted by: Flint Djinn                   │
│                                              │
│ Mia will LOSE access to:                     │
│ ───────────────────────────                  │
│                                              │
│ ❌ Spark Strike [2○]                         │
│    Reason: Requires Fizz (Active)            │
│    Granted by: Fizz Djinn                    │
│                                              │
│ ❌ Lightning Bolt [3○]                       │
│    Reason: Requires Fizz (Active)            │
│    Granted by: Fizz Djinn                    │
│                                              │
│ ⚠️ These abilities return when Djinn recover │
└──────────────────────────────────────────────┘
```

#### Section 4: Recovery & Warning

```
┌──────────────────────────────────────────────┐
│ ═══════════════════════════════════════════  │
│ ⏱️ RECOVERY TIME:                            │
│ ═══════════════════════════════════════════  │
│                                              │
│ Both Djinn will be in Standby mode after use│
│                                              │
│ Recovery Schedule:                           │
│ • Turn 1 (after summon): Standby             │
│ • Turn 2: Standby                            │
│ • Turn 3: Standby                            │
│ • Turn 4: Return to Set (Active)             │
│                                              │
│ During Standby:                              │
│ • Cannot be used for summons                 │
│ • No passive stat bonuses                    │
│ • Granted abilities unavailable              │
│                                              │
│ ─────────────────────────────────────────    │
│ ⚠️ WARNING:                                  │
│ Your team will be significantly WEAKENED     │
│ while these Djinn recover!                   │
│                                              │
│ Consider:                                    │
│ • Use summons as finishers                   │
│ • Have backup abilities ready                │
│ • Don't summon if battle may last long       │
│ ─────────────────────────────────────────    │
│                                              │
│ [CONFIRM SUMMON] [CANCEL]                    │
└──────────────────────────────────────────────┘
```

---

## CSS Positioning

### Fixed Top-Right Position

```css
.djinn-menu-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000; /* Above battlefield but below modals */
}

/* Layer 1: Icon bar */
.djinn-icons {
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border: 2px solid #444;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

/* Layer 2: Summon options */
.djinn-summon-options {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border: 2px solid #444;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  min-width: 600px;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: opacity 200ms, transform 200ms;
}

.djinn-icons:hover + .djinn-summon-options,
.djinn-summon-options:hover {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}

/* Layer 3: Effects panel */
.djinn-effects-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border: 2px solid #666;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7);
  min-width: 500px;
  max-height: 600px;
  overflow-y: auto;
  opacity: 0;
  transform: translateY(-10px);
  pointer-events: none;
  transition: opacity 200ms, transform 200ms;
}

.summon-option:hover + .djinn-effects-panel,
.djinn-effects-panel:hover {
  opacity: 1;
  transform: translateY(0);
  pointer-events: all;
}
```

---

## React Component Structure

```typescript
interface DjinnMenuProps {
  djinn: Djinn[];
  onSummon: (summonType: 'single' | 'double' | 'triple', djinnIds: string[]) => void;
}

export function DjinnMenu({ djinn, onSummon }: DjinnMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredSummon, setHoveredSummon] = useState<SummonOption | null>(null);

  const singleSummons = calculateSingleSummons(djinn);
  const doubleSummons = calculateDoubleSummons(djinn);
  const tripleSummons = calculateTripleSummons(djinn);

  return (
    <div className="djinn-menu-container">
      {/* Layer 1: Icons */}
      <div 
        className="djinn-icons"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <span>DJINN:</span>
        {djinn.map(d => (
          <DjinnIcon key={d.id} djinn={d} />
        ))}
      </div>

      {/* Layer 2: Summon Options */}
      {isOpen && (
        <div className="djinn-summon-options">
          {/* Column 1: Single */}
          <div className="summon-column">
            <h3>SINGLE (1 Djinn)</h3>
            {singleSummons.map(summon => (
              <SummonOption
                key={summon.id}
                summon={summon}
                onHover={setHoveredSummon}
                onSelect={() => onSummon('single', [summon.djinnId])}
              />
            ))}
          </div>

          {/* Column 2: Double */}
          <div className="summon-column">
            <h3>DOUBLE (2 Djinn)</h3>
            {doubleSummons.map(summon => (
              <SummonOption
                key={summon.id}
                summon={summon}
                onHover={setHoveredSummon}
                onSelect={() => onSummon('double', summon.djinnIds)}
              />
            ))}
          </div>

          {/* Column 3: Triple */}
          <div className="summon-column">
            <h3>TRIPLE (3 Djinn)</h3>
            {tripleSummons.map(summon => (
              <SummonOption
                key={summon.id}
                summon={summon}
                onHover={setHoveredSummon}
                onSelect={() => onSummon('triple', summon.djinnIds)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Layer 3: Effects Panel */}
      {hoveredSummon && (
        <DjinnEffectsPanel
          summon={hoveredSummon}
          djinn={djinn}
          team={team} // Pass current team for ability/stat calculations
          onConfirm={() => handleConfirmSummon(hoveredSummon)}
          onCancel={() => setHoveredSummon(null)}
        />
      )}
    </div>
  );
}
```

---

## Effects Panel Component

```typescript
interface DjinnEffectsPanelProps {
  summon: SummonOption;
  djinn: Djinn[];
  team: Team;
  onConfirm: () => void;
  onCancel: () => void;
}

function DjinnEffectsPanel({ summon, djinn, team, onConfirm, onCancel }: DjinnEffectsPanelProps) {
  const usedDjinn = djinn.filter(d => summon.djinnIds.includes(d.id));
  const statChanges = calculateStatLoss(usedDjinn, team);
  const lockedAbilities = calculateLockedAbilities(usedDjinn, team);

  return (
    <div className="djinn-effects-panel">
      {/* Section 1: Summon Power */}
      <section className="summon-power">
        <h3>⚡ UNLEASH EFFECTS: {summon.name}</h3>
        <div className="summon-attack">
          <h4>Summon Attack:</h4>
          <ul>
            <li>Damage: {summon.power} ({summon.elements.join(' + ')})</li>
            <li>Target: {summon.target}</li>
            {summon.hitCount > 1 && <li>Hit Count: {summon.hitCount}</li>}
          </ul>
        </div>
        {summon.statusEffects && (
          <div className="status-effects">
            <h4>Status Effects:</h4>
            <ul>
              {summon.statusEffects.map(effect => (
                <li key={effect.type}>
                  {effect.type}: {effect.chance * 100}% chance, 
                  {effect.duration} turns
                  {effect.damagePerTurn && `, ${effect.damagePerTurn} dmg/turn`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <hr />

      {/* Section 2: Stat Changes */}
      <section className="stat-changes">
        <h3>⚠️ STAT CHANGES (While Djinn in Standby):</h3>
        <div className="lost-bonuses">
          <h4>Lost Passive Bonuses:</h4>
          {usedDjinn.map(d => (
            <div key={d.id} className="djinn-stat-loss">
              <strong>From {d.name} ({d.element}):</strong>
              <ul>
                {d.statBonus.atk !== 0 && <li>{d.statBonus.atk > 0 ? '-' : '+'}{Math.abs(d.statBonus.atk)} ATK</li>}
                {d.statBonus.def !== 0 && <li>{d.statBonus.def > 0 ? '-' : '+'}{Math.abs(d.statBonus.def)} DEF</li>}
                {d.statBonus.spd !== 0 && <li>{d.statBonus.spd > 0 ? '-' : '+'}{Math.abs(d.statBonus.spd)} SPD</li>}
                {d.statBonus.mag !== 0 && <li>{d.statBonus.mag > 0 ? '-' : '+'}{Math.abs(d.statBonus.mag)} MAG</li>}
              </ul>
            </div>
          ))}
          <div className="total-loss">
            <strong>TOTAL STAT LOSS:</strong> {formatStatChanges(statChanges)}
          </div>
        </div>
        <p className="affects-note">Affects all units with these Djinn equipped</p>
      </section>

      <hr />

      {/* Section 3: Abilities Locked */}
      <section className="abilities-locked">
        <h3>❌ ABILITIES LOCKED (While in Standby):</h3>
        {Object.entries(lockedAbilities).map(([unitName, abilities]) => (
          <div key={unitName} className="unit-locked-abilities">
            <h4>{unitName} will LOSE access to:</h4>
            <ul>
              {abilities.map(ability => (
                <li key={ability.id}>
                  ❌ {ability.name} [{ability.manaCost}○]
                  <br />
                  <small>Reason: Requires {ability.grantedBy} (Active)</small>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="recovery-note">⚠️ These abilities return when Djinn recover</p>
      </section>

      <hr />

      {/* Section 4: Recovery & Warning */}
      <section className="recovery-warning">
        <h3>⏱️ RECOVERY TIME:</h3>
        <p>Both Djinn will be in Standby mode after use</p>
        <div className="recovery-schedule">
          <h4>Recovery Schedule:</h4>
          <ul>
            <li>Turn 1 (after summon): Standby</li>
            <li>Turn 2: Standby</li>
            <li>Turn 3: Standby</li>
            <li>Turn 4: Return to Set (Active)</li>
          </ul>
        </div>
        <div className="during-standby">
          <h4>During Standby:</h4>
          <ul>
            <li>Cannot be used for summons</li>
            <li>No passive stat bonuses</li>
            <li>Granted abilities unavailable</li>
          </ul>
        </div>
        <div className="warning-box">
          <h4>⚠️ WARNING:</h4>
          <p>Your team will be significantly WEAKENED while these Djinn recover!</p>
          <h5>Consider:</h5>
          <ul>
            <li>Use summons as finishers</li>
            <li>Have backup abilities ready</li>
            <li>Don't summon if battle may last long</li>
          </ul>
        </div>
      </section>

      <div className="action-buttons">
        <button className="confirm-button" onClick={onConfirm}>
          CONFIRM SUMMON
        </button>
        <button className="cancel-button" onClick={onCancel}>
          CANCEL
        </button>
      </div>
    </div>
  );
}
```

---

## Summary

**Layer 1 (Collapsed):** Djinn icons only, top-right corner  
**Layer 2 (Dropdown):** 3 columns (Single/Double/Triple summons), expands down  
**Layer 3 (Effects):** Comprehensive breakdown, expands below Layer 2

**Sections in Effects Panel:**
1. ⚡ **Summon Power** - What the summon does
2. ⚠️ **Stat Changes** - What passive bonuses you lose
3. ❌ **Abilities Locked** - What abilities become unavailable
4. ⏱️ **Recovery & Warning** - When Djinn return, strategic advice

**Implementation Checklist:**
- [ ] Create floating Djinn menu (top-right)
- [ ] Add Layer 2 (3-column summon options)
- [ ] Calculate available summons based on Djinn states
- [ ] Add Layer 3 (effects panel on hover)
- [ ] Calculate stat losses from Djinn passives
- [ ] Calculate locked abilities from Djinn
- [ ] Add recovery time display
- [ ] Add confirm/cancel buttons
- [ ] Wire to battle service for summon execution

---

**Next:** Begin implementation of cascading Djinn menu system?
