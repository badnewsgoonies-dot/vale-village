# Battle Screen Expandable Layout System

**Date:** 2025-11-21  
**Concept:** Minimize menus by default, expand when interacting, maximize battlefield visibility

---

## Core Concept

**Default State:** Battlefield is LARGE, ability panel is SMALL (minimized)  
**Expanded State:** When selecting abilities, panel GROWS upward, battlefield SHRINKS  
**Collapsed State:** After queuing action, panel SHRINKS back down, battlefield GROWS again

**Goal:** Maximize visual battlefield space while providing detailed information on demand

---

## Layout States

### State 1: **COLLAPSED** (Default - Battlefield Focus)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MANA: ●●●●○ (4/5)  |  DJINN: [Flint] [Fizz]     │ ← 5%
├──────────────┬──────────────────────────────────────┬───────────────┤
│              │                                      │               │
│              │                                      │               │
│  Portraits   │                                      │  Turn Order   │
│              │                                      │               │
│  [Isaac]     │                                      │  1. Isaac →   │
│  ████░░ 80%  │                                      │  2. Goblin A  │
│              │       LARGE BATTLEFIELD              │  3. Garet     │
│  [Garet]     │                                      │  4. Goblin B  │ ← 70%
│  ██████ 100% │       [Enemy] [Enemy]                │  5. Mia       │
│              │                                      │  6. Goblin C  │
│  [Mia]       │                                      │               │
│  ████░░ 75%  │       (Animation Space)              │               │
│              │                                      │               │
│  [Ivan]      │       [Unit] [Unit] [Unit]           │               │
│  ████░░ 60%  │                                      │               │
│              │                                      │               │
├──────────────┴──────────────────────────────────────┴───────────────┤
│                                                                      │
│  ━━━━━━━━━━━━━━━━━━━━ BATTLE LOG ━━━━━━━━━━━━━━━━━━━━━━━━━         │
│  Isaac used Fireball on Goblin A → 45 damage!                       │
│  Goblin A attacked Isaac → 12 damage                                 │ ← 15%
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  📜 ACTIONS (Click unit to expand abilities)                         │
│  1. Isaac → Fireball → Goblin A [2○]                                │ ← 10%
│  2. Garet → [Select Action]  ← [👆 Click to Expand]                 │
│  3-4. [Empty]  |  Mana: 2/5  |  [EXECUTE ROUND]                     │
└──────────────────────────────────────────────────────────────────────┘
```

**Proportions:**
- **Mana/Djinn Bar:** 5%
- **Battlefield (with portraits/turn order):** 70%
- **Battle Log:** 15%
- **Action Queue (collapsed):** 10%

---

### State 2: **EXPANDED** (Ability Selection - Detail Focus)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MANA: ●●●●○ (4/5)  |  DJINN: [Flint] [Fizz]     │ ← 5%
├──────────────┬──────────────────────────────────────┬───────────────┤
│              │                                      │               │
│  Portraits   │      SMALLER BATTLEFIELD             │  Turn Order   │
│              │                                      │               │
│  [Isaac]     │      [Enemy] [Enemy]                 │  1. Isaac     │ ← 25%
│  ████░░ 80%  │                                      │  2. Goblin A  │
│  [Garet] ✓   │      [Unit] [Unit] [Unit]            │  3. Garet →   │
│  [Mia]       │                                      │  ...          │
│  [Ivan]      │                                      │               │
├──────────────┴──────────────────────────────────────┴───────────────┤
│  ╔══════════════════════════════════════════════════════════════╗  │
│  ║  SELECT ABILITY FOR GARET                                    ║  │
│  ╠══════════════════════════════════════════════════════════════╣  │
│  ║                                                              ║  │
│  ║  ┌─────────────────────────────────────────────────────┐    ║  │
│  ║  │ ⚔️ Attack                                [0○]       │    ║  │
│  ║  │ Physical | Single Enemy | Power: Uses ATK          │    ║  │
│  ║  │ Basic physical attack using unit's ATK stat        │    ║  │
│  ║  └─────────────────────────────────────────────────────┘    ║  │
│  ║                                                              ║  │
│  ║  ┌─────────────────────────────────────────────────────┐    ║  │
│  ║  │ 🔥 Fireball                             [2○] ← Selected │  │ ← 60%
│  ║  │ Mars Psynergy | Single Enemy | Power: 35           │    ║  │
│  ║  │ Launches a ball of fire at a single enemy          │    ║  │
│  ║  │ Effects: Burn (80% chance, 3 turns, 10 dmg/turn)   │    ║  │
│  ║  └─────────────────────────────────────────────────────┘    ║  │
│  ║                                                              ║  │
│  ║  ┌─────────────────────────────────────────────────────┐    ║  │
│  ║  │ 💚 Heal                                 [1○]        │    ║  │
│  ║  │ Healing | Single Ally | Power: 25                   │    ║  │
│  ║  │ Restores HP to an ally                              │    ║  │
│  ║  └─────────────────────────────────────────────────────┘    ║  │
│  ║                                                              ║  │
│  ║  [Scroll for more abilities...]                             ║  │
│  ║                                                              ║  │
│  ║  [SELECT TARGET] [CANCEL]                                   ║  │
│  ╚══════════════════════════════════════════════════════════════╝  │
├──────────────────────────────────────────────────────────────────────┤
│  📜 ACTION QUEUE (Minimized)                                         │
│  1. Isaac → Fireball → Goblin A [2○]   2. Garet → [Selecting...]    │ ← 10%
└──────────────────────────────────────────────────────────────────────┘
```

