# Sprite Kit Reference

Authoritative guide for all battle/UI sprites, verified paths, and Figma-ready specs for Vale Chronicles V2.

## Asset Organization
- Root: `public/sprites/` (served statically by Vite; reference via `/sprites/...`)
- Totals: Party 132, Djinn 4, Enemies 173, Icons 186, Backgrounds 72 (checked via `find public/sprites/...`)
- Sizes: Party 64×64; Djinn 32×32 (scale 2× for prominence); Enemies mixed (48–128); Icons mixed (12–32); Backgrounds 256×120.

```
public/sprites/
├─ battle/
│  ├─ party/{isaac|garet|mia|ivan}/*.gif
│  ├─ djinn/*.gif
│  └─ enemies/*.gif
├─ backgrounds/{gs1|gs2}/*.gif
└─ icons/
   ├─ buttons/*.gif
   ├─ misc/*.gif
   └─ characters/*.gif
```

## Figma Integration Guide
- Canvas: enable Pixel Preview; Frame 960×540 (16:9); background nearest-neighbor.
- Scaling: only integer multiples (1×, 2×, 3×); no fractional scaling or smoothing.
- Import: set Image Smoothing = None; constrain proportions; snap positions to integer px.
- Frames: keep separate frames for Party Row, Djinn Panel, Ability Grid, Background to ease export.

## Sprite Inventories

### Party Sprites (132 files, 64×64)
| Character | Weapon Variants | States (per variant) | Count | Path Pattern |
|-----------|-----------------|----------------------|-------|--------------|
| Isaac     | Axe, lBlade, lSword, Mace | Front, Back, Attack1/2, CastFront1/2, CastBack1/2, DownedFront/Back, HitFront/Back | 48 | `public/sprites/battle/party/isaac/Isaac_<Weapon>_<State>.gif` |
| Garet     | Axe, lBlade, lSword | Same as above | 36 | `public/sprites/battle/party/garet/Garet_<Weapon>_<State>.gif` |
| Mia       | Mace, Staff | Same as above | 24 | `public/sprites/battle/party/mia/Mia_<Weapon>_<State>.gif` |
| Ivan      | lBlade, Staff | Same as above | 24 | `public/sprites/battle/party/ivan/Ivan_<Weapon>_<State>.gif` |

Notes:
- Front-facing idle sprites used in bottom UI: e.g., `public/sprites/battle/party/isaac/Isaac_lSword_Front.gif`.
- Multi-hit autos come from weapon variant (e.g., double-hit swords).

### Djinn Sprites (4 files, 32×32 base → scale 2× for 64×64)
| Element | Path | Usage |
|---------|------|-------|
| Venus (Flint)   | `public/sprites/battle/djinn/Venus_Djinn_Front.gif`   | Advisor panel, summons |
| Mars (Granite)  | `public/sprites/battle/djinn/Mars_Djinn_Front.gif`    | Advisor panel, summons |
| Mercury (Echo)  | `public/sprites/battle/djinn/Mercury_Djinn_Front.gif` | Advisor panel, summons |
| Jupiter (bonus) | `public/sprites/battle/djinn/Jupiter_Djinn_Front.gif` | Optional fourth slot |

### Enemy Sprites (173 files)
- Location: `public/sprites/battle/enemies/*.gif`
- Size classes (measure bounding box on import):
  - Small ≈ 48×48
  - Medium ≈ 64–96
  - Large ≈ 96–128
- Battlefield placement: pair size class with ellipse: Small 120×28, Medium 150×32, Large 200×40 (opacity 0.25–0.35, light border).

### UI Icons (186 files total)
| Category | Count | Path | Highlights |
|----------|-------|------|------------|
| Buttons  | 55 | `public/sprites/icons/buttons/*.gif` | Attack/Defend/Item/Psynergy/Djinni/Summon buttons, HP/PP bars, cursors |
| Misc (status) | 31 | `public/sprites/icons/misc/*.gif` | `Poison.gif`, `Silence.gif`, `curse.gif`, `Psynergy_Seal.gif`, `delusion.gif`, `attack_up.gif`, `defense_up.gif`, `resist_up.gif`, `Stat-Up.gif`, `Stat-Down.gif`, `cursor.gif` |
| Characters | 100 | `public/sprites/icons/characters/*.gif` | Portrait-style icons and special UI markers |

### Backgrounds & Battlefield Elements (72 files)
| Set | Count | Path | Notes |
|-----|-------|------|-------|
| GS1 | 36 | `public/sprites/backgrounds/gs1/*.gif` | Example: `Desert.gif` (256×120) |
| GS2 | 36 | `public/sprites/backgrounds/gs2/*.gif` | Same sizing; mix of caves, forests, towers |

## Color Palette Reference
- Mana: available `#FFD54A`; pending (this round) `rgba(255, 213, 74, 0.35)`; empty = transparent + light border.
- Elements (suggested): Venus `#D1B354`, Mars `#E55B3C`, Mercury `#4CA3DD`, Jupiter `#8A5AD7`.
- UI: Active border `#F6E8B1`, Panels `#0F0F10CC`, Text `#E9E4D6`, Disabled `#777`.

## Export Guidelines
- Snap all layers to integer coordinates; avoid sub-pixel positions.
- Scale only in whole multiples; never resample with smoothing.
- Figma export: PNG, 1× or 2× per need; set "Pixel preview" and "Nearest neighbor" on export.
- Keep transparent backgrounds; do not trim padding around sprites (maintains alignment).
- For animated GIFs, preserve frame order and duration; avoid recompression.

## Integration Notes
- Access assets via `/sprites/...` at runtime (Vite serves `public/` root). Example: `<img src="/sprites/battle/party/isaac/Isaac_lSword_Front.gif" />`.
- Component suggestion: `<Sprite>` that accepts `path`, `alt`, `width/height`, and optional `scale` to centralize nearest-neighbor styling.
- Preload critical assets (party fronts, djinn, UI buttons) during battle load to avoid layout shift; lazy-load enemy sprites per encounter.
- Keep deterministic sizing: render party at 64×64 (or 128×128 scaled 2×), djinn at 64×64 scaled, and enemies per size class with matching ellipses.
