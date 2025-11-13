# Changelog

All notable changes to Vale Chronicles V2 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Phase 7: Djinn Ability Unlocking System (2025-11-12)

#### Complete Djinn Ability System Implementation
- **Element Compatibility Logic** (`djinnAbilities.ts`)
  - `getElementCompatibility()` - Calculates same/counter/neutral compatibility
  - `calculateDjinnBonusesForUnit()` - Per-unit stat bonuses based on compatibility
  - Stat bonuses: Same (+4 ATK, +3 DEF), Counter (-3 ATK, -2 DEF), Neutral (+2 ATK, +2 DEF)
  - Location: `apps/vale-v2/src/core/algorithms/djinnAbilities.ts`

- **Djinn Schema & Definitions**
  - Zod schema validation for Djinn data (`DjinnSchema.ts`)
  - 12 Djinn definitions (3 per element, 3 tiers each)
  - 180 Djinn-granted abilities (15 per Djinn)
  - `DJINN` registry and `DJINN_ABILITIES` map for lookups
  - Locations:
    - `apps/vale-v2/src/data/schemas/DjinnSchema.ts`
    - `apps/vale-v2/src/data/definitions/djinn.ts`
    - `apps/vale-v2/src/data/definitions/djinnAbilities.ts`

- **Battle Integration**
  - `getDjinnGrantedAbilitiesForUnit()` - Extracts ability IDs from Set Djinn
  - `mergeDjinnAbilitiesIntoUnit()` - Merges Djinn abilities into unit's ability list
  - Abilities automatically unlock when Djinn are equipped
  - Abilities removed when Djinn enter Standby state
  - Abilities restored when Djinn recover to Set state
  - Integration points:
    - `createBattleState()` - Merges abilities at battle start
    - `executeDjinnSummons()` - Updates abilities when Djinn activate
    - `transitionToPlanningPhase()` - Updates abilities when Djinn recover

- **Ability Catalog**
  - **180 total abilities** distributed across 12 Djinn
  - **Venus:** Flint (15), Granite (15), Bane (15) = 45 abilities
  - **Mars:** Forge (15), Corona (15), Fury (15) = 45 abilities
  - **Mercury:** Fizz (15), Tonic (15), Crystal (15) = 45 abilities
  - **Jupiter:** Breeze (15), Squall (15), Storm (15) = 45 abilities
  - Tier-appropriate power scaling (T1: 35-50, T2: 52-70, T3: 70-100)
  - Element-themed naming and mechanics
  - Ability types: Physical (~30), Psynergy (~90), Buff (~30), Healing (~20), Debuff (~10)

**Impact:** Units now gain powerful abilities based on equipped Djinn and element compatibility. The system creates strategic depth through trade-offs between stat bonuses and ability diversity.

**Documentation:**
- See [docs/PHASE_07_COMPLETION_SUMMARY.md](docs/PHASE_07_COMPLETION_SUMMARY.md) for complete details
- Updated `VALE_CHRONICLES_INSTRUCTION_BOOKLET.md` with ability counts and completion status

---

### Fixed - System 1: Critical Validation & Bug Fixes (2025-11-11)

#### Healing System Validation (`damage.ts:241`)
- **Added `abilityRevivesFallen` parameter to `applyHealing()`**
  - Prevents healing KO'd units unless ability explicitly supports revival
  - Throws `Error` when attempting to heal KO'd unit without revive capability
  - Validates healing amounts are non-negative (throws on negative values)
  - Location: `apps/vale-v2/src/core/algorithms/damage.ts:241`

  **Breaking Change:** `applyHealing()` signature changed from:
  ```typescript
  applyHealing(unit: Unit, healing: number): Unit
  ```
  to:
  ```typescript
  applyHealing(unit: Unit, healing: number, abilityRevivesFallen?: boolean): Unit
  ```

  **Migration:** Add third parameter when calling `applyHealing()` for revival abilities:
  ```typescript
  // Old: Would incorrectly heal KO'd units
  const healed = applyHealing(koUnit, 50);

  // New: Explicitly specify revival behavior
  const healed = applyHealing(koUnit, 50, true); // Revival ability
  const healed = applyHealing(aliveUnit, 50); // Regular heal (default: false)
  ```

#### PRNG Seed Validation (`prng.ts:30-36, 72-74`)
- **Reject negative seeds** - `XorShiftPRNG` constructor and `makePRNG()` now throw `Error` on negative seeds
- **Zero seed handling** - Zero seeds are automatically converted to 1 (XorShift requires non-zero state)
- Location: `apps/vale-v2/src/core/random/prng.ts`

  **Impact:** Prevents invalid PRNG states that could cause determinism failures
  ```typescript
  // Now throws error
  makePRNG(-100); // Error: PRNG seed must be non-negative

  // Zero seed automatically converted
  const rng = makePRNG(0); // Internally uses seed=1
  expect(rng.getSeed()).toBe(1);
  ```