**Proportions:**
- **Mana/Djinn Bar:** 5%
- **Battlefield (shrunk):** 25%
- **Ability Panel (expanded):** 60%
- **Action Queue (minimized):** 10%

---

### State 3: **TARGET SELECTION** (After Ability Selected)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MANA: ●●●●○ (4/5)  |  DJINN: [Flint] [Fizz]     │ ← 5%
├──────────────┬──────────────────────────────────────┬───────────────┤
│              │                                      │               │
│  Portraits   │                                      │  Turn Order   │
│              │                                      │               │
│  [Isaac]     │                                      │  1. Isaac     │
│  ████░░ 80%  │      [Enemy A] 👆 ← Click to Target  │  2. Goblin A  │ ← 50%
│  [Garet] ✓   │      [Enemy B] 👆                    │  3. Garet →   │
│  [Mia]       │                                      │  ...          │
│  [Ivan]      │      [Unit] [Unit] [Unit]            │               │
│              │                                      │               │
├──────────────┴──────────────────────────────────────┴───────────────┤
│  ╔══════════════════════════════════════════════════════════════╗  │
│  ║  🔥 FIREBALL SELECTED - SELECT TARGET                        ║  │
│  ╠══════════════════════════════════════════════════════════════╣  │
│  ║  Mars Psynergy | Single Enemy | Power: 35 | Mana: 2○        ║  │ ← 35%
│  ║  Effects: Burn (80% chance, 3 turns, 10 dmg/turn)           ║  │
│  ║                                                              ║  │
│  ║  Click an enemy to target, or [BACK] to choose different ability ║
│  ╚══════════════════════════════════════════════════════════════╝  │
├──────────────────────────────────────────────────────────────────────┤
│  📜 ACTION QUEUE                                                     │
│  1. Isaac → Fireball → Goblin A [2○]   2. Garet → [Selecting...]    │ ← 10%
└──────────────────────────────────────────────────────────────────────┘
```

**Proportions:**
- **Mana/Djinn Bar:** 5%
- **Battlefield (medium):** 50%
- **Selected Ability Info (collapsed):** 35%
- **Action Queue:** 10%

---

## Animation Transitions

### Transition 1: **Collapsed → Expanded**

**Trigger:** User clicks unit card or "Select Action" button

**Animation (300ms ease-in-out):**
1. Ability panel slides up from bottom
2. Battlefield shrinks down (CSS Grid row transition)
3. Battle log fades out or scrolls up

```css
.battle-view {
  display: grid;
  grid-template-rows: 
    5vh          /* Mana/Djinn */
    70vh         /* Battlefield (default) */
    15vh         /* Battle log (default) */
    10vh;        /* Actions (collapsed) */
  transition: grid-template-rows 300ms ease-in-out;
}

