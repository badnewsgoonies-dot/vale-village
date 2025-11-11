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

  test('should throw error if team does not have exactly 4 units', () => {
    const units = [createSampleUnit('unit1')];

    expect(() => createTeam(units)).toThrow('Team must have exactly 4 units');
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
});

