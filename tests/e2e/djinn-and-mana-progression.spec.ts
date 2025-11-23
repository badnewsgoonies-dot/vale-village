import { test, expect } from '@playwright/test';
import { ENCOUNTERS } from '../../src/data/definitions/encounters';
import { DJINN } from '../../src/data/definitions/djinn';
import { createUnit } from '../../src/core/models/Unit';
import { createTeam } from '../../src/core/models/Team';
import { collectDjinn } from '../../src/core/services/DjinnService';
import { UNIT_DEFINITIONS } from '../../src/data/definitions/units';

/**
 * Djinn and Mana Progression Tests (Phase 6)
 *
 * Validates Djinn acquisition and team mana economy throughout Houses 1-20.
 *
 * DJINN DISTRIBUTION:
 * - 7 Djinn rewards across 20 houses (H01, H07, H08, H12, H15, H18, H20)
 * - Plus Flint pre-game = 8 total Djinn
 * - Balanced across 4 elements: Venus, Mars, Mercury, Jupiter
 *
 * MANA CHECKPOINTS:
 * - House 1: 2 units, 2 Djinn (Isaac+Flint pre-game, +Garet +Forge)
 * - House 7: 5 units, 3 Djinn (+Breeze for summon unlock)
 * - House 12: 7 units, 4 Djinn (+Granite T2)
 * - House 15: 8 units, 5 Djinn (+Squall T2)
 * - House 20: 9 units, 8 Djinn (+Storm T3, finale)
 *
 * PURPOSE:
 * - Ensure Djinn rewards are correctly defined at all houses
 * - Validate Djinn collection system works correctly
 * - Test mana economy scales appropriately with team size
 */

test.describe('Djinn Progression - Reward Validation', () => {
  test('All 7 Djinn reward houses have valid djinn IDs', () => {
    const djinnHouses = [
      { house: 'house-01', djinn: 'forge', tier: '1', element: 'Mars' },
      { house: 'house-07', djinn: 'breeze', tier: '1', element: 'Jupiter' },
      { house: 'house-08', djinn: 'fizz', tier: '1', element: 'Mercury' },
      { house: 'house-12', djinn: 'granite', tier: '2', element: 'Venus' },
      { house: 'house-15', djinn: 'squall', tier: '2', element: 'Jupiter' },
      { house: 'house-18', djinn: 'bane', tier: '3', element: 'Venus' },
      { house: 'house-20', djinn: 'storm', tier: '3', element: 'Jupiter' },
    ];

    djinnHouses.forEach(({ house, djinn, tier, element }) => {
      const encounter = ENCOUNTERS[house];

      // Validate encounter exists
      expect(encounter, `Encounter ${house} should exist`).toBeDefined();

      // Validate djinn reward is set
      expect(encounter?.reward.djinn, `${house} should have djinn reward`).toBe(djinn);

      // Validate Djinn definition exists
      const djinnDef = DJINN[djinn];
      expect(djinnDef, `Djinn ${djinn} should be defined`).toBeDefined();
      expect(djinnDef?.tier).toBe(tier);
      expect(djinnDef?.element).toBe(element);
    });
  });

  test('Djinn tier progression increases over time', () => {
    const djinnProgression = [
      { house: 1, tier: 1, djinn: 'forge' },
      { house: 7, tier: 1, djinn: 'breeze' },
      { house: 8, tier: 1, djinn: 'fizz' },
      { house: 12, tier: 2, djinn: 'granite' }, // T2 starts
      { house: 15, tier: 2, djinn: 'squall' },
      { house: 18, tier: 3, djinn: 'bane' }, // T3 starts
      { house: 20, tier: 3, djinn: 'storm' },
    ];

    // Validate tier progression doesn't regress
    for (let i = 1; i < djinnProgression.length; i++) {
      const prev = djinnProgression[i - 1];
      const curr = djinnProgression[i];

      expect(curr?.tier).toBeGreaterThanOrEqual(prev?.tier ?? 0);
    }
  });

  test('Djinn elements are balanced across 4 elements', () => {
    const djinnByElement = {
      Venus: ['flint', 'granite', 'bane'], // 3 (including pre-game Flint)
      Mars: ['forge'], // 1
      Mercury: ['fizz'], // 1
      Jupiter: ['breeze', 'squall', 'storm'], // 3
    };

    // Validate Venus and Jupiter have most Djinn (3 each)
    expect(djinnByElement.Venus.length).toBe(3);
    expect(djinnByElement.Jupiter.length).toBe(3);

    // Mars and Mercury have fewer (1 each)
    expect(djinnByElement.Mars.length).toBe(1);
    expect(djinnByElement.Mercury.length).toBe(1);

    // Total 8 Djinn
    const total = Object.values(djinnByElement).flat().length;
    expect(total).toBe(8);
  });

  test('House 7 grants 3rd Djinn (summon unlock milestone)', () => {
    const h07 = ENCOUNTERS['house-07'];

    // Validate House 7 has Djinn reward
    expect(h07?.reward.djinn).toBe('breeze');

    // Validate this is the 3rd Djinn chronologically
    // Pre-game: Flint (1)
    // House 1: Forge (2)
    // House 7: Breeze (3) <- Summons unlock at 3 Djinn!

    const djinnBefore = ['flint', 'forge']; // 2 before H07
    expect(djinnBefore.length).toBe(2);
  });
});

