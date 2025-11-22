# Battle Screen Redesign Audit

**Date:** 2025-01-XX  
**Purpose:** Assess current battle screen implementation and plan comprehensive layout redesign

---

## Current State Assessment

### Active Battle View Component

**Primary Component:** `src/ui/components/QueueBattleView.tsx`
- Queue-based battle system (planning → execution phases)
- Current layout: Vertical stack
  1. Top bar: Mana circles + Djinn bar
  2. Middle: Battlefield (enemies left, player units right)
  3. Bottom: Action queue panel + Command panel (side-by-side)

**Secondary Component:** `src/ui/components/BattleView.tsx`
- Older turn-based system (may be deprecated)
- Uses `TurnOrderStrip`, `ActionBar`, `BattleLog`

### Current Layout Structure

```
┌─────────────────────────────────────────┐
│  Mana Circles Bar  |  Djinn Bar        │ ← Top bar (horizontal)
├─────────────────────────────────────────┤
│                                         │
│  Enemies          Player Team           │ ← Battlefield (side-by-side)
│  [UnitCard]       [UnitCard]            │
│  [UnitCard]       [UnitCard]            │
│                                         │
├─────────────────────────────────────────┤
│  Action Queue  |  Command Panel         │ ← Bottom (side-by-side)
│  [Queue slots]  |  [Abilities list]     │
└─────────────────────────────────────────┘
```

### Current Ability Display

**Location:** `QueueBattleView.tsx` lines 371-415

**Current Implementation:**
- Simple button list with ability name and mana cost
- Format: `{ability.name} [{manaCost}○]`
- Example: `"Fireball [2○]"`, `"Heal [1○]"`
- No detailed information shown
- Locked Djinn abilities shown separately with reason

**Available Ability Data** (from `AbilitySchema.ts`):
- ✅ `id`, `name`, `type`, `element`
- ✅ `manaCost`, `basePower`
- ✅ `targets` (single-enemy, all-enemies, etc.)
- ✅ `description`
- ✅ `buffEffect`, `debuffEffect`, `statusEffect`
- ✅ `duration`, `hitCount`, `chainDamage`
- ✅ `ignoreDefensePercent`, `splashDamagePercent`
- ✅ `shieldCharges`, `healOverTime`
- ✅ `removeStatusEffects`, `damageReductionPercent`
- ✅ `elementalResistance`, `grantImmunity`

**Existing Detailed Component:** `src/ui/components/battle/AbilityPanel.tsx`
- Shows ability icon, name, mana cost, source label, description
- Separates core abilities vs Djinn-granted abilities
- Shows locked state with reason
- **Not currently used in QueueBattleView** (different system)

---

## Desired Layout

### Target Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         LARGE VISUAL WINDOW (Top Center)                    │
│         Units, Enemies, Animations                         │
│                                                             │
│         Mana Status | Djinn Activity                       │
├─────────────────────┬───────────────────┬──────────────────┤
│                     │                   │                   │
│  LEFT SIDE          │   VISUAL AREA     │   RIGHT SIDE      │
│  Character          │   (continued)     │   Turn Order      │
│  Portraits +        │                   │   Display         │
│  Health/Status      │                   │                   │
│                     │                   │                   │
│  [Portrait]         │                   │   [Turn 1]        │
│  [HP Bar]           │                   │   [Turn 2]        │
│  [Status]           │                   │   [Turn 3]        │
│                     │                   │   ...             │
│  [Portrait]         │                   │                   │
│  [HP Bar]           │                   │                   │
│  [Status]           │                   │                   │
│                     │                   │                   │
├─────────────────────┴───────────────────┴──────────────────┤
│                                                             │
│         BOTTOM: ACTION WINDOW                                │
│         Comprehensive Ability Details                        │
│         [Ability cards with full info]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Requirements

1. **Large Visual Window (Top)**
   - Units and enemies positioned for animations
   - Space for future animation system
   - Should be prominent focal point

2. **Mana & Djinn Status**
   - Near top (above or integrated with visual area)
   - Current: `ManaCirclesBar` + `DjinnBar` components exist

3. **Left Side Panel: Character Portraits**
   - Portrait sprites (via `getPortraitSprite()`)
   - Health bars
   - Status effects
   - Current: `UnitCard` component exists but uses sprites, not portraits
   - Portrait mapping: `src/ui/sprites/mappings/portraits.ts`

