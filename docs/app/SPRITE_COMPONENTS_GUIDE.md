# Sprite Components Guide

**For Mockups & Scene Redesign**

This guide explains how to use the sprite components for creating mockups and redesigning game scenes.

---

## Quick Start

### SimpleSprite - For Characters, Enemies, Items, Icons

```tsx
import { SimpleSprite } from '@/ui/sprites';

// Basic usage
<SimpleSprite id="isaac-lblade-front" width={64} height={64} />

// With styling
<SimpleSprite 
  id="goblin" 
  width={48} 
  height={48}
  style={{ border: '1px solid #ccc', borderRadius: '4px' }}
/>

// Debug mode (shows sprite info on hover)
<SimpleSprite 
  id="isaac-battle-idle"
  width={64}
  height={64}
  debug={true}
/>
```

### BackgroundSprite - For Battle/Overworld Backgrounds

```tsx
import { BackgroundSprite } from '@/ui/sprites';

// Random background from category
<BackgroundSprite 
  id="random" 
  category="backgrounds-gs1"
  style={{ width: '100%', height: '100%' }}
/>

// Specific background
<BackgroundSprite id="vale-forest" />
```

---

## Finding Sprites

### Method 1: Flexible ID Lookup (Recommended)

The catalog system uses smart keyword matching:

```tsx
// These all work:
<SimpleSprite id="isaac-lblade-front" width={64} height={64} />
<SimpleSprite id="isaac-battle-idle" width={64} height={64} />
<SimpleSprite id="goblin" width={48} height={48} />
```

The component searches the catalog for sprites matching your keywords.

### Method 2: Direct Path

```tsx
<SimpleSprite 
  id="/sprites/battle/party/isaac/Isaac_lBlade_Front.gif"
  width={64}
  height={64}
/>
```

### Method 3: Search Catalog Programmatically

```tsx
import { searchSprites, getSpritesByCategory } from '@/ui/sprites';

// Find all Isaac sprites
const isaacSprites = searchSprites('isaac');
console.log(isaacSprites); // Array of sprite entries

// Get all battle party sprites
const partySprites = getSpritesByCategory('battle-party');
console.log(partySprites); // Array of sprite entries
```

---

## Sprite Categories

Available categories (1,627 sprites total):

- `battle-party` - Player character battle sprites (254 sprites)
- `battle-enemies` - Enemy battle sprites (173 sprites)
- `battle-bosses` - Boss sprites (16 sprites)
- `battle-djinn` - Djinn battle sprites (8 sprites)
- `battle-summons` - Summon animations (62 sprites)
- `backgrounds-gs1` - Golden Sun 1 backgrounds (36 sprites)
- `backgrounds-gs2` - Golden Sun 2 backgrounds (36 sprites)
- `overworld-protagonists` - Character walk cycles (120 sprites)
- `overworld-majornpcs` - Major NPCs (54 sprites)
- `overworld-minornpcs` - Minor NPCs (70 sprites)
- `icons-buttons` - UI button icons (55 sprites)
- `icons-items` - Item/equipment icons (366 sprites)
- `icons-psynergy` - Ability icons (214 sprites)
- `icons-characters` - Character portraits (100 sprites)
- `psynergy` - Ability animations (19 sprites)
- `scenery-buildings` - Building sprites (130 sprites)
- `scenery-indoor` - Indoor tiles (241 sprites)
- `scenery-outdoor` - Outdoor tiles (144 sprites)
- `scenery-plants` - Plant decorations (47 sprites)
- `scenery-statues` - Statue decorations (27 sprites)
- `text` - Text/number sprites (90 sprites)

---

## Debug Mode

Enable debug mode to see sprite information:

```tsx
<SimpleSprite 
  id="isaac-lblade-front"
  width={64}
  height={64}
  debug={true}
/>
```

Hover over the sprite to see:
- Sprite name
- File path
- Category
- Lookup method
- Load status

This is **extremely useful** for mockups to verify you're using the right sprites!

---

## Common Patterns for Mockups

### Battle Scene Mockup

```tsx
<div style={{ position: 'relative', width: '800px', height: '600px' }}>
  {/* Background */}
  <BackgroundSprite 
    id="random"
    category="backgrounds-gs1"
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 0,
    }}
  />
  
  {/* Player Units */}
  <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1rem' }}>
    <SimpleSprite id="isaac-lblade-front" width={64} height={64} />
    <SimpleSprite id="garet-lblade-front" width={64} height={64} />
  </div>
  
  {/* Enemies */}
  <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1rem' }}>
    <SimpleSprite id="goblin" width={64} height={64} />
  </div>
</div>
```