.battle-view.expanded {
  grid-template-rows:
    5vh          /* Mana/Djinn */
    25vh         /* Battlefield (shrunk) */
    60vh         /* Ability panel (expanded) */
    10vh;        /* Actions (minimized) */
}
```

---

### Transition 2: **Expanded → Target Selection**

**Trigger:** User clicks an ability

**Animation (200ms ease-in-out):**
1. Ability list collapses to just the selected ability
2. Battlefield grows back to medium size
3. Target indicators appear on battlefield

```css
.battle-view.target-select {
  grid-template-rows:
    5vh          /* Mana/Djinn */
    50vh         /* Battlefield (medium) */
    35vh         /* Selected ability info */
    10vh;        /* Actions */
}
```

---

### Transition 3: **Target Selection → Collapsed**

**Trigger:** User confirms target and queues action

**Animation (300ms ease-in-out):**
1. Ability panel slides down
2. Battlefield grows back to full size
3. Battle log fades back in
4. Action queue updates with new action

```css
.battle-view {
  /* Returns to default collapsed state */
}
```

---

## Component Structure

### State Management

```typescript
type BattleUIState = 'collapsed' | 'expanded' | 'target-select';

interface BattleUIStateManager {
  uiState: BattleUIState;
  selectedUnitIndex: number | null;
  selectedAbilityId: string | null;
  
  // Transitions
  expandAbilities(unitIndex: number): void;
  selectAbility(abilityId: string): void;
  selectTarget(targetId: string): void;
  collapseAbilities(): void;
  cancel(): void;
}
```

---

### Component Hierarchy

```
QueueBattleView
├── ManaCirclesBar (fixed height)
├── DjinnBar (fixed height)
├── BattlefieldContainer (dynamic height based on uiState)
│   ├── PortraitPanel (left)
│   ├── BattlefieldVisual (center)
│   │   ├── UnitCards (positioned)
│   │   ├── EnemyCards (positioned)
│   │   └── TargetIndicators (when uiState === 'target-select')
│   └── TurnOrderPanel (right)
├── BattleLogPanel (dynamic height, fades out when expanded)
├── AbilityPanel (dynamic height based on uiState)
│   ├── CollapsedView (when uiState === 'collapsed')
│   ├── ExpandedView (when uiState === 'expanded')
│   │   └── AbilityDetailCard[] (scrollable list)
│   └── TargetSelectView (when uiState === 'target-select')
│       └── SelectedAbilityInfo (compact)
└── ActionQueuePanel (fixed height)
```

---

## Detailed Panel Designs

### Panel 1: **Collapsed Ability Panel** (Default State)

```
┌──────────────────────────────────────────────────────────────────────┐
│  📜 ACTIONS (Click unit to expand abilities)                         │
│  ┌────────────────────┬────────────────────┬────────────────────┐   │
│  │ 1. Isaac           │ 2. Garet           │ 3. Mia             │   │
│  │ → Fireball         │ → [Select Action]  │ → [Select Action]  │   │
│  │ → Goblin A [2○]    │    👆 Click        │    👆 Click        │   │
│  └────────────────────┴────────────────────┴────────────────────┘   │
│                                                                      │
│  Mana Used: 2/5  |  [EXECUTE ROUND]  |  [ACTIVATE DJINN]            │
└──────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Compact horizontal layout showing all unit actions
- Click any unit slot to expand abilities for that unit
- Shows queued actions with minimal space
- Execute/Djinn buttons always visible

---

### Panel 2: **Expanded Ability Panel**

