# Mana Circle System - UI Mockup

## Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│  MANA CIRCLES: ●●●●●●●○○○  (6/10 available)                   │
│                                                                │
│  [Enemy Sprites]     [Enemy Sprites]     [Enemy Sprites]       │
│       🧙                 🐺                  🦎               │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                    BATTLE FIELD                                │
│                                                                │
│                                                                │
│   [Your Party Sprites]                                         │
│   Isaac(HP:45/50)  Felix(HP:38/40)  Mia(HP:42/42)  Garet(HP:50/50) │
│    +2 mana         +3 mana          +2 mana         +3 mana    │
├────────────────────────────────────────────────────────────────┤
│ ACTION QUEUE                  │  COMMANDS (Isaac's Turn)       │
│ 40% width                     │  60% width                     │
│                               │                                │
│ 1. Isaac: METEOR [4○]         │  ┌─ ATTACK (0○) ─────────┐    │
│    → Target: Wolf             │  │ ┌─ ABILITIES ─────────┤    │
│                               │  │ │ Fireball      [2○]   │    │
│ 2. Felix: ????                │  │ │ Cure          [1○]   │    │
│                               │  │ │ Meteor        [4○]   │    │
│ 3. Mia: ????                  │  │ │ Ward          [2○]   │    │
│                               │  │ └─────────────────────┘│    │
│                               │  │ ┌─ DJINN ──────────────┤    │
│ 4. Garet: ????                │  │ │ Forge (Ready) [0○]   │    │
│                               │  │ │ Flash (CD:2)         │    │
│                               │  └─────────────────────────┘    │
│ [EXECUTE] (grayed out)        │  [← BACK] [TARGET →]           │
└────────────────────────────────────────────────────────────────┘
```

## After Queuing All 4 Actions

```
┌────────────────────────────────────────────────────────────────┐
│  MANA CIRCLES: ○○○○○○○○○○  (0/10 - all allocated)             │
│                                                                │
│  [Enemy Sprites]     [Enemy Sprites]     [Enemy Sprites]       │
│       🧙                 🐺                  🦎               │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                    BATTLE FIELD                                │
│                                                                │
│                                                                │
│   [Your Party Sprites]                                         │
│   Isaac(HP:45/50)  Felix(HP:38/40)  Mia(HP:42/42)  Garet(HP:50/50) │
├────────────────────────────────────────────────────────────────┤
│ ACTION QUEUE                  │  COMMANDS (All Set!)           │
│ 40% width                     │  60% width                     │
│                               │                                │
│ 1. Isaac: METEOR [4○]         │    READY TO EXECUTE            │
│    → Target: Wolf             │                                │
│                               │    Mana Used: 10/10            │
│ 2. Felix: CURE [1○]           │                                │
│    → Target: Isaac            │    • Isaac: Meteor (4)         │
│                               │    • Felix: Cure (1)           │
│ 3. Mia: ATTACK [0○]           │    • Mia: Attack (0)           │
│    → Target: Mage             │    • Garet: Ragnarok (5)       │
│                               │                                │
│ 4. Garet: RAGNAROK [5○]       │    ⚠️ OVER BUDGET!             │
│    → Target: Lizard           │    Need to adjust actions      │
│                               │                                │
│ [EXECUTE] (RED - over budget!)│  [EDIT] [CLEAR ALL]            │
└────────────────────────────────────────────────────────────────┘
```

## Budget Validation Example (Fixed)

```
┌────────────────────────────────────────────────────────────────┐
│  MANA CIRCLES: ○○○○○○○○○○  (0/10 - all allocated)             │
│                                                                │
│  [Enemy Sprites]     [Enemy Sprites]     [Enemy Sprites]       │
│       🧙                 🐺                  🦎               │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                    BATTLE FIELD                                │
│                                                                │
│   [Your Party Sprites]                                         │
│   Isaac(HP:45/50)  Felix(HP:38/40)  Mia(HP:42/42)  Garet(HP:50/50) │
├────────────────────────────────────────────────────────────────┤
│ ACTION QUEUE                  │  COMMANDS (All Set!)           │
│ 40% width                     │  60% width                     │
│                               │                                │
│ 1. Isaac: METEOR [4○]         │    ✓ READY TO EXECUTE          │
│    → Target: Wolf             │                                │
│                               │    Mana Used: 10/10            │
│ 2. Felix: CURE [1○]           │                                │
│    → Target: Isaac            │    Actions queued:             │
│                               │    • Isaac: Meteor (4)         │
│ 3. Mia: ATTACK [0○]           │    • Felix: Cure (1)           │
│    → Target: Mage             │    • Mia: Attack (0)           │
│                               │    • Garet: Earthquake (5)     │
│ 4. Garet: EARTHQUAKE [5○]     │                                │
│    → Target: All Enemies      │                                │
│                               │                                │
│ [EXECUTE] ✓ (GLOWING GREEN)   │  [EDIT] [CLEAR ALL]            │
└────────────────────────────────────────────────────────────────┘
```

## Execution Phase (Animated)

```
┌────────────────────────────────────────────────────────────────┐
│  MANA CIRCLES: ●●●●●●●●●●  (10/10 - REFRESHED!)               │
│                                                                │
│  [Enemy Sprites with damage numbers]                           │
│       🧙-45        🐺-78         🦎-52                        │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                    BATTLE FIELD                                │
│   (Abilities animating)                                        │
│                                                                │
│   [Your Party Sprites]                                         │
│   Isaac(HP:45/50)  Felix(HP:38/40)  Mia(HP:42/42)  Garet(HP:50/50) │
├────────────────────────────────────────────────────────────────┤
│                   COMBAT LOG (100% width)                      │
│                                                                │
│  Turn 3 - Execution Phase                                      │
│  ───────────────────────────────────────────────────────       │
│  → Isaac casts METEOR on Wolf!                                 │
│     Wolf takes 78 damage!                                      │
│                                                                │
│  → Felix casts CURE on Isaac!                                  │
│     Isaac recovers 15 HP!                                      │
│                                                                │
│  → Mia attacks Mage!                                           │
│     Mage takes 22 damage!                                      │
│                                                                │
│  → Garet casts EARTHQUAKE on all enemies!                      │
│     Mage takes 45 damage!                                      │
│     Wolf takes 32 damage! (Wolf defeated!)                     │
│     Lizard takes 52 damage!                                    │
│                                                                │
│  [Enemy Turn...]                                               │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Mana Circle Visual Design

### Option A: Top Bar (Horizontal)
```
TEAM MANA: ●●●●●●●○○○  (6/10 available)
```

### Option B: Vertical Side Panel
```
┌─────┐
│  M  │
│  A  │
│  N  │
│  A  │
│     │
│  ●  │ 10
│  ●  │ 9
│  ●  │ 8
│  ●  │ 7
│  ●  │ 6
│  ●  │ 5
│  ○  │ 4
│  ○  │ 3
│  ○  │ 2
│  ○  │ 1
└─────┘
```

### Option C: Compact Circles with Numbers
```
MANA: ●●●●●●●○○○ 7/10
```

## Ability Cost Display

```
┌─ ABILITIES ──────────────┐
│ Fireball      [2○]  ←──  │ Cost shown as circles
│ Cure          [1○]       │
│ Meteor        [4○○○○]    │ Or filled circles
│ Ward          [2○]       │
│ Ragnarok      [5○] (!)   │ Red if can't afford
└──────────────────────────┘
```

## Unit Contribution Display

During team setup or character info:
```
┌─ ISAAC ──────────────────┐
│ HP: 50/50                │
│ Class: Squire            │
│ Mana Contribution: +2○   │  ← Shows base contribution
│                          │
│ Equipment:               │
│  Weapon: Sol Blade (+1○) │  ← Items can add mana
│  Armor: Dragon Mail      │
│  Helm: --                │
│                          │
│ Total Contribution: +3○  │
└──────────────────────────┘
```

## Example Team Compositions

### Balanced Team (8 mana)
- Isaac (Squire): +2○
- Felix (Warrior): +2○
- Mia (Healer): +2○
- Garet (Tank): +2○
- **Total: 8○** - Can afford one 4-cost spell + several 1-2 cost

### Glass Cannon Team (12 mana)
- Isaac (Sage): +3○
- Felix (Mage): +4○
- Mia (Priest): +3○
- Garet (Pyromancer): +2○
- **Total: 12○** - Can spam multiple big spells, but squishy

### Tank Team (5 mana)
- Four heavy armor units at +1○ each
- **Total: 5○** - Limited abilities, relies on basic attacks

## Tactical Examples

### Turn 1: Aggressive Opener (10 mana total)
```
1. Isaac: METEOR [4○] → Boss
2. Felix: ATTACK [0○] → Adds
3. Mia: WARD [2○] → Team (defense buff)
4. Garet: EARTHQUAKE [4○] → All enemies
Total: 10○ used ✓
```

### Turn 2: Recovery Turn (10 mana total)
```
1. Isaac: ATTACK [0○] → Boss
2. Felix: ATTACK [0○] → Boss
3. Mia: CURE [1○] → Isaac
4. Garet: HEAL WAVE [3○] → All allies
Total: 4○ used (6○ wasted - sometimes you don't need all mana!)
```

### Turn 3: Impossible Choice (10 mana total)
```
Want: METEOR [4○] + RAGNAROK [5○] + CURE [1○] = 10○
But only 4 units, so must choose:
- Big damage: Meteor + Ragnarok + 2 attacks (0○)
- Sustainable: Meteor + Cure + smaller spells (2○ abilities)
```

## Implementation Notes

### Data Structure
```typescript
interface Unit {
  // ... existing fields
  manaContribution: number; // Base mana circles this unit provides
}

interface BattleState {
  // ... existing fields
  totalManaPool: number;      // Sum of all 4 units' contributions
  remainingMana: number;      // Decreases as actions queued
  queuedActions: QueuedAction[];
}

interface QueuedAction {
  unitId: string;
  abilityId: string | null;  // null = basic attack (0 cost)
  targetId: string;
  manaCost: number;
}

interface Ability {
  // ... existing fields
  manaCost: number;  // 0-4+ circles
}
```

### Validation Logic
```typescript
function canQueueAction(ability: Ability, remainingMana: number): boolean {
  return ability.manaCost <= remainingMana;
}

function isQueueComplete(): boolean {
  return queuedActions.length === 4 &&
         totalManaCost <= totalManaPool;
}
```

### Visual States
- **Available mana:** Filled circles (●) with bright color
- **Spent mana:** Empty circles (○) with dim color
- **Ability costs:** Show circles next to each ability
- **Over budget:** Red highlight on Execute button
- **Valid queue:** Green glow on Execute button
