[BT-01] Battle Tower Overview — v1.0 — 2025-11-23
Type: Design
Status: In Progress

## Summary
- Adds an endless Battle Tower arcade mode that reuses the queue battle engine, sprite mappings, and existing reward plumbing.
- Players assemble a max-level party with full access to units, equipment, and Djinn, then push through curated encounters with attrition, rest floors, and milestone rewards.
- Tower-specific configs, floors, and rewards are data-driven with Zod schemas; logic lives in a new TowerService and UI towerSlice.
- Tower-only loot (e.g., `eclipse-blade`, `nova`, `tower-champion`) relies on the new `availableIn` flag, keeping campaign drops unchanged.

## Scope
- Define data modules: `towerFloors`, `towerRewards`, and `availableIn` flags on units/equipment/Djinn.
- Create pure Tower configuration + service in `core/**` for run management, scaling, rest logic, and reward hooks.
- Add UI state + flows (towerSlice, entry points from main menu + overworld, run HUD, rest, summary).
- Reuse sprite system (BattleUnitSprite + mappings) and reward services (collectDjinn, addEquipment, recruitUnit).

## Status
- Planning: Tower definitions, config knobs, and reward schema locked for the current prototype.
- Implementation: Floors/config/service plus `towerSlice`, Tower Hub UI, menu/overworld entry, reward hookups, and availability gating are live.
- Testing: Guardrails cover slice progression/rewards and availability filtering; battle simulation tests land in `tests/ui/state/towerSlice.test.ts`.

## Phase 2 Highlights (2025-11-23)
- Added `towerSlice` + `TowerHubScreen` so runs can be started from main menu or via the Vale overworld entrance, complete with rest logic and attrition persistence.
- Queue battle integration now defers to Tower logic for HP/Djinn persistence and milestone rewards, which reuse inventory/djinn/recruit flows (no bespoke reward system).
- `availableIn` filtering helpers gate campaign UIs (shops, compendium) from showing tower-only items like `eclipse-blade`, `nova`, and `tower-champion`.

## Key Decisions
1. **Data-first tower content** – floors & rewards defined under `src/data` with Zod validation so UI/services stay declarative.
2. **Single configuration source** – `towerConfig.ts` owns rest cadence, scaling, heal fractions, etc., preventing magic numbers elsewhere.
3. **Pure TowerService** – deterministic core (no React) orchestrates run state, floor progression, rest effects, scaling hooks, and reward evaluation.
4. **Reuse battle & reward plumbing** – queue battle slice executes encounters; Tower emits standard reward events (equipment, Djinn, recruits) via existing services.
5. **Sprite compliance** – Tower references existing enemy IDs; guardrail tests verify every used enemy has a valid `getEnemyBattleSprite` path to keep dev warnings actionable.

## Open Questions / TODOs
- Determine initial set of curated floors (Act 1/2 encounters) and boss cadence beyond v1 prototype.
- Decide on persistence scope for high scores (in-memory vs. localStorage) and how to surface them in UI.
- Define UX for equipment/Djinn loadout adjustments on rest floors (reuse existing screens vs. inline editor).
- Clarify whether Tower supports multiple difficulties at launch or if `normal` is hard-coded initially.

## References
- Spec: Main Battle Tower prompt (user instructions).
- Planned files:
  - `src/core/config/towerConfig.ts`
  - `src/core/services/TowerService.ts`
  - `src/data/definitions/towerFloors.ts`
  - `src/data/definitions/towerRewards.ts`
  - `src/ui/state/towerSlice.ts`
  - `docs/BT-Index.md`