```
┌──────────────────────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════════════════════╗  │
│  ║  SELECT ABILITY FOR GARET                                    ║  │
│  ║  Mana Available: 2○ | Level: 5                               ║  │
│  ╠══════════════════════════════════════════════════════════════╣  │
│  ║                                                              ║  │
│  ║  ┌─────────────────────────────────────────────────────────┐ ║  │
│  ║  │ ⚔️ Attack                                     [0○]       │ ║  │
│  ║  │ ─────────────────────────────────────────────────────    │ ║  │
│  ║  │ Physical | Single Enemy                                  │ ║  │
│  ║  │ Basic physical attack using unit's ATK stat              │ ║  │
│  ║  │ Power: Uses unit ATK (currently 45)                      │ ║  │
│  ║  └─────────────────────────────────────────────────────────┘ ║  │
│  ║                                                              ║  │
│  ║  ┌─────────────────────────────────────────────────────────┐ ║  │
│  ║  │ 🔥 Fireball                          [2○] ✓ Selected    │ ║  │
│  ║  │ ─────────────────────────────────────────────────────    │ ║  │
│  ║  │ Mars Psynergy | Single Enemy | Power: 35                │ ║  │
│  ║  │ Launches a ball of fire at a single enemy, dealing      │ ║  │
│  ║  │ fire damage.                                             │ ║  │
│  ║  │                                                          │ ║  │
│  ║  │ Effects:                                                 │ ║  │
│  ║  │ • Burn (80% chance, 3 turns, 10 dmg/turn)               │ ║  │
│  ║  │ • Elemental advantage: 1.5× vs Jupiter                  │ ║  │
│  ║  └─────────────────────────────────────────────────────────┘ ║  │
│  ║                                                              ║  │
│  ║  ┌─────────────────────────────────────────────────────────┐ ║  │
│  ║  │ 💚 Heal                                      [1○]        │ ║  │
│  ║  │ ─────────────────────────────────────────────────────    │ ║  │
│  ║  │ Healing | Single Ally | Power: 25                        │ ║  │
│  ║  │ Restores HP to an ally                                   │ ║  │
│  ║  └─────────────────────────────────────────────────────────┘ ║  │
│  ║                                                              ║  │
│  ║  ┌─────────────────────────────────────────────────────────┐ ║  │
│  ║  │ 🛡️ Guard Break                               [0○]        │ ║  │
│  ║  │ ─────────────────────────────────────────────────────    │ ║  │
│  ║  │ Physical | Single Enemy | Power: 18                      │ ║  │
│  ║  │ Strikes through defenses, reducing enemy DEF             │ ║  │
│  ║  │                                                          │ ║  │
│  ║  │ Effects:                                                 │ ║  │
│  ║  │ • Debuff: DEF -6 for 2 turns                            │ ║  │
│  ║  └─────────────────────────────────────────────────────────┘ ║  │
│  ║                                                              ║  │
│  ║  [Scroll for more abilities...]                             ║  │
│  ║                                                              ║  │
│  ║  [CANCEL]                                                    ║  │
│  ╚══════════════════════════════════════════════════════════════╝  │
└──────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Full-width scrollable list of abilities
- Rich detail cards with all information
- Visual selection state (border, checkmark)
- Locked abilities shown with reason
- Cancel button to collapse back

---

### Panel 3: **Target Selection View**

```
┌──────────────────────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════════════════════╗  │
│  ║  🔥 FIREBALL - SELECT TARGET                                 ║  │
│  ╠══════════════════════════════════════════════════════════════╣  │
│  ║  Mars Psynergy | Single Enemy | Power: 35 | Cost: 2○        ║  │
│  ║  Effects: Burn (80% chance, 3 turns, 10 dmg/turn)           ║  │
│  ║                                                              ║  │
│  ║  ┌─────────────────────────────────────────────────────────┐║  │
│  ║  │ Expected Damage:                                        │║  │
│  ║  │ • vs Goblin A (Jupiter): 52-63 damage (1.5× advantage) │║  │
│  ║  │ • vs Goblin B (Venus): 23-28 damage (0.67× resist)     │║  │
│  ║  └─────────────────────────────────────────────────────────┘║  │
│  ║                                                              ║  │
│  ║  👆 Click an enemy on the battlefield to target             ║  │
│  ║                                                              ║  │
│  ║  [BACK TO ABILITIES]  [CANCEL]                              ║  │
│  ╚══════════════════════════════════════════════════════════════╝  │
└──────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Compact view of selected ability
- Damage predictions per target (optional, Phase 2)
- Clear instruction for target selection
- Back button to reselect ability
- Cancel button to abort

---

## Interaction Flow

### Flow 1: **Queue an Action**

```
1. User clicks "Select Action" on Garet's slot
   ↓
   [Collapsed → Expanded Transition]
   ↓
2. Ability panel expands, showing all abilities
   User sees detailed cards with full information
   ↓
3. User clicks "Fireball"
   ↓
   [Expanded → Target Selection Transition]
   ↓
4. Ability panel collapses to compact view
   Battlefield grows, enemies show target indicators
   ↓
5. User clicks "Goblin A"
   ↓
   [Target Selection → Collapsed Transition]
   ↓
6. Action queued: "Garet → Fireball → Goblin A [2○]"
   Panel collapses back to default
   Battlefield returns to full size
```

---

### Flow 2: **Cancel Selection**

```
State: Expanded (selecting ability)
↓
User clicks [CANCEL]
↓
[Expanded → Collapsed Transition]
↓
Battlefield grows back to full size
No action queued
```

---

### Flow 3: **Change Ability**

```
State: Target Selection (Fireball selected)
↓
User clicks [BACK TO ABILITIES]
↓
[Target Selection → Expanded Transition]
↓
Ability list expands again
User can select different ability
```

---

## CSS Grid Implementation

### Container CSS

