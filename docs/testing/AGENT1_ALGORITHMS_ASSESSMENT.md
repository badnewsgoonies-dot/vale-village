# Agent 1: Core Algorithms Testing Assessment

## Brief Summary for Other Agents (READ THIS FIRST)

The core algorithms in `src/core/algorithms/` are **well-tested overall**, with particularly strong coverage for damage calculations (including Phase 2 features like shields, auto-revive, damage reduction, elemental resistance, and ignore defense). The existing test suite follows the project's conventions correctly (using `test()` not `it()`, using `mk*` factories, and `makePRNG` for deterministic tests).

**Key gaps identified:**
1. **mana.ts** - No dedicated test file. Functions `canAffordAction`, `getAbilityManaCost`, `calculateTotalQueuedManaCost`, `validateQueuedActions`, `isQueueComplete` are untested.
2. **targeting.ts** - No dedicated test file. Functions `resolveTargets`, `filterValidTargets`, `getValidTargets` are untested.
3. **rewards.ts** - No dedicated test file. Functions `calculateBattleRewards`, `calculateStatGains`, `distributeRewards` are untested.
4. **healing.ts** - No dedicated test file. The `autoHealUnits` function is untested.
5. **turn-order.ts** - Has property tests but lacks edge case tests for KO'd units and empty lists.
6. **djinn.ts** - Missing tests for `getSetDjinnIds`, `calculateSummonDamage`, `canActivateDjinn`, `getDjinnReadyForRecovery`.

The algorithms depend heavily on models (`Unit`, `Team`, `BattleState`) and status effect types. Other agents working on services or UI should be aware that damage/healing calculations use `calculateEffectiveStats` from stats.ts, which combines base + level + equipment + Djinn + status modifiers.

## Detailed Analysis

### damage.ts
- **Functions:** `getElementModifier`, `applyDamageModifiers`, `calculatePhysicalDamage`, `calculatePsynergyDamage`, `calculateHealAmount`, `isInvulnerable`, `hasShieldCharges`, `consumeShieldCharge`, `applyDamage`, `applyDamageWithShields`, `checkAutoRevive`, `applyHealing`
- **Test coverage:** ~95%
- **Missing tests:** None significant. All Phase 2 features thoroughly tested.
- **Quality:** Excellent. Tests cover edge cases, integration with status effects, and property-based invariants.
- **Test files:**
  - `damage.test.ts` - Basic damage/healing tests
  - `damage-properties.test.ts` - Property-based tests
  - `damage.damageReduction.test.ts` - Damage reduction status effects
  - `damage.elementalResistance.test.ts` - Elemental resistance status effects
  - `damage.shields.test.ts` - Shield and invulnerability mechanics
  - `damage.autoRevive.test.ts` - Auto-revive triggering and uses
  - `damage.ignoreDefense.test.ts` - Armor-piercing mechanics
  - `damage.splash.test.ts` - Splash damage mechanics

### stats.ts
- **Functions:** `calculateLevelBonuses`, `calculateStatusModifiers`, `calculateEffectiveStats`, `getEffectiveSPD`
- **Test coverage:** ~90%
- **Missing tests:** None significant
- **Quality:** Good. Tests cover level bonuses, equipment bonuses, Djinn bonuses, status modifiers, and stat clamping.
- **Test files:**
  - `stats.test.ts` - Unit tests for all functions
  - `stats-integration.test.ts` - Integration tests with damage/healing

### xp.ts
- **Functions:** `getXpForLevel`, `calculateLevelFromXp`, `addXp`, `calculateMaxHpAtLevel`, `getXpProgress`
- **Test coverage:** ~95%
- **Missing tests:** `calculateMaxHpAtLevel` has no direct tests (but used indirectly)
- **Quality:** Excellent. Tests cover XP curve, level boundaries, level-up mechanics, and ability unlocks.
- **Test files:**
  - `xp.test.ts` - Basic XP/leveling tests
  - `xp-level-20.test.ts` - Extended level cap tests, boundary tests, monotonicity

### turn-order.ts
- **Functions:** `calculateTurnOrder`
- **Test coverage:** ~70%
- **Missing tests:**
  - Edge case: All units KO'd (should return empty array)
  - Edge case: Single unit (no tiebreaker needed)
  - Edge case: Empty units array
  - Mixed player/enemy priority tier behavior
- **Quality:** Good property-based tests but lacks edge case coverage
- **Test files:**
  - `turn-order-properties.test.ts` - Determinism, Hermes priority, stability

### djinn.ts (djinnCalculations)
- **Functions:** `calculateDjinnSynergy`, `getSetDjinnIds`, `calculateSummonDamage`, `canActivateDjinn`, `getDjinnReadyForRecovery`
- **Test coverage:** ~40%
- **Missing tests:**
  - `getSetDjinnIds` - No tests
  - `calculateSummonDamage` - No tests
  - `canActivateDjinn` - No tests
  - `getDjinnReadyForRecovery` - No tests
- **Quality:** `calculateDjinnSynergy` is well-tested. Other functions completely untested.
- **Test files:**
  - `djinn.test.ts` - Only tests `calculateDjinnSynergy`

