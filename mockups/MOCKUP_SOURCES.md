# Mockup Sources

## Original Vale Chronicles Mockups
- [battle-transition.html](battle-transition.html) - Created by Role 2
- [equipment-screen.html](equipment-screen.html) - Created by Role 2
- [rewards-screen.html](rewards-screen.html) - Created by Role 2
- [unit-collection.html](unit-collection.html) - Created by Role 2

## Copied from MetaPrompt
- [battle-screen.html](battle-screen.html) - From golden-sun-battle-pixel-perfect.html
- [djinn-menu.html](djinn-menu.html) - From mockup-examples/djinn-menu/
- [overworld.html](overworld.html) - From mockup-examples/overworld-village/

**Source:** https://github.com/badnewsgoonies-dot/MetaPrompt
**Branch:** cursor/read-handoff-and-start-multi-role-simulation-e914
**Date:** 2025-11-03

## Modifications Made

### Battle Screen
- Updated sprite paths from `./sprites/golden-sun/` to Vale Village structure:
  - Enemies: `/sprites/battle/enemies/`
  - Party: `/sprites/battle/party/`
  - Character icons: `/sprites/icons/characters/`

### Djinn Menu
- Updated CSS imports to use shared `/mockups/tokens.css`
- Updated sprite paths:
  - Character portraits: `/sprites/overworld/protagonists/`
  - Djinn sprites: `/sprites/battle/djinn/`

### Overworld
- Updated CSS imports to use shared `/mockups/tokens.css`
- Updated sprite paths:
  - Trees: `/sprites/scenery/plants/`
  - Protagonists: `/sprites/overworld/protagonists/`
  - Major NPCs: `/sprites/overworld/majornpcs/`
  - Minor NPCs: `/sprites/overworld/minornpcs/`
  - Antagonists: `/sprites/overworld/antagonists/`
  - Vale Gate: Kept in local assets folder (`/mockups/overworld-village/assets/`)

## Mockup Status
All 7 mockups are now complete (100%)
