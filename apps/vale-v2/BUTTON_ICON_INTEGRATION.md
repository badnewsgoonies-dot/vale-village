# ButtonIcon Integration Guide

## Overview

The `ButtonIcon` component provides sprite-based buttons using the 55 available button icon sprites from the Golden Sun sprite catalog. This guide documents how to integrate ButtonIcon throughout the UI.

**Status:** Component exists but not yet integrated
**Location:** `src/ui/sprites/ButtonIcon.tsx`
**Effort:** 4-6 hours for battle UI + 2-3 hours for menus = **6-9 hours total**

---

## Component API

```typescript
interface ButtonIconProps {
  /** Button ID (e.g., 'fight', 'psynergy', 'djinn') */
  id: string;

  /** Label text */
  label?: string;

  /** Size in pixels */
  size?: number;

  /** Click handler */
  onClick?: () => void;

  /** Disabled state */
  disabled?: boolean;

  /** Custom className */
  className?: string;
}
```

### Usage Example

```typescript
import { ButtonIcon } from '@/ui/sprites/ButtonIcon';

<ButtonIcon
  id="fight"
  label="Fight"
  size={32}
  onClick={() => handleAction('attack')}
  disabled={false}
/>
```

---

## Available Button Sprites

**55 button icon sprites in catalog** (category: `icons-buttons`)

### Battle Actions
- `fight` - Fight/Attack action
- `attack` - Attack command
- `defend` - Defend/Guard action
- `psynergy` - Psynergy/Magic menu
- `djinni` - Djinn menu
- `item` - Item menu
- `run` - Run/Flee action
- `flee` - Flee from battle
- `summon` - Summon command
- `status` - Status screen

### Menu Navigation
- `save-game` - Save game button (2 variants: `save-game`, `save-game2`)
- `continue` - Load/Continue game
- `options` - Options/Settings (2 variants: `options`, `options2`)
- `new-quest` - New game

### Shop/Inventory
- `buy` - Buy items
- `sell` - Sell items
- `coins` - Gold/currency display
- `artifact` - Artifacts menu

### File Management
- `copy-file` - Copy save file
- `erase-file` - Delete save file

### Other UI
- `link-cable` - Multiplayer/link
- `battle` - Battle transition icon
- And 30+ more specialized icons

---

## Integration Priorities

### Phase 1: Battle UI (4-6 hours) - HIGH PRIORITY

**Files to update:**
1. `CommandPanel.tsx` - Main battle action buttons
2. `AbilityPanel.tsx` - Ability selection (psynergy icons)
3. `DjinnPanel.tsx` - Djinn selection
4. `QueuePanel.tsx` - Queue action buttons

**Implementation:**

#### 1.1 CommandPanel.tsx - Main Actions

**Current:**
```typescript
<button onClick={() => onSelectCommand('attack')}>
  Attack
</button>
<button onClick={() => onSelectCommand('defend')}>
  Defend
</button>
```

**After ButtonIcon Integration:**
```typescript
import { ButtonIcon } from '@/ui/sprites/ButtonIcon';

<ButtonIcon
  id="fight"
  label="Attack"
  onClick={() => onSelectCommand('attack')}
/>
<ButtonIcon
  id="defend"
  label="Defend"
  onClick={() => onSelectCommand('defend')}
/>
<ButtonIcon
  id="psynergy"
  label="Psynergy"
  onClick={() => onSelectCommand('abilities')}
/>
<ButtonIcon
  id="djinni"
  label="Djinn"
  onClick={() => onSelectCommand('djinn')}
/>
<ButtonIcon
  id="item"
  label="Item"
  onClick={() => onSelectCommand('item')}
/>
<ButtonIcon
  id="run"
  label="Run"
  onClick={() => onSelectCommand('run')}
/>
```

#### 1.2 DjinnPanel.tsx - Djinn Actions

Add Djinn-specific button icons for Set/Standby/Summon actions.

---

### Phase 2: Menu/UI Screens (2-3 hours) - MEDIUM PRIORITY

**Files to update:**
1. `SaveMenu.tsx` - Save/Load/Delete buttons
2. `ShopScreen.tsx` - Buy/Sell buttons
3. `CreditsScreen.tsx` - Navigation buttons
4. Any modal close buttons

**Implementation:**

#### 2.1 SaveMenu.tsx - Save Actions

**Current (with sprites already):**
```typescript
<button className={`action-btn ${action === 'save' ? 'active' : ''}`}>
  <SimpleSprite id="save-game" width={24} height={24} style={{ marginRight: '8px' }} />
  New Save
</button>
```

