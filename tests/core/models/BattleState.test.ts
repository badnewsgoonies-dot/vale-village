import { describe, test, expect } from 'vitest';
import { createBattleState, updateBattleState } from '../../../src/core/models/BattleState';
import { createTeam } from '../../../src/core/models/Team';
import { createUnit } from '../../../src/core/models/Unit';
import type { UnitDefinition } from '../../../src/core/models/Unit';
import { BattleStateSchema } from '../../../src/data/schemas/BattleStateSchema';

describe('BattleState Model', () => {
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

  test('should create battle state', () => {
    const playerUnits = [
      createSampleUnit('player1'),
      createSampleUnit('player2'),
      createSampleUnit('player3'),
      createSampleUnit('player4'),
    ];

    const enemyUnits = [createSampleUnit('enemy1')];

    const team = createTeam(playerUnits);
    const battleState = createBattleState(team, enemyUnits);

    expect(battleState.playerTeam).toEqual(team);
    expect(battleState.enemies).toHaveLength(1);
    expect(battleState.currentTurn).toBe(0);
    expect(battleState.currentActorIndex).toBe(0);
    expect(battleState.status).toBe('ongoing');
    expect(battleState.log).toEqual([]);
  });

  test('should update battle state immutably', () => {
    const playerUnits = [
      createSampleUnit('player1'),
      createSampleUnit('player2'),
      createSampleUnit('player3'),
      createSampleUnit('player4'),
    ];

    const enemyUnits = [createSampleUnit('enemy1')];
    const team = createTeam(playerUnits);
    const battleState = createBattleState(team, enemyUnits);

    const updated = updateBattleState(battleState, {
      status: 'PLAYER_VICTORY',
      currentTurn: 5,
    });

    expect(battleState.status).toBe('ongoing'); // Original unchanged
    expect(updated.status).toBe('PLAYER_VICTORY'); // New object updated
    expect(updated.currentTurn).toBe(5);
  });

  test('should validate battle state against schema', () => {
    const playerUnits = [
      createSampleUnit('player1'),
      createSampleUnit('player2'),
      createSampleUnit('player3'),
      createSampleUnit('player4'),
    ];

    const enemyUnits = [createSampleUnit('enemy1')];
    const team = createTeam(playerUnits);
    const battleState = createBattleState(team, enemyUnits, ['player1', 'enemy1']);

    const result = BattleStateSchema.safeParse(battleState);
    expect(result.success).toBe(true);
  });
});

