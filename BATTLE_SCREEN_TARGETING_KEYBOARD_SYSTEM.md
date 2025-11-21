# Battle Targeting & Keyboard Navigation System

**Date:** 2025-11-21  
**Critical UX:** Make targeting intuitive and fully keyboard-accessible

---

## Current Problem

❌ **Can only click enemy names** (small text targets)  
❌ **Cannot click actual sprites/cards** on battlefield  
❌ **No keyboard navigation**  
❌ **Unclear what's targetable**  

---

## Solution Overview

✅ **Click anywhere on enemy/unit card** to target  
✅ **Hover shows valid targets** with visual feedback  
✅ **Full keyboard navigation** (Tab, Arrow keys, Enter, Esc)  
✅ **Clear visual states** (targetable, selected, confirmed)  
✅ **Works for all target types** (single, all, allies, enemies)  

---

## Target Selection System

### Visual States

#### State 1: Not Targetable (Default)

```
┌─────────────────┐
│                 │
│   [Enemy Sprite]│  ← Normal appearance
│                 │
│   Goblin A      │
│   HP: 45/60     │
└─────────────────┘
```

No special styling, not interactive

---

#### State 2: Valid Target (Hoverable)

```
┌─────────────────┐
│  ╔═══════════╗  │
│  ║ [Enemy]   ║  │  ← Glowing border
│  ║           ║  │  ← Cursor: pointer
│  ╚═══════════╝  │  ← Pulse animation
│                 │
│   Goblin A 👆   │
│   HP: 45/60     │
│   (Click to     │
│    target)      │
└─────────────────┘
```

**Visual Indicators:**
- Glowing yellow/orange border
- Pulsing animation (subtle)
- Cursor changes to pointer
- Tooltip: "Click to target"

**CSS:**
```css
.unit-card.valid-target {
  border: 3px solid #FFA500;
  box-shadow: 0 0 15px rgba(255, 165, 0, 0.6);
  cursor: pointer;
  animation: pulse-glow 1.5s infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(255, 165, 0, 0.6); }
  50% { box-shadow: 0 0 25px rgba(255, 165, 0, 0.9); }
}
```

---

#### State 3: Selected Target (Clicked)

```
┌─────────────────┐
│  ╔═══════════╗  │
│  ║ [Enemy]   ║  │  ← Solid green border
│  ║     ✓     ║  │  ← Checkmark overlay
│  ╚═══════════╝  │  ← Brighter glow
│                 │
│   Goblin A ✓    │
│   HP: 45/60     │
│   [SELECTED]    │
└─────────────────┘
```

**Visual Indicators:**
- Solid green border (thicker)
- Bright green glow
- Checkmark overlay (✓)
- Label: "SELECTED"

**CSS:**
```css
.unit-card.selected-target {
  border: 4px solid #4CAF50;
  box-shadow: 0 0 25px rgba(76, 175, 80, 0.9);
  background: linear-gradient(135deg, 
    rgba(76, 175, 80, 0.1), 
    rgba(76, 175, 80, 0.2));
}

.unit-card.selected-target::after {
  content: '✓';
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  color: #4CAF50;
  text-shadow: 0 0 10px rgba(76, 175, 80, 0.8);
}
```

---

#### State 4: All Targets (Multi-target abilities)

When ability targets "all-enemies":

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  ╔═══════════╗  │  │  ╔═══════════╗  │  │  ╔═══════════╗  │
│  ║ [Enemy]   ║  │  │  ║ [Enemy]   ║  │  │  ║ [Enemy]   ║  │
│  ║     ✓     ║  │  │  ║     ✓     ║  │  │  ║     ✓     ║  │
│  ╚═══════════╝  │  │  ╚═══════════╝  │  │  ╚═══════════╝  │
│                 │  │                 │  │                 │
│   Goblin A ✓    │  │   Goblin B ✓    │  │   Goblin C ✓    │
│   [ALL TARGETS] │  │   [ALL TARGETS] │  │   [ALL TARGETS] │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Features:**
- All valid targets highlighted simultaneously
- All show checkmarks
- Cannot deselect individual targets
- Label: "ALL TARGETS"