#### Team Djinn Validation (`Team.ts:75-88`)
- **Prevent duplicate Djinn** - `updateTeam()` now validates that `equippedDjinn` contains no duplicates
- **Enforce 3-Djinn limit** - Throws `Error` if more than 3 Djinn are equipped
- Location: `apps/vale-v2/src/core/models/Team.ts:75`

  **Examples:**
  ```typescript
  // Throws: Cannot equip duplicate Djinn
  updateTeam(team, { equippedDjinn: ['flint', 'flint', 'granite'] });

  // Throws: Cannot equip more than 3 Djinn
  updateTeam(team, { equippedDjinn: ['flint', 'granite', 'bane', 'flash'] });

  // Valid
  updateTeam(team, { equippedDjinn: ['flint', 'granite', 'bane'] }); // ✓
  ```

#### Equipment Schema Default (`EquipmentSchema.ts:44`)
- **`statBonus` defaults to `{}`** - Missing `statBonus` field now defaults to empty object instead of `undefined`
- Location: `apps/vale-v2/src/data/schemas/EquipmentSchema.ts:44`

  **Impact:** Prevents `undefined` access errors when equipment has no stat bonuses
  ```typescript
  // Before: statBonus could be undefined
  const atk = equipment.statBonus?.atk || 0; // Required optional chaining

  // After: statBonus guaranteed to be object (may be empty)
  const atk = equipment.statBonus.atk || 0; // Safe access
  ```

### Added - Test Coverage

#### Healing Validation Tests (`damage.test.ts:153-178`)
- Test rejection of negative healing values
- Test prevention of healing KO'd units without revival
- Test successful revival with `abilityRevivesFallen: true`

#### PRNG Validation Tests (`prng.test.ts:50-74`)
- Test rejection of negative seeds (`-1`, `-100`)
- Test zero seed conversion to 1
- Test acceptance of positive seeds

#### Team Djinn Validation Tests (`Team.test.ts:89-131`)
- Test rejection of duplicate Djinn
- Test rejection of >3 Djinn
- Test acceptance of valid Djinn configurations

### Technical Details

**Error Handling Approach:**
- **Throwing errors vs Result types** - System 1 uses thrown `Error` instances for validation failures (model/algorithm layer)
- Errors propagate to service layer where they can be caught and handled
- Future consideration: Introduce `Result<T, E>` type for expected failures (save/load, network)

**Validation Philosophy:**
- **Fail fast** - Invalid states are rejected immediately at model/algorithm boundaries
- **Type safety** - Zod schemas validate data shape, runtime checks validate business rules
- **Determinism** - PRNG validation ensures reproducible battle outcomes

**Test Strategy:**
- All validation paths have explicit test coverage
- Property-based tests ensure invariants hold (e.g., damage ≥ 0, HP clamped to [0, maxHp])
- Integration tests verify error handling in service layer

## Migration Guide - System 1 Changes

### If you use `applyHealing()`:

**Check all call sites** - Add `abilityRevivesFallen` parameter if ability can revive:

```typescript
// In BattleService or ability execution
if (ability.revivesFallen) {
  updatedUnit = applyHealing(targetUnit, healAmount, true);
} else {
  updatedUnit = applyHealing(targetUnit, healAmount); // defaults to false
}
```

### If you create PRNG instances:

**Ensure seeds are non-negative** - Validate user input or generated seeds:

```typescript
// Before: Could pass negative seed
const seed = Math.random() * 100 - 50; // Could be negative
const rng = makePRNG(seed); // Would crash

// After: Validate seed first
const seed = Math.abs(Math.random() * 100); // Always non-negative
const rng = makePRNG(seed); // Safe
```

### If you manage team Djinn:

**Validate before calling `updateTeam()`** - UI should prevent invalid selections:

```typescript
// In Djinn management UI
const selectedDjinn = ['flint', 'granite', 'bane'];

// Check for duplicates
const uniqueDjinn = new Set(selectedDjinn);
if (uniqueDjinn.size !== selectedDjinn.length) {
  showError('Cannot equip duplicate Djinn');
  return;
}

// Check count
if (selectedDjinn.length > 3) {
  showError('Maximum 3 Djinn can be equipped');
  return;
}

// Safe to update
updateTeam(team, { equippedDjinn: selectedDjinn });
```

---

## Version History

- **Unreleased** - System 1 critical bug fixes and validation improvements
