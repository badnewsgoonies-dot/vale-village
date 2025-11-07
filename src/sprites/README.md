# Sprite Registry - Quick Reference

## Installation & Setup

The sprite registry is already set up! Just import and use:

```typescript
import { spriteRegistry, BattleUnit, EquipmentIcon } from '@/sprites';
```

## Quick Start

### 1. Get a Sprite Path

```typescript
import { spriteRegistry } from '@/sprites';
import { Unit } from '@/types/Unit';

const path = spriteRegistry.getBattleSprite(unit, 'Front');
// → "/sprites/battle/party/isaac/Isaac_lSword_Front.gif"
```

### 2. Render a Battle Unit

```tsx
import { BattleUnit } from '@/sprites';

<BattleUnit unit={unit} animation="Attack1" />
```

### 3. Render Equipment Icon

```tsx
import { EquipmentIcon } from '@/sprites';

<EquipmentIcon equipment={unit.equipment.weapon} size="medium" />
```

## Available Animations

**Standing Poses:**
- `'Front'` - Facing forward (idle)
- `'Back'` - Facing away

**Attacking:**
- `'Attack1'` - First attack frame
- `'Attack2'` - Second attack frame

**Casting (Front):**
- `'CastFront1'` - Casting animation facing forward (frame 1)
- `'CastFront2'` - Casting animation facing forward (frame 2)

**Casting (Back):**
- `'CastBack1'` - Casting animation facing away (frame 1)
- `'CastBack2'` - Casting animation facing away (frame 2)

**Damage:**
- `'HitFront'` - Taking damage (facing forward)
- `'HitBack'` - Taking damage (facing away)

**Downed:**
- `'DownedFront'` - Defeated (facing forward)
- `'DownedBack'` - Defeated (facing away)

## Equipment Icon Sizes

```tsx
<EquipmentIcon equipment={item} size="small" />   // 24x24
<EquipmentIcon equipment={item} size="medium" />  // 32x32 (default)
<EquipmentIcon equipment={item} size="large" />   // 48x48
```

## API Reference

### `spriteRegistry.getBattleSprite(unit, animation)`

Get battle sprite path for a unit.

**Parameters:**
- `unit: Unit` - The unit instance
- `animation: AnimationState` - Animation name (e.g., 'Front', 'Attack1')

**Returns:** `string` - Full path to sprite file

**Example:**
```typescript
const isaac = new Unit(UNIT_DEFINITIONS.isaac);
const path = spriteRegistry.getBattleSprite(isaac, 'Attack1');
// → "/sprites/battle/party/isaac/Isaac_lSword_Attack1.gif"
```

### `spriteRegistry.getEquipmentIcon(equipment)`

Get equipment icon path.

**Parameters:**
- `equipment: Equipment` - The equipment instance

**Returns:** `string` - Full path to icon file

**Example:**
```typescript
import { IRON_SWORD } from '@/data/equipment';

const path = spriteRegistry.getEquipmentIcon(IRON_SWORD);
// → "/sprites/icons/items/long-swords/Iron_Sword.gif"
```

### `spriteRegistry.getAbilityIcon(abilityName)`

Get ability/Psynergy icon path.

**Parameters:**
- `abilityName: string` - Name of the ability

**Returns:** `string` - Full path to icon file

**Example:**
```typescript
const path = spriteRegistry.getAbilityIcon('Ragnarok');
// → "/sprites/icons/psynergy/Ragnarok.gif"
```

### `spriteRegistry.getDjinnIcon(djinn)`

Get Djinn icon path (element-based).

**Parameters:**
- `djinn: Djinn` - The Djinn instance

**Returns:** `string` - Full path to sprite file

**Example:**
```typescript
const path = spriteRegistry.getDjinnIcon(flint);
// → "/sprites/battle/djinn/Venus_Djinn_Front.gif"
```

### `spriteRegistry.preloadTeamSprites(units)`

Preload sprites for a team (useful before battles).

**Parameters:**
- `units: Unit[]` - Array of units to preload

**Returns:** `Promise<void>`

**Example:**
```typescript
const team = [isaac, garet, ivan, mia];
await spriteRegistry.preloadTeamSprites(team);
console.log('Battle sprites loaded!');
```

## React Components

### `<BattleUnit />`

Renders a unit's battle sprite with animations.

**Props:**
- `unit: Unit` - The unit to render
- `animation?: AnimationState` - Animation to display (default: 'Front')
- `className?: string` - Additional CSS classes
- `onError?: (error: Error) => void` - Error callback

**Example:**
```tsx
<BattleUnit
  unit={isaac}
  animation="Attack1"
  className="player-sprite"
  onError={(err) => console.error(err)}
/>
```

### `<EquipmentIcon />`

Renders an equipment item icon.

**Props:**
- `equipment: Equipment | null` - The equipment to render
- `size?: 'small' | 'medium' | 'large'` - Icon size (default: 'medium')
- `className?: string` - Additional CSS classes

**Example:**
```tsx
<EquipmentIcon
  equipment={unit.equipment.weapon}
  size="large"
  className="weapon-icon"
/>
```

## Special Cases

### Jenna Fallback

Jenna's GS1 sprites are incomplete. The registry automatically uses GS2 sprites for front-casting animations:

```typescript
const jenna = new Unit(UNIT_DEFINITIONS.jenna);

// Uses jenna_gs2 sprites
spriteRegistry.getBattleSprite(jenna, 'CastFront1');
// → "/sprites/battle/party/jenna_gs2/Jenna_lBlade_CastFront1.gif"

// Uses regular jenna sprites
spriteRegistry.getBattleSprite(jenna, 'Front');
// → "/sprites/battle/party/jenna/Jenna_lBlade_Front.gif"
```

### Weapon Type Mapping

Equipment names are automatically mapped to sprite weapon types:

```typescript
import { normalizeWeaponType } from '@/sprites';

// "Iron Sword" → 'lSword'
// "Battle Axe" → 'Axe'
// "Blessed Mace" → 'Mace'
// "Wooden Staff" → 'Staff'
```

## Troubleshooting

### Sprite Not Loading

1. Check browser console for errors
2. Verify sprite file exists in `public/sprites/`
3. Check that unit ID matches exactly (case-sensitive)
4. Verify animation name is correct

### Wrong Sprite Displayed

1. Check unit's equipped weapon
2. Verify weapon type is available for that unit
3. Check console for fallback warnings

### TypeScript Errors

Make sure you import types correctly:

```typescript
import type { AnimationState } from '@/sprites/types';
// or
import type { AnimationState } from '@/sprites';
```

## File Locations

- **Unit sprites:** `public/sprites/battle/party/{unit}/`
- **Equipment icons:** `public/sprites/icons/items/{category}/`
- **Ability icons:** `public/sprites/icons/psynergy/`
- **Djinn sprites:** `public/sprites/battle/djinn/`

## Testing

Run sprite registry tests:

```bash
npm test tests/sprites
```

All 17 tests should pass ✅

---

For more details, see [SPRITE_REGISTRY_IMPLEMENTATION.md](../../SPRITE_REGISTRY_IMPLEMENTATION.md)