---

### Clickable Areas

#### Battlefield Unit/Enemy Cards

**Full card is clickable:**

```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │ ← Click anywhere in this box
│ │                         │ │
│ │    [Enemy Sprite]       │ │ ← Click sprite
│ │    64×64 or larger      │ │
│ │                         │ │
│ │    Goblin A             │ │ ← Click name
│ │    HP: ████░░ 45/60     │ │ ← Click HP bar
│ │    🔥 Burn (2t)         │ │ ← Click status
│ │                         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Implementation:**
```typescript
<div 
  className={`unit-card ${isValidTarget ? 'valid-target' : ''} ${isSelected ? 'selected-target' : ''}`}
  onClick={() => isValidTarget && handleTargetSelect(unit.id)}
  onMouseEnter={() => isValidTarget && handleTargetHover(unit.id)}
  onMouseLeave={() => handleTargetHoverEnd()}
>
  {/* All card content */}
</div>
```

---

#### Portrait Panel (For ally targeting)

**Full portrait card is clickable:**

```
┌─────────────────────┐
│ ┌─────────────────┐ │ ← Click anywhere
│ │ [Portrait Img]  │ │
│ │ 64×64           │ │
│ └─────────────────┘ │
│ Isaac               │
│ Lv 5 | Venus        │
│ ████████░░ 80/100   │
└─────────────────────┘
     ↑ All clickable for ally targeting
```

---

## Targeting Flow

### Flow 1: Single Enemy Target

```
1. User selects unit (Isaac) from portrait panel
   ↓
2. User hovers over "Fireball" ability
   Right panel shows: "Type: Psynergy | Target: Single Enemy"
   ↓
3. User clicks "Fireball"
   ↓
