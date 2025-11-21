# Unit Portrait Panel - Left Side Display

**Date:** 2025-11-21  
**Location:** Left side of battlefield (20% width)  
**Behavior:** Compact by default, expands on hover to show full stats

---

## Layout Overview

### Panel Position in Battle Screen

```
┌─────────────────────────────────────────────────────────────────────┐
│                                   [DJINN MENU - Top Right]          │
│                                                                     │
│  ┌─────────────┬────────────────────────────────┬──────────────┐   │
│  │             │                                │              │   │
│  │ PORTRAITS   │     BATTLEFIELD                │ Turn Order   │   │
│  │ (This!)     │                                │              │   │
│  │ ↓           │   [Enemy A]    [Enemy B]       │              │   │
│  │             │                                │              │   │
│  │ [Portrait]  │                                │              │   │
│  │ Isaac       │                                │              │   │
│  │ ████░░ 80%  │                                │              │   │
│  │             │   [Unit A]  [Unit B]           │              │   │
│  │ [Portrait]  │   [Unit C]  [Unit D]           │              │   │
│  │ Garet       │                                │              │   │
│  │ ██████ 100% │                                │              │   │
│  │             │                                │              │   │
│  │ [Portrait]  │                                │              │   │
│  │ Mia         │                                │              │   │
│  │ ████░░ 75%  │                                │              │   │
│  │ 🔥 Burn     │                                │              │   │
│  │             │                                │              │   │
│  │ [Portrait]  │                                │              │   │
│  │ Ivan        │                                │              │   │
│  │ ████░░ 60%  │                                │              │   │
│  └─────────────┴────────────────────────────────┴──────────────┘   │
│                                                                     │
│  [Abilities panel at bottom - 10% height]                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## State 1: Collapsed (Default)

### Minimal View - Normal State

```
┌─────────────────────┐
│ PARTY               │
├─────────────────────┤
│                     │
│ ┌─────────────────┐ │
│ │ [Portrait Img]  │ │
│ │ 64×64           │ │
│ └─────────────────┘ │
│ Isaac               │
│ Lv 5 | Venus        │
│ ████████░░ 80/100   │ ← HP bar with numbers
│                     │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ [Portrait Img]  │ │
│ └─────────────────┘ │
│ Garet               │
│ Lv 5 | Mars         │
│ ██████████ 100/100  │
│                     │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ [Portrait Img]  │ │
│ └─────────────────┘ │
│ Mia                 │
│ Lv 4 | Mercury      │
│ ████████░░ 75/100   │
│ 🔥 Burn (3t)        │ ← Status effect shown
│                     │
├─────────────────────┤
│ ┌─────────────────┐ │
│ │ [Portrait Img]  │ │
│ └─────────────────┘ │
│ Ivan                │
│ Lv 4 | Jupiter      │
│ ████░░░░░░ 40/100   │ ← Low HP (red bar)
│ ⚡ Paralyze (2t)    │
│                     │
└─────────────────────┘
```

**Features:**
- 64×64 portrait image
- Name + Level + Element
- HP bar with current/max values
- Status effects shown (if any)
- Compact layout

---

### Collapsed - KO'd State

```
┌─────────────────────┐
│ ┌─────────────────┐ │
│ │ [Portrait Img]  │ │ ← Grayed out
│ │ (Darkened)      │ │
│ └─────────────────┘ │
│ Ivan                │ ← Grayed text
│ Lv 4 | Jupiter      │
│ ░░░░░░░░░░ 0/100    │ ← Empty bar
│ 💀 KO               │ ← KO indicator
│                     │
└─────────────────────┘
```

---

## State 2: Expanded (On Hover)

### Full Stats Panel

```
┌────────────────────────────────────────┐
│ ╔════════════════════════════════════╗ │
│ ║ [Portrait Img]  ISAAC              ║ │
│ ║ 64×64          Level 5 | Venus     ║ │
│ ║                XP: 850 / 1850      ║ │
│ ║                (Next: 1000)        ║ │
│ ╚════════════════════════════════════╝ │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │ HP: ████████░░ 80 / 100          │   │
│ │ MP: N/A (Team Mana Pool)         │   │
│ └──────────────────────────────────┘   │
│                                        │
│ STATS (Current | Base + Equip + Djinn) │
│ ────────────────────────────────────   │
│ ATK: 52 | (40 + 8 + 4)                 │
│ DEF: 38 | (30 + 5 + 3)                 │
│ MAG: 25 | (20 + 0 + 5)                 │
│ SPD: 42 | (35 + 5 + 2)                 │
│ LUCK: 15                                │
│                                        │
│ EQUIPMENT                               │
│ ────────────────────────────────────   │
│ ⚔️ Long Sword (+8 ATK)                 │
│ 🛡️ Bronze Armor (+5 DEF, +10 HP)      │
│ 🪖 Iron Helm (+3 DEF)                  │
│ 👢 Speed Boots (+5 SPD)                │
│ 💍 Power Ring (+2 ATK)                 │
│                                        │
│ DJINN (Active)                          │
│ ────────────────────────────────────   │
│ 🌍 Flint: +6 ATK, +4 DEF               │
│                                        │
│ STATUS EFFECTS                          │
│ ────────────────────────────────────   │
│ ⬆️ ATK Buff: +12 (2 turns)            │
│ 🛡️ DEF Buff: +8 (2 turns)             │
│                                        │
│ RESISTANCES                             │
│ ────────────────────────────────────   │
│ Venus: 1.0× (Neutral)                   │
│ Mars: 1.5× (Weak)                       │
│ Mercury: 0.67× (Strong)                 │
│ Jupiter: 1.0× (Neutral)                 │
│                                        │
│ 👆 Click to select for action          │
└────────────────────────────────────────┘
```

---

### Expanded - With Debuffs & Status

```
┌────────────────────────────────────────┐
│ ╔════════════════════════════════════╗ │
│ ║ [Portrait Img]  MIA                ║ │
│ ║ (Slightly red)  Level 4 | Mercury  ║ │
│ ║                XP: 350 / 850       ║ │
│ ╚════════════════════════════════════╝ │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │ HP: ████████░░ 75 / 100          │   │
│ └──────────────────────────────────┘   │
│                                        │
│ STATS (Current | Base + Equip + Djinn) │
│ ────────────────────────────────────   │
│ ATK: 28 | (25 + 3 + 0)                 │
│ DEF: 32 | (28 + 4 + 0)                 │
│ MAG: 58 | (45 + 8 + 5)                 │
│ SPD: 38 | (35 + 3 + 0)                 │
│ LUCK: 18                                │
│                                        │
│ EQUIPMENT                               │
│ ────────────────────────────────────   │
│ ⚔️ Staff (+3 ATK, +8 MAG)              │
│ 🛡️ Cloth Robe (+4 DEF)                │
│ 👢 Leather Boots (+3 SPD)              │
│ 💍 Empty                                │
│ 📿 Empty                                │
│                                        │
│ DJINN (Active)                          │
│ ────────────────────────────────────   │
│ 💧 Sleet: +3 MAG, +2 DEF               │
│ 💧 Mist: +3 MAG, +2 DEF                │
│                                        │
│ STATUS EFFECTS                          │
│ ────────────────────────────────────   │
│ 🔥 Burn: 10 dmg/turn (3 turns left)    │ ← Red/orange
│ ⬇️ DEF Debuff: -6 (2 turns)           │ ← Red
│                                        │
│ RESISTANCES                             │
│ ────────────────────────────────────   │
│ Mercury: 1.0× (Neutral)                 │
│ Mars: 0.67× (Strong - Water resists)   │
│ Venus: 1.5× (Weak)                      │
│ Jupiter: 1.0× (Neutral)                 │
│                                        │
│ ⚠️ BURNING - taking damage each turn!  │
│                                        │
│ 👆 Click to select for action          │
└────────────────────────────────────────┘
```

---

### Expanded - KO'd Unit

```
┌────────────────────────────────────────┐
│ ╔════════════════════════════════════╗ │
│ ║ [Portrait Img]  IVAN               ║ │
│ ║ (Grayed out)    Level 4 | Jupiter  ║ │
│ ║                XP: 850 / 1850      ║ │
│ ╚════════════════════════════════════╝ │
│                                        │
│ ┌──────────────────────────────────┐   │
│ │ HP: ░░░░░░░░░░ 0 / 100           │   │
│ │ 💀 KNOCKED OUT                   │   │
│ └──────────────────────────────────┘   │
│                                        │
│ Unit is unable to act.                 │
│                                        │
│ Can be revived with:                   │
│ • Revive ability                       │
│ • Revive item                          │
│ • Auto-revive buff (if active)         │
│                                        │
│ ⚠️ Cannot select for actions           │
└────────────────────────────────────────┘
```

---

## Visual States & Color Coding

### HP Bar Colors

**High HP (>70%):** Green gradient
```
████████░░ 80/100  (Green bar)
```

**Medium HP (40-70%):** Yellow/Orange gradient
```
██████░░░░ 55/100  (Yellow bar)
```

**Low HP (<40%):** Red gradient
```
███░░░░░░░ 25/100  (Red bar, pulsing animation)
```

**Critical HP (<20%):** Flashing red
```
█░░░░░░░░░ 10/100  (Flashing red, urgent!)
```

**KO'd (0%):** Gray/empty
```
░░░░░░░░░░ 0/100   (Gray bar)
```

---

### Status Effect Icons

**Buffs (Positive - Green/Blue):**
- ⬆️ ATK Buff (Green)
- 🛡️ DEF Buff (Blue)
- ⚡ SPD Buff (Yellow)
- ✨ MAG Buff (Purple)
- 💫 Multi-buff (Rainbow)

**Debuffs (Negative - Red/Orange):**
- ⬇️ ATK Debuff (Red)
- 🔻 DEF Debuff (Dark red)
- 🐌 SPD Debuff (Gray)
- 🌫️ MAG Debuff (Dark purple)

**Status Effects (Colored):**
- 🔥 Burn (Orange/Red, animated fire)
- ☠️ Poison (Green/Purple)
- ❄️ Freeze (Light blue, frozen)
- ⚡ Paralyze (Yellow, electric)
- 😵 Stun (Gray, dizzy)
- 💀 KO (Black/Gray)

---

## Detailed Section Breakdowns

### Section 1: Header

```
╔════════════════════════════════════╗
║ [Portrait Img]  ISAAC              ║
║ 64×64          Level 5 | Venus     ║
║                XP: 850 / 1850      ║
║                (Next: 1000 XP)     ║
╚════════════════════════════════════╝
```

**Shows:**
- Portrait image (64×64)
- Name (large, bold)
- Level + Element
- Current XP / Next Level XP
- XP needed for next level

---

### Section 2: HP Display

```
┌──────────────────────────────────┐
│ HP: ████████░░ 80 / 100          │
│ MP: N/A (Team Mana Pool)         │
└──────────────────────────────────┘
```

**Shows:**
- Current HP / Max HP
- Visual HP bar (color-coded)
- MP note (team shares mana pool)

---

### Section 3: Stats Breakdown

```
STATS (Current | Base + Equip + Djinn)
────────────────────────────────────
ATK: 52 | (40 + 8 + 4)
DEF: 38 | (30 + 5 + 3)
MAG: 25 | (20 + 0 + 5)
SPD: 42 | (35 + 5 + 2)
LUCK: 15
```

**Shows:**
- Current effective stat
- Breakdown: Base + Equipment bonus + Djinn bonus
- Color-coded if buffed/debuffed:
  - Green number if buffed
  - Red number if debuffed

**Enhanced Version (with buffs/debuffs):**
```
ATK: 64 | (40 + 8 + 4) +12 🔺
     ↑ Green, shows buff active