```css
.queue-battle-view {
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-rows: 
    5vh          /* Row 1: Mana/Djinn bar */
    70vh         /* Row 2: Battlefield (default) */
    15vh         /* Row 3: Battle log (default) */
    10vh;        /* Row 4: Actions (collapsed) */
  grid-template-columns: 20% 60% 20%;
  transition: grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Expanded state (selecting abilities) */
.queue-battle-view[data-ui-state="expanded"] {
  grid-template-rows:
    5vh          /* Mana/Djinn */
    25vh         /* Battlefield (shrunk) */
    60vh         /* Ability panel (expanded) */
    10vh;        /* Actions (minimized) */
}

/* Target selection state */
.queue-battle-view[data-ui-state="target-select"] {
  grid-template-rows:
    5vh          /* Mana/Djinn */
    50vh         /* Battlefield (medium) */
    35vh         /* Selected ability info */
    10vh;        /* Actions */
}
```

---

### Grid Areas

```css
.queue-battle-view {
  grid-template-areas:
    "mana mana mana"
    "portraits battlefield turn-order"
    "log log log"
    "actions actions actions";
}

.mana-djinn-bar { grid-area: mana; }
.portrait-panel { grid-area: portraits; }
.battlefield-visual { grid-area: battlefield; }
.turn-order-panel { grid-area: turn-order; }
.battle-log-panel { grid-area: log; }
.ability-panel { grid-area: actions; }
```

---

### Battlefield Row CSS

```css
/* Row 2: Battlefield area (portraits | battlefield | turn-order) */
.battlefield-row {
  display: grid;
  grid-template-columns: 20% 60% 20%;
  overflow: hidden;
  position: relative;
}

.portrait-panel,
.turn-order-panel {
  overflow-y: auto;
  padding: 1rem;
}

.battlefield-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}
```

---

### Ability Panel CSS

```css
.ability-panel {
  overflow: hidden;
  background: linear-gradient(to top, #1a1a1a, #2a2a2a);
  border-top: 2px solid #444;
  position: relative;
  z-index: 10;
}

/* Collapsed state - minimal height */
.ability-panel[data-state="collapsed"] {
  padding: 0.5rem 1rem;
}

/* Expanded state - fills height, scrollable */
.ability-panel[data-state="expanded"] {
  padding: 1rem;
  overflow-y: auto;
}

/* Target selection - medium height */
.ability-panel[data-state="target-select"] {
  padding: 1rem;
  overflow-y: auto;
}
```

---

### Animation Details

```css
/* Smooth height transitions for all elements */
.battlefield-visual,
.battle-log-panel,
.ability-panel {
  transition: 
    height 300ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 200ms ease-in-out,
    transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Battle log fades out when expanded */
.battle-log-panel[data-hidden="true"] {
  opacity: 0;
  pointer-events: none;
}

/* Ability panel slides up */
.ability-panel[data-state="expanded"] {
  transform: translateY(0);
}

.ability-panel[data-state="collapsed"] {
  transform: translateY(0);
}
```

---

## React State Management

### State Hook

```typescript
type UIState = 'collapsed' | 'expanded' | 'target-select';

interface BattleUIState {
  uiState: UIState;
  selectedUnitIndex: number | null;
  selectedAbilityId: string | null;
  selectedTargets: string[];
}

function useBattleUI() {
  const [uiState, setUIState] = useState<UIState>('collapsed');
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number | null>(null);
  const [selectedAbilityId, setSelectedAbilityId] = useState<string | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);

  const expandAbilities = useCallback((unitIndex: number) => {
    setSelectedUnitIndex(unitIndex);
    setSelectedAbilityId(null);
    setSelectedTargets([]);
    setUIState('expanded');
  }, []);

  const selectAbility = useCallback((abilityId: string) => {
    setSelectedAbilityId(abilityId);
    setUIState('target-select');
  }, []);

  const selectTarget = useCallback((targetId: string) => {
    setSelectedTargets([targetId]);
    // Queue action here
    // Then collapse
    setUIState('collapsed');
    setSelectedUnitIndex(null);
    setSelectedAbilityId(null);
    setSelectedTargets([]);
  }, []);

  const cancel = useCallback(() => {
    setUIState('collapsed');
    setSelectedUnitIndex(null);
    setSelectedAbilityId(null);
    setSelectedTargets([]);
  }, []);

  const backToAbilities = useCallback(() => {
    setUIState('expanded');
    setSelectedAbilityId(null);
    setSelectedTargets([]);
  }, []);

  return {
    uiState,
    selectedUnitIndex,
    selectedAbilityId,
    selectedTargets,
    expandAbilities,
    selectAbility,
    selectTarget,
    cancel,
    backToAbilities,
  };
}
```