4. **Right Side Panel: Turn Order**
   - Current: `TurnOrderStrip` exists but simple
   - Needs enhancement for vertical display

5. **Bottom Panel: Comprehensive Ability Details**
   - **Current gap:** Only shows name + mana cost
   - **Required:** Full ability information display
   - Should show:
     - Ability icon
     - Name, type, element
     - Mana cost
     - Base power
     - Target type
     - Description
     - Special effects (buffs, debuffs, status)
     - Duration, hit count, etc.

---

## Component Inventory

### Existing Components (Can Reuse)

| Component | Location | Status | Notes |
|-----------|----------|--------|-------|
| `ManaCirclesBar` | `src/ui/components/ManaCirclesBar.tsx` | ✅ Ready | Shows mana circles |
| `DjinnBar` | `src/ui/components/DjinnBar.tsx` | ✅ Ready | Shows Djinn states |
| `UnitCard` | `src/ui/components/UnitCard.tsx` | ⚠️ Needs mod | Uses sprites, not portraits |
| `battle/UnitCard` | `src/ui/components/battle/UnitCard.tsx` | ✅ Ready | Uses portraits, has HP/status |
| `TurnOrderStrip` | `src/ui/components/TurnOrderStrip.tsx` | ⚠️ Needs mod | Simple horizontal strip |
| `AbilityPanel` | `src/ui/components/battle/AbilityPanel.tsx` | ✅ Ready | Detailed ability display |
| `ActionQueuePanel` | `src/ui/components/ActionQueuePanel.tsx` | ✅ Ready | Queue display |
| `BattleLog` | `src/ui/components/BattleLog.tsx` | ✅ Ready | Event log |

### Missing/Needs Creation

1. **Portrait-based Unit Panel** (Left Side)
   - New component or modify `battle/UnitCard`
   - Vertical list of portraits with HP/status
   - Uses `getPortraitSprite()` from `portraits.ts`

2. **Enhanced Turn Order Panel** (Right Side)
   - Vertical display
   - Shows upcoming turns clearly
   - May need to enhance `TurnOrderStrip` or create new

3. **Comprehensive Ability Card Component**
   - Detailed ability information display
   - Can base on `AbilityPanel` but needs more detail
   - Should show all relevant stats/effects

4. **Battlefield Visual Area**
   - Large central area for units/enemies
   - Positioned for animations
   - May need new component or enhance existing

---

## Data Availability

### Ability Information Available

All ability data is available via:
- `ABILITIES` from `src/data/definitions/abilities.ts`
- `DJINN_ABILITIES` from `src/data/definitions/djinnAbilities.ts`
- Type: `Ability` from `src/data/schemas/AbilitySchema.ts`

**Key Fields for Display:**
```typescript
{
  id: string;
  name: string;
  type: 'physical' | 'psynergy' | 'healing' | 'buff' | 'debuff' | 'summon';
  element?: 'Venus' | 'Mars' | 'Jupiter' | 'Mercury' | 'Neutral';
  manaCost: number;        // 0-5
  basePower: number;       // Damage/healing amount
  targets: 'single-enemy' | 'all-enemies' | 'single-ally' | 'all-allies' | 'self';
  description: string;
  
  // Optional effects
  buffEffect?: { atk?, def?, mag?, spd? };
  debuffEffect?: { atk?, def?, mag?, spd?, hp? };
  statusEffect?: { type, duration, chance? };
  duration?: number;
  hitCount?: number;
  chainDamage?: boolean;
  ignoreDefensePercent?: number;
  splashDamagePercent?: number;
  shieldCharges?: number;
  healOverTime?: { amount, duration };
  revive?: boolean;
  reviveHPPercent?: number;
  removeStatusEffects?: {...};
  damageReductionPercent?: number;
  elementalResistance?: {...};
  grantImmunity?: {...};
}
```

### Portrait Mapping Available

- Function: `getPortraitSprite(unitId: string)` from `src/ui/sprites/mappings/portraits.ts`
- Maps unit IDs to portrait sprite IDs
- Fallback: 'isaac1' if not found

### Current Battle State Access

