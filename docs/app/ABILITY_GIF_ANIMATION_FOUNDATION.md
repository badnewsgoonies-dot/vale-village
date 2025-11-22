# Ability GIF Animation Foundation

This document defines the first implementation layer for playing GIF-based ability animations on the battle screen (mockups and app). It focuses on compositing, timing, anchoring, and asset management with a minimal API that can scale.

## Goals
- Zero scrolling, zero layout shifts: animations overlay the battlefield without impacting layout.
- Layered composition: abilities render above sprites, do not intercept pointer events, and auto-clean up.
- Deterministic placements: animations anchor to units (ally/enemy) or absolute coordinates.
- Minimal, portable API to use in mockups and future React integration.

## Rendering Model

Layers (top → bottom):
1. Ability Animation Layer (absolute, pointer-events: none, z-index: 999)
2. UI Overlays (tooltips, menus)
3. Battlefield Sprites (enemies, allies)
4. Background (parallax/scene)

The animation layer is a single `<div>` absolutely positioned inside the battlefield container (`#battlefield` in mockups). Every animation is an `<img>` with absolute positioning placed relative to that container.

## Anchoring

Anchoring uses either:
- A CSS selector/Element referencing a target (e.g., `#enemy-b`, `#ally-isaac`) — we compute the element's center in the layer's coordinate space and apply an `(x, y)` offset.
- Absolute coordinates (future extension): Pass `{ x, y }` screen-space coordinates for free placement (e.g., ground slashes).

## Timing and Cleanup

- Each animation specifies `durationMs` and is removed automatically after the duration elapses.
- Sequences (multi-hit, chained effects) are scheduled with small delays (e.g., 250–350 ms) for satisfying cadence.

## Preloading

- A small in-memory cache preloads GIFs on first request to avoid first-frame delay.
- On app boot or battle plan preview, preload ability GIFs for currently equipped/available abilities to avoid hitches.

## Minimal API (Mockup)

Implemented in `mockups/improved/js/ability-animations-foundation.js`:

```js
window.AbilityAnimations = {
  preload(url)            // Promise<string>
  play(options)           // play one animation
  playSequence(schedule)  // schedule array for chained effects
}
```

Options for `play()`:
- `containerSelector`: CSS selector for battlefield container (default: `#battlefield`)
- `gifUrl`: path to GIF
- `anchorSelector`: CSS selector/Element to anchor to
- `offset`: `{ x, y }` offset from anchor center
- `width`, `height`: pixel size of the animation
- `durationMs`: how long to keep the image on screen
- `className`: optional class for advanced styling

## Asset Strategy

Until full psynergy animations are copied into the mockups directory, we use available icons as placeholders:
- Attack: `./sprites/icons/buttons/Attack.gif`
- Fireball: `./sprites/icons/buttons/Djinni.gif` (placeholder)
- Heal: `./sprites/icons/buttons/Cure_Poison.gif`
- Spark: `./sprites/icons/buttons/Battle.gif`

When the actual ability-effect GIFs are available (e.g. `/sprites/psynergy/{effect}.gif`), update mappings and preload lists.

## React Integration Plan (Next Phase)

1. Create a `BattleAnimationLayer` React component that:
   - Attaches an absolutely positioned layer to the `battlefield` container
   - Exposes imperative `play` / `playSequence` via context or a slice (Zustand action)
   - Handles preloading based on current unit abilities and planned actions

2. Define an `AbilityEffectRegistry`:
   - `abilityId -> { gifUrl, width, height, defaultOffset }`
   - Fallback to generic icons if missing

3. Extend `QueueBattleService` to emit animation cues:
   - On action preview: show light, translucent ghost effect
   - On execution: show full animation on targets with correct timing

4. Performance Considerations:
   - Preload at round start for all queued abilities
   - Keep the number of concurrent animations bounded (e.g., 6–8)
   - Consider webm/mp4 for heavier effects if needed (future)

## Testing Scenarios

- Single-target ability anchored to a specific enemy
- Multi-hit sequence hopping between enemies
- Ally-target heal anchored to ally plate
- Concurrent effects: burn tick + new attack
- Window resize (layer repositions with anchors)

## Open Items

- Finalize the real psynergy GIF paths and naming
- Design sound hooks parallel to the animation cues
- Consider status effect overlays (burn, poison) as persistent badges on plates




