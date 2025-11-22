## Elevated Battle Mock Concepts (20 variants)

Design goals across all variants:
- Zero scrolling: no scrollbars; all content is visible at 1280×800 or scales responsively without overflow.
- Crystal-clear sprite placements: readable enemy and party formations; consistent baselines; no overlapping hit areas.
- Djinn visibility: tangible sprites or clear icons; menu stays open on hover/focus without flicker.
- Abilities affordance: icon-first with concise label, mana cost, target type; hover tooltips nearby, non-blocking.
- Combat log legibility: punchy hierarchy, color-coded events; unobtrusive but always accessible.

1) Grid Classic (Baseline+ polish)
- Formation: 3-enemy grid top, 4-party line bottom on shared baseline.
- Left portrait stack, bottom abilities + right combat log.
- Djinn mini-row top-right.
- Sprites: party “Front” GIFs; enemies single GIFs; background: GS1 cave.
- Rationale: clean, straightforward; control group for testing other variants.

2) Compact HUD Top
- Condense top HUD: mana circles + djinn centered top; smaller typography.
- Left portraits become thin chips; larger battlefield.
- Abilities bottom as a shorter dock; log overlays on background lower-left.
- Rationale: maximizes combat theater; keeps status readable.

3) Enemy Arc Stance
- Enemies placed in a shallow arc (perspective hints) with slight scale variance (rear smaller).
- Party in subtle arc mirror at bottom; maintain consistent ground shadow.
- Rationale: cinematic depth without complexity.

4) Isometric Stagger
- Staggered enemy positions with faux-isometric offsets; cross-shadow to imply height.
- Party staggered similarly, front two slightly bigger; shared perspective grid.
- Rationale: tactical feel with strong depth cues.

5) V-Formation Party
- Party in strong V; leader centered; flanks recessed.
- Abilities dock is split: quick-actions left; specials right; log in center overlay panel.
- Rationale: emphasizes leader-driven planning.

6) Portrait Ribbons
- Left portraits become ribbon cards with soft gradients; hover reveals expanded stats card to the right.
- Djinn menu in a floating token tray below mana.
- Rationale: elegant identity focus.

7) Portrait Chips Minimal
- Micro portrait chips w/ HP pips; hover shows full portrait + stats card.
- Larger battlefield; abilities become two-row tile grid bottom.
- Rationale: minimal navigation chrome, maximal scene.

8) Bottom Dock XL
- Abilities bottom takes 40% height; two columns: tiles + large description; log a thin ticker above dock.
- Rationale: teaching-first layout—abilities are the star.

9) Right-Side Command Stack
- Move abilities to right vertical stack; portrait panel left; battlefield centered.
- Log bottom-left overlay; djinn pinned top-right.
- Rationale: RTS-like command palette; great for long lists.

10) Radial Ability Ring
- Abilities appear in a radial ring around current unit sprite on hover/focus.
- Zero scroll by keeping ring within safe radius; log bottom static.
- Rationale: fast selection; spatial mental model.

11) Ability Tiles Grid
- 3×N tile grid with large icons and target glyphs; description in a persistent right card.
- Rationale: console-friendly, clear scanning.

12) Card Stack with Peek
- Abilities as stacked cards; hover peeks expand; click promotes to primary.
- Rationale: delightful browsing with hierarchy.

13) Combat Log Overlay Film
- Log as semi-transparent film at lower third; fades on inactivity; mouseover pins it.
- Rationale: cinematic + informative.

14) Minimalist No Panels
- Portraits as floating avatars; command strip overlay; battlefield fills nearly all.
- Rationale: ultra-clean; relies on affordances + tooltips.

15) Cinematic Expanded Theater
- Enemies scaled up; camera “crop” effect with vignette; UI floats at edges.
- Rationale: boss battle vibe; focuses attention.

16) Split-View Tactics
- Left: battlefield; right: info pane with abilities/log tabs (no scroll; tabbed).
- Rationale: data-dense; toggles avoid scroll.

17) Turn Order Band
- Thin turn-order pill band across the top; portraits and abilities slimmed to fit.
- Rationale: planning clarity for advanced users.

18) Djinn Cascade Menu
- Djinn tray top-right; hover expands cascading menu with summon combos; pins until dismissed.
- Rationale: makes Djinn system inviting and learnable.

19) Ability Preview Stage
- Top-left preview stage plays the ability’s GIF on hover; anchored; muted until click.
- Rationale: playful feedback; prevents occlusion.

20) Summon Spotlight
- Center overlay spotlight for summons (big animated GIF), UI dims; dismissable after play.
- Rationale: dramatic set-pieces without permanent UI cost.

Sprite Placement Principles
- Baselines: all sprites align to logical ground lines; use shadow pucks to unify depth.
- Safe areas: respect gutters for tooltips/log; no overflow/h-scroll.
- Z-index: enemy > party > background; overlays above but pointer-events: none unless interactive.
- Sizing: party 64–80px cells; enemies 80–96px; scale subtly in depth variants.

Zero-Scroll Constraints
- Enforce overflow: hidden on body/container.
- Tooltips positioned within viewport; flip sides if near edge.
- Abilities/log use tabs or two-column splits—never require scrolling.

Assets
- Battle backgrounds: `/mockups/improved/sprites/backgrounds/gs1/*`
- Party: `/mockups/improved/sprites/battle/party/{unit}/*Front.gif`
- Enemies: `/mockups/improved/sprites/battle/enemies/*.gif`
- Icons: `/mockups/improved/sprites/icons/buttons/*.gif`, `/characters/*.gif`
- Djinn: use buttons/Djinni.gif placeholder in mockups (battle djinn not present here)


