# Companion Sprites - Implementation Guide

**Created:** November 12, 2025  
**Mockup:** `overworld-companion-sprites.html`  
**Status:** ✅ Mockup Complete

---

## Overview

This guide demonstrates the **"follow-the-leader"** companion sprite pattern used in Golden Sun, where party members follow the player character in a line formation.

## Mockup Features

### Visual Elements
- ✅ **Leader sprite** (Isaac) - Player-controlled character
- ✅ **3 companion sprites** (Garet, Ivan, Mia) - Following in formation
- ✅ **Smooth transitions** - CSS cubic-bezier easing
- ✅ **Staggered animations** - Each companion has slight delay
- ✅ **Drop shadows** - Entity grounding on terrain
- ✅ **Party indicator HUD** - Shows 4/4 party with colored dots
- ✅ **Interactive demo** - Arrow keys or buttons to move party

### Movement Pattern
```
Leader Position: (x, y)
Companion 1: Leader's previous position (delayed 150ms)
Companion 2: Companion 1's previous position (delayed 300ms)
Companion 3: Companion 2's previous position (delayed 450ms)
```

---

## Sprite Assets Needed

### Character Overworld Sprites

All sprites should be **animated GIFs** with walk cycles (4-8 frames) for each direction:

#### Main Party (Recruitable Units)
1. **Isaac** (Venus Adept) - Leader default
   - `Isaac.gif` (idle/front)
   - `Isaac_Walk.gif`, `Isaac_Walk_Up.gif`, `Isaac_Walk_Left.gif`, `Isaac_Walk_Right.gif`
   - Available at: `/mockups/improved/sprites/overworld/Isaac*.gif`

2. **Garet** (Mars Adept)
   - `Garet.gif`, `Garet_Back.gif`, `Garet_Left.gif`, `Garet_Right.gif`
   - Walk animations with 4 directions
   - Available at: `/mockups/improved/sprites/overworld/Garet*.gif`

3. **Ivan** (Jupiter Adept)
   - `Ivan.gif`, `Ivan_Back.gif`, `Ivan_Left.gif`, `Ivan_Right.gif`
   - Available at: `/mockups/improved/sprites/overworld/Ivan*.gif`

4. **Mia** (Mercury Adept)
   - `Mia.gif`, `Mia_Back.gif`, `Mia_Left.gif`, `Mia_Right.gif`
   - Available at: `/mockups/improved/sprites/overworld/Mia*.gif`

5. **Felix** (Venus Adept)
   - `Felix.gif`, `Felix_Walk.gif`, etc.
   - Available at: `/mockups/improved/sprites/overworld/Felix*.gif`

6. **Jenna** (Mars Adept)
   - `Jenna.gif`, `Jenna_Walk.gif`, etc.
   - Available at: `/mockups/improved/sprites/overworld/Jenna*.gif`

7. **Sheba** (Jupiter Adept)
   - `Sheba.gif`, `Sheba_Situp.gif`
   - Available at: `/mockups/improved/sprites/overworld/Sheba*.gif`

8. **Piers** (Mercury Adept)
   - `Piers.gif`
   - Available at: `/mockups/improved/sprites/overworld/Piers.gif`

### Sprite Dimensions
- **Size:** ~24x32 pixels (original GBA size)
- **Scaled:** 2x-4x for modern displays
- **Format:** Animated GIF or sprite sheet PNG
- **Frames:** 4-8 frames per animation cycle
- **Directions:** 8 (N, NE, E, SE, S, SW, W, NW) or simplified 4 (N, E, S, W)

---

## Implementation Pattern

### 1. Position History Queue

Track the last N positions of the leader to create smooth following:

```typescript
interface PositionHistory {
  x: number;
  y: number;
  direction: Direction;
  timestamp: number;
}

const positionHistory: PositionHistory[] = [];
const HISTORY_LENGTH = 4; // For 4 party members
const COMPANION_DELAY = 50; // px distance between characters
```

### 2. Movement Logic

```typescript
function moveLeader(newPosition: Position, direction: Direction) {
  // Add current position to history
  positionHistory.unshift({
    x: leader.x,
    y: leader.y,
    direction: leader.direction,
    timestamp: Date.now()
  });
  
  // Keep history limited
  if (positionHistory.length > HISTORY_LENGTH * 10) {
    positionHistory.pop();
  }
  
  // Update leader
  leader.x = newPosition.x;
  leader.y = newPosition.y;
  leader.direction = direction;
  
  // Update companions
  updateCompanions();
}

function updateCompanions() {
  companions.forEach((companion, index) => {
    const historyIndex = (index + 1) * COMPANION_DELAY;
    if (positionHistory[historyIndex]) {
      companion.x = positionHistory[historyIndex].x;
      companion.y = positionHistory[historyIndex].y;
      companion.direction = positionHistory[historyIndex].direction;
    }
  });
}
```