### djinnAbilities.ts
- **Functions:** `getElementCompatibility`, `calculateDjinnBonusesForUnit`, `getDjinnGrantedAbilitiesForUnit`, `mergeDjinnAbilitiesIntoUnit`, `getDjinnAbilityMetadataForUnit`, `getLockedDjinnAbilityMetadataForUnit`
- **Test coverage:** ~50%
- **Missing tests:**
  - `getDjinnGrantedAbilitiesForUnit` - No direct tests
  - `mergeDjinnAbilitiesIntoUnit` - No tests
  - `getDjinnAbilityMetadataForUnit` - No tests
  - `getLockedDjinnAbilityMetadataForUnit` - No tests
- **Quality:** Core element compatibility and bonuses well-tested. Ability granting untested.
- **Test files:**
  - `djinnAbilities.test.ts` - Element compatibility, per-unit bonuses

### status.ts
- **Functions:** `processStatusEffectTick`, `checkParalyzeFailure`, `isFrozen`, `isImmuneToStatus`, `isNegativeStatus`, `applyStatusToUnit`
- **Test coverage:** ~95%
- **Missing tests:** None significant
- **Quality:** Excellent. Comprehensive coverage of all status effects, immunity mechanics, and probability testing.
- **Test files:**
  - `status.test.ts` - Status ticking, application, freeze/paralyze
  - `status.immunityAndCleanse.test.ts` - Immunity mechanics
  - `status.immunity.replacement.test.ts` - Immunity replacement behavior

### mana.ts
- **Functions:** `canAffordAction`, `getAbilityManaCost`, `calculateTotalQueuedManaCost`, `validateQueuedActions`, `isQueueComplete`
- **Test coverage:** 0%
- **Missing tests:** ALL functions untested
- **Quality:** N/A - No tests exist
- **Test files:** None

### targeting.ts
- **Functions:** `resolveTargets`, `filterValidTargets`, `getValidTargets`
- **Test coverage:** 0%
- **Missing tests:** ALL functions untested
- **Quality:** N/A - No tests exist
- **Test files:** None

### rewards.ts
- **Functions:** `calculateBattleRewards`, `calculateStatGains`, `distributeRewards`
- **Test coverage:** 0%
- **Missing tests:** ALL functions untested
- **Quality:** N/A - No tests exist
- **Test files:** None

### healing.ts
- **Functions:** `autoHealUnits`
- **Test coverage:** 0%
- **Missing tests:** `autoHealUnits` untested
- **Quality:** N/A - No tests exist
- **Test files:** None

### equipment.ts
- **Functions:** `canEquipItem`, `getEquippableItems`
- **Test coverage:** 100%
- **Missing tests:** None
- **Quality:** Good. Uses `mk*` factories correctly.
- **Test files:**
  - `equipment.test.ts` - Element-based equip restrictions

## Critical Gaps Identified

1. **mana.ts** - Complete gap. Queue-based battle system relies on these functions.
2. **targeting.ts** - Complete gap. Critical for ability resolution.
3. **rewards.ts** - Complete gap. Post-battle XP/gold distribution untested.
4. **healing.ts** - Complete gap. Post-battle healing untested.
5. **djinn.ts** - Partial gap. State management functions (activation, recovery) untested.
6. **djinnAbilities.ts** - Partial gap. Ability granting/merging untested.

## Dependencies on Other Areas

**Algorithms depend on:**
- `src/core/models/Unit` - Unit type, `createUnit`, `calculateMaxHp`, `isUnitKO`
- `src/core/models/Team` - Team type, `createTeam`, `DjinnTracker`
- `src/core/models/BattleState` - `QueuedAction` type
- `src/data/schemas/AbilitySchema` - Ability type
- `src/data/definitions/` - Unit definitions, abilities, equipment, Djinn, enemies, encounters
- `src/core/constants` - `BATTLE_CONSTANTS`
- `src/core/random/prng` - `PRNG` interface

**What depends on algorithms:**
- `src/core/services/BattleService` - Uses damage, turn-order, status, targeting
- `src/core/services/QueueBattleService` - Uses mana, targeting, damage
- `src/ui/state/` - Zustand slices use algorithms for previews and calculations

## Recommended Test Additions

### Priority 1 (Critical - Complete gaps)
1. Create `mana.test.ts` - All 5 functions
2. Create `targeting.test.ts` - All 3 functions
3. Create `rewards.test.ts` - All 3 functions
4. Create `healing.test.ts` - `autoHealUnits`

### Priority 2 (Important - Partial gaps)
5. Add to `djinn.test.ts` - `getSetDjinnIds`, `calculateSummonDamage`, `canActivateDjinn`, `getDjinnReadyForRecovery`
6. Add to `djinnAbilities.test.ts` - Ability granting and merging functions
7. Add to `turn-order-properties.test.ts` - Edge cases (empty, single, all KO'd)

### Priority 3 (Enhancement)
8. Add to `xp.test.ts` - Direct `calculateMaxHpAtLevel` tests
9. Add property-based tests for more algorithms using fast-check