DEF: 32 | (30 + 5 + 3) -6 🔻
     ↑ Red, shows debuff active
```

---

### Section 4: Equipment

```
EQUIPMENT
────────────────────────────────────
⚔️ Long Sword (+8 ATK)
🛡️ Bronze Armor (+5 DEF, +10 HP)
🪖 Iron Helm (+3 DEF)
👢 Speed Boots (+5 SPD)
💍 Power Ring (+2 ATK)
```

**Shows:**
- Equipped items (all 5 slots)
- Item name
- Stat bonuses from item
- Empty slots show "Empty" or "---"

---

### Section 5: Djinn

```
DJINN (Active)
────────────────────────────────────
🌍 Flint: +6 ATK, +4 DEF
💧 Sleet: +3 MAG, +2 DEF
```

**Shows:**
- Equipped Djinn (team-wide)
- Djinn name + element icon
- Passive stat bonuses
- State indicator:
  - "(Active)" - Green
  - "(Standby)" - Orange
  - "(Recovery)" - Red

**With Standby:**
```
DJINN
────────────────────────────────────
🌍 Flint (Standby - 2 turns): No bonus
💧 Sleet: +3 MAG, +2 DEF (Active)
```

---

### Section 6: Status Effects

```
STATUS EFFECTS
────────────────────────────────────
⬆️ ATK Buff: +12 (2 turns)
🛡️ DEF Buff: +8 (2 turns)
🔥 Burn: 10 dmg/turn (3 turns)
⬇️ DEF Debuff: -6 (1 turn)
```

**Shows:**
- All active buffs/debuffs/statuses
- Icon + Name
- Value (if applicable)
- Duration remaining
- Color-coded by type (buff/debuff/status)

**If no effects:**
```
STATUS EFFECTS
────────────────────────────────────
No active effects
```

---

### Section 7: Elemental Resistances

```
RESISTANCES
────────────────────────────────────
Venus: 1.0× (Neutral)
Mars: 1.5× (Weak) ⚠️
Mercury: 0.67× (Strong) ✓
Jupiter: 1.0× (Neutral)
```

**Shows:**
- Damage multiplier per element
- Label: Neutral / Weak / Strong
- Icon indicator:
  - ⚠️ Weak (red)
  - ✓ Strong (green)
  - ○ Neutral (white)

**Enhanced (with buff/equipment):**
```
RESISTANCES (Base + Equipment + Buffs)
────────────────────────────────────
Mars: 0.67× (Strong) ✓
  ↑ (Was Neutral, now Strong via Fire Shield buff)