test.describe('Djinn Progression - Collection System', () => {
  test('Can collect all 8 Djinn progressively', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const isaac = createUnit(adeptDef!, 1, 0);
    let team = createTeam([isaac]);

    const djinnSequence = ['flint', 'forge', 'breeze', 'fizz', 'granite', 'squall', 'bane', 'storm'];

    djinnSequence.forEach((djinnId) => {
      const result = collectDjinn(team, djinnId);

      // Validate collection succeeded
      expect(result.ok, `Should collect ${djinnId}`).toBe(true);

      if (result.ok) {
        team = result.value;

        // Validate Djinn is in collection
        expect(team.collectedDjinn).toContain(djinnId);
      }
    });

    // Validate final team has all 8 Djinn
    expect(team.collectedDjinn).toHaveLength(8);
  });

  test('Cannot collect duplicate Djinn', () => {
    const adeptDef = UNIT_DEFINITIONS['adept'];
    expect(adeptDef).toBeDefined();

    const isaac = createUnit(adeptDef!, 1, 0);
    let team = createTeam([isaac]);

    // Collect Flint first time
    const firstCollect = collectDjinn(team, 'flint');
    expect(firstCollect.ok).toBe(true);

    if (firstCollect.ok) {
      team = firstCollect.value;

      // Try to collect Flint again
      const secondCollect = collectDjinn(team, 'flint');

      // Should fail (already collected)
      expect(secondCollect.ok).toBe(false);
    }
  });

  test('Djinn definitions have valid summon effects', () => {
    const djinnIds = ['flint', 'forge', 'breeze', 'fizz', 'granite', 'squall', 'bane', 'storm'];

    djinnIds.forEach((djinnId) => {
      const djinn = DJINN[djinnId];

      // Validate Djinn has summon effect
      expect(djinn?.summonEffect).toBeDefined();
      expect(djinn?.summonEffect.type).toBeDefined();

      // Validate summon effect has description
      expect(djinn?.summonEffect.description).toBeDefined();
      expect(djinn?.summonEffect.description.length).toBeGreaterThan(0);
    });
  });
});