---

### Component Usage

```typescript
export function QueueBattleView() {
  const {
    uiState,
    selectedUnitIndex,
    selectedAbilityId,
    expandAbilities,
    selectAbility,
    selectTarget,
    cancel,
    backToAbilities,
  } = useBattleUI();

  return (
    <div className="queue-battle-view" data-ui-state={uiState}>
      {/* Mana/Djinn Bar */}
      <div className="mana-djinn-bar">
        <ManaCirclesBar />
        <DjinnBar />
      </div>

      {/* Battlefield Row */}
      <div className="battlefield-row">
        <PortraitPanel />
        <BattlefieldVisual 
          showTargetIndicators={uiState === 'target-select'}
          onTargetClick={selectTarget}
        />
        <TurnOrderPanel />
      </div>

      {/* Battle Log (hidden when expanded) */}
      <BattleLogPanel hidden={uiState !== 'collapsed'} />

      {/* Ability Panel (dynamic) */}
      <AbilityPanel
        state={uiState}
        selectedUnitIndex={selectedUnitIndex}
        selectedAbilityId={selectedAbilityId}
        onAbilitySelect={selectAbility}
        onCancel={cancel}
        onBack={backToAbilities}
      />
    </div>
  );
}
```

---

## Mobile Responsiveness

### Collapsed State (Mobile)

```
┌─────────────────────────┐
│  MANA: ●●●○ | DJINN: 2  │
├─────────────────────────┤
│                         │
│    [Enemy] [Enemy]      │
│                         │
│    (Battlefield)        │
│                         │
│    [Unit] [Unit]        │
│                         │
├─────────────────────────┤
│  Battle Log             │
│  Last 3 events          │
├─────────────────────────┤
│  Actions                │
│  1. Isaac → Fire [2○]   │
│  2. [Select] 👆         │
└─────────────────────────┘
```

### Expanded State (Mobile)

```
┌─────────────────────────┐
│  MANA: ●●●○ | DJINN: 2  │
├─────────────────────────┤
│  [Mini Battlefield]     │
│  [Enemy] [Enemy]        │
├─────────────────────────┤
│  SELECT ABILITY: GARET  │
│  ────────────────────   │
│  ┌───────────────────┐  │
│  │ Attack [0○]       │  │
│  │ Physical attack   │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Fireball [2○] ✓   │  │
│  │ Mars Psynergy     │  │
│  │ Power: 35         │  │
│  │ Burn 80% chance   │  │
│  └───────────────────┘  │
│  [Scroll...]          │
│  [CANCEL]             │
└─────────────────────────┘
```

---

## Implementation Checklist

### Phase 1: Core Layout
- [ ] Create CSS Grid with dynamic row heights
- [ ] Add `data-ui-state` attribute to container
- [ ] Implement state management hook (`useBattleUI`)
- [ ] Add transition animations (300ms cubic-bezier)
- [ ] Test collapsed → expanded → collapsed flow

### Phase 2: Panels
- [ ] Create CollapsedAbilityPanel component
- [ ] Create ExpandedAbilityPanel component
- [ ] Create TargetSelectPanel component
- [ ] Add cancel/back buttons
- [ ] Test panel transitions

### Phase 3: Battlefield Integration
- [ ] Add target indicators on battlefield
- [ ] Make unit cards clickable for ability selection
- [ ] Update battlefield size based on UI state
- [ ] Test target selection flow

### Phase 4: Polish
- [ ] Add entrance/exit animations for ability cards
- [ ] Add hover states
- [ ] Add keyboard shortcuts (Esc to cancel, Enter to confirm)
- [ ] Test on different screen sizes
- [ ] Add mobile responsiveness

---

## Benefits of This Design

✅ **Maximizes Battlefield Visibility** - Default state shows large battlefield  
✅ **Details On Demand** - Expand only when needed  
✅ **Smooth Transitions** - 300ms animations feel natural  
✅ **Clear State Changes** - User always knows what mode they're in  
✅ **Keyboard Friendly** - Can navigate without mouse  
✅ **Mobile Friendly** - Adapts to smaller screens  
✅ **Minimal Cognitive Load** - One task at a time (select ability OR select target)  

---

**Next Action:** Begin implementation of expandable layout system with CSS Grid transitions