```

---

### Section 8: Footer

```
👆 Click to select for action
```

or if KO'd:

```
⚠️ Cannot select - Unit is KO'd
```

or if paralyzed:

```
⚠️ Cannot act this turn - Paralyzed
```

---

## Animation & Interaction

### Hover Transition

```css
.unit-portrait-card {
  width: 100%;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* Collapsed state */
.unit-portrait-card {
  height: 120px; /* Just portrait + HP */
}

/* Expanded state (on hover) */
.unit-portrait-card:hover {
  height: auto; /* Expands to show all content */
  max-height: 600px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  z-index: 50;
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
  border: 2px solid #666;
}

/* Smooth content reveal */
.unit-portrait-card .expanded-content {
  opacity: 0;
  max-height: 0;
  transition: opacity 200ms, max-height 200ms;
}

.unit-portrait-card:hover .expanded-content {
  opacity: 1;
  max-height: 500px;
}
```

---

### Click Interaction

**When clicked:**
1. Unit is selected for action
2. Portrait gets selection border (glowing outline)
3. Abilities panel updates to show selected unit's abilities
4. Battlefield shows valid targets

```css
.unit-portrait-card.selected {
  border: 3px solid #4CAF50;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
}
```

---

### HP Bar Animation

**Damage taken:**
```css
@keyframes hp-decrease {
  0% { width: 80%; }
  20% { width: 78%; } /* Flash */
  100% { width: 75%; } /* New value */
}

/* Shake on critical hit */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

**Healing received:**
```css
@keyframes hp-increase {
  0% { width: 40%; }
  50% { width: 42%; } /* Flash green */
  100% { width: 60%; } /* New value */
}

.hp-bar-fill.healing {
  animation: hp-increase 400ms ease-out;
  filter: brightness(1.3); /* Flash bright */
}
```

---

### Low HP Warning

**Critical HP (<20%) - Pulsing red:**
```css
@keyframes low-hp-pulse {
  0%, 100% { 
    background: linear-gradient(90deg, #ff0000, #cc0000);
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  }
  50% { 
    background: linear-gradient(90deg, #ff3333, #ff0000);
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
  }
}

.hp-bar-fill.critical {
  animation: low-hp-pulse 1s infinite;
}

/* Portrait also pulses red */
.unit-portrait-card.critical {
  border-color: #ff0000;
  animation: border-pulse 1s infinite;
}
```

---

## Compact Mobile View

### Collapsed (Mobile)

```
┌───────────────┐
│ [Portrait]    │
│ Isaac Lv5     │
│ ████░░ 80/100 │
│ 🔥 Burn       │
└───────────────┘
```

### Expanded (Mobile - Full Screen Overlay)

```
┌─────────────────────────────────┐
│ [X Close]                       │
│                                 │
│ [Portrait]  ISAAC               │
│            Level 5 | Venus      │
│                                 │
│ HP: ████████░░ 80/100           │
│                                 │
│ STATS                           │
│ ATK: 52 | DEF: 38               │
│ MAG: 25 | SPD: 42               │
│                                 │
│ EQUIPMENT                       │
│ ⚔️ Long Sword (+8 ATK)          │
│ 🛡️ Bronze Armor (+5 DEF)       │
│ ...                             │
│                                 │
│ STATUS EFFECTS                  │
│ 🔥 Burn (3 turns)               │
│ ⬆️ ATK +12 (2 turns)           │
│                                 │
│ [SELECT FOR ACTION]             │
└─────────────────────────────────┘
```

---

## React Component Structure

```typescript
interface UnitPortraitCardProps {
  unit: Unit;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (unitId: string) => void;
  onHover: (unitId: string | null) => void;
}

export function UnitPortraitCard({ 
  unit, 
  isSelected, 
  isHovered,
  onSelect,
  onHover 
}: UnitPortraitCardProps) {
  const effectiveStats = calculateEffectiveStats(unit);
  const hpPercent = (unit.currentHp / effectiveStats.maxHp) * 100;
  const hpState = getHPState(hpPercent); // 'high' | 'medium' | 'low' | 'critical' | 'ko'
  const isKO = isUnitKO(unit);
  
  return (
    <div 
      className={`unit-portrait-card ${isSelected ? 'selected' : ''} ${hpState}`}
      onClick={() => !isKO && onSelect(unit.id)}
      onMouseEnter={() => onHover(unit.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Collapsed content (always visible) */}
      <div className="portrait-collapsed">
        <PortraitImage unitId={unit.id} isKO={isKO} />
        <div className="unit-name">{unit.name}</div>
        <div className="unit-level">Lv {unit.level} | {unit.element}</div>
        <HPBar current={unit.currentHp} max={effectiveStats.maxHp} state={hpState} />
        {unit.statusEffects.length > 0 && (
          <StatusEffectIcons effects={unit.statusEffects} limit={2} />
        )}
      </div>
      
      {/* Expanded content (visible on hover) */}
      {isHovered && (
        <div className="portrait-expanded">
          <UnitHeader unit={unit} effectiveStats={effectiveStats} />
          <StatsBreakdown unit={unit} effectiveStats={effectiveStats} />
          <EquipmentList unit={unit} />
          <DjinnList djinn={unit.djinn} />
          <StatusEffectsList effects={unit.statusEffects} />
          <ElementalResistances unit={unit} />
          <SelectPrompt isKO={isKO} />
        </div>
      )}
    </div>
  );
}
```

---

## Summary

### Collapsed State Shows:
- ✅ Portrait (64×64)
- ✅ Name, Level, Element
- ✅ HP bar + numbers
- ✅ Active status effects (up to 2 icons)

### Expanded State Shows:
- ✅ Everything from collapsed +
- ✅ XP progress
- ✅ Full stat breakdown (base + equip + djinn + buffs)
- ✅ Equipment list (all 5 slots)
- ✅ Djinn bonuses
- ✅ All status effects (with durations)
- ✅ Elemental resistances
- ✅ Selection prompt

### Interactive Features:
- ✅ Hover to expand
- ✅ Click to select for action
- ✅ HP bar color-coded by health
- ✅ Pulsing red when critical
- ✅ Grayed out when KO'd
- ✅ Smooth animations

---

Ready to implement the portrait panel system?
