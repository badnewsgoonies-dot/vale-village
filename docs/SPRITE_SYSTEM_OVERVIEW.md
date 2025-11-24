# Sprite System Overview

This document explains how Vale Chronicles V2 loads sprites, the meaning of the
different identifier types, and which mapping helpers power each screen.

## Identifier Types

The runtime works with two complementary identifier styles:

| Type        | Example path / slug                                | Usage                                                                 |
|-------------|----------------------------------------------------|-----------------------------------------------------------------------|
| **Path ID** | `/sprites/overworld/protagonists/Isaac.gif`        | Literal files that live under `public/sprites/**`. These must exist in the generated catalog and are returned by mapping helpers when the UI knows the exact asset to render. |
| **Semantic ID** | `isaac-lblade-front`, `venus-djinn-front`      | Human-friendly slugs resolved through `getSpriteById`. Use these in mockups, design tools, or when the mapping layer deliberately exposes semantic handles. |

`SimpleSprite` enforces the contract: if the `id` starts with `/` it performs a
direct catalog lookup; otherwise it routes through `getSpriteById`. Missing
sprites render a deterministic placeholder so designers can spot issues quickly.

## Catalog & Manifest

* `scripts/generate-sprite-manifest.cjs` scans `public/sprites/**` into the
  generated `src/ui/sprites/sprite-list-generated.ts`.
* The manifest is **read-only**. To add or rename assets, edit the files in
  `public/sprites/**` and re-run `pnpm generate:sprites`.
* `src/ui/sprites/catalog.ts` provides pure lookup helpers:
  * `getSpriteByPath(path)` – strict path ID lookup.
  * `getSpriteById(id)` – semantic lookup with normalization and keyword
    matching.
  * `validateSpritePath(path)` – used by tests and validation scripts.

## Rendering Components

* `SimpleSprite.tsx` – renders GIF/PNG sprites, handles debug logging, and
  displays placeholders on failure.
* `Sprite.tsx` – legacy sprite-sheet animator that still uses the manifest
  definitions. New work should prefer `SimpleSprite`.
* `BackgroundSprite.tsx` – convenience wrapper for large background images.

## Mapping Helpers

| File | Responsibility |
|------|----------------|
| `src/ui/sprites/mappings/overworldSprites.ts` | Player, NPC, scenery, and mirroring helpers for the overworld map. |
| `src/ui/sprites/mappings/portraits.ts` | Speaker/unit → portrait icon mapping used by menus, dialogue, and compendium screens. |
| `src/ui/sprites/mappings/abilityIcons.ts` | Ability ID → psynergy icon mapping for ability lists. |
| `src/ui/sprites/mappings/statusIcons.ts` | Status effect → icon mapping for battle HUD elements. |
| `src/ui/sprites/mappings/battleSprites.ts` | New battle-specific mapping layer. Provides deterministic path IDs for both player units and a curated set of enemies (including dev/test units). Returns `null` when art is missing so `BattleUnitSprite` can display a placeholder with clear TODO messaging. |

All helpers are re-exported through `src/ui/sprites/mappings/index.ts` for easy
consumption.

### Required Early-Game Enemies

`battleSprites.ts` derives `EARLY_GAME_ENEMY_IDS` directly from
`src/data/definitions/encounters.ts`. Any encounter whose ID matches
`house-XX` with `XX ≤ EARLY_HOUSE_THRESHOLD` (currently **5**) or is explicitly
listed in the `EARLY_SPECIAL_ENCOUNTERS` set (e.g., `vs1-garet`) is considered
“early game.” The derived enemy IDs must have a concrete path entry in
`ENEMY_SPRITES`, and the Vitest suite (`tests/ui/sprites/battleSprites.test.ts`)
will fail if a qualifying encounter references an unmapped enemy.

**Adding a new required enemy**

1. Add or update the encounter under `src/data/definitions/encounters.ts`.
2. If the encounter should count as “early,” ensure its house number is `≤ 5`
   or add the encounter ID to `EARLY_SPECIAL_ENCOUNTERS`.
3. Add the enemy’s sprite path to `ENEMY_SPRITES` in `battleSprites.ts`.
4. Run `pnpm vitest run tests/ui/sprites/battleSprites.test.ts` to confirm the
   guardrail passes.

## Battle Sprite Flow

1. UI components call `<BattleUnitSprite unitId="adept" state="attack" />`.
2. `BattleUnitSprite` converts the requested state into the canonical
   `BattleSpriteState` union (`'idle' | 'attack' | 'hit'`).
3. It asks `getPlayerBattleSprite` and `getEnemyBattleSprite` for a matching
   path ID. If neither mapping contains the ID it falls back to a semantic
   placeholder (which renders as a colored block in `SimpleSprite`).