Via Zustand store (`useStore`):
- `battle: BattleState` - Full battle state
- `battle.playerTeam.units` - Player units
- `battle.enemies` - Enemy units
- `battle.turnOrder` - Turn order array
- `battle.currentActorIndex` - Current turn
- `battle.remainingMana`, `battle.maxMana` - Mana pool
- `battle.queuedActions` - Queued actions (planning phase)
- `battle.phase` - 'planning' | 'executing' | 'victory' | 'defeat'

---

## Implementation Plan

### Phase 1: Layout Restructure

1. **Create new layout grid structure**
   - Top: Visual area (large)
   - Middle row: Left (portraits) | Center (visual) | Right (turn order)
   - Bottom: Action window (full width)

2. **Reposition existing components**
   - Move Mana/Djinn bars to top of visual area
   - Extract portrait panel from UnitCard
   - Enhance TurnOrderStrip for vertical display

### Phase 2: Component Enhancements

1. **Portrait Panel Component** (Left)
   - Create `PortraitPanel.tsx` or enhance `battle/UnitCard`
   - Vertical list of player unit portraits
   - Show HP bar, status effects
   - Clickable for unit selection

2. **Turn Order Panel** (Right)
   - Enhance `TurnOrderStrip` or create `TurnOrderPanel.tsx`
   - Vertical display
   - Show upcoming turns clearly
   - Highlight current turn

3. **Ability Detail Cards** (Bottom)
   - Create `AbilityDetailCard.tsx`
   - Comprehensive information display
   - Icon, name, type, element
   - Mana cost, base power
   - Target type, description
   - All special effects listed
   - Visual formatting for readability

### Phase 3: Visual Polish

1. **Battlefield Visual Area**
   - Large central area
   - Position units/enemies for animations
   - Background sprite support

2. **Styling**
   - Use existing `battle-screen.css` as base
   - Update grid layout
   - Ensure responsive design
   - Polish ability cards

---

## Files to Modify/Create

### Modify
- `src/ui/components/QueueBattleView.tsx` - Main layout restructure
- `src/ui/components/TurnOrderStrip.tsx` - Enhance for vertical display
- `src/ui/styles/battle-screen.css` - Update grid layout

### Create
- `src/ui/components/battle/PortraitPanel.tsx` - Left side portrait list
- `src/ui/components/battle/AbilityDetailCard.tsx` - Comprehensive ability display
- `src/ui/components/battle/BattlefieldVisual.tsx` - Large visual area component (optional)

### Reuse As-Is
- `src/ui/components/ManaCirclesBar.tsx`
- `src/ui/components/DjinnBar.tsx`
- `src/ui/components/battle/AbilityPanel.tsx` (may need minor updates)
- `src/ui/components/ActionQueuePanel.tsx`

---

## Questions/Considerations

1. **Which battle view is primary?**
   - `QueueBattleView.tsx` (queue-based) seems to be active
   - `BattleView.tsx` (turn-based) may be deprecated
   - **Action:** Confirm which system to use

2. **Ability selection flow**
   - Current: Select unit → Select ability → Select targets → Queue
   - New layout should maintain this flow
   - Ability details shown when ability selected?

3. **Visual area content**
   - Currently shows UnitCards in battlefield
   - Should this show larger sprites/animations?
   - **Action:** Define visual representation

4. **Turn order display**
   - Current: Simple horizontal strip
   - New: Vertical panel on right
   - How many turns ahead to show?

5. **Ability detail level**
   - How much information to show?
   - All fields or curated subset?
   - **Recommendation:** Show all relevant fields, format clearly

---

## Next Steps

1. ✅ **Audit Complete** - This document
2. ⏭️ **Confirm Layout** - Review with user
3. ⏭️ **Create Component Structure** - Set up new components
4. ⏭️ **Implement Layout** - Restructure QueueBattleView
5. ⏭️ **Enhance Components** - Add detailed ability display
6. ⏭️ **Polish & Test** - Visual polish and functionality testing

---

## References

- `src/ui/components/QueueBattleView.tsx` - Main battle view
- `src/data/schemas/AbilitySchema.ts` - Ability data structure
- `src/ui/components/battle/AbilityPanel.tsx` - Existing detailed ability component
- `src/ui/sprites/mappings/portraits.ts` - Portrait mapping
- `src/ui/styles/battle-screen.css` - Existing battle styles
- `docs/app/GAME_MECHANICS_FLOW.md` - Game flow documentation
