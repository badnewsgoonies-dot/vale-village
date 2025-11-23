import { describe, test, expect } from 'vitest';
import { createTeam, updateTeam } from '../../../src/core/models/Team';
import { createUnit } from '../../../src/core/models/Unit';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import { TeamSchema } from '../../../src/data/schemas/TeamSchema';

describe('Team Model', () => {
  const createSampleUnit = (id: string): ReturnType<typeof createUnit> => {
    const definition: UnitDefinition = {
      id,
      name: `Unit ${id}`,
      element: 'Venus',
      role: 'Balanced Warrior',
      baseStats: {
        hp: 100,
        pp: 20,
        atk: 10,
        def: 8,
        mag: 5,
        spd: 12,
      },
      growthRates: {
        hp: 20,
        pp: 5,
        atk: 3,
        def: 2,
        mag: 2,
        spd: 1,
      },
      abilities: [],
      manaContribution: 1,
      description: 'A test unit',
    };

    return createUnit(definition, 1, 0);
  };

  test('should create a team with 4 units', () => {
    const units = [
      createSampleUnit('unit1'),
      createSampleUnit('unit2'),
      createSampleUnit('unit3'),
      createSampleUnit('unit4'),
    ];

    const team = createTeam(units);

    expect(team.units).toHaveLength(4);
    expect(team.equippedDjinn).toEqual([]);
    expect(team.collectedDjinn).toEqual([]);
    expect(team.currentTurn).toBe(0);
  });

  test('should allow teams with 1-4 units', () => {
    // Teams with 1-4 units are now valid
    const unit1 = createSampleUnit('unit1');
    const team1 = createTeam([unit1]);
    expect(team1.units).toHaveLength(1);

    const team2 = createTeam([createSampleUnit('u1'), createSampleUnit('u2')]);
    expect(team2.units).toHaveLength(2);
  });

  test('should throw error if team has 0 or more than 4 units', () => {
    expect(() => createTeam([])).toThrow('Team must have between 1 and 4 units');

    const fiveUnits = [
      createSampleUnit('unit1'),
      createSampleUnit('unit2'),
      createSampleUnit('unit3'),
      createSampleUnit('unit4'),
      createSampleUnit('unit5'),
    ];
    expect(() => createTeam(fiveUnits)).toThrow('Team must have between 1 and 4 units');
  });

  test('should update team immutably', () => {
    const units = [
      createSampleUnit('unit1'),
      createSampleUnit('unit2'),
      createSampleUnit('unit3'),
      createSampleUnit('unit4'),
    ];

    const team = createTeam(units);
    const updated = updateTeam(team, { currentTurn: 5 });

    expect(team.currentTurn).toBe(0); // Original unchanged
    expect(updated.currentTurn).toBe(5); // New object updated
  });

  test('should validate team against schema', () => {
    const units = [
      createSampleUnit('unit1'),
      createSampleUnit('unit2'),
      createSampleUnit('unit3'),
      createSampleUnit('unit4'),
    ];

    const team = createTeam(units);
    const result = TeamSchema.safeParse(team);

    expect(result.success).toBe(true);
  });

  test('should reject duplicate Djinn when updating team', () => {
    const units = [
      createSampleUnit('unit1'),
      createSampleUnit('unit2'),
      createSampleUnit('unit3'),
      createSampleUnit('unit4'),
    ];

    const team = createTeam(units);

    expect(() => {
      updateTeam(team, { equippedDjinn: ['flint', 'flint', 'granite'] });
    }).toThrow('Cannot equip duplicate Djinn');
  });

  test('should reject more than 3 Djinn when updating team', () => {
    const units = [
      createSampleUnit('unit1'),
      createSampleUnit('unit2'),
      createSampleUnit('unit3'),
      createSampleUnit('unit4'),
    ];

    const team = createTeam(units);

    expect(() => {
      updateTeam(team, { equippedDjinn: ['flint', 'granite', 'bane', 'flash'] });
    }).toThrow('Cannot equip more than 3 Djinn');
  });

  test('should allow valid Djinn equipments', () => {
    const units = [
      createSampleUnit('unit1'),
      createSampleUnit('unit2'),
      createSampleUnit('unit3'),
      createSampleUnit('unit4'),
    ];

    const team = createTeam(units);
    const updated = updateTeam(team, { equippedDjinn: ['flint', 'granite', 'bane'] });

    expect(updated.equippedDjinn).toEqual(['flint', 'granite', 'bane']);
  });
});