### 3. Rendering

```tsx
// Render all party members
<div className="overworld-entities">
  {/* Leader */}
  <Sprite
    id={`unit:${leader.unitId}`}
    position={leader.position}
    direction={leader.direction}
    state="walk"
    zIndex={calculateZIndex(leader.position.y)}
  />
  
  {/* Companions */}
  {companions.map((companion, index) => (
    <Sprite
      key={companion.unitId}
      id={`unit:${companion.unitId}`}
      position={companion.position}
      direction={companion.direction}
      state="walk"
      zIndex={calculateZIndex(companion.position.y)}
      delay={index * 150} // Animation stagger
    />
  ))}
</div>
```

---

## Technical Specifications

### CSS Classes
```css
.companion {
  animation: subtle-bob 1.8s ease-in-out infinite;
  opacity: 0.95;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.companion-1 { animation-delay: 0.2s; }
.companion-2 { animation-delay: 0.4s; }
.companion-3 { animation-delay: 0.6s; }
```

### Z-Index Layering
- **Ground/Terrain:** 0
- **Paths:** 2
- **Scenery (trees, buildings):** 5
- **Entity shadows:** 8
- **Entities (player/companions):** 10
- **Entity labels:** 11
- **UI/HUD:** 100

### Animation States
1. **Idle** - Standing still (looping animation)
2. **Walk** - Walking animation (8 frames, 12 fps)
3. **Run** - Faster walk cycle (optional)

### Direction Mapping
```typescript
const DIRECTIONS = {
  up: 0,
  upRight: 1,
  right: 2,
  downRight: 3,
  down: 4,
  downLeft: 5,
  left: 6,
  upLeft: 7,
} as const;
```

---

## Viewing the Mockup

### Option 1: Direct Browser
1. Open `/workspace/mockups/improved/overworld-companion-sprites.html` in a web browser
2. Use arrow keys (↑↓←→) or buttons to move the party
3. Observe the follow-the-leader movement pattern

### Option 2: Local Server
```bash
cd /workspace/mockups/improved
python3 -m http.server 8000
# Open http://localhost:8000/overworld-companion-sprites.html
```

### Option 3: ChatGPT Canvas
Use the prompt below to view the mockup in ChatGPT:

---

## ChatGPT Viewing Prompt

```
I have an HTML mockup for companion sprites in a Golden Sun-style overworld. 
Can you display this HTML file and show me how it looks?

[Paste the contents of overworld-companion-sprites.html here]

After displaying it, can you:
1. Take a screenshot showing the companion formation
2. Describe the visual layout (leader + 3 companions)
3. Suggest any visual improvements

The mockup demonstrates a "follow-the-leader" pattern where party members 
trail behind the player character in a line formation, each with staggered 
animations.
```

---

## Integration Checklist

When implementing in React:

- [ ] Create `CompanionSprite` component
- [ ] Add position history tracking to `overworldSlice`
- [ ] Implement `updateCompanionPositions()` service function
- [ ] Add companion rendering to `OverworldMap.tsx`
- [ ] Load companion sprites from manifest
- [ ] Handle direction changes for companions
- [ ] Add animation state transitions
- [ ] Test with different party sizes (1-4 members)
- [ ] Add tests for position history queue
- [ ] Verify z-index layering with terrain

---

## Design Decisions

### Why Follow-the-Leader?
- **Authentic Golden Sun behavior** - Matches original game exactly
- **Simple state management** - Only track position history
- **Smooth visuals** - Natural trailing effect
- **Performant** - No pathfinding required

### Why Position History Queue?
- **Deterministic** - Same input = same output
- **Replayable** - Can reconstruct companion movement
- **Testable** - Pure function for companion positions
- **Flexible** - Easy to adjust delay/spacing

### Why Staggered Animations?
- **Visual appeal** - Breaks up uniformity
- **Depth perception** - Creates sense of 3D movement
- **Polish** - Small details enhance immersion

---

## Next Steps

1. **Review mockup** - Verify visual accuracy matches Golden Sun
2. **Extract sprites** - Gather all character walk cycle GIFs
3. **Define sprite manifest** - Add entries for all party members
4. **Implement in React** - Convert mockup to components
5. **Test movement** - Verify smooth following behavior
6. **Add edge cases** - Handle party size changes, teleports, etc.

---

**Status:** ✅ Mockup complete and ready for review
**File:** `/workspace/mockups/improved/overworld-companion-sprites.html`
**Sprites Available:** `/mockups/improved/sprites/overworld/*.gif`