**After ButtonIcon Integration:**
```typescript
<ButtonIcon
  id="save-game"
  label="New Save"
  size={24}
  onClick={() => setAction('save')}
  className={`action-btn ${action === 'save' ? 'active' : ''}`}
/>
<ButtonIcon
  id="continue"
  label="Load Save"
  size={24}
  onClick={() => setAction('load')}
  className={`action-btn ${action === 'load' ? 'active' : ''}`}
/>
<ButtonIcon
  id="erase-file"
  label="Delete Save"
  size={24}
  onClick={() => setAction('delete')}
  className="delete-action-btn"
/>
```

**Note:** SaveMenu currently uses SimpleSprite directly - can be refactored to use ButtonIcon for consistency.

#### 2.2 ShopScreen.tsx - Buy/Sell Buttons

Add buy/sell button icons to shop interface.

---

### Phase 3: Storyboards & Dev Tools (Optional)

Update storyboard components to demonstrate ButtonIcon usage for design reference.

---

## Migration Strategy

### Step 1: Create ButtonIcon Wrapper Variations (1 hour)

Create specialized wrapper components for common button types:

**File:** `src/ui/components/buttons/BattleActionButton.tsx`
```typescript
interface BattleActionButtonProps {
  action: 'attack' | 'defend' | 'abilities' | 'djinn' | 'item' | 'run';
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function BattleActionButton({ action, label, onClick, disabled }: BattleActionButtonProps) {
  const iconMap = {
    'attack': 'fight',
    'defend': 'defend',
    'abilities': 'psynergy',
    'djinn': 'djinni',
    'item': 'item',
    'run': 'run',
  };

  return (
    <ButtonIcon
      id={iconMap[action]}
      label={label}
      onClick={onClick}
      disabled={disabled}
      size={32}
    />
  );
}
```

### Step 2: Update Battle UI Components (2-3 hours)

Replace text buttons with `BattleActionButton` in:
- CommandPanel.tsx
- AbilityPanel.tsx (psynergy icon already done)
- DjinnPanel.tsx
- QueuePanel.tsx

### Step 3: Update Menu Components (1-2 hours)

Replace menu buttons with `ButtonIcon` in:
- SaveMenu.tsx (partially done - refactor to use ButtonIcon)
- ShopScreen.tsx
- Other menu screens

### Step 4: CSS Adjustments (1 hour)

Update CSS to work with sprite-based buttons:
- Remove text-based button styling
- Add hover/active states for sprite buttons
- Ensure proper spacing and alignment

### Step 5: E2E Testing (1-2 hours)

Create `button-sprites.spec.ts` to verify:
- Button sprites render correctly
- Click interactions work
- Disabled states display correctly
- Battle action buttons function properly

---

## Testing Checklist

- [ ] All battle action buttons show sprites
- [ ] Button labels display correctly
- [ ] Click handlers work
- [ ] Disabled state reduces opacity
- [ ] Hover effects work
- [ ] Mobile/touch interactions work
- [ ] Save/Load buttons use correct icons
- [ ] Shop Buy/Sell buttons use correct icons
- [ ] E2E tests pass

---

## CSS Styling Guide

### Default ButtonIcon Styling

The ButtonIcon component includes default styling:
- Flexbox column layout (icon above label)
- Border and background color
- Hover effects (scale + background change)
- Disabled state (reduced opacity)

### Customization

Override styles using `className` prop or inline `style`:

```typescript
<ButtonIcon
  id="fight"
  label="Attack"
  className="battle-action-btn"
  style={{ borderRadius: '8px', padding: '12px' }}
/>
```

---

## Future Enhancements

1. **Animation Support** - Add sprite animation for active/selected states
2. **Keyboard Navigation** - Add keyboard focus indicators
3. **Sound Effects** - Add button click sounds
4. **Tooltip Support** - Show ability descriptions on hover
5. **Badge Support** - Add notification badges (e.g., "3 Djinn available")

---

## Related Files

- `src/ui/sprites/ButtonIcon.tsx` - Component implementation
- `src/ui/sprites/SimpleSprite.tsx` - Underlying sprite renderer
- `src/ui/sprites/catalog.ts` - Sprite catalog with 55 button icons
- `public/sprites/icons/buttons/` - 55 button sprite GIF files

---

## Estimated Effort Summary

| Task | Effort | Priority |
|------|--------|----------|
| Battle UI Integration | 4-6 hours | HIGH |
| Menu UI Integration | 2-3 hours | MEDIUM |
| E2E Testing | 1-2 hours | MEDIUM |
| **Total** | **7-11 hours** | - |

**Recommended Approach:** Implement in phases, starting with Battle UI (high visual impact), then menus.

---

## Next Steps

1. ✅ Review this guide
2. Create `BattleActionButton` wrapper component
3. Update `CommandPanel.tsx` with ButtonIcon
4. Update `AbilityPanel.tsx` Djinn actions
5. Update `SaveMenu.tsx` to use ButtonIcon
6. Create `button-sprites.spec.ts` E2E test
7. Run tests and verify functionality

---

**Last Updated:** 2025-11-16
**Status:** ✅ Guide Complete - Ready for Implementation
