# Camera System & Game Viewport

This document explains how to use the Camera System and Game Viewport for creating cinematic moments in Vale Village.

## Overview

The camera system consists of two parts:

1. **GameViewport** - Maintains aspect ratio, scales the game, handles window resizing
2. **CameraProvider** - Controls zoom, pan, focus, shake, and rotation

## GameViewport

The viewport is already set up in `App.tsx` and wraps your entire game:

```tsx
<GameViewport
  aspectRatio={1.6}        // 16:10 like Golden Sun (default)
  baseWidth={800}          // Base resolution width (default)
  integerScaling={false}   // Pixel-perfect scaling (optional)
>
  {/* Your game content */}
</GameViewport>
```

### Features

- ✅ **Maintains aspect ratio** - Game always renders at 16:10 (or custom ratio)
- ✅ **Auto-scales to fit window** - Resizes when browser window changes
- ✅ **Letterboxing/Pillarboxing** - Black bars on sides if needed
- ✅ **Everything scales together** - UI, sprites, camera zoom all unified
- ✅ **Pixel-perfect option** - Set `integerScaling={true}` for crisp pixels

## Camera Controls

### Using the Camera Hook

Import and use the camera hook in any component:

```tsx
import { useCamera } from '@/context/CameraContext';

function MyComponent() {
  const { camera, controls } = useCamera();

  // Now you can control the camera!
}
```

### Available Controls

#### 1. **Zoom**

```tsx
// Zoom to specific level (1.0 = normal, 2.0 = 2x zoom)
controls.zoomTo(1.5, 800); // Zoom to 1.5x over 800ms

// Zoom in/out by amount
controls.zoomIn(0.3, 500);   // Zoom in by 0.3x over 500ms
controls.zoomOut(0.3, 500);  // Zoom out by 0.3x over 500ms

// Instant zoom (no duration)
controls.setZoom(2.0);
```

#### 2. **Pan (Move Camera)**

```tsx
// Pan to absolute position
controls.panTo(100, 200, 800); // Pan to (100, 200) over 800ms

// Pan by relative amount
controls.panBy(50, -30, 500); // Move camera 50px right, 30px up

// Instant pan
controls.setPosition(0, 0);
```

#### 3. **Focus (Zoom + Pan Combined)**

```tsx
// Focus on a character/object
const npcPosition = { x: 400, y: 300 };
controls.focusOn(npcPosition, {
  zoom: 1.8,              // Optional: zoom level
  duration: 1000,         // Animation duration (ms)
  offset: { x: 0, y: -50 } // Optional: offset from target
});

// Just pan to target (keep current zoom)
controls.focusOn(npcPosition);
```

#### 4. **Screen Shake**

```tsx
// Shake with preset intensity
controls.shake('light', 300);   // Light shake for 300ms
controls.shake('medium', 500);  // Medium shake
controls.shake('heavy', 800);   // Heavy shake

// Custom intensity (0.0 - 1.0)
controls.shake(0.75, 600);
```

#### 5. **Rotation** (Advanced)

```tsx
// Rotate camera (degrees)
controls.rotate(5, 500);  // Tilt 5 degrees over 500ms
controls.rotate(0, 500);  // Return to normal
```

#### 6. **Reset**

```tsx
// Reset to default state
controls.reset(800); // Reset over 800ms
```

## Examples

### Example 1: Dramatic Dialogue Zoom

```tsx
import { useCamera } from '@/context/CameraContext';

function DialogueScreen() {
  const { controls } = useCamera();

  const showDramaticLine = () => {
    // Zoom in on character's face
    controls.zoomTo(1.8, 1200);

    // After dialogue, zoom back out
    setTimeout(() => {
      controls.zoomTo(1.0, 1000);
    }, 3000);
  };

  return (
    <div onClick={showDramaticLine}>
      "This... cannot be happening..."
    </div>
  );
}
```

### Example 2: Boss Battle Intro

```tsx
function BossBattleIntro() {
  const { controls } = useCamera();

  useEffect(() => {
    // Sequence of camera movements
    const playIntro = async () => {
      // 1. Focus on boss entrance
      controls.focusOn({ x: 400, y: 200 }, {
        zoom: 2.0,
        duration: 1500
      });

      await sleep(2000);

      // 2. Heavy shake when boss roars
      controls.shake('heavy', 800);

      await sleep(1000);

      // 3. Zoom out to battlefield view
      controls.zoomTo(1.0, 1000);
    };

    playIntro();
  }, []);
}
```

### Example 3: Cutscene Sequence