4. `SimpleSprite` receives the path ID, loads the GIF, and logs helpful context
   when debug mode is enabled.

Extending the battle roster is as simple as adding a new entry to
`PLAYER_SPRITES` or `ENEMY_SPRITES` inside `battleSprites.ts`. Tests in
`tests/ui/sprites/battleSprites.test.ts` ensure the mappings only point at real
manifest entries.

## Production Coverage

* **Overworld** – `OverworldMap` exclusively uses `getPlayerSprite` and
  `getNPCSprite`, guaranteeing concrete GIFs for the Vale prototype assets.
* **Menus & Dialogue** – Party management, compendium, djinn collection,
  rewards, dialogue, shops, and the save menu all rely on `portraits.ts`,
  `abilityIcons.ts`, `statusIcons.ts`, or explicit path IDs that we ship.
* **Battle** – The queue-battle sandbox now obtains every unit/enemy sprite via
  `BattleUnitSprite`, so the mapping layer is the single source of truth.

### Complete Battle Sprite Coverage (2025-11-24)

**Party Units:** All 11 units now have mappings:
- Starter party (Isaac/Garet/Mia/Ivan) use dedicated battle sprites with multiple weapon variants
- Recruitable units (Blaze, Felix, Karis, Sentinel, Stormcaller, Tyrell, Tower-Champion) use starter party sprites as placeholders with varied weapons for visual differentiation

**Enemy Coverage:** All 48 defined enemies mapped to appropriate sprites from the 173 available GIFs:
- Houses 1-5: Early game enemies (wolves, scouts, slimes, beetles)
- Houses 6-10: Mid-game beasts (bears, upgraded animals)
- Houses 11-15: Soldier tier (orcs, lizard fighters, mermen, harpies)
- Houses 16-20: Elite enemies (captains, commanders, warlords)
- Special encounters: Elemental bosses, legendary beasts, chimera, overseer, bandits

No placeholders remain in active gameplay screens. Future party members (Felix, Jenna, Sheba, Piers) will transition from placeholder sprites to dedicated battle sprites when those assets become available.

## Screen Status (Complete Coverage)

| Screen | Sprite Status | Notes |
|--------|---------------|-------|
| Overworld – Vale Village | ✅ Sprite-complete | Player + Vale NPCs always resolve via `overworldSprites.ts`; no placeholders observed while walking the map. |
| Battle Sandbox (QueueBattleView) | ✅ Sprite-complete | All party units and enemies mapped to real sprites. |
| Compendium – Units / Djinn | ✅ Sprite-complete | Units use portrait icons, djinn use `/sprites/battle/djinn/*`; no placeholders. |
| Compendium – Enemies / Bosses | ✅ **Sprite-complete** | **ALL 48 enemies** (Houses 1-20 + special encounters) now mapped to appropriate sprites from the 173 available enemy GIFs. |
| Party Management | ✅ Sprite-complete | Uses `getPortraitSprite` for every roster slot; all 11 units have portrait mappings. |
| Djinn Collection | ✅ Sprite-complete | Each element resolves to the matching djinn GIF in `/sprites/battle/djinn`. |
| Rewards Screen | ✅ Sprite-complete | All units use `BattleUnitSprite` + portraits with complete mappings. |
| Dialogue Overlays | ✅ Sprite-complete | Dialogue UI always uses `getPortraitSprite`, all speakers have portrait mappings. |

### Dev-Time Placeholder Warnings

| Screen / Component | Warns via `warnIfPlaceholderSprite` |
|--------------------|-------------------------------------|
| Overworld | `OverworldMap` (player + NPC sprites) |
| Battle | `BattleUnitSprite` (used by `Battlefield`, `RewardsScreen`, etc.) |
| Compendium | Enemy & boss cards inside `CompendiumScreen` |
| Party Management | Unit portraits & ability icons (`PartyManagementScreen`) |
| Djinn Collection | Card grid (`DjinnCollectionScreen`) and detail modal (`DjinnDetailModal`) |
| Dialogue | `DialogueBox` speaker portraits |

Any placeholder rendered in dev now logs `[Sprites][DEV] Placeholder sprite rendered on ...` so it’s obvious when a new mapping is required.

## Backlog

* `Sprite.tsx` still depends on the legacy sprite-sheet manifest and does not yet
  render catalog GIFs directly. Future work should either retire it or teach it
  to consume GIF metadata from the catalog.
* Large portions of the catalog intentionally reference assets that are not yet
  included in `public/sprites/**` (Felix/Jenna/Sheba/Piers battle sets,
  overworld minornpcs, mid/late-game enemies, etc.). Importing those assets and
  expanding the mapping layers remains a later-phase task.