### Menu Screen Mockup

```tsx
<div style={{ padding: '2rem' }}>
  <h2>Equipment Menu</h2>
  
  {/* Equipment Icons */}
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
    <SimpleSprite id="wooden-sword" width={48} height={48} />
    <SimpleSprite id="steel-sword" width={48} height={48} />
    <SimpleSprite id="leather-armor" width={48} height={48} />
    {/* ... */}
  </div>
</div>
```

### Overworld Mockup

```tsx
<div style={{ position: 'relative', width: '1000px', height: '800px' }}>
  {/* Background tiles */}
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 32px)' }}>
    {/* Use scenery sprites for tiles */}
  </div>
  
  {/* Character */}
  <SimpleSprite 
    id="isaac-overworld-south"
    width={32}
    height={32}
    style={{ position: 'absolute', top: '100px', left: '200px' }}
  />
</div>
```

---

## Tips for Mockups

1. **Use Debug Mode** - Always enable `debug={true}` when designing to verify sprites
2. **Search First** - Use `searchSprites('keyword')` to find available sprites
3. **Check Categories** - Browse categories to see what's available
4. **Fallbacks** - Missing sprites show colored placeholders (useful for identifying gaps)
5. **GIF Animation** - All sprites are GIFs and animate automatically
6. **Pixel Perfect** - Use `imageRendering="pixelated"` (default) for crisp pixel art

---

## API Reference

### SimpleSprite Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Sprite ID (flexible lookup) or direct path |
| `width` | `number` | **required** | Width in pixels |
| `height` | `number` | **required** | Height in pixels |
| `style` | `CSSProperties` | `undefined` | Custom CSS styles |
| `className` | `string` | `undefined` | CSS class name |
| `debug` | `boolean` | `false` | Show debug info on hover |
| `fallback` | `ReactNode` | `undefined` | Custom fallback when sprite not found |
| `alt` | `string` | `undefined` | Alt text for accessibility |
| `imageRendering` | `'pixelated' \| 'auto' \| 'smooth'` | `'pixelated'` | Image rendering mode |
| `objectFit` | `'contain' \| 'cover' \| 'fill'` | `'contain'` | Object fit mode |
| `onLoad` | `() => void` | `undefined` | Callback when sprite loads |
| `onError` | `(error: string) => void` | `undefined` | Callback when sprite fails |

### BackgroundSprite Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Background ID or "random" |
| `category` | `string` | `undefined` | Category (required if id="random") |
| `style` | `CSSProperties` | `undefined` | Custom CSS styles |
| `className` | `string` | `undefined` | CSS class name |
| `sizeMode` | `'cover' \| 'contain' \| 'fill'` | `'cover'` | Background size mode |
| `position` | `string` | `'center center'` | Background position |
| `repeat` | `'no-repeat' \| 'repeat' \| ...` | `'no-repeat'` | Background repeat |
| `debug` | `boolean` | `false` | Show debug info |
| `onLoad` | `() => void` | `undefined` | Callback when background loads |
| `onError` | `(error: string) => void` | `undefined` | Callback when background fails |

---

## Troubleshooting

### Sprite Not Found

If a sprite doesn't appear:

1. **Check Debug Mode** - Enable `debug={true}` to see lookup details
2. **Try Direct Path** - Use full path: `/sprites/battle/party/isaac/Isaac_lBlade_Front.gif`
3. **Search Catalog** - Use `searchSprites('keyword')` to find similar sprites
4. **Check Console** - Debug mode logs warnings/errors

### Sprite Looks Wrong

- Check sprite dimensions match your `width`/`height` props
- Try different `objectFit` values: `'contain'`, `'cover'`, `'fill'`
- Verify you're using the right sprite ID (use debug mode)

### Performance

- Sprites are GIFs and load on-demand
- Use `onLoad` callback to detect when sprites are ready
- Consider preloading sprites for critical scenes

---

## Examples

See these files for real usage examples:

- `src/ui/components/BattleView.tsx` - Battle scene
- `src/ui/components/UnitCard.tsx` - Unit sprites
- `src/ui/sprites/ButtonIcon.tsx` - Button icons

---

**Happy Mockup Designing! 🎨**

