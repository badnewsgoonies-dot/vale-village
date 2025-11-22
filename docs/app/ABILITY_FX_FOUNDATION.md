## Ability FX Foundation (GIF-based Abilities) — Audit and Plan

Goal: Display ability “FX” animations (GIFs) cleanly in the battle scene without scrolling, flicker, or layout shifts, while keeping the UI responsive and controllable.

Constraints and Non-Goals (for mock phase)
- Use existing GIF assets where possible (icons, psynergy animations, enemy/party FX).
- Zero scrolling—no overflow-induced scrollbars at any time.
- Deterministic positioning: FX never obscure critical UI for long; they respect safe areas.
- For mockups: no React integration needed; static HTML/CSS/JS is acceptable.
- For app integration: TypeScript services should orchestrate FX lifecycles; SimpleSprite can be leveraged later.

Audit Summary
- Assets Inventory:
  - Battle sprites (party/enemies) available; backgrounds present.
  - Psynergy/ability icons available in `/sprites/icons/buttons/*` and `/sprites/icons/psynergy/*` (catalog varies in mock).
  - Battle djinn GIFs not present in mockups directory; button `Djinni.gif` used as placeholder.
- Current UI:
  - Battlefield has clear enemy and party zones; predictable anchor points exist.
  - Tooltips and menus can overlay—must not be blocked or push layout.
  - Zero-scroll commitment requires absolute/fixed positioning for FX, with pointer-events tuning.

Foundation Design
1) FX Manifest (Data)
- Map abilityId → FX definition:
  - iconPath: path to small icon (e.g., `/sprites/icons/buttons/Attack.gif`)
  - stages: ordered list of animation stages:
    - gifPath: path to GIF
    - anchor: one of 'attacker', 'targets', 'screen-center', 'screen-allies', 'screen-enemies'
    - offset: { x, y } px offsets relative to anchor
    - z: overlay layer (e.g., 900 for mid, 1100 for top)
    - durationMs: nominal duration (for scheduling)
    - blend: 'normal' | 'additive' (mock as CSS opacity)
    - soundCue: optional id (app phase)
  - camera: optional { vignette: boolean, dimBackground: boolean }

2) Anchors and Coordinate System
- Define DOM anchors:
  - `#enemy-a, #enemy-b, #enemy-c`: top enemy cards/slots
  - `#party-isaac, #party-garet, #party-mia, #party-ivan`: bottom party slots
  - Fallback anchors: `#battlefield`, `#battleScreen`
- Positioning strategy:
  - Read boundingClientRect() of anchor; place absolute `<img>` in a dedicated overlay layer (`#fx-layer`) with transform translate to anchor center + offset.
  - Clamp overlay within viewport safe-area (12–16px gutter).

3) Overlay Layers
- Static markup:
  - `<div id="fx-layer" aria-hidden="true"></div>` absolutely positioned over battlefield; `pointer-events: none; z-index: 1000+`.
  - Optional `#cinematic-layer` above for big summons with backdrop dim and vignette.
- CSS:
  - `.fx` base class with `position: absolute; will-change: transform, opacity;` and `image-rendering: pixelated;`.
  - `.fx--top` / `.fx--mid` to manage z-order.

4) Lifecycle and Scheduling (Mock vs App)
- Mock:
  - A simple controller adds `<img class="fx" src="...">` to `#fx-layer`, positions it, and removes it after `durationMs`.
  - Ability hover: preview stage replays FX silently; click to confirm could queue playback.
- App:
  - A small `FxController` service orchestrates:
    - `queueFx(abilityId, attackerId, targetIds, battleStateTimestamp)`
    - Resolves anchors via DOM ids (UI layer) or logical slots (core-to-UI contract).
    - Preloads GIFs (create Image objects) to prevent jank.
    - Supports cancellation when state changes.

5) Zero-Scroll and Robustness
- Ensure `body, html` are `overflow: hidden`.
- FX use absolute overlay; they never affect layout flow.
- Clamp positions to keep FX inside viewport; flip side if near edges (simple bounds check).

6) Performance Considerations
- Reuse `img` nodes where possible; avoid excessive DOM churn.
- Preload frequently used GIFs (Attack, Fireball, Heal).
- Limit concurrent FX count; resolve priority (e.g., only 1 cinematic at a time).

7) Future-Proofing
- Transition-ready: GIFs can be swapped for spritesheets/WebM later without API changes.
- Data-driven: new abilities are added by updating the manifest only.

Example (Mock Manifest Snippet)
```json
{
  "fireball": {
    "iconPath": "./sprites/icons/buttons/Djinni.gif",
    "stages": [
      {
        "gifPath": "./sprites/psynergy/Fire_Ball.gif",
        "anchor": "targets",
        "offset": { "x": 0, "y": -12 },
        "z": 1050,
        "durationMs": 900,
        "blend": "normal"
      }
    ],
    "camera": { "vignette": false, "dimBackground": false }
  }
}
```

Minimal Mock Controller (Pseudo)
```js
function playFx(manifest, abilityId, attackerEl, targetEls) {
  const def = manifest[abilityId];
  if (!def) return;
  def.stages.forEach(stage => {
    const anchorRect = pickAnchorRect(stage.anchor, attackerEl, targetEls);
    const img = document.createElement('img');
    img.src = stage.gifPath;
    img.className = 'fx fx--mid';
    img.style.zIndex = String(stage.z || 1000);
    positionFx(img, anchorRect, stage.offset);
    document.getElementById('fx-layer').appendChild(img);
    setTimeout(() => img.remove(), stage.durationMs || 800);
  });
}
```

Testing Matrix
- Hover preview on abilities (no sound), click confirm for full FX.
- Single-target vs multi-target anchoring checks.
- Bounds clamping near edges.
- Overlapping FX (two at once) and cleanup.

Rollout
- Phase 1 (mock): Implement `#fx-layer` overlays in one or two variants (e.g., 19: Ability Preview Stage, 20: Summon Spotlight).
- Phase 2 (app): Add `FxController` in UI layer; wire from ability queue execution events.