```tsx
function Cutscene() {
  const { controls } = useCamera();

  const playCutscene = async () => {
    // Start zoomed out
    controls.zoomTo(0.8, 1000);
    await sleep(1500);

    // Pan to character 1
    controls.focusOn({ x: 200, y: 300 }, { zoom: 1.5, duration: 1000 });
    await sleep(2000); // Character 1 speaks

    // Pan to character 2
    controls.focusOn({ x: 600, y: 300 }, { zoom: 1.5, duration: 800 });
    await sleep(2000); // Character 2 responds

    // Dramatic zoom on character 1's reaction
    controls.focusOn({ x: 200, y: 250 }, { zoom: 2.2, duration: 600 });
    await sleep(1500);

    // Reset to normal view
    controls.reset(1200);
  };

  return <button onClick={playCutscene}>Play Cutscene</button>;
}
```

### Example 4: Impact Effects

```tsx
function BattleHitEffect() {
  const { controls } = useCamera();

  const showImpact = () => {
    // Quick zoom in + shake for impact
    controls.zoomTo(1.3, 100);
    controls.shake('heavy', 300);

    // Zoom back out
    setTimeout(() => {
      controls.zoomTo(1.0, 400);
    }, 300);
  };

  return <button onClick={showImpact}>ATTACK!</button>;
}
```

### Example 5: Following an NPC During Dialogue

```tsx
function DialogueWithNPC({ npc }) {
  const { controls } = useCamera();

  useEffect(() => {
    // Focus camera on NPC when dialogue starts
    controls.focusOn(npc.position, {
      zoom: 1.4,
      duration: 800,
      offset: { x: 0, y: -20 } // Focus slightly above center
    });

    // Reset when dialogue ends
    return () => {
      controls.reset(600);
    };
  }, [npc.position]);

  return <DialogueBox npc={npc} />;
}
```

## Integration with Existing Systems

### In Dialogue System

Add to `src/components/dialogue/DialogueScreen.tsx`:

```tsx
import { useCamera } from '@/context/CameraContext';

export const DialogueScreen: React.FC = () => {
  const { controls } = useCamera();

  // Zoom when important dialogue appears
  const handleImportantDialogue = () => {
    controls.zoomTo(1.6, 800);
  };

  // Reset when dialogue ends
  const handleDialogueEnd = () => {
    controls.reset(600);
  };
};
```

### In Battle System

Add to `src/components/battle/BattleScreen.tsx`:

```tsx
import { useCamera } from '@/context/CameraContext';

export const BattleScreen: React.FC = () => {
  const { controls } = useCamera();

  // Shake on hit
  const handleAttack = () => {
    controls.shake('medium', 400);
  };

  // Focus on summon
  const handleSummon = () => {
    controls.focusOn(summonPosition, { zoom: 2.0, duration: 1000 });
  };
};
```

### In Overworld

Add to `src/components/overworld/OverworldScreen.tsx`:

```tsx
import { useCamera } from '@/context/CameraContext';

export const OverworldScreen: React.FC = () => {
  const { controls } = useCamera();

  // Zoom out for exploration
  const exploreMode = () => {
    controls.zoomTo(0.7, 600);
  };

  // Focus on event location
  const triggerEvent = (position) => {
    controls.focusOn(position, { zoom: 1.8, duration: 1200 });
  };
};
```

## Camera State Access

You can also read the current camera state:

```tsx
const { camera, controls } = useCamera();

console.log(camera.zoom);      // Current zoom level
console.log(camera.position);  // Current camera position
console.log(camera.shake);     // Current shake state
console.log(camera.rotation);  // Current rotation
```

## Performance Notes

- Transformations use GPU-accelerated CSS (`transform`, `scale`)
- Transitions use `ease-out` easing for natural motion
- All durations are in milliseconds
- Camera updates are batched for performance

## Advanced: Custom Easing

Currently uses CSS `ease-out`. To customize, modify the transition in `CameraContext.tsx`:

```tsx
transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
```

## Tips

1. **Timing is key** - Use `await sleep()` between camera movements
2. **Don't overuse zoom** - Save dramatic zooms for important moments
3. **Match zoom to content** - Close-ups for dialogue, wide for exploration
4. **Combine effects** - Zoom + pan + shake for maximum impact
5. **Reset after scenes** - Always return to normal view after cinematics

## Helper Function

Add this to your utils:

```tsx
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

## Troubleshooting

**Camera not working?**
- Make sure you're inside `<CameraProvider>`
- Check that GameViewport is wrapping your app

**Jumpy animations?**
- Increase duration (try 800-1200ms for smooth motion)
- Check if multiple camera commands are conflicting

**Viewport not scaling?**
- Verify GameViewport is the outermost wrapper in App.tsx
- Check browser console for errors

## Next Steps

Want to add more features?
- **Camera shake patterns** (earthquake, vibration, etc.)
- **Camera paths** (keyframe-based movement)
- **Depth of field** (blur distant objects)
- **Parallax layers** (background moves slower than foreground)

Happy filming! 🎬
