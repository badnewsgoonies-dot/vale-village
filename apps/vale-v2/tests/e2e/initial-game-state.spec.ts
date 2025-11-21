import { test, expect } from '@playwright/test';
import { UNIT_DEFINITIONS } from '../../src/data/definitions/units';
import { DJINN } from '../../src/data/definitions/djinn';
import { createUnit, calculateMaxHp } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { collectDjinn, equipDjinn } from '../../src/core/services/DjinnService';
import { createBaseIsaacTeam, createVs1IsaacTeam } from '../../src/utils/teamSetup';

/**
 * Initial Game State Tests (Phase 4)
 *
 * Validates that the game initialization logic (App.tsx lines 58-96) works correctly
 * for Isaac-only startup with Flint granted by the Djinn tutorial.
 *
 * CONTEXT (Nov 2025 - Phase 4 Implementation):
 * - Game starts with 1 unit (Isaac/Adept) at level 1
 * - Flint Djinn (Venus T1) is granted later via the in-world tutorial, not at launch
 * - No test team or multiple starter units
 * - Roster contains only Isaac
 *
 * PURPOSE:
 * - Validate initial game state logic matches blueprint
 * - Ensure no regression to 4-unit test teams
 * - Verify Flint Djinn collection and equipment logic works correctly
 *
 * NOTE: These are data validation tests, not true E2E browser tests.
 * They test the initialization logic used by App.tsx without requiring browser interaction.
 */

test.describe('Initial Game State - Phase 4 Validation', () => {
  test('Adept unit definition exists and is valid', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];

    // Validate Adept definition exists
    expect(adeptDef).toBeDefined();
    expect(adeptDef?.id).toBe('adept');
    expect(adeptDef?.name).toBe('Adept');

    // Validate Adept has base stats
    expect(adeptDef?.baseStats).toBeDefined();
    expect(adeptDef?.baseStats.hp).toBeGreaterThan(0);
    expect(adeptDef?.baseStats.pp).toBeGreaterThan(0);
    expect(adeptDef?.baseStats.atk).toBeGreaterThan(0);
    expect(adeptDef?.baseStats.def).toBeGreaterThan(0);
    expect(adeptDef?.baseStats.spd).toBeGreaterThan(0);

    // Validate Adept has abilities
    expect(adeptDef?.abilities).toBeDefined();
    expect(adeptDef?.abilities.length).toBeGreaterThanOrEqual(2);
  });

  test('Can create Adept unit at level 1', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    // Create Adept at level 1
    const adept = createUnit(adeptDef!, 1, 0);

    // Validate Adept was created correctly
    expect(adept).toBeDefined();
    expect(adept.name).toBe('Adept');
    expect(adept.level).toBe(1);
    expect(adept.id).toBe('adept');

    // Validate Adept has abilities defined (4 total in definition)
    // Only 1 is unlocked at level 1 (STRIKE with unlockLevel: 1)
    expect(adept.abilities.length).toBeGreaterThanOrEqual(4);
    expect(adept.unlockedAbilityIds.length).toBeGreaterThanOrEqual(1);

    // Validate base stats are defined and positive
    expect(adept.baseStats.hp).toBeGreaterThan(0);
    expect(adept.baseStats.pp).toBeGreaterThan(0);
    expect(adept.baseStats.atk).toBeGreaterThan(0);
    expect(adept.baseStats.def).toBeGreaterThan(0);
    expect(adept.baseStats.spd).toBeGreaterThan(0);

    // Validate current HP equals calculated max HP (full health)
    const maxHp = calculateMaxHp(adept);
    expect(adept.currentHp).toBe(maxHp);
    expect(adept.currentHp).toBeGreaterThan(0);
  });

  test('Can create team with just Adept', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const adept = createUnit(adeptDef!, 1, 0);
    const team = createTeam([adept]);

    // Validate team was created with single unit
    expect(team).toBeDefined();
    expect(team.units).toHaveLength(1);
    expect(team.units[0]?.name).toBe('Adept');

    // Validate no Djinn collected yet
    expect(team.collectedDjinn).toHaveLength(0);
    expect(team.equippedDjinn).toHaveLength(0);
  });

  test('Flint Djinn definition exists and is valid', () => {
    const flintDef = DJINN['flint'];

    // Validate Flint exists in definitions
    expect(flintDef).toBeDefined();
    expect(flintDef?.id).toBe('flint');
    expect(flintDef?.element).toBe('Venus');
    expect(flintDef?.tier).toBe('1');

    // Validate Flint has summon effect
    expect(flintDef?.summonEffect).toBeDefined();
    expect(flintDef?.summonEffect.type).toBeDefined();

    // Validate Flint grants abilities
    expect(flintDef?.grantedAbilities).toBeDefined();
  });

  test('Can collect Flint Djinn', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const adept = createUnit(adeptDef!, 1, 0);
    const team = createTeam([adept]);

    // Collect Flint Djinn
    const collectResult = collectDjinn(team, 'flint');

    // Validate collection succeeded
    expect(collectResult.ok).toBe(true);
    if (collectResult.ok) {
      const updatedTeam = collectResult.value;

      // Validate Flint is in team's Djinn collection
      expect(updatedTeam.collectedDjinn).toContain('flint');
      expect(updatedTeam.collectedDjinn).toHaveLength(1);

      // Validate Flint is not equipped yet (equipped separately)
      // Note: collectDjinn only adds to collection, not equipping
    }
  });

  test('Can equip Flint Djinn to slot 0', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const adept = createUnit(adeptDef!, 1, 0);
    const team = createTeam([adept]);

    // Collect Flint Djinn
    const collectResult = collectDjinn(team, 'flint');
    expect(collectResult.ok).toBe(true);
    if (!collectResult.ok) return;

    // Equip Flint to slot 0
    const equipResult = equipDjinn(collectResult.value, 'flint', 0);

    // Validate equipping succeeded
    expect(equipResult.ok).toBe(true);
    if (equipResult.ok) {
      const finalTeam = equipResult.value;

      // Validate Flint is equipped to slot 0
      expect(finalTeam.equippedDjinn[0]).toBe('flint');

      // Validate Flint is still in collection
      expect(finalTeam.collectedDjinn).toContain('flint');
    }
  });

  test('createBaseIsaacTeam matches App.tsx startup expectations', () => {
    const { isaac, team: baseTeam } = createBaseIsaacTeam();

    expect(baseTeam.units).toHaveLength(1);
    expect(baseTeam.units[0]?.name).toBe('Adept');
    expect(baseTeam.units[0]?.level).toBe(1);
    expect(baseTeam.collectedDjinn).toHaveLength(0);
    expect(baseTeam.equippedDjinn).toHaveLength(0);
    expect(isaac.id).toBe('adept');
  });

  test('createVs1IsaacTeam preps Flint for the VS1 demo', () => {
    const { isaac, team: vs1Team } = createVs1IsaacTeam();

    expect(vs1Team.units).toHaveLength(1);
    expect(vs1Team.collectedDjinn).toContain('flint');
    expect(vs1Team.equippedDjinn).toHaveLength(1);
    expect(vs1Team.equippedDjinn[0]).toBe('flint');
    expect(isaac.id).toBe('adept');
  });
});