4. System enters "Target Selection Mode"
   - Abilities panel updates: "Select Target: Fireball"
   - All valid enemy targets get glowing borders
   - Invalid targets (allies, KO'd enemies) stay dim
   - Cursor changes to crosshair
   ↓
5. User hovers over Goblin A
   - Goblin A's glow intensifies
   - Tooltip: "Click to target Goblin A"
   - Damage preview (optional): "Est. 35-45 dmg"
   ↓
6. User clicks Goblin A
   - Goblin A shows green checkmark
   - Confirmation appears: "Isaac → Fireball → Goblin A [2○]"
   - [CONFIRM] [CHANGE TARGET] [CANCEL]
   ↓
7a. User clicks [CONFIRM]
   - Action queued
   - Target selection ends
   - Abilities panel collapses
   
7b. User clicks [CHANGE TARGET]
   - Returns to step 4
   - Can select different target
   
7c. User clicks [CANCEL] or presses ESC
   - Target selection cancelled
   - Returns to ability selection
```

---

### Flow 2: All Enemies Target

```
1. User selects "Thunder Storm" (all-enemies ability)
   ↓
2. System automatically selects ALL enemies
   - All enemy cards show green borders + checkmarks
   - Label: "ALL ENEMIES TARGETED"
   - No further clicking needed
   ↓
3. Confirmation appears immediately:
   "Isaac → Thunder Storm → All Enemies [4○]"
   [CONFIRM] [CANCEL]
   ↓
4. User confirms or cancels
```

---

### Flow 3: Single Ally Target (Healing)

```
1. User selects "Heal" ability
   ↓
2. System enters "Target Selection Mode"
   - All valid ally targets (in portrait panel) get glowing borders
   - Invalid targets (full HP, KO'd) stay dim
   - Battlefield enemies are dimmed (not valid)
   ↓
3. User clicks ally portrait (Mia)
   - Mia's portrait shows green checkmark
   - Confirmation: "Isaac → Heal → Mia [1○]"
   [CONFIRM] [CHANGE TARGET] [CANCEL]
```

---

## Keyboard Navigation System

### Key Bindings

**Global Battle Keys:**
- `ESC` - Cancel current action / Go back
- `ENTER` - Confirm selection / Execute action
- `TAB` - Cycle through units (portraits)
- `SHIFT+TAB` - Cycle backwards through units
- `SPACE` - Open selected unit's abilities

**During Ability Selection:**
- `↑` / `↓` - Navigate ability list
- `ENTER` - Select highlighted ability
- `ESC` - Cancel, return to unit selection

**During Target Selection:**
- `1-9` - Quick-select target by number
- `TAB` - Cycle through valid targets
- `←` / `→` - Navigate between targets (horizontal)
- `↑` / `↓` - Navigate between targets (vertical)
- `ENTER` - Confirm selected target
- `ESC` - Cancel target selection

**Quick Actions:**
- `A` - Attack with selected unit (default action)
- `Q` - Queue current selections
- `E` - Execute queued round
- `D` - Open Djinn menu

---

### Keyboard Navigation Flow

#### Example: Select Unit → Ability → Target (Keyboard Only)

```
1. Press TAB to cycle through units
   → Isaac's portrait highlights (yellow border)
   
2. Press SPACE to open Isaac's abilities
   → Abilities panel opens
   → First ability highlighted
   
3. Press ↓ to navigate to "Fireball"
   → "Fireball" highlighted (yellow background)
   
4. Press ENTER to select Fireball
   → Target selection mode enters
   → First valid enemy highlighted (Goblin A)
   → Damage preview shown
   
5. Press → to navigate to Goblin B
   → Goblin B now highlighted
   
6. Press ENTER to confirm target
   → Action queued: "Isaac → Fireball → Goblin B [2○]"
   → Abilities panel collapses
   
7. Press TAB to select next unit
   → Garet's portrait highlights
   → Repeat process
   
8. After all units queued, press E to execute
   → Round executes
```

---

### Visual Keyboard Indicators

#### Unit Selection (Tab Navigation)

```
┌─────────────────────┐
│ ╔═══════════════════╗│  ← Yellow border = Keyboard focus
│ ║ [Portrait Img]    ║│
│ ║ 64×64             ║│
│ ╚═══════════════════╝│
│ Isaac  [SPACE]      │  ← Show key hint
│ Lv 5 | Venus        │
│ ████████░░ 80/100   │
└─────────────────────┘
```

---

#### Ability Selection (Arrow Navigation)

```
┌─────────────────────────────────────┐
│ ABILITIES                           │
├─────────────────────────────────────┤
│ ⚔️ Attack [0○]                      │
│                                     │
│ ╔═════════════════════════════════╗ │  ← Yellow highlight
│ ║ 🔥 Fireball [2○]                ║ │  ← Keyboard selected
│ ║ Mars Psynergy | Single Enemy    ║ │
│ ╚═════════════════════════════════╝ │
│                                     │
│ 💚 Heal [1○]                        │
└─────────────────────────────────────┘

Press ↑/↓ to navigate, ENTER to select
```

---

#### Target Selection (Tab/Arrow Navigation)

```
Battlefield:

  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │ ╔═════════╗ │  │             │  │             │
  │ ║ [Enemy] ║ │  │   [Enemy]   │  │   [Enemy]   │
  │ ║    1    ║ │  │      2      │  │      3      │
  │ ╚═════════╝ │  │             │  │             │
  │  Goblin A   │  │  Goblin B   │  │  Goblin C   │
  └─────────────┘  └─────────────┘  └─────────────┘
       ↑ Yellow border = Keyboard focus
       
Press 1, 2, or 3 for quick select
Press TAB or ← → to navigate
Press ENTER to confirm
```

---

## Target Type Handling

### Single Enemy

**Behavior:**
- Highlight all valid enemies
- User must click/select one
- Confirmation required

**Visual:**
```
Valid targets: Glowing yellow borders
Selected target: Green border + checkmark
```

---

### All Enemies

**Behavior:**
- Automatically select all enemies
- No individual selection needed
- Immediate confirmation prompt

**Visual:**
```
All enemies: Green borders + checkmarks
Label: "ALL ENEMIES TARGETED"
```

---

### Single Ally

**Behavior:**
- Highlight all valid allies (in portrait panel)
- User must click/select one
- Confirmation required

**Visual:**
```
Valid allies: Glowing yellow borders on portraits
Selected ally: Green border + checkmark
```

**Smart Filtering:**
- If healing ability: Only show allies below max HP
- If buff ability: Show all alive allies
- If revive ability: Only show KO'd allies

---

### All Allies

**Behavior:**
- Automatically select all allies
- Immediate confirmation

**Visual:**
```
All ally portraits: Green borders + checkmarks
Label: "ALL ALLIES TARGETED"
```

---

### Self

**Behavior:**
- Automatically target self (no selection needed)
- Immediate confirmation

**Visual:**
```
Current unit's portrait: Green border + checkmark
Label: "SELF TARGETED"
```

---

## Confirmation System

### Confirmation Panel

**Appears after target selection:**

```
┌──────────────────────────────────────────────┐
│ ⚠️ CONFIRM ACTION                            │
├──────────────────────────────────────────────┤
│                                              │
│ Unit: Isaac                                  │
│ Ability: 🔥 Fireball [2○]                   │
│ Target: Goblin A                             │
│                                              │
│ Expected Damage: 35-45                       │
│ Elemental Advantage: 1.5× (vs Jupiter)      │
│                                              │
│ ──────────────────────────────────────────   │
│                                              │
│ [CONFIRM (ENTER)] [CHANGE TARGET] [CANCEL (ESC)]│
└──────────────────────────────────────────────┘
```

**Keyboard:**
- `ENTER` - Confirm and queue action
- `ESC` - Cancel and return to ability selection
- `T` - Change target (returns to target selection)

---

### Quick Confirm (Optional Setting)

**For experienced players:**

```
Settings:
☑ Quick Confirm: Skip confirmation for basic attacks
☑ Quick Confirm: Skip confirmation for single targets
☐ Quick Confirm: Skip confirmation for all abilities (risky!)
```

---

## Target Preview System

### Damage Preview (On Hover)

When hovering over a valid target:

```
┌─────────────────────┐
│  ╔═══════════════╗  │
│  ║  [Enemy]      ║  │
│  ║               ║  │
│  ╚═══════════════╝  │
│                     │
│  Goblin A           │
│  HP: 45/60          │
│                     │
│ ┌─────────────────┐ │  ← Preview tooltip
│ │ Fireball        │ │
│ │ Est: 35-45 dmg  │ │
│ │ Adv: 1.5×       │ │
│ │ Kill?: No       │ │
│ └─────────────────┘ │
└─────────────────────┘
```

**Shows:**
- Ability name
- Estimated damage range
- Elemental advantage/disadvantage
- Likely outcome (kill, survive, critical threshold)

---

### Multi-Target Preview

For all-enemies abilities:

```
┌────────────────────────────────────────┐
│ Thunder Storm - ALL ENEMIES            │
├────────────────────────────────────────┤
│                                        │
│ Goblin A: 40-50 dmg (Will survive)    │
│ Goblin B: 40-50 dmg (Will survive)    │
│ Goblin C: 40-50 dmg (LIKELY KILL ☠️)  │
│                                        │
│ Total: 120-150 dmg                     │
│                                        │
│ Chain damage: Each hit 80% of previous│
└────────────────────────────────────────┘
```

---

## Implementation Structure

### Target Selection State

```typescript
interface TargetSelectionState {
  isActive: boolean;
  ability: Ability | null;
  validTargets: string[]; // Unit IDs
  selectedTargets: string[]; // Unit IDs
  hoveredTarget: string | null;
  keyboardFocusedTarget: string | null;
}

const useTargetSelection = () => {
  const [state, setState] = useState<TargetSelectionState>({
    isActive: false,
    ability: null,
    validTargets: [],
    selectedTargets: [],
    hoveredTarget: null,
    keyboardFocusedTarget: null,
  });
  
  const startTargetSelection = (ability: Ability, caster: Unit) => {
    const validTargets = calculateValidTargets(ability, battleState);
    
    // Auto-select for all-targets abilities
    if (ability.targets === 'all-enemies') {
      setState({
        isActive: true,
        ability,
        validTargets,
        selectedTargets: validTargets, // Auto-select all
        hoveredTarget: null,
        keyboardFocusedTarget: validTargets[0],
      });
    } else {
      setState({
        isActive: true,
        ability,
        validTargets,
        selectedTargets: [],
        hoveredTarget: null,
        keyboardFocusedTarget: validTargets[0], // Focus first
      });
    }
  };
  
  const selectTarget = (targetId: string) => {
    if (!state.validTargets.includes(targetId)) return;
    
    setState(prev => ({
      ...prev,
      selectedTargets: [targetId], // Single target
    }));
  };
  
  const cancelTargetSelection = () => {
    setState({
      isActive: false,
      ability: null,
      validTargets: [],
      selectedTargets: [],
      hoveredTarget: null,
      keyboardFocusedTarget: null,
    });
  };
  
  return {
    ...state,
    startTargetSelection,
    selectTarget,
    cancelTargetSelection,
  };
};
```

---

### Keyboard Navigation Handler

```typescript
const useKeyboardNavigation = (targetSelection: TargetSelectionState) => {
  useEffect(() => {
    if (!targetSelection.isActive) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const { validTargets, keyboardFocusedTarget } = targetSelection;
      const currentIndex = validTargets.indexOf(keyboardFocusedTarget || '');
      
      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          const nextIndex = e.shiftKey
            ? (currentIndex - 1 + validTargets.length) % validTargets.length
            : (currentIndex + 1) % validTargets.length;
          setKeyboardFocus(validTargets[nextIndex]);
          break;
          
        case 'ArrowRight':
        case 'ArrowLeft':
          e.preventDefault();
          navigateHorizontal(e.key === 'ArrowRight' ? 1 : -1);
          break;
          
        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          navigateVertical(e.key === 'ArrowDown' ? 1 : -1);
          break;
          
        case 'Enter':
          e.preventDefault();
          if (keyboardFocusedTarget) {
            selectTarget(keyboardFocusedTarget);
          }
          break;
          
        case 'Escape':
          e.preventDefault();
          cancelTargetSelection();
          break;
          
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          const index = parseInt(e.key) - 1;
          if (validTargets[index]) {
            selectTarget(validTargets[index]);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targetSelection]);
};
```

---

## Summary

### Targeting System
✅ **Click anywhere on card** to target (sprite, name, HP bar, everything)  
✅ **Clear visual states** (valid targets glow yellow, selected = green + checkmark)  
✅ **Auto-selection for all-targets** abilities (Thunder Storm → all enemies selected instantly)  
✅ **Smart filtering** (Heal only shows damaged allies, Revive only shows KO'd)  
✅ **Damage preview** on hover (estimated damage, kill probability)  
✅ **Confirmation before queueing** (with [CONFIRM] [CANCEL] buttons)  

### Keyboard Navigation
✅ **Full battle control** via keyboard (never need mouse)  
✅ **Tab through units** in portrait panel  
✅ **Arrow keys** for ability/target navigation  
✅ **Number keys** for quick target selection (1-9)  
✅ **Enter to confirm**, **Esc to cancel**  
✅ **Visual keyboard focus** indicators (yellow borders)  

---

Ready to start implementing? We have complete designs for:
- ✅ Fixed battlefield with overlay abilities panel
- ✅ Two-column abilities (list + details on hover)
- ✅ Djinn cascading menu (top-right, 3 columns)
- ✅ Unit portraits (left panel, expand on hover)
- ✅ Targeting system (click anywhere, keyboard nav)

Should I begin implementation?