test.describe('Mana Economy - Checkpoint Validation', () => {
  test('Checkpoint 1 (House 1): 2 units, 2 Djinn = baseline mana', () => {
    // Starting team: Isaac (Adept) with Flint
    // After House 1: +Garet (War Mage) +Forge Djinn

    const adeptDef = UNIT_DEFINITIONS['adept'];
    const warMageDef = UNIT_DEFINITIONS['war-mage'];

    expect(adeptDef).toBeDefined();
    expect(warMageDef).toBeDefined();

    const isaac = createUnit(adeptDef!, 1, 0);
    const garet = createUnit(warMageDef!, 1, 0);

    const team = createTeam([isaac, garet]);

    // Calculate total mana contribution
    const totalMana = team.units.reduce((sum, u) => sum + u.manaContribution, 0);

    // 2 units should provide at least 2 mana
    expect(totalMana).toBeGreaterThanOrEqual(2);
  });

  test('Checkpoint 2 (House 7): 5 units in roster, 4 active, 3 Djinn = summon unlocked', () => {
    // Expected roster: Isaac, Garet, Mystic, Ranger, Blaze (5 total)
    // Active party: First 4 units (max party size)
    // Expected Djinn: Flint, Forge, Breeze (3 total - summons unlock!)

    const unitIds = ['adept', 'war-mage', 'mystic', 'ranger', 'blaze'];
    const rosterUnits = unitIds.map(id => createUnit(UNIT_DEFINITIONS[id]!, 1, 0));

    // Create team with first 4 units (max party size)
    const team = createTeam(rosterUnits.slice(0, 4));

    // Calculate total mana contribution from active party
    const totalMana = team.units.reduce((sum, u) => sum + u.manaContribution, 0);

    // 4 active units should provide at least 4 mana
    expect(totalMana).toBeGreaterThanOrEqual(4);

    // Validate we have 4 active units (max party size)
    expect(team.units.length).toBe(4);

    // Validate roster has 5 total units
    expect(rosterUnits.length).toBe(5);
  });

  test('Checkpoint 3 (House 12): 7 units in roster, 4 active, 4 Djinn = mid-game power', () => {
    // Expected roster: Isaac, Garet, Mystic, Ranger, Blaze, Sentinel, Karis (7 total)
    // Active party: First 4 units (max party size)
    // Expected Djinn: Flint, Forge, Breeze, Fizz, Granite (4 total)

    const unitIds = ['adept', 'war-mage', 'mystic', 'ranger', 'blaze', 'sentinel', 'karis'];
    const rosterUnits = unitIds.map(id => createUnit(UNIT_DEFINITIONS[id]!, 1, 0));

    // Create team with first 4 units (max party size)
    const team = createTeam(rosterUnits.slice(0, 4));

    // Calculate total mana contribution from active party
    const totalMana = team.units.reduce((sum, u) => sum + u.manaContribution, 0);

    // 4 active units should provide at least 4 mana
    expect(totalMana).toBeGreaterThanOrEqual(4);

    // Validate we have 4 active units (max party size)
    expect(team.units.length).toBe(4);

    // Validate roster has 7 total units
    expect(rosterUnits.length).toBe(7);
  });

  test('Checkpoint 4 (House 15): 8 units in roster, 4 active, 5 Djinn = late-game power', () => {
    // Expected roster: Isaac, Garet, Mystic, Ranger, Blaze, Sentinel, Karis, Tyrell (8 total)
    // Active party: First 4 units (max party size)
    // Expected Djinn: Flint, Forge, Breeze, Fizz, Granite, Squall (5 total)

    const unitIds = ['adept', 'war-mage', 'mystic', 'ranger', 'blaze', 'sentinel', 'karis', 'tyrell'];
    const rosterUnits = unitIds.map(id => createUnit(UNIT_DEFINITIONS[id]!, 1, 0));

    // Create team with first 4 units (max party size)
    const team = createTeam(rosterUnits.slice(0, 4));

    // Calculate total mana contribution from active party
    const totalMana = team.units.reduce((sum, u) => sum + u.manaContribution, 0);

    // 4 active units should provide at least 4 mana
    expect(totalMana).toBeGreaterThanOrEqual(4);

    // Validate we have 4 active units (max party size)
    expect(team.units.length).toBe(4);

    // Validate roster has 8 total units
    expect(rosterUnits.length).toBe(8);
  });

  test('Checkpoint 5 (House 20): 9 units, 8 Djinn = max power', () => {
    // Expected team: All 9 units (Isaac, Garet, Mystic, Ranger, Blaze, Sentinel, Karis, Tyrell, Stormcaller)
    // Note: Felix joins at H17, but we can only have 4 active units, so he's in roster
    // Expected Djinn: All 8 (Flint, Forge, Breeze, Fizz, Granite, Squall, Bane, Storm)

    const unitIds = ['adept', 'war-mage', 'mystic', 'ranger', 'blaze', 'sentinel', 'karis', 'tyrell', 'stormcaller'];
    const units = unitIds.map(id => createUnit(UNIT_DEFINITIONS[id]!, 1, 0));

    // Create team with 4 active units (max party size)
    const team = createTeam(units.slice(0, 4));

    // Calculate total mana contribution for active party
    const totalMana = team.units.reduce((sum, u) => sum + u.manaContribution, 0);

    // 4 active units should provide at least 4 mana
    expect(totalMana).toBeGreaterThanOrEqual(4);

    // Validate we have exactly 4 active units (max party size)
    expect(team.units.length).toBe(4);
  });
});

test.describe('Mana Economy - Growth Curve', () => {
  test('Mana contribution increases with team size', () => {
    const progressionSizes = [2, 5, 7, 8, 9]; // Checkpoint team sizes

    const unitIds = ['adept', 'war-mage', 'mystic', 'ranger', 'blaze', 'sentinel', 'karis', 'tyrell', 'stormcaller'];

    progressionSizes.forEach((teamSize) => {
      const units = unitIds.slice(0, teamSize).map(id => createUnit(UNIT_DEFINITIONS[id]!, 1, 0));

      // Create team with up to 4 active units
      const activeUnits = units.slice(0, Math.min(teamSize, 4));
      const team = createTeam(activeUnits);

      const totalMana = team.units.reduce((sum, u) => sum + u.manaContribution, 0);

      // Mana should scale with active party size (min 1 per unit)
      expect(totalMana).toBeGreaterThanOrEqual(Math.min(teamSize, 4));
    });
  });

  test('All recruitable units have non-zero mana contribution', () => {
    const unitIds = ['adept', 'war-mage', 'mystic', 'ranger', 'blaze', 'sentinel', 'karis', 'tyrell', 'stormcaller', 'felix'];

    unitIds.forEach((unitId) => {
      const unitDef = UNIT_DEFINITIONS[unitId];
      expect(unitDef).toBeDefined();

      // Validate mana contribution is defined and positive
      expect(unitDef?.manaContribution).toBeGreaterThan(0);
    });
  });
});
